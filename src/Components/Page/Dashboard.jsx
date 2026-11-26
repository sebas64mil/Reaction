import { useState, useEffect, useMemo } from "react";
import { FiArrowLeft, FiLoader, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import {
  FirestoreService,
  MOVEMENT_EXERCISE_ID,
  LIGHTS_EXERCISE_ID,
  PASSES_EXERCISE_ID,
  DRIBBLE_EXERCISE_ID,
} from "../../../Modules/firebase.service.js";
import Button from "../Ui/Button.jsx";
import FloatingToggle from "../Ui/FloatingToggle.jsx";
import ExerciseRecorderSection from "../Sections/Dashboard/ExerciseRecorderSection.jsx";
import PlayerIdentitySection from "../Sections/Dashboard/PlayerIdentitySection.jsx";
import MovementCharts from "../Graficos/MovementCharts.jsx";
import LightsCharts from "../Graficos/LightsCharts.jsx";
import PassesCharts from "../Graficos/PassesCharts.jsx";
import DribbleCharts from "../Graficos/DribbleCharts.jsx";
import ExerciseHistoricalChart from "../Graficos/ExerciseHistoricalChart.jsx";
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

const initialDraftDribble = {
  completedDate: localDate,
  completedTime: localTime,
  levels: [
    { correctAnswers: "", totalAttempts: "", accuracy: "", averageReaction: "" },
    { correctAnswers: "", totalAttempts: "", accuracy: "", averageReaction: "" },
    { correctAnswers: "", totalAttempts: "", accuracy: "", averageReaction: "" },
  ],
};

const ANALYSIS_EXERCISES = [
  {
    value: "movement",
    label: "Alcance Reactivo",
    desc: "Aislamiento de respuesta refleja y asimetría funcional entre extremidades.",
  },
  {
    value: "lights",
    label: "Sigue la Luz",
    desc: "Campo visual periférico, detección de estímulos luminosos y porcentaje de precisión.",
  },
  {
    value: "passes",
    label: "Captura Selectiva",
    desc: "Toma de decisiones motriz bajo estímulos de selección rápida y precisión de entrega.",
  },
  {
    value: "dribble",
    label: "Control de Dribleo",
    desc: "Coordinación dinámica continua, cadencia de bote y efectividad de respuesta.",
  },
];

function Dashboard() {
  // ── Toggle de visibilidad para simulación / escritura (por defecto false) ──
  const [showWriteSection, setShowWriteSection] = useState(false);

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
  const [selectedExerciseTab, setSelectedExerciseTab] = useState("movement");
  const [attempts, setAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [attemptsError, setAttemptsError] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncFeedback, setSyncFeedback] = useState("");

  // Partición memoizada de intentos por cada ejercicio
  const movementAttempts = useMemo(
    () =>
      attempts.filter(
        (d) =>
          d.exerciseId === MOVEMENT_EXERCISE_ID ||
          d.exerciseId === "movement"
      ),
    [attempts]
  );

  const lightsAttempts = useMemo(
    () =>
      attempts.filter(
        (d) =>
          d.exerciseId === LIGHTS_EXERCISE_ID ||
          d.exerciseId === "lights"
      ),
    [attempts]
  );

  const passesAttempts = useMemo(
    () =>
      attempts.filter(
        (d) =>
          d.exerciseId === PASSES_EXERCISE_ID ||
          d.exerciseId === "passes"
      ),
    [attempts]
  );

  const dribbleAttempts = useMemo(
    () =>
      attempts.filter(
        (d) =>
          d.exerciseId === DRIBBLE_EXERCISE_ID ||
          d.exerciseId === "dribbling" ||
          d.exerciseId === "reaction-dribble" ||
          d.exerciseId === "drible"
      ),
    [attempts]
  );

  // Intentos del ejercicio seleccionado actualmente
  const currentExerciseAttempts = useMemo(() => {
    if (selectedExerciseTab === "movement") return movementAttempts;
    if (selectedExerciseTab === "lights") return lightsAttempts;
    if (selectedExerciseTab === "passes") return passesAttempts;
    if (selectedExerciseTab === "dribble") return dribbleAttempts;
    return [];
  }, [selectedExerciseTab, movementAttempts, lightsAttempts, passesAttempts, dribbleAttempts]);

  const currentExerciseMeta =
    ANALYSIS_EXERCISES.find((e) => e.value === selectedExerciseTab) || ANALYSIS_EXERCISES[0];

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

  // Cargar todos los attempts cuando cambia el estudiante seleccionado
  useEffect(() => {
    if (!chartStudent) {
      setAttempts([]);
      return;
    }

    setLoadingAttempts(true);
    setAttemptsError("");
    firestoreService
      .getStudentAttempts(chartStudent, null)
      .then((data) => {
        console.log("[Dashboard] todos los attempts cargados:", data.length, data);
        setAttempts(data);
      })
      .catch((err) => {
        console.error("[Dashboard] error cargando attempts:", err);
        setAttemptsError(err.message ?? String(err));
      })
      .finally(() => setLoadingAttempts(false));
  }, [chartStudent]);

  // Sincronización periódica automática con Firebase cada 60 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!chartStudent) return;

      firestoreService
        .getStudentAttempts(chartStudent, null, true)
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
  }, [chartStudent]);

  // Handler para el botón manual que revisa si se actualizó la base de datos
  const handleSyncDatabase = async () => {
    setIsSyncing(true);
    setSyncFeedback("");
    try {
      const [latestStudents, latestAttempts] = await Promise.all([
        firestoreService.getAllStudents(true),
        chartStudent
          ? firestoreService.getStudentAttempts(chartStudent, null, true)
          : Promise.resolve([]),
      ]);

      setStudents(latestStudents);
      if (chartStudent) {
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
    } else if (newExercise === "dribbling" || newExercise === DRIBBLE_EXERCISE_ID) {
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
        // Auto-calcular precisión para Captura Selectiva y Control de Dribleo.
        if (
          selectedExercise === "passes" ||
          selectedExercise === "dribbling" ||
          selectedExercise === DRIBBLE_EXERCISE_ID
        ) {
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
        // ── Flujo Sigue la Luz ──
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
        if (player.universityId === chartStudent) {
          firestoreService
            .getStudentAttempts(chartStudent, null, true)
            .then(setAttempts)
            .catch(() => {});
        }
      } else if (selectedExercise === "passes") {
        // ── Flujo Captura Selectiva ──
        let passesSession = firestoreService.createPassesSession();
        draft.levels.forEach((lvl) => {
          passesSession = firestoreService.addPassesLevelToSession(passesSession, lvl);
        });
        const savedAttempt = await firestoreService.savePassesAttempt(
          player.universityId,
          passesSession,
          completedAt,
        );
        setFirebaseStatus(`Sesión de Captura Selectiva guardada con ID ${savedAttempt.id}.`);
        // Limpiar el formulario tras guardar correctamente
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
        if (player.universityId === chartStudent) {
          firestoreService
            .getStudentAttempts(chartStudent, null, true)
            .then(setAttempts)
            .catch(() => {});
        }
      } else if (selectedExercise === "dribbling" || selectedExercise === DRIBBLE_EXERCISE_ID) {
        // ── Flujo Control de Dribleo ──
        let dribbleSession = firestoreService.createDribbleSession();
        draft.levels.forEach((lvl) => {
          dribbleSession = firestoreService.addDribbleLevelToSession(dribbleSession, lvl);
        });
        const savedAttempt = await firestoreService.saveDribbleAttempt(
          player.universityId,
          dribbleSession,
          completedAt,
        );
        setFirebaseStatus(`Sesión de Control de Dribleo guardada con ID ${savedAttempt.id}.`);
        // Limpiar el formulario tras guardar correctamente
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
        if (player.universityId === chartStudent) {
          firestoreService
            .getStudentAttempts(chartStudent, null, true)
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
        if (player.universityId === chartStudent) {
          firestoreService
            .getStudentAttempts(chartStudent, null, true)
            .then(setAttempts)
            .catch(() => {});
        }
      }
    } catch (error) {
      setFirebaseStatus(error.message);
    }
  };

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

      {showWriteSection && (
        <div className="dashboard-write-section">
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
        </div>
      )}

      {/* ── Barra Superior de Analíticas: Selector de Jugador y Sincronización ── */}
      <section className="dashboard-panel dashboard-analytics-topbar">
        <div style={{ flex: 1, minWidth: "260px" }}>
          <label className="control-label" style={{ maxWidth: "460px" }}>
            <span className="h-5 dashboard-player-label">Seleccionar Jugador (Código Universitario)</span>
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
        </div>

        <div className="dashboard-sync-controls">
          {selectedStudentData && (
            <span className="charts-hint b-3" style={{ margin: 0 }}>
              Expediente: <strong>{selectedStudentData.name}</strong> ({selectedStudentData.studentCode ?? selectedStudentData.id})
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
      </section>

      {syncFeedback && (
        <p className="dashboard-sync-feedback b-3">
          <FiCheckCircle className="sync-check-icon" /> {syncFeedback}
        </p>
      )}

      {loadingAttempts ? (
        <div className="dashboard-charts-loading b-2" style={{ padding: "60px 0", justifyContent: "center" }}>
          <FiLoader className="spin-icon" style={{ fontSize: "24px" }} /> Cargando expediente de Firebase...
        </div>
      ) : attemptsError ? (
        <p className="dashboard-firebase-status b-3">{attemptsError}</p>
      ) : (
        <>
          {/* ══════════════════════════════════════════════════════════
              SELECTOR DE EJERCICIO COMPARTIDO
              Controla tanto el histórico (Sección A) como las gráficas
              específicas (Sección B)
              ══════════════════════════════════════════════════════════ */}
          <section className="analytics-exercise-picker" aria-labelledby="exercise-picker-title">
            <div className="analytics-exercise-picker-heading">
              <div>
                <h2 id="exercise-picker-title" className="h-5">Selecciona el análisis que quieres explorar</h2>
                <p className="b-3">
                  La selección se comparte entre el histórico y las gráficas detalladas de la sesión.
                </p>
              </div>
              <span className="analytics-exercise-picker-current b-3">
                {currentExerciseAttempts.length} {currentExerciseAttempts.length === 1 ? "sesión" : "sesiones"}
              </span>
            </div>
            <div className="exercise-filter-tabs" role="tablist" aria-label="Ejercicios disponibles">
            {ANALYSIS_EXERCISES.map((ex) => {
              const count =
                ex.value === "movement" ? movementAttempts.length :
                ex.value === "lights"   ? lightsAttempts.length   :
                ex.value === "passes"   ? passesAttempts.length   :
                ex.value === "dribble"  ? dribbleAttempts.length  : 0;
              return (
                <button
                  key={ex.value}
                  type="button"
                  role="tab"
                  aria-selected={selectedExerciseTab === ex.value}
                  className={`exercise-filter-tab b-3 ${selectedExerciseTab === ex.value ? "is-active" : ""}`}
                  onClick={() => setSelectedExerciseTab(ex.value)}
                >
                  <span className="exercise-filter-tab-label">{ex.label}</span>
                  <span className="exercise-filter-tab-count">{count}</span>
                </button>
              );
            })}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              SECCIÓN A: HISTÓRICO DEL EJERCICIO SELECCIONADO
              Se oculta automáticamente si hay menos de 2 sesiones
              ══════════════════════════════════════════════════════════ */}
          <ExerciseHistoricalChart
            attempts={currentExerciseAttempts}
            exerciseLabel={currentExerciseMeta.label}
          />

          {attempts.length === 0 ? (
            <section className="dashboard-panel dashboard-empty-results" role="status">
              <div className="dashboard-empty-results-icon">—</div>
              <h2 className="h-4">No hay resultados disponibles</h2>
              <p className="b-2">
                Este jugador todavía no tiene sesiones registradas. Cuando complete un ejercicio,
                sus métricas aparecerán aquí.
              </p>
            </section>
          ) : (
            /* ══════════════════════════════════════════════════════════
                SECCIÓN B: GRÁFICAS ESPECÍFICAS DE LA SESIÓN
                ══════════════════════════════════════════════════════════ */
            <section className="dashboard-panel exercise-breakdown-section">
              <div className="exercise-section-header">
                <span className={`exercise-indicator-tag tag-${selectedExerciseTab}`}>
                  {selectedExerciseTab === "movement" ? "01" :
                   selectedExerciseTab === "lights"   ? "02" :
                   selectedExerciseTab === "passes"   ? "03" : "04"}
                </span>
                <div>
                  <h3 className="h-5">{currentExerciseMeta.label}</h3>
                  <p className="b-3 exercise-subdesc">{currentExerciseMeta.desc}</p>
                </div>
              </div>

              {selectedExerciseTab === "movement" && <MovementCharts attempts={movementAttempts} />}
              {selectedExerciseTab === "lights"   && <LightsCharts   attempts={lightsAttempts}   />}
              {selectedExerciseTab === "passes"   && <PassesCharts   attempts={passesAttempts}   />}
              {selectedExerciseTab === "dribble"  && <DribbleCharts  attempts={dribbleAttempts}  />}
            </section>
          )}
        </>
      )}

      <Button className="dashboard-back-button" to="/about" variant="primary">
        <FiArrowLeft /> Volver a la experiencia
      </Button>

      {/* ── Toggle flotante flexible fijado abajo a la derecha ── */}
      <FloatingToggle
        isActive={showWriteSection}
        onToggle={() => setShowWriteSection((prev) => !prev)}
        label="Simulador de registro"
        activeLabel="Visible"
        inactiveLabel="Oculto"
      />
    </div>
  );
}

export default Dashboard;
