import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/loading.jsx";
import { fadeDirection } from "../../vatiation.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const plans = [
  {
    name: "Silver",
    price: 50,
    emoji: "🥈",
    methods: [
      { name: "mCASH", img: "./mcash.jpg" },
      { name: "eZycash", img: "./ezcash.jpg" },
      { name: "Hela Pay", img: "./helapay.jpg" },
      { name: "Lanka Pay", img: "./lankapay.jpg" },
      { name: "CDM/Online Bank Transfer", img: "./bank.jpg" },
    ],
  },
  {
    name: "Platinum",
    price: 100,
    emoji: "🪙",
    methods: [],
  },
  {
    name: "Diamond",
    price: 500,
    emoji: "💎",
    methods: [],
  },
];

export default function UserPlans() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
      const errorMessage =
        err.response?.data?.message || "Failed to send request";
      toast.error(errorMessage);
      console.error(err.response?.data || err.message);
    } finally {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, minDuration - elapsed);
      setTimeout(() => setLoading(false), wait);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-white px-4 py-3 shadow sticky top-0 z-50 flex items-center justify-center relative rounded-b-2xl">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 p-2 rounded-full text-white absolute left-4 hover:bg-blue-600 transition"
        >
          <FaArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-semibold text-blue-700 text-center select-none">
          🚀 Choose Your Plan
        </h1>
      </header>

      {/* Methods Section */}
      <div className="px-4 pt-6">
        <h1 className="text-lg font-semibold text-gray-800 mb-4">We accept by</h1>
        <div className="flex flex-col gap-3">
          {plans[0].methods.map((method, i) => (
            <div
              key={i}
              className="flex items-center border border-gray-200 rounded-lg p-3 bg-white"
            >
              <img
                src={method.img}
                alt={method.name}
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <span className="text-base font-medium text-gray-700">
                {method.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Plans Section */}
      <div className="px-4 pt-6 pb-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.6 }}
              variants={fadeDirection(idx % 2 === 0 ? "left" : "right", idx * 0.15)}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl hover:scale-105 transition cursor-pointer"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {plan.emoji} {plan.name}
                </h2>
                <span className="text-lg text-blue-700 font-semibold">
                  LKR {plan.price}
                </span>
              </div>

              <button
                onClick={() => handleBuy(plan.price)}
                className="mt-5 w-full bg-blue-600 text-white font-semibold py-2 rounded-xl shadow-md hover:bg-blue-700 transition"
              >
                Send Request
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
