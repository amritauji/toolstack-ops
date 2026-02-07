'use client';

export default function Loading() {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}>
        <div style={styles.spinnerInner}></div>
      </div>
      <p style={styles.text}>Loading...</p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
  },
  spinner: {
    width: '64px',
    height: '64px',
    marginBottom: '24px'
  },
  spinnerInner: {
    width: '100%',
    height: '100%',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  text: {
    fontSize: '16px',
    color: '#64748b',
    fontWeight: 500
  }
};
