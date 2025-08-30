import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import PasswordItems from "./PasswordItems";
import { IoAdd } from "react-icons/io5";
import { Blocks } from "react-loader-spinner";
import Errors from "../Errors";
import toast from "react-hot-toast"; 

const AllPasswords = () => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [deletingIds, setDeletingIds] = useState(new Set());

  const fetchPasswords = async () => {
    setLoading(true);
    try {
      const response = await api.get("/passwords");
      const parsedPasswords = response.data.map((password) => ({
        ...password,
        title: password.title,
        url: password.url || "",
        username: password.username,
      }));
      setPasswords(parsedPasswords);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching passwords");
      console.error("Error fetching passwords", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(id));
      await api.delete(`/passwords/${id}`);
      setPasswords((prev) => prev.filter((p) => p.id !== id));
      toast.success("Password deleted");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error(err?.response?.data?.message || "Failed to delete password");
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (error) {
    return <Errors message={error} />;
  }

  return (
    <div
      className="min-h-[calc(100vh-74px)] sm:py-10 sm:px-5 px-0 py-4 bg-white"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="w-[92%] mx-auto">
        {!loading && passwords && passwords.length > 0 && (
          <h1 className="text-slate-900 sm:text-4xl text-2xl font-semibold tracking-tight">
            My passwords
          </h1>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center h-72">
            <Blocks height="70" width="70" color="#6C63FF" ariaLabel="blocks-loading" visible />
            <span className="mt-3 text-slate-700">Please wait...</span>
          </div>
        ) : (
          <>
            {passwords && passwords.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-96 p-4">
                <div className="text-center max-w-md">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    No passwords saved yet
                  </h2>
                  <p className="text-slate-600 mb-6">
                    Start by adding your first password.
                  </p>
                  <div className="w-full flex justify-center">
                    <Link to="/create-password">
                      <button className="flex items-center px-5 py-2 bg-purple-700 text-white rounded-full hover:bg-purple-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400">
                        <IoAdd className="mr-2" size={20} />
                        Add Password
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-10 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-y-10 gap-x-5">
                {passwords.map((item) => (
                  <PasswordItems
                    key={item.id}
                    {...item}
                    id={item.id}
                    onDelete={() => handleDelete(item.id, item.title)}
                    deleting={deletingIds.has(item.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllPasswords;
