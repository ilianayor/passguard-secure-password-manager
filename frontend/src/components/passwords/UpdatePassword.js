import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import Buttons from "../../utils/Buttons";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const UpdatePassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    url: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!id) {
      toast.error("Invalid password ID");
      navigate("/passwords");
      return;
    }

    (async () => {
      try {
        const res = await api.get(`/passwords/${id}`);
        setForm({
          title: res.data.title || "",
          url: res.data.url || "",
          username: res.data.username || "",
          password: "", 
        });
      } catch (error) {
        toast.error("Failed to fetch password details");
        console.error(error);
      }
    })();
  }, [id, navigate]);

  const generateStrongPassword = (length = 16) => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword();
    setForm((prev) => ({ ...prev, password: newPassword }));
    toast.success("Strong password generated!");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { title, username, password } = form;

    if (!title || !username || !password) {
      return toast.error("All fields except URL are required");
    }

    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters long");
    }

    try {
      setLoading(true);
      await api.put(`/passwords/${id}`, form);
      toast.success("Password updated successfully");
      navigate("/passwords");
    } catch (err) {
      toast.error("Failed to update password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] flex items-center justify-center bg-gray-100">
      <div
        className="bg-white shadow-lg rounded-lg p-10 w-full max-w-lg border border-purple-300"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <div className="flex items-center gap-2 pb-5">
          <h1 className="text-purple-600 text-2xl sm:text-3xl font-semibold">
            Update Password
          </h1>
        </div>

        <div className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 border rounded border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
          />

          <input
            type="text"
            name="url"
            placeholder="URL (optional)"
            value={form.url}
            onChange={handleChange}
            className="w-full p-3 border rounded border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 border rounded border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
          />

          <div className="flex gap-2 items-center">
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="New Password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 border rounded border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-500"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <MdVisibilityOff size={22} />
                ) : (
                  <MdVisibility size={22} />
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={handleGeneratePassword}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
            >
              Generate
            </button>
          </div>
        </div>

        <div className="mt-6">
          <Buttons
            disabled={loading}
            onClickhandler={handleSubmit}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 w-full font-medium"
          >
            {loading ? <span>Updating...</span> : "Update Password"}
          </Buttons>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
