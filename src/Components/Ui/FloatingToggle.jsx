import { FiDatabase, FiEye, FiEyeOff } from "react-icons/fi";
import "../../Styles/Ui/FloatingToggle.css";

/**
 * FloatingToggle
 * Componente flotante fijado en la esquina inferior derecha.
 * Permite alternar la visibilidad de secciones (como el panel de escritura / simulación)
 * de forma modular y desacoplada.
 */
function FloatingToggle({
  isActive = false,
  onToggle,
  label = "Simulador de registro",
  activeLabel = "Visible",
  inactiveLabel = "Oculto",
  className = "",
}) {
  return (
    <div
      className={`floating-toggle-container ${isActive ? "is-active" : "is-inactive"} ${className}`}
      role="region"
      aria-label="Control flotante de visualización"
    >
      <button
        type="button"
        className="floating-toggle-pill"
        onClick={onToggle}
        role="switch"
        aria-checked={isActive}
        title={isActive ? "Ocultar panel de registro y simulación" : "Mostrar panel de registro y simulación"}
      >
        <span className="floating-toggle-icon-wrap">
          {isActive ? <FiEye className="floating-toggle-icon" /> : <FiEyeOff className="floating-toggle-icon" />}
        </span>

        <div className="floating-toggle-text-wrap">
          <span className="floating-toggle-title b-3">{label}</span>
          <span className="floating-toggle-badge b-3">
            {isActive ? activeLabel : inactiveLabel}
          </span>
        </div>

        <div className="floating-toggle-switch">
          <div className="floating-toggle-thumb" />
        </div>
      </button>
    </div>
  );
}

export default FloatingToggle;
