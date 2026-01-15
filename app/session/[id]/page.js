'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useExerciseSocket } from '@/hooks/useExerciseSocket';
import { getSessionInfo, getSessionMetrics, EXERCISES } from '@/lib/api';
import styles from './session.module.css';

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id;
  
  const videoRef = useRef(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [isEnded, setIsEnded] = useState(false);
  const [finalMetrics, setFinalMetrics] = useState(null);
  
  const {
    isConnected,
    isStreaming,
    metrics,
    error,
    connect,
    disconnect,
    startStreaming,
    stopStreaming,
  } = useExerciseSocket(sessionId);

  // Get session info and exercise details
  useEffect(() => {
    getSessionInfo(sessionId)
      .then(info => {
        setSessionInfo(info);
      })
      .catch(err => {
        console.error('Failed to get session info:', err);
      });
  }, [sessionId]);

  const exerciseInfo = sessionInfo 
    ? EXERCISES.find(e => e.id === sessionInfo.exercise) 
    : null;

  // Handle start
  const handleStart = async () => {
    if (!isConnected) {
      connect();
    }
  };

  // Start streaming when connected
  useEffect(() => {
    if (isConnected && !isStreaming && videoRef.current) {
      startStreaming(videoRef.current);
    }
  }, [isConnected, isStreaming, startStreaming]);

  // Handle stop
  const handleStop = async () => {
    stopStreaming();
    disconnect();
    setIsEnded(true);
    
    try {
      const result = await getSessionMetrics(sessionId);
      setFinalMetrics(result.metrics);
    } catch (e) {
      console.error('Failed to get metrics:', e);
    }
  };

  // Back to home
  const handleBack = () => {
    disconnect();
    router.push('/');
  };

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>
          ← Back
        </button>
        <div className={styles.sessionInfo}>
          {exerciseInfo && (
            <>
              <span className={styles.exerciseIcon}>{exerciseInfo.icon}</span>
              <span className={styles.exerciseName}>{exerciseInfo.name}</span>
            </>
          )}
        </div>
        <div className={styles.connectionStatus}>
          <span className={`${styles.statusDot} ${isConnected ? styles.connected : ''}`}></span>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Video Section */}
        <div className={styles.videoSection}>
          <div className={styles.videoContainer}>
            {/* Local video (hidden or picture-in-picture) */}
            <video
              ref={videoRef}
              className={styles.videoHidden}
              autoPlay
              playsInline
              muted
            />
            
            {/* Processed frame from server */}
            {metrics.frameData ? (
              <img
                src={`data:image/jpeg;base64,${metrics.frameData}`}
                alt="Processed frame"
                className={styles.processedFrame}
              />
            ) : (
              <div className={styles.videoPlaceholder}>
                {!isConnected && !isEnded && (
                  <div className={styles.placeholderContent}>
                    <span className={styles.cameraIcon}>📹</span>
                    <p>Click Start to enable camera</p>
                  </div>
                )}
                {isConnected && !isStreaming && (
                  <div className={styles.placeholderContent}>
                    <span className={styles.spinner}></span>
                    <p>Initializing camera...</p>
                  </div>
                )}
              </div>
            )}

            {/* Overlay Stats */}
            {isStreaming && (
              <div className={styles.overlayStats}>
                <span className={styles.fpsCounter}>{metrics.fps} FPS</span>
                {!metrics.calibrationComplete && (
                  <span className={styles.calibrating}>
                    Calibrating... {Math.round(metrics.calibrationProgress)}%
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            {!isEnded ? (
              <>
                {!isConnected ? (
                  <button className="btn-primary" onClick={handleStart}>
                    🎬 Start Exercise
                  </button>
                ) : (
                  <button className="btn-secondary" onClick={handleStop}>
                    ⏹️ Stop & Get Results
                  </button>
                )}
              </>
            ) : (
              <button className="btn-primary" onClick={handleBack}>
                🏠 Back to Home
              </button>
            )}
          </div>
        </div>

        {/* Metrics Panel */}
        <div className={styles.metricsPanel}>
          {/* Primary Stat */}
          <div className={`${styles.statCard} ${styles.primaryStat}`}>
            <div className={styles.statValue}>{metrics.counter}</div>
            <div className={styles.statLabel}>Reps / Count</div>
          </div>

          {/* Secondary Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValueSmall}>{metrics.stage}</div>
              <div className={styles.statLabel}>Stage</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statValueSmall}>
                {metrics.calibrationComplete ? '✓' : `${Math.round(metrics.calibrationProgress)}%`}
              </div>
              <div className={styles.statLabel}>Calibration</div>
            </div>
          </div>

          {/* Feedback Banner */}
          <div className={`${styles.feedbackBanner} ${styles[getFeedbackType(metrics.feedback)]}`}>
            <span className={styles.feedbackText}>{metrics.feedback}</span>
          </div>

          {/* Exercise-specific metrics */}
          {(metrics.maxHeightCm || metrics.maxDistanceCm || metrics.maxReachCm) && (
            <div className={styles.statCard}>
              <div className={styles.statValueSmall}>
                {metrics.maxHeightCm || metrics.maxDistanceCm || metrics.maxReachCm} cm
              </div>
              <div className={styles.statLabel}>
                {metrics.maxHeightCm ? 'Max Height' : 
                 metrics.maxDistanceCm ? 'Max Distance' : 'Max Reach'}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className={styles.errorBanner}>
              ⚠️ {error}
            </div>
          )}

          {/* Final Metrics (after stop) */}
          {isEnded && finalMetrics && (
            <div className={styles.finalMetrics}>
              <h3 className={styles.finalTitle}>Session Complete! 🎉</h3>
              <div className={styles.metricsJson}>
                <pre>{JSON.stringify(finalMetrics, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function getFeedbackType(feedback) {
  if (!feedback) return 'neutral';
  const lower = feedback.toLowerCase();
  if (lower.includes('good') || lower.includes('great') || lower.includes('max')) return 'success';
  if (lower.includes('fix') || lower.includes('lower') || lower.includes('straight')) return 'warning';
  return 'neutral';
}
