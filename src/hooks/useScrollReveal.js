import { useEffect, useRef, useState } from "react";

/**
 * Hook para animaciones suaves de entrada al hacer scroll.
 * Respeta `prefers-reduced-motion` y garantiza visibilidad si no hay soporte para IntersectionObserver.
 *
 * @param {number} threshold - Umbral de intersección (0 a 1)
 * @returns {[import("react").RefObject, boolean]} [ref, isVisible]
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Si no está disponible IntersectionObserver o prefiere reducción de movimiento, mostrar de inmediato
    if (
      typeof window === "undefined" ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Dejar de observar una vez que ya fue visible para evitar desapariciones molestas
          if (entry.target) {
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold }
    );

    const element = ref.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [threshold]);

  return [ref, isVisible];
}

export default useScrollReveal;
