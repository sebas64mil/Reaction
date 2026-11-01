import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import Button from "./Button.jsx";

/**
 * ChartModal
 * Modal para ampliación de gráficas estilo analista en tema claro.
 * Bloquea el scroll del body, permite scroll interno y responde a Escape.
 */
function ChartModal({ children, onClose, headerExtra, title }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(6, 6, 8, 0.75)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1080px",
          maxHeight: "90vh",
          backgroundColor: "var(--color-surface-paper, #f5f4ef)",
          border: "1px solid var(--color-surface-line, #d9d8d1)",
          padding: "28px 32px",
          borderRadius: "12px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35)",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            gap: "16px",
            position: "sticky",
            top: 0,
            zIndex: 2,
            backgroundColor: "var(--color-surface-paper, #f5f4ef)",
            paddingBottom: "12px",
            borderBottom: "1px solid var(--color-surface-line, #d9d8d1)",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {title && (
              <h3 className="h-5" style={{ margin: "0 0 4px 0", color: "var(--ink, #060606)" }}>
                {title}
              </h3>
            )}
            {headerExtra}
          </div>
          <Button
            onClick={onClose}
            variant="primary"
            style={{
              padding: "8px",
              minWidth: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "38px",
              width: "38px",
              borderRadius: "50%",
            }}
            title="Cerrar modal (Esc)"
          >
            <FiX style={{ fontSize: "20px", color: "#fff" }} />
          </Button>
        </div>

        <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
      </div>
    </div>
  );
}

export default ChartModal;
