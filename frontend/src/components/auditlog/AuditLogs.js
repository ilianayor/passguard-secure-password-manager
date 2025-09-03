import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Blocks } from "react-loader-spinner";
import toast from "react-hot-toast";
import moment from "moment";
import { MdDateRange } from "react-icons/md";

import api from "../../services/api";
import Errors from "../Errors";

const viewBtnClass =
  "inline-flex items-center justify-center h-8 px-4 rounded-full text-sm font-medium " +
  "text-purple-700 bg-white border border-purple-200 hover:bg-purple-600 hover:text-white " +
  "transition focus:outline-none focus:ring-2 focus:ring-purple-300 font-[Montserrat]";

export const auditLogcolumns = [
  {
    field: "actions",
    headerName: "Action",
    width: 160,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    sortable: true,
    headerClassName: "text-black font-semibold font-[Montserrat]",
    cellClassName: "text-slate-700 font-normal font-[Montserrat]",
    renderHeader: () => <span>Action</span>,
  },
  {
    field: "username",
    headerName: "Username",
    width: 180,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    sortable: true,
    headerClassName: "text-black font-semibold font-[Montserrat]",
    cellClassName: "text-slate-700 font-normal font-[Montserrat]",
    renderHeader: () => <span>Username</span>,
  },
  {
    field: "timestamp",
    headerName: "Timestamp",
    width: 220,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    sortable: true,
    headerClassName: "text-black font-semibold font-[Montserrat]",
    cellClassName: "text-slate-700 font-normal font-[Montserrat]",
    renderHeader: () => <span>Timestamp</span>,
    renderCell: (params) => (
      <div className="flex items-center justify-center gap-1">
        <MdDateRange className="text-slate-700 text-lg" aria-hidden />
        <span>{params.row.timestamp}</span>
      </div>
    ),
  },
  {
    field: "passwordId",
    headerName: "Entry ID",
    width: 150,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    sortable: true,
    headerClassName: "text-black font-semibold font-[Montserrat]",
    cellClassName: "text-slate-700 font-normal font-[Montserrat]",
    renderHeader: () => <span>Entry ID</span>,
  },
  {
    field: "view",
    headerName: "View",
    width: 140,
    headerAlign: "center",
    align: "center",
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    headerClassName: "text-black font-semibold font-[Montserrat]",
    cellClassName: "font-[Montserrat]",
    renderHeader: () => <span>View</span>,
    renderCell: (params) => (
      <Link
        to={`/admin/audit-logs/${params.row.passwordId}`}
        className="h-full flex items-center justify-center"
      >
        <button className={viewBtnClass}>View Logs</button>
      </Link>
    ),
  },
];

const AdminAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/audit");
      setAuditLogs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Error fetching audit logs");
      toast.error("Error fetching audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const rows = auditLogs.map((item) => ({
    id: item.id,
    passwordId: item.passwordId,
    actions: item.action,
    username: item.username,
    timestamp: moment(item.timestamp).format("MMMM DD, YYYY, hh:mm A"),
  }));

  if (error) return <Errors message={error} />;

  return (
    <div
      className="min-h-[calc(100vh-74px)] w-full font-[Montserrat] bg-white px-4 py-10"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="mb-6">
        <h1 className="text-center text-2xl font-bold text-slate-800 uppercase">
          Audit Logs
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-72">
          <Blocks height="70" width="70" color="#7c3aed" visible />
          <span className="mt-2 text-slate-700">Please wait...</span>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="inline-block">
            <DataGrid
              className="!w-auto"
              rows={rows}
              columns={auditLogcolumns}
              autoHeight
              columnBuffer={0}
              initialState={{
                pagination: { paginationModel: { pageSize: 6 } },
                sorting: { sortModel: [{ field: "timestamp", sort: "desc" }] },
              }}
              pageSizeOptions={[6, 12]}
              disableRowSelectionOnClick
              disableColumnResize
              sx={{
                border: "none",
                outline: "none",
                backgroundColor: "transparent",

                ".MuiDataGrid-filler": { display: "none" },
                ".MuiDataGrid-scrollbarFiller": { display: "none" },

                ".MuiDataGrid-main": { border: "none" },
                ".MuiDataGrid-columnHeaders": {
                  backgroundColor: "#ffffff",
                  borderBottom: "1px solid #e5e7eb",
                },
                ".MuiDataGrid-cell": {
                  borderBottom: "1px solid #e5e7eb",
                },
                ".MuiDataGrid-row": { border: "none" },
                ".MuiDataGrid-virtualScroller": {
                  backgroundColor: "transparent",
                },
                ".MuiDataGrid-row:nth-of-type(odd)": {
                  backgroundColor: "#f9f5ff",
                },
                ".MuiDataGrid-row:hover": {
                  backgroundColor: "#f3e8ff",
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogs;
