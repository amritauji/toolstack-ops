"use client";

import { Component } from 'react';
import * as Sentry from '@sentry/nextjs';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          background: '#f9fafb'
        }}>
          <div style={{
            maxWidth: '500px',
            textAlign: 'center',
            background: 'white',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: '#1f2937' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>
              We've been notified and are working on a fix. Please try refreshing the page.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 24px',
                  background: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  color: '#4f46e5',
                  border: '1px solid #4f46e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Go Home
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ marginTop: '24px', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: '#ef4444', fontWeight: '600' }}>
                  Error Details (Dev Only)
                </summary>
                <pre style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: '#fee2e2',
                  borderRadius: '6px',
                  fontSize: '12px',
                  overflow: 'auto',
                  color: '#991b1b'
                }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
