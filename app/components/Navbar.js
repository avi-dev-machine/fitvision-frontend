'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Apple, GraduationCap } from 'lucide-react';
import styles from './Navbar.module.css';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/community', icon: Users, label: 'Community' },
  { href: '/diet', icon: Apple, label: 'Diet' },
  { href: '/mentorship', icon: GraduationCap, label: 'Mentors' },
];

export default function Navbar() {
  const pathname = usePathname();

  // Hide navbar on session pages
  if (pathname.startsWith('/session')) {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
