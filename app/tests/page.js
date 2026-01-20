'use client';

import { useRouter } from 'next/navigation';
import { EXERCISES, createSession } from '@/lib/api';
import { 
  Dumbbell, 
  Footprints, 
  Activity, 
  Ruler, 
  Zap, 
  Sparkles, 
  ArrowUp, 
  MoveRight,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import styles from './tests.module.css';

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

export default function TestsPage() {
  const router = useRouter();

  const handleStartTest = async (exerciseId) => {
    try {
      const session = await createSession(exerciseId, 170);
      router.push(`/session/${session.session_id}`);
    } catch (e) {
      console.error('Failed to create session:', e);
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/')}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <h1 className={styles.title}>Choose Test</h1>
        <div style={{ width: 80 }} />
      </header>

      <div className={styles.exerciseList}>
        {EXERCISES.map((exercise) => {
          const Icon = iconMap[exercise.icon];
          return (
            <button
              key={exercise.id}
              className={styles.exerciseCard}
              onClick={() => handleStartTest(exercise.id)}
            >
              <div className={styles.exerciseIcon}>
                {Icon && <Icon size={24} />}
              </div>
              <div className={styles.exerciseInfo}>
                <span className={styles.exerciseName}>{exercise.name}</span>
                <span className={styles.exerciseDesc}>{exercise.description}</span>
              </div>
              <ChevronRight size={20} className={styles.arrow} />
            </button>
          );
        })}
      </div>
    </main>
  );
}
