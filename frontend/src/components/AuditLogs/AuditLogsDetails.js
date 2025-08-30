import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { DataGrid } from "@mui/x-data-grid";
import { Blocks } from "react-loader-spinner";
import Errors from "../Errors.js";
import moment from "moment";

import { auditLogscolumn } from "../../utils/Table.js";

const AuditLogsDetails = () => {
  const { passwordId } = useParams();
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSingleAuditLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/audit/password/${passwordId}`);
      setAuditLogs(data);
    } catch (err) {
      setError(err?.response?.data?.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [passwordId]);

  useEffect(() => {
    if (passwordId) {
      fetchSingleAuditLogs();
    }
  }, [passwordId, fetchSingleAuditLogs]);

  const rows = auditLogs.map((item) => {
    const formattedDate = moment(item.timestamp).format(
      "MMMM DD, YYYY, hh:mm A"
    );
    return {
      id: item.id,
      passwordId: item.passwordId,
      actions: item.action,
      username: item.username,
      timestamp: formattedDate,
      passwordid: item.passwordId,
    };
  });

  if (error) return <Errors message={error} />;

  return (
    <div
      className="min-h-[calc(100vh-74px)] w-full font-[Montserrat] bg-white px-4 py-10"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="mb-6">
        {auditLogs.length > 0 && (
          <h1 className="text-center sm:text-2xl text-lg font-bold text-slate-800">
            Audit log for entry with ID&nbsp;–&nbsp;{passwordId}
          </h1>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-72">
          <Blocks height="70" width="70" color="#7c3aed" visible />
          <span className="mt-2 text-slate-700">Please wait...</span>
        </div>
      ) : (
        <>
          {auditLogs.length === 0 ? (
            <Errors message="Invalid PasswordId" />
          ) : (
            <div className="flex justify-center">
              <div className="inline-block">
                <DataGrid
                  className="!w-auto"
                  rows={rows}
                  columns={auditLogscolumn}
                  autoHeight
                  columnBuffer={0}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 6 } },
                  }}
                  pageSizeOptions={[6, 12]}
                  disableRowSelectionOnClick
                  disableColumnResize
                  sx={{
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",

                    // Hide the empty filler cell/area on the far right
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
        </>
      )}
    </div>
  );
};

export default AuditLogsDetails;
