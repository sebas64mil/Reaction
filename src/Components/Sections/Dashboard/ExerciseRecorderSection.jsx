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

function ExerciseRecorderSection({
  selectedExercise,
  onExerciseChange,
  draft,
  onDraftChange,
  onAddRepetition,
  repetitions,
  disabled,
}) {
  const selected = exercises.find((exercise) => exercise.value === selectedExercise);

  return (
    <section className="dashboard-panel exercise-recorder-section">
      <div className="dashboard-panel-heading">
        <div>
          <p className="kicker">02 / Registro</p>
          <h2 className="h-4">Simula una sesión de experiencia.</h2>
        </div>
        <span className="dashboard-panel-counter b-3">
          {repetitions.length} repeticiones guardadas
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
        <form className="movement-form" onSubmit={onAddRepetition}>
          <div className="movement-form-intro">
            <span className="exercise-status">Disponible</span>
            <p className="b-2">
              Registra una nueva repetición de reacción de movimiento. Puedes
              repetir la variable tantas veces como necesites.
            </p>
          </div>
          <div className="movement-input-grid">
            <TextInput
              id="reaction-time"
              label="Reacción promedio (s)"
              name="reaction"
              type="number"
              min="0"
              step="0.01"
              value={draft.reaction}
              onChange={onDraftChange}
              disabled={disabled}
              required
            />
            <TextInput
              id="hits"
              label="Aciertos"
              name="hits"
              type="number"
              min="0"
              value={draft.hits}
              onChange={onDraftChange}
              disabled={disabled}
              required
            />
            <TextInput
              id="attempts"
              label="Intentos"
              name="attempts"
              type="number"
              min="1"
              value={draft.attempts}
              onChange={onDraftChange}
              disabled={disabled}
              required
            />
            <TextInput
              id="left-reaction"
              label="Reacción mano izquierda (s)"
              name="leftReaction"
              type="number"
              min="0"
              step="0.01"
              value={draft.leftReaction}
              onChange={onDraftChange}
              disabled={disabled}
              required
            />
            <TextInput
              id="right-reaction"
              label="Reacción mano derecha (s)"
              name="rightReaction"
              type="number"
              min="0"
              step="0.01"
              value={draft.rightReaction}
              onChange={onDraftChange}
              disabled={disabled}
              required
            />
            <TextInput
              id="left-accuracy"
              label="Precisión mano izquierda (%)"
              name="leftAccuracy"
              type="number"
              min="0"
              max="100"
              value={draft.leftAccuracy}
              onChange={onDraftChange}
              disabled={disabled}
              required
            />
            <TextInput
              id="right-accuracy"
              label="Precisión mano derecha (%)"
              name="rightAccuracy"
              type="number"
              min="0"
              max="100"
              value={draft.rightAccuracy}
              onChange={onDraftChange}
              disabled={disabled}
              required
            />
          </div>
          <Button type="submit" variant="secondary" disabled={disabled}>
            <FiPlus /> Registrar repetición
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
