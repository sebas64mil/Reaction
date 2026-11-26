import { useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import ChartModal from "../Ui/ChartModal.jsx";
import {
  ChartCard,
  COLORS,
  EmptyChart,
  LEVEL_LABELS,
  SessionSelector,
  chartOptions,
  levelsOf,
  numberOrNull,
  sessionDate,
  sortedAttempts,
} from "./sessionChartUtils.jsx";
import "../../Styles/Graficos/MovementCharts.css";

function MovementCharts({ attempts = [] }) {
  const sorted = useMemo(() => sortedAttempts(attempts), [attempts]);
  const [selectedIndex, setSelectedIndex] = useState(Math.max(sorted.length - 1, 0));
  const [expandedChart, setExpandedChart] = useState(null);
  const selectedAttempt = sorted[selectedIndex] ?? sorted[sorted.length - 1];
  const levels = levelsOf(selectedAttempt);

  if (!sorted.length) {
    return <EmptyChart message="No hay sesiones de Alcance Reactivo disponibles." />;
  }

  const precisionData = {
    labels: LEVEL_LABELS,
    datasets: [
      {
        label: "Mano izquierda (%)",
        data: levels.map((level) => numberOrNull(level?.leftHandAccuracy)),
        backgroundColor: COLORS.primaryAlpha,
        borderColor: COLORS.primary,
        borderWidth: 2,
      },
      {
        label: "Mano derecha (%)",
        data: levels.map((level) => numberOrNull(level?.rightHandAccuracy)),
        backgroundColor: COLORS.secondaryAlpha,
        borderColor: COLORS.secondary,
        borderWidth: 2,
      },
      {
        label: "Combinada (%)",
        data: levels.map((level) => numberOrNull(level?.combinedAccuracy)),
        backgroundColor: COLORS.tertiaryAlpha,
        borderColor: COLORS.tertiary,
        borderWidth: 2,
      },
    ],
  };

  const reactionData = {
    labels: LEVEL_LABELS,
    datasets: [
      {
        label: "Mano izquierda (s)",
        data: levels.map((level) => numberOrNull(level?.leftHandReaction)),
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryAlpha,
        pointRadius: 5,
        tension: 0.3,
      },
      {
        label: "Mano derecha (s)",
        data: levels.map((level) => numberOrNull(level?.rightHandReaction)),
        borderColor: COLORS.secondary,
        backgroundColor: COLORS.secondaryAlpha,
        pointRadius: 5,
        tension: 0.3,
      },
    ],
  };

  const correctData = levels.map((level) => numberOrNull(level?.correctAnswers));
  const errorData = levels.map((level) => {
    const correct = numberOrNull(level?.correctAnswers);
    const total = numberOrNull(level?.totalAttempts);
    return correct !== null && total !== null && total >= correct ? total - correct : null;
  });
  const hasDistribution = correctData.some((value, index) => value !== null && errorData[index] !== null);
  const distributionData = {
    labels: LEVEL_LABELS,
    datasets: [
      {
        label: "Correctas",
        data: correctData,
        backgroundColor: COLORS.tertiaryAlpha,
        borderColor: COLORS.tertiary,
        borderWidth: 2,
      },
      {
        label: "Incorrectas",
        data: errorData,
        backgroundColor: COLORS.primaryAlpha,
        borderColor: COLORS.primary,
        borderWidth: 2,
      },
    ],
  };

  const renderChart = (chart) => {
    const options = {
      ...chartOptions,
      scales: {
        ...chartOptions.scales,
        y: {
          ...chartOptions.scales.y,
          beginAtZero: true,
          ...(chart === "precision" ? { min: 0, max: 100 } : {}),
          stacked: chart === "distribution",
          title: {
            display: true,
            text: chart === "precision" ? "Porcentaje (%)" : chart === "reaction" ? "Segundos (s)" : "Respuestas",
          },
        },
        x: { ...chartOptions.scales.x, stacked: chart === "distribution" },
      },
    };
    if (chart === "precision") return <Bar data={precisionData} options={options} />;
    if (chart === "reaction") return <Line data={reactionData} options={options} />;
    return hasDistribution ? (
      <Bar data={distributionData} options={options} />
    ) : (
      <EmptyChart message="No hay aciertos e intentos totales disponibles para calcular errores." />
    );
  };

  const expanded = expandedChart ? (
    <ChartModal
      title={`Alcance Reactivo · ${sessionDate(selectedAttempt)}`}
      onClose={() => setExpandedChart(null)}
      headerExtra={<SessionSelector attempts={sorted} selectedIndex={selectedIndex} onChange={setSelectedIndex} />}
    >
      <div className="chart-modal-canvas">{renderChart(expandedChart)}</div>
    </ChartModal>
  ) : null;

  return (
    <div className="movement-charts">
      <div className="session-chart-toolbar">
        <p className="charts-meta b-3">Analizando una sola sesión: {sessionDate(selectedAttempt)}</p>
        <SessionSelector attempts={sorted} selectedIndex={selectedIndex} onChange={setSelectedIndex} />
      </div>
      <div className="charts-grid session-charts-grid">
        <ChartCard title="Precisión por mano" onExpand={() => setExpandedChart("precision")}>
          {renderChart("precision")}
        </ChartCard>
        <ChartCard title="Tiempo de reacción por mano" onExpand={() => setExpandedChart("reaction")}>
          {renderChart("reaction")}
        </ChartCard>
        <ChartCard title="Distribución de respuestas" onExpand={() => setExpandedChart("distribution")}>
          {renderChart("distribution")}
        </ChartCard>
      </div>
      {expanded}
    </div>
  );
}

export default MovementCharts;
