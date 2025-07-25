import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaVideo, FaSyncAlt } from "react-icons/fa";

const API_BASE = "http://localhost:5000"; // ✅ Base URL

const plans = [
  {
    name: "Silver",
    price: 50,
    videos: 2,
    spins: 2,
    bg: "from-gray-100 to-gray-200",
    border: "border-gray-300",
    emoji: "🥈",
  },
  {
    name: "Platinum",
    price: 100,
    videos: 2,
    spins: 2,
    bg: "from-yellow-100 to-yellow-200",
    border: "border-yellow-400",
    emoji: "🪙",
  },
  {
    name: "Diamond",
    price: 500,
    videos: 4,
    spins: 4,
    bg: "from-blue-100 to-blue-200",
    border: "border-blue-400",
    emoji: "💎",
  },
];

export default function UserPlans() {
  const handleBuy = async (amount) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE}/api/wallet/create`, // ✅ Corrected API URL
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Request sent successfully!");
    } catch (err) {
      toast.error("Failed to send request");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 p-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-8">
        🚀 Choose Your Plan
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-gradient-to-br ${plan.bg} ${plan.border} border-2 rounded-2xl p-6 shadow-xl transform transition duration-300 hover:scale-105`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {plan.emoji} {plan.name}
              </h2>
              <span className="text-lg text-blue-700 font-semibold">
                LKR {plan.price}
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 text-sm">
              <FaVideo className="text-blue-600" />
              <span>{plan.videos} Videos Access</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 text-sm mt-2">
              <FaSyncAlt className="text-green-600" />
              <span>{plan.spins} Spins Daily</span>
            </div>
            <button
              onClick={() => handleBuy(plan.price)}
              className="mt-5 w-full bg-blue-600 text-white font-semibold py-2 rounded-xl shadow-md hover:bg-blue-700 transition"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
