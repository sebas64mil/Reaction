import "../../../Styles/Sections/About/ExperienceResultsSection.css";

const exercises = [
  { name: "Luces", status: "Próximamente" },
  {
    name: "Reacción de movimiento",
    status: "Disponible",
    reaction: "0.82s",
    accuracy: "80%",
    hits: "16/20",
  },
  { name: "Pases", status: "Próximamente" },
  { name: "Drible", status: "Próximamente" },
];

function ExperienceResultsSection() {
  return (
    <section className="experience-results section-wrap">
      <div className="section-heading">
        <div>
          <p className="kicker">Lectura de la experiencia</p>
          <h2 className="h-2">
            Cada sesión deja
            <br />
            <em>una señal.</em>
          </h2>
        </div>
        <p className="b-2">
          Consulta el estado de cada ejercicio y prepara los datos que luego
          estarán disponibles en tu dashboard.
        </p>
      </div>
      <div className="experience-results-grid">
        {exercises.map((exercise) => (
          <article
            className={`experience-result-card ${
              exercise.reaction ? "is-available" : ""
            }`}
            key={exercise.name}
          >
            <span className="b-3">{exercise.status}</span>
            <h3 className="h-5">{exercise.name}</h3>
            {exercise.reaction ? (
              <div className="experience-result-values">
                <span>
                  <small className="b-3">Reacción</small>
                  <strong className="h-6">{exercise.reaction}</strong>
                </span>
                <span>
                  <small className="b-3">Aciertos</small>
                  <strong className="h-6">{exercise.hits}</strong>
                </span>
                <span>
                  <small className="b-3">Precisión</small>
                  <strong className="h-6">{exercise.accuracy}</strong>
                </span>
              </div>
            ) : (
              <p className="b-3">Aquí aparecerán sus resultados.</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default ExperienceResultsSection;
