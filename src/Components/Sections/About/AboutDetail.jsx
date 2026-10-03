import { FiCheck } from "react-icons/fi";
import "../../../Styles/Sections/About/AboutDetail.css";

function AboutDetail() {
  return (
    <section className="about-detail section-wrap">
      <div className="about-statement">
        <span>01 / CONTEXTO</span>
        <h2 className="h-2">
          El cuerpo sabe.
          <br />
          <em>Hay que activarlo.</em>
        </h2>
      </div>
      <div className="about-copy">
        <p className="b-1">
          En el baloncesto, la diferencia ocurre entre el estímulo y la
          respuesta. Reaction Hoops crea escenarios controlados para practicar
          ese instante: observar, interpretar y actuar.
        </p>
        <p className="b-1">
          La realidad virtual permite repetir situaciones de alta presión sin
          límites, adaptando la intensidad y el tipo de estímulo a cada sesión.
        </p>
        <div className="feature-list">
          <span>
            <FiCheck /> Entorno inmersivo
          </span>
          <span>
            <FiCheck /> Estímulos multisensoriales
          </span>
          <span>
            <FiCheck /> Datos listos para medir
          </span>
        </div>
      </div>
    </section>
  );
}

export default AboutDetail;
