const colors = {
  low: "#E5E7EB",
  medium: "#FEF3C7", 
  high: "#FEE2E2",
};

export default function PriorityBadge({ level }) {
  return (
    <span
      style={{
        fontSize: 11,
        padding: "2px 8px",
        borderRadius: 999,
        backgroundColor: colors[level],
        textTransform: "capitalize",
      }}
    >
      {level}
    </span>
  );
}