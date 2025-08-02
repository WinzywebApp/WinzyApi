import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  FaBars,
  FaUserCircle,
  FaGift,
  FaVideo,
  FaQuestionCircle,
  FaUserFriends,
  FaCoins,
} from "react-icons/fa";
import { MdCasino } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE_URL ;

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// animation variants
const slideFadeLeft = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: -30, opacity: 0 },
};
const slideFadeRight = {
  hidden: { x: 50, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: 30, opacity: 0 },
};
const fadeUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { opacity: 0 },
};

function HomePage() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState("ALL");
  const [orders, setOrders] = useState([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [prevOrderIndex, setPrevOrderIndex] = useState(null);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchAllProducts();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length === 0) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setPrevOrderIndex(currentOrderIndex);
      setCurrentOrderIndex((prev) => (prev + 1) % orders.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [orders, currentOrderIndex]);

  const fetchOrders = () => {
    axiosInstance
      .get(`${API_BASE}/api/oder/all`)
      .then((res) => {
        const data = res.data?.orders || res.data || [];
        if (Array.isArray(data)) setOrders(data);
        else console.error("Orders response invalid", res.data);
      })
      .catch((err) => console.error("Failed to fetch orders", err));
  };

  const fetchAllProducts = () => {
    axiosInstance
      .get(`${API_BASE}/api/product`)
      .then((res) => {
        if (res.data && Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          console.error("Invalid response for products", res);
        }
      })
      .catch((err) => console.error("Failed to fetch all products", err));
  };

  const fetchProductsByCategory = (category) => {
    axiosInstance
      .get(`${API_BASE}/api/product/category?cat=${category}`)
      .then((res) => {
        if (res.data && Array.isArray(res.data.list)) {
          setProducts(res.data.list);
        } else if (res.data && Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          console.error("Unexpected response for category products", res);
        }
      })
      .catch((err) => console.error("Failed to fetch by category", err));
  };

  const handleCategorySelect = (cat) => {
    setSelected(cat);
    if (cat === "ALL") fetchAllProducts();
    else fetchProductsByCategory(cat.toLowerCase());
  };

  const currentOrder = orders.length > 0 ? orders[currentOrderIndex] : null;
  const prevOrder = prevOrderIndex !== null ? orders[prevOrderIndex] : null;

  const categories = ["ALL", "Tech", "Beauty", "Perfumes"];

  const features = [
    { icon: <FaVideo className="text-pink-500 text-2xl" />, label: "Video Earn", route: "/watch" },
    { icon: <MdCasino className="text-orange-500 text-2xl" />, label: "Lucky Spin", route: "/spin" },
    { icon: <FaGift className="text-blue-500 text-2xl" />, label: "Gift Code", route: "/redeem" },
    { icon: <FaQuestionCircle className="text-green-500 text-2xl" />, label: "Quizzes", route: "/quize" },
    { icon: <FaUserFriends className="text-purple-500 text-2xl" />, label: "Bet Items", route: "/bet-item" },
    { icon: <FaUserCircle className="text-yellow-500 text-2xl" />, label: "Tasks", route: "/task" },
  ];

  return (
    <div className="min-h-screen pb-20 relative overflow-x-hidden bg-white ">
      {/* Navbar */}
      <div className="fixed top-0 left-0 z-40 w-full h-16 bg-blue-400 rounded-r-2xl flex items-center justify-between px-4 text-white shadow-md">
        <FaBars className="w-6 h-6" />
        <h1 className="text-lg font-bold font-poppins">MyLogo</h1>
        <FaUserCircle className="w-7 h-7 cursor-pointer" onClick={() => navigate("/account")} />
      </div>
      <div className="h-16" />

      {/* Winner Card Slider */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideFadeRight}
        transition={{ duration: 0.5 }}
        className="relative z-30 w-full max-w-xl mx-auto mt-4 mb-3 px-4 overflow-visible h-24"
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

      {/* Feature Grid Title */}
      <motion.h2
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideFadeLeft}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-lg font-bold text-gray-700 px-4 mt-2 mb-2"
      >
        Earn Coins 💰
      </motion.h2>

      {/* Feature Grid */}
      <motion.section
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideFadeRight}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex gap-5 overflow-x-auto px-4 scrollbar-hide"
      >
        {features.map(({ icon, label, route }, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            className="relative group flex items-center gap-3 min-w-[160px] w-auto h-14 bg-blue-300 shadow-lg rounded-2xl px-3 transition duration-300"
            onClick={() => navigate(route)}
          >
            <div className="bg-white p-3 rounded-full shadow-inner group-hover:rotate-12 transition-transform duration-300">
              {icon}
            </div>
            <span className="text-[15px] font-medium text-gray-900 group-hover:text-blue-500 transition-colors text-left">
              {label}
            </span>
          </motion.button>
        ))}
      </motion.section>

      <div className="h-[10px]" />

      {/* Category Filter */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideFadeLeft}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="sticky top-16 flex justify-center items-center w-full py-2 bg-white z-20"
      >
        <div className="flex space-x-2 p-2 rounded-xl shadow-sm">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-1 text-sm rounded-full font-semibold transition-all duration-200 ${
                selected === cat
                  ? "bg-blue-500 text-white shadow-md"
                  : "border border-gray-300 text-gray-700"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Product Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeUp}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="p-4 grid grid-cols-2 gap-4 max-w-md mx-auto"
      >
        {products.map((product) => {
          const qty = product?.quantity ?? product?.stock ?? 0;
          const hasStock = qty > 0;
          return (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.4 }}
              className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              {/* quantity badge */}
              <div className="absolute top-2 right-2 ">
                <div
                  className={`text-[10px] font-bold px-2 py-1 rounded-full border-[5px] ${
                    hasStock ? "bg-green-100 text-green-800 border-green-600" : "bg-red-100 text-red-800 border-red-600"
                  }`}
                  style={{ padding: "2px 6px" }}
                >
                  {qty}
                </div>
              </div>
              <Link
                to={`/product/${product._id}`}
                state={{ product }}
                className="block"
              >
                <div className="w-full h-32 bg-blue-500">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3  bg-blue-100 ">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center mt-2">
                    < FaCoins className ="w-4 h-4 mr-1" />
                    <span className=" text-sm font-bold">
                      {product.coin_price}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

// WinnerCard component
function WinnerCard({ order }) {
  const productImage = order?.product_details?.product_image || "/default.png";
  const userEmail = order?.user_email || "Unknown User";

  return (
    <div className="bg-blue-400 rounded-xl shadow-lg flex items-center gap-4 p-4 w-full border border-indigo-300">
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

export default HomePage;
