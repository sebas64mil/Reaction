import { FiArrowUpRight } from "react-icons/fi";
import Button from "../../Ui/Button.jsx";
import "../../../Styles/Sections/Landing/CtaSection.css";

function CtaSection() {
  return (
    <section className="cta-section section-wrap">
      <div>
        <p className="kicker">Siguiente nivel</p>
        <h2 className="h-2">
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
