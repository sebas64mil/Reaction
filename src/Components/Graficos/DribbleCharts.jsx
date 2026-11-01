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
import { FiX, FiActivity, FiTarget, FiZap, FiCheckCircle } from "react-icons/fi";
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

/* ─── Constantes de color para Drible ─── */
const COLORS = {
  primary: "#15cbc9", // Cian ágil representativo de velocidad de drible
  primaryAlpha: "rgba(21, 203, 201, 0.18)",
  secondary: "#ff8c01", // Naranja deportivo
  secondaryAlpha: "rgba(255, 140, 1, 0.15)",
  tertiary: "#ff1f0d", // Coral
  tertiaryAlpha: "rgba(255, 31, 13, 0.15)",
  neutral: "#3f3f3f",
  neutralAlpha: "rgba(63, 63, 63, 0.15)",
  muted: "#92928e",
  ink: "#060606",
  line: "#d9d8d1",
};

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        font: { family: "Electrolize", size: 12 },
        color: COLORS.muted,
        boxWidth: 12,
        padding: 16,
      },
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
    x: {
      ticks: { font: { family: "Electrolize", size: 11 }, color: COLORS.muted },
      grid: { color: COLORS.line },
    },
    y: {
      ticks: { font: { family: "Electrolize", size: 11 }, color: COLORS.muted },
      grid: { color: COLORS.line },
    },
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

/** Promedia un campo dado a través de los intentos seleccionados para un nivel concreto */
function getDribbleLevelAvg(attempts, levelIndex, field) {
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

/* ─── Modal Expandido ─── */
function ChartModal({ children, onClose, headerExtra }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
          width: "100%",
          maxWidth: "1000px",
          height: "85vh",
          backgroundColor: "#16161a",
          padding: "32px",
          borderRadius: "16px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            gap: "16px",
          }}
        >
          <div style={{ flex: 1 }}>{headerExtra}</div>
          <Button
            onClick={onClose}
            variant="primary"
            style={{
              padding: "8px",
              minWidth: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "40px",
              width: "40px",
            }}
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
      <div
        className="chart-canvas-wrap"
        style={{ position: "relative", minHeight: "260px", flex: 1 }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─── 1. Reacción promedio de drible por nivel (Line) ─── */
function ReactionByLevelChart({ attempts, onExpand, isExpanded }) {
  const data = [0, 1, 2].map((i) =>
    getDribbleLevelAvg(attempts, i, "averageReaction").toFixed(3)
  );

  return (
    <ChartCard
      kicker="Gráfica 01"
      title="Tiempo de reacción por nivel"
      onClick={onExpand}
      isExpanded={isExpanded}
    >
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
              pointRadius: 5,
              pointHoverRadius: 7,
              fill: true,
              tension: 0.35,
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
                label: (ctx) => `Tiempo promedio: ${ctx.raw} s`,
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
  const data = [0, 1, 2].map((i) =>
    getDribbleLevelAvg(attempts, i, "accuracy").toFixed(1)
  );

  return (
    <ChartCard
      kicker="Gráfica 02"
      title="Precisión por nivel"
      onClick={onExpand}
      isExpanded={isExpanded}
    >
      <Bar
        data={{
          labels: ["Nivel 1", "Nivel 2", "Nivel 3"],
          datasets: [
            {
              label: "Precisión (%)",
              data,
              backgroundColor: COLORS.secondaryAlpha,
              borderColor: COLORS.secondary,
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

/* ─── 3. Aciertos vs Total de Reacciones por nivel (Grouped Bar) ─── */
function HitsVsTotalChart({ attempts, onExpand, isExpanded }) {
  const correctData = [0, 1, 2].map((i) =>
    Math.round(getDribbleLevelAvg(attempts, i, "correctAnswers"))
  );
  const hasTotal = attempts.some((a) =>
    a.levels?.some((lvl) => lvl.totalAttempts != null && Number(lvl.totalAttempts) > 0)
  );
  const totalData = hasTotal
    ? [0, 1, 2].map((i) =>
        Math.round(getDribbleLevelAvg(attempts, i, "totalAttempts"))
      )
    : null;

  return (
    <ChartCard
      kicker="Gráfica 03"
      title="Aciertos y total de reacciones"
      onClick={onExpand}
      isExpanded={isExpanded}
    >
      <Bar
        data={{
          labels: ["Nivel 1", "Nivel 2", "Nivel 3"],
          datasets: [
            {
              label: "Aciertos",
              data: correctData,
              backgroundColor: COLORS.primaryAlpha,
              borderColor: COLORS.primary,
              borderWidth: 2,
            },
            ...(hasTotal
              ? [
                  {
                    label: "Total de reacciones",
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
              title: { display: true, text: "Cantidad", color: COLORS.muted },
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
      <ChartCard
        kicker="Gráfica 04"
        title="Evolución histórica entre sesiones"
        onClick={onExpand}
        isExpanded={isExpanded}
      >
        <div
          className="charts-empty-state"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <p className="b-3" style={{ color: COLORS.muted }}>
            Registra al menos 2 sesiones para visualizar la evolución histórica del drible.
          </p>
        </div>
      </ChartCard>
    );
  }

  const labels = sorted.map((a) => {
    const d = parseAttemptDate(a.completedAt);
    return `${formatDate(d)} · ${formatTime(d)}`;
  });

  const level1Data = sorted.map((a) =>
    safeNum(
      a.levels?.[0]?.[metric === "reaction" ? "averageReaction" : "accuracy"]
    ).toFixed(metric === "reaction" ? 3 : 1)
  );
  const level2Data = sorted.map((a) =>
    safeNum(
      a.levels?.[1]?.[metric === "reaction" ? "averageReaction" : "accuracy"]
    ).toFixed(metric === "reaction" ? 3 : 1)
  );
  const level3Data = sorted.map((a) =>
    safeNum(
      a.levels?.[2]?.[metric === "reaction" ? "averageReaction" : "accuracy"]
    ).toFixed(metric === "reaction" ? 3 : 1)
  );

  return (
    <ChartCard
      kicker="Gráfica 04"
      title="Evolución histórica entre sesiones"
      onClick={onExpand}
      isExpanded={isExpanded}
    >
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="b-3" style={{ color: COLORS.muted }}>
          Métrica:
        </span>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          className="exercise-select"
          style={{ width: "auto", padding: "4px 8px", fontSize: "12px" }}
        >
          <option value="reaction">Tiempo de reacción (s)</option>
          <option value="accuracy">Precisión (%)</option>
        </select>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: isExpanded ? "400px" : "220px",
          position: "relative",
        }}
      >
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
              y: {
                ...baseOptions.scales.y,
                title: {
                  display: true,
                  text: metric === "reaction" ? "Segundos (s)" : "Porcentaje (%)",
                  color: COLORS.muted,
                },
                ...(metric === "accuracy" ? { min: 0, max: 100 } : {}),
              },
            },
            plugins: {
              ...baseOptions.plugins,
              tooltip: {
                ...baseOptions.plugins.tooltip,
                callbacks: {
                  label: (ctx) =>
                    `${ctx.dataset.label}: ${ctx.raw} ${
                      metric === "reaction" ? "s" : "%"
                    }`,
                },
              },
            },
          }}
        />
      </div>
    </ChartCard>
  );
}

/* ─── 5. Radar de Rendimiento Global en Drible ─── */
function DribblePerformanceRadarChart({ attempts, onExpand, isExpanded }) {
  const avgReaction =
    [0, 1, 2].reduce(
      (acc, i) => acc + getDribbleLevelAvg(attempts, i, "averageReaction"),
      0
    ) / 3;

  const avgAccuracy =
    [0, 1, 2].reduce(
      (acc, i) => acc + getDribbleLevelAvg(attempts, i, "accuracy"),
      0
    ) / 3;

  const totalHits = [0, 1, 2].reduce(
    (acc, i) => acc + getDribbleLevelAvg(attempts, i, "correctAnswers"),
    0
  );

  const totalReactions = [0, 1, 2].reduce(
    (acc, i) => acc + getDribbleLevelAvg(attempts, i, "totalAttempts"),
    0
  );

  // Escala normalizada de 0 a 100 para el radar
  const reactionScore = Math.max(0, Math.min(100, Math.round((2.0 - avgReaction) * 50)));
  const accuracyScore = Math.round(avgAccuracy);
  const efficiencyScore = totalReactions > 0 ? Math.round((totalHits / totalReactions) * 100) : accuracyScore;
  const consistencyScore = Math.max(
    0,
    Math.min(
      100,
      100 -
        Math.abs(
          getDribbleLevelAvg(attempts, 0, "accuracy") -
            getDribbleLevelAvg(attempts, 2, "accuracy")
        )
    )
  );
  const volumeScore = Math.min(100, Math.round(totalHits * 2));

  return (
    <ChartCard
      kicker="Gráfica 05"
      title="Perfil de rendimiento en drible"
      onClick={onExpand}
      isExpanded={isExpanded}
    >
      <Radar
        data={{
          labels: [
            "Velocidad de reacción",
            "Precisión general",
            "Efectividad de aciertos",
            "Consistencia entre niveles",
            "Volumen de control",
          ],
          datasets: [
            {
              label: "Índice de desempeño",
              data: [
                reactionScore,
                accuracyScore,
                efficiencyScore,
                consistencyScore,
                volumeScore,
              ],
              borderColor: COLORS.primary,
              backgroundColor: COLORS.primaryAlpha,
              borderWidth: 2,
              pointBackgroundColor: COLORS.secondary,
              pointRadius: 4,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: { display: false, stepSize: 20 },
              grid: { color: COLORS.line },
              pointLabels: {
                font: { family: "Electrolize", size: 11 },
                color: COLORS.muted,
              },
              angleLines: { color: COLORS.line },
            },
          },
          plugins: {
            ...baseOptions.plugins,
            tooltip: {
              ...baseOptions.plugins.tooltip,
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} / 100`,
              },
            },
          },
        }}
      />
    </ChartCard>
  );
}

/* ─── Componente Principal DribbleCharts ─── */
function DribbleCharts({ attempts }) {
  const [selectedSession, setSelectedSession] = useState("all");
  const [expandedChart, setExpandedChart] = useState(null);

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
          No se encontraron sesiones de drible registradas para este jugador en Firebase.
        </p>
      </div>
    );
  }

  const display =
    selectedSession === "all" ? sorted : [sorted[Number(selectedSession)]];

  const renderExpanded = () => {
    switch (expandedChart) {
      case "c1":
        return <ReactionByLevelChart attempts={display} isExpanded />;
      case "c2":
        return <AccuracyByLevelChart attempts={display} isExpanded />;
      case "c3":
        return <HitsVsTotalChart attempts={display} isExpanded />;
      case "c4":
        return <SessionHistoryChart attempts={sorted} isExpanded />;
      case "c5":
        return <DribblePerformanceRadarChart attempts={display} isExpanded />;
      default:
        return null;
    }
  };

  const SessionSelector = (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span className="b-3" style={{ color: COLORS.muted }}>
        Ver sesión:
      </span>
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

  // Métricas rápidas para verificar la lectura
  const overallAvgReaction = (
    [0, 1, 2].reduce(
      (acc, i) => acc + getDribbleLevelAvg(display, i, "averageReaction"),
      0
    ) / 3
  ).toFixed(2);

  const overallAvgAccuracy = (
    [0, 1, 2].reduce(
      (acc, i) => acc + getDribbleLevelAvg(display, i, "accuracy"),
      0
    ) / 3
  ).toFixed(1);

  const totalHits = [0, 1, 2].reduce(
    (acc, i) => acc + getDribbleLevelAvg(display, i, "correctAnswers"),
    0
  );

  const totalAttemptsCount = [0, 1, 2].reduce(
    (acc, i) => acc + getDribbleLevelAvg(display, i, "totalAttempts"),
    0
  );

  return (
    <div className="movement-charts">
      {/* Barra superior con metadatos y selector de sesión */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "18px",
        }}
      >
        <p className="charts-meta b-3" style={{ margin: 0 }}>
          {attempts.length} sesión{attempts.length !== 1 ? "es" : ""} leída{attempts.length !== 1 ? "s" : ""} desde Firebase.
          {selectedSession === "all"
            ? " Mostrando promedio combinado."
            : ` Mostrando datos de la Sesión ${Number(selectedSession) + 1}.`}
        </p>
        {SessionSelector}
      </div>

      {/* Resumen rápido de lectura de datos de Firebase */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--line, #d9d8d1)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <FiZap style={{ color: COLORS.primary, fontSize: "20px" }} />
          <div>
            <span className="b-3" style={{ color: COLORS.muted, display: "block" }}>
              Reacción promedio
            </span>
            <strong className="h-5" style={{ color: "#ffffff" }}>
              {overallAvgReaction}s
            </strong>
          </div>
        </div>

        <div
          style={{
            padding: "14px 18px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--line, #d9d8d1)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <FiTarget style={{ color: COLORS.secondary, fontSize: "20px" }} />
          <div>
            <span className="b-3" style={{ color: COLORS.muted, display: "block" }}>
              Precisión media
            </span>
            <strong className="h-5" style={{ color: "#ffffff" }}>
              {overallAvgAccuracy}%
            </strong>
          </div>
        </div>

        <div
          style={{
            padding: "14px 18px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--line, #d9d8d1)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <FiCheckCircle style={{ color: COLORS.tertiary, fontSize: "20px" }} />
          <div>
            <span className="b-3" style={{ color: COLORS.muted, display: "block" }}>
              Aciertos totales
            </span>
            <strong className="h-5" style={{ color: "#ffffff" }}>
              {Math.round(totalHits)}
            </strong>
          </div>
        </div>

        <div
          style={{
            padding: "14px 18px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--line, #d9d8d1)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <FiActivity style={{ color: "#ffffff", fontSize: "20px" }} />
          <div>
            <span className="b-3" style={{ color: COLORS.muted, display: "block" }}>
              Total reacciones
            </span>
            <strong className="h-5" style={{ color: "#ffffff" }}>
              {Math.round(totalAttemptsCount)}
            </strong>
          </div>
        </div>
      </div>

      {/* Grid de gráficas */}
      <div
        className="charts-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
        }}
      >
        <ReactionByLevelChart
          attempts={display}
          onExpand={() => setExpandedChart("c1")}
        />
        <AccuracyByLevelChart
          attempts={display}
          onExpand={() => setExpandedChart("c2")}
        />
        <HitsVsTotalChart
          attempts={display}
          onExpand={() => setExpandedChart("c3")}
        />
        <SessionHistoryChart
          attempts={sorted}
          onExpand={() => setExpandedChart("c4")}
        />
        <DribblePerformanceRadarChart
          attempts={display}
          onExpand={() => setExpandedChart("c5")}
        />
      </div>

      {expandedChart && (
        <ChartModal
          onClose={() => setExpandedChart(null)}
          headerExtra={SessionSelector}
        >
          {renderExpanded()}
        </ChartModal>
      )}
    </div>
  );
}

export default DribbleCharts;
