export default function DashboardHeader({ profile }) {
  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.title}>MindMap AI</h1>
        <div style={styles.tabs}>
          <button style={styles.tabActive}>Board</button>
          <button style={styles.tab}>Table</button>
          <button style={styles.tab}>Timeline</button>
        </div>
      </div>
      <div style={styles.userSection}>
        <span style={styles.userName}>{profile?.full_name || 'User'}</span>
        <button style={styles.newTaskBtn}>+ New task</button>
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
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  userName: {
    fontSize: 14,
    color: '#6b7280',
  },
  newTaskBtn: {
    background: '#111827',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
};