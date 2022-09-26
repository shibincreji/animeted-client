import "./Input.css";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { useState } from "react";

const Input = ({
  register,
  name,
  label,
  type = "text",
  placeholder,
  error,
  helperText,
  disabled = false,
  onChange,
  required = false,
  value,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  if (type === "textarea") {
    return (
      <div className="Input flex flex-col mb-4 h-full">
        <label className="leading-4" htmlFor={name}>
          {label}
        </label>
        <textarea
          {...(register ? register(name) : {})}
          onChange={onChange}
          disabled={disabled}
          id={name}
          placeholder={placeholder}
          rows={6}
          required={required}
          value={value}
          name={name}
        />
        {error && (
          <p className="error">{helperText}</p>
        )}
      </div>
    );
  }

  return (
    <div className="Input">
      <label className="" htmlFor={name}>
        {label}
      </label>
      <div className="input-box">
        <input
          {...(register ? register(name) : {})}
          onChange={onChange}
          disabled={disabled}
          type={
            type === "password" ? (passwordVisible ? "text" : "password") : type
          }
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
        />
        {type === "password" && (
          <div
            className="password-toggle"
            onClick={() => setPasswordVisible((prev) => !prev)}
          >
            {passwordVisible ? (
              <BsFillEyeSlashFill className="eye-close" />
            ) : (
              <BsFillEyeFill className="eye-open" />
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="error">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
