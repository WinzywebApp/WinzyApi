import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  FaBars,
  FaUserCircle,
  FaGift,
  FaVideo,
  FaQuestionCircle,
  FaUserFriends,
} from "react-icons/fa";
import { MdCasino } from "react-icons/md";
import dotenv from "dotenv"
dotenv.config()
const API_BASE = process.env.API_BASE_URL;

const sampleWinners = [
  { username: "@Nimsara", image: "https://via.placeholder.com/150" },
  { username: "@Heshan", image: "https://via.placeholder.com/150" },
  { username: "@Kamal", image: "https://via.placeholder.com/150" },
];

function HomePage() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState("ALL");
  const [activeTab, setActiveTab] = useState("home");
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = () => {
    axios
      .get(`${API_BASE}/api/product`)
      .then((res) => {
        if (res.data && Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          console.error("Invalid response for all products", res);
        }
      })
      .catch((err) => console.error("Failed to fetch all products", err));
  };

  const fetchProductsByCategory = (category) => {
    axios
      .get(`${API_BASE}/api/product/category?cat=${category}`)
      .then((res) => {
        if (res.data && Array.isArray(res.data.list)) {
          setProducts(res.data.list);
        } else if (res.data && Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          console.error("Unexpected response format when fetching by category", res);
        }
      })
      .catch((err) => console.error("Failed to fetch by category", err));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(index);
      setIndex((prev) => (prev + 1) % sampleWinners.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [index]);

  const handleCategorySelect = (cat) => {
    setSelected(cat);
    if (cat === "ALL") {
      fetchAllProducts();
    } else {
      const category = cat.toLowerCase();
      fetchProductsByCategory(category);
    }
  };

  const winnerCurrent = sampleWinners[index];
  const winnerPrev = prevIndex !== null ? sampleWinners[prevIndex] : null;

  const categories = ["ALL", "Tech", "Beauty", "Perfumes"];

  const features = [
    { icon: <FaVideo className="text-pink-500 text-2xl" />, label: "Video Earn", route: "/watch" },
    { icon: <MdCasino className="text-orange-500 text-2xl" />, label: "Lucky Spin", route: "/spin" },
    { icon: <FaGift className="text-blue-500 text-2xl" />, label: "Gift Code", route: "/redeem" },
    { icon: <FaQuestionCircle className="text-green-500 text-2xl" />, label: "Quizzes", route: "/quize" },
  ];

  return (
    <div className="min-h-screen  pb-20 relative overflow-x-hidden">
      {/* Gift rain behind all content */}
      

      {/* Navbar with highest z-index */}
      <div className="fixed top-0 left-0 z-30 w-full h-16 bg-blue-400 rounded-r-2xl flex items-center justify-between px-4 text-white shadow-md">
        <FaBars className="w-6 h-6" />
        <h1 className="text-lg font-bold font-poppins">MyLogo</h1>
        <FaUserCircle className="w-7 h-7" onClick={() => navigate("/account")} />
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>

      {/* Winner Card Slider */}
      <div className="relative w-full h-28 overflow-hidden">
        {winnerPrev && (
          <div className="absolute w-full top-0 left-0 h-full flex justify-center items-center animate-slide-out">
            <WinnerCard winner={winnerPrev} />
          </div>
        )}
        <div className="absolute w-full top-0 left-0 h-full flex justify-center items-center animate-slide-in">
          <WinnerCard winner={winnerCurrent} />
        </div>
      </div>

      {/* Feature Grid */}
     {/* Feature Grid Title */}
<h2 className="text-lg font-bold text-gray-700 px-4 mt-8 mb-2">Earn Coins 💰</h2>

{/* Feature Grid */}
<section className="flex gap-5 overflow-x-auto px-4 scrollbar-hide">
  {[
    { icon: <FaVideo className="text-pink-500 text-2xl" />, label: "Video Earn", route: "/watch" },
    { icon: <MdCasino className="text-orange-500 text-2xl" />, label: "Lucky Spin", route: "/spin" },
    { icon: <FaGift className="text-blue-500 text-2xl" />, label: "Gift Code", route: "/redeem" },
    { icon: <FaQuestionCircle className="text-green-500 text-2xl" />, label: "Quizzes", route: "/quize" },
    { icon: <FaUserFriends className="text-purple-500 text-2xl" />, label: "Bet Items", route: "/bet-item" },
    { icon: <FaUserCircle className="text-yellow-500 text-2xl" />, label: "Tasks", route: "/task" },
  ].map(({ icon, label, route }, i) => (
    <button
      key={i}
      className="relative group w-24 h-28 bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-lg rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition duration-300"
      onClick={() => navigate(route)}
    >
      <div className="bg-white shadow-inner p-3 rounded-full group-hover:rotate-12 transition-transform duration-300">
        {icon}
      </div>
      <span className="mt-2 text-[13px] font-medium text-gray-700 group-hover:text-blue-500 transition-colors text-center">
        {label}
      </span>
    </button>
  ))}
</section>

      {/* Spacer for fixed navbar */}
      <div className="h-[10px]"></div>



      {/* Category Filter */}
      <div className="sticky top-16  flex justify-center items-center w-full py-2">
        <div className="flex space-x-2 bg-white p-2 rounded-xl shadow-sm">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-1 text-sm rounded-full font-semibold transition-all duration-200 ${
                selected === cat
                  ? "bg-blue-500 text-white shadow-md"
                  : "border border-gray-300 text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="p-4 grid grid-cols-2 gap-4 max-w-md mx-auto">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            state={{ product }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="w-full h-32 bg-gray-100">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
              <div className="flex items-center mt-2">
                <img src="/coin.png" alt="coin" className="w-4 h-4 mr-1" />
                <span className="text-yellow-600 text-sm font-bold">{product.coin_price}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
    
  );
}

// Winner card component
function WinnerCard({ winner }) {
  return (
    <div className="bg-blue-500 shadow-lg rounded-2xl flex items-center justify-between p-4 w-[90%] max-w-md">
      <img src={winner.image} alt="winner" className="w-16 h-16 rounded-full object-cover" />
      <div className="ml-4">
        <h1 className="text-lg font-bold text-white">🎉 Congratulations!</h1>
        <h2 className="text-sm font-bold text-white">{winner.username}</h2>
      </div>
    </div>
  );
}

export default HomePage;
