import { FiArrowUpRight, FiPlay } from 'react-icons/fi'

function ExerciseCard({ number, name, description, target, color }) {
  return (
    <article className="exercise-card">
      <div className={`exercise-visual ${color}`}>
        <span className="exercise-number">0{number}</span>
        <span className="court-line court-line-one" />
        <span className="court-line court-line-two" />
        <span className="ball" />
        <button className="play-button" aria-label={`Ver demo de ${name}`}><FiPlay /></button>
      </div>
      <div className="exercise-content">
        <div className="eyebrow">Ejercicio 0{number} <FiArrowUpRight /></div>
        <h3>{name}</h3>
        <p>{description}</p>
        <div className="exercise-meta"><span>Objetivo</span><strong>{target}</strong></div>
        <div className="video-label"><span className="pulse-dot" /> Demo disponible próximamente</div>
      </div>
    </article>
  )
}

export default ExerciseCard