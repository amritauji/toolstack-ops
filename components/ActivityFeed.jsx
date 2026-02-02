import Avatar from "@/components/Avatar";

export default function ActivityFeed({ items }) {
  return (
    <div>
      <h3 style={{ 
        fontSize: 18, 
        fontWeight: 600, 
        marginBottom: 20,
        color: "#1f2937",
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
        📊 Recent Activity
      </h3>
      
      {items.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: 40,
          color: "#9ca3af",
          fontSize: 14
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
          No activity yet
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map(item => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: 12,
                background: "#f8fafc",
                borderRadius: 12,
                border: "1px solid #e2e8f0"
              }}
            >
              <Avatar src={item.profiles?.avatar_url} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontSize: 13, 
                  lineHeight: 1.4,
                  color: "#374151",
                  marginBottom: 4
                }}>
                  <strong style={{ color: "#1f2937" }}>
                    {item.profiles?.full_name || "Unknown"}
                  </strong>{" "}
                  <span style={{ color: "#6b7280" }}>
                    {item.action.replaceAll("_", " ").toLowerCase()}
                  </span>
                </div>
                <div style={{ 
                  fontSize: 11, 
                  color: "#9ca3af",
                  fontWeight: 500
                }}>
                  {new Date(item.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}