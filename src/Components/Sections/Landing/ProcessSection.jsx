import { FiBox, FiCrosshair, FiHeadphones } from "react-icons/fi";
import "../../../Styles/Sections/Landing/ProcessSection.css";

function ProcessSection() {
  return (
    <section className="process-section" id="como-funciona">
      <div className="section-wrap">
        <div className="section-heading">
          <div>
            <p className="kicker">El sistema</p>
            <h2 className="h-2">
              El juego cambia
              <br />
              <em>en un instante.</em>
            </h2>
          </div>
          <p className="b-2">
            Reaction Hoops sitúa al jugador dentro de una cancha virtual donde
            cada señal exige una lectura rápida y una respuesta precisa.
          </p>
        </div>
        <div className="process-grid">
          <div className="process-card">
            <span>01</span>
            <FiHeadphones />
            <h3 className="h-4">Entra</h3>
            <p className="b-2">
              Ponte el visor y entra a un entorno construido para enfocar tu
              atención.
            </p>
          </div>
          <div className="process-card active-process">
            <span>02</span>
            <FiCrosshair />
            <h3 className="h-4">Detecta</h3>
            <p className="b-2">
              Luces, sonidos y objetos aparecen para poner a prueba tu
              percepción.
            </p>
          </div>
          <div className="process-card">
            <span>03</span>
            <FiBox />
            <h3 className="h-4">Responde</h3>
            <p className="b-2">
              Reacciona con tus manos y controladores. Cada movimiento cuenta.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
