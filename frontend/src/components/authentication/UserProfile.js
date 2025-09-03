import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useMyContext } from "../../context/ContextApi";
import Avatar from "@mui/material/Avatar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InputField from "../input/InputField";
import { useForm } from "react-hook-form";
import Buttons from "../../utils/Buttons";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { Blocks } from "react-loader-spinner";
import moment from "moment";
import Errors from "../Errors";

const UserProfile = () => {
  const { currentUser, token } = useMyContext();

  const [loginSession, setLoginSession] = useState(null);
  const [pageError, setPageError] = useState(false);

  const [openAccount, setOpenAccount] = useState(false);

  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [disabledLoader, setDisbledLoader] = useState(false);
  const [twofaCodeLoader, settwofaCodeLoader] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: currentUser?.username || "",
      email: currentUser?.email || "",
      password: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    setPageLoader(true);
    const fetchMfaStatus = async () => {
      try {
        const response = await api.get(`/auth/user/mfa-status`);
        setIs2faEnabled(!!response.data.is2faEnabled);
      } catch (error) {
        setPageError(error?.response?.data?.message);
        toast.error("Error fetching MFA status");
      } finally {
        setPageLoader(false);
      }
    };
    fetchMfaStatus();
  }, []);

  const enableMfa = async () => {
    setDisbledLoader(true);
    try {
      const response = await api.post(`/auth/enable-mfa`);
      setQrCodeUrl(response.data);
      setStep(2);
    } catch {
      toast.error("Error enabling MFA");
    } finally {
      setDisbledLoader(false);
    }
  };

  const disableMfa = async () => {
    setDisbledLoader(true);
    try {
      await api.post(`/auth/disable-mfa`);
      setIs2faEnabled(false);
      setQrCodeUrl("");
      setStep(1);
    } catch {
      toast.error("Error disabling MFA");
    } finally {
      setDisbledLoader(false);
    }
  };

  const verifyMfa = async () => {
    if (!code.trim()) return toast.error("Please enter the MFA code");
    settwofaCodeLoader(true);
    try {
      const formData = new URLSearchParams();
      formData.append("code", code);
      await api.post(`/auth/verify-mfa`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      toast.success("MFA verified successfully");
      setIs2faEnabled(true);
      setStep(1);
      setCode("");
    } catch {
      toast.error("Invalid MFA code");
    } finally {
      settwofaCodeLoader(false);
    }
  };

  const handleUpdateCredential = async (data) => {
    const newUsername = data.username;
    const newPassword = data.password || "";

    try {
      setLoading(true);
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("newUsername", newUsername);
      formData.append("newPassword", newPassword);

      await api.post("/auth/update-password", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      toast.success("Credentials updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      setValue("username", currentUser.username || "");
      setValue("email", currentUser.email || "");
    }
  }, [currentUser, setValue]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const lastLoginSession = moment
        .unix(decodedToken.iat)
        .format("dddd, D MMMM YYYY, h:mm A");
      setLoginSession(lastLoginSession);
    }
  }, [token]);

  if (pageError) return <Errors message={pageError} />;

  const onOpenAccountHandler = () => {
    setOpenAccount((v) => !v);
  };

  return (
    <div className="min-h-[calc(100vh-74px)] bg-white py-12 font-[Montserrat]">
      {pageLoader ? (
        <div className="flex flex-col justify-center items-center h-72">
          <Blocks height="70" width="70" color="#7c3aed" visible />
          <span className="mt-3 text-slate-700 text-lg font-medium">
            Please wait...
          </span>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-6 py-8 bg-white rounded-2xl border border-purple-100 space-y-8">
          {/* User Info */}
          <div className="flex flex-col items-center gap-3">
            <Avatar
              alt={currentUser?.username}
              src="/static/images/avatar/1.jpg"
              sx={{ width: 96, height: 96 }}
            />
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-wide">
              {currentUser?.username}
            </h2>
            <p className="text-slate-600 text-sm tracking-wide">
              Role:{" "}
              <span className="font-semibold text-slate-800">
                {currentUser?.roles?.[0] || "User"}
              </span>
            </p>
          </div>

          {/* Update Credentials */}
          <Accordion
            expanded={openAccount}
            className="rounded-xl border border-purple-100 shadow-none"
          >
            <AccordionSummary
              onClick={onOpenAccountHandler}
              expandIcon={<ArrowDropDownIcon className="text-slate-600" />}
              aria-controls="update-credentials-content"
              id="update-credentials-header"
              className="bg-white px-5 py-4 rounded-xl cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                Update User Credentials
              </h3>
            </AccordionSummary>
            <AccordionDetails className="bg-white px-6 py-5 rounded-b-xl border-t border-purple-100">
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(handleUpdateCredential)}
              >
                <InputField
                  label="Username"
                  required
                  id="username"
                  type="text"
                  message="*Username is required"
                  placeholder="Enter your username"
                  register={register}
                  errors={errors}
                  readOnly
                />
                <InputField
                  label="Email"
                  required
                  id="email"
                  type="email"
                  message="*Email is required"
                  placeholder="Enter your email"
                  register={register}
                  errors={errors}
                  readOnly
                />
                <InputField
                  label="New Password"
                  id="password"
                  type="password"
                  message="Password is required"
                  placeholder="Enter new password"
                  register={register}
                  errors={errors}
                  min={8}
                  pattern={/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/}
                  patternMessage="Password must be at least 8 characters and include letters, numbers and a special character"
                />
                <Buttons
                  disabled={loading}
                  className="rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 transition"
                  type="submit"
                >
                  {loading ? "Updating..." : "Update Credentials"}
                </Buttons>
              </form>
            </AccordionDetails>
          </Accordion>

      
          <div className="bg-[#f9f5ff] border border-purple-200 rounded-xl p-5 text-center">
            <p className="text-purple-700 font-semibold mb-1">
              Your last login session was on:
            </p>
            <p className="text-purple-900 font-semibold text-lg">
              {loginSession || "—"}
            </p>
          </div>

          <div className="bg-white border border-purple-100 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                Multi-Factor Authentication
                <span
                  className={`${
                    is2faEnabled ? "bg-green-600" : "bg-red-600"
                  } text-white text-xs px-3 py-1 rounded-full font-semibold`}
                >
                  {is2faEnabled ? "Activated" : "Deactivated"}
                </span>
              </h3>
            </div>

            <p className="text-slate-700">
              Add an additional layer of security by enabling two-factor
              authentication.
            </p>

            <Buttons
              disabled={disabledLoader}
              onClickhandler={is2faEnabled ? disableMfa : enableMfa}
              className={`rounded-full px-6 py-2 text-white font-semibold transition ${
                is2faEnabled
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {disabledLoader
                ? "Processing..."
                : is2faEnabled
                ? "Disable Two-Factor Authentication"
                : "Enable Two-Factor Authentication"}
            </Buttons>

            {step === 2 && (
              <Accordion className="border border-purple-100 rounded-xl shadow-none">
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon className="text-slate-600" />}
                  aria-controls="qr-code-content"
                  id="qr-code-header"
                  className="bg-white px-4 py-3 rounded-xl cursor-pointer"
                >
                  <h4 className="font-semibold text-slate-900">
                    QR Code to Scan
                  </h4>
                </AccordionSummary>
                <AccordionDetails className="flex flex-col items-center gap-4 py-4">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-48 h-48 object-contain"
                  />
                  <div className="flex gap-3 w-full max-w-sm">
                    <input
                      type="text"
                      placeholder="Enter MFA code"
                      value={code}
                      required
                      className="flex-grow border border-purple-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      onChange={(e) => setCode(e.target.value)}
                    />
                    <button
                      className="rounded-full bg-purple-600 hover:bg-purple-700 text-white px-5 font-semibold transition"
                      onClick={verifyMfa}
                      disabled={twofaCodeLoader}
                      type="button"
                    >
                      {twofaCodeLoader ? "Verifying..." : "Verify"}
                    </button>
                  </div>
                </AccordionDetails>
              </Accordion>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
