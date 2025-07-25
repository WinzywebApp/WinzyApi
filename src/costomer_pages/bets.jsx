import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Clock } from "lucide-react";

const API_BASE = "http://localhost:5000";

const BetItemsGrid = () => {
  const [products, setProducts] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    const timer = setInterval(() => {
      const updatedCountdowns = {};
      products.forEach((product) => {
        const now = new Date();
        const startTime = new Date(product.start_time);
        const endTime = new Date(product.end_time);

        if (now >= startTime) {
          const diff = endTime - now;
          const seconds = Math.max(0, Math.floor(diff / 1000));
          updatedCountdowns[product._id] = {
            days: Math.floor(seconds / (3600 * 24)),
            hours: Math.floor((seconds % (3600 * 24)) / 3600),
            minutes: Math.floor((seconds % 3600) / 60),
            seconds: seconds % 60,
          };
        }
      });
      setCountdowns(updatedCountdowns);
    }, 1000);

    return () => clearInterval(timer);
  }, [products]);

  const fetchAllProducts = () => {
    axios
      .get(`${API_BASE}/api/bets-item/`)
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          console.error("Invalid response for all products", res);
        }
      })
      .catch((err) => console.error("Failed to fetch all products", err));
  };

  return (
    <div className="p-4 min-h-screen bg-gradient-to-b from-[#E0F2FE] via-white to-[#F8FAFC]">
      {/* ✅ Beautiful Header */}
      <header className="w-full bg-white px-4 py-3 shadow-sm sticky top-0 z-10 flex items-center justify-center relative rounded-b-2xl">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 p-2 rounded-full text-white absolute left-4"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-blue-700">🎯 Bet & Win</h2>
      </header>

      {/* ✅ Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-5xl mx-auto mt-4">
        {products.map((product) => {
          const endTime = new Date(product.end_time);
          const startTime = new Date(product.start_time);
          const countdown = countdowns[product._id] || {};

          return (
            <Link
             
              className="group bg-white border border-blue-100 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden relative"
            >
              {/* 🖼 Image */}
              <div className="relative w-full h-40 bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* 📄 Details */}
              <div className="p-4 space-y-2">
                <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>

                {/* 💰 Coin Price + Time */}
                <div className="flex items-center justify-between text-sm font-semibold">
                  <div className="flex items-center text-yellow-600 font-semibold">
                    <img src="/coin.png" alt="coin" className="w-4 h-4 mr-1" />
                    <span className="text-green-700 flex items-center">
                      💰 {product.coin_price} Coins
                    </span>
                  </div>
                  <span className="text-[11px] text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                    Ends: {endTime.toLocaleDateString()}{" "}
                    {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {/* 🟢 Start Time */}
                <div className="text-[11px] text-green-600 bg-green-100 rounded-full px-2 py-0.5 text-center font-semibold">
                  Starts: {startTime.toLocaleDateString()}{" "}
                  {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>

                {/* ⏳ Countdown */}
                {new Date() >= startTime && countdown.days !== undefined ? (
                  <div className="flex items-center justify-center text-[12px] text-gray-700 mt-1 bg-gray-100 rounded-lg px-2 py-1">
                    <Clock className="w-4 h-4 mr-1 text-blue-500" />
                    {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s left
                  </div>
                ) : (
                  <div className="text-center text-xs text-gray-400 mt-1">⏳ Waiting to start...</div>
                )}

                {/* 🎁 Bet Now Button */}
                <Link
                  key={product._id}
                  to={`/bet`}
                  state={{ product }}
                  className="flex justify-center mt-3"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-full shadow hover:bg-blue-700 transition">
                    🎁 Bet Now
                  </div>
                </Link>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BetItemsGrid;
