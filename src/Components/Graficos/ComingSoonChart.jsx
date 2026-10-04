import "../../Styles/Graficos/ComingSoonChart.css";

const exerciseLabels = {
  lights: "Luces",
  passes: "Pases",
  dribbling: "Drible",
};

function ComingSoonChart({ exerciseId }) {
  const label = exerciseLabels[exerciseId] ?? exerciseId;

  return (
    <div className="coming-soon-chart">
      <div className="coming-soon-mark">
        <span className="coming-soon-symbol">—</span>
      </div>
      <h3 className="h-5">{label} esta en proceso.</h3>
      <p className="b-2">
        Este ejercicio aun no tiene datos reales disponibles. Las graficas de{" "}
        <strong>{label.toLowerCase()}</strong> apareceran aqui en cuanto el
        modulo este listo.
      </p>
      <div className="coming-soon-pills">
        <span className="coming-soon-pill">Modulo en desarrollo</span>
        <span className="coming-soon-pill">Proximamente</span>
      </div>
    </div>
  );
}

export default ComingSoonChart;
