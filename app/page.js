'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EXERCISES, createSession } from '@/lib/api';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [height, setHeight] = useState(170);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStart = async () => {
    if (!selectedExercise) {
      setError('Please select an exercise');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const session = await createSession(selectedExercise.id, height);
      router.push(`/session/${session.session_id}`);
    } catch (e) {
      setError(e.message);
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            <span className={styles.titleGlow}>FitVision</span> AI
          </h1>
          <p className={styles.subtitle}>
            Real-time exercise analysis powered by advanced pose detection
          </p>
        </div>
      </section>

      {/* Exercise Selection */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Select Your Exercise</h2>
        
        <div className={styles.exerciseGrid}>
          {EXERCISES.map((exercise) => (
            <button
              key={exercise.id}
              className={`${styles.exerciseCard} ${selectedExercise?.id === exercise.id ? styles.exerciseCardSelected : ''}`}
              onClick={() => setSelectedExercise(exercise)}
            >
              <span className={styles.exerciseIcon}>{exercise.icon}</span>
              <span className={styles.exerciseName}>{exercise.name}</span>
              <span className={styles.exerciseDesc}>{exercise.description}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Height Input */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Height</h2>
        <div className={styles.heightInput}>
          <input
            type="range"
            min="100"
            max="220"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className={styles.slider}
          />
          <div className={styles.heightDisplay}>
            <span className={styles.heightValue}>{height}</span>
            <span className={styles.heightUnit}>cm</span>
          </div>
        </div>
      </section>

      {/* Start Button */}
      <section className={styles.startSection}>
        {error && <p className={styles.error}>{error}</p>}
        
        <button
          className="btn-primary"
          onClick={handleStart}
          disabled={isLoading || !selectedExercise}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span>
              Starting...
            </>
          ) : (
            <>
              🚀 Start Workout
            </>
          )}
        </button>

        {selectedExercise && (
          <p className={styles.selectedInfo}>
            Ready to track: <strong>{selectedExercise.name}</strong>
          </p>
        )}
      </section>
    </main>
  );
}
