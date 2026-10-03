import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import Button from "../../Ui/Button.jsx";
import TextButton from "../../Ui/TextButton.jsx";
import "../../../Styles/Sections/Landing/LandingHero.css";

function LandingHero() {
  return (
    <section className="hero section-wrap">
      <div className="hero-copy">
        <h1 className="h-1">
          Reacciona
          <br />
          <em>antes.</em>
        </h1>
        <p className="hero-intro b-1">
          Una experiencia de realidad virtual que convierte cada estímulo en una
          oportunidad para leer el juego, decidir y moverse.
        </p>
        <div className="hero-actions">
          <Button to="/about" variant="primary">
            Conoce la experiencia <FiArrowUpRight />
          </Button>
          <TextButton href="#como-funciona" variant="secondary" underline>
            Cómo funciona <FiArrowDownRight />
          </TextButton>
        </div>
      </div>
      <div
        className="hero-art"
        aria-label="Visualizacion abstracta de una cancha de baloncesto en realidad virtual"
      >
        <div className="art-grid" />
        <div className="art-ring art-ring-large" />
        <div className="art-ring art-ring-small" />
        <span className="art-cross">+</span>
        <span className="art-label art-label-top">VISUAL / 01</span>
        <span className="art-label art-label-bottom">
          REACTION
          <br />
          PROTOCOL
        </span>
        <div className="art-ball" />
      </div>
    </section>
  );
}

export default LandingHero;
