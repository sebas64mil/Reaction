import LandingHero from "../Sections/Landing/LandingHero.jsx";
import StatsSection from "../Sections/Landing/StatsSection.jsx";
import ProcessSection from "../Sections/Landing/ProcessSection.jsx";
import TeamSection from "../Sections/Landing/TeamSection.jsx";
import CtaSection from "../Sections/Landing/CtaSection.jsx";
import LandingProgress from "../Sections/Landing/LandingProgress.jsx";

function Landing() {
  return (
    <div className="page landing-page">
      <LandingProgress />
      <LandingHero />
      <StatsSection />
      <ProcessSection />
      <TeamSection />
      <CtaSection />
    </div>
  );
}

export default Landing;
