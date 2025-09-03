import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import InputField from "../input/InputField";
import toast from "react-hot-toast";
import Buttons from "../../utils/Buttons";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleResetPassword = async (data) => {
    const { password } = data;
    const token = searchParams.get("token");

    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    setLoading(true);
    try {
      // ✅ send as x-www-form-urlencoded because backend uses @RequestParam
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("newPassword", password);

      await api.post("/auth/public/reset-password", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      toast.success("Password reset successful.");
      reset();
      navigate("/login");
    } catch (error) {
      console.error("Reset password error:", error?.response?.data);
      toast.error(error?.response?.data?.message || "Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-74px)] bg-white flex justify-center items-center font-[Montserrat]"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <form
        onSubmit={handleSubmit(handleResetPassword)}
        className="w-full max-w-[480px] bg-white rounded-xl border border-purple-100 py-8 sm:px-8 px-4"
      >
        <div>
          <h1 className="text-center font-bold text-2xl sm:text-3xl text-slate-900">
            Reset password
          </h1>
          <p className="text-slate-600 text-center mt-1">
            Enter and confirm your new password
          </p>
          <div className="mt-4 h-px w-full bg-purple-100" />
        </div>

        <div className="flex flex-col gap-3 mt-4">
          {/* New password using shared InputField */}
          <InputField
            label="New password"
            id="password"
            type="password"
            placeholder="New password"
            register={register}
            errors={errors}
            required
            message="Password is required"
            min={8}
            pattern={/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/}
            patternMessage="Password must include letters, numbers and a special character"
          />

          {/* Confirm password with inline validation */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="confirmPassword"
              className="font-semibold text-md text-slate-800"
            >
              Confirm password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Re-enter password"
              className={`px-2 py-2 border outline-none bg-transparent text-slate-700 rounded-md ${
                errors.confirmPassword?.message
                  ? "border-red-500"
                  : "border-slate-700"
              }`}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword?.message && (
              <p className="text-sm font-semibold text-red-500 mt-0">
                {errors.confirmPassword.message}*
              </p>
            )}
          </div>
        </div>

        <Buttons
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold flex justify-center w-full py-2 rounded-full my-4 transition-colors duration-150 disabled:opacity-60"
          type="submit"
        >
          {loading ? <span>Processing...</span> : "Reset Password"}
        </Buttons>

        <p className="text-center text-sm text-slate-700 mt-2">
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

export default ResetPassword;
