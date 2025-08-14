import { useState, useEffect } from "react";
import axios from "axios";
import { FaCoins, FaArrowLeft } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function SpinAndWin() {
  const navigate = useNavigate();
  const [number, setNumber] = useState("0000");
  const [coins, setCoins] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinsRemaining, setSpinsRemaining] = useState(5);

  // ✅ Load external ad script
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//pl27372407.profitableratecpm.com/a7/dd/7c/a7dd7c35c350fb13d330fffd5ed65314.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const animateNumber = (target) => {
    let current = 0;
    const interval = setInterval(() => {
      const rand = Math.floor(Math.random() * 10000);
      setNumber(String(rand).padStart(4, "0"));
      current += 1;
      if (current >= 20) {
        clearInterval(interval);
        setNumber(String(target).padStart(4, "0"));
      }
    }, 50);
  };

  const startSpin = async () => {
    if (isSpinning || spinsRemaining <= 0) return;
    setIsSpinning(true);
    setCoins(null);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first");
      setIsSpinning(false);
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE}/api/spin/spin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { number: finalNum, coins: wonCoins, spinsRemaining, message } =
        res.data;

      animateNumber(finalNum);
      setCoins(wonCoins);
      setSpinsRemaining(spinsRemaining);

      toast.success(message || `🎉 You won ${wonCoins} coins!`, {
        duration: 3000,
        style: {
          background: "#1e40af",
          color: "#fff",
          fontWeight: "bold",
        },
      });
    } catch (error) {
      setNumber("❌");
      toast.error(
        error.response?.data?.message || "Spin failed. Please try again.",
        {
          style: {
            background: "#b91c1c",
            color: "#fff",
            fontWeight: "bold",
          },
        }
      );
    }

    setIsSpinning(false);
  };

  const buyExtraSpins = () => {
    toast("🛍️ Buy Extra Spins coming soon!", {
      style: { background: "#065f46", color: "#fff" },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 pb-10">
      <Toaster position="top-center" />

      {/* ✅ New Styled Header */}
      <header className="w-full bg-white px-4 py-3 shadow-sm sticky top-0 z-10 flex items-center justify-center relative rounded-b-2xl">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 p-2 rounded-full text-white absolute left-4"
          aria-label="Go back"
        >
          <FaArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-semibold text-blue-700 text-center">
          🎯 Spin & Win
        </h1>
      </header>

      {/* 🎰 Centered Spinner Card */}
      <div className="flex justify-center mt-8 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm text-center">
          <p className="text-sm text-blue-500 mb-4">
            💬 Try your luck and win coins daily!
          </p>

          <div className="text-blue-600 text-6xl font-mono font-bold py-8 bg-blue-100 rounded-xl shadow-inner transition-all duration-300">
            {number}
          </div>

          <button
            onClick={startSpin}
            disabled={isSpinning || spinsRemaining <= 0}
            className={`mt-6 w-full py-3 font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
              isSpinning || spinsRemaining <= 0
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isSpinning ? "Spinning..." : "🎯 SPIN NOW"}
          </button>

          <div className="mt-3 text-sm text-gray-700">
            🌀 Spins Left:{" "}
            <span className="font-bold text-yellow-600">{spinsRemaining}/5</span>
          </div>

          <div className="mt-5 text-center">
            <button
              onClick={buyExtraSpins}
              disabled={isSpinning}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-md disabled:opacity-50"
            >
              💸 Buy Extra Spins – Rs.10
            </button>
          </div>
        </div>
      </div>

      {/* 📝 Coin Rules Display */}
      <div className="mt-8 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            📜 Coin Winning Rules
          </h2>
          <ul className="space-y-3 text-gray-700 text-sm">
            <li>
              🌀 <b>Daily Spins:</b> Maximum of 5 spins per day.
            </li>
            <li>
              ⏰ <b>Special Hours:</b> 00:00, 03:00, 06:00, 09:00, 12:00, 15:00
              → <span className="text-yellow-600 font-bold">300 coins</span>
            </li>
            <li>
              🏆 <b>Daily Winner:</b> Number <b>9999</b> →{" "}
              <span className="text-yellow-600 font-bold">500 coins</span>
            </li>
            <li>
              1 – 2000 → Random <b>0 – 100</b> coins (rounded to nearest 10)
            </li>
            <li>
              2500 – 4000 → Random <b>100 – 200</b> coins (rounded to nearest 10)
            </li>
            <li>
              4500 – 5000 → Random <b>200 – 550</b> coins (rounded to nearest 10)
            </li>
          </ul>
        </div>
      </div>

      {/* ✅ CPM Ad Placeholder */}
      <div className="mt-8 px-4">
        <div
          className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto text-center"
          id="profitableratecpm-ad"
        >
          📰 Your ad will appear here
        </div>
      </div>
    </div>
  );
}
