import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import { FaClock, FaCheck, FaArrowLeft, FaTimes } from "react-icons/fa";
import { FiUser, FiClock as FiClock2, FiCreditCard } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import LoadingScreen from "../components/loading.jsx";
import { useNavigate } from "react-router-dom";
import { fadeDirection } from "../../vatiation.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Format date helper
const formatDateTime = (iso) => {
  try {
    return new Date(iso).toLocaleString(undefined, { hour12: false });
  } catch {
    return iso;
  }
};

// Status badge
const StatusBadge = ({ status }) => {
  const accepted = status === "accepted";
  return (
    <div
      className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
        accepted
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {accepted ? <FaCheck /> : <FaClock />}{" "}
      {accepted ? "Accepted" : "Pending"}
    </div>
  );
};

// Request card
// Request card
const RequestCard = memo(function RequestCard({
  r,
  idx,
  cancelling,
  cancelRequest,
}) {
  // match backend value
  const isPending = r.status === "requested";

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
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-md hover:shadow-lg transition-all duration-200">
        
        {/* Top user info */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <FiUser className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{r.username || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock2 className="w-4 h-4 text-gray-500" />
            <span>{formatDateTime(r.created_at)}</span>
          </div>
        </div>

        {/* Amount & Status */}
        <div className="flex items-center justify-between text-base font-semibold text-gray-700 mb-2">
          <div className="flex items-center gap-2 text-blue-600">
            <FiCreditCard className="w-5 h-5" />
            LKR {r.amount}
          </div>
          <StatusBadge status={r.status} />
        </div>

        {/* Cancel button immediately below status */}
        {isPending && (
          <button
            disabled={cancelling[r.request_id]}
            onClick={() => cancelRequest(r.request_id)}
            className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {cancelling[r.request_id] ? "Cancelling..." : (
              <>
                <FaTimes /> Cancel Request
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
});

// Main page
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
      const res = await axios.get(`${API_BASE}/api/wallet/reqwest/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch {
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
      toast.error(err?.response?.data?.message || "Failed to cancel request.");
    } finally {
      setCancelling((c) => ({ ...c, [request_id]: false }));
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="w-full bg-white px-4 py-3 shadow sticky top-0 z-50 flex items-center justify-center relative rounded-b-2xl">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 p-2 rounded-full text-white absolute left-4"
        >
          <FaArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-semibold text-blue-700 text-center">
          🧾 Wallet History
        </h1>
      </header>

      {/* History list */}
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
