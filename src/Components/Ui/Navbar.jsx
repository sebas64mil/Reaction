import { NavLink } from "react-router-dom";
import { FiArrowUpRight, FiActivity } from "react-icons/fi";
import Button from "./Button.jsx";
import TextButton from "./TextButton.jsx";

function Navbar() {
  return (
    <header className="site-nav">
      <NavLink className="brand" to="/" aria-label="Reaction Hoops inicio">
        <span className="brand-mark">
          <FiActivity />
        </span>
        <span>
          reaction<span>hoops</span>
        </span>
      </NavLink>
      <nav className="nav-links" aria-label="Navegacion principal">
        <TextButton as={NavLink} variant="secondary" to="/">
          Inicio
        </TextButton>
        <TextButton as={NavLink} variant="secondary" to="/about">
          La experiencia
        </TextButton>
        <Button className="nav-dashboard" variant="secondary" to="/dashboard">
          Dashboard <FiArrowUpRight />
        </Button>
      </nav>
    </header>
  );
}

export default Navbar;
