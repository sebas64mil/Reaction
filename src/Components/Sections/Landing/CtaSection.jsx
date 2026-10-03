import { FiArrowUpRight } from "react-icons/fi";
import Button from "../../Ui/Button.jsx";

function CtaSection() {
  return (
    <section className="cta-section section-wrap">
      <div>
        <p className="kicker">Siguiente nivel</p>
        <h2>
          Tu reacción
          <br />
          <em>es tu ventaja.</em>
        </h2>
      </div>
      <Button to="/dashboard" variant="secondary">
        Ver el dashboard <FiArrowUpRight />
      </Button>
    </section>
  );
}

export default CtaSection;
