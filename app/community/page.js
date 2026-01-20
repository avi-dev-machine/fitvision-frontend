'use client';

import { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Award, 
  Gift,
  Users,
  Trophy,
  Flame
} from 'lucide-react';
import styles from './community.module.css';

// Mock data
const mockPosts = [
  {
    id: 1,
    user: 'Arjun K.',
    avatar: 'A',
    time: '2h ago',
    content: 'Just completed 50 push-ups in one session! 💪 New personal best!',
    exercise: 'Push-ups',
    reps: 50,
    likes: 24,
    comments: 5,
    badge: 'Iron Will'
  },
  {
    id: 2,
    user: 'Priya S.',
    avatar: 'P',
    time: '4h ago',
    content: 'Day 30 of my fitness journey! Consistency is key 🔥',
    exercise: 'Squats',
    reps: 40,
    likes: 56,
    comments: 12,
    badge: '30 Day Streak'
  },
  {
    id: 3,
    user: 'Rahul M.',
    avatar: 'R',
    time: '6h ago',
    content: 'Looking for a training partner in Mumbai! Who\'s in?',
    likes: 18,
    comments: 8,
    isTrainTogether: true
  }
];

const mockBadges = [
  { id: 1, name: 'First Test', icon: Trophy, earned: true },
  { id: 2, name: '7 Day Streak', icon: Flame, earned: true },
  { id: 3, name: 'Iron Will', icon: Award, earned: false },
  { id: 4, name: 'Community Star', icon: Users, earned: false },
];

const mockCoupons = [
  { id: 1, brand: 'ProteinMax', discount: '20% OFF', code: 'PRATI20' },
  { id: 2, brand: 'GymWear', discount: '₹500 OFF', code: 'FIT500' },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Community</h1>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'feed' ? styles.active : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          Feed
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'badges' ? styles.active : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          Badges
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'rewards' ? styles.active : ''}`}
          onClick={() => setActiveTab('rewards')}
        >
          Rewards
        </button>
      </div>

      {/* Feed Tab */}
      {activeTab === 'feed' && (
        <div className={styles.feed}>
          {mockPosts.map(post => (
            <article key={post.id} className={styles.post}>
              <div className={styles.postHeader}>
                <div className={styles.avatar}>{post.avatar}</div>
                <div className={styles.postMeta}>
                  <span className={styles.userName}>{post.user}</span>
                  <span className={styles.postTime}>{post.time}</span>
                </div>
                {post.badge && (
                  <span className={styles.badgeTag}>
                    <Award size={12} />
                    {post.badge}
                  </span>
                )}
              </div>
              
              <p className={styles.postContent}>{post.content}</p>
              
              {post.exercise && (
                <div className={styles.achievementCard}>
                  <Flame size={18} className={styles.achievementIcon} />
                  <span>{post.reps} {post.exercise}</span>
                </div>
              )}
              
              {post.isTrainTogether && (
                <button className={styles.trainTogetherBtn}>
                  <Users size={16} />
                  Join Training
                </button>
              )}
              
              <div className={styles.postActions}>
                <button className={styles.actionBtn}>
                  <Heart size={18} />
                  <span>{post.likes}</span>
                </button>
                <button className={styles.actionBtn}>
                  <MessageCircle size={18} />
                  <span>{post.comments}</span>
                </button>
                <button className={styles.actionBtn}>
                  <Share2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div className={styles.badgesGrid}>
          {mockBadges.map(badge => {
            const Icon = badge.icon;
            return (
              <div 
                key={badge.id} 
                className={`${styles.badgeCard} ${!badge.earned ? styles.locked : ''}`}
              >
                <div className={styles.badgeIcon}>
                  <Icon size={28} />
                </div>
                <span className={styles.badgeName}>{badge.name}</span>
                {!badge.earned && <span className={styles.lockedLabel}>Locked</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className={styles.rewardsList}>
          {mockCoupons.map(coupon => (
            <div key={coupon.id} className={styles.couponCard}>
              <div className={styles.couponBrand}>
                <Gift size={20} />
                <span>{coupon.brand}</span>
              </div>
              <div className={styles.couponDetails}>
                <span className={styles.discount}>{coupon.discount}</span>
                <span className={styles.code}>Code: {coupon.code}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
