import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Radar } from "react-chartjs-2";
import { FiX } from "react-icons/fi";
import Button from "../Ui/Button.jsx";
import "../../Styles/Graficos/MovementCharts.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/* ─── Constantes de color ─── */
const COLORS = {
  primary: "#ff8c01", // Naranja deportivo característico de pases
  primaryAlpha: "rgba(255,140,1,0.18)",
  secondary: "#ff1f0d", // Coral secundario
  secondaryAlpha: "rgba(255,31,13,0.15)",
  tertiary: "#15cbc9", // Cian complementario
  tertiaryAlpha: "rgba(21,203,201,0.15)",
  neutral: "#3f3f3f",
  neutralAlpha: "rgba(63,63,63,0.15)",
  muted: "#92928e",
  ink: "#060606",
  line: "#d9d8d1",
};

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { font: { family: "Electrolize", size: 12 }, color: COLORS.muted, boxWidth: 12, padding: 16 },
    },
    tooltip: {
      backgroundColor: COLORS.ink,
      titleFont: { family: "Electrolize", size: 12 },
      bodyFont: { family: "Electrolize", size: 12 },
      padding: 10,
      cornerRadius: 0,
    },
  },
  scales: {
    x: { ticks: { font: { family: "Electrolize", size: 11 }, color: COLORS.muted }, grid: { color: COLORS.line } },
    y: { ticks: { font: { family: "Electrolize", size: 11 }, color: COLORS.muted }, grid: { color: COLORS.line } },
  },
};

/* ─── Helpers ─── */
function parseAttemptDate(ts) {
  if (!ts) return new Date();
  if (ts.toDate) return ts.toDate();
  return new Date(ts);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "short" }).format(date);
}

function formatTime(date) {
  return new Intl.DateTimeFormat("es-CO", { timeStyle: "short" }).format(date);
}

function safeNum(val) {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

/** Promedia un campo dado a través de todos los intentos para un nivel concreto */
function getPassesLevelAvg(attempts, levelIndex, field) {
  let sum = 0;
  let count = 0;
  attempts.forEach((a) => {
    const lvl = a.levels?.[levelIndex];
    if (lvl && lvl[field] != null) {
      sum += safeNum(lvl[field]);
      count++;
    }
  });
  return count ? sum / count : 0;
}

/* ─── Modal ─── */
function ChartModal({ children, onClose, headerExtra }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%", maxWidth: "1000px", height: "85vh",
          backgroundColor: "#16161a", padding: "32px", borderRadius: "16px",
          position: "relative", display: "flex", flexDirection: "column",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", gap: "16px" }}>
          <div style={{ flex: 1 }}>{headerExtra}</div>
          <Button
            onClick={onClose}
            variant="primary"
            style={{ padding: "8px", minWidth: "auto", display: "flex", alignItems: "center", justifyContent: "center", height: "40px", width: "40px" }}
          >
            <FiX style={{ fontSize: "24px", color: "#fff" }} />
          </Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
      </div>
    </div>
  );
}

/* ─── ChartCard ─── */
function ChartCard({ title, kicker, children, onClick, isExpanded }) {
  return (
    <div
      className="chart-card"
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        height: isExpanded ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="chart-card-heading">
        <p className="kicker">{kicker}</p>
        <h3 className="h-6">{title}</h3>
      </div>
      <div className="chart-canvas-wrap" style={{ position: "relative", minHeight: "260px", flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

/* ─── 1. Reacción de movimiento por nivel (Line) ─── */
function ReactionByLevelChart({ attempts, onExpand, isExpanded }) {
  const data = [0, 1, 2].map((i) => getPassesLevelAvg(attempts, i, "averageReaction").toFixed(3));

  return (
    <ChartCard kicker="Gráfica 01" title="Reacción de movimiento por nivel" onClick={onExpand} isExpanded={isExpanded}>
      <Line
        data={{
          labels: ["Nivel 1", "Nivel 2", "Nivel 3"],
          datasets: [
            {
              label: "Reacción promedio (s)",
              data,
              borderColor: COLORS.primary,
              backgroundColor: COLORS.primaryAlpha,
              borderWidth: 2,
              pointRadius: 4,
              fill: true,
              tension: 0.3,
            },
          ],
        }}
        options={{
          ...baseOptions,
          scales: {
            ...baseOptions.scales,
            y: {
              ...baseOptions.scales.y,
              title: { display: true, text: "Segundos (s)", color: COLORS.muted },
            },
          },
          plugins: {
            ...baseOptions.plugins,
            tooltip: {
              ...baseOptions.plugins.tooltip,
              callbacks: {
                label: (ctx) => `Tiempo de reacción: ${ctx.raw} s`,
              },
            },
          },
        }}
      />
    </ChartCard>
  );
}

/* ─── 2. Precisión por nivel (Bar) ─── */
function AccuracyByLevelChart({ attempts, onExpand, isExpanded }) {
  const data = [0, 1, 2].map((i) => getPassesLevelAvg(attempts, i, "accuracy").toFixed(1));

  return (
    <ChartCard kicker="Gráfica 02" title="Precisión por nivel" onClick={onExpand} isExpanded={isExpanded}>
      <Bar
        data={{
          labels: ["Nivel 1", "Nivel 2", "Nivel 3"],
          datasets: [
            {
              label: "Precisión (%)",
              data,
              backgroundColor: COLORS.tertiaryAlpha,
              borderColor: COLORS.tertiary,
              borderWidth: 2,
            },
          ],
        }}
        options={{
          ...baseOptions,
          scales: {
            ...baseOptions.scales,
            y: {
              ...baseOptions.scales.y,
              min: 0,
              max: 100,
              title: { display: true, text: "Porcentaje (%)", color: COLORS.muted },
            },
          },
          plugins: {
            ...baseOptions.plugins,
            tooltip: {
              ...baseOptions.plugins.tooltip,
              callbacks: {
                label: (ctx) => `Precisión: ${ctx.raw}%`,
              },
            },
          },
        }}
      />
    </ChartCard>
  );
}

/* ─── 3. Aciertos / Total por nivel (Bar) ─── */
function CorrectAnswersByLevelChart({ attempts, onExpand, isExpanded }) {
  const correctData = [0, 1, 2].map((i) => Math.round(getPassesLevelAvg(attempts, i, "correctAnswers")));
  const hasTotal = attempts.some((a) => a.levels?.some((lvl) => lvl.totalAttempts != null && Number(lvl.totalAttempts) > 0));
  const totalData = hasTotal
    ? [0, 1, 2].map((i) => Math.round(getPassesLevelAvg(attempts, i, "totalAttempts")))
    : null;

  return (
    <ChartCard kicker="Gráfica 03" title="Aciertos y efectividad por nivel" onClick={onExpand} isExpanded={isExpanded}>
      <Bar
        data={{
          labels: ["Nivel 1", "Nivel 2", "Nivel 3"],
          datasets: [
            {
              label: "Aciertos de pases",
              data: correctData,
              backgroundColor: COLORS.primaryAlpha,
              borderColor: COLORS.primary,
              borderWidth: 2,
            },
            ...(hasTotal
              ? [
                  {
                    label: "Intentos totales",
                    data: totalData,
                    backgroundColor: COLORS.neutralAlpha,
                    borderColor: COLORS.muted,
                    borderWidth: 1.5,
                  },
                ]
              : []),
          ],
        }}
        options={{
          ...baseOptions,
          scales: {
            ...baseOptions.scales,
            y: {
              ...baseOptions.scales.y,
              beginAtZero: true,
              ticks: { ...baseOptions.scales.y.ticks, stepSize: 1 },
              title: { display: true, text: "Cantidad de pases", color: COLORS.muted },
            },
          },
          plugins: {
            ...baseOptions.plugins,
            tooltip: {
              ...baseOptions.plugins.tooltip,
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}`,
              },
            },
          },
        }}
      />
    </ChartCard>
  );
}

/* ─── 4. Comparación histórica entre sesiones (Line) ─── */
function SessionHistoryChart({ attempts, onExpand, isExpanded }) {
  const [metric, setMetric] = useState("reaction");

  const sorted = useMemo(
    () =>
      [...attempts].sort(
        (a, b) =>
          parseAttemptDate(a.completedAt).getTime() -
          parseAttemptDate(b.completedAt).getTime()
      ),
    [attempts]
  );

  if (sorted.length < 2) {
    return (
      <ChartCard kicker="Gráfica 04" title="Comparación entre sesiones" onClick={onExpand} isExpanded={isExpanded}>
        <div className="charts-empty-state" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p className="b-3">Todavía no hay suficientes sesiones para realizar una comparación histórica.</p>
        </div>
      </ChartCard>
    );
  }

  const labels = sorted.map((a) => {
    const d = parseAttemptDate(a.completedAt);
    return `${formatDate(d)} · ${formatTime(d)}`;
  });

  const level1Data = sorted.map((a) =>
    safeNum(a.levels?.[0]?.[metric === "reaction" ? "averageReaction" : "accuracy"]).toFixed(metric === "reaction" ? 3 : 1)
  );
  const level2Data = sorted.map((a) =>
    safeNum(a.levels?.[1]?.[metric === "reaction" ? "averageReaction" : "accuracy"]).toFixed(metric === "reaction" ? 3 : 1)
  );
  const level3Data = sorted.map((a) =>
    safeNum(a.levels?.[2]?.[metric === "reaction" ? "averageReaction" : "accuracy"]).toFixed(metric === "reaction" ? 3 : 1)
  );

  const isTime = metric === "reaction";

  return (
    <ChartCard kicker="Gráfica 04" title="Comparación entre sesiones" onClick={onExpand} isExpanded={isExpanded}>
      <div
        style={{ marginBottom: "16px", display: "flex", gap: "8px", alignItems: "center" }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="b-3" style={{ color: COLORS.muted }}>Métrica:</span>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          className="exercise-select"
          style={{ width: "auto", padding: "4px 8px", fontSize: "12px" }}
        >
          <option value="reaction">Tiempo de reacción</option>
          <option value="accuracy">Precisión</option>
        </select>
      </div>
      <div style={{ flex: 1, minHeight: isExpanded ? "400px" : "220px", position: "relative" }}>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "Nivel 1",
                data: level1Data,
                borderColor: COLORS.primary,
                backgroundColor: COLORS.primaryAlpha,
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.3,
                showLine: true,
              },
              {
                label: "Nivel 2",
                data: level2Data,
                borderColor: COLORS.secondary,
                backgroundColor: COLORS.secondaryAlpha,
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.3,
                showLine: true,
              },
              {
                label: "Nivel 3",
                data: level3Data,
                borderColor: COLORS.tertiary,
                backgroundColor: COLORS.tertiaryAlpha,
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.3,
                showLine: true,
              },
            ],
          }}
          options={{
            ...baseOptions,
            scales: {
              ...baseOptions.scales,
              x: {
                ...baseOptions.scales.x,
                ticks: { ...baseOptions.scales.x.ticks, display: isExpanded },
              },
              y: {
                ...baseOptions.scales.y,
                title: { display: true, text: isTime ? "Segundos (s)" : "Porcentaje (%)", color: COLORS.muted },
                ...(isTime ? {} : { min: 0, max: 100 }),
              },
            },
            plugins: {
              ...baseOptions.plugins,
              tooltip: {
                ...baseOptions.plugins.tooltip,
                callbacks: {
                  title: (items) => {
                    const idx = items[0].dataIndex;
                    const d = parseAttemptDate(sorted[idx].completedAt);
                    return `Sesión ${idx + 1} · ${formatDate(d)} ${formatTime(d)}`;
                  },
                  label: (ctx) =>
                    `${ctx.dataset.label}: ${ctx.raw}${isTime ? " s" : "%"}`,
                },
              },
            },
          }}
        />
      </div>
    </ChartCard>
  );
}

/* ─── 5. Perfil general de rendimiento (Radar) ─── */
function OverallPerformanceRadarChart({ attempts, onExpand, isExpanded }) {
  const avgReaction = [0, 1, 2].map((i) => getPassesLevelAvg(attempts, i, "averageReaction"));
  const avgAccuracy = [0, 1, 2].map((i) => getPassesLevelAvg(attempts, i, "accuracy"));

  const globalReaction = avgReaction.reduce((s, v) => s + v, 0) / 3;
  const globalAccuracy = avgAccuracy.reduce((s, v) => s + v, 0) / 3;

  // Normalizar: menor tiempo → mayor puntuación (escala 0–100)
  const normalizeTime = (t) => Math.max(0, Math.min(100, 100 - (t / 1.5) * 100));

  const vReact = normalizeTime(globalReaction);
  const vPrec = globalAccuracy;

  // Progresión / consistencia entre niveles
  const consistency =
    avgReaction[0] > 0
      ? Math.max(0, Math.min(100, ((avgReaction[0] - avgReaction[2]) / avgReaction[0]) * 100 + 50))
      : 50;

  const precL1 = avgAccuracy[0];
  const precL3 = avgAccuracy[2];
  const perfGeneral = (vReact + vPrec) / 2;

  return (
    <ChartCard kicker="Gráfica 05" title="Perfil general de rendimiento" onClick={onExpand} isExpanded={isExpanded}>
      <Radar
        data={{
          labels: [
            "Velocidad de reacción",
            "Precisión en pases",
            "Rendimiento general",
            "Progresión entre niveles",
            "Precisión nivel 1",
            "Precisión nivel 3",
          ],
          datasets: [
            {
              label: "Perfil (0–100)",
              data: [
                vReact.toFixed(1),
                vPrec.toFixed(1),
                perfGeneral.toFixed(1),
                consistency.toFixed(1),
                precL1.toFixed(1),
                precL3.toFixed(1),
              ],
              backgroundColor: COLORS.primaryAlpha,
              borderColor: COLORS.primary,
              borderWidth: 2,
              pointRadius: 4,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              ...baseOptions.plugins.tooltip,
              callbacks: {
                label: (ctx) => `${ctx.raw} / 100`,
              },
            },
          },
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: { display: false, font: { family: "Electrolize", size: 10 }, color: COLORS.muted, backdropColor: "transparent" },
              grid: { color: COLORS.line },
              pointLabels: { font: { family: "Electrolize", size: 11 }, color: COLORS.neutral },
            },
          },
        }}
      />
    </ChartCard>
  );
}

/* ─── Exportación principal ─── */
function PassesCharts({ attempts }) {
  const [expandedChart, setExpandedChart] = useState(null);
  const [selectedSession, setSelectedSession] = useState("all");

  const sorted = useMemo(
    () =>
      [...(attempts || [])].sort(
        (a, b) =>
          parseAttemptDate(a.completedAt).getTime() -
          parseAttemptDate(b.completedAt).getTime()
      ),
    [attempts]
  );

  if (!attempts || attempts.length === 0) {
    return (
      <div className="charts-empty-state">
        <p className="b-2">
          No se encontraron sesiones de pases para este jugador.
        </p>
      </div>
    );
  }

  const display =
    selectedSession === "all" ? sorted : [sorted[Number(selectedSession)]];

  const renderExpanded = () => {
    switch (expandedChart) {
      case "c1": return <ReactionByLevelChart attempts={display} isExpanded />;
      case "c2": return <AccuracyByLevelChart attempts={display} isExpanded />;
      case "c3": return <CorrectAnswersByLevelChart attempts={display} isExpanded />;
      case "c4": return <SessionHistoryChart attempts={sorted} isExpanded />;
      case "c5": return <OverallPerformanceRadarChart attempts={display} isExpanded />;
      default: return null;
    }
  };

  const SessionSelector = (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span className="b-3" style={{ color: COLORS.muted }}>Ver sesión:</span>
      <select
        value={selectedSession}
        onChange={(e) => setSelectedSession(e.target.value)}
        className="exercise-select"
        style={{ padding: "6px 12px", minWidth: "200px" }}
      >
        <option value="all">Todas las sesiones (Promedio)</option>
        {sorted.map((a, i) => (
          <option key={i} value={i}>
            Sesión {i + 1} — {formatDate(parseAttemptDate(a.completedAt))}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="movement-charts">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <p className="charts-meta b-3" style={{ margin: 0 }}>
          {attempts.length} sesión{attempts.length !== 1 ? "es" : ""} encontrada{attempts.length !== 1 ? "s" : ""}.
          {selectedSession === "all"
            ? " Mostrando datos históricos combinados."
            : ` Mostrando Sesión ${Number(selectedSession) + 1}.`}
        </p>
        {SessionSelector}
      </div>

      <div
        className="charts-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}
      >
        <ReactionByLevelChart attempts={display} onExpand={() => setExpandedChart("c1")} />
        <AccuracyByLevelChart attempts={display} onExpand={() => setExpandedChart("c2")} />
        <CorrectAnswersByLevelChart attempts={display} onExpand={() => setExpandedChart("c3")} />
        <SessionHistoryChart attempts={sorted} onExpand={() => setExpandedChart("c4")} />
        <OverallPerformanceRadarChart attempts={display} onExpand={() => setExpandedChart("c5")} />
      </div>

      {expandedChart && (
        <ChartModal onClose={() => setExpandedChart(null)} headerExtra={SessionSelector}>
          {renderExpanded()}
        </ChartModal>
      )}
    </div>
  );
}

export default PassesCharts;