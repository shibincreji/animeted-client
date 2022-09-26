import axios from "axios";
import kakashiImage from "../../assets/kakashi-1.png";
import "./Signup.css";
import Input from "../Input";
import Button from "../Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";

const signupSchema = yup.object().shape({
  username: yup
    .string()
    .required("Please enter an Username.")
    .min(3, "Username cannot be less than 3 letters.")
    .max(10, "Username cannot be more than 10 letters."),
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

const Signup = () => {
  let history = useHistory();

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
    resolver: yupResolver(signupSchema),
  });

  const handleFormSubmit = (formData) => {
    setIsLoading(true);
    axios
      .post(`${process.env.REACT_APP_API_URL}users/`, {
        email: formData.email,
        password: formData.password,
        username: formData.username,
      })
      .then((res) => {
        // console.log("Res", res);
        setIsLoading(false);
        history.push("/auth/login");
      })
      .catch((err) => {
        console.log("Err", err.response);
        setError(err.response.data.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="Signup">
      <div>
        <h1>
          <span>Signup</span>
          <br />
          Enter the world of Anime
        </h1>
        <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
          <Input
            register={register}
            name="username"
            type="text"
            placeholder="Username"
            label="Username"
            error={!!errors.username}
            helperText={errors?.username?.message}
          />
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
          <Button disabled={isLoading} isLoading={isLoading}>
            Signup
          </Button>
        </form>
        <p>
          Already have an account? <Link to="/auth/login">Login</Link>
        </p>
      </div>
      <img src={kakashiImage} alt="Kakashi" />
    </div>
  );
};

export default Signup;
