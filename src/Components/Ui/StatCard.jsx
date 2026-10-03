import "../../Styles/Ui/StatCard.css";

function StatCard({ value, label, accent }) {
  return (
    <div className={`stat-card ${accent || ""}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export default StatCard;
