import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.hash]);

  return null;
}

export default ScrollManager;
