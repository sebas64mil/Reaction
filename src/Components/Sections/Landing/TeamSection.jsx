import { FiArrowUpRight } from "react-icons/fi";
import TeamMemberCard from "../../Ui/TeamMemberCard.jsx";
import TextButton from "../../Ui/TextButton.jsx";

function TeamSection() {
  return (
    <section className="team-section section-wrap">
      <div className="section-heading">
        <div>
          <p className="kicker">Las personas detrás</p>
          <h2>
            Hecho para
            <br />
            <em>quienes juegan.</em>
          </h2>
        </div>
        <TextButton to="/about" variant="secondary" underline>
          Conocer el proyecto <FiArrowUpRight />
        </TextButton>
      </div>
      <div className="team-grid">
        <TeamMemberCard
          initials="MR"
          name="María Rojas"
          role="Diseño de experiencia"
        />
        <TeamMemberCard
          initials="JG"
          name="Juan García"
          role="Desarrollo Unity"
        />
        <TeamMemberCard
          initials="SV"
          name="Sofía Vargas"
          role="Investigación deportiva"
        />
      </div>
    </section>
  );
}

export default TeamSection;
