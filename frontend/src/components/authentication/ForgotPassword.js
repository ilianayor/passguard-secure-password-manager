import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import InputField from "../input/InputField";
import Buttons from "../../utils/Buttons";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../../context/ContextApi";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useMyContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const onPasswordForgotHandler = async (data) => {
    const { email } = data;
    try {
      setLoading(true);
      const formData = new URLSearchParams();
      formData.append("email", email);

      await api.post("/auth/public/forgot-password", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      reset();
      toast.success("Password reset email sent.");
    } catch (error) {
      toast.error("Error sending password reset email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <div
      className="min-h-[calc(100vh-74px)] bg-white flex justify-center items-center font-[Montserrat]"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <form
        onSubmit={handleSubmit(onPasswordForgotHandler)}
        className="w-full max-w-[480px] bg-white rounded-xl border border-purple-100 py-8 sm:px-8 px-4 shadow-md"
      >
        <div>
          <h1 className="text-center font-bold text-2xl sm:text-3xl text-slate-900">
            Forgot Password?
          </h1>
          <p className="text-slate-600 text-center mt-1">
            Enter your email and we’ll send you a reset link.
          </p>
          <div className="mt-4 h-px w-full bg-purple-100" />
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <InputField
            label="Email"
            required
            id="email"
            type="email"
            message="Email is required"
            placeholder="Enter your email"
            register={register}
            errors={errors}
          />
        </div>

        <Buttons
          disabled={loading}
          onClickhandler={() => {}}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold flex justify-center w-full py-2 rounded-full my-6 transition-colors duration-150 disabled:opacity-60"
          type="text"
        >
          {loading ? <span>Loading...</span> : "Send Reset Link"}
        </Buttons>

        <p className="text-center text-sm text-slate-700">
          <Link
            className="text-purple-700 hover:text-purple-800 font-semibold underline"
            to="/login"
          >
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
