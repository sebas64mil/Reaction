import ExerciseCard from "../../Ui/ExerciseCard.jsx";
import "../../../Styles/Sections/About/ExerciseSection.css";

function ExerciseSection() {
  return (
    <section id="exercises" className="exercise-section section-wrap">
      <div className="section-heading">
        <div>
          <p className="kicker">Protocolos de entrenamiento</p>
          <h2 className="h-2">
            Tres formas de
            <br />
            <em>poner a prueba la reacción.</em>
          </h2>
        </div>
        <p className="b-2">
          La colección crece con cada iteración. Cada ejercicio trabaja un tipo
          de decisión distinto.
        </p>
      </div>
      <div className="exercise-grid">
        <ExerciseCard
          number="1"
          name="Luz periférica"
          description="Identifica el estímulo que aparece fuera de tu foco central y responde con velocidad."
          target="Percepción periférica"
          color="visual-coral"
          to="/exercises/luz-periferica"
        />
        <ExerciseCard
          number="2"
          name="Pase de decisión"
          description="Elige el objetivo correcto cuando las señales visuales y sonoras compiten entre sí."
          target="Decisión bajo presión"
          color="visual-orange"
          to="/exercises/pase-de-decision"
        />
        <ExerciseCard
          number="3"
          name="Zona de reacción"
          description="Muévete dentro de la cancha virtual y encuentra la ruta más rápida hacia la señal."
          target="Tiempo de respuesta"
          color="visual-cyan"
          to="/exercises/zona-de-reaccion"
        />
      </div>
    </section>
  );
}

export default ExerciseSection;
