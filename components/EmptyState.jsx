export default function EmptyState({ icon = "📭", title, description, action }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      textAlign: 'center',
      color: '#6b7280'
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontSize: 20, fontWeight: 600, color: '#1f2937', marginBottom: 8 }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, marginBottom: 24, maxWidth: 400 }}>
        {description}
      </p>
      {action}
    </div>
  );
}
