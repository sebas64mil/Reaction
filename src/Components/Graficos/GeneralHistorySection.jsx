import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  FiActivity,
  FiZap,
  FiTarget,
  FiMaximize2,
  FiTrendingUp,
} from "react-icons/fi";
import ChartModal from "../Ui/ChartModal.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EXERCISE_COLORS = {
  movement: {
    name: "Alcance Reactivo",
    color: "#ff1f0d",
    bgColor: "rgba(255, 31, 13, 0.12)",
  },
  lights: {
    name: "Sigue la Luz",
    color: "#ff8c01",
    bgColor: "rgba(255, 140, 1, 0.12)",
  },
  passes: {
    name: "Captura Selectiva",
    color: "#15cbc9",
    bgColor: "rgba(21, 203, 201, 0.12)",
  },
  dribble: {
    name: "Control de Dribleo",
    color: "#a855f7",
    bgColor: "rgba(168, 85, 247, 0.12)",
  },
};

function parseAttemptDate(ts) {
  if (!ts) return new Date();
  if (ts.toDate) return ts.toDate();
  return new Date(ts);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("es-CO", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function safeNum(val) {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

/** Calcula la precisión promedio de un attempt dado (0-100) */
function getAttemptAccuracy(attempt) {
  if (!attempt.levels || attempt.levels.length === 0) return null;
  let sum = 0;
  let count = 0;

  attempt.levels.forEach((lvl) => {
    let acc = null;
    if (lvl.accuracy != null && lvl.accuracy !== "") {
      acc = safeNum(lvl.accuracy);
    } else if (lvl.combinedAccuracy != null && lvl.combinedAccuracy !== "") {
      acc = safeNum(lvl.combinedAccuracy);
    } else if (lvl.correctAnswers != null && lvl.totalAttempts && Number(lvl.totalAttempts) > 0) {
      acc = (safeNum(lvl.correctAnswers) / safeNum(lvl.totalAttempts)) * 100;
    }
    if (acc != null && !isNaN(acc)) {
      sum += acc;
      count++;
    }
  });

  return count > 0 ? Number((sum / count).toFixed(1)) : null;
}

/** Calcula el tiempo de reacción promedio de un attempt dado en segundos */
function getAttemptAverageReaction(attempt) {
  if (!attempt.levels || attempt.levels.length === 0) return null;
  let sum = 0;
  let count = 0;

  attempt.levels.forEach((lvl) => {
    if (lvl.averageReaction != null && lvl.averageReaction !== "") {
      sum += safeNum(lvl.averageReaction);
      count++;
    }
  });

  return count > 0 ? Number((sum / count).toFixed(3)) : null;
}

/** Normaliza la clave del ejercicio */
function getExerciseCategory(exerciseId) {
  if (!exerciseId) return null;
  if (exerciseId === "reaction-movement" || exerciseId === "movement") return "movement";
  if (exerciseId === "reaction-lights" || exerciseId === "lights") return "lights";
  if (exerciseId === "reaction-passes" || exerciseId === "passes") return "passes";
  if (
    exerciseId === "reaction-dribble" ||
    exerciseId === "dribbling" ||
    exerciseId === "drible"
  )
    return "dribble";
  return null;
}

function GeneralHistorySection({ attempts = [], student }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Ordenar todos los intentos cronológicamente
  const sortedAttempts = useMemo(() => {
    return [...attempts].sort(
      (a, b) =>
        parseAttemptDate(a.completedAt).getTime() -
        parseAttemptDate(b.completedAt).getTime()
    );
  }, [attempts]);

  // Cálculos de KPIs generales con datos reales
  const {
    totalSessions,
    avgAccuracy,
    avgReactionTime,
    countsByExercise,
  } = useMemo(() => {
    let totalAccSum = 0;
    let totalAccCount = 0;
    let totalReactionSum = 0;
    let totalReactionCount = 0;

    const counts = {
      movement: 0,
      lights: 0,
      passes: 0,
      dribble: 0,
    };

    sortedAttempts.forEach((a) => {
      const cat = getExerciseCategory(a.exerciseId);
      if (cat && counts[cat] !== undefined) {
        counts[cat]++;
      }

      const acc = getAttemptAccuracy(a);
      if (acc !== null) {
        totalAccSum += acc;
        totalAccCount++;
      }

      const reac = getAttemptAverageReaction(a);
      if (reac !== null) {
        totalReactionSum += reac;
        totalReactionCount++;
      }
    });

    return {
      totalSessions: sortedAttempts.length,
      avgAccuracy: totalAccCount > 0 ? (totalAccSum / totalAccCount).toFixed(1) : "--",
      avgReactionTime:
        totalReactionCount > 0
          ? (totalReactionSum / totalReactionCount).toFixed(2)
          : "--",
      countsByExercise: counts,
    };
  }, [sortedAttempts]);

  // Preparar datos para la gráfica general comparativa (Líneas independientes por ejercicio)
  const chartData = useMemo(() => {
    if (sortedAttempts.length === 0) return null;

    // Etiquetas horizontales por fecha/hora de sesión
    const labels = sortedAttempts.map((a, index) => {
      const d = parseAttemptDate(a.completedAt);
      return `#${index + 1} (${formatDate(d)})`;
    });

    // Cada ejercicio tiene su propia serie de precisión
    const datasets = [
      {
        key: "movement",
        label: "Alcance Reactivo",
        color: EXERCISE_COLORS.movement.color,
      },
      {
        key: "lights",
        label: "Sigue la Luz",
        color: EXERCISE_COLORS.lights.color,
      },
      {
        key: "passes",
        label: "Captura Selectiva",
        color: EXERCISE_COLORS.passes.color,
      },
      {
        key: "dribble",
        label: "Control de Dribleo",
        color: EXERCISE_COLORS.dribble.color,
      },
    ].map((ex) => {
      const data = sortedAttempts.map((a) => {
        const cat = getExerciseCategory(a.exerciseId);
        if (cat === ex.key) {
          return getAttemptAccuracy(a);
        }
        return null;
      });

      return {
        label: ex.label,
        data,
        borderColor: ex.color,
        backgroundColor: ex.color,
        borderWidth: 2.5,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHitRadius: 10,
        spanGaps: true, // Conecta los puntos del mismo ejercicio a lo largo del tiempo
        tension: 0.25,
      };
    });

    return { labels, datasets };
  }, [sortedAttempts]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          font: { family: "Electrolize", size: 12 },
          color: "#92928e",
          boxWidth: 14,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: "#060606",
        titleFont: { family: "Electrolize", size: 13 },
        bodyFont: { family: "Electrolize", size: 12 },
        padding: 12,
        cornerRadius: 0,
        borderColor: "rgba(255, 255, 255, 0.15)",
        borderWidth: 1,
        callbacks: {
          title: (items) => {
            const index = items[0]?.dataIndex;
            if (index != null && sortedAttempts[index]) {
              const d = parseAttemptDate(sortedAttempts[index].completedAt);
              return `Sesión ${index + 1} — ${formatDateTime(d)}`;
            }
            return items[0]?.label;
          },
          label: (ctx) => {
            if (ctx.raw === null || ctx.raw === undefined) return null;
            return ` ${ctx.dataset.label}: ${ctx.raw}% de precisión`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { font: { family: "Electrolize", size: 11 }, color: "#92928e" },
        grid: { color: "#d9d8d1" },
        title: {
          display: true,
          text: "Secuencia cronológica de sesiones",
          color: "#92928e",
          font: { family: "Electrolize", size: 11 },
        },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          font: { family: "Electrolize", size: 11 },
          color: "#92928e",
          stepSize: 20,
        },
        grid: { color: "#d9d8d1" },
        title: {
          display: true,
          text: "Porcentaje de Precisión (%)",
          color: "#92928e",
          font: { family: "Electrolize", size: 12 },
        },
      },
    },
  };

  return (
    <section className="dashboard-panel general-history-section">
      <div className="dashboard-panel-heading">
        <div>
          <h2 className="h-4">Evolución multidisciplinar del jugador.</h2>
        </div>
        <span className="dashboard-panel-counter b-3">
          {totalSessions} sesión{totalSessions !== 1 ? "es" : ""} analizada{totalSessions !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tarjetas de indicadores generales (KPIs) */}
      <div
        className="general-kpi-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "16px",
          marginTop: "20px",
          marginBottom: "24px",
        }}
      >
        {/* KPI 1: Total de sesiones */}
        <div
          className="kpi-card"
          style={{
            padding: "20px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--line, #d9d8d1)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="b-3" style={{ color: "var(--color-process-subtle, #777773)", textTransform: "uppercase" }}>
              Total sesiones
            </span>
            <FiActivity style={{ color: "var(--color-primary-500, #ff1f0d)", fontSize: "20px" }} />
          </div>
          <strong className="h-3" style={{ color: "#ffffff", margin: "4px 0" }}>
            {totalSessions}
          </strong>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
            <span className="b-3" style={{ fontSize: "11px", color: EXERCISE_COLORS.movement.color }}>
              Alcance Reactivo: {countsByExercise.movement}
            </span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>
            <span className="b-3" style={{ fontSize: "11px", color: EXERCISE_COLORS.lights.color }}>
              Sigue la Luz: {countsByExercise.lights}
            </span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>
            <span className="b-3" style={{ fontSize: "11px", color: EXERCISE_COLORS.passes.color }}>
              Captura Selectiva: {countsByExercise.passes}
            </span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>
            <span className="b-3" style={{ fontSize: "11px", color: EXERCISE_COLORS.dribble.color }}>
              Control de Dribleo: {countsByExercise.dribble}
            </span>
          </div>
        </div>

        {/* KPI 2: Precisión promedio */}
        <div
          className="kpi-card"
          style={{
            padding: "20px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--line, #d9d8d1)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="b-3" style={{ color: "var(--color-process-subtle, #777773)", textTransform: "uppercase" }}>
              Precisión promedio
            </span>
            <FiTarget style={{ color: "var(--color-secondary-500, #ff8c01)", fontSize: "20px" }} />
          </div>
          <strong className="h-3" style={{ color: "#ffffff", margin: "4px 0" }}>
            {avgAccuracy !== "--" ? `${avgAccuracy}%` : "--"}
          </strong>
          <span className="b-3" style={{ color: "var(--color-process-subtle, #777773)", fontSize: "12px" }}>
            Promedio global histórico en todas las pruebas
          </span>
        </div>

        {/* KPI 3: Tiempo promedio de reacción */}
        <div
          className="kpi-card"
          style={{
            padding: "20px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--line, #d9d8d1)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="b-3" style={{ color: "var(--color-process-subtle, #777773)", textTransform: "uppercase" }}>
              Reacción promedio
            </span>
            <FiZap style={{ color: "var(--color-tertiary-500, #15cbc9)", fontSize: "20px" }} />
          </div>
          <strong className="h-3" style={{ color: "#ffffff", margin: "4px 0" }}>
            {avgReactionTime !== "--" ? `${avgReactionTime}s` : "--"}
          </strong>
          <span className="b-3" style={{ color: "var(--color-process-subtle, #777773)", fontSize: "12px" }}>
            Tiempo de respuesta sensorial combinado
          </span>
        </div>
      </div>

      {/* Gráfica histórica general (Principal y destacada) */}
      <div
        className="main-history-chart-card"
        style={{
          padding: "24px",
          background: "#16161a",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FiTrendingUp style={{ color: "var(--color-primary-500, #ff1f0d)", fontSize: "18px" }} />
              <h3 className="h-5" style={{ margin: 0, color: "#ffffff" }}>
                Comparativa de Precisión por Ejercicio en el Tiempo
              </h3>
            </div>
            <p className="b-3" style={{ margin: "4px 0 0", color: "#92928e" }}>
              Líneas independientes para comparar la evolución técnica sin mezcla de unidades.
            </p>
          </div>

          {chartData && (
            <button
              type="button"
              className="dashboard-sync-button b-3"
              onClick={() => setIsExpanded(true)}
              title="Ampliar gráfica a pantalla completa"
              style={{ cursor: "pointer" }}
            >
              <FiMaximize2 />
              <span>Ampliar</span>
            </button>
          )}
        </div>

        {/* Canvas de la gráfica */}
        <div style={{ height: "360px", position: "relative" }}>
          {totalSessions === 0 ? (
            <div
              className="charts-empty-state"
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "24px",
              }}
            >
              <p className="b-2" style={{ color: "#92928e", maxWidth: "420px" }}>
                El jugador seleccionado ({student?.name ?? "este jugador"}) todavía no tiene sesiones registradas en Firebase.
              </p>
            </div>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Modal expandido con control de scroll bloqueado y tecla Escape */}
      {isExpanded && chartData && (
        <ChartModal
          title={`Evolución Histórica — ${student?.name ?? "Jugador"}`}
          onClose={() => setIsExpanded(false)}
        >
          <div style={{ height: "70vh", minHeight: "420px" }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </ChartModal>
      )}
    </section>
  );
}

export default GeneralHistorySection;
