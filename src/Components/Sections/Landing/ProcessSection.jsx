import { useEffect, useRef, useState } from "react";
import {
  FiUser,
  FiBookOpen,
  FiActivity,
} from "react-icons/fi";

import "../../../Styles/Sections/Landing/ProcessSection.css";

function ProcessSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [entryDirection, setEntryDirection] = useState("down");
  const sectionRef = useRef(null);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef("down");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        scrollDirection.current = "down";
      } else if (currentScrollY < lastScrollY.current) {
        scrollDirection.current = "up";
      }

      lastScrollY.current = currentScrollY;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntryDirection(scrollDirection.current);
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.18 },
    );

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`process-section reveal-${entryDirection} ${
        isVisible ? "is-visible" : ""
      }`}
      id="como-funciona"
    >
      <div className="section-wrap">

        <div className="section-heading">
          <div className="process-title">
            <h2 className="h-2">
              Tres pasos para
              <br />
              <em>comenzar a reaccionar.</em>
            </h2>
          </div>

          <p className="process-description b-2">
            La experiencia guía al jugador desde su registro hasta la
            realización de los ejercicios, mientras el sistema registra
            sus resultados para hacer seguimiento a su progreso.
          </p>
        </div>

        <div className="process-grid">

          {/* Paso 01 */}
          <div className="process-card">
            <span>01</span>

            <FiUser />

            <h3 className="h-4">Regístrate</h3>

            <p className="b-2">
              Ponte las gafas de realidad virtual e ingresa tu nombre
              para registrar tu sesión y comenzar la experiencia.
            </p>
          </div>

          {/* Paso 02 */}
          <div className="process-card active-process">
            <span>02</span>

            <FiBookOpen />

            <h3 className="h-4">Prepárate</h3>

            <p className="b-2">
              Escoge uno de los ejercicios disponibles y escucha
              atentamente el tutorial para comprender cómo realizarlo.
            </p>
          </div>

          {/* Paso 03 */}
          <div className="process-card">
            <span>03</span>

            <FiActivity />

            <h3 className="h-4">Reacciona</h3>

            <p className="b-2">
              Realiza el ejercicio y deja que el sistema registre tus
              resultados en la base de datos. Al terminar, podrás escoger
              otro ejercicio y continuar entrenando.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ProcessSection;