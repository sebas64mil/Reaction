import { Link } from "react-router-dom";
import "../../Styles/Ui/Button.css";

function Button({
  children,
  variant = "primary",
  className = "",
  to,
  href,
  type = "button",
  disabled = false,
  ...props
}) {
  const Component = to ? Link : href ? "a" : "button";
  const destination = to ? { to } : href ? { href } : { type, disabled };

  return (
    <Component
      className={`button button-${variant} ${className}`.trim()}
      {...destination}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Button;
