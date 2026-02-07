"use client";

import { useEffect, useState } from 'react';
import { PLAN_LIMITS, getUsagePercentage, isApproachingLimit } from '@/lib/planLimits';

export default function UsageDashboard({ usage, plan = 'free' }) {
  const limits = PLAN_LIMITS[plan];
  
  const getProgressColor = (percentage) => {
    if (percentage >= 90) return '#ef4444'; // red
    if (percentage >= 80) return '#f59e0b'; // orange
    return '#10b981'; // green
  };

  const UsageBar = ({ label, current, limit, type }) => {
    const percentage = getUsagePercentage(plan, type, current);
    const isUnlimited = limit === -1;
    const approaching = isApproachingLimit(plan, type, current);
    const color = getProgressColor(percentage);

    return (
      <div style={styles.usageItem}>
        <div style={styles.usageHeader}>
          <span style={styles.usageLabel}>{label}</span>
          <span style={styles.usageValue}>
            {current} {isUnlimited ? '' : `/ ${limit}`}
            {isUnlimited && <span style={styles.unlimited}>Unlimited</span>}
          </span>
        </div>
        {!isUnlimited && (
          <>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${percentage}%`,
                  background: color
                }}
              />
            </div>
            {approaching && (
              <div style={styles.warning}>
                <svg style={styles.warningIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span style={styles.warningText}>Approaching limit</span>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Usage & Limits</h3>
        <div style={styles.planBadge}>
          <span style={styles.planName}>{limits.name} Plan</span>
        </div>
      </div>

      <div style={styles.usageList}>
        <UsageBar 
          label="Team Members" 
          current={usage.users} 
          limit={limits.maxUsers}
          type="users"
        />
        <UsageBar 
          label="Tasks" 
          current={usage.tasks} 
          limit={limits.maxTasks}
          type="tasks"
        />
        <UsageBar 
          label="Storage" 
          current={usage.storage} 
          limit={limits.maxStorage}
          type="storage"
        />
      </div>

      {plan === 'free' && (
        <div style={styles.upgradePrompt}>
          <p style={styles.upgradeText}>
            Need more? Upgrade to unlock unlimited tasks and more features.
          </p>
          <a href="/pricing" style={styles.upgradeButton}>
            View Plans
          </a>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#0f172a'
  },
  planBadge: {
    padding: '6px 12px',
    background: 'linear-gradient(135deg, #faf5ff, #fdf2f8)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    borderRadius: '8px'
  },
  planName: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#a855f7',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  usageList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  usageItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  usageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  usageLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#475569'
  },
  usageValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  unlimited: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#10b981',
    padding: '2px 8px',
    background: '#f0fdf4',
    borderRadius: '4px'
  },
  progressBar: {
    height: '8px',
    background: '#f1f5f9',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease, background 0.3s ease',
    borderRadius: '4px'
  },
  warning: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '4px'
  },
  warningIcon: {
    width: '16px',
    height: '16px',
    color: '#f59e0b'
  },
  warningText: {
    fontSize: '12px',
    color: '#f59e0b',
    fontWeight: 500
  },
  upgradePrompt: {
    marginTop: '24px',
    padding: '16px',
    background: 'linear-gradient(135deg, #faf5ff, #fdf2f8)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    borderRadius: '8px',
    textAlign: 'center'
  },
  upgradeText: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '12px'
  },
  upgradeButton: {
    display: 'inline-block',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    color: 'white',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
    transition: 'all 0.2s'
  }
};
