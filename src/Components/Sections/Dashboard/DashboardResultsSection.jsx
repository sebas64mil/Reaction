import "../../../Styles/Sections/Dashboard/DashboardResultsSection.css";

function DashboardResultsSection({ repetitions }) {
  const latest = repetitions[repetitions.length - 1];
  const accuracy = latest
    ? Math.round((latest.hits / latest.attempts) * 100)
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
              <strong className="h-3">{latest.reaction.toFixed(2)}s</strong>
            </div>
            <div className="result-highlight">
              <span className="b-3">Aciertos</span>
              <strong className="h-3">
                {latest.hits}/{latest.attempts}
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
              <strong className="h-5">{latest.leftReaction.toFixed(2)}s</strong>
              <small className="b-3">Precisión {latest.leftAccuracy}%</small>
            </div>
            <div className="hand-result">
              <span className="b-3">Mano derecha</span>
              <strong className="h-5">{latest.rightReaction.toFixed(2)}s</strong>
              <small className="b-3">Precisión {latest.rightAccuracy}%</small>
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
