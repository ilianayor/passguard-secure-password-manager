import React, { useState, useRef, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { FiCopy, FiTrash2 } from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";

const PasswordItems = ({ id, title, url, username, onDelete, deleting = false }) => {
  const [copying, setCopying] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (confirmOpen && cancelBtnRef.current) {
      cancelBtnRef.current.focus();
    }
  }, [confirmOpen]);

  const handleCopyPassword = async () => {
    try {
      setCopying(true);
      const response = await api.get(`/passwords/decrypt/${id}`);
      const decryptedPassword = response.data;
      await navigator.clipboard.writeText(decryptedPassword);
      toast.success("Password copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy password");
      console.error(err);
    } finally {
      setCopying(false);
    }
  };

  const localDelete = async () => {
    try {
      await api.delete(`/passwords/${id}`);
      toast.success("Password deleted");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete password");
    }
  };

  const confirmDelete = async () => {
    setConfirmOpen(false);
    if (onDelete) {
      await onDelete(); 
    } else {
      await localDelete();
    }
  };

  const formatUrl = (link) => {
    if (!link) return "";
    return link.startsWith("http://") || link.startsWith("https://")
      ? link
      : `https://${link}`;
  };

  return (
    <div className="shadow-md p-4 rounded-md border relative space-y-2 bg-white">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

      {typeof url === "string" && url.trim() !== "" && (
        <p className="text-blue-700 underline font-medium break-all hover:text-blue-900 transition-colors duration-200">
          <a href={formatUrl(url)} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </p>
      )}

      {typeof username === "string" && username.trim() !== "" && (
        <p className="text-gray-700 font-medium break-all">{username}</p>
      )}

      <p className="text-gray-600 mt-2">{'•'.repeat(8)}</p>

      <div className="mt-4 flex items-center gap-4">
        <button
          className="flex items-center text-blue-600 hover:underline text-sm"
          onClick={handleCopyPassword}
          disabled={copying}
        >
          <FiCopy className="mr-1" />
          {copying ? "Copying..." : "Copy Password"}
        </button>

        <Link to={`/edit-password/${id}`}>
          <button className="flex items-center text-green-600 hover:text-green-800 hover:underline text-sm">
            <MdEdit className="mr-1" />
            Edit
          </button>
        </Link>

        <button
          onClick={() => setConfirmOpen(true)}
          disabled={deleting}
          className={`flex items-center text-sm ${
            deleting
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-600 hover:text-red-800 hover:underline"
          }`}
          title="Delete"
          aria-label="Delete password"
        >
          <FiTrash2 className="mr-1" />
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          aria-labelledby="delete-title"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setConfirmOpen(false)}
          />

          <div className="relative bg-white w-full max-w-md rounded-lg shadow-xl border border-gray-200 mx-4">
            <div className="p-6">
              <h3 id="delete-title" className="text-lg font-semibold text-slate-900">
                Delete password
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {`Are you sure you want to delete${
                  title ? ` “${title}”` : " this password"
                }? This action cannot be undone.`}
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  ref={cancelBtnRef}
                  type="button"
                  className="px-4 py-2 rounded-md border border-gray-300 text-slate-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-md bg-purple-700 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordItems;