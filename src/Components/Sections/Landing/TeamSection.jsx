import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";

import TeamMemberCard from "../../Ui/TeamMemberCard.jsx";
import TextButton from "../../Ui/TextButton.jsx";


import sebasPhoto from "../../../assets/Img/SebasPhoto.jpeg";
import katheFoto from "../../../assets/Img/KatheFoto.jpeg";
import miguelFoto from "../../../assets/Img/IMG_1108.PNG";
import juanFoto from "../../../assets/Img/jdfoto.jpeg";

import "../../../Styles/Sections/Landing/TeamSection.css";

function TeamSection() {
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
      { threshold: 0.16 },
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
      className={`team-section section-wrap reveal-${entryDirection} ${
        isVisible ? "is-visible" : ""
      }`}
    >
      <div className="section-heading">
        <div className="team-title">
          <p className="kicker">El equipo</p>

          <h2 className="h-2">
            Las personas
            <br />
            <em>detrás de la experiencia.</em>
          </h2>
        </div>

        <TextButton
          className="team-link"
          to="/about"
          variant="secondary"
          underline
        >
          Conocer el proyecto <FiArrowUpRight />
        </TextButton>
      </div>

      <div className="team-grid">
        <TeamMemberCard
          initials="SV"
          name="Sebastian Villamil"
          role="Desarrollo Web/UX/VR"
          image={sebasPhoto}
          href="https://www.serbew.games"
        />

        <TeamMemberCard
          initials="KG"
          name="Katherine Guayazan"
          role="Artistas 3D y Diseñadora UI"
          image={katheFoto}
          href="https://www.behance.net/swnoswift"
        />

        <TeamMemberCard
          initials="MG"
          name="Miguel Guerrero"
          role="Desarrollador vr y Environment Artist"
          image={miguelFoto}
          href="https://www.instagram.com/miguel_guerrero.01?srtk=NjVoamhnZmZua29r"
        />

        <TeamMemberCard
          initials="JS"
          name="Juan Sierra"
          image={juanFoto}
          role="Desarrollo Web"
          href="https://www.instagram.com/juan_diego2804?exln=cW10NmlwcWZieHJv"
        />
      </div>
    </section>
  );
}

export default TeamSection;