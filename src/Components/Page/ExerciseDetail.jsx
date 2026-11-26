import { FiArrowLeft, FiCheckCircle, FiTarget, FiZap } from "react-icons/fi";
import { Link, useLocation, useParams } from "react-router-dom";
import "../../Styles/Page/ExerciseDetail.css";

const exercises = {
  "luz-periferica": {
    number: "01",
    name: "Sigue la Luz",
    shortDescription: "Responde rápidamente a los estímulos luminosos que aparecen a tu alrededor.",
    objective: "Percepción periférica",
    duration: "3 niveles",
    accent: "coral",
    videoUrl: "https://youtu.be/yGVHbp0Xqjk",
    description:
      "Responde rápidamente a los estímulos que aparecen a tu alrededor. Identifica la luz indicada en pantalla y tócala antes de que se agote el tiempo disponible. A medida que avanzas de nivel, aumenta la cantidad de luces y las direcciones de interacción.",
    levels: [
      { level: "1", reactions: "10", interval: "1 s", responseLimit: "1.5 s" },
      { level: "2", reactions: "20", interval: "0.75 s", responseLimit: "0.95 s" },
      { level: "3", reactions: "30", interval: "0.7 s", responseLimit: "0.85 s" },
    ],
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
    name: "Captura Selectiva",
    shortDescription: "Atrapa los balones indicados y deja pasar los demás, reaccionando a la dirección de cada lanzamiento.",
    objective: "Selección y reacción",
    duration: "3 niveles",
    accent: "orange",
    videoUrl: "https://www.youtube.com/watch?v=1ti7Ezxb3Rk",
    description:
      "Varias máquinas lanzarán balones hacia el jugador. Deberás identificar cuáles debes atrapar y cuáles debes dejar pasar, prestando atención al origen de cada lanzamiento y reaccionando correctamente ante cada estímulo.",
    progressionDescription: "En cada nivel aumenta la frecuencia y velocidad de los lanzamientos.",
    levels: [
      { level: "1", reactions: "10", interval: "0.6 s", shotSpeed: "8" },
      { level: "2", reactions: "20", interval: "0.4 s", shotSpeed: "9" },
      { level: "3", reactions: "30", interval: "0.2 s", shotSpeed: "10" },
    ],
    steps: [
      "Observa de qué máquina viene cada balón.",
      "Identifica si debes atraparlo o dejarlo pasar.",
      "Responde con rapidez sin perder de vista los otros lanzamientos.",
      "Avanza de nivel y adapta tu respuesta a la mayor velocidad."
    ],
    tip: "Haz una pausa breve para identificar la señal más relevante. La velocidad no sustituye la interpretación correcta."
  },
  "zona-de-reaccion": {
    number: "03",
    name: "Alcance Reactivo",
    shortDescription: "Reacciona al entrenador virtual y alcanza los balones antes de que vuelvan a su posición inicial.",
    objective: "Velocidad y coordinación",
    duration: "3 niveles",
    accent: "cyan",
    videoUrl: "https://youtu.be/G-Xs6QaI-Bw",
    description:
      "Reacciona a los movimientos del entrenador virtual y alcanza los balones antes de que regresen a su posición inicial. Mejora tu velocidad de respuesta y coordinación mediante estímulos en diferentes direcciones.",
    levels: [
      { level: "1", reactions: "15", interval: "1 s", directions: "2" },
      { level: "2", reactions: "25", interval: "0.75 s", directions: "4" },
      { level: "3", reactions: "35", interval: "0.6 s", directions: "6" },
    ],
    steps: [
      "Localiza la zona de reacción en el entorno.",
      "Calcula la ruta más directa con tu percepción espacial.",
      "Muévete con rapidez y evita desplazamientos innecesarios.",
      "Regresa a la posición inicial y repite el recorrido."
    ],
    tip: "Planifica la ruta antes de moverte. Un movimiento preciso reduce el tiempo total y evita errores adicionales."
  },
  "control-de-dribleo": {
    number: "04",
    name: "Control de Dribleo",
    shortDescription: "Mantén el drible mientras cambias el balón de mano y respondes a las placas indicadas.",
    objective: "Coordinación dinámica",
    duration: "3 niveles",
    accent: "lime",
    videoUrl: "https://www.youtube.com/watch?v=IJ1PsunRPgc",
    description:
      "Mantén el drible mientras cambias el balón de mano según las indicaciones. Durante el ejercicio, dirige el balón hacia las placas señaladas, identificando cuáles debes activar y cuáles debes evitar.",
    progressionDescription: "A medida que subes de nivel, aumenta la cantidad de placas activas y se exige el uso de una mano específica de forma aleatoria.",
    levels: [
      { level: "1", activePlates: "2", interval: "0.5 s", requiredHand: "No" },
      { level: "2", activePlates: "4", interval: "0.4 s", requiredHand: "No" },
      { level: "3", activePlates: "6", interval: "0.4 s", requiredHand: "Sí, aleatoria" },
    ],
    steps: [
      "Adopta una postura estable y comienza el dribleo.",
      "Mantén la mirada atenta a los estímulos del entorno.",
      "Responde sin perder el control del balón.",
      "Repite la ronda y busca mayor precisión en cada nivel."
    ],
    tip: "Prioriza un ritmo constante. El control del balón permite responder con precisión sin perder fluidez."
  }
};

// Función auxiliar para extraer el ID de YouTube y armar el link embed automáticamente
const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  let videoId = "";
  
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  } else if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1]?.split("&")[0];
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
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

  const embedUrl = getYouTubeEmbedUrl(exercise.videoUrl);

  return (
    <section className={`exercise-detail-page exercise-detail-${exercise.accent} section-wrap`}>
      <Link className="back-link" to={backLocation}>
        <FiArrowLeft /> Volver a la experiencia
      </Link>

      <div className="exercise-detail-hero">
        <div>
          <p className="kicker">Ejercicio {exercise.number} / 04</p>
          <h1 className="h-1">{exercise.name}</h1>
          <p className="b-1">{exercise.shortDescription}</p>
        </div>
        <div className="exercise-detail-visual" aria-hidden="true">
          <span>{exercise.number}</span>
          <i />
          <b />
        </div>
      </div>

      {exercise.levels && (
        <div className="reactive-exercise-info">
          <section className="reactive-description" aria-labelledby="reactive-description-title">
            <div className="reactive-description-copy">
              <p className="eyebrow">Ejercicio {exercise.number}</p>
              <h2 className="h-3" id="reactive-description-title">Descripción del ejercicio</h2>
              <p>{exercise.description}</p>
              <p>{exercise.progressionDescription ?? "La dificultad aumenta en cada nivel para retar tu velocidad de respuesta y coordinación espacial."}</p>
            </div>
            <div className="reactive-demo-frame">
              <iframe
                src={embedUrl}
                title={`Demostración: ${exercise.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>

          <section className="reactive-levels" aria-labelledby="reactive-levels-title">
            <div className="reactive-levels-heading">
              <p className="eyebrow">Progresión</p>
              <h2 className="h-3" id="reactive-levels-title">Datos del ejercicio</h2>
            </div>
            <div className="reactive-levels-scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Parámetro</th>
                    {exercise.levels.map(({ level }) => <th scope="col" key={level}>Nivel {level}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {exercise.levels.some(({ reactions }) => reactions) && (
                    <tr>
                      <th scope="row">Reacciones</th>
                      {exercise.levels.map(({ level, reactions }) => <td key={level}>{reactions}</td>)}
                    </tr>
                  )}
                  <tr>
                    <th scope="row">Intervalo entre estímulos</th>
                    {exercise.levels.map(({ level, interval }) => <td key={level}>{interval}</td>)}
                  </tr>
                  {exercise.levels.some(({ directions }) => directions) && (
                    <tr>
                      <th scope="row">Direcciones disponibles</th>
                      {exercise.levels.map(({ level, directions }) => <td key={level}>{directions}</td>)}
                    </tr>
                  )}
                  {exercise.levels.some(({ responseLimit }) => responseLimit) && (
                    <tr>
                      <th scope="row">Tiempo límite de respuesta</th>
                      {exercise.levels.map(({ level, responseLimit }) => <td key={level}>{responseLimit}</td>)}
                    </tr>
                  )}
                  {exercise.levels.some(({ shotSpeed }) => shotSpeed) && (
                    <tr>
                      <th scope="row">Velocidad de disparo</th>
                      {exercise.levels.map(({ level, shotSpeed }) => <td key={level}>{shotSpeed}</td>)}
                    </tr>
                  )}
                  {exercise.levels.some(({ activePlates }) => activePlates) && (
                    <tr>
                      <th scope="row">Placas activas</th>
                      {exercise.levels.map(({ level, activePlates }) => <td key={level}>{activePlates}</td>)}
                    </tr>
                  )}
                  {exercise.levels.some(({ requiredHand }) => requiredHand) && (
                    <tr>
                      <th scope="row">Mano obligatoria</th>
                      {exercise.levels.map(({ level, requiredHand }) => <td key={level}>{requiredHand}</td>)}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {!exercise.levels && <div className="exercise-detail-grid">
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
      </div>}

      {!exercise.levels && <section className="exercise-showcase-section">
        <div className="exercise-showcase-inner section-wrap">
          <div className="exercise-showcase-copy">
            <p className="eyebrow">Demostración</p>
            <h2 className="h-2">Observa el<br />ejercicio en<br />acción.</h2>
          </div>

          <div className="exercise-showcase-video-wrap">
            {/* Usamos iframe para reproducir los videos de YouTube correctamente */}
            <iframe
              className="exercise-showcase-video"
              src={embedUrl}
              title={exercise.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>}

      {!exercise.levels && <div className="exercise-tip">
        <FiCheckCircle />
        <div>
          <span>Consejo de rendimiento</span>
          <p>{exercise.tip}</p>
        </div>
      </div>}
    </section>
  );
}

export default ExerciseDetail;