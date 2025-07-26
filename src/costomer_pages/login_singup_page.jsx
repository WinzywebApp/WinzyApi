import { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [refaralFrom, setRefaralFrom] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isLogin) {
        response = await axios.post(`${API_BASE}/api/user/login`, {
          email,
          password,
        });
      } else {
        response = await axios.post(`${API_BASE}/api/user/creat`, {
          username,
          email,
          password,
          refaral_from: refaralFrom,
        });
      }

      const { token, user, message } = response.data;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success(message || "Success");

        setTimeout(() => {
          if (user.type === "admin") {
            window.location.href = "/path/admin-dashbord/winzy";
          } else {
            window.location.href = "/home";
          }
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login 🔐" : "Sign Up ✨"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Referral Code (optional)"
                value={refaralFrom}
                onChange={(e) => setRefaralFrom(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-500 font-medium"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-500 font-medium"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
