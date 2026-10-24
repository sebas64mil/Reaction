import { useState, useEffect } from "react";
import { FiArrowLeft, FiLoader, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import { FirestoreService, MOVEMENT_EXERCISE_ID, LIGHTS_EXERCISE_ID, PASSES_EXERCISE_ID } from "../../../Modules/firebase.service.js";
import Button from "../Ui/Button.jsx";
import ExerciseRecorderSection from "../Sections/Dashboard/ExerciseRecorderSection.jsx";
import PlayerIdentitySection from "../Sections/Dashboard/PlayerIdentitySection.jsx";
import MovementCharts from "../Graficos/MovementCharts.jsx";
import LightsCharts from "../Graficos/LightsCharts.jsx";
import PassesCharts from "../Graficos/PassesCharts.jsx";
import ComingSoonChart from "../Graficos/ComingSoonChart.jsx";
import "../../Styles/Page/Dashboard.css";
import "../../Styles/Page/DashboardData.css";

const firestoreService = new FirestoreService();

const initialPlayer = { name: "", universityId: "" };

const currentDateTime = new Date();
const localDate = [
  currentDateTime.getFullYear(),
  String(currentDateTime.getMonth() + 1).padStart(2, "0"),
  String(currentDateTime.getDate()).padStart(2, "0"),
].join("-");
const localTime = [
  String(currentDateTime.getHours()).padStart(2, "0"),
  String(currentDateTime.getMinutes()).padStart(2, "0"),
].join(":");

const initialDraft = {
  completedDate: localDate,
  completedTime: localTime,
  levels: [
    {
      averageReaction: "0.92", correctAnswers: "18", totalAttempts: "20",
      leftHandReaction: "0.89", rightHandReaction: "0.95",
      leftHandCorrect: "18", leftHandAttempts: "20",
      rightHandCorrect: "17", rightHandAttempts: "20",
    },
    {
      averageReaction: "0.81", correctAnswers: "19", totalAttempts: "20",
      leftHandReaction: "0.78", rightHandReaction: "0.84",
      leftHandCorrect: "19", leftHandAttempts: "20",
      rightHandCorrect: "18", rightHandAttempts: "20",
    },
    {
      averageReaction: "0.74", correctAnswers: "20", totalAttempts: "20",
      leftHandReaction: "0.72", rightHandReaction: "0.76",
      leftHandCorrect: "20", leftHandAttempts: "20",
      rightHandCorrect: "19", rightHandAttempts: "20",
    },
  ],
};

const initialDraftLights = {
  completedDate: localDate,
  completedTime: localTime,
  levels: [
    { correctAnswers: "", accuracy: "", averageReaction: "" },
    { correctAnswers: "", accuracy: "", averageReaction: "" },
    { correctAnswers: "", accuracy: "", averageReaction: "" },
  ],
};

const initialDraftPasses = {
  completedDate: localDate,
  completedTime: localTime,
  levels: [
    { correctAnswers: "", totalAttempts: "", accuracy: "", averageReaction: "" },
    { correctAnswers: "", totalAttempts: "", accuracy: "", averageReaction: "" },
    { correctAnswers: "", totalAttempts: "", accuracy: "", averageReaction: "" },
  ],
};

const CHART_EXERCISES = [
  { value: MOVEMENT_EXERCISE_ID, label: "Reaccion de movimiento", available: true },
  { value: LIGHTS_EXERCISE_ID, label: "Luces", available: true },
  { value: PASSES_EXERCISE_ID, label: "Pases", available: true },
  { value: "dribbling", label: "Drible", available: false },
];


function Dashboard() {
  // ── Estado seccion registro ──
  const [player, setPlayer] = useState(initialPlayer);
  const [isIdentified, setIsIdentified] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("movement");
  const [draft, setDraft] = useState(initialDraft);
  const [firebaseStatus, setFirebaseStatus] = useState("");

  // ── Estado analiticas ──
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentsError, setStudentsError] = useState("");
  const [chartStudent, setChartStudent] = useState("");
  const [chartExercise, setChartExercise] = useState(MOVEMENT_EXERCISE_ID);
  const [attempts, setAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [attemptsError, setAttemptsError] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncFeedback, setSyncFeedback] = useState("");

  // Cargar lista de estudiantes al montar la pagina (usa cache si esta vigente)
  useEffect(() => {
    setLoadingStudents(true);
    firestoreService
      .getAllStudents()
      .then((list) => {
        setStudents(list);
        if (list.length > 0) setChartStudent(list[0].id);
      })
      .catch((err) => setStudentsError(err.message))
      .finally(() => setLoadingStudents(false));
  }, []);

  // Cargar attempts cuando cambia el estudiante o el ejercicio seleccionado (usa cache si esta vigente)
  useEffect(() => {
    if (!chartStudent) return;
    const exercise = CHART_EXERCISES.find((e) => e.value === chartExercise);
    if (!exercise?.available) { setAttempts([]); return; }

    setLoadingAttempts(true);
    setAttemptsError("");
    firestoreService
      .getStudentAttempts(chartStudent, chartExercise)
      .then((data) => {
        console.log("[Dashboard] attempts cargados:", data.length, data);
        setAttempts(data);
      })
      .catch((err) => {
        console.error("[Dashboard] error cargando attempts:", err);
        setAttemptsError(err.message ?? String(err));
      })
      .finally(() => setLoadingAttempts(false));
  }, [chartStudent, chartExercise]);

  // Sincronización periódica automática con Firebase cada 60 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!chartStudent) return;
      const exercise = CHART_EXERCISES.find((e) => e.value === chartExercise);
      if (!exercise?.available) return;

      // Realiza el llamado a Firebase forzando refresco de la base de datos
      firestoreService
        .getStudentAttempts(chartStudent, chartExercise, true)
        .then((data) => {
          setAttempts(data);
          const now = new Date();
          setLastSyncTime(now);
        })
        .catch(() => {});

      firestoreService
        .getAllStudents(true)
        .then((list) => {
          setStudents(list);
        })
        .catch(() => {});
    }, 60000);

    return () => clearInterval(intervalId);
  }, [chartStudent, chartExercise]);

  // Handler para el botón manual que revisa si se actualizó la base de datos
  const handleSyncDatabase = async () => {
    setIsSyncing(true);
    setSyncFeedback("");
    try {
      const exercise = CHART_EXERCISES.find((e) => e.value === chartExercise);
      const [latestStudents, latestAttempts] = await Promise.all([
        firestoreService.getAllStudents(true),
        chartStudent && exercise?.available
          ? firestoreService.getStudentAttempts(chartStudent, chartExercise, true)
          : Promise.resolve([]),
      ]);

      setStudents(latestStudents);
      if (chartStudent && exercise?.available) {
        setAttempts(latestAttempts);
      }

      const now = new Date();
      setLastSyncTime(now);
      setSyncFeedback(
        `Base de datos al día. Última revisión: ${now.toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}`
      );
    } catch (err) {
      console.error("[Dashboard] Error al sincronizar con Firebase:", err);
      setSyncFeedback("Error al verificar actualizaciones en la base de datos.");
    } finally {
      setIsSyncing(false);
    }
  };

  // ── Handlers seccion registro ──
  const handlePlayerChange = (event) => {
    const { name, value } = event.target;
    setPlayer((p) => ({ ...p, [name]: value }));
  };

  const handleIdentify = async (event) => {
    event.preventDefault();
    try {
      const result = await firestoreService.createStudentIfNotExists(
        player.name,
        player.universityId,
      );
      setIsIdentified(true);
      setFirebaseStatus(
        result.created
          ? "Estudiante creado en Firebase."
          : "Estudiante existente recuperado de Firebase.",
      );
      setChartStudent(player.universityId);

      firestoreService
        .getAllStudents()
        .then(setStudents)
        .catch(() => {});
    } catch (error) {
      setFirebaseStatus(error.message);
    }
  };

  const handleExerciseChange = (event) => {
    const newExercise = event.target.value;
    setSelectedExercise(newExercise);
    // Limpiar el draft con los campos correctos para el nuevo ejercicio
    if (newExercise === "lights") {
      setDraft({
        completedDate: draft.completedDate,
        completedTime: draft.completedTime,
        levels: [
          { correctAnswers: "", accuracy: "", averageReaction: "" },
          { correctAnswers: "", accuracy: "", averageReaction: "" },
          { correctAnswers: "", accuracy: "", averageReaction: "" },
        ],
      });
    } else if (newExercise === "passes") {
      setDraft({
        completedDate: draft.completedDate,
        completedTime: draft.completedTime,
        levels: [
          { correctAnswers: "", totalAttempts: "", accuracy: "", averageReaction: "" },
          { correctAnswers: "", totalAttempts: "", accuracy: "", averageReaction: "" },
          { correctAnswers: "", totalAttempts: "", accuracy: "", averageReaction: "" },
        ],
      });
    } else if (newExercise === "movement") {
      setDraft(initialDraft);
    }
  };

  const handleLevelChange = (levelIndex, event) => {
    const { name, value } = event.target;
    if (levelIndex === "session") {
      setDraft((d) => ({ ...d, [name]: value }));
      return;
    }
    setDraft((d) => ({
      ...d,
      levels: d.levels.map((lvl, i) => {
        if (i !== levelIndex) return lvl;
        const updated = { ...lvl, [name]: value };
        // Auto-calcular precisión para pases si se proporcionan aciertos e intentos totales
        if (selectedExercise === "passes") {
          const ca = name === "correctAnswers" ? value : updated.correctAnswers;
          const ta = name === "totalAttempts" ? value : updated.totalAttempts;
          if (name !== "accuracy" && ca !== "" && ta !== "" && Number(ta) > 0) {
            const numCa = Number(ca);
            const numTa = Number(ta);
            if (!isNaN(numCa) && !isNaN(numTa) && numTa > 0) {
              updated.accuracy = ((numCa / numTa) * 100).toFixed(1);
            }
          }
        }
        return updated;
      }),
    }));
  };

  const handleSaveSession = async (event) => {
    event.preventDefault();
    try {
      const completedAt = `${draft.completedDate}T${draft.completedTime}:00`;

      if (selectedExercise === "lights") {
        // ── Flujo Reacción por Luces ──
        let lightsSession = firestoreService.createLightsSession();
        draft.levels.forEach((lvl) => {
          lightsSession = firestoreService.addLightsLevelToSession(lightsSession, lvl);
        });
        const savedAttempt = await firestoreService.saveLightsAttempt(
          player.universityId,
          lightsSession,
          completedAt,
        );
        setFirebaseStatus(`Sesión de luces guardada con ID ${savedAttempt.id}.`);
        // Limpiar el draft de luces tras guardar correctamente
        setDraft({
          completedDate: draft.completedDate,
          completedTime: draft.completedTime,
          levels: [
            { correctAnswers: "", accuracy: "", averageReaction: "" },
            { correctAnswers: "", accuracy: "", averageReaction: "" },
            { correctAnswers: "", accuracy: "", averageReaction: "" },
          ],
        });
        // Recargar graficas si el estudiante guardado es el mismo del selector
        if (player.universityId === chartStudent && chartExercise === LIGHTS_EXERCISE_ID) {
          firestoreService
            .getStudentAttempts(chartStudent, chartExercise, true)
            .then(setAttempts)
            .catch(() => {});
        }
      } else if (selectedExercise === "passes") {
        // ── Flujo Ejercicio de Pases ──
        let passesSession = firestoreService.createPassesSession();
        draft.levels.forEach((lvl) => {
          passesSession = firestoreService.addPassesLevelToSession(passesSession, lvl);
        });
        const savedAttempt = await firestoreService.savePassesAttempt(
          player.universityId,
          passesSession,
          completedAt,
        );
        setFirebaseStatus(`Sesión de pases guardada con ID ${savedAttempt.id}.`);
        // Limpiar el draft de pases tras guardar correctamente
        setDraft({
          completedDate: draft.completedDate,
          completedTime: draft.completedTime,
          levels: [
            { correctAnswers: "", totalAttempts: "", accuracy: "", averageReaction: "" },
            { correctAnswers: "", totalAttempts: "", accuracy: "", averageReaction: "" },
            { correctAnswers: "", totalAttempts: "", accuracy: "", averageReaction: "" },
          ],
        });
        // Recargar graficas si el estudiante guardado es el mismo del selector
        if (player.universityId === chartStudent && chartExercise === PASSES_EXERCISE_ID) {
          firestoreService
            .getStudentAttempts(chartStudent, chartExercise, true)
            .then(setAttempts)
            .catch(() => {});
        }
      } else {
        // ── Flujo Reacción de Movimiento (existente) ──
        let completedSession = firestoreService.createMovementSession();
        draft.levels.forEach((lvl) => {
          completedSession = firestoreService.addLevelToSession(completedSession, lvl);
        });
        const savedAttempt = await firestoreService.saveCompletedAttempt(
          player.universityId,
          completedSession,
          completedAt,
        );
        setFirebaseStatus(`Sesion guardada con ID ${savedAttempt.id}.`);
        // Recargar graficas si el estudiante guardado es el mismo del selector
        if (player.universityId === chartStudent && chartExercise === MOVEMENT_EXERCISE_ID) {
          firestoreService
            .getStudentAttempts(chartStudent, chartExercise, true)
            .then(setAttempts)
            .catch(() => {});
        }
      }
    } catch (error) {
      setFirebaseStatus(error.message);
    }
  };

  const selectedChartExercise = CHART_EXERCISES.find((e) => e.value === chartExercise);
  const selectedStudentData = students.find((s) => s.id === chartStudent);

  return (
    <div className="page dashboard-page section-wrap">
      <div className="dashboard-top">
        <h1 className="h-1 dashboard-main-title">
          En cada
          <br />
          <em>sesión.</em>
        </h1>
      </div>

      <div className="dashboard-data-layout">
        <PlayerIdentitySection
          player={player}
          onChange={handlePlayerChange}
          onIdentify={handleIdentify}
          isIdentified={isIdentified}
        />
        <ExerciseRecorderSection
          selectedExercise={selectedExercise}
          onExerciseChange={handleExerciseChange}
          draft={draft}
          onLevelChange={handleLevelChange}
          onSaveSession={handleSaveSession}
          disabled={!isIdentified}
        />
      </div>

      {firebaseStatus && (
        <p className="dashboard-firebase-status b-3">{firebaseStatus}</p>
      )}

      {/* ── 03 / Analiticas ── */}
      <section className="dashboard-panel dashboard-charts-section">
        <div className="dashboard-panel-heading">
          <div>
            <p className="kicker">03 / Analiticas</p>
            <h2 className="h-4">Resultados historicos por jugador.</h2>
          </div>
          <div className="dashboard-sync-controls">
            {!loadingAttempts && selectedChartExercise?.available && chartStudent && (
              <span className="dashboard-panel-counter b-3">
                {attempts.length} sesion{attempts.length !== 1 ? "es" : ""}
              </span>
            )}
            <button
              type="button"
              className="dashboard-sync-button b-3"
              onClick={handleSyncDatabase}
              disabled={isSyncing}
              title="Revisar si se actualizó la base de datos en Firebase"
            >
              <FiRefreshCw className={`sync-icon ${isSyncing ? "spin-icon" : ""}`} />
              <span>{isSyncing ? "Comprobando..." : "Sincronizar base de datos"}</span>
            </button>
          </div>
        </div>

        {syncFeedback && (
          <p className="dashboard-sync-feedback b-3">
            <FiCheckCircle className="sync-check-icon" /> {syncFeedback}
          </p>
        )}

        <div className="charts-controls-grid">
          {/* Selector de estudiante */}
          <label className="control-label">
            <span className="b-3">Jugador (codigo de estudiante)</span>
            {loadingStudents ? (
              <div className="dashboard-charts-loading b-3">
                <FiLoader className="spin-icon" /> Cargando jugadores...
              </div>
            ) : studentsError ? (
              <p className="dashboard-firebase-status b-3">{studentsError}</p>
            ) : (
              <select
                className="exercise-select"
                value={chartStudent}
                onChange={(e) => setChartStudent(e.target.value)}
              >
                {students.length === 0 && (
                  <option value="">Sin jugadores registrados</option>
                )}
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.studentCode ?? s.id} — {s.name}
                  </option>
                ))}
              </select>
            )}
          </label>

          {/* Selector de ejercicio */}
          <label className="control-label">
            <span className="b-3">Ejercicio</span>
            <select
              className="exercise-select"
              value={chartExercise}
              onChange={(e) => setChartExercise(e.target.value)}
            >
              {CHART_EXERCISES.map((ex) => (
                <option key={ex.value} value={ex.value}>
                  {ex.label}{!ex.available ? " — en proceso" : ""}
                </option>
              ))}
            </select>
          </label>
        </div>

        {selectedStudentData && (
          <p className="charts-hint b-3">
            Viendo: <strong>{selectedStudentData.name}</strong> &mdash; {selectedChartExercise?.label}
          </p>
        )}

        {/* Contenido de graficas */}
        {!selectedChartExercise?.available ? (
          <ComingSoonChart exerciseId={chartExercise} />
        ) : loadingAttempts ? (
          <div className="dashboard-charts-loading b-2">
            <FiLoader className="spin-icon" /> Cargando historial...
          </div>
        ) : attemptsError ? (
          <p className="dashboard-firebase-status b-3">{attemptsError}</p>
        ) : chartExercise === LIGHTS_EXERCISE_ID ? (
          <LightsCharts attempts={attempts} />
        ) : chartExercise === PASSES_EXERCISE_ID ? (
          <PassesCharts attempts={attempts} />
        ) : (
          <MovementCharts attempts={attempts} />
        )}
      </section>

      <Button className="dashboard-back-button" to="/about" variant="primary">
        <FiArrowLeft /> Volver a la experiencia
      </Button>
    </div>
  );
}

export default Dashboard;
