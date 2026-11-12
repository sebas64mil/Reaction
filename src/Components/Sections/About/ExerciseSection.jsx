import { Link } from "react-router-dom";
import { FiArrowRight, FiBarChart2 } from "react-icons/fi";
import ExerciseCard from "../../Ui/ExerciseCard.jsx";
import { useScrollReveal } from "../../../hooks/useScrollReveal.js";
import "../../../Styles/Sections/About/ExerciseSection.css";

function ExerciseSection() {
  const [sectionRef, isVisible] = useScrollReveal(0.1);

  return (
    <section
      id="exercises"
      ref={sectionRef}
      className={`exercise-section section-wrap ${isVisible ? "is-visible" : ""}`}
    >
      {/* Encabezado editorial */}
      <div className="section-heading exercise-heading-block">
        <div>
          <p className="kicker">04 / Protocolos de entrenamiento</p>
          <h2 className="h-2">
            Cuatro formas de
            <br />
            <em>poner a prueba la reacción.</em>
          </h2>
        </div>
        <p className="b-1 exercise-header-copy">
          Cada protocolo aísla una variable perceptual y motora diferente. Las
          cuatro rutinas se configuran en tres niveles de dificultad creciente y
          sus resultados se integran en el sistema de análisis.
        </p>
      </div>

      {/* Grid de ejercicios */}
      <div className="exercise-grid">
        <ExerciseCard
          number="1"
          name="Sigue la Luz"
          description="Toca la luz indicada antes de que se agote el tiempo; los estímulos aparecen en distintas direcciones."
          target="Percepción periférica"
          color="visual-coral"
          to="/exercises/luz-periferica"
        />
        <ExerciseCard
          number="2"
          name="Captura Selectiva"
          description="Decide qué balones atrapar y cuáles dejar pasar según la máquina que los lanza."
          target="Decisión bajo presión"
          color="visual-orange"
          to="/exercises/pase-de-decision"
        />
        <ExerciseCard
          number="3"
          name="Alcance Reactivo"
          description="Alcanza los balones que señala el entrenador virtual antes de que vuelvan a su posición."
          target="Tiempo de respuesta"
          color="visual-cyan"
          to="/exercises/zona-de-reaccion"
        />
        <ExerciseCard
          number="4"
          name="Control de Dribleo"
          description="Dribla cambiando de mano y dirige el balón a las placas indicadas; activa unas y evita otras."
          target="Coordinación dinámica"
          color="visual-lime"
          to="/exercises/control-de-dribleo"
        />
      </div>

      {/* Cierre editorial que conecta con el Dashboard */}
      <div className="exercise-section-closure">
        <div className="closure-content">
          <div className="closure-tag">
            <FiBarChart2 />
            <span>Métricas e historial</span>
          </div>
          <h3 className="h-4">¿Quieres ver cómo se miden estos ejercicios?</h3>
          <p className="b-2">
            Explora el simulador de sesiones y consulta los resultados históricos
            por jugador y ejercicio en el panel analítico.
          </p>
        </div>

        <Link to="/dashboard" className="closure-cta-button">
          <span>Ir al dashboard de resultados</span>
          <FiArrowRight />
        </Link>
      </div>
    </section>
  );
}

export default ExerciseSection;
