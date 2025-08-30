import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-[calc(100vh-74px)] bg-white flex justify-center items-center font-[Montserrat]"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="w-full max-w-[480px] bg-white rounded-xl border border-purple-100 py-10 px-6 sm:px-8 shadow-md text-center">
        <div className="flex justify-center mb-4">
          <FaExclamationTriangle className="text-yellow-500 text-6xl" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Access Denied
        </h1>
        <p className="text-slate-600 mb-6">
          You do not have permission to view this page.
        </p>

        <button
          onClick={goHome}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold w-full py-2 rounded-full transition-colors duration-150"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
