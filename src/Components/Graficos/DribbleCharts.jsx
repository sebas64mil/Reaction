import { useMemo, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import ChartModal from "../Ui/ChartModal.jsx";
import {
  ChartCard,
  COLORS,
  EmptyChart,
  LEVEL_LABELS,
  SessionSelector,
  average,
  chartOptions,
  levelsOf,
  numberOrNull,
  sessionDate,
  sortedAttempts,
} from "./sessionChartUtils.jsx";
import "../../Styles/Graficos/MovementCharts.css";

function DribbleCharts({ attempts = [] }) {
  const sorted = useMemo(() => sortedAttempts(attempts), [attempts]);
  const [selectedIndex, setSelectedIndex] = useState(Math.max(sorted.length - 1, 0));
  const [expandedChart, setExpandedChart] = useState(null);
  const selectedAttempt = sorted[selectedIndex] ?? sorted[sorted.length - 1];
  const levels = levelsOf(selectedAttempt);

  if (!sorted.length) return <EmptyChart message="No hay sesiones de drible disponibles." />;

  const accuracy = levels.map((level) => numberOrNull(level?.accuracy));
  const reaction = levels.map((level) => numberOrNull(level?.averageReaction));
  const sessionAccuracy = average(accuracy);
  const doughnutData = sessionAccuracy === null
    ? null
    : {
        labels: ["Correctas", "Incorrectas"],
        datasets: [{
          data: [sessionAccuracy, 100 - sessionAccuracy],
          backgroundColor: [COLORS.tertiary, COLORS.primary],
          borderColor: "#f5f4ef",
          borderWidth: 3,
        }],
      };

  const renderChart = (chart) => {
    if (chart === "accuracy") {
      return (
        <Bar
          data={{ labels: LEVEL_LABELS, datasets: [{ label: "Precisión (%)", data: accuracy, backgroundColor: COLORS.secondaryAlpha, borderColor: COLORS.secondary, borderWidth: 2 }] }}
          options={{
            ...chartOptions,
            indexAxis: "y",
            scales: {
              ...chartOptions.scales,
              x: { ...chartOptions.scales.x, min: 0, max: 100, title: { display: true, text: "Porcentaje (%)" } },
            },
          }}
        />
      );
    }
    if (chart === "reaction") {
      return (
        <Line
          data={{ labels: LEVEL_LABELS, datasets: [{ label: "Tiempo promedio (s)", data: reaction, borderColor: COLORS.primary, backgroundColor: COLORS.primaryAlpha, pointRadius: 5, tension: 0.3 }] }}
          options={{ ...chartOptions, scales: { ...chartOptions.scales, y: { ...chartOptions.scales.y, beginAtZero: true, title: { display: true, text: "Segundos (s)" } } } }}
        />
      );
    }
    return doughnutData ? (
      <Doughnut
        data={doughnutData}
        options={{
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            tooltip: { ...chartOptions.plugins.tooltip, callbacks: { label: (context) => `${context.label}: ${context.raw.toFixed(1)}%` } },
          },
        }}
      />
    ) : <EmptyChart message="No hay precisiones registradas para calcular la distribución." />;
  };

  const expanded = expandedChart ? (
    <ChartModal
      title={`Drible · ${sessionDate(selectedAttempt)}`}
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
        <ChartCard title="Precisión por nivel" onExpand={() => setExpandedChart("accuracy")}>{renderChart("accuracy")}</ChartCard>
        <ChartCard title="Tiempo de reacción por nivel" onExpand={() => setExpandedChart("reaction")}>{renderChart("reaction")}</ChartCard>
        <ChartCard title="Distribución de precisión" onExpand={() => setExpandedChart("distribution")}>{renderChart("distribution")}</ChartCard>
      </div>
      {expanded}
    </div>
  );
}

export default DribbleCharts;
