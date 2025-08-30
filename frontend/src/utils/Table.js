import { MdDateRange } from "react-icons/md";

export const auditLogscolumn = [
  {
    field: "actions",
    headerName: "Action",
    width: 160,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: () => <span className="ps-10">Action</span>,
  },

  {
    field: "username",
    headerName: "Username",
    width: 200,
    editable: false,
    headerAlign: "center",
    disableColumnMenu: true,
    align: "center",
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: () => <span className="ps-10">Username</span>,
  },

  {
    field: "timestamp",
    headerName: "Timestamp",
    width: 220,
    editable: false,
    headerAlign: "center",
    disableColumnMenu: true,
    align: "center",
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: () => <span className="ps-10">Timestamp</span>,
    renderCell: (params) => (
      <div className="flex items-center justify-center gap-1">
        <MdDateRange className="text-slate-700 text-lg" />
        <span>{params?.row?.timestamp}</span>
      </div>
    ),
  },

  {
    field: "passwordid",
    headerName: "ID",
    width: 150,
    editable: false,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: () => <span>ID</span>,
  },
];
