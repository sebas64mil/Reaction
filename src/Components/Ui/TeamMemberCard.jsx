import "../../Styles/Ui/TeamMemberCard.css";

function TeamMemberCard({ initials, name, role }) {
  return (
    <article className="team-card">
      <div className="avatar">{initials}</div>
      <div>
        <h3 className="h-6">{name}</h3>
        <p className="b-3">{role}</p>
      </div>
    </article>
  );
}

export default TeamMemberCard;
