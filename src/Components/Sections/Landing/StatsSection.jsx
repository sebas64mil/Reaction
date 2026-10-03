import StatCard from "../../Ui/StatCard.jsx";
import "../../../Styles/Sections/Landing/StatsSection.css";

function StatsSection() {
  return (
    <section className="stats-band section-wrap">
      <div className="section-intro">
        <p className="kicker">El proyecto en datos</p>
        <h2 className="h-2">
          Diseñado para el
          <br />
          <em>momento decisivo.</em>
        </h2>
      </div>
      <div className="stat-grid">
        <StatCard
          value="360°"
          label="Campo de estímulos"
          accent="stat-orange"
        />
        <StatCard value="&lt; 1s" label="Para tomar una decisión" />
        <StatCard value="Q3" label="Meta Quest compatible" accent="stat-cyan" />
      </div>
    </section>
  );
}

export default StatsSection;
