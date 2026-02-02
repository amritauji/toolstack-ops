export default function DueDate({ date }) {
  if (!date) return null;

  const isOverdue = new Date(date) < new Date();
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <span
      style={{
        fontSize: 11,
        color: isOverdue ? "#DC2626" : "#6B7280",
      }}
    >
      📅 {formattedDate}
    </span>
  );
}