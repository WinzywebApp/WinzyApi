import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { ChevronLeft, Send, CheckCircle, AlertCircle, Timer, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import dotenv from "dotenv"
dotenv.config()
const API_BASE = process.env.API_BASE_URL;

export default function EmojiQuizApp() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedbackColor, setFeedbackColor] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [attemptsRemaining, setAttemptsRemaining] = useState(10);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const total = questions.length;
  const currentQ = questions[currentIdx] || {};

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/question/emoji-next`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load quiz questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (!questions.length) return;
    clearInterval(timerRef.current);
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentIdx, questions.length]);

  const handleSubmit = async () => {
    if (!userAnswer.trim()) return;

    const token = localStorage.getItem("token");
    const answerPayload = {
      question_id: currentQ.question_id,
      answer: userAnswer.trim(),
    };

    try {
      const res = await axios.post(
        `${API_BASE}/api/question/emoji-answer`,
        answerPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { correct, reward, coin_balance, attempts_remaining } = res.data;
      setAttemptsRemaining(attempts_remaining);

      if (correct) {
        toast.success(
          <>
            <CheckCircle className="inline mr-1" size={20} /> Correct! +{reward} coins <br />
            🪙 Balance: {coin_balance} <br />
            ⏳ Attempts left: {attempts_remaining} / 10
          </>
        );
      } else {
        toast.error(
          <>
            <AlertCircle className="inline mr-1" size={20} /> Wrong answer <br />
            ⏳ Attempts left: {attempts_remaining} / 10
          </>
        );
      }

      setFeedbackColor(correct ? "green-500" : "red-500");

      setTimeout(() => {
        setFeedbackColor("");
        setUserAnswer("");
        if (currentIdx + 1 < total && attempts_remaining > 0) {
          setCurrentIdx(currentIdx + 1);
        } else {
          clearInterval(timerRef.current);
          toast("🎉 Quiz completed!", { icon: "✅" });
        }
      }, 1000);
    } catch (error) {
      toast.error("Something went wrong while submitting your answer.");
    }
  };


  if (loading) {
    return <div className="p-6 text-center text-blue-600">Loading quiz…</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Toaster position="top-center" />

      {/* ✅ Beautiful Header */}
      <header className="w-full bg-white px-4 py-3 shadow-sm sticky top-0 z-10 flex items-center justify-center relative rounded-b-2xl">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 p-2 rounded-full text-white absolute left-4"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-blue-700 text-center">
          🎯 Emoji Quiz
        </h1>
      </header>

      {/* Main White Box */}
      <div className="flex-1 flex flex-col items-center justify-start bg-white px-4 pt-6">
        {/* Top Center Title */}
        <p className="text-blue-800 font-semibold text-center text-md mb-4">
          Test your knowledge!
        </p>

        {/* Emoji Quiz Box */}
        <div className="w-full max-w-md bg-blue-100 border-2 border-blue-500 rounded-2xl p-6 shadow space-y-4">
          <div className="text-5xl h-24 flex items-center justify-center text-blue-900 font-bold">
            {currentQ.emoji_clue || "❓"}
          </div>
          <div className="flex items-center justify-center text-blue-800 gap-2 text-sm">
            <Timer size={16} /> {timeLeft}s left
          </div>
        </div>

        {/* Hint */}
        <p className="text-sm text-blue-600 mt-3 italic">
          Hint: {currentQ.hint || "No hint available"}
        </p>

        {/* Input & Submit Buttons */}
        <div className="w-full max-w-md mt-6 space-y-4">
          <input
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className={`w-full p-3 text-lg text-center border rounded-xl transition 
              ${
                feedbackColor
                  ? `border-${feedbackColor} ring-2 ring-${feedbackColor}`
                  : "border-blue-300 focus:ring-2 focus:ring-blue-400"
              }`}
          />
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition"
          >
            <Send size={18} /> Submit
          </button>
        </div>
      </div>
    </div>
  );
}
