import { FiEye, FiCpu, FiZap, FiActivity } from "react-icons/fi";
import { useScrollReveal } from "../../../hooks/useScrollReveal.js";
import "../../../Styles/Sections/About/AboutDetail.css";

const perceptionSteps = [
  {
    number: "01",
    tag: "Entrada",
    title: "Estímulo",
    icon: <FiZap />,
    desc: "Señales lumínicas y trayectorias espaciales que emergen en el campo visual de la cancha virtual.",
  },
  {
    number: "02",
    tag: "Lectura",
    title: "Percepción",
    icon: <FiEye />,
    desc: "La visión periférica capta la señal y filtra la información relevante en el entorno 360°.",
  },
  {
    number: "03",
    tag: "Cálculo",
    title: "Decisión",
    icon: <FiCpu />,
    desc: "El jugador selecciona la respuesta adecuada bajo la presión del temporizador en fracciones de segundo.",
  },
  {
    number: "04",
    tag: "Ejecución",
    title: "Respuesta",
    icon: <FiActivity />,
    desc: "Acción motriz precisa que el sistema registra y cuantifica para evaluar tiempo y exactitud.",
  },
];

function AboutDetail() {
  const [detailRef, isVisible] = useScrollReveal(0.12);

  return (
    <section
      ref={detailRef}
      className={`about-detail-section section-wrap ${isVisible ? "is-visible" : ""}`}
    >
      {/* Encabezado asimétrico */}
      <div className="about-detail-header">
        <div className="about-detail-badge">
          <p className="kicker">01 / Contexto</p>
        </div>

        <div className="about-detail-headline">
          <h2 className="h-2">
            El cuerpo sabe.
            <br />
            <em>Hay que activarlo.</em>
          </h2>
        </div>

        <div className="about-detail-summary">
          <p className="b-1">
            En el baloncesto competitivo, el juego se define en fracciones de
            segundo. Reaction Hoops crea un entorno experimental controlado para
            poner a prueba ese instante crítico: observar, interpretar y actuar
            sin las limitaciones logísticas de una sesión tradicional.
          </p>
        </div>
      </div>

      {/* Cadena perceptual-motora (Estímulo -> Percepción -> Decisión -> Respuesta) */}
      <div className="perception-cycle-block">
        <div className="cycle-header">
          <span className="cycle-kicker">La secuencia que evalúa Reaction Hoops</span>
          <p className="b-3">
            El sistema descompone la reacción en cuatro fases observables para
            medir dónde se gana o pierde tiempo en cada nivel.
          </p>
        </div>

        <div className="perception-flow-grid">
          {perceptionSteps.map((step, idx) => (
            <div key={step.number} className="flow-step-card">
              <div className="flow-card-top">
                <span className="flow-number">{step.number}</span>
                <span className="flow-icon">{step.icon}</span>
              </div>
              <span className="flow-tag">{step.tag}</span>
              <h3 className="h-4 flow-title">{step.title}</h3>
              <p className="b-3 flow-desc">{step.desc}</p>
              {idx < perceptionSteps.length - 1 && (
                <span className="flow-connector" aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bloque comparativo editorial */}
      <div className="about-context-editorial">
        <div className="editorial-callout">
          <span className="callout-label">El entorno virtual</span>
          <h3 className="h-4">Simulación inmersiva sin desgaste de cancha</h3>
          <p className="b-2">
            La realidad virtual con Meta Quest 3 permite repetir situaciones de
            alta exigencia cognitiva tantas veces como sea necesario. Al
            estandarizar la velocidad, la posición y la cadencia de los
            estímulos, cada atleta enfrenta exactamente las mismas condiciones,
            haciendo posible una evaluación cuantitativa sin factores externos
            impredecibles.
          </p>
        </div>

        <div className="editorial-callout highlight-callout">
          <span className="callout-label">Medición objetiva</span>
          <h3 className="h-4">Datos concretos, no impresiones subjetivas</h3>
          <p className="b-2">
            En lugar de basarse únicamente en la observación del entrenador, la
            plataforma registra en tiempo real el tiempo de reacción medio (en
            segundos), el número de aciertos y la precisión porcentual por
            nivel. Esto proporciona una base de datos transparente para
            comparar sesiones a lo largo del tiempo.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AboutDetail;
