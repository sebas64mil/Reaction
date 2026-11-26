import { useMemo, useState } from "react";
import { Bar, Line, Radar } from "react-chartjs-2";
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

function PassesCharts({ attempts = [] }) {
  const sorted = useMemo(() => sortedAttempts(attempts), [attempts]);
  const [selectedIndex, setSelectedIndex] = useState(Math.max(sorted.length - 1, 0));
  const [expandedChart, setExpandedChart] = useState(null);
  const selectedAttempt = sorted[selectedIndex] ?? sorted[sorted.length - 1];
  const levels = levelsOf(selectedAttempt);

  if (!sorted.length) return <EmptyChart message="No hay sesiones de Captura Selectiva disponibles." />;

  const correct = levels.map((level) => numberOrNull(level?.correctAnswers));
  const errors = levels.map((level) => {
    const hits = numberOrNull(level?.correctAnswers);
    const total = numberOrNull(level?.totalAttempts);
    return hits !== null && total !== null && total >= hits ? total - hits : null;
  });
  const hasDistribution = correct.some((value, index) => value !== null && errors[index] !== null);
  const reaction = levels.map((level) => numberOrNull(level?.averageReaction));
  const precision = levels.map((level) => numberOrNull(level?.accuracy));

  const renderChart = (chart) => {
    if (chart === "responses") {
      return hasDistribution ? (
        <Bar
          data={{
            labels: LEVEL_LABELS,
            datasets: [
              { label: "Correctas", data: correct, backgroundColor: COLORS.tertiaryAlpha, borderColor: COLORS.tertiary, borderWidth: 2 },
              { label: "Incorrectas", data: errors, backgroundColor: COLORS.primaryAlpha, borderColor: COLORS.primary, borderWidth: 2 },
            ],
          }}
          options={{
            ...chartOptions,
            scales: {
              ...chartOptions.scales,
              x: { ...chartOptions.scales.x, stacked: true },
              y: { ...chartOptions.scales.y, stacked: true, beginAtZero: true, title: { display: true, text: "Respuestas" } },
            },
          }}
        />
      ) : <EmptyChart message="No hay intentos totales disponibles para calcular respuestas incorrectas." />;
    }
    if (chart === "reaction") {
      return (
        <Line
          data={{ labels: LEVEL_LABELS, datasets: [{ label: "Tiempo promedio (s)", data: reaction, borderColor: COLORS.primary, backgroundColor: COLORS.primaryAlpha, pointRadius: 5, tension: 0.3 }] }}
          options={{ ...chartOptions, scales: { ...chartOptions.scales, y: { ...chartOptions.scales.y, beginAtZero: true, title: { display: true, text: "Segundos (s)" } } } }}
        />
      );
    }
    return (
      <Radar
        data={{ labels: LEVEL_LABELS, datasets: [{ label: "Precisión (%)", data: precision, borderColor: COLORS.tertiary, backgroundColor: COLORS.tertiaryAlpha, borderWidth: 2, pointRadius: 4 }] }}
        options={{
          ...chartOptions,
          scales: { r: { min: 0, max: 100, ticks: { color: COLORS.muted }, grid: { color: COLORS.line }, pointLabels: { color: COLORS.neutral, font: { family: "Electrolize", size: 11 } } } },
        }}
      />
    );
  };

  const expanded = expandedChart ? (
    <ChartModal
      title={`Captura Selectiva · ${sessionDate(selectedAttempt)}`}
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
        <ChartCard title="Respuestas por nivel" onExpand={() => setExpandedChart("responses")}>{renderChart("responses")}</ChartCard>
        <ChartCard title="Tiempo de reacción por nivel" onExpand={() => setExpandedChart("reaction")}>{renderChart("reaction")}</ChartCard>
        <ChartCard title="Precisión por nivel" onExpand={() => setExpandedChart("precision")}>{renderChart("precision")}</ChartCard>
      </div>
      {expanded}
    </div>
  );
}

export default PassesCharts;
