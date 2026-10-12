import sebasPhoto from "../../../assets/Img/SebasPhoto.jpeg";
import kathePhoto from "../../../assets/Img/KatheFoto.jpeg";
import reactionProcess from "../../../assets/Img/ReactionProcess.svg";
import { useScrollReveal } from "../../../hooks/useScrollReveal.js";
import "../../../Styles/Sections/About/AboutGallerySection.css";

const protocolSteps = [
  {
    step: "01",
    phase: "Preparación",
    title: "Registro del participante",
    description:
      "Identificación del atleta mediante su código universitario en la plataforma. Se explica la dinámica de la sesión y se selecciona el ejercicio a evaluar.",
  },
  {
    step: "02",
    phase: "Inmersión",
    title: "Calibración del Meta Quest 3",
    description:
      "Colocación y ajuste ergonómico del visor. El jugador se ubica en el centro de la cancha virtual y realiza una breve prueba para calibrar el campo de visión y los mandos.",
  },
  {
    step: "03",
    phase: "Evaluación",
    title: "Respuesta a tres niveles",
    description:
      "Ejecución de las tres rondas consecutivas con dificultad ascendente. El jugador reacciona a estímulos lumínicos o de movimiento sin interrupciones.",
  },
  {
    step: "04",
    phase: "Registro",
    title: "Métricas directas a Firebase",
    description:
      "Al concluir el nivel 3, el sistema consolida el tiempo promedio de reacción, los aciertos y la precisión, dejándolos listos en la base de datos para análisis comparativo.",
  },
];

function AboutGallerySection() {
  const [galleryRef, isVisible] = useScrollReveal(0.12);

  return (
    <section
      ref={galleryRef}
      className={`about-gallery-section section-wrap ${isVisible ? "is-visible" : ""}`}
    >
      {/* Encabezado del protocolo */}
      <div className="section-heading gallery-section-header">
        <div>
          <p className="kicker">03 / Protocolo de prueba</p>
          <h2 className="h-2">
            Cómo se vive una sesión.
            <br />
            <em>Paso a paso con los atletas.</em>
          </h2>
        </div>
        <p className="b-1 gallery-header-desc">
          El protocolo experimental está diseñado para evaluar la toma de
          decisiones en condiciones estables, acompañando al jugador en cada fase
          desde el registro inicial hasta el registro de sus métricas.
        </p>
      </div>

      {/* Disposición asimétrica: fotos reales + secuencia numerada */}
      <div className="gallery-showcase-layout">
        {/* Columna visual con fotografías y diagrama */}
        <div className="gallery-media-column">
          <figure className="media-card primary-photo-card">
            <img
              src={sebasPhoto}
              alt="Atleta universitario realizando la prueba con el visor Meta Quest 3"
              className="protocol-photo"
            />
            <figcaption className="photo-caption">
              <span className="caption-tag">Fase 02 · Inmersión</span>
              <p className="b-3">
                Evaluación en tiempo real con visor Meta Quest 3 en escala real.
              </p>
            </figcaption>
          </figure>

          <div className="media-secondary-row">
            <figure className="media-card secondary-photo-card">
              <img
                src={kathePhoto}
                alt="Miembro del equipo coordinando el registro y la sesión de prueba"
                className="protocol-photo"
              />
              <figcaption className="photo-caption">
                <span className="caption-tag">Fase 01 · Acompañamiento</span>
                <p className="b-3">Soporte y guía técnica durante la toma de datos.</p>
              </figcaption>
            </figure>

            <figure className="media-card process-diagram-card">
              <img
                src={reactionProcess}
                alt="Esquema del flujo perceptual de Reaction Hoops"
                className="diagram-image"
              />
              <figcaption className="photo-caption">
                <span className="caption-tag">Diagrama de flujo</span>
                <p className="b-3">Secuencia de toma de decisiones del sistema.</p>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Columna de la secuencia numerada de 4 pasos */}
        <div className="protocol-timeline-column">
          <div className="timeline-badge-header">
            <span className="timeline-meta-label">Protocolo estandarizado</span>
            <span className="timeline-meta-count">4 Fases consecutivas</span>
          </div>

          <div className="protocol-steps-list">
            {protocolSteps.map((item, index) => (
              <article key={item.step} className="protocol-step-item">
                <div className="step-track">
                  <span className="step-number-bullet">{item.step}</span>
                  {index < protocolSteps.length - 1 && (
                    <span className="step-line-connector" aria-hidden="true" />
                  )}
                </div>

                <div className="step-body">
                  <span className="step-phase-pill">{item.phase}</span>
                  <h3 className="h-4 step-title">{item.title}</h3>
                  <p className="b-3 step-description">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutGallerySection;
