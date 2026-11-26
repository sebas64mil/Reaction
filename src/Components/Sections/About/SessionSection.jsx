import { FiArrowUpRight, FiMove, FiRadio } from "react-icons/fi";
import "../../../Styles/Sections/About/SessionSection.css";

function SessionSection() {
  return (
    <section className="session-section section-wrap">
      <div>
        <p className="kicker">Flujo de una sesión</p>
        <h2 className="h-2">
          De cero a<br />
          <em>reacción.</em>
        </h2>
      </div>
      <div className="session-steps">
        <div>
          <span>01</span>
          <FiRadio />
          <h3 className="h-4">Calibrar</h3>
          <p className="b-3">El sistema reconoce tu espacio y prepara los estímulos.</p>
        </div>
        <div>
          <span>02</span>
          <FiMove />
          <h3 className="h-4">Entrenar</h3>
          <p className="b-3">Completa rondas cortas con dificultad progresiva.</p>
        </div>
        <div>
          <span>03</span>
          <FiArrowUpRight />
          <h3 className="h-4">Revisar</h3>
          <p className="b-3">Observa tus resultados y descubre dónde mejorar.</p>
        </div>
      </div>
    </section>
  );
}

export default SessionSection;
