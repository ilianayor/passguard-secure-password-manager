import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import UserList from "./AllUsers";
import UserDetails from "./UserDetails";
import { useMyContext } from "../../context/ContextApi";
import AuditLogsDetails from "./AuditLogsDetails";
import AdminAuditLogs from "./AuditLogs";

const Admin = () => {
  const { openSidebar } = useMyContext();

  const leftPad = openSidebar ? "pl-52" : "pl-12";

  return (
    <div
      className={`min-h-[calc(100vh-74px)] flex bg-white ${leftPad} transition-all duration-200`}
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-h-[calc(100vh-74px)]">
        <header className="px-6 sm:px-10 pt-6 pb-4 border-b border-purple-100 bg-white">
          <h1 className="text-black text-2xl sm:text-3xl font-semibold">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 mt-1 text-sm">
            Manage users, monitor activity, and review audit logs.
          </p>
        </header>

        <main className="flex-1 p-6 sm:p-10 bg-white">
          <Routes>
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="audit-logs/:passwordId" element={<AuditLogsDetails />} />
            <Route path="users" element={<UserList />} />
            <Route path="users/:userId" element={<UserDetails />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Admin;
