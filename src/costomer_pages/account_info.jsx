import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy } from "lucide-react";
import { FaMoneyBillWave, FaCoins, FaPlus, FaHistory } from "react-icons/fa";
import axios from "axios";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";
import LoadingScreen from "../components/loading.jsx";
import { motion } from "framer-motion";
import { fadeDirection } from "../../vatiation.js"; 
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function AccInfo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [bets, setBets] = useState([]);
  const [betsLoading, setBetsLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [expandedBetId, setExpandedBetId] = useState(null);

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
        const res = await axios.get(`${API_BASE}/api/oder/view`, {
          headers: { Authorization: "Bearer " + token },
        });
        setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    const fetchBets = async () => {
      setBetsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/bets/my-bet`, {
          headers: { Authorization: "Bearer " + token },
        });
        setBets(Array.isArray(res.data) ? res.data : []); // assume bets endpoint returns array directly
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
    return <LoadingScreen />;
  }

  // Order card component
  const OrderCard = ({ order, idx }) => {
    const isExpanded = expandedOrderId === order._id;
    return (
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeDirection("left", idx * 0.1)}
        key={order._id}
        className={`p-4 rounded-xl shadow-md flex flex-col gap-2 transition bg-blue-100 ${
          order.order_status === "delivered" ? "border border-green-300" : "border border-rose-300"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            {/* placeholder since product image not present in sample; adjust if available */}
            <img
              src={
                order.product_details?.product_image ||
                "https://via.placeholder.com/64"
              }
              alt={order.product_details?.product_name || "Product"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-base">
              {order.product_details?.product_name || "Unknown Product"}
            </h4>
            <p className="text-sm">Status: {order.order_status}</p>
            <p className="text-sm">Status: {order.order_id}</p>
          </div>
          <div>
            <button
              onClick={() =>
                setExpandedOrderId(isExpanded ? null : order._id)
              }
              className="text-blue-600 text-xs font-medium"
            >
              {isExpanded ? "Hide details" : "Details"}
            </button>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-2 border-t pt-2 text-sm space-y-1">
            <div>
              <span className="font-medium">User Email:</span> {order.user_email}
            </div>
            <div>
              <span className="font-medium">Quantity:</span> {order.quantity}
            </div>
            <div>
              <span className="font-medium">Address:</span>{" "}
              {order.user_address?.name}, {order.user_address?.address_line},{" "}
              {order.user_address?.district} ({order.user_address?.phone_number})
            </div>
            <div>
              <span className="font-medium">Created:</span>{" "}
              {new Date(order.order_created_date).toLocaleString()}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // Bet card component
  const BetCard = ({ bet, idx }) => {
    const isExpanded = expandedBetId === bet._id;
    // Choose image/name fields with fallback
    const itemImage =
      bet.item_image ||
      bet.product_image || bet.product_details?.product_image
      "https://via.placeholder.com/64";
    const itemName =
      bet.item_name || bet.product_name || bet.product_details?.product_name || "Unknown Item";

    return (
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeDirection("right", idx * 0.1)}
        key={bet._id}
        className="p-4 rounded-xl shadow-md flex flex-col gap-2 bg-blue-100 border border-gray-200 transition"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-blue-50">
            <img
              src={itemImage}
              alt={itemName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-base">{itemName}</h4> 
            <p className="text-sm text-gray-600">Bet CODE: {bet.code}</p>
            
          </div>
          <div>
            <button
              onClick={() => setExpandedBetId(isExpanded ? null : bet._id)}
              className="text-blue-600 text-xs font-medium"
            >
              {isExpanded ? "Hide" : "Details"}
            </button>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-2 border-t pt-2 text-sm space-y-1">
            <div>
              <span className="font-medium">User Email:</span> {bet.user_email}
            </div>
            <div>
              <span className="font-medium">Product ID:</span> {bet.product_id || bet.item_id}
            </div>
            <div>
              <span className="font-medium">Placed At:</span>{" "}
              {new Date(bet.placed_at || bet.created_at).toLocaleString()}
            </div>
            {/* If there are more nested details like user_address */}
            {bet.user_address && (
              <div>
                <span className="font-medium">Address:</span>{" "}
                {bet.user_address.name}, {bet.user_address.address_line},{" "}
                {bet.user_address.city} ({bet.user_address.contact_number})
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  return (
     <div className="w-full max-w-full mx-auto rounded-none overflow-hidden shadow-xl bg-white relative">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-1 bg-white shadow px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <ArrowLeft size={16} />
          
        </button>
      </div>
    <div className="min-h-screen w-full p-0 m-0 bg-gradient-to-b from-blue-50 via-green-50 to-white">
      <div className="w-full max-w-full mx-auto rounded-none overflow-hidden shadow-xl bg-white">
        {/* Header */}
        <div className="bg-blue-500 text-white relative w-full h-[30vh] rounded-b-[30px]">
          <div className="flex flex-col items-center justify-center h-full relative">
            <div className="relative">
              <img
                src={user.image || "https://i.ibb.co/dwhB6Xy0/who-has-any-bart-simpson-pfps-not-the-horrible-emo-ones-v0-869inxr4zljd1.jpg"}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-white mb-2"
              />
            </div>
            <h2 className="text-lg font-semibold mt-1">@{user.username}</h2>
          </div>

          <div className="absolute bottom-2 left-4 text-[16px] font-bold flex items-center gap-1">
            Rs. {user.main_balance}
          </div>
          <div className="absolute bottom-2 right-4 text-[16px] font-bold flex items-center gap-1">
            <FaCoins className="text-white" /> {user.coin_balance}
          </div>
        </div>

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
              orders.map((order, idx) => (
                <OrderCard key={order._id} order={order} idx={idx} />
              ))
            )
          ) : betsLoading ? (
            <div className="text-center text-gray-600">Loading bets...</div>
          ) : bets.length === 0 ? (
            <div className="text-center text-gray-600">No bets found.</div>
          ) : (
            bets.map((bet, idx) => (
              <BetCard key={bet._id} bet={bet} idx={idx} />
            ))
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

export default AccInfo;
