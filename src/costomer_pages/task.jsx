import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaYoutube,
  FaTelegram,
  FaFacebook,
  FaTiktok,
  FaCoins,
} from "react-icons/fa6";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// react-hot-toast import
import toast, { Toaster } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const getPlatformIcon = (icon) => {
  switch (icon) {
    case "youtube":
      return <FaYoutube className="text-red-600 text-2xl" />;
    case "tiktok":
      return <FaTiktok className="text-black text-2xl" />;
    case "telegram":
      return <FaTelegram className="text-blue-500 text-2xl" />;
    case "facebook":
      return <FaFacebook className="text-blue-600 text-2xl" />;
    default:
      return null;
  }
};

function TaskCard({ task, onComplete }) {
  const handleClick = async () => {
    try {
      await onComplete(task.task_id);
      window.open(task.link, "_blank", "noopener,noreferrer");
    } catch (e) {
      // error handling if needed
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-blue-100 rounded-2xl shadow-sm p-4 mb-3 cursor-pointer hover:shadow-md transition-all duration-150 flex items-center justify-between"
    >
      {/* Coin on LEFT */}
      <div className="flex items-center gap-1 text-gray-800 font-bold min-w-[70px] justify-start">
        <FaCoins className="text-lg" />
        <span>{task.point_balance}</span>
      </div>

      {/* Task Description CENTER */}
      <p className="text-sm font-medium text-gray-5000 flex-1 mx-4 text-center">
        {task.task_description}
      </p>

      {/* Icon on RIGHT */}
      <div className="min-w-[40px] flex justify-end">
        {getPlatformIcon(task.icon)}
      </div>
    </div>
  );
}

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [type, setType] = useState("daily task");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks(type);
  }, [type]);

  const fetchTasks = async (taskType) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE}/api/task/available/${taskType}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTasks(response.data.tasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
      toast.error("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (task_id) => {
    try {
      await axios.post(
        `${API_BASE}/api/task/complete`,
        { task_id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("✅ Task marked as completed!");
      fetchTasks(type);
    } catch (err) {
      console.error("Error completing task:", err);
      toast.error("❌ Error completing task");
    }
  };

  return (
    <div className="min-h-screen bg-blue-100">
      {/* React Hot Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <header className="w-full max-w-full bg-white px-4 py-3 shadow-sm sticky top-0 z-10 flex items-center justify-center relative rounded-b-2xl">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 p-2 rounded-full text-white absolute left-4"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-blue-700 text-center w-full">
          🎯 Tasks
        </h1>
      </header>

      {/* Main content */}
      <main className="p-4 max-w-xl mx-auto">
        {/* Task type tabs */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setType("daily task")}
            className={`px-4 py-2 rounded-full font-medium ${
              type === "daily task"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Daily Tasks
          </button>
          <button
            onClick={() => setType("new user task")}
            className={`px-4 py-2 rounded-full font-medium ${
              type === "new user task"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            New User Tasks
          </button>
        </div>

        {/* Task list */}
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No tasks available</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.task_id}
              task={task}
              onComplete={handleCompleteTask}
            />
          ))
        )}
      </main>
    </div>
  );
}
