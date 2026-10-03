import AboutHero from "../Sections/About/AboutHero.jsx";
import AboutDetail from "../Sections/About/AboutDetail.jsx";
import ExerciseSection from "../Sections/About/ExerciseSection.jsx";
import SessionSection from "../Sections/About/SessionSection.jsx";
import ExperienceResultsSection from "../Sections/About/ExperienceResultsSection.jsx";

function About() {
  return (
    <div className="page about-page">
      <AboutHero />
      <AboutDetail />
      <ExerciseSection />
      <SessionSection />
      <ExperienceResultsSection />
    </div>
  );
}

export default About;
