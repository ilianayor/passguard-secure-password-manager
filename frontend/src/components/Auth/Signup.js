import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import Buttons from "../../utils/Buttons";
import InputField from "../input/InputField";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMyContext } from "../../context/ContextApi";

const Signup = () => {
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(false);
  const { token } = useMyContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    setRole("ROLE_USER");
  }, []);

  const onSubmitHandler = async (data) => {
    const { username, email, password, confirmPassword } = data;

    // Confirm password validation
    if (password !== confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

    const sendData = { username, email, password, role: [role] };

    try {
      setLoading(true);
      const response = await api.post("/auth/public/signup", sendData);
      toast.success("Register Successful");
      reset();
      if (response.data) {
        navigate("/login");
      }
    } catch (error) {
      if (
        error?.response?.data?.message === "Error: Username is already taken!"
      ) {
        setError("username", { message: "Username is already taken" });
        toast.error("Username is already taken");
      } else if (
        error?.response?.data?.message === "Error: Email is already in use!"
      ) {
        setError("email", { message: "Email is already in use" });
        toast.error("Email is already in use");
      } else {
        toast.error(error?.response?.data?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div
      className="min-h-[calc(100vh-74px)] bg-white flex justify-center items-center font-[Montserrat]"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="w-full max-w-[480px] bg-white rounded-xl border border-purple-100 py-8 sm:px-8 px-4"
      >
        <div>
          <h1 className="text-center font-bold text-2xl sm:text-3xl text-slate-900">
            Register
          </h1>
          <p className="text-slate-600 text-center mt-1">
            Enter your credentials to create a new account
          </p>
          <div className="mt-4 h-px w-full bg-purple-100" />
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <InputField
            label="Username"
            required
            id="username"
            type="text"
            message="Username is required"
            placeholder="Username"
            register={register}
            errors={errors}
          />
          <InputField
            label="Email address"
            required
            id="email"
            type="email"
            message="Email is required"
            placeholder="Email address"
            register={register}
            errors={errors}
          />
          <InputField
            label="Password"
            required
            id="password"
            type="password"
            message="Password is required"
            placeholder="Password"
            register={register}
            errors={errors}
            min={8}
            pattern={/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/}
            patternMessage="Password must be at least 8 characters and include letters, numbers and a special character"
          />
          <InputField
            label="Confirm Password"
            required
            id="confirmPassword"
            type="password"
            message="Please confirm your password"
            placeholder="Confirm Password"
            register={register}
            errors={errors}
            validate={(value) =>
              value === watch("password") || "Passwords do not match"
            }
          />
        </div>

        <Buttons
          disabled={loading}
          onClickhandler={() => {}}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold flex justify-center w-full py-2 rounded-full my-4 transition-colors duration-150 disabled:opacity-60"
          type="text"
        >
          {loading ? <span>Loading...</span> : "Register"}
        </Buttons>

        <p className="text-center text-sm text-slate-700 mt-2">
          Already have an account?{" "}
          <Link
            className="text-purple-700 hover:text-purple-800 font-semibold underline"
            to="/login"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
