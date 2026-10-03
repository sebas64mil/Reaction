import { useEffect, useState } from "react";
import "../../../Styles/Sections/Landing/LandingProgress.css";

function LandingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollableHeight > 0
        ? (window.scrollY / scrollableHeight) * 100
        : 0;

      setProgress(Math.min(100, Math.max(0, nextProgress)));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <aside className="landing-progress" aria-label="Progreso de la pagina">
      <span className="landing-progress-value">{Math.round(progress)}%</span>
      <span className="landing-progress-track">
        <span
          className="landing-progress-fill"
          style={{ height: `${progress}%` }}
        />
      </span>
    </aside>
  );
}

export default LandingProgress;
