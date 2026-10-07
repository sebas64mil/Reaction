import sebasPhoto from "../../../assets/Img/SebasPhoto.jpeg";
import kathePhoto from "../../../assets/Img/KatheFoto.jpeg";
import reactionProcess from "../../../assets/Img/ReactionProcess.svg";
import "../../../Styles/Sections/About/AboutGallerySection.css";

function AboutGallerySection() {
  return (
    <section className="about-gallery section-wrap">
      <div className="section-heading gallery-heading">
        <div>
          <p className="kicker">03 / El proceso</p>
          <h2 className="h-2">
            Desde el primer estímulo
            <br />
            <em>hasta la respuesta.</em>
          </h2>
        </div>
        <p className="b-2">
          El proceso combina experiencia, precisión y feedback para que cada
          sesión sea una mejora concreta.
        </p>
      </div>

      <div className="gallery-grid">
        <figure className="gallery-card gallery-card-large">
          <img src={sebasPhoto} alt="Jugador trabajando en un entorno de entrenamiento" />
          <figcaption>
            <span>01</span>
            <div>
              <h3 className="h-4">Diseñar la experiencia</h3>
              <p className="b-3">
                Creamos escenarios inmersivos que conectan percepción, memoria y
                movimiento.
              </p>
            </div>
          </figcaption>
        </figure>

        <figure className="gallery-card gallery-card-small">
          <img src={kathePhoto} alt="Equipo detrás de la experiencia de Reaction Hoops" />
          <figcaption>
            <span>02</span>
            <div>
              <h3 className="h-4">Probar y medir</h3>
              <p className="b-3">
                Validamos cada rutina con jugadores reales y ajustamos la presión
                para obtener mejores resultados.
              </p>
            </div>
          </figcaption>
        </figure>

        <figure className="gallery-card gallery-card-wide">
          <img src={reactionProcess} alt="Ilustración del proceso de observar, interpretar y actuar" />
          <figcaption>
            <span>03</span>
            <div>
              <h3 className="h-4">Responder con precisión</h3>
              <p className="b-3">
                El jugador transforma la percepción en una acción inmediata,
                controlada y medible.
              </p>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export default AboutGallerySection;
