import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function WinnerCard({ order }) {
  const productImage = order?.product_details?.product_image || "/default.png";
  const userEmail = order?.user_name || "Unknown User";  

  return (
    <div className="bg-blue-400 rounded-xl shadow-lg flex items-center gap-4 p-5 w-full border border-indigo-300">
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
        <img
          src={productImage}
          alt="product"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 select-none">
        <h3 className="text-lg font-semibold text-white select-none">
          🎉 Congratulations!
        </h3>
        <p className="text-sm text-white mt-1 truncate select-text">
          🧑 {userEmail}
        </p>
      </div>
    </div>
  );
}

const slideFadeRight = {
  hidden: { x: 200, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: -200, opacity: 0 }
};

const BetItemsGrid = () => {
  const [products, setProducts] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [winners, setWinners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const navigate = useNavigate();

  const currentOrder = winners[currentIndex];
  const prevOrder = winners[prevIndex];

  useEffect(() => {
    fetchAllProducts();
    fetchWinners();
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

  useEffect(() => {
    if (winners.length === 0) return;
    const interval = setInterval(() => {
      setPrevIndex(currentIndex);
      setCurrentIndex((prev) => (prev + 1) % winners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, winners]);

  const fetchAllProducts = () => {
    axios
      .get(`${API_BASE}/api/bets-item/`)
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setProducts(res.data);
        }
      })
      .catch((err) => console.error("Failed to fetch all products", err));
  };

  const fetchWinners = () => {
    axios
      .get(`${API_BASE}/api/bets/winner`)
      .then((res) => {
        const winnersList = res.data?.data || [];
        setWinners(winnersList);
      })
      .catch((err) => console.error("Failed to fetch winners", err));
  };

  return (
    <div className="p-4 min-h-screen bg-gradient-to-b from-[#E0F2FE] via-white to-[#F8FAFC] pt-32">
      <header className="fixed top-0 left-0 w-full bg-white py-3 shadow-sm z-10 flex items-center justify-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 p-2 rounded-full text-white absolute left-4"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-blue-700">🎯 Bet & Win</h2>
      </header>

      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideFadeRight}
        transition={{ duration: 0.5 }}
        className="relative  w-full max-w-xl mx-auto mt-4 mb-3 px-4 overflow-visible h-24"
        style={{ pointerEvents: "none" }}
      >
        <div className="relative w-full h-full">
          <AnimatePresence initial={false}>
            {prevOrder && (
              <motion.div
                key={prevOrder.order_id + "-prev"}
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: -200, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <WinnerCard order={prevOrder} />
              </motion.div>
            )}
            {currentOrder && (
              <motion.div
                key={currentOrder.order_id}
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <WinnerCard order={currentOrder} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-5xl mx-auto mt-4">
        {products.map((product) => {
          const endTime = new Date(product.end_time);
          const startTime = new Date(product.start_time);
          const countdown = countdowns[product._id] || {};

          return (
            <div
              key={product._id}
              className="group bg-white border border-blue-100 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden relative"
            >
             <div className="relative w-[300px] h-[300px] bg-gray-100 mx-auto flex items-center justify-center">
  <img
    src={product.image}
    alt={product.name}
    className="w-[300px] h-[300px] object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
  />
</div>

              <div className="p-4 space-y-2">
                <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between text-sm font-semibold">
                  <div className="flex items-center text-yellow-600 font-semibold">
                    <span className="text-green-700 flex items-center">
                      💰 {product.main_price} Coins
                    </span>
                  </div>
                  <span className="text-[11px] text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                    Ends: {endTime.toLocaleDateString()} {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <div className="text-[11px] text-green-600 bg-green-100 rounded-full px-2 py-0.5 text-center font-semibold">
                  Starts: {startTime.toLocaleDateString()} {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>

                {new Date() >= startTime && countdown.days !== undefined ? (
                  <div className="flex items-center justify-center text-[12px] text-gray-700 mt-1 bg-gray-100 rounded-lg px-2 py-1">
                    <Clock className="w-4 h-4 mr-1 text-blue-500" />
                    {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s left
                  </div>
                ) : (
                  <div className="text-center text-xs text-gray-400 mt-1">⏳ Waiting to start...</div>
                )}

                <Link to={`/bet`} state={{ product }} className="flex justify-center mt-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-full shadow hover:bg-blue-700 transition">
                    🎁 Bet Now
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BetItemsGrid;