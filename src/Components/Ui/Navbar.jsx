import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import Button from "./Button.jsx";
import TextButton from "./TextButton.jsx";
import "../../Styles/Ui/Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (isMenuOpen || currentScrollY <= 24) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsNavVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsNavVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`site-nav ${isNavVisible ? "is-visible" : "is-hidden"}`}>
      <NavLink className="brand" to="/" aria-label="Reaction Hoops inicio">
        <span>
          reaction<span>hoops</span>
        </span>
      </NavLink>
      <button
        className={`nav-menu-toggle ${isMenuOpen ? "is-open" : ""}`}
        type="button"
        aria-label={isMenuOpen ? "Cerrar menu" : "Abrir menu"}
        aria-expanded={isMenuOpen}
        aria-controls="navigation-menu"
        onClick={() => {
          setIsNavVisible(true);
          setIsMenuOpen((isOpen) => !isOpen);
        }}
      >
        <FiMenu className="menu-icon menu-icon-open" aria-hidden="true" />
        <FiX className="menu-icon menu-icon-close" aria-hidden="true" />
      </button>
      <nav
        className={`nav-links ${isMenuOpen ? "is-open" : ""}`}
        id="navigation-menu"
        aria-label="Navegacion principal"
      >
        <TextButton as={NavLink} variant="secondary" to="/" onClick={closeMenu}>
          Inicio
        </TextButton>
        <TextButton
          as={NavLink}
          variant="secondary"
          to="/about"
          onClick={closeMenu}
        >
          La experiencia
        </TextButton>
        <Button
          className="nav-dashboard"
          variant="secondary"
          to="/dashboard"
          onClick={closeMenu}
        >
          Dashboard <FiArrowUpRight />
        </Button>
      </nav>
    </header>
  );
}

export default Navbar;
