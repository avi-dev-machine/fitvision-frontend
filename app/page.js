'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  TrendingUp, 
  Clock, 
  Flame,
  ChevronRight,
  Trophy,
  Activity
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import styles from './page.module.css';

// Mock progress data
const progressData = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 72 },
  { day: 'Wed', score: 68 },
  { day: 'Thu', score: 85 },
  { day: 'Fri', score: 82 },
  { day: 'Sat', score: 90 },
  { day: 'Sun', score: 88 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.chartTooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <p className={styles.tooltipValue}>Score: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// Mock last test data (would come from localStorage or API)
const getLastTestData = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('lastTest');
    if (saved) return JSON.parse(saved);
  }
  return {
    exercise: 'Push-ups',
    reps: 24,
    duration: '2:45',
    date: 'Today',
    improvement: '+12%'
  };
};

export default function Dashboard() {
  const [lastTest, setLastTest] = useState(null);

  useEffect(() => {
    setLastTest(getLastTestData());
  }, []);

  return (
    <main className={styles.main}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            <span className={styles.titleAnimated}>Pratidwandhi</span>
          </h1>
          <p className={styles.subtitle}>
            Your fitness journey starts here
          </p>
        </div>
      </section>

      {/* Progress Graph */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Weekly Activity</h2>
          <span className={styles.dateLabel}>Last 7 Days</span>
        </div>
        <div className={styles.chartCard}>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4d00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff4d00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 10 }} 
                  dy={10}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ff4d00', strokeWidth: 1 }} />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#ff4d00" 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Last Test Metrics */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Last Performance</h2>
          {lastTest && <span className={styles.dateLabel}>{lastTest.date}</span>}
        </div>
        
        {lastTest ? (
          <div className={styles.metricsCard}>
            <div className={styles.exerciseBadge}>
              <Trophy size={16} />
              <span>{lastTest.exercise}</span>
            </div>
            
            <div className={styles.metricsGrid}>
              <div className={styles.metric}>
                <Flame size={20} className={styles.metricIcon} />
                <span className={styles.metricValue}>{lastTest.reps}</span>
                <span className={styles.metricLabel}>Reps</span>
              </div>
              <div className={styles.metric}>
                <Clock size={20} className={styles.metricIcon} />
                <span className={styles.metricValue}>{lastTest.duration}</span>
                <span className={styles.metricLabel}>Duration</span>
              </div>
              <div className={styles.metric}>
                <TrendingUp size={20} className={styles.metricIcon} />
                <span className={styles.metricValueGreen}>{lastTest.improvement}</span>
                <span className={styles.metricLabel}>Progress</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.emptyCard}>
            <p>No tests taken yet</p>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        
        <Link href="/tests" className={styles.actionCard}>
          <div className={styles.actionContent}>
            <Play size={24} className={styles.actionIcon} />
            <div>
              <span className={styles.actionTitle}>Take New Test</span>
              <span className={styles.actionDesc}>Choose from 8 exercises</span>
            </div>
          </div>
          <ChevronRight size={20} className={styles.actionArrow} />
        </Link>
      </section>

      {/* Stats Overview */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Stats</h2>
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>12</span>
            <span className={styles.statLabel}>Tests Taken</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>5</span>
            <span className={styles.statLabel}>Badges</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>3</span>
            <span className={styles.statLabel}>Day Streak</span>
          </div>
        </div>
      </section>
    </main>
  );
}
