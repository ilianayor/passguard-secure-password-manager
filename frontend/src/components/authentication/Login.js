import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import InputField from "../input/InputField";
import Buttons from "../../utils/Buttons";
import toast from "react-hot-toast";
import { useMyContext } from "../../context/ContextApi";

const Login = () => {
  const [step, setStep] = useState(1);
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);

  const { setToken, token } = useMyContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { username: "", password: "", code: "" },
    mode: "onTouched",
  });

  const handleSuccessfulLogin = (tokenStr, decodedToken) => {
    const user = {
      username: decodedToken.sub,
      roles: decodedToken.roles ? decodedToken.roles.split(",") : [],
    };
    localStorage.setItem("JWT_TOKEN", tokenStr);
    localStorage.setItem("USER", JSON.stringify(user));
    setToken(tokenStr);
    navigate("/passwords");
  };

  const onLoginHandler = async (data) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/public/signin", data);
      toast.success("Login successful");
      reset();

      if (response.status === 200 && response.data.jwtToken) {
        setJwtToken(response.data.jwtToken);
        const decodedToken = jwtDecode(response.data.jwtToken);
        if (decodedToken.is2faEnabled) {
          setStep(2);
        } else {
          handleSuccessfulLogin(response.data.jwtToken, decodedToken);
        }
      } else {
        toast.error("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      if (error.response?.status === 429) {
  
      toast.error(
        error.response?.data?.Message ||
          "Your account is temporarily locked due to too many failed attempts. Please try again after 15 minutes."
      );
    } else if (error.response?.status === 401) {
      toast.error("Invalid credentials");
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
    } finally {
      setLoading(false);
    }
  };

  const onVerify2FaHandler = async (data) => {
    const code = data.code?.trim();
    if (!code) return toast.error("Please enter your MFA code");

    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("code", code);
      formData.append("jwtToken", jwtToken);

      await api.post("/auth/public/verify-mfa-login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const decodedToken = jwtDecode(jwtToken);
      handleSuccessfulLogin(jwtToken, decodedToken);
    } catch (error) {
      toast.error("Invalid MFA code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className="min-h-[calc(100vh-74px)] bg-white flex items-center justify-center font-[Montserrat]">
      {step === 1 ? (
        <form
          onSubmit={handleSubmit(onLoginHandler)}
          className="w-full max-w-[480px] bg-white rounded-xl border border-purple-100 p-8 sm:p-10"
        >
          <div className="mb-6">
            <h1 className="text-center text-2xl sm:text-3xl font-semibold text-slate-900">
              Login
            </h1>
            <p className="text-slate-600 text-center mt-1">
              Please enter your username and password
            </p>
            <div className="mt-4 h-px w-full bg-purple-100" />
          </div>

          <div className="flex flex-col gap-3">
            <InputField
              label="Username"
              required
              id="username"
              type="text"
              message="*Username is required"
              placeholder="Username"
              register={register}
              errors={errors}
              autoComplete="username"
            />
            <InputField
              label="Password"
              required
              id="password"
              type="password"
              message="*Password is required"
              placeholder="Password"
              register={register}
              errors={errors}
              autoComplete="current-password"
            />
          </div>

          <Buttons
            disabled={loading}
            onClickhandler={() => {}}
            type="submit"
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-purple-600 px-4 py-2 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? "Loading..." : "Log in"}
          </Buttons>

          <div className="mt-4 flex items-center justify-between text-sm">
            <Link
              className="text-purple-700 hover:text-purple-800"
              to="/forgot-password"
            >
              Forgot Password?
            </Link>
            <Link
              className="text-purple-700 hover:text-purple-800 font-semibold"
              to="/signup"
            >
              Create account
            </Link>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit(onVerify2FaHandler)}
          className="w-full max-w-[480px] bg-white rounded-xl border border-purple-100 p-8 sm:p-10"
        >
          <div className="mb-6">
            <h1 className="text-center text-2xl sm:text-3xl font-semibold text-slate-900">
              Verify MFA
            </h1>
            <p className="text-slate-600 text-center mt-1">
              Enter the 6-digit code to complete authentication
            </p>
            <div className="mt-4 h-px w-full bg-purple-100" />
          </div>

          <div className="flex flex-col gap-3">
            <InputField
              label="Enter Code"
              required
              id="code"
              type="text"
              message="*Code is required"
              placeholder="Enter your MFA code"
              register={register}
              errors={errors}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          </div>

          <Buttons
            disabled={loading}
            onClickhandler={() => {}}
            type="submit"
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-purple-600 px-4 py-2 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify MFA"}
          </Buttons>

          <div className="mt-4 text-center text-sm text-slate-600">
            Didn’t get a code? Check your authenticator app.
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
