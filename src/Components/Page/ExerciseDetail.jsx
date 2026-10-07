import { FiArrowLeft, FiCheckCircle, FiTarget, FiZap } from "react-icons/fi";
import { Link, useLocation, useParams } from "react-router-dom";
import "../../Styles/Page/ExerciseDetail.css";

const exercises = {
  "luz-periferica": {
    number: "01",
    name: "Luz periférica",
    shortDescription: "Identifica un estímulo fuera de tu foco central y responde antes de que desaparezca.",
    objective: "Percepción periférica",
    duration: "4–6 minutos",
    accent: "coral",
    description:
      "La reacción periférica es una habilidad esencial en deportes donde la atención debe cubrir un amplio entorno. En este ejercicio, una señal aparece fuera de la línea central de la cancha y el jugador debe responder lo antes posible.",
    steps: [
      "Mantén la mirada en el punto central de la cancha.",
      "Observa el estímulo que aparece en la periferia.",
      "Actúa con la mano o el cuerpo para señalar la respuesta correcta.",
      "Repite la ronda y busca reducir el tiempo de reacción."
    ],
    tip: "No intentes mirar la señal antes de que aparezca. Mantén tu atención abierta y deja que el estímulo llegue al borde de tu percepción."
  },
  "pase-de-decision": {
    number: "02",
    name: "Pase de decisión",
    shortDescription: "Elige el objetivo correcto cuando señales visuales y sonoras compiten entre sí.",
    objective: "Decisión bajo presión",
    duration: "5–8 minutos",
    accent: "orange",
    description:
      "En este escenario, el jugador debe interpretar varias señales y seleccionar la acción correcta antes de que el tiempo expire. La dificultad aumenta cuando el entorno introduce ruido y desacuerdo entre estímulos.",
    steps: [
      "Lee la instrucción central antes de moverte.",
      "Evalúa las señales visuales y sonoras disponibles.",
      "Selecciona la respuesta correcta con rapidez.",
      "Repite el escenario con una frecuencia mayor para consolidar la decisión."
    ],
    tip: "Haz una pausa breve para identificar la señal más relevante. La velocidad no sustituye la interpretación correcta."
  },
  "zona-de-reaccion": {
    number: "03",
    name: "Zona de reacción",
    shortDescription: "Muévete dentro de la cancha virtual y encuentra la ruta más rápida hacia la señal.",
    objective: "Tiempo de respuesta",
    duration: "6–10 minutos",
    accent: "cyan",
    description:
      "El jugador debe desplazarse por un espacio virtual para alcanzar una zona de reacción. Cada recorrido exige planificación, percepción y ejecución, convirtiendo el movimiento en un componente central de la medición.",
    steps: [
      "Localiza la zona de reacción en el entorno.",
      "Calcula la ruta más directa con tu percepción espacial.",
      "Muévete con rapidez y evita desplazamientos innecesarios.",
      "Regresa a la posición inicial y repite el recorrido."
    ],
    tip: "Planifica la ruta antes de moverte. Un movimiento preciso reduce el tiempo total y evita errores adicionales."
  }
};

function ExerciseDetail() {
  const { slug } = useParams();
  const location = useLocation();
  const exercise = exercises[slug];
  const backLocation = location.state?.from ?? { pathname: "/about", hash: "#exercises" };

  if (!exercise) {
    return (
      <section className="exercise-detail-page section-wrap">
        <h1 className="h-1">Ejercicio no encontrado</h1>
        <Link to={backLocation}>Volver a la experiencia</Link>
      </section>
    );
  }

  return (
    <section className={`exercise-detail-page exercise-detail-${exercise.accent} section-wrap`}>
      <Link className="back-link" to={backLocation}>
        <FiArrowLeft /> Volver a la experiencia
      </Link>

      <div className="exercise-detail-hero">
        <div>
          <p className="kicker">Ejercicio {exercise.number} / 03</p>
          <h1 className="h-1">{exercise.name}</h1>
          <p className="b-1">{exercise.shortDescription}</p>
        </div>
        <div className="exercise-detail-visual" aria-hidden="true">
          <span>{exercise.number}</span>
          <i />
          <b />
        </div>
      </div>

      <div className="exercise-detail-grid">
        <div className="exercise-detail-content">
          <p className="eyebrow">Qué entrena</p>
          <h2 className="h-2">La habilidad detrás de la respuesta.</h2>
          <p className="b-1">{exercise.description}</p>

          <div className="exercise-detail-metrics">
            <div><FiTarget /><span>Objetivo</span><strong>{exercise.objective}</strong></div>
            <div><FiZap /><span>Duración</span><strong>{exercise.duration}</strong></div>
          </div>
        </div>

        <aside className="exercise-protocol">
          <p className="eyebrow">Protocolo</p>
          <h2 className="h-4">Cómo hacerlo</h2>
          <ol>
            {exercise.steps.map((step, index) => (
              <li key={step}>
                <span>0{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <div className="exercise-tip">
        <FiCheckCircle />
        <div>
          <span>Consejo de rendimiento</span>
          <p>{exercise.tip}</p>
        </div>
      </div>
    </section>
  );
}

export default ExerciseDetail;
