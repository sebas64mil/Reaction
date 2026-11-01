/* eslint-disable react-refresh/only-export-components */
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
);

export const COLORS = {
  primary: "#ff1f0d",
  primaryAlpha: "rgba(255,31,13,0.18)",
  secondary: "#ff8c01",
  secondaryAlpha: "rgba(255,140,1,0.18)",
  tertiary: "#15cbc9",
  tertiaryAlpha: "rgba(21,203,201,0.18)",
  neutral: "#3f3f3f",
  neutralAlpha: "rgba(63,63,63,0.18)",
  muted: "#777773",
  line: "#d9d8d1",
};

export const LEVEL_LABELS = ["Nivel 1", "Nivel 2", "Nivel 3"];

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: COLORS.neutral,
        font: { family: "Electrolize", size: 12 },
        boxWidth: 12,
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: "#060606",
      titleFont: { family: "Electrolize", size: 12 },
      bodyFont: { family: "Electrolize", size: 12 },
      padding: 10,
      cornerRadius: 4,
    },
  },
  scales: {
    x: {
      ticks: { color: COLORS.muted, font: { family: "Electrolize", size: 11 } },
      grid: { color: "rgba(0, 0, 0, 0.06)" },
    },
    y: {
      ticks: { color: COLORS.muted, font: { family: "Electrolize", size: 11 } },
      grid: { color: "rgba(0, 0, 0, 0.06)" },
    },
  },
};

export function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function levelsOf(attempt) {
  return Array.from({ length: 3 }, (_, index) => attempt?.levels?.[index] ?? null);
}

export function average(values) {
  const valid = values.filter((value) => value !== null);
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
}

export function accuracyOf(level) {
  const recorded = numberOrNull(level?.accuracy);
  if (recorded !== null) return recorded;
  const correct = numberOrNull(level?.correctAnswers);
  const total = numberOrNull(level?.totalAttempts);
  return correct !== null && total !== null && total > 0
    ? (correct / total) * 100
    : null;
}

export function sessionDate(attempt) {
  const value = attempt?.completedAt;
  const date = value?.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime())
    ? "Fecha no disponible"
    : new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function sortedAttempts(attempts = []) {
  return [...attempts].sort((a, b) => {
    const dateA = a.completedAt?.toDate ? a.completedAt.toDate() : new Date(a.completedAt);
    const dateB = b.completedAt?.toDate ? b.completedAt.toDate() : new Date(b.completedAt);
    return dateA.getTime() - dateB.getTime();
  });
}

export function SessionSelector({ attempts, selectedIndex, onChange }) {
  return (
    <label className="session-chart-selector">
      <span className="b-3">Sesión analizada</span>
      <select
        className="exercise-select"
        value={selectedIndex}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {attempts.map((attempt, index) => (
          <option value={index} key={attempt.id ?? index}>
            Sesión {index + 1} — {sessionDate(attempt)}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ChartCard({ title, children, onExpand }) {
  return (
    <article className="chart-card">
      <div className="chart-card-heading">
        <h3 className="h-6">{title}</h3>
        <button type="button" className="chart-expand-button b-3" onClick={onExpand}>
          Ampliar
        </button>
      </div>
      <div className="chart-canvas-wrap">{children}</div>
    </article>
  );
}

export function EmptyChart({ message = "No hay datos suficientes para esta gráfica." }) {
  return <p className="charts-empty-state b-2">{message}</p>;
}
