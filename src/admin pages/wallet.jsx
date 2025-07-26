import React, { useState } from "react";
import axios from "axios";
import { FaSearch, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

import dotenv from "dotenv"
dotenv.config()
const API_BASE = process.env.API_BASE_URL;

export default function AdminRequestPage() {
  const [username, setUsername] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState("");

  const searchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE}/api/wallet/pending/${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(res.data);
    } catch (err) {
      toast.error("Error fetching requests");
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (request_id) => {
    setProcessingId(request_id);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE}/api/wallet/accept/${request_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Request Accepted");
      searchRequests();
    } catch (err) {
      toast.error("Failed to accept request");
    } finally {
      setProcessingId("");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-4">
      <div className="max-w-xl mx-auto">
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search by username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl shadow border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={searchRequests}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow flex items-center gap-2 disabled:opacity-50"
          >
            <FaSearch /> {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {requests.length === 0 && !loading && (
          <div className="text-center text-gray-500 italic">No pending requests found.</div>
        )}

        <div className="space-y-4">
          {requests.map((r) => (
            <div
              key={r.request_id}
              className="bg-white rounded-xl shadow p-4 border border-gray-200"
            >
              <p><strong>👤 Username:</strong> {r.username}</p>
              <p><strong>💰 Amount:</strong> LKR {r.amount}</p>
              <p><strong>🕒 Date:</strong> {r.created_at}</p>
              <p><strong>📌 Status:</strong> <span className="capitalize">{r.status}</span></p>
              <div className="mt-4 text-center">
                <button
                  onClick={() => acceptRequest(r.request_id)}
                  disabled={processingId === r.request_id}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow inline-flex items-center gap-2 disabled:opacity-60"
                >
                  <FaCheckCircle />{" "}
                  {processingId === r.request_id ? "Accepting..." : "Accept"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
