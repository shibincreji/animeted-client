import axios from "axios";
import pikachuImage from "../../assets/pikachu-1.png";
import "./Login.css";
import Input from "../Input";
import Button from "../Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { useState } from "react";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid Email")
    .required("Please enter your Email")
    .min(5, "Email cannot be less than 5 letters.")
    .max(30, "Email cannot be more than 30 letters."),
  password: yup
    .string()
    .required("Please enter your Password")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(loginSchema),
  });

  const handleFormSubmit = (formData) => {
    setIsLoading(true);
    axios
      .post(`${process.env.REACT_APP_API_URL}users/signin/`, {
        email: formData.email,
        password: formData.password,
      })
      .then((res) => {
        // console.log("Res", res);
        localStorage.setItem("token", res.data.token);
        setIsLoading(false);
        window.location.reload(false)
      })
      .catch((err) => {
        console.log("Err", err.response);
        setError(err.response.data.message)
        setIsLoading(false);
      });
  };

  return (
    <div className="Login">
      <img src={pikachuImage} alt="Pikachu" />
      <div>
        <h1>
          <span>Login</span>
          <br />
          Continue the Anime World Adventures
        </h1>
        <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
          <Input
            register={register}
            name="email"
            type="text"
            placeholder="Email"
            label="Email"
            error={!!errors.email}
            helperText={errors?.email?.message}
          />
          <Input
            register={register}
            name="password"
            type="password"
            placeholder="Password"
            label="Password"
            error={!!errors.password}
            helperText={errors?.password?.message}
          />
          <p className="error">{error}</p>
          <Button disabled={isLoading} isLoading={isLoading}>Login</Button>
        </form>
        <p>
          Dont have an account yet? <Link to="/auth/signup">Signup</Link>
        </p>
        <Link to="/auth/forgot">Forgot Password?</Link>
      </div>
    </div>
  );
};

export default Login;
