import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import InputField from "../input/InputField";
import { Blocks } from "react-loader-spinner";
import Buttons from "../../utils/Buttons";
import toast from "react-hot-toast";
import Errors from "../Errors";

const UserDetails = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const [loading, setLoading] = useState(false);
  const [updateRoleLoader, setUpdateRoleLoader] = useState(false);
  const [passwordLoader, setPasswordLoader] = useState(false);

  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState(null);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/user/${userId}`);
      setUser(response.data);
      setSelectedRole(response.data.role?.roleName || "");
    } catch (err) {
      setError(err?.response?.data?.message);
      console.error("Error fetching user details", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setValue("username", user.username);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await api.get("/admin/roles");
      setRoles(response.data);
    } catch (err) {
      setError(err?.response?.data?.message);
      console.error("Error fetching roles", err);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
    fetchRoles();
  }, [fetchUserDetails, fetchRoles]);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleUpdateRole = async () => {
    setUpdateRoleLoader(true);
    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);
      formData.append("roleName", selectedRole);

      await api.put(`/admin/update-role`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      fetchUserDetails();
      toast.success("Update role successful");
    } catch (err) {
      console.log(err);
      toast.error("Update Role Failed");
    } finally {
      setUpdateRoleLoader(false);
    }
  };

  const handleSavePassword = async (data) => {
    setPasswordLoader(true);
    const newPassword = data.password;

    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);
      formData.append("password", newPassword);

      await api.put(`/admin/update-password`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      setIsEditingPassword(false);
      setValue("password", "");
      toast.success("password update success");
    } catch (err) {
      toast.error("Error updating password " + err.response.data);
    } finally {
      setPasswordLoader(false);
    }
  };

  const handleCheckboxChange = async (e, updateUrl) => {
    const { name, checked } = e.target;

    let message = null;
    if  (name === "enabled") {
      message = "Successful update of account enabled status";
    } 

    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);
      formData.append(name, checked);

      await api.put(updateUrl, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      fetchUserDetails();
      toast.success(message);
    } catch (err) {
      toast.error(err?.response?.data?.message);
      console.log(`Error updating ${name}:`);
    } finally {
      message = null;
    }
  };

  if (error) return <Errors message={error} />;

  return (
    <div
      className="min-h-[calc(100vh-74px)] bg-white py-10 font-[Montserrat]"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {loading ? (
        <div className="flex flex-col justify-center items-center h-72">
          <Blocks height="70" width="70" color="#7c3aed" visible />
          <span className="mt-3 text-slate-700">Please wait...</span>
        </div>
      ) : (
        <>
          <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-purple-100 p-8">
            <div className="mb-6">
              <h1 className="text-slate-900 text-2xl sm:text-3xl font-semibold">
                Profile Information
              </h1>
              <div className="mt-3 h-px w-full bg-purple-100" />
            </div>

            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(handleSavePassword)}
            >
              <InputField
                label="Username"
                required
                id="username"
                className="w-full"
                type="text"
                message="Username is required"
                placeholder="Username"
                register={register}
                errors={errors}
                readOnly
              />
              <InputField
                label="Email address"
                required
                id="email"
                className="w-full"
                type="text"
                message="Email is required"
                placeholder="Email address"
                register={register}
                errors={errors}
                readOnly
              />
              <InputField
                label="Password"
                required
                autoFocus={isEditingPassword}
                id="password"
                className="w-full"
                type="password"
                message="Password is required"
                placeholder="Password"
                register={register}
                errors={errors}
                readOnly={!isEditingPassword}
                min={8}
              />

              {!isEditingPassword ? (
                <Buttons
                  type="button"
                  onClickhandler={() => setIsEditingPassword(true)}
                  className="rounded-full bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 font-semibold w-fit"
                >
                 Edit password
                </Buttons>
              ) : (
                <div className="flex items-center gap-3">
                  <Buttons
                    type="submit"
                    className="rounded-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 font-semibold"
                  >
                    {passwordLoader ? "Loading.." : "Save"}
                  </Buttons>
                  <Buttons
                    type="button"
                    onClickhandler={() => setIsEditingPassword(false)}
                    className="rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-6 py-2 font-semibold"
                    >
                    Cancel
                  </Buttons>
                </div>
              )}
            </form>
          </div>

          <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-purple-100 p-8 mt-8">
            <h2 className="text-slate-900 text-2xl sm:text-3xl font-semibold">
              Admin Actions
            </h2>
            <div className="mt-3 h-px w-full bg-purple-100" />

            <div className="py-5 flex sm:flex-row flex-col sm:items-center items-start gap-4">
              <div className="flex items-center gap-3">
                <label className="text-slate-800 font-medium">Role:</label>
                <select
                  className="px-4 py-2 rounded-full border border-purple-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300 uppercase"
                  value={selectedRole}
                  onChange={handleRoleChange}
                >
                  {roles.map((role) => (
                    <option
                      key={role.roleId}
                      value={role.roleName}
                      className="uppercase"
                    >
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="rounded-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 font-semibold"
                onClick={handleUpdateRole}
              >
                {updateRoleLoader ? "Loading..." : "Update Role"}
              </button>
            </div>

            <div className="mt-2 h-px w-full bg-purple-100" />

            <div className="flex flex-col gap-4 py-5">

              <label className="flex items-center gap-3">
                <span className="text-slate-800 text-sm font-semibold uppercase">
                  Account Enabled
                </span>
                <input
                  className="w-5 h-5 accent-purple-600"
                  type="checkbox"
                  name="enabled"
                  checked={user?.enabled}
                  onChange={(e) =>
                    handleCheckboxChange(e, "/admin/update-enabled-status")
                  }
                />
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDetails;
