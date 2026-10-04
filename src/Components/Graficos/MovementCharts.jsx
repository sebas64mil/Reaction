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
import { Line, Bar, Radar, Doughnut } from "react-chartjs-2";
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

const COLORS = {
  primary: "#ff1f0d",
  primaryAlpha: "rgba(255,31,13,0.15)",
  secondary: "#ff8c01",
  secondaryAlpha: "rgba(255,140,1,0.15)",
  tertiary: "#15cbc9",
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

/* ─── helpers ─── */
function formatDate(ts) {
  if (!ts) return "";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "short" }).format(date);
}

/* ─── sub-components ─── */
function ChartCard({ title, kicker, children }) {
  return (
    <div className="chart-card">
      <div className="chart-card-heading">
        <p className="kicker">{kicker}</p>
        <h3 className="h-6">{title}</h3>
      </div>
      <div className="chart-canvas-wrap">{children}</div>
    </div>
  );
}

/* ─── 1. Linea: reaccion promedio por nivel a lo largo de las sesiones ─── */
function ReactionLineChart({ attempts }) {
  const labels = attempts.map((a, i) => `Sesion ${i + 1} (${formatDate(a.completedAt)})`);

  const datasets = [1, 2, 3].map((lvl, idx) => {
    const palettes = [
      { border: COLORS.primary, bg: COLORS.primaryAlpha },
      { border: COLORS.secondary, bg: COLORS.secondaryAlpha },
      { border: COLORS.tertiary, bg: COLORS.tertiaryAlpha },
    ];
    return {
      label: `Nivel ${lvl}`,
      data: attempts.map((a) => {
        const level = a.levels?.[idx];
        return level ? Number(level.averageReaction).toFixed(3) : null;
      }),
      borderColor: palettes[idx].border,
      backgroundColor: palettes[idx].bg,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.3,
      fill: false,
    };
  });

  return (
    <ChartCard kicker="Grafica 01" title="Reaccion promedio por nivel (s)">
      <Line
        data={{ labels, datasets }}
        options={{
          ...baseOptions,
          plugins: {
            ...baseOptions.plugins,
            legend: { ...baseOptions.plugins.legend, position: "top" },
          },
          scales: {
            ...baseOptions.scales,
            y: {
              ...baseOptions.scales.y,
              title: {
                display: true,
                text: "Segundos (s)",
                font: { family: "Electrolize", size: 11 },
                color: COLORS.muted,
              },
            },
          },
        }}
      />
    </ChartCard>
  );
}

/* ─── 2. Barras: precision combinada por sesion ─── */
function AccuracyBarChart({ attempts }) {
  const labels = attempts.map((a, i) => `Sesion ${i + 1}`);
  const data = attempts.map((a) => {
    const levels = a.levels ?? [];
    if (!levels.length) return 0;
    const last = levels[levels.length - 1];
    return last.combinedAccuracy != null
      ? Number(last.combinedAccuracy).toFixed(1)
      : 0;
  });

  return (
    <ChartCard kicker="Grafica 02" title="Precision combinada por sesion (%)">
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Precision (%)",
              data,
              backgroundColor: COLORS.primaryAlpha,
              borderColor: COLORS.primary,
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
              title: {
                display: true,
                text: "Porcentaje (%)",
                font: { family: "Electrolize", size: 11 },
                color: COLORS.muted,
              },
            },
          },
        }}
      />
    </ChartCard>
  );
}

/* ─── 3. Radar: mano izquierda vs derecha por nivel (promedio de sesiones) ─── */
function HandRadarChart({ attempts }) {
  const levels = [1, 2, 3];
  const avgLeft = levels.map((_, idx) => {
    const vals = attempts
      .map((a) => a.levels?.[idx]?.leftHandReaction)
      .filter((v) => v != null)
      .map(Number);
    return vals.length ? (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(3) : 0;
  });
  const avgRight = levels.map((_, idx) => {
    const vals = attempts
      .map((a) => a.levels?.[idx]?.rightHandReaction)
      .filter((v) => v != null)
      .map(Number);
    return vals.length ? (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(3) : 0;
  });

  return (
    <ChartCard kicker="Grafica 03" title="Reaccion por mano — promedio de sesiones (s)">
      <Radar
        data={{
          labels: ["Nivel 1", "Nivel 2", "Nivel 3"],
          datasets: [
            {
              label: "Mano izquierda",
              data: avgLeft,
              borderColor: COLORS.secondary,
              backgroundColor: COLORS.secondaryAlpha,
              borderWidth: 2,
              pointRadius: 4,
            },
            {
              label: "Mano derecha",
              data: avgRight,
              borderColor: COLORS.tertiary,
              backgroundColor: COLORS.tertiaryAlpha,
              borderWidth: 2,
              pointRadius: 4,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: baseOptions.plugins.legend,
            tooltip: baseOptions.plugins.tooltip,
          },
          scales: {
            r: {
              ticks: {
                font: { family: "Electrolize", size: 10 },
                color: COLORS.muted,
                backdropColor: "transparent",
              },
              grid: { color: COLORS.line },
              pointLabels: {
                font: { family: "Electrolize", size: 12 },
                color: COLORS.neutral,
              },
            },
          },
        }}
      />
    </ChartCard>
  );
}

/* ─── 4. Doughnut: aciertos vs intentos totales ─── */
function AciertosDonutChart({ attempts }) {
  let totalCorrect = 0;
  let totalAttempts = 0;

  attempts.forEach((a) => {
    (a.levels ?? []).forEach((lvl) => {
      totalCorrect += Number(lvl.correctAnswers ?? 0);
      totalAttempts += Number(lvl.totalAttempts ?? 0);
    });
  });

  const missed = totalAttempts - totalCorrect;

  return (
    <ChartCard kicker="Grafica 04" title="Aciertos vs intentos totales">
      <Doughnut
        data={{
          labels: ["Aciertos", "Errores"],
          datasets: [
            {
              data: [totalCorrect, missed],
              backgroundColor: [COLORS.tertiary, COLORS.primaryAlpha],
              borderColor: [COLORS.tertiary, COLORS.primary],
              borderWidth: 2,
              hoverOffset: 6,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: "65%",
          plugins: {
            legend: { ...baseOptions.plugins.legend, position: "bottom" },
            tooltip: baseOptions.plugins.tooltip,
          },
        }}
      />
      <p className="donut-center-label b-3">
        {totalAttempts > 0
          ? `${((totalCorrect / totalAttempts) * 100).toFixed(1)}% global`
          : "Sin datos"}
      </p>
    </ChartCard>
  );
}

/* ─── main export ─── */
function MovementCharts({ attempts }) {
  if (!attempts || attempts.length === 0) {
    return (
      <div className="charts-empty-state">
        <p className="b-2">
          No se encontraron sesiones de reaccion de movimiento para este jugador.
        </p>
      </div>
    );
  }

  return (
    <div className="movement-charts">
      <p className="charts-meta b-3">
        {attempts.length} sesion{attempts.length !== 1 ? "es" : ""} encontrada{attempts.length !== 1 ? "s" : ""}.
        Mostrando datos historicos completos.
      </p>
      <div className="charts-grid">
        <ReactionLineChart attempts={attempts} />
        <AccuracyBarChart attempts={attempts} />
        <HandRadarChart attempts={attempts} />
        <AciertosDonutChart attempts={attempts} />
      </div>
    </div>
  );
}

export default MovementCharts;
