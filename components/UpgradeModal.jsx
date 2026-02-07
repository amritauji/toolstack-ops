"use client";

import { useState } from 'react';

export default function UpgradeModal({ isOpen, onClose, reason, currentPlan = 'free' }) {
  if (!isOpen) return null;

  const getUpgradeMessage = () => {
    switch (reason) {
      case 'user_limit':
        return {
          title: 'User Limit Reached',
          message: 'You\'ve reached the maximum number of users for your plan.',
          feature: 'Add more team members'
        };
      case 'task_limit':
        return {
          title: 'Task Limit Reached',
          message: 'You\'ve reached the 50 task limit on the Free plan.',
          feature: 'Create unlimited tasks'
        };
      case 'storage_limit':
        return {
          title: 'Storage Limit Reached',
          message: 'You\'ve used all available storage for your plan.',
          feature: 'Get more storage space'
        };
      case 'attachments':
        return {
          title: 'Feature Not Available',
          message: 'File attachments are not available on the Free plan.',
          feature: 'Upload files and attachments'
        };
      case 'analytics':
        return {
          title: 'Feature Not Available',
          message: 'Advanced analytics are available on Professional plan.',
          feature: 'Access advanced analytics'
        };
      case 'api':
        return {
          title: 'Feature Not Available',
          message: 'API access is available on Professional plan.',
          feature: 'Use our REST API'
        };
      default:
        return {
          title: 'Upgrade Required',
          message: 'This feature requires a higher plan.',
          feature: 'Unlock premium features'
        };
    }
  };

  const { title, message, feature } = getUpgradeMessage();

  const recommendedPlan = currentPlan === 'free' ? 'starter' : 'professional';
  const planName = recommendedPlan === 'starter' ? 'Starter' : 'Professional';
  const planPrice = recommendedPlan === 'starter' ? '$12' : '$25';

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Icon */}
        <div style={styles.iconContainer}>
          <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        {/* Content */}
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.message}>{message}</p>

        {/* Feature Highlight */}
        <div style={styles.featureBox}>
          <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span style={styles.featureText}>{feature}</span>
        </div>

        {/* Plan Recommendation */}
        <div style={styles.planCard}>
          <div style={styles.planHeader}>
            <span style={styles.planName}>{planName} Plan</span>
            <span style={styles.planPrice}>{planPrice}<span style={styles.perMonth}>/month</span></span>
          </div>
          <ul style={styles.planFeatures}>
            {recommendedPlan === 'starter' ? (
              <>
                <li style={styles.planFeature}>Up to 10 users</li>
                <li style={styles.planFeature}>Unlimited tasks</li>
                <li style={styles.planFeature}>File attachments</li>
                <li style={styles.planFeature}>Email support</li>
              </>
            ) : (
              <>
                <li style={styles.planFeature}>Up to 50 users</li>
                <li style={styles.planFeature}>Advanced analytics</li>
                <li style={styles.planFeature}>API access</li>
                <li style={styles.planFeature}>Priority support</li>
              </>
            )}
          </ul>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button onClick={onClose} style={styles.cancelButton}>
            Maybe Later
          </button>
          <a href="/pricing" style={styles.upgradeButton}>
            View Plans
          </a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px'
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  },
  iconContainer: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px'
  },
  icon: {
    width: '32px',
    height: '32px',
    color: 'white'
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: '12px'
  },
  message: {
    fontSize: '16px',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: '24px',
    lineHeight: 1.6
  },
  featureBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  checkIcon: {
    width: '24px',
    height: '24px',
    color: '#16a34a',
    flexShrink: 0
  },
  featureText: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#166534'
  },
  planCard: {
    border: '2px solid #a855f7',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    background: 'linear-gradient(135deg, #faf5ff, #fdf2f8)'
  },
  planHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(168, 85, 247, 0.2)'
  },
  planName: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#0f172a'
  },
  planPrice: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#a855f7'
  },
  perMonth: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#64748b'
  },
  planFeatures: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  planFeature: {
    fontSize: '14px',
    color: '#475569',
    paddingLeft: '24px',
    position: 'relative',
    '::before': {
      content: '"✓"',
      position: 'absolute',
      left: 0,
      color: '#a855f7',
      fontWeight: 700
    }
  },
  actions: {
    display: 'flex',
    gap: '12px'
  },
  cancelButton: {
    flex: 1,
    padding: '12px 24px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    background: 'white',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  upgradeButton: {
    flex: 1,
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
    transition: 'all 0.2s'
  }
};
