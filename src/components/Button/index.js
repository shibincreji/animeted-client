import { Link } from "react-router-dom";
import "./Button.css";
import Loading from "../Loading";

const Button = ({
  link = false,
  to,
  type = "green",
  children,
  disabled = false,
  fullWidth = false,
  isLoading = false,
  onClick = () => {},
}) => {
  let classes = "btn ";
  if (!disabled) {
    switch (type) {
      case "green":
        classes += "btn-green ";
        break;
      case "red":
        classes += "btn-red ";
        break;
      default:
        classes += "btn-green ";
    }
  }

  if (fullWidth) classes += "btn-full ";

  if (link && to) {
    return (
      <Link className="btn-link" to={to}>
        <button id={`btn-id-${type}`} className={classes} disabled={disabled} onClick={onClick}>
          {isLoading ? (
            <div className="loading">
              <div>{children}</div>
              <Loading />
            </div>
          ) : (
            children
          )}
        </button>
      </Link>
    );
  }

  return (
    <button id={`btn-id-${type}`} className={classes} disabled={disabled} onClick={onClick}>
      {isLoading ? (
        <div className="loading">
          <div>{children}</div>
          <Loading />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
