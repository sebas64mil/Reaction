import { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import Button from "../../Ui/Button.jsx";
import "../../../Styles/Sections/Landing/CtaSection.css";

const ctaImages = [
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1800&q=85",
];

function CtaSection() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const carouselTimer = window.setInterval(() => {
      setActiveImage((currentImage) => (currentImage + 1) % ctaImages.length);
    }, 5000);

    return () => window.clearInterval(carouselTimer);
  }, []);

  return (
    <section className="cta-section section-wrap">
      <div className="cta-background" aria-hidden="true">
        {ctaImages.map((image, index) => (
          <img
            className={index === activeImage ? "is-active" : ""}
            key={image}
            src={image}
            alt=""
          />
        ))}
      </div>
      <div className="cta-content">
        <div>
          <p className="kicker">Siguiente nivel</p>
          <h2 className="h-2">
            Tu reacción
            <br />
            <em>es tu ventaja.</em>
          </h2>
        </div>
        <Button to="/dashboard" variant="secondary">
          Ver el dashboard <FiArrowUpRight />
        </Button>
      </div>
    </section>
  );
}

export default CtaSection;
