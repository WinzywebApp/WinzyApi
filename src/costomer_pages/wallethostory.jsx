import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaWallet,
  FaClock,
  FaCheck,
  FaMoneyBill,
} from "react-icons/fa";

import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function UserWalletHistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchUserRequests();
  }, []);

  const fetchUserRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/wallet/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      toast.error("Error loading wallet history");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <h1 className="text-xl font-bold mb-4 text-center text-blue-600">
        🧾 Wallet History
      </h1>

      <div className="space-y-4">
        {history.length === 0 && (
          <div className="text-center text-gray-500">
            No wallet activity yet.
          </div>
        )}

        {history.map((r) => (
          <div
            key={r.request_id}
            className="bg-white rounded-xl shadow-md border p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-700 font-medium">
                <FaMoneyBill className="text-green-500" />
                LKR {r.amount}
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full font-semibold ${
                  r.status === "accepted"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {r.status === "accepted" ? "✅ Accepted" : "⏳ Pending"}
              </span>
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <FaClock /> {r.created_at}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
