import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import {
  FaClock,
  FaCheck,
  FaMoneyBill,
  FaArrowLeft,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import LoadingScreen from "../components/loading.jsx";
import { useNavigate } from "react-router-dom";
import { fadeDirection } from "../../vatiation.js"; 

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const formatDateTime = (iso) => {
  try {
    return new Date(iso).toLocaleString(undefined, { hour12: false });
  } catch {
    return iso;
  }
};

// Status badge component
const StatusBadge = ({ status }) => {
  const accepted = status === "accepted";
  return (
    <div
      className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
        accepted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
      }`}
      aria-label={accepted ? "Accepted" : "Pending"}
    >
      {accepted ? <FaCheck /> : <FaClock />} {accepted ? "Accepted" : "Pending"}
    </div>
  );
};

// Reusable styled request card
const RequestCard = memo(function RequestCard({
  r,
  idx,
  cancelling,
  cancelRequest,
}) {
  return (
    <motion.div
      key={r.request_id}
      custom={idx}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      variants={fadeDirection(idx % 2 === 0 ? "left" : "right", idx * 0.1)}
      className="relative bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl shadow-xl border border-transparent p-[1px] overflow-hidden"
    >
      <div className="relative bg-blue-500 rounded-xl p-5 space-y-4 overflow-hidden flex flex-col">
        <div className="absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-br from-white/10 via-transparent to-white/0 mix-blend-overlay" />

        <div className="absolute top-3 right-3 flex items-center">
          <StatusBadge status={r.status} />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="bg-white p-3 rounded-full shadow-md flex-shrink-0">
              <FaMoneyBill className="text-green-500 w-5 h-5" aria-hidden="true" />
            </div>
            <div className="truncate">
              <div className="text-white font-bold text-lg flex flex-wrap gap-2">
                <span>
                  LKR <span className="prose-sm">{r.amount?.toLocaleString()}</span>
                </span>
                <span className="text-sm opacity-80 truncate">({r.username || ""})</span>
              </div>
              <div className="text-white text-sm flex items-center gap-1 mt-1">
                <FaClock aria-hidden="true" />
                <span className="truncate">{formatDateTime(r.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {r.status !== "accepted" && (
              <button
                disabled={!!cancelling[r.request_id]}
                onClick={() => cancelRequest(r.request_id)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-xs font-medium disabled:opacity-50 transition"
                aria-label="Cancel request"
              >
                {cancelling[r.request_id] ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : (
                  <FaTimes className="w-3 h-3" aria-hidden="true" />
                )}
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="text-xs text-blue-100 flex flex-wrap gap-3 mt-1">
          <div className="flex items-center gap-1">
            <span className="font-medium">Request ID:</span>{" "}
            <span className="truncate">{r.request_id}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Detail URL:</span>{" "}
            <code className="bg-blue-600 px-2 py-1 rounded text-white text-xs break-all">
              {`${window.location.origin}/wallet-history/${r.request_id}`}
            </code>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function UserWalletHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserRequests();
  }, []);

  const fetchUserRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE}/api/wallet/reqwest/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistory(res.data);
    } catch (err) {
      toast.error("Failed to load wallet history.");
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (request_id) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;
    try {
      setCancelling((c) => ({ ...c, [request_id]: true }));
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/wallet/delete/${request_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Request cancelled.");
      await fetchUserRequests();
    } catch (err) {
      toast.error("Failed to cancel request.");
    } finally {
      setCancelling((c) => ({ ...c, [request_id]: false }));
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="w-full bg-white px-4 py-3 shadow sticky top-0 z-50 flex items-center justify-center relative rounded-b-2xl">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 p-2 rounded-full text-white absolute left-4"
          aria-label="Go back"
        >
          <FaArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-semibold text-blue-700 text-center">
          🧾 Wallet History
        </h1>
      </header>

      <div className="space-y-4 px-4 pt-4">
        {history.length === 0 && (
          <div className="text-center text-gray-600">No wallet activity yet.</div>
        )}

        {history.map((r, idx) => (
          <RequestCard
            key={r.request_id}
            r={r}
            idx={idx}
            cancelling={cancelling}
            cancelRequest={cancelRequest}
          />
        ))}
      </div>
    </div>
  );
}
