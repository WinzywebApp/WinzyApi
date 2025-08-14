import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { MonitorPlay, CheckCircle, Clock } from "lucide-react";
import { FaCoins, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const MAX_ADS_PER_DAY = 20;

export default function WatchAdsPage() {
  const [adsWatched, setAdsWatched] = useState(0);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load external ad script
    const script = document.createElement("script");
    script.src = "//pl27372407.profitableratecpm.com/a7/dd/7c/a7dd7c35c350fb13d330fffd5ed65314.js";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    fetchAdStats();
  }, []);

  const fetchAdStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/ads/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdsWatched(res.data.adsWatchedToday);
    } catch (err) {
      toast.error("Failed to fetch ad stats");
    }
  };

  const handleAdClick = async (idx, e) => {
    e.preventDefault();
    if (idx < adsWatched || countdown || loadingIndex !== null) return;

    try {
      const token = localStorage.getItem("token");
      setLoadingIndex(idx);
      toast.loading("Loading Ad... ⏳");

      // Show Monetag rewarded interstitial ad
      if (typeof show_9683609 === "function") {
        show_9683609().then(async () => {
          toast.dismiss();
          toast.success("Ad watched! Coins will be added in ");
          startCountdown(idx);

          try {
            await axios.post(
              `${API_BASE}/api/ads/watchAd`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } catch (err) {
            console.error("Failed to update backend", err);
          }
        });
      } else {
        toast.dismiss();
        toast.error("Ad failed to load");
        setLoadingIndex(null);
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Error watching ad");
      setLoadingIndex(null);
    }
  };

  const startCountdown = (idx) => {
    let seconds = 2;
    setCountdown(seconds);

    const interval = setInterval(() => {
      seconds--;
      setCountdown(seconds);

      if (seconds <= 0) {
        clearInterval(interval);
        toast.success("Coins added!");
        setCountdown(null);
        setAdsWatched((prev) => prev + 1);
        setLoadingIndex(null);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="w-full bg-white px-4 py-3 shadow-sm sticky top-0 z-10 flex items-center justify-center relative rounded-b-2xl">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 p-2 rounded-full text-white absolute left-4"
          aria-label="Go back"
        >
          <FaArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-semibold text-blue-700 text-center">
          🎥 Watch & Earn
        </h1>
      </header>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-blue-200 mt-6">
        <p className="text-center text-gray-600 mb-6">
          Watch up to{" "}
          <span className="font-semibold text-blue-600">{MAX_ADS_PER_DAY}</span>{" "}
          ads per day to earn coins.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: MAX_ADS_PER_DAY }).map((_, idx) => {
            const isWatched = idx < adsWatched;
            const isCurrent = idx === loadingIndex;
            const isWaiting = idx === loadingIndex && countdown !== null;

            return (
              <a
                key={idx}
                href="#"
                onClick={(e) => handleAdClick(idx, e)}
                className={`flex flex-col items-center justify-center h-24 rounded-2xl border-2 transition-all shadow-sm hover:shadow-md
                  ${
                    isWatched
                      ? "border-blue-500 bg-blue-100 text-blue-700 cursor-not-allowed opacity-60"
                      : isCurrent
                      ? "border-yellow-500 bg-yellow-50 text-yellow-800 animate-pulse"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-blue-50 hover:border-blue-300"
                  }`}
              >
                {isWatched ? (
                  <CheckCircle className="w-6 h-6 mb-1" />
                ) : isCurrent ? (
                  <Clock className="w-6 h-6 mb-1" />
                ) : (
                  <MonitorPlay className="w-6 h-6 mb-1" />
                )}
                <span className="text-xs font-medium">
                  {isWaiting
                    ? `⌛ Waiting... ${countdown}s`
                    : `Ad ${idx + 1}`}
                </span>

                <div className="flex items-center text-yellow-600 text-sm mt-1">
                  <FaCoins className="w-4 h-4 mr-1" />
                  <span className="font-semibold">150</span>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          {MAX_ADS_PER_DAY - adsWatched} ads remaining today
        </div>
      </div>
    </div>
  );
}
