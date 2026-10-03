function TeamMemberCard({ initials, name, role }) {
  return (
    <article className="team-card">
      <div className="avatar">{initials}</div>
      <div>
        <h3>{name}</h3>
        <p>{role}</p>
      </div>
    </article>
  );
}

export default TeamMemberCard;
