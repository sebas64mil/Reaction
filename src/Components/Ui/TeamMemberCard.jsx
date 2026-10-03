import { FiArrowUpRight } from "react-icons/fi";
import "../../Styles/Ui/TeamMemberCard.css";

function TeamMemberCard({ initials, name, role, image, href }) {
  const Card = href ? "a" : "article";
  const linkProps = href
    ? {
        href,
        target: "_blank",
        rel: "noreferrer",
      }
    : {};

  return (
    <Card className="team-card" {...linkProps}>
      <div className="team-card-background" aria-hidden="true">
        <span className="avatar-fallback">{initials}</span>
        {image && (
          <img
            className="avatar-image"
            src={image}
            alt=""
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
        )}
      </div>
      <div className="team-card-overlay" aria-hidden="true" />
      <div className="team-card-info">
        <h3 className="h-6">{name}</h3>
        <p className="b-3">{role}</p>
      </div>
      {href && (
        <FiArrowUpRight className="team-card-arrow" aria-hidden="true" />
      )}
    </Card>
  );
}

export default TeamMemberCard;
