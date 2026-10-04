import "../../../Styles/Sections/Dashboard/DashboardResultsSection.css";

function DashboardResultsSection({ repetitions, completedAt }) {
  const latest = repetitions[repetitions.length - 1];
  const accuracy = latest
    ? latest.combinedAccuracy.toFixed(1)
    : null;
  const completedDate = completedAt
    ? new Intl.DateTimeFormat("es-CO", {
        dateStyle: "long",
      }).format(new Date(completedAt))
    : null;
  const completedTime = completedAt
    ? new Intl.DateTimeFormat("es-CO", {
        timeStyle: "short",
      }).format(new Date(completedAt))
    : null;

  return (
    <section className="dashboard-panel dashboard-results-section">
      <div className="dashboard-panel-heading">
        <div>
          <p className="kicker">03 / Lectura</p>
          <h2 className="h-4">Resultados del jugador.</h2>
        </div>
        <span className="dashboard-panel-counter b-3">
          {repetitions.length ? "Datos disponibles" : "Sin datos todavía"}
        </span>
      </div>

      {!latest ? (
        <div className="results-empty-state">
          <h3 className="h-5">Aquí aparecerán las métricas.</h3>
          <p className="b-2">
            Registra una repetición para consultar reacción promedio, aciertos,
            precisión y el comportamiento de cada mano.
          </p>
        </div>
      ) : (
        <>
          <div className="result-highlight-grid">
            <div className="result-highlight">
              <span className="b-3">Reacción promedio</span>
              <strong className="h-3">
                {latest.averageReaction.toFixed(2)}s
              </strong>
            </div>
            <div className="result-highlight">
              <span className="b-3">Aciertos</span>
              <strong className="h-3">
                {latest.correctAnswers}/{latest.totalAttempts}
              </strong>
            </div>
            <div className="result-highlight">
              <span className="b-3">Precisión general</span>
              <strong className="h-3">{accuracy}%</strong>
            </div>
          </div>
          <div className="hand-results-grid">
            <div className="hand-result">
              <span className="b-3">Mano izquierda</span>
              <strong className="h-5">{latest.leftHandReaction.toFixed(2)}s</strong>
              <small className="b-3">Precisión {latest.leftHandAccuracy.toFixed(1)}%</small>
            </div>
            <div className="hand-result">
              <span className="b-3">Mano derecha</span>
              <strong className="h-5">{latest.rightHandReaction.toFixed(2)}s</strong>
              <small className="b-3">Precisión {latest.rightHandAccuracy.toFixed(1)}%</small>
            </div>
          </div>
          <div className="result-session-meta">
            <div>
              <span className="b-3">Fecha de finalización</span>
              <strong className="b-2">{completedDate}</strong>
            </div>
            <div>
              <span className="b-3">Hora de finalización</span>
              <strong className="b-2">{completedTime}</strong>
            </div>
          </div>
          <p className="results-note b-3">
            Repeticiones registradas: {repetitions.length}. Las gráficas se
            conectarán en una siguiente iteración.
          </p>
        </>
      )}
    </section>
  );
}

export default DashboardResultsSection;
