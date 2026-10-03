import { useEffect, useRef, useState } from "react";
import {
  FaBolt,
  FaChartLine,
  FaCube,
  FaLayerGroup,
  FaUnity,
  FaVrCardboard,
} from "react-icons/fa6";
import StatCard from "../../Ui/StatCard.jsx";

import "../../../Styles/Sections/Landing/StatsSection.css";

function StatsSection() {
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
      className={`stats-band section-wrap reveal-${entryDirection} ${
        isVisible ? "is-visible" : ""
      }`}
    >

      {/* Columna izquierda */}
<div className="stats-column stats-column-left">
  <StatCard
    value="04"
    label="Ejercicios de reacción"
    icon={FaBolt}
    accent="stat-orange"
    linePosition="right"
  />

  <StatCard
    value="03"
    label="Niveles de dificultad"
    icon={FaLayerGroup}
    linePosition="right"
  />

  <StatCard
    value="Unity"
    label="Desarrollado en Unity"
    icon={FaUnity}
    accent="stat-cyan"
    linePosition="right"
  />
</div>

      {/* Centro */}
      <div className="stats-center">
        <div className="section-intro">
          <h2 className="h-2">
            Entrena tu reacción
            <br />
            <em>en otro nivel.</em>
          </h2>
        </div>

        <div className="stats-image">
          <img
            src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80"
            alt="Experiencia de realidad virtual"
          />
        </div>
      </div>

      {/* Columna derecha */}
<div className="stats-column stats-column-right">
  <StatCard
    value="Q3"
    label="Compatible con Meta Quest 3"
    icon={FaVrCardboard}
    accent="stat-cyan"
    linePosition="left"
  />

  <StatCard
    value="WEB"
    label="Dashboard para seguimiento del progreso"
    icon={FaChartLine}
    linePosition="left"
  />

  <StatCard
    value="VR"
    label="Experiencia inmersiva"
    icon={FaCube}
    accent="stat-orange"
    linePosition="left"
  />
</div>

    </section>
  );
}

export default StatsSection;