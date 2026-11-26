import "../../Styles/Ui/TextInput.css";

function TextInput({ label, id, ...props }) {
  return (
    <label className="text-input" htmlFor={id}>
      <span className="b-3">{label}</span>
      <input id={id} {...props} />
    </label>
  );
}

export default TextInput;
