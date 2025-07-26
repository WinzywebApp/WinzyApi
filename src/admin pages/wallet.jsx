import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Loader2,
  Wallet,
  User2,
  Clock,
  BadgeCheck,
  CheckCircle,
  FileClock,
  BadgeDollarSign,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function WalletRequestsPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/wallet/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const all = res.data || [];
      setPendingRequests(all.filter((r) => r.status === "requested"));
      setAcceptedRequests(all.filter((r) => r.status === "accepted"));
    } catch {
      toast.error("⚠️ Failed to load requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const acceptRequest = async (requestId) => {
    setProcessingId(requestId);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE}/api/wallet/accept/${requestId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("✅ Request accepted");
      fetchRequests();
    } catch {
      toast.error("❌ Failed to accept");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleString();

  const RequestCard = ({ req, isPending }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-md hover:shadow-lg transition-all duration-200 space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <User2 className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{req.username}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>{formatDate(req.created_at)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-base font-semibold text-gray-700">
        <div className="flex items-center gap-2 text-blue-600">
          <Wallet className="w-5 h-5" />
          LKR {req.amount}
        </div>
        <div className="flex items-center gap-2">
          <BadgeCheck className="w-5 h-5 text-gray-400" />
          <span
            className={`capitalize font-bold ${
              isPending ? "text-yellow-500" : "text-green-600"
            }`}
          >
            {req.status}
          </span>
        </div>
      </div>

      {isPending && (
        <button
          onClick={() => acceptRequest(req.request_id)}
          disabled={processingId === req.request_id}
          className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
        >
          {processingId === req.request_id ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Accepting...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" /> Accept Request
            </>
          )}
        </button>
      )}
    </div>
  );

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <Toaster />
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-center text-3xl font-bold text-blue-700">
          💰 Wallet Top-up Requests
        </h1>

        {/* Tabs */}
        <div className="flex rounded-full bg-gray-200 overflow-hidden">
          <button
            className={`w-1/2 py-2 text-sm font-semibold transition ${
              activeTab === "pending"
                ? "bg-blue-600 text-white"
                : "text-gray-800"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            <FileClock className="inline w-4 h-4 mr-1" />
            Pending ({pendingRequests.length})
          </button>
          <button
            className={`w-1/2 py-2 text-sm font-semibold transition ${
              activeTab === "accepted"
                ? "bg-green-600 text-white"
                : "text-gray-800"
            }`}
            onClick={() => setActiveTab("accepted")}
          >
            <BadgeDollarSign className="inline w-4 h-4 mr-1" />
            Accepted ({acceptedRequests.length})
          </button>
        </div>

        {/* Request Cards */}
        <div className="space-y-4">
          {activeTab === "pending" &&
            (pendingRequests.length > 0 ? (
              pendingRequests.map((r) => (
                <RequestCard key={r.request_id} req={r} isPending />
              ))
            ) : (
              <p className="text-center text-gray-500 mt-6">
                No pending requests found
              </p>
            ))}

          {activeTab === "accepted" &&
            (acceptedRequests.length > 0 ? (
              acceptedRequests.map((r) => (
                <RequestCard key={r.request_id} req={r} isPending={false} />
              ))
            ) : (
              <p className="text-center text-gray-500 mt-6">
                No accepted requests found
              </p>
            ))}
        </div>
      </div>
    </div>
  );
}
