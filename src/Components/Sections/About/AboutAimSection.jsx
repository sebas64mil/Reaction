import { FiTarget, FiRepeat, FiGlobe, FiAlertCircle } from "react-icons/fi";
import { useScrollReveal } from "../../../hooks/useScrollReveal.js";
import "../../../Styles/Sections/About/AboutAimSection.css";

const aimPillars = [
  {
    number: "01",
    title: "Entrenar con intención",
    subtitle: "Parámetros reproducibles vs. azar",
    icon: <FiTarget />,
    problem:
      "En el entrenamiento convencional, la dificultad de un ejercicio suele ser difícil de replicar con exactitud día tras día.",
    solution:
      "Reaction Hoops establece tiempos, secuencias y cadencias calibradas para que cada ronda evalúe una demanda perceptual concreta y medible.",
  },
  {
    number: "02",
    title: "Crear hábitos de respuesta",
    subtitle: "De la duda a la acción motriz",
    icon: <FiRepeat />,
    problem:
      "Frente a estímulos cambiantes, el jugador principiante duda fracciones de segundo mientras procesa mentalmente qué hacer.",
    solution:
      "La inmersión en realidad virtual permite acumular cientos de repeticiones guiadas, favoreciendo la automatización de patrones de respuesta.",
  },
  {
    number: "03",
    title: "Facilitar la práctica en un entorno virtual",
    subtitle: "Accesibilidad y versatilidad espacial",
    icon: <FiGlobe />,
    problem:
      "Coordinar cancha, iluminación, balones y múltiples compañeros de entrenamiento limita la frecuencia de la práctica.",
    solution:
      "Con un visor Meta Quest 3, la experiencia puede ejecutarse en cualquier espacio despejado, brindando una herramienta práctica para atletas universitarios.",
  },
];

function AboutAimSection() {
  const [aimRef, isVisible] = useScrollReveal(0.12);

  return (
    <section
      ref={aimRef}
      className={`about-aim-section ${isVisible ? "is-visible" : ""}`}
    >
      <div className="section-wrap">
        {/* Cabecera de justificación y propósito */}
        <div className="about-aim-header">
          <div className="aim-header-left">
            <p className="aim-kicker">02 / Justificación y Propósito</p>
            <h2 className="h-2 aim-title">
              La necesidad de medir
              <br />
              <em>lo que antes era intuitivo.</em>
            </h2>
          </div>

          <div className="aim-header-right">
            <p className="b-1 aim-intro">
              La velocidad de reacción se entrena a menudo mediante ejercicios
              analógicos difíciles de cuantificar. Este proyecto surge para
              ofrecer a los jugadores universitarios una alternativa
              estandarizada que registre datos objetivos sin requerir una cancha
              completa ni equipamiento costoso.
            </p>
            <div className="aim-disclaimer-pill">
              <FiAlertCircle />
              <span>Propuesta experimental de evaluación y práctica complementaria</span>
            </div>
          </div>
        </div>

        {/* Los 3 ejes transformados en tarjetas de alto contraste */}
        <div className="aim-pillars-grid">
          {aimPillars.map((pillar) => (
            <article key={pillar.number} className="aim-pillar-card">
              <div className="pillar-top">
                <span className="pillar-num">{pillar.number}</span>
                <span className="pillar-icon">{pillar.icon}</span>
              </div>

              <h3 className="h-3 pillar-title">{pillar.title}</h3>
              <span className="pillar-subtitle">{pillar.subtitle}</span>

              <div className="pillar-content">
                <div className="pillar-comparison">
                  <span className="comparison-tag challenge-tag">El reto</span>
                  <p className="b-3">{pillar.problem}</p>
                </div>

                <div className="pillar-comparison">
                  <span className="comparison-tag solution-tag">La propuesta</span>
                  <p className="b-3">{pillar.solution}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutAimSection;
