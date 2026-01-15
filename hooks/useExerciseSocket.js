'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getWebSocketUrl } from '@/lib/api';

/**
 * Custom hook for WebSocket exercise streaming
 * Optimized for performance with frame throttling
 */
export function useExerciseSocket(sessionId, options = {}) {
  const { autoConnect = false, onMessage, onError } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const frameLoopRef = useRef(null);
  
  // Metrics state
  const [metrics, setMetrics] = useState({
    counter: 0,
    stage: '-',
    feedback: 'Waiting...',
    calibrationProgress: 0,
    calibrationComplete: false,
    fps: 0,
    frameData: null,
  });
  
  const fpsCounterRef = useRef({ count: 0, lastTime: Date.now() });

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!sessionId) {
      console.error('No session ID provided');
      setError('No session ID');
      return;
    }
    
    if (wsRef.current) {
      console.log('WebSocket already exists, skipping connect');
      return;
    }
    
    const wsUrl = getWebSocketUrl(sessionId);
    console.log('🔗 Connecting to WebSocket:', wsUrl);
    
    setError(null);
    
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected successfully!');
        setIsConnected(true);
        setError(null);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          
          if (data.type === 'connected') {
            console.log('Session connected:', data);
            return;
          }
          
          if (data.type === 'keepalive') return;
          
          if (data.error) {
            setError(data.error);
            return;
          }
          
          // Update FPS counter
          fpsCounterRef.current.count++;
          const now = Date.now();
          if (now - fpsCounterRef.current.lastTime >= 1000) {
            setMetrics(m => ({ ...m, fps: fpsCounterRef.current.count }));
            fpsCounterRef.current.count = 0;
            fpsCounterRef.current.lastTime = now;
          }
          
          // Update metrics
          setMetrics(m => ({
            ...m,
            counter: data.counter ?? m.counter,
            stage: data.stage ?? m.stage,
            feedback: data.feedback ?? m.feedback,
            calibrationProgress: data.calibration_progress ?? m.calibrationProgress,
            calibrationComplete: data.calibration_complete ?? m.calibrationComplete,
            frameData: data.frame ?? m.frameData,
            ...(data.max_reach_cm !== undefined && { maxReachCm: data.max_reach_cm }),
            ...(data.max_height_cm !== undefined && { maxHeightCm: data.max_height_cm }),
            ...(data.max_distance_cm !== undefined && { maxDistanceCm: data.max_distance_cm }),
            ...(data.jump_count !== undefined && { jumpCount: data.jump_count }),
            ...(data.rep_count !== undefined && { repCount: data.rep_count }),
          }));
          
          onMessage?.(data);
        } catch (e) {
          console.error('Error parsing message:', e);
        }
      };
      
      ws.onclose = (event) => {
        console.log('❌ WebSocket disconnected. Code:', event.code);
        setIsConnected(false);
        setIsStreaming(false);
        wsRef.current = null;
        
        if (event.code === 1006) {
          setError('Connection failed - check if backend is running');
        }
      };
      
      ws.onerror = (e) => {
        console.error('❌ WebSocket error:', e);
      };
      
      wsRef.current = ws;
    } catch (e) {
      console.error('Failed to create WebSocket:', e);
      setError(`Failed to connect: ${e.message}`);
    }
  }, [sessionId, onMessage, onError]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (frameLoopRef.current) {
      cancelAnimationFrame(frameLoopRef.current);
      frameLoopRef.current = null;
    }
    
    if (wsRef.current) {
      try {
        wsRef.current.send(JSON.stringify({ type: 'stop' }));
      } catch (e) {}
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsConnected(false);
    setIsStreaming(false);
  }, []);

  // Start camera and streaming - OPTIMIZED for performance
  const startStreaming = useCallback(async (videoElement) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError('WebSocket not connected');
      return;
    }
    
    try {
      // Lower resolution = faster processing
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 480 }, 
          height: { ideal: 360 }, 
          facingMode: 'user',
          frameRate: { ideal: 30 }
        }
      });
      
      streamRef.current = stream;
      
      if (videoElement) {
        videoElement.srcObject = stream;
        videoRef.current = videoElement;
      }
      
      // Canvas for frame capture
      const canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 360;
      canvasRef.current = canvas;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      setIsStreaming(true);
      
      // Frame throttling for ~15 FPS (reduces CPU/network load significantly)
      let lastFrameTime = 0;
      const frameInterval = 66; // ~15 FPS
      
      const sendFrame = (timestamp) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          setIsStreaming(false);
          return;
        }
        
        // Only send frame if enough time passed
        if (timestamp - lastFrameTime >= frameInterval) {
          lastFrameTime = timestamp;
          
          if (videoRef.current && videoRef.current.readyState >= 2) {
            ctx.drawImage(videoRef.current, 0, 0, 480, 360);
            // 50% quality JPEG for faster transfer
            canvas.toBlob((blob) => {
              if (blob && wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(blob);
              }
            }, 'image/jpeg', 0.5);
          }
        }
        
        frameLoopRef.current = requestAnimationFrame(sendFrame);
      };
      
      // Wait for video ready
      videoElement.onloadedmetadata = () => {
        videoElement.play();
        requestAnimationFrame(sendFrame);
      };
      
    } catch (e) {
      setError(`Camera error: ${e.message}`);
      console.error('Failed to start camera:', e);
    }
  }, []);

  // Stop streaming
  const stopStreaming = useCallback(() => {
    if (frameLoopRef.current) {
      cancelAnimationFrame(frameLoopRef.current);
      frameLoopRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsStreaming(false);
  }, []);

  // Auto-connect if enabled
  useEffect(() => {
    if (autoConnect && sessionId) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [autoConnect, sessionId, connect, disconnect]);

  return {
    isConnected,
    isStreaming,
    metrics,
    error,
    lastMessage,
    connect,
    disconnect,
    startStreaming,
    stopStreaming,
  };
}
