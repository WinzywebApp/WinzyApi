import React, { useState, useEffect, useCallback } from "react";
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
  Search,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: `${API_BASE}/api/wallet`,
  timeout: 10000,
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) {
    cfg.headers = {
      ...cfg.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return cfg;
});

api.interceptors.response.use(
  (res) => {
    if (res.data && Array.isArray(res.data.data)) {
      return { ...res, normalizedData: res.data.data };
    }
    if (Array.isArray(res.data)) {
      return { ...res, normalizedData: res.data };
    }
    return { ...res, normalizedData: [] };
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        toast.error("🛑 Unauthorized. Please login again.");
      } else if (error.response.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("❌ Server error.");
      }
    } else if (error.request) {
      toast.error("🌐 Network error.");
    } else {
      toast.error("⚠️ Request setup failed.");
    }
    return Promise.reject(error);
  }
);

export default function WalletRequestsPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // fetch pending requests (all or by username)
  const fetchPending = useCallback(
    async (username = "") => {
      try {
        setLoading(true);
        let all = [];

        if (username) {
          // search by username
          const res = await api.get(`pending/${encodeURIComponent(username)}`);
          all = Array.isArray(res.normalizedData) ? res.normalizedData : [];
        } else {
          // fetch all and filter pending client-side
          const res = await api.get("/all");
          const data = Array.isArray(res.normalizedData) ? res.normalizedData : [];
          all = data;
        }

        // filter pending requests with status "requested"
        setPendingRequests(all.filter((r) => r.status === "requested"));
      } catch (err) {
        console.error("fetchPending error:", err);
        toast.error("Failed to fetch pending requests");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // fetch accepted requests (all filtered)
  const fetchAccepted = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/all");
      const all = Array.isArray(res.normalizedData) ? res.normalizedData : [];
      setAcceptedRequests(all.filter((r) => r.status === "accepted"));
    } catch (err) {
      console.error("fetchAccepted error:", err);
      toast.error("Failed to fetch accepted requests");
    } finally {
      setLoading(false);
    }
  }, []);

  // On tab change or first load fetch relevant data
  useEffect(() => {
    if (activeTab === "pending") {
      fetchPending("");
    } else {
      fetchAccepted();
    }
  }, [activeTab, fetchPending, fetchAccepted]);

  // on search button click — only fetch pending for username
  const onSearchClick = () => {
    if (activeTab === "pending") {
      fetchPending(searchTerm.trim());
    }
  };

  // accept wallet top-up request
  const acceptRequest = async (requestId) => {
    setProcessingId(requestId);
    try {
      await api.put(`/accept/${requestId}`, {});
      toast.success("✅ Request accepted");
      if (activeTab === "pending") {
        await fetchPending(searchTerm.trim());
      } else {
        await fetchAccepted();
      }
    } catch (err) {
      console.error("acceptRequest error:", err);
      toast.error("Failed to accept request");
    } finally {
      setProcessingId(null);
    }
  };

  // format date display
  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return date;
    }
  };

  // Card component for a single request
  const RequestCard = ({ req, isPending }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-md hover:shadow-lg transition-all duration-200 space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <User2 className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{req.username || "Unknown"}</span>
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
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-3xl font-bold text-blue-700">
            💰 Wallet Top-up Requests
          </h1>

          {/* Search bar with button (only triggers pending search) */}
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search pending by username or request ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              onClick={onSearchClick}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>

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
            {loading && (
              <p className="text-center text-gray-500 mt-6">Loading...</p>
            )}

            {!loading && activeTab === "pending" && (
              <>
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((r) => (
                    <RequestCard key={r.request_id} req={r} isPending={true} />
                  ))
                ) : (
                  <p className="text-center text-gray-500 mt-6">
                    No pending requests found
                  </p>
                )}
              </>
            )}

            {!loading && activeTab === "accepted" && (
              <>
                {acceptedRequests.length > 0 ? (
                  acceptedRequests.map((r) => (
                    <RequestCard key={r.request_id} req={r} isPending={false} />
                  ))
                ) : (
                  <p className="text-center text-gray-500 mt-6">
                    No accepted requests found
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
