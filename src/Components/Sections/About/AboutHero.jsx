import { useScrollReveal } from "../../../hooks/useScrollReveal.js";
import "../../../Styles/Sections/About/AboutHero.css";

function AboutHero() {
  const [heroRef, isVisible] = useScrollReveal(0.1);

  return (
    <header
      ref={heroRef}
      className={`about-hero-section ${isVisible ? "is-visible" : ""}`}
    >
      <div className="section-wrap about-hero-container">
        {/* Encabezado y títulos */}
        <div className="about-hero-header">
          <div className="about-hero-meta">
            <span className="kicker">
              <span className="live-dot" /> Experiencia inmersiva en RV
            </span>
            <span className="hero-spec-pill">Unity · Meta Quest 3</span>
          </div>

          <h1 className="h-1 about-hero-title">
            Una cancha.
            <br />
            <em>Mil respuestas.</em>
          </h1>

          <p className="b-1 about-hero-lead">
            Una plataforma experimental desarrollada en Unity para Meta Quest 3
            que busca entrenar y evaluar la capacidad de reacción en jugadores
            universitarios de baloncesto, cuantificando la velocidad y precisión
            con la que perciben y responden a estímulos dinámicos.
          </p>
        </div>

        {/* Panel técnico / métricas de la experiencia */}
        <div className="about-hero-spec-grid">
          <div className="hero-spec-card">
            <span className="spec-label">Entorno</span>
            <strong className="spec-value">Meta Quest 3</strong>
            <p className="b-3">Inmersión visual 360° en escala real 1:1 de cancha.</p>
          </div>

          <div className="hero-spec-card">
            <span className="spec-label">Motor</span>
            <strong className="spec-value">Unity 3D</strong>
            <p className="b-3">Físicas de respuesta y renderizado a alta tasa de refresco.</p>
          </div>

          <div className="hero-spec-card">
            <span className="spec-label">Medición</span>
            <strong className="spec-value">0.01 seg</strong>
            <p className="b-3">Registro de tiempos de reacción y precisión por nivel.</p>
          </div>

          <div className="hero-spec-card">
            <span className="spec-label">Población</span>
            <strong className="spec-value">Universitaria</strong>
            <p className="b-3">Pruebas estandarizadas con deportistas en formación.</p>
          </div>
        </div>

        {/* Gráfico decorativo de cancha y radar técnico */}
        <div className="hero-court-graphic" aria-hidden="true">
          <div className="court-grid-pattern" />
          <div className="court-circle court-circle-center" />
          <div className="court-circle court-circle-key" />
          <div className="court-three-point-arc" />
          <div className="court-lane-lines" />
          <div className="court-tracking-point p-1" />
          <div className="court-tracking-point p-2" />
          <div className="court-tracking-point p-3" />
          <div className="court-data-tag">[ TRACKING RATE: 90Hz ]</div>
        </div>
      </div>
    </header>
  );
}

export default AboutHero;
