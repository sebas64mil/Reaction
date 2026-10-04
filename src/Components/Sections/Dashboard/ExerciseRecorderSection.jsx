import { FiPlus } from "react-icons/fi";
import Button from "../../Ui/Button.jsx";
import TextInput from "../../Ui/TextInput.jsx";
import "../../../Styles/Sections/Dashboard/ExerciseRecorderSection.css";

const exercises = [
  { value: "lights", label: "Luces", available: false },
  { value: "movement", label: "Reacción de movimiento", available: true },
  { value: "passes", label: "Pases", available: false },
  { value: "dribbling", label: "Drible", available: false },
];

const levelFields = [
  [
    ["averageReaction", "Reacción promedio (s)", "number", "0.01"],
    ["correctAnswers", "Respuestas correctas", "number"],
    ["totalAttempts", "Intentos totales", "number"],
    ["leftHandReaction", "Reacción mano izquierda (s)", "number", "0.01"],
    ["rightHandReaction", "Reacción mano derecha (s)", "number", "0.01"],
    ["leftHandCorrect", "Aciertos mano izquierda", "number"],
    ["leftHandAttempts", "Intentos mano izquierda", "number"],
    ["rightHandCorrect", "Aciertos mano derecha", "number"],
    ["rightHandAttempts", "Intentos mano derecha", "number"],
  ],
];

function ExerciseRecorderSection({
  selectedExercise,
  onExerciseChange,
  draft,
  onLevelChange,
  onSaveSession,
  disabled,
}) {
  const selected = exercises.find(
    (exercise) => exercise.value === selectedExercise,
  );

  return (
    <section className="dashboard-panel exercise-recorder-section">
      <div className="dashboard-panel-heading">
        <div>
          <p className="kicker">02 / Registro</p>
          <h2 className="h-4">Simula una sesión de experiencia.</h2>
        </div>
        <span className="dashboard-panel-counter b-3">
          3 niveles se guardan como una sesión
        </span>
      </div>

      <label className="exercise-picker">
        <span className="b-3">Ejercicio</span>
        <select
          className="exercise-select"
          value={selectedExercise}
          onChange={onExerciseChange}
          disabled={disabled}
        >
          {exercises.map((exercise) => (
            <option key={exercise.value} value={exercise.value}>
              {exercise.label}
              {!exercise.available ? " - próximamente" : ""}
            </option>
          ))}
        </select>
      </label>

      {!selected.available ? (
        <div className="exercise-empty-state">
          <span className="empty-state-mark">--</span>
          <h3 className="h-5">Aquí irá {selected.label.toLowerCase()}.</h3>
          <p className="b-2">
            Esta variable todavía no está disponible. El espacio queda listo
            para conectar sus resultados más adelante.
          </p>
        </div>
      ) : (
        <form className="movement-form" onSubmit={onSaveSession}>
          <div className="movement-form-intro">
            <span className="exercise-status">Disponible</span>
            <p className="b-2">
              Completa los datos de los tres niveles. La sesión se enviará a
              Firebase únicamente cuando estén todos listos.
            </p>
          </div>

          <div className="session-date-grid">
            <TextInput
              id="completed-date"
              label="Fecha de finalización"
              name="completedDate"
              type="date"
              value={draft.completedDate}
              onChange={(event) => onLevelChange("session", event)}
              disabled={disabled}
              required
            />
            <TextInput
              id="completed-time"
              label="Hora de finalización"
              name="completedTime"
              type="time"
              value={draft.completedTime}
              onChange={(event) => onLevelChange("session", event)}
              disabled={disabled}
              required
            />
          </div>

          <div className="level-input-list">
            {draft.levels.map((level, levelIndex) => (
              <fieldset className="level-input-card" key={levelIndex}>
                <legend className="h-5">Nivel {levelIndex + 1}</legend>
                <div className="movement-input-grid">
                  {levelFields[0].map(([name, label, type, step]) => (
                    <TextInput
                      key={name}
                      id={`level-${levelIndex + 1}-${name}`}
                      label={label}
                      name={name}
                      type={type}
                      min="0"
                      step={step}
                      value={level[name]}
                      onChange={(event) => onLevelChange(levelIndex, event)}
                      disabled={disabled}
                      required
                    />
                  ))}
                </div>
                <p className="level-calculation b-3">
                  Precisión por mano y combinada: se calculará con aciertos e
                  intentos al guardar.
                </p>
              </fieldset>
            ))}
          </div>

          <Button type="submit" variant="secondary" disabled={disabled}>
            <FiPlus /> Finalizar y guardar los 3 niveles
          </Button>
          {disabled && (
            <p className="recorder-hint b-3">
              Identifica primero al jugador para comenzar a registrar datos.
            </p>
          )}
        </form>
      )}
    </section>
  );
}

export default ExerciseRecorderSection;
