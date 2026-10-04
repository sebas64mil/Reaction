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
import { Line, Bar, Radar, Doughnut } from "react-chartjs-2";
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

/* ─── helpers ─── */
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

function getLevelAverages(attempts, levelIndex) {
  let sumGeneral = 0, countGeneral = 0;
  let sumLeft = 0, countLeft = 0;
  let sumRight = 0, countRight = 0;
  
  let totalCorrect = 0, totalAttempts = 0;
  let sumCombinedAccuracy = 0, countCombinedAccuracy = 0;

  attempts.forEach(a => {
    const lvl = a.levels?.[levelIndex];
    if (lvl) {
      if (lvl.averageReaction != null) { sumGeneral += safeNum(lvl.averageReaction); countGeneral++; }
      if (lvl.leftHandReaction != null) { sumLeft += safeNum(lvl.leftHandReaction); countLeft++; }
      if (lvl.rightHandReaction != null) { sumRight += safeNum(lvl.rightHandReaction); countRight++; }
      
      // Firebase actually saves correctAnswers and totalAttempts per level!
      totalCorrect += safeNum(lvl.correctAnswers);
      totalAttempts += safeNum(lvl.totalAttempts);
      
      if (lvl.combinedAccuracy != null) { sumCombinedAccuracy += safeNum(lvl.combinedAccuracy); countCombinedAccuracy++; }
    }
  });

  return {
    avgGeneral: countGeneral ? sumGeneral / countGeneral : 0,
    avgLeft: countLeft ? sumLeft / countLeft : 0,
    avgRight: countRight ? sumRight / countRight : 0,
    correctAnswers: totalCorrect,
    totalAttempts: totalAttempts,
    combinedAccuracy: totalAttempts ? (totalCorrect / totalAttempts) * 100 : 
       (countCombinedAccuracy ? sumCombinedAccuracy / countCombinedAccuracy : 0)
  };
}

/* ─── Modal ─── */
function ChartModal({ children, onClose, headerExtra }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px'
    }} onClick={onClose}>
      <div style={{
         width: '100%', maxWidth: '1000px', height: '85vh',
         backgroundColor: '#16161a', padding: '32px', borderRadius: '16px',
         position: 'relative', display: 'flex', flexDirection: 'column',
         boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }} onClick={e => e.stopPropagation()}>
         
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
            <div style={{ flex: 1 }}>
               {headerExtra}
            </div>
            <Button onClick={onClose} variant="primary" style={{ padding: '8px', minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px', width: '40px' }}>
               <FiX style={{ fontSize: '24px', color: '#fff' }} />
            </Button>
         </div>

         <div style={{ flex: 1, minHeight: 0 }}>
            {children}
         </div>
      </div>
    </div>
  );
}

/* ─── sub-components ─── */
function ChartCard({ title, kicker, children, onClick, isExpanded }) {
  return (
    <div 
      className="chart-card" 
      onClick={onClick} 
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        height: isExpanded ? '100%' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        ...(onClick ? { ':hover': { transform: 'scale(1.02)' } } : {})
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

/* ─── 1. Tiempo de reacción por nivel (Line Chart) ─── */
function ReactionByLevelLineChart({ attempts, onExpand, isExpanded }) {
  const lvls = [0, 1, 2].map(i => getLevelAverages(attempts, i).avgGeneral);
  
  return (
    <ChartCard kicker="Grafica 01" title="Tiempo de reacción por nivel" onClick={onExpand} isExpanded={isExpanded}>
      <Line
        data={{
          labels: ["Nivel 1", "Nivel 2", "Nivel 3"],
          datasets: [
            {
              label: "Promedio general (s)",
              data: lvls.map(v => v.toFixed(3)),
              borderColor: COLORS.primary,
              backgroundColor: COLORS.primaryAlpha,
              borderWidth: 2,
              pointRadius: 4,
              fill: true,
              tension: 0.3
            }
          ]
        }}
        options={{
          ...baseOptions,
          scales: {
            ...baseOptions.scales,
            y: { ...baseOptions.scales.y, title: { display: true, text: "Segundos (s)", color: COLORS.muted } }
          },
          plugins: {
            ...baseOptions.plugins,
            tooltip: {
              ...baseOptions.plugins.tooltip,
              callbacks: {
                title: (items) => items[0].label,
                label: (context) => `Tiempo: ${context.raw} s`
              }
            }
          }
        }}
      />
    </ChartCard>
  );
}

/* ─── 2. Tiempo de reacción por mano y nivel (Radar Chart) ─── */
function ReactionHandRadarChart({ attempts, onExpand, isExpanded }) {
  const lvls = [0, 1, 2].map(i => getLevelAverages(attempts, i));
  
  return (
    <ChartCard kicker="Grafica 02" title="Tiempo de reacción por mano y nivel" onClick={onExpand} isExpanded={isExpanded}>
      <Radar
        data={{
          labels: ["Nivel 1", "Nivel 2", "Nivel 3"],
          datasets: [
            {
              label: "General",
              data: lvls.map(l => l.avgGeneral.toFixed(3)),
              borderColor: COLORS.neutral,
              backgroundColor: COLORS.neutralAlpha,
              borderWidth: 2,
              pointRadius: 4
            },
            {
              label: "Mano izquierda",
              data: lvls.map(l => l.avgLeft.toFixed(3)),
              borderColor: COLORS.secondary,
              backgroundColor: COLORS.secondaryAlpha,
              borderWidth: 2,
              pointRadius: 4
            },
            {
              label: "Mano derecha",
              data: lvls.map(l => l.avgRight.toFixed(3)),
              borderColor: COLORS.tertiary,
              backgroundColor: COLORS.tertiaryAlpha,
              borderWidth: 2,
              pointRadius: 4
            }
          ]
        }}
        options={{
           responsive: true,
           maintainAspectRatio: false,
           plugins: {
             legend: baseOptions.plugins.legend,
             tooltip: {
               ...baseOptions.plugins.tooltip,
               callbacks: {
                 label: (context) => `${context.dataset.label}: ${context.raw} s`
               }
             }
           },
           scales: {
             r: {
               ticks: { font: { family: "Electrolize", size: 10 }, color: COLORS.muted, backdropColor: "transparent" },
               grid: { color: COLORS.line },
               pointLabels: { font: { family: "Electrolize", size: 12 }, color: COLORS.neutral }
             }
           }
        }}
      />
    </ChartCard>
  );
}

/* ─── 3. Precisión por nivel (Bar Chart) ─── */
function AccuracyByLevelBarChart({ attempts, onExpand, isExpanded }) {
  const lvls = [0, 1, 2].map(i => getLevelAverages(attempts, i).combinedAccuracy);
  
  return (
    <ChartCard kicker="Grafica 03" title="Precisión por nivel" onClick={onExpand} isExpanded={isExpanded}>
      <Bar
        data={{
          labels: ["Nivel 1", "Nivel 2", "Nivel 3"],
          datasets: [
            {
              label: "Precisión combinada (%)",
              data: lvls.map(v => v.toFixed(1)),
              backgroundColor: COLORS.primaryAlpha,
              borderColor: COLORS.primary,
              borderWidth: 2
            }
          ]
        }}
        options={{
          ...baseOptions,
          scales: {
            ...baseOptions.scales,
            y: { ...baseOptions.scales.y, min: 0, max: 100, title: { display: true, text: "Porcentaje (%)", color: COLORS.muted } }
          },
          plugins: {
            ...baseOptions.plugins,
            tooltip: {
              ...baseOptions.plugins.tooltip,
              callbacks: {
                label: (context) => `Precisión: ${context.raw}%`
              }
            }
          }
        }}
      />
    </ChartCard>
  );
}

/* ─── 4. Precisión general de la sesión (Doughnut Chart) ─── */
function OverallAccuracyDoughnutChart({ attempts, onExpand, isExpanded }) {
  let totalCorrect = 0;
  let totalAttempts = 0;

  attempts.forEach(a => {
    [0, 1, 2].forEach(i => {
      if (a.levels?.[i]) {
        // Fix: Firestore actually saves correctAnswers and totalAttempts directly!
        totalCorrect += safeNum(a.levels[i].correctAnswers);
        totalAttempts += safeNum(a.levels[i].totalAttempts);
      }
    });
  });

  const incorrect = Math.max(0, totalAttempts - totalCorrect);

  return (
    <ChartCard kicker="Grafica 04" title="Aciertos y fallos generales" onClick={onExpand} isExpanded={isExpanded}>
      <Doughnut
        data={{
          labels: ["Aciertos", "Fallos"],
          datasets: [{
            data: [totalCorrect, incorrect],
            backgroundColor: [COLORS.tertiary, COLORS.primaryAlpha],
            borderColor: [COLORS.tertiary, COLORS.primary],
            borderWidth: 2,
            hoverOffset: 6
          }]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: "65%",
          plugins: {
            legend: { ...baseOptions.plugins.legend, position: "bottom" },
            tooltip: {
               ...baseOptions.plugins.tooltip,
               callbacks: {
                 label: (context) => `${context.label}: ${context.raw}`
               }
            }
          }
        }}
      />
      <div style={{ position: "absolute", top: "45%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
        {totalAttempts > 0 ? (
           <>
             <p className="b-3" style={{ margin: 0, fontWeight: "bold", fontSize: "16px", color: COLORS.tertiary }}>
               {totalCorrect} aciertos
             </p>
             <p className="b-3" style={{ margin: 0, fontWeight: "bold", fontSize: "16px", color: COLORS.primary }}>
               {incorrect} fallos
             </p>
           </>
        ) : (
           <p className="b-3" style={{ margin: 0, fontWeight: "bold", fontSize: "16px" }}>Sin datos</p>
        )}
      </div>
    </ChartCard>
  );
}

/* ─── 5. Comparación entre sesiones (Scatter/Line) ─── */
function SessionHistoryScatterChart({ attempts, onExpand, isExpanded }) {
  const [metric, setMetric] = useState('time'); 
  
  const sortedAttempts = useMemo(() => {
    return [...attempts].sort((a, b) => 
      parseAttemptDate(a.completedAt).getTime() - parseAttemptDate(b.completedAt).getTime()
    );
  }, [attempts]);

  if (sortedAttempts.length < 2) {
    return (
      <ChartCard kicker="Grafica 05" title="Comparación entre sesiones" onClick={onExpand} isExpanded={isExpanded}>
        <div className="charts-empty-state" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
           <p className="b-3">Todavía no hay suficientes sesiones para realizar una comparación histórica.</p>
        </div>
      </ChartCard>
    );
  }

  const labels = sortedAttempts.map((a) => {
     const d = parseAttemptDate(a.completedAt);
     return `${formatDate(d)} - ${formatTime(d)}`;
  });

  const getMetricData = (attempt) => {
    let sumGen = 0, sumL = 0, sumR = 0;
    let corT = 0, attT = 0;
    let countGen = 0, countL = 0, countR = 0;
    let sumAccL = 0, sumAccR = 0;
    let countAccL = 0, countAccR = 0;
    
    [0, 1, 2].forEach(i => {
      const lvl = attempt.levels?.[i];
      if (lvl) {
        if (lvl.averageReaction != null) { sumGen += safeNum(lvl.averageReaction); countGen++; }
        if (lvl.leftHandReaction != null) { sumL += safeNum(lvl.leftHandReaction); countL++; }
        if (lvl.rightHandReaction != null) { sumR += safeNum(lvl.rightHandReaction); countR++; }
        
        corT += safeNum(lvl.correctAnswers);
        attT += safeNum(lvl.totalAttempts);

        if (lvl.leftHandAccuracy != null) { sumAccL += safeNum(lvl.leftHandAccuracy); countAccL++; }
        if (lvl.rightHandAccuracy != null) { sumAccR += safeNum(lvl.rightHandAccuracy); countAccR++; }
      }
    });

    return {
       timeGen: countGen ? sumGen / countGen : 0, 
       timeLeft: countL ? sumL / countL : 0, 
       timeRight: countR ? sumR / countR : 0,
       accL: countAccL ? sumAccL / countAccL : 0,
       accR: countAccR ? sumAccR / countAccR : 0,
       accComb: attT ? (corT / attT) * 100 : 0
    };
  };

  const datasetData = sortedAttempts.map(getMetricData);

  const datasets = metric === 'time' 
    ? [
        { label: "General", data: datasetData.map(d => d.timeGen.toFixed(3)), backgroundColor: COLORS.neutralAlpha, borderColor: COLORS.neutral },
        { label: "Izquierda", data: datasetData.map(d => d.timeLeft.toFixed(3)), backgroundColor: COLORS.secondaryAlpha, borderColor: COLORS.secondary },
        { label: "Derecha", data: datasetData.map(d => d.timeRight.toFixed(3)), backgroundColor: COLORS.tertiaryAlpha, borderColor: COLORS.tertiary }
      ]
    : [
        { label: "Combinada", data: datasetData.map(d => d.accComb.toFixed(1)), backgroundColor: COLORS.neutralAlpha, borderColor: COLORS.neutral },
        { label: "Izquierda", data: datasetData.map(d => d.accL.toFixed(1)), backgroundColor: COLORS.secondaryAlpha, borderColor: COLORS.secondary },
        { label: "Derecha", data: datasetData.map(d => d.accR.toFixed(1)), backgroundColor: COLORS.tertiaryAlpha, borderColor: COLORS.tertiary }
      ];

  const chartDatasets = datasets.map(ds => ({
    ...ds,
    showLine: false,
    pointRadius: 6,
    pointHoverRadius: 8
  }));

  return (
    <ChartCard kicker="Grafica 05" title="Comparación entre sesiones" onClick={onExpand} isExpanded={isExpanded}>
      <div 
        style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }} 
        onClick={e => e.stopPropagation()} 
      >
        <span className="b-3" style={{ color: COLORS.muted }}>Métrica:</span>
        <select 
          value={metric} 
          onChange={e => setMetric(e.target.value)} 
          className="exercise-select" 
          style={{ width: 'auto', padding: '4px 8px', fontSize: '12px' }}
        >
          <option value="time">Tiempo de reacción</option>
          <option value="accuracy">Precisión</option>
        </select>
      </div>
      <div style={{ flex: 1, minHeight: isExpanded ? '400px' : '220px', position: "relative" }}>
        <Line
          data={{ labels, datasets: chartDatasets }}
          options={{
            ...baseOptions,
            scales: {
              ...baseOptions.scales,
              x: {
                ...baseOptions.scales.x,
                ticks: { display: isExpanded } 
              },
              y: {
                ...baseOptions.scales.y,
                title: { display: true, text: metric === 'time' ? "Segundos (s)" : "Porcentaje (%)", color: COLORS.muted },
                ...(metric === 'accuracy' ? { min: 0, max: 100 } : {})
              }
            },
            plugins: {
              ...baseOptions.plugins,
              tooltip: {
                ...baseOptions.plugins.tooltip,
                callbacks: {
                  title: (items) => {
                    const idx = items[0].dataIndex;
                    const d = parseAttemptDate(sortedAttempts[idx].completedAt);
                    return `Sesión ${idx + 1}\n${formatDate(d)} · ${formatTime(d)}`;
                  },
                  label: (context) => {
                    const val = context.raw;
                    const isTime = metric === 'time';
                    const metricName = isTime ? "Tiempo de reacción" : "Precisión";
                    const suffix = isTime ? 's' : '%';
                    const hand = context.dataset.label;
                    return `${metricName} (${hand}): ${val} ${suffix}`;
                  }
                }
              }
            }
          }}
        />
      </div>
    </ChartCard>
  );
}

/* ─── 6. Perfil general de rendimiento (Radar Chart) ─── */
function OverallPerformanceRadarChart({ attempts, onExpand, isExpanded }) {
  let sumGen = 0, sumL = 0, sumR = 0;
  let corT = 0, attT = 0;
  let sumAccL = 0, sumAccR = 0;
  let countLevels = 0, countL = 0, countR = 0;
  let countAccL = 0, countAccR = 0;

  attempts.forEach(a => {
    [0, 1, 2].forEach(i => {
      const lvl = a.levels?.[i];
      if (lvl) {
        if (lvl.averageReaction != null) { sumGen += safeNum(lvl.averageReaction); countLevels++; }
        if (lvl.leftHandReaction != null) { sumL += safeNum(lvl.leftHandReaction); countL++; }
        if (lvl.rightHandReaction != null) { sumR += safeNum(lvl.rightHandReaction); countR++; }
        
        corT += safeNum(lvl.correctAnswers);
        attT += safeNum(lvl.totalAttempts);
        
        if (lvl.leftHandAccuracy != null) { sumAccL += safeNum(lvl.leftHandAccuracy); countAccL++; }
        if (lvl.rightHandAccuracy != null) { sumAccR += safeNum(lvl.rightHandAccuracy); countAccR++; }
      }
    });
  });

  const avgGenTime = countLevels ? sumGen / countLevels : 0;
  const avgLeftTime = countL ? sumL / countL : 0;
  const avgRightTime = countR ? sumR / countR : 0;

  const precisionOverall = attT ? (corT / attT) * 100 : 0;
  const precisionLeft = countAccL ? sumAccL / countAccL : 0;
  const precisionRight = countAccR ? sumAccR / countAccR : 0;

  const normalizeTime = (t) => Math.max(0, Math.min(100, 100 - (t / 1.5) * 100));
  
  const vReact = normalizeTime(avgGenTime);
  const prec = precisionOverall;
  const leftPerf = (precisionLeft + normalizeTime(avgLeftTime)) / 2;
  const rightPerf = (precisionRight + normalizeTime(avgRightTime)) / 2;
  const genPerf = (vReact + prec) / 2; 

  return (
    <ChartCard kicker="Grafica 06" title="Perfil general de rendimiento" onClick={onExpand} isExpanded={isExpanded}>
      <Radar
        data={{
          labels: [
             "Velocidad de reacción", 
             "Precisión", 
             "Rend. general", 
             "Mano derecha", 
             "Mano izquierda"
          ],
          datasets: [
            {
              label: "Perfil (0-100)",
              data: [vReact.toFixed(1), prec.toFixed(1), genPerf.toFixed(1), rightPerf.toFixed(1), leftPerf.toFixed(1)],
              backgroundColor: COLORS.primaryAlpha,
              borderColor: COLORS.primary,
              borderWidth: 2,
              pointRadius: 4
            }
          ]
        }}
        options={{
           responsive: true,
           maintainAspectRatio: false,
           plugins: {
             legend: { display: false },
             tooltip: {
               ...baseOptions.plugins.tooltip,
               callbacks: {
                 label: (context) => `${context.raw} / 100`
               }
             }
           },
           scales: {
             r: {
               min: 0,
               max: 100,
               ticks: { display: false, font: { family: "Electrolize", size: 10 }, color: COLORS.muted, backdropColor: "transparent" },
               grid: { color: COLORS.line },
               pointLabels: { font: { family: "Electrolize", size: 11 }, color: COLORS.neutral }
             }
           }
        }}
      />
    </ChartCard>
  );
}

/* ─── main export ─── */
function MovementCharts({ attempts }) {
  const [expandedChart, setExpandedChart] = useState(null);
  const [selectedSession, setSelectedSession] = useState("all");

  const sortedAttempts = useMemo(() => {
    return [...(attempts || [])].sort((a, b) => 
      parseAttemptDate(a.completedAt).getTime() - parseAttemptDate(b.completedAt).getTime()
    );
  }, [attempts]);

  if (!attempts || attempts.length === 0) {
    return (
      <div className="charts-empty-state">
        <p className="b-2">
          No se encontraron sesiones de reaccion de movimiento para este jugador.
        </p>
      </div>
    );
  }

  const displayAttempts = selectedSession === "all" ? sortedAttempts : [sortedAttempts[Number(selectedSession)]];

  const renderExpandedChart = () => {
    switch (expandedChart) {
      case 'chart1': return <ReactionByLevelLineChart attempts={displayAttempts} isExpanded={true} />;
      case 'chart2': return <ReactionHandRadarChart attempts={displayAttempts} isExpanded={true} />;
      case 'chart3': return <AccuracyByLevelBarChart attempts={displayAttempts} isExpanded={true} />;
      case 'chart4': return <OverallAccuracyDoughnutChart attempts={displayAttempts} isExpanded={true} />;
      case 'chart5': return <SessionHistoryScatterChart attempts={sortedAttempts} isExpanded={true} />;
      case 'chart6': return <OverallPerformanceRadarChart attempts={displayAttempts} isExpanded={true} />;
      default: return null;
    }
  };

  const SessionSelector = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span className="b-3" style={{ color: COLORS.muted }}>Ver sesión:</span>
      <select 
        value={selectedSession} 
        onChange={(e) => setSelectedSession(e.target.value)}
        className="exercise-select"
        style={{ padding: '6px 12px', minWidth: '200px' }}
      >
        <option value="all">Todas las sesiones (Promedio)</option>
        {sortedAttempts.map((a, i) => (
           <option key={i} value={i}>
             Sesión {i + 1} — {formatDate(parseAttemptDate(a.completedAt))}
           </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="movement-charts">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <p className="charts-meta b-3" style={{ margin: 0 }}>
          {attempts.length} sesion{attempts.length !== 1 ? "es" : ""} encontrada{attempts.length !== 1 ? "s" : ""}.
          {selectedSession === "all" ? " Mostrando datos históricos combinados." : ` Mostrando Sesión ${Number(selectedSession) + 1}.`}
        </p>
        {SessionSelector}
      </div>

      <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <ReactionByLevelLineChart attempts={displayAttempts} onExpand={() => setExpandedChart('chart1')} />
        <ReactionHandRadarChart attempts={displayAttempts} onExpand={() => setExpandedChart('chart2')} />
        <AccuracyByLevelBarChart attempts={displayAttempts} onExpand={() => setExpandedChart('chart3')} />
        <OverallAccuracyDoughnutChart attempts={displayAttempts} onExpand={() => setExpandedChart('chart4')} />
        <SessionHistoryScatterChart attempts={sortedAttempts} onExpand={() => setExpandedChart('chart5')} />
        <OverallPerformanceRadarChart attempts={displayAttempts} onExpand={() => setExpandedChart('chart6')} />
      </div>

      {expandedChart && (
        <ChartModal onClose={() => setExpandedChart(null)} headerExtra={SessionSelector}>
          {renderExpandedChart()}
        </ChartModal>
      )}
    </div>
  );
}

export default MovementCharts;
