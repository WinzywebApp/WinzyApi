import React, { useState } from "react";
import { FaGift, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const GiftRedeem = () => {
  const [code, setCode] = useState("");
  const [redeemed, setRedeemed] = useState(false);
  const navigate = useNavigate();

  const handleRedeem = async () => {
    if (!code.trim()) {
      toast.error("Please enter a gift code");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to redeem");
        return;
      }

      const res = await axios.post(
        `${API_BASE}/api/redeem/gift`,
        { code },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message || "Redeemed successfully!");
      setRedeemed(true);
      setTimeout(() => setRedeemed(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to redeem code");
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white px-4 py-3 shadow-sm sticky top-0 z-10 flex items-center justify-center relative rounded-b-2xl">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 p-2 rounded-full text-white absolute left-4"
          aria-label="Go back"
        >
          <FaArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-semibold text-blue-700 text-center">
          🎁 Redeem Gift
        </h1>
      </header>

      {/* Content */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-[320px] w-full text-center font-sans">
          <div className="mb-4 animate-bounce">
            <FaGift className="text-blue-500 text-5xl mx-auto" />
          </div>
          <h2 className="text-blue-700 font-semibold mb-2 text-lg">🎁 Redeem Gift Code</h2>
          <p className="text-gray-600 text-sm mb-5">Enter your gift code below to redeem your reward.</p>
          <input
            type="text"
            placeholder="Enter your code..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="p-3 w-full border border-blue-300 rounded-lg text-sm mb-4 outline-none bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <button
            onClick={handleRedeem}
            className="py-3 px-5 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl font-bold text-sm w-full shadow-md hover:from-blue-700 hover:to-blue-500 transition-all"
          >
            Redeem
          </button>
          {redeemed && (
            <div className="mt-5 text-green-500 font-medium text-sm flex items-center justify-center gap-2 animate-fade-in">
              <FaCheckCircle /> Code redeemed successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftRedeem;
