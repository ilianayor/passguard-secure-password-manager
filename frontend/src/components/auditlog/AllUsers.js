import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Blocks } from "react-loader-spinner";
import toast from "react-hot-toast";
import moment from "moment";
import { MdEmail, MdDateRange } from "react-icons/md";

import api from "../../services/api.js";
import Errors from "../Errors.js";

const viewBtnClass =
  "inline-flex items-center justify-center h-8 px-4 rounded-full text-sm font-medium " +
  "text-purple-700 bg-white border border-purple-200 hover:bg-purple-600 hover:text-white " +
  "transition focus:outline-none focus:ring-2 focus:ring-purple-300 font-[Montserrat]";

export const userListsColumns = [
  {
    field: "username",
    headerName: "Username",
    minWidth: 200,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    sortable: true,
    headerClassName: "text-black font-semibold font-[Montserrat]",
    cellClassName: "text-slate-700 font-normal font-[Montserrat]",
    renderHeader: () => <span>Username</span>,
  },
  {
    field: "email",
    headerName: "Email",
    width: 260,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    sortable: true,
    headerClassName: "text-black font-semibold font-[Montserrat]",
    cellClassName: "text-slate-700 font-normal font-[Montserrat]",
    renderHeader: () => <span>Email</span>,
    renderCell: (params) => (
      <div className="flex items-center justify-center gap-1">
        <MdEmail className="text-slate-700 text-lg" aria-hidden />
        <span>{params.row.email}</span>
      </div>
    ),
  },
  {
    field: "created",
    headerName: "Registered",
    width: 220,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    sortable: true,
    headerClassName: "text-black font-semibold font-[Montserrat]",
    cellClassName: "text-slate-700 font-normal font-[Montserrat]",
    renderHeader: () => <span>Registered</span>,
    renderCell: (params) => (
      <div className="flex items-center justify-center gap-1">
        <MdDateRange className="text-slate-700 text-lg" aria-hidden />
        <span>{params.row.created}</span>
      </div>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 180,
    headerAlign: "center",
    align: "center",
    disableColumnMenu: true,
    sortable: true,
    headerClassName: "text-black font-semibold font-[Montserrat]",
    cellClassName: "text-slate-700 font-normal font-[Montserrat]",
    renderHeader: () => <span>Status</span>,
  },
  {
    field: "action",
    headerName: "Action",
    width: 140,
    headerAlign: "center",
    align: "center",
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    headerClassName: "text-black font-semibold font-[Montserrat]",
    cellClassName: "font-[Montserrat]",
    renderHeader: () => <span>Action</span>,
    renderCell: (params) => (
      <Link
        to={`/admin/users/${params.id}`}
        className="h-full flex items-center justify-center"
      >
        <button className={viewBtnClass}>View profile</button>
      </Link>
    ),
  },
];

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get("/admin/getusers");
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err?.response?.data?.message || "Error fetching users");
        toast.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const rows = users.map((item) => ({
    id: item.userId,
    username: item.username,
    email: item.email,
    created: moment(item.createdDate).format("MMMM DD, YYYY, hh:mm A"),
    status: item.enabled ? "Active" : "Inactive",
  }));

  if (error) return <Errors message={error} />;

  return (
    <div className="min-h-[calc(100vh-74px)] w-full font-[Montserrat]">
      <div className="py-4">
        <h1 className="text-center text-2xl font-bold text-slate-800 uppercase">
          All Users
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-72">
          <Blocks height="70" width="70" color="#7c3aed" visible />
          <span className="mt-2 text-slate-700">Please wait...</span>
        </div>
      ) : (
        <div className="max-w-[1200px] mx-auto w-full">
          <DataGrid
            className="w-full"
            rows={rows}
            columns={userListsColumns}
            autoHeight
            initialState={{
              pagination: { paginationModel: { pageSize: 6 } },
              sorting: { sortModel: [{ field: "created", sort: "desc" }] },
            }}
            pageSizeOptions={[6, 12]}
            disableRowSelectionOnClick
            disableColumnResize
            sx={{
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              ".MuiDataGrid-main": { border: "none" },
              ".MuiDataGrid-columnHeaders": {
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #e5e7eb", 
              },
              ".MuiDataGrid-cell": {
                borderBottom: "1px solid #e5e7eb", 
              },
              ".MuiDataGrid-row": {
                border: "none",
              },
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
      )}
    </div>
  );
};

export default UserList;
