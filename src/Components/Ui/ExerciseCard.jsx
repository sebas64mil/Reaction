import { FiArrowUpRight, FiPlay } from "react-icons/fi";
import Button from "./Button.jsx";
import "../../Styles/Ui/ExerciseCard.css";

function ExerciseCard({ number, name, description, target, color }) {
  return (
    <article className="exercise-card">
      <div className={`exercise-visual ${color}`}>
        <span className="exercise-number">0{number}</span>
        <span className="court-line court-line-one" />
        <span className="court-line court-line-two" />
        <span className="ball" />
        <Button
          className="play-button"
          variant="secondary"
          aria-label={`Ver demo de ${name}`}
        >
          <FiPlay />
        </Button>
      </div>
      <div className="exercise-content">
        <div className="eyebrow">
          Ejercicio 0{number} <FiArrowUpRight />
        </div>
        <h3 className="h-5">{name}</h3>
        <p className="b-3">{description}</p>
        <div className="exercise-meta">
          <span>Objetivo</span>
          <strong>{target}</strong>
        </div>
        <div className="video-label">
          <span className="pulse-dot" /> Demo disponible próximamente
        </div>
      </div>
    </article>
  );
}

export default ExerciseCard;
