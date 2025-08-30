import React from "react";
import { FaArrowLeft, FaArrowRight, FaUser } from "react-icons/fa";
import { IoListOutline } from "react-icons/io5";
import Tooltip from "@mui/material/Tooltip";
import { Link, useLocation } from "react-router-dom";
import { useMyContext } from "../../context/ContextApi";

const Sidebar = () => {
  const { openSidebar, setOpenSidebar } = useMyContext();
  const pathName = useLocation().pathname;

  const isUsers = pathName.startsWith("/admin/users");
  const isAudit = pathName.startsWith("/admin/audit-logs");

  return (
    <div
      className={`fixed top-[74px] left-0 p-2 min-h-[calc(100vh-74px)] max-h-[calc(100vh-74px)]
      ${openSidebar ? "w-52" : "w-12"} transition-all duration-150
      bg-[#0D0D0D] font-[Montserrat] z-50 shadow-[4px_0_12px_-6px_rgba(0,0,0,0.35)]`}
      aria-expanded={openSidebar}
    >
      <div className="min-h-10 max-h-10 flex">
        {openSidebar ? (
          <button
            className="ml-auto inline-flex items-center gap-1 text-white hover:text-purple-200"
            onClick={() => setOpenSidebar(false)}
            aria-label="Collapse sidebar"
          >
            <FaArrowLeft className="text-sm" />
            <span className="font-semibold">Close</span>
          </button>
        ) : (
          <Tooltip title="Click To Expand" placement="right">
            <button
              className="mx-auto inline-flex items-center justify-center text-white hover:text-purple-200"
              onClick={() => setOpenSidebar(true)}
              aria-label="Expand sidebar"
            >
              <FaArrowRight className="text-lg" />
            </button>
          </Tooltip>
        )}
      </div>

      <div className="flex flex-col gap-5 mt-4">
        <Tooltip title={!openSidebar ? "Users" : ""} placement="right">
          <Link
            to="/admin/users"
            className={`flex items-center min-h-10 max-h-10 py-2 px-2 rounded-md text-white
              ${isUsers ? "bg-purple-600" : "bg-transparent hover:bg-purple-500/40"}`}
          >
            <FaUser className="shrink-0" />

            <span
              className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-150 font-semibold
                ${openSidebar ? "opacity-100 w-auto" : "opacity-0 w-0"}`}
            >
              Users
            </span>
          </Link>
        </Tooltip>

        <Tooltip title={!openSidebar ? "Audit Logs" : ""} placement="right">
          <Link
            to="/admin/audit-logs"
            className={`flex items-center min-h-10 max-h-10 py-2 px-2 rounded-md text-white
              ${isAudit ? "bg-purple-600" : "bg-transparent hover:bg-purple-500/40"}`}
          >
            <IoListOutline className="text-xl shrink-0" />

            <span
              className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-150 font-semibold
                ${openSidebar ? "opacity-100 w-auto" : "opacity-0 w-0"}`}
            >
              Audit Logs
            </span>
          </Link>
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;
