import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaArrowLeft, FaCoins, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import dotenv from "dotenv"
dotenv.config()
const API_BASE = process.env.API_BASE_URL;

const BetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const [form, setForm] = useState({
    name: "",
    number: "",
    address: "",
    city: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceBet = async () => {
    const payload = {
      user_address: {
        phone_number: form.number,
        address_line: form.address,
        name: form.name,
        district: form.city,
      },
      quantity: 1,
      product_id: product?.product_id,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/api/bets/place`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Bet placed successfully!", {
        icon: <FaCheckCircle className="text-green-600" />,
      });

      setTimeout(() => navigate("/bets"), 1500);
    } catch (err) {
      toast.error("Failed to place bet", {
        icon: <FaTimesCircle className="text-red-600" />,
      });
      console.error(err);
    }
  };

  if (!product) {
    return <div className="text-center mt-10 text-red-600">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 pt-20 pb-28 px-4">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-blue-600 text-white py-4 px-6 flex items-center shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="bg-white text-blue-600 p-2 rounded-full mr-4 shadow"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-bold">🎁 Place Your Bet</h1>
      </header>

      {/* Product Details */}
      <div className="bg-white shadow rounded-xl p-5 mb-6 flex gap-4 items-center">
        <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-xl" />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
          <p className="text-gray-500 text-sm mt-1">{product.description}</p>
          <div className="flex items-center gap-2 mt-2 font-semibold text-yellow-600">
            <FaCoins /> {product.coin_price} Coins
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Info</h3>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border px-4 py-2 rounded-lg"
        />
        <input
          name="number"
          value={form.number}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border px-4 py-2 rounded-lg"
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border px-4 py-2 rounded-lg"
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full border px-4 py-2 rounded-lg"
        />
      </div>

      {/* Place Bet Button */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40 flex justify-between items-center">
        <div className="text-yellow-700 font-bold flex items-center gap-1 text-lg">
          <FaCoins /> {product.coin_price} Coins
        </div>
        <button
          onClick={handlePlaceBet}
          className="bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700"
        >
          🚀 Place Bet
        </button>
      </footer>
    </div>
  );
};

export default BetPage;
