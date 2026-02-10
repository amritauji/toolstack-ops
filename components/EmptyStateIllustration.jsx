"use client";

export default function EmptyStateIllustration({ type = "tasks" }) {
  const illustrations = {
    tasks: {
      title: "No tasks yet",
      description: "Create your first task to get started with your project",
      icon: (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="50" fill="#f0f4ff" />
          <path d="M40 60h40M60 40v40" stroke="#7c6df2" strokeWidth="4" strokeLinecap="round" />
          <circle cx="60" cy="60" r="35" stroke="#7c6df2" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      ),
      action: "Create your first task"
    },
    todo: {
      title: "Nothing to do",
      description: "All caught up! Create a new task or move items here",
      icon: (
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <rect x="20" y="20" width="60" height="60" rx="8" fill="#f0f4ff" stroke="#7c6df2" strokeWidth="2" />
          <path d="M35 50h30M35 60h20" stroke="#7c6df2" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    in_progress: {
      title: "Nothing in progress",
      description: "Move tasks here when you start working on them",
      icon: (
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="30" fill="#fffbeb" stroke="#f59e0b" strokeWidth="2" />
          <path d="M50 35v15l10 10" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    done: {
      title: "No completed tasks",
      description: "Completed tasks will appear here",
      icon: (
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="30" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
          <path d="M35 50l10 10 20-20" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    search: {
      title: "No results found",
      description: "Try adjusting your search or filters",
      icon: (
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <circle cx="45" cy="45" r="20" stroke="#94a3b8" strokeWidth="2" />
          <path d="M60 60l15 15" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <path d="M40 45h10M45 40v10" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    }
  };

  const config = illustrations[type] || illustrations.tasks;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '24px' }}>
        {config.icon}
      </div>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: '8px'
      }}>
        {config.title}
      </h3>
      <p style={{
        fontSize: '14px',
        color: '#64748b',
        marginBottom: '24px',
        maxWidth: '300px'
      }}>
        {config.description}
      </p>
      {config.action && (
        <button style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(124, 109, 242, 0.25)'
        }}>
          {config.action}
        </button>
      )}
    </div>
  );
}
