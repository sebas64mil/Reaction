import { Link } from "react-router-dom";

function TextButton({
  children,
  variant = "primary",
  underline = false,
  className = "",
  to,
  href,
  as: ComponentProp,
  activeClassName = "active",
  ...props
}) {
  const Component = ComponentProp || (to ? Link : href ? "a" : "button");
  const destination = to
    ? { to }
    : href
      ? { href }
      : { type: "button", ...props };
  const classes =
    `text-button text-button-${variant}${underline ? " text-button-underline" : ""} ${className}`.trim();
  const componentClassName = ComponentProp
    ? ({ isActive }) => `${classes}${isActive ? ` ${activeClassName}` : ""}`
    : classes;

  return (
    <Component className={componentClassName} {...destination} {...props}>
      {children}
    </Component>
  );
}

export default TextButton;
