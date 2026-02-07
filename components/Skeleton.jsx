export default function Skeleton({ width = '100%', height = 20, borderRadius = 4, style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'loading 1.5s infinite',
        ...style
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fafbfc' }}>
      <Skeleton height={24} width="60%" style={{ marginBottom: 12 }} />
      <Skeleton height={16} width="40%" style={{ marginBottom: 8 }} />
      <Skeleton height={16} width="80%" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
