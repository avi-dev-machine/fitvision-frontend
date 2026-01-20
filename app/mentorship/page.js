'use client';

import { useState } from 'react';
import { 
  GraduationCap, 
  Target, 
  DollarSign, 
  Users, 
  Star,
  ChevronRight,
  Shield
} from 'lucide-react';
import styles from './mentorship.module.css';

const MOCK_MENTORS = [
  {
    id: 1,
    name: "Coach Rajesh",
    specialty: "Strength & Conditioning",
    experience: "12 years",
    athletes: 150,
    rating: 4.9,
    image: "R",
    tags: ["Powerlifting", "Nutrition"]
  },
  {
    id: 2,
    name: "Dr. Anita H.",
    specialty: "Sports Physiotherapy",
    experience: "8 years",
    athletes: 85,
    rating: 4.8,
    image: "A",
    tags: ["Recovery", "Injury Prevention"]
  }
];

const MOCK_CAMPAIGNS = [
  {
    id: 1,
    athlete: "Local Youth Team",
    goal: 50000,
    raised: 32500,
    title: "National Championship Kit Funding",
    daysLeft: 12
  },
  {
    id: 2,
    athlete: "Sarah K.",
    goal: 15000,
    raised: 4500,
    title: "Travel Expenses for State Finals",
    daysLeft: 5
  }
];

export default function MentorshipPage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Mentorship & Support</h1>
        <p className={styles.subtitle}>Connect with pros • Support athletes</p>
      </header>

      {/* Hero Card */}
      <section className={styles.heroCard}>
        <div className={styles.heroContent}>
          <Shield size={32} className={styles.heroIcon} />
          <h2>Become a Pro Athlete</h2>
          <p>Get personalized guidance from certified mentors</p>
          <button className={styles.ctaBtn}>Find a Mentor</button>
        </div>
      </section>

      {/* Featured Mentors */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Top Mentors</h2>
          <button className={styles.viewAllBtn}>View All <ChevronRight size={14} /></button>
        </div>

        <div className={styles.mentorsGrid}>
          {MOCK_MENTORS.map(mentor => (
            <div key={mentor.id} className={styles.mentorCard}>
              <div className={styles.mentorHeader}>
                <div className={styles.mentorAvatar}>{mentor.image}</div>
                <div>
                  <h3 className={styles.mentorName}>{mentor.name}</h3>
                  <span className={styles.mentorSpec}>{mentor.specialty}</span>
                </div>
                <div className={styles.rating}>
                  <Star size={12} fill="currentColor" />
                  <span>{mentor.rating}</span>
                </div>
              </div>
              
              <div className={styles.mentorStats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{mentor.experience}</span>
                  <span className={styles.statLabel}>Exp</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{mentor.athletes}+</span>
                  <span className={styles.statLabel}>Athletes</span>
                </div>
              </div>

              <div className={styles.tags}>
                {mentor.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>

              <button className={styles.connectBtn}>Connect</button>
            </div>
          ))}
        </div>
      </section>

      {/* Crowdfunding */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Support Athletes</h2>
          <span className={styles.badge}>Crowdfunding</span>
        </div>

        <div className={styles.campaignList}>
          {MOCK_CAMPAIGNS.map(campaign => {
            const progress = (campaign.raised / campaign.goal) * 100;
            return (
              <div key={campaign.id} className={styles.campaignCard}>
                <div className={styles.campaignHeader}>
                  <Target size={20} className={styles.campaignIcon} />
                  <div>
                    <h3 className={styles.campaignTitle}>{campaign.title}</h3>
                    <span className={styles.athleteName}>by {campaign.athlete}</span>
                  </div>
                </div>

                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                  </div>
                  <div className={styles.progressStats}>
                    <span className={styles.raised}>
                      ₹{campaign.raised.toLocaleString()} <span className={styles.goal}>raised of ₹{campaign.goal.toLocaleString()}</span>
                    </span>
                    <span className={styles.daysLeft}>{campaign.daysLeft} days left</span>
                  </div>
                </div>

                <button className={styles.supportBtn}>
                  <DollarSign size={16} /> Support Campaign
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
