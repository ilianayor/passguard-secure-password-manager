import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "react-quill/dist/quill.snow.css";
import { Blocks } from "react-loader-spinner";
import ReactQuill from "react-quill";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import Buttons from "../../utils/Buttons";
import Errors from "../Errors";
import toast from "react-hot-toast";
import Modals from "../PopModal";
import { auditLogscolumn } from "../../utils/Table";

const PasswordDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [url, setUrl] = useState(""); // Added URL state
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editLoader, setEditLoader] = useState(false);
  const [editEnable, setEditEnable] = useState(false);

  const fetchPasswordDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/passwords");
      const foundPassword = response.data.find((p) => p.id.toString() === id);
      if (foundPassword) {
        foundPassword.parsedContent = JSON.parse(foundPassword.content).content;
        setPassword(foundPassword);
        setEditorContent(foundPassword.parsedContent || "");
        setUrl(foundPassword.url || ""); // Set URL state
      } else {
        setError("Invalid Password");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Error fetching password details");
      console.error("Error fetching password details", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkAdminRole = useCallback(async () => {
    try {
      const response = await api.get("/auth/user");
      const roles = response.data.roles;
      setIsAdmin(roles.includes("ROLE_ADMIN"));
    } catch (err) {
      console.error("Error checking admin role", err);
      setError("Error checking admin role");
    }
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const response = await api.get(`/audit/password/${id}`);
      setAuditLogs(response.data);
    } catch (err) {
      console.error("Error fetching audit logs", err);
      setError("Error fetching audit logs");
    }
  }, [id]);

  // Fetch password details and admin role on mount or id change
  useEffect(() => {
    if (id) {
      fetchPasswordDetails();
      checkAdminRole();
    }
  }, [id, fetchPasswordDetails, checkAdminRole]);

  // Fetch audit logs only if admin
  useEffect(() => {
    if (isAdmin) {
      fetchAuditLogs();
    } else {
      setAuditLogs([]); // Clear logs if no longer admin
    }
  }, [isAdmin, fetchAuditLogs]);

  if (error) {
    return <Errors message={error} />;
  }

  const rows = auditLogs.map((item) => ({
    id: item.id,
    passwordId: item.passwordId,
    actions: item.action,
    username: item.username,
    timestamp: moment(item.timestamp).format("MMMM DD, YYYY, hh:mm A"),
    passwordIdDuplicate: item.passwordId,
    password: item.passwordContent,
  }));

  const handleChange = (content) => {
    setEditorContent(content);
  };

  const onEditHandler = async () => {
    if (!editorContent.trim()) {
      return toast.error("Password content shouldn't be empty");
    }
    // Optional: You may validate URL format here

    try {
      setEditLoader(true);
      await api.put(`/passwords/${id}`, {
        content: editorContent,
        url, // include url in update payload
      });
      toast.success("Password updated successfully");
      setEditEnable(false);
      fetchPasswordDetails();
      if (isAdmin) {
        fetchAuditLogs();
      }
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setEditLoader(false);
    }
  };

  const onBackHandler = () => navigate(-1);

  return (
    <div className="min-h-[calc(100vh-74px)] md:px-10 md:py-8 sm:px-6 py-4 px-4">
      <Buttons
        onClickhandler={onBackHandler}
        className="bg-btnColor px-4 py-2 rounded-md text-white hover:text-slate-200 mb-3"
      >
        Go Back
      </Buttons>

      <div className="py-6 px-8 min-h-customHeight shadow-lg shadow-gray-300 rounded-md">
        {!loading && (
          <div className="flex justify-end py-2 gap-2">
            {!editEnable ? (
              <Buttons
                onClickhandler={() => setEditEnable(true)}
                className="bg-btnColor text-white px-3 py-1 rounded-md"
              >
                Edit
              </Buttons>
            ) : (
              <Buttons
                onClickhandler={() => setEditEnable(false)}
                className="bg-customRed text-white px-3 py-1 rounded-md"
              >
                Cancel
              </Buttons>
            )}

            {!editEnable && (
              <Buttons
                onClickhandler={() => setModalOpen(true)}
                className="bg-customRed text-white px-3 py-1 rounded-md"
              >
                Delete
              </Buttons>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center h-96">
            <Blocks
              height="70"
              width="70"
              color="#4fa94d"
              ariaLabel="blocks-loading"
              visible={true}
            />
            <span>Please wait...</span>
          </div>
        ) : editEnable ? (
          <div>
            <label className="block mb-1 font-semibold text-slate-700">URL (optional):</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="h-72 sm:mb-20 lg:mb-14 mb-28">
              <ReactQuill
                className="h-full"
                value={editorContent}
                onChange={handleChange}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, 4, 5, 6] }],
                    [{ size: [] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                    ["clean"],
                  ],
                }}
              />
            </div>
            <Buttons
              disabled={editLoader}
              onClickhandler={onEditHandler}
              className="bg-customRed md:mt-16 mt-28 text-white px-4 py-2 hover:text-slate-300 rounded-sm"
            >
              {editLoader ? "Loading..." : "Update Password"}
            </Buttons>
          </div>
        ) : (
          <>
            {url && (
              <p className="mb-4">
                <strong>URL: </strong>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {url}
                </a>
              </p>
            )}

            <p
              className="text-slate-900 ql-editor"
              dangerouslySetInnerHTML={{ __html: password?.parsedContent }}
            />

            {isAdmin && (
              <div className="mt-10">
                <h1 className="text-2xl text-center text-slate-700 font-semibold uppercase pt-10 pb-4">
                  Audit Logs
                </h1>

                <div className="overflow-x-auto">
                  <DataGrid
                    className="w-fit mx-auto"
                    rows={rows}
                    columns={auditLogscolumn}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 6 } },
                    }}
                    pageSizeOptions={[6]}
                    disableRowSelectionOnClick
                    disableColumnResize
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Modals open={modalOpen} setOpen={setModalOpen} passwordId={id} />
    </div>
  );
};

export default PasswordDetails;
