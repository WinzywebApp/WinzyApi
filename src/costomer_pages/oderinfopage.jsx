import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaCoins, FaShoppingBag } from "react-icons/fa";

import dotenv from "dotenv"
dotenv.config()
const API_BASE = process.env.API_BASE_URL;

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedProduct = location.state?.product;

  const product = passedProduct || {
    id: "unknown_product",
    name: "Unknown Product",
    quantity: 1,
    image: "https://via.placeholder.com/50",
    main_price: 0,
    coin_price: 0,
  };

  const [form, setForm] = useState({
    name: "",
    number: "",
    address: "",
    city: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    const payload = {
      user_address: {
        phone_number: form.number,
        address_line: form.address,
        name: form.name,
        district: form.city,
      },
      quantity: 1,
      product_id: product.id,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/api/oder/creat`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Order placed successfully!", {
        icon: <FaCheckCircle className="text-green-600" />,
      });

      setTimeout(() => navigate("/orders"), 1500);
    } catch (error) {
      toast.error("Failed to place order.", {
        icon: <FaTimesCircle className="text-red-600" />,
      });
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 via-white to-green-50 relative pt-24 pb-28">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-5 px-6 flex justify-center items-center shadow-md">
        <div className="absolute top-4 left-4 z-40">
          <button
            onClick={() => navigate(-1)}
            className="bg-white text-blue-700 p-2 rounded-full shadow hover:scale-105 transition"
          >
            <FaArrowLeft />
          </button>
        </div>
        <h1 className="text-2xl font-semibold tracking-wide flex items-center gap-2">
          
          Oder infomation
        
        </h1> 
      </header>

      {/* Form Section */}
      <main className="p-6 space-y-8 max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Details</h2>
          <div className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="number"
              value={form.number}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address Line"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Product Preview */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <img
            src={product.image}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-xl border"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          </div>
        </div>
      </main>

      {/* Footer Button */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t flex justify-between items-center z-30">
        <div className="text-gray-700 space-y-1">
          <p className="flex items-center gap-2 text-lg font-medium">
            <FaMoneyBillWave className="text-green-600" /> Rs. {product.main_price}
          </p>
          <p className="flex items-center gap-2 text-lg font-medium">
            <FaCoins className="text-yellow-500" /> {product.coin_price} Coins
          </p>
        </div>
        <button
          onClick={handlePlaceOrder}
          className="bg-blue-600 hover:bg-blue-700 transition-all text-white py-3 px-6 rounded-xl text-lg font-semibold shadow-md"
        >
          🚀 Place Order
        </button>
      </footer>
    </div>
  );
};

export default OrderPage;
