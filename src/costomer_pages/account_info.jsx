import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy } from "lucide-react";
import { FaMoneyBillWave, FaCoins, FaPlus, FaHistory } from "react-icons/fa";
import axios from "axios";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";



import dotenv from "dotenv"
dotenv.config()
const API_BASE = process.env.API_BASE_URL;

function AccInfo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [bets, setBets] = useState([]);
  const [betsLoading, setBetsLoading] = useState(false);
  

  
  const copyReferralCode = () => {
    if (user?.refaral_code) {
      navigator.clipboard.writeText(user.refaral_code);
      toast.success("Referral code copied to clipboard!");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/user/profile`, {
          headers: { Authorization: "Bearer " + token },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (user?.refaral_count === 3) {
      confetti({ particleCount: 150, spread: 80 });
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/order/viwe`, {
          headers: { Authorization: "Bearer " + token },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    const fetchBets = async () => {
      setBetsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/bets/my-bets`, {
          headers: { Authorization: "Bearer " + token },
        });
        setBets(res.data.bets || []);
      } catch (err) {
        if (err.response?.status === 404) {
          setBets([]);
        } else {
          toast.error("Failed to fetch bets");
          console.error("Error fetching bets:", err.response?.data || err.message);
        }
      } finally {
        setBetsLoading(false);
      }
    };

    if (filter === "orders") {
      fetchOrders();
    } else if (filter === "bets") {
      fetchBets();
    }
  }, [filter]);

  if (!user) {
    return <div className="text-center mt-20 font-semibold text-lg">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full p-0 m-0 bg-gradient-to-b from-blue-50 via-green-50 to-white">
      <div className="w-full max-w-full mx-auto rounded-none overflow-hidden shadow-xl bg-white">
        {/* Header */}
        <div className="bg-blue-500 text-white relative w-full h-[30vh] rounded-b-[30px]">
          <button
            className="absolute top-4 left-4 bg-white p-2 rounded-full shadow"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="text-blue-500" />
          </button>
          <div className="flex flex-col items-center justify-center h-full relative">
            <div className="relative">
              <img
                src={user.image || "https://via.placeholder.com/60"}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-white mb-2"
              />
            </div>
            <h2 className="text-lg font-semibold mt-1">@{user.username}</h2>
          </div>

          {/* Footer Info */}
          <div className="absolute bottom-2 left-4 text-sm font-bold flex items-center gap-1">
            <FaMoneyBillWave className="text-white" /> {user.main_balance}
          </div>
          <div className="absolute bottom-2 right-4 text-sm font-bold flex items-center gap-1">
            <FaCoins className="text-white" /> {user.coin_balance}
          </div>
        </div>

        {/* Wallet Actions */}
        {/* Wallet Actions */}
<div className="mt-6 px-4 space-y-2">
  <h3 className="text-lg font-semibold mb-2">💼 Wallet Actions</h3>
  <div className="flex gap-4">
    <button
      onClick={() => navigate("/plans")}
      className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl shadow hover:bg-green-600"
    >
      <FaPlus /> Add Money
    </button>
    <button
      onClick={() => navigate("/wallet/history")}
      className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-xl shadow hover:bg-gray-300"
    >
      <FaHistory /> Wallet History
    </button>
  </div>
</div>

        {/* Referrals */}
        <div className="mt-6 px-4 space-y-2">
          <h3 className="text-lg font-semibold mb-2">🎯 My Referrals</h3>
          <div className="bg-blue-100 rounded-xl p-4 shadow-md space-y-1">
            <p className="flex items-center gap-2">
              🔗 Referral Code: <span className="font-bold">{user.refaral_code}</span>
              <button
                onClick={copyReferralCode}
                className="ml-2 p-1 rounded-full hover:bg-blue-200"
                title="Copy Code"
              >
                <Copy size={16} />
              </button>
            </p>
            <p>
              👥 Total Referrals: <span className="font-bold">{user.refaral_count}</span>
            </p>
            <button className="mt-2 bg-blue-500 text-white py-1 px-3 rounded-full text-sm shadow hover:bg-blue-600">
              ➕ Invite Friends
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setFilter("orders")}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              filter === "orders"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            📦 Orders
          </button>
          <button
            onClick={() => setFilter("bets")}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              filter === "bets"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            🎰 Bets
          </button>
        </div>

        {/* Filtered Content */}
        <div className="p-4 space-y-4 min-h-[150px]">
          {filter === "orders" ? (
            orders.length === 0 ? (
              <div className="text-center text-gray-600">No orders found.</div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 rounded-xl shadow-md flex items-center gap-4 ${
                    order.status === "delivered"
                      ? "bg-green-200"
                      : "bg-rose-200"
                  }`}
                >
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-base">{order.productName}</h4>
                    <p className="text-sm">Status: {order.status}</p>
                  </div>
                </div>
              ))
            )
          ) : betsLoading ? (
            <div className="text-center text-gray-600">Loading bets...</div>
          ) : bets.length === 0 ? (
            <div className="text-center text-gray-600">No bets found.</div>
          ) : (
            bets.map((bet) => (
              <div
                key={bet._id}
                className={`p-4 rounded-xl shadow-md flex items-center gap-4 ${
                  bet.status === "won" ? "bg-green-200" : "bg-rose-200"
                }`}
              >
                <img
                  src={bet.image}
                  alt={bet.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-semibold text-base">{bet.name}</h4>
                  <p className="text-sm">Status: {bet.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AccInfo;
