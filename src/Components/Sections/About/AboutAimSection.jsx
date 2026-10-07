import { FiTarget } from "react-icons/fi";
import "../../../Styles/Sections/About/AboutAimSection.css";

function AboutAimSection() {
  return (
    <section className="about-aim section-wrap">
      <div className="about-aim-heading">
        <p className="kicker">02 / Nuestro propósito</p>
        <h2 className="h-2">
          Queremos hacer que
          <br />
          <em>la reacción sea una habilidad.</em>
        </h2>
      </div>

      <div className="about-aim-copy">
        <p className="b-1">
          No buscamos entrenar solo la velocidad. Queremos construir una
          relación más consciente entre lo que el jugador percibe y lo que hace
          con ello.
        </p>
        <div className="aim-grid">
          <article>
            <FiTarget />
            <span>01</span>
            <h3 className="h-4">Entrenar con intención</h3>
            <p className="b-3">
              Cada ronda tiene un objetivo claro y una medición que permite
              observar el progreso.
            </p>
          </article>
          <article>
            <FiTarget />
            <span>02</span>
            <h3 className="h-4">Crear hábitos rápidos</h3>
            <p className="b-3">
              La repetición inmersiva transforma la respuesta consciente en una
              acción natural.
            </p>
          </article>
          <article>
            <FiTarget />
            <span>03</span>
            <h3 className="h-4">Hacer deporte más accesible</h3>
            <p className="b-3">
              El entorno virtual permite practicar sin límites de espacio,
              tiempo o disponibilidad.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default AboutAimSection;
