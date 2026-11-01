import { FiArrowUpRight } from "react-icons/fi";
import Button from "../../Ui/Button.jsx";
import TextInput from "../../Ui/TextInput.jsx";
import "../../../Styles/Sections/Dashboard/PlayerIdentitySection.css";

function PlayerIdentitySection({ player, onChange, onIdentify, isIdentified }) {
  return (
    <section className="dashboard-panel player-identity-section">
      <div className="dashboard-panel-heading">
        <div>
          <h2 className="h-4">Crea el perfil del jugador.</h2>
        </div>
        <span className="dashboard-panel-status">
          {isIdentified ? "Jugador identificado" : "Pendiente"}
        </span>
      </div>
      <form className="identity-form" onSubmit={onIdentify}>
        <TextInput
          id="player-name"
          label="Nombre completo"
          name="name"
          value={player.name}
          onChange={onChange}
          placeholder="Ingresa el nombre"
          autoComplete="name"
          required
        />
        <TextInput
          id="university-id"
          label="Código universitario"
          name="universityId"
          value={player.universityId}
          onChange={onChange}
          placeholder="Ej. 20240001"
          autoComplete="off"
          required
        />
        <Button type="submit" variant="primary">
          {isIdentified ? "Actualizar jugador" : "Identificar jugador"}
          <FiArrowUpRight />
        </Button>
      </form>
      {isIdentified && (
        <p className="identity-confirmation b-3">
          ID activa: <strong>{player.universityId}</strong>
        </p>
      )}
    </section>
  );
}

export default PlayerIdentitySection;
