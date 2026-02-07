"use client";

import { useRouter, usePathname } from 'next/navigation';

export default function DashboardHeader({ profile }) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    ...(profile?.role === 'admin' || profile?.role === 'developer' ? [{ label: 'Admin', path: '/analytics' }] : []),
    { label: 'Profile', path: '/profile' },
    ...(profile?.role === 'developer' ? [{ label: 'Developer', path: '/developer' }] : [])
  ];

  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.title}>ToolStack Ops</h1>
        <div style={styles.tabs}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              style={pathname === item.path ? styles.tabActive : styles.tab}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingBottom: 16,
    borderBottom: '1px solid #f3f4f6',
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 12,
  },
  tabs: {
    display: 'flex',
    gap: 0,
    background: '#f9fafb',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    background: 'transparent',
    border: 'none',
    color: '#6b7280',
    fontSize: 14,
    fontWeight: 500,
    padding: '8px 16px',
    borderRadius: 6,
    cursor: 'pointer',
  },
  tabActive: {
    background: '#ffffff',
    border: 'none',
    color: '#111827',
    fontSize: 14,
    fontWeight: 500,
    padding: '8px 16px',
    borderRadius: 6,
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  }
};