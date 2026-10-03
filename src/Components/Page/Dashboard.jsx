import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import Button from "../Ui/Button.jsx";
import DashboardResultsSection from "../Sections/Dashboard/DashboardResultsSection.jsx";
import ExerciseRecorderSection from "../Sections/Dashboard/ExerciseRecorderSection.jsx";
import PlayerIdentitySection from "../Sections/Dashboard/PlayerIdentitySection.jsx";
import "../../Styles/Page/Dashboard.css";
import "../../Styles/Page/DashboardData.css";

const initialPlayer = {
  name: "",
  universityId: "",
};

const initialDraft = {
  reaction: "0.82",
  hits: "16",
  attempts: "20",
  leftReaction: "0.78",
  rightReaction: "0.86",
  leftAccuracy: "84",
  rightAccuracy: "76",
};

function Dashboard() {
  const [player, setPlayer] = useState(initialPlayer);
  const [isIdentified, setIsIdentified] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("movement");
  const [draft, setDraft] = useState(initialDraft);
  const [repetitions, setRepetitions] = useState([]);

  const handlePlayerChange = (event) => {
    const { name, value } = event.target;
    setPlayer((currentPlayer) => ({ ...currentPlayer, [name]: value }));
  };

  const handleIdentify = (event) => {
    event.preventDefault();
    setIsIdentified(true);
  };

  const handleDraftChange = (event) => {
    const { name, value } = event.target;
    setDraft((currentDraft) => ({ ...currentDraft, [name]: value }));
  };

  const handleAddRepetition = (event) => {
    event.preventDefault();

    setRepetitions((currentRepetitions) => [
      ...currentRepetitions,
      {
        exercise: selectedExercise,
        reaction: Number(draft.reaction),
        hits: Number(draft.hits),
        attempts: Number(draft.attempts),
        leftReaction: Number(draft.leftReaction),
        rightReaction: Number(draft.rightReaction),
        leftAccuracy: Number(draft.leftAccuracy),
        rightAccuracy: Number(draft.rightAccuracy),
      },
    ]);
  };

  return (
    <div className="page dashboard-page section-wrap">
      <div className="dashboard-top">
        <div>
          <h1 className="h-1">
            Tu juego,
            <br />
            <em>en números.</em>
          </h1>
        </div>
        <span className="coming-badge">Simulación local</span>
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
          onExerciseChange={(event) => setSelectedExercise(event.target.value)}
          draft={draft}
          onDraftChange={handleDraftChange}
          onAddRepetition={handleAddRepetition}
          repetitions={repetitions}
          disabled={!isIdentified}
        />
        <DashboardResultsSection repetitions={repetitions} />
      </div>
      <Button className="dashboard-back-button" to="/about" variant="primary">
        <FiArrowLeft /> Volver a la experiencia
      </Button>
    </div>
  );
}

export default Dashboard;
