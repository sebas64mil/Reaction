import { useState, useMemo, useRef, useEffect } from "react";
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
import { FiTrendingUp, FiMaximize2, FiClock, FiCheckSquare, FiTarget } from "react-icons/fi";
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

const LEVEL_COLORS = {
  level1: {
    stroke: "#ff1f0d", // Coral
    fill: "rgba(255, 31, 13, 0.08)",
  },
  level2: {
    stroke: "#ff8c01", // Naranja
    fill: "rgba(255, 140, 1, 0.08)",
  },
  level3: {
    stroke: "#15cbc9", // Cian
    fill: "rgba(21, 203, 201, 0.08)",
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

function ExerciseHistoryScrollArea({ children, className = "" }) {
  const scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return undefined;

    const updateScrollLimits = () => {
      const nextMaxScroll = Math.max(
        scrollElement.scrollWidth - scrollElement.clientWidth,
        0,
      );
      setMaxScroll((current) => current === nextMaxScroll ? current : nextMaxScroll);
      setScrollPosition((current) =>
        current === scrollElement.scrollLeft ? current : scrollElement.scrollLeft,
      );
    };

    const resizeObserver = new ResizeObserver(updateScrollLimits);
    resizeObserver.observe(scrollElement);
    if (scrollElement.firstElementChild) {
      resizeObserver.observe(scrollElement.firstElementChild);
    }
    scrollElement.addEventListener("scroll", updateScrollLimits, { passive: true });
    const animationFrame = window.requestAnimationFrame(updateScrollLimits);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      scrollElement.removeEventListener("scroll", updateScrollLimits);
    };
  }, []);

  const handleSliderChange = (event) => {
    const nextPosition = Number(event.target.value);
    if (scrollRef.current) scrollRef.current.scrollLeft = nextPosition;
    setScrollPosition(nextPosition);
  };

  return (
    <div className={`exercise-history-scroll-area ${className}`}>
      <div className="exercise-history-chart-scroll" ref={scrollRef}>
        {children}
      </div>
      <input
        className="exercise-history-scroll-slider"
        type="range"
        min="0"
        max={maxScroll}
        value={Math.min(scrollPosition, maxScroll)}
        onChange={handleSliderChange}
        style={{
          "--scroll-progress": `${maxScroll ? (scrollPosition / maxScroll) * 100 : 0}%`,
        }}
        aria-label="Desplazamiento horizontal de sesiones"
      />
    </div>
  );
}

/**
 * ExerciseHistoricalChart
 * Gráfica grande principal para analizar el histórico de todas las sesiones
 * del ejercicio seleccionado, con selector de métrica (tiempo de reacción, aciertos, precisión).
 * Si hay menos de 2 sesiones, se oculta ("se quita") según el requerimiento.
 */
function ExerciseHistoricalChart({ attempts = [], exerciseLabel = "Ejercicio" }) {
  const [metric, setMetric] = useState("accuracy"); // "reaction" | "hits" | "accuracy"
  const [isExpanded, setIsExpanded] = useState(false);

  // Ordenar intentos cronológicamente
  const sorted = useMemo(() => {
    return [...attempts].sort(
      (a, b) =>
        parseAttemptDate(a.completedAt).getTime() -
        parseAttemptDate(b.completedAt).getTime()
    );
  }, [attempts]);

  // Si no hay suficientes datos históricos (menos de 2 sesiones), se oculta la gráfica grande
  if (!sorted || sorted.length < 2) {
    return null;
  }

  const labels = sorted.map((a, i) => {
    const d = parseAttemptDate(a.completedAt);
    return `Sesión ${i + 1} (${formatDate(d)})`;
  });

  // Extraer valores por cada nivel según la métrica seleccionada
  const getLevelMetricValue = (lvl, metricKey) => {
    if (!lvl) return 0;
    if (metricKey === "reaction") {
      return safeNum(lvl.averageReaction);
    }
    if (metricKey === "hits") {
      return safeNum(lvl.correctAnswers);
    }
    if (metricKey === "accuracy") {
      if (lvl.accuracy != null && lvl.accuracy !== "") return safeNum(lvl.accuracy);
      if (lvl.combinedAccuracy != null && lvl.combinedAccuracy !== "") return safeNum(lvl.combinedAccuracy);
      if (lvl.correctAnswers != null && lvl.totalAttempts && Number(lvl.totalAttempts) > 0) {
        return Number(((safeNum(lvl.correctAnswers) / safeNum(lvl.totalAttempts)) * 100).toFixed(1));
      }
      return 0;
    }
    return 0;
  };

  const level1Data = sorted.map((a) =>
    getLevelMetricValue(a.levels?.[0], metric).toFixed(metric === "reaction" ? 3 : 1)
  );
  const level2Data = sorted.map((a) =>
    getLevelMetricValue(a.levels?.[1], metric).toFixed(metric === "reaction" ? 3 : 1)
  );
  const level3Data = sorted.map((a) =>
    getLevelMetricValue(a.levels?.[2], metric).toFixed(metric === "reaction" ? 3 : 1)
  );

  const metricConfig = {
    reaction: {
      label: "Tiempo de reacción",
      unit: "s",
      axisTitle: "Segundos (s)",
      icon: <FiClock />,
      tooltipSuffix: " s",
    },
    hits: {
      label: "Aciertos",
      unit: "aciertos",
      axisTitle: "Cantidad de aciertos",
      icon: <FiCheckSquare />,
      tooltipSuffix: " aciertos",
    },
    accuracy: {
      label: "Precisión",
      unit: "%",
      axisTitle: "Porcentaje (%)",
      icon: <FiTarget />,
      tooltipSuffix: "%",
    },
  }[metric];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Nivel 1",
        data: level1Data,
        borderColor: LEVEL_COLORS.level1.stroke,
        backgroundColor: LEVEL_COLORS.level1.fill,
        borderWidth: 2.5,
        pointRadius: 5,
        pointHoverRadius: 8,
        tension: 0.25,
        fill: false,
      },
      {
        label: "Nivel 2",
        data: level2Data,
        borderColor: LEVEL_COLORS.level2.stroke,
        backgroundColor: LEVEL_COLORS.level2.fill,
        borderWidth: 2.5,
        pointRadius: 5,
        pointHoverRadius: 8,
        tension: 0.25,
        fill: false,
      },
      {
        label: "Nivel 3",
        data: level3Data,
        borderColor: LEVEL_COLORS.level3.stroke,
        backgroundColor: LEVEL_COLORS.level3.fill,
        borderWidth: 2.5,
        pointRadius: 5,
        pointHoverRadius: 8,
        tension: 0.25,
        fill: false,
      },
    ],
  };

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
          color: "var(--ink, #060606)",
          boxWidth: 14,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: "var(--ink, #060606)",
        titleFont: { family: "Electrolize", size: 13 },
        bodyFont: { family: "Electrolize", size: 12 },
        padding: 12,
        cornerRadius: 4,
        callbacks: {
          title: (items) => {
            const index = items[0]?.dataIndex;
            if (index != null && sorted[index]) {
              const d = parseAttemptDate(sorted[index].completedAt);
              return `Sesión ${index + 1} · ${formatDateTime(d)}`;
            }
            return items[0]?.label;
          },
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}${metricConfig.tooltipSuffix}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { font: { family: "Electrolize", size: 11 }, color: "var(--muted, #777773)" },
        grid: { color: "rgba(0, 0, 0, 0.06)" },
        title: {
          display: true,
          text: "Secuencia histórica de sesiones",
          color: "var(--muted, #777773)",
          font: { family: "Electrolize", size: 11 },
        },
      },
      y: {
        ticks: { font: { family: "Electrolize", size: 11 }, color: "var(--muted, #777773)" },
        grid: { color: "rgba(0, 0, 0, 0.06)" },
        title: {
          display: true,
          text: metricConfig.axisTitle,
          color: "var(--muted, #777773)",
          font: { family: "Electrolize", size: 12 },
        },
        ...(metric === "accuracy" ? { min: 0, max: 100 } : { beginAtZero: true }),
      },
    },
  };

  const MetricSelector = (
    <div className="exercise-metric-selector" role="group" aria-label="Métrica de la gráfica">
      <span className="exercise-metric-label b-3">Métrica</span>
      {[
        { id: "reaction", label: "Tiempo de reacción", icon: <FiClock /> },
        { id: "hits", label: "Aciertos", icon: <FiCheckSquare /> },
        { id: "accuracy", label: "Precisión (%)", icon: <FiTarget /> },
      ].map((btn) => (
        <button
          key={btn.id}
          type="button"
          onClick={() => setMetric(btn.id)}
          className={`exercise-metric-tab b-3 ${metric === btn.id ? "is-active" : ""}`}
          aria-pressed={metric === btn.id}
          aria-label={btn.label}
        >
          <span className="exercise-metric-icon" aria-hidden="true">{btn.icon}</span>
          <span>{btn.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <section
      className="dashboard-panel exercise-historical-panel"
      style={{
        background: "var(--color-surface-card, #e9e8e1)",
        border: "1px solid var(--color-surface-line, #d9d8d1)",
        marginBottom: "28px",
      }}
    >
      <div className="dashboard-panel-heading">
        <div>
          <h2 className="h-4" style={{ color: "var(--ink, #060606)" }}>
            Evolución en {exerciseLabel} ({sorted.length} sesiones)
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {MetricSelector}
          <button
            type="button"
            className="dashboard-sync-button b-3"
            onClick={() => setIsExpanded(true)}
            title="Ampliar gráfica a pantalla completa"
          >
            <FiMaximize2 />
            <span>Ampliar</span>
          </button>
        </div>
      </div>

      <ExerciseHistoryScrollArea className="exercise-history-scroll-main">
        <div
          className="chart-canvas-wrap exercise-history-chart-canvas"
          style={{
            "--chart-session-count": sorted.length,
            position: "relative",
            height: "360px",
            background: "var(--color-surface-paper, #f5f4ef)",
            padding: "16px",
            border: "1px solid var(--color-surface-line, #d9d8d1)",
            borderRadius: "8px",
          }}
        >
          <Line data={chartData} options={chartOptions} />
        </div>
      </ExerciseHistoryScrollArea>

      {isExpanded && (
        <ChartModal
          title={`Evolución Histórica — ${exerciseLabel}`}
          headerExtra={MetricSelector}
          onClose={() => setIsExpanded(false)}
        >
          <ExerciseHistoryScrollArea className="exercise-history-scroll-modal">
            <div
              className="exercise-history-chart-canvas"
              style={{
                "--chart-session-count": sorted.length,
                position: "relative",
                height: "70vh",
                minHeight: "420px",
                padding: "12px 0",
              }}
            >
              <Line data={chartData} options={chartOptions} />
            </div>
          </ExerciseHistoryScrollArea>
        </ChartModal>
      )}
    </section>
  );
}

export default ExerciseHistoricalChart;
