import { FiArrowUpRight, FiActivity } from "react-icons/fi";
import TextButton from "./TextButton.jsx";
import "../../Styles/Ui/Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <FiActivity /> reactionhoops
      </div>
      <span className="b-3">Entrenar la reaccion. Cambiar el juego.</span>
      <TextButton
        href="mailto:hello@reactionhoops.com"
        variant="secondary"
        underline
      >
        Contactar al equipo <FiArrowUpRight />
      </TextButton>
    </footer>
  );
}

export default Footer;
