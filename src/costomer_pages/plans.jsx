import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaVideo, FaSyncAlt, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/loading.jsx";
import { fadeDirection } from "../../vatiation.js"; // ඔයාගේ version file path

const API_BASE = import.meta.env.VITE_API_BASE_URL;

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ensure loading shows at least a brief moment
  const handleBuy = async (amount) => {
    const minDuration = 500;
    const start = Date.now();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE}/api/wallet/create`,
        { amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Request sent successfully!");
    } catch (err) {
      toast.error("Failed to send request");
      console.error(err.response?.data || err.message);
    } finally {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, minDuration - elapsed);
      setTimeout(() => setLoading(false), wait);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-blue-100">
      {/* Header */}
      <header className="w-full bg-white px-4 py-3 shadow sticky top-0 z-50 flex items-center justify-center relative rounded-b-2xl">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 p-2 rounded-full text-white absolute left-4 hover:bg-blue-600 transition"
          aria-label="Go back"
        >
          <FaArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-semibold text-blue-700 text-center select-none">
          🚀 Choose Your Plan
        </h1>
      </header>

      {/* Content */}
      <div className="px-4 pt-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.6 }}
              variants={fadeDirection(
                idx % 2 === 0 ? "left" : "right",
                idx * 0.15
              )}
              className={`bg-gradient-to-br ${plan.bg} ${plan.border} border-2 rounded-2xl p-6 shadow-xl transform transition duration-300 hover:scale-105 cursor-pointer select-none`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 select-text">
                  {plan.emoji} {plan.name}
                </h2>
                <span className="text-lg text-blue-700 font-semibold select-text">
                  LKR {plan.price}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 text-sm select-text">
                <FaVideo className="text-blue-600" />
                <span>{plan.videos} Videos Access</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 text-sm mt-2 select-text">
                <FaSyncAlt className="text-green-600" />
                <span>{plan.spins} Spins Daily</span>
              </div>
              <button
                onClick={() => handleBuy(plan.price)}
                className="mt-5 w-full bg-blue-600 text-white font-semibold py-2 rounded-xl shadow-md hover:bg-blue-700 transition"
                aria-label={`Buy ${plan.name} plan`}
              >
                Buy Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
