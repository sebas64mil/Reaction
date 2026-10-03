import "../../Styles/Ui/StatCard.css";

function StatCard({ value, label, accent, icon: Icon, linePosition = "left" }) {
  return (
    <div
      className={`stat-card ${accent || ""} stat-line-${linePosition}`}
    >
      <strong className="h-5">{value}</strong>

      <span className="b-3">{label}</span>

      <div className="stat-card-icon">
        {Icon && <Icon />}
      </div>
    </div>
  );
}

export default StatCard;