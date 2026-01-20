'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useExerciseSocket } from '@/hooks/useExerciseSocket';
import { getSessionInfo, getSessionMetrics, EXERCISES } from '@/lib/api';
import { 
  ArrowLeft, 
  Play, 
  Square, 
  Home,
  Dumbbell, 
  Footprints, 
  Activity, 
  Ruler, 
  Zap, 
  Sparkles, 
  ArrowUp, 
  MoveRight,
  Flame,
  Timer,
  TrendingUp
} from 'lucide-react';
import styles from './session.module.css';

// Icon mapping
const iconMap = {
  Dumbbell,
  Footprints,
  Activity,
  Ruler,
  Zap,
  Sparkles,
  ArrowUp,
  MoveRight,
};

// Progress Arc Component
function ProgressArc({ progress = 0, size = 140, strokeWidth = 5 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <svg className={styles.progressArc} width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--border-glass)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className={styles.progressCircle}
      />
    </svg>
  );
}

// Short feedback cues (≤3 words)
function getShortFeedback(feedback) {
  if (!feedback) return 'Ready';
  const lower = feedback.toLowerCase();
  
  if (lower.includes('good') || lower.includes('great')) return 'Great form';
  if (lower.includes('excellent') || lower.includes('perfect')) return 'Perfect';
  if (lower.includes('max') || lower.includes('peak')) return 'Max effort';
  if (lower.includes('lower') || lower.includes('down')) return 'Go lower';
  if (lower.includes('straight') || lower.includes('back')) return 'Keep straight';
  if (lower.includes('slow')) return 'Slow down';
  if (lower.includes('faster') || lower.includes('speed')) return 'Speed up';
  if (lower.includes('rest')) return 'Rest now';
  if (lower.includes('calibrat')) return 'Calibrating';
  if (lower.includes('wait')) return 'Hold steady';
  if (lower.includes('stand')) return 'Stand tall';
  
  const words = feedback.split(' ').slice(0, 3);
  return words.join(' ');
}

function getFeedbackType(feedback) {
  if (!feedback) return 'neutral';
  const lower = feedback.toLowerCase();
  if (lower.includes('good') || lower.includes('great') || lower.includes('max') || lower.includes('excellent') || lower.includes('perfect')) return 'success';
  if (lower.includes('fix') || lower.includes('lower') || lower.includes('straight') || lower.includes('slow') || lower.includes('keep')) return 'warning';
  return 'neutral';
}

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id;
  
  const videoRef = useRef(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [isEnded, setIsEnded] = useState(false);
  const [finalMetrics, setFinalMetrics] = useState(null);
  const [prevCounter, setPrevCounter] = useState(0);
  const [counterAnimating, setCounterAnimating] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  
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

  // Determine context mode
  const contextMode = useMemo(() => {
    if (isEnded) return 'review';
    if (isStreaming && metrics.frameData) return 'active';
    return 'rest';
  }, [isEnded, isStreaming, metrics.frameData]);

  // Animate counter on change
  useEffect(() => {
    if (metrics.counter !== prevCounter && metrics.counter > 0) {
      setCounterAnimating(true);
      setPrevCounter(metrics.counter);
      const timer = setTimeout(() => setCounterAnimating(false), 250);
      return () => clearTimeout(timer);
    }
  }, [metrics.counter, prevCounter]);

  // Get session info
  useEffect(() => {
    getSessionInfo(sessionId)
      .then(info => setSessionInfo(info))
      .catch(err => console.error('Failed to get session info:', err));
  }, [sessionId]);

  const exerciseInfo = sessionInfo 
    ? EXERCISES.find(e => e.id === sessionInfo.exercise) 
    : null;

  const ExerciseIcon = exerciseInfo ? iconMap[exerciseInfo.icon] : null;

  const handleStart = async () => {
    if (!isConnected) {
      connect();
      setSessionStartTime(Date.now());
    }
  };

  useEffect(() => {
    if (isConnected && !isStreaming && videoRef.current) {
      startStreaming(videoRef.current);
    }
  }, [isConnected, isStreaming, startStreaming]);

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

  const handleBack = () => {
    disconnect();
    router.push('/');
  };

  const sessionDuration = useMemo(() => {
    if (!sessionStartTime) return '0:00';
    const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [sessionStartTime, metrics.counter]);

  const arcProgress = useMemo(() => {
    if (!metrics.calibrationComplete) return metrics.calibrationProgress;
    if (metrics.stage === 'down' || metrics.stage === 'DOWN') return 50;
    if (metrics.stage === 'up' || metrics.stage === 'UP') return 100;
    return 0;
  }, [metrics.calibrationComplete, metrics.calibrationProgress, metrics.stage]);

  const shortFeedback = getShortFeedback(metrics.feedback);
  const feedbackType = getFeedbackType(metrics.feedback);

  return (
    <main className={styles.main} data-mode={contextMode}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className={styles.sessionInfo}>
          {exerciseInfo && (
            <>
              {ExerciseIcon && <ExerciseIcon size={20} className={styles.exerciseIcon} />}
              <span className={styles.exerciseName}>{exerciseInfo.name}</span>
            </>
          )}
        </div>
        <div className={styles.connectionStatus}>
          <span className={`${styles.statusDot} ${isConnected ? styles.connected : ''}`}></span>
          <span>{isConnected ? 'Live' : 'Offline'}</span>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Video Section */}
        <div className={styles.videoSection}>
          <div className={styles.videoContainer}>
            <video
              ref={videoRef}
              className={styles.videoHidden}
              autoPlay
              playsInline
              muted
            />
            
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
                    <Play size={48} className={styles.placeholderIcon} />
                    <p>Click Start to begin</p>
                  </div>
                )}
                {isConnected && !isStreaming && (
                  <div className={styles.placeholderContent}>
                    <div className={styles.spinner}></div>
                    <p>Initializing camera...</p>
                  </div>
                )}
              </div>
            )}

            {isStreaming && (
              <div className={styles.overlayStats}>
                <span className={styles.fpsCounter}>{metrics.fps} FPS</span>
                {!metrics.calibrationComplete && (
                  <span className={styles.calibrating}>
                    Calibrating {Math.round(metrics.calibrationProgress)}%
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
                    <Play size={18} />
                    Start Exercise
                  </button>
                ) : (
                  <button className="btn-secondary" onClick={handleStop}>
                    <Square size={18} />
                    End Session
                  </button>
                )}
              </>
            ) : (
              <button className="btn-primary" onClick={handleBack}>
                <Home size={18} />
                Back to Home
              </button>
            )}
          </div>
        </div>

        {/* Metrics Panel */}
        <div className={styles.metricsPanel}>
          {/* Primary Metric */}
          <div className={`${styles.primaryMetric} ${counterAnimating ? styles.valueChanged : ''}`}>
            <div className={styles.progressRing}>
              <ProgressArc progress={arcProgress} size={140} strokeWidth={4} />
              <div className={styles.primaryValue}>
                <span className={styles.counterNumber}>{metrics.counter}</span>
                <span className={styles.counterLabel}>REPS</span>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className={`${styles.feedbackIndicator} ${styles[feedbackType]}`}>
            <span className={styles.feedbackDot}></span>
            <span className={styles.feedbackText}>{shortFeedback}</span>
          </div>

          {/* Stat Badges */}
          <div className={styles.statsBadges}>
            <div className={styles.badge}>
              <span className={styles.badgeValue}>{metrics.stage || '-'}</span>
              <span className={styles.badgeLabel}>Stage</span>
            </div>
            <div className={styles.badge}>
              <span className={styles.badgeValue}>
                {metrics.calibrationComplete ? '✓' : `${Math.round(metrics.calibrationProgress)}%`}
              </span>
              <span className={styles.badgeLabel}>Cal</span>
            </div>
            {(metrics.maxHeightCm || metrics.maxDistanceCm || metrics.maxReachCm) && (
              <div className={styles.badge}>
                <span className={styles.badgeValue}>
                  {metrics.maxHeightCm || metrics.maxDistanceCm || metrics.maxReachCm}
                </span>
                <span className={styles.badgeLabel}>cm</span>
              </div>
            )}
          </div>

          {error && (
            <div className={styles.errorBanner}>
              {error}
            </div>
          )}

          {/* Review Summary */}
          {isEnded && (
            <div className={styles.sessionSummary}>
              <h3 className={styles.summaryTitle}>Session Complete</h3>
              
              <div className={styles.summaryCards}>
                <div className={styles.summaryCard}>
                  <Flame size={24} className={styles.summaryIcon} />
                  <span className={styles.summaryValue}>{metrics.counter}</span>
                  <span className={styles.summaryLabel}>Total Reps</span>
                </div>
                
                <div className={styles.summaryCard}>
                  <Timer size={24} className={styles.summaryIcon} />
                  <span className={styles.summaryValue}>{sessionDuration}</span>
                  <span className={styles.summaryLabel}>Duration</span>
                </div>

                {(metrics.maxHeightCm || metrics.maxDistanceCm || metrics.maxReachCm) && (
                  <div className={styles.summaryCard}>
                    <TrendingUp size={24} className={styles.summaryIcon} />
                    <span className={styles.summaryValue}>
                      {metrics.maxHeightCm || metrics.maxDistanceCm || metrics.maxReachCm}cm
                    </span>
                    <span className={styles.summaryLabel}>Best</span>
                  </div>
                )}
              </div>

              {finalMetrics && (
                <details className={styles.detailsExpand}>
                  <summary>View Raw Data</summary>
                  <pre className={styles.rawData}>{JSON.stringify(finalMetrics, null, 2)}</pre>
                </details>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
