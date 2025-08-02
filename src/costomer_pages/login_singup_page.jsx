import { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FiMail, FiUser, FiLock, FiCode, FiSend } from "react-icons/fi";
import { SiTelegram } from "react-icons/si";

const API_BASE = import.meta.env.VITE_API_BASE_URL; // Change to your API base URL

export default function AuthFullPage() {
  const [mode, setMode] = useState("login"); // login | signup | forgot | verifySignup | verifyForgot | reset | done
  // Signup states
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [referralCode, setReferralCode] = useState("");
  // Verification & reset states
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- SIGN UP: request verification code ---
  const handleSignupRequestCode = async (e) => {
    e.preventDefault();
    if (!telegramChatId.trim()) return toast.error("Telegram Chat ID is required");
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/user/send-code`, { telegram_chat_id: telegramChatId.trim() });
      toast.success("Verification code sent to your Telegram");
      setMode("verifySignup");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  // --- SIGN UP: submit with verification code ---
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) return toast.error("Enter the verification code");
    if (!email.trim() || !username.trim() || !password || !telegramChatId.trim())
      return toast.error("All fields except referral code are required");

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/user/creat`, {
        email: email.trim(),
        username: username.trim(),
        password,
        telegram_chat_id: telegramChatId.trim(),
        verification_code: verificationCode.trim(),
        refaral_from: referralCode.trim() || undefined,
      });
      toast.success(res.data.message || "Registered successfully");
      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setMode("done");
        setTimeout(() => {
          if (res.data.user.type === "admin") window.location.href = "/path/admin-dashbord/winzy";
          else window.location.href = "/home";
        }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return toast.error("Email and password are required");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/user/login`, {
        email: email.trim(),
        password,
      });
      toast.success(res.data.message || "Login successful");
      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setTimeout(() => {
          if (res.data.user.type === "admin") window.location.href = "/path/admin-dashbord/winzy";
          else window.location.href = "/home";
        }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // --- FORGOT PASSWORD: send verification code (includes new password input) ---
  const handleForgotRequestCode = async (e) => {
    e.preventDefault();
    if (!telegramChatId.trim()) return toast.error("Telegram Chat ID is required");
    if (!newPassword) return toast.error("New password is required");

    setLoading(true);
    try {
      // send verification code to Telegram
      await axios.post(`${API_BASE}/api/user/send-code`, { telegram_chat_id: telegramChatId.trim() });
      toast.success("Verification code sent to your Telegram");
      setMode("verifyForgot");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  // --- VERIFY CODE for forgot password AND reset password ---
  const handleVerifyForgot = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) return toast.error("Enter verification code");
    if (!newPassword) return toast.error("New password is required");

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/user/reset-password`, {
        telegram_chat_id: telegramChatId.trim(),
        verification_code: verificationCode.trim(),
        new_password: newPassword,
      });
      toast.success(res.data.message || "Password reset successful");
      setMode("done");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  // --- UI render helpers ---
  const renderSignup = () => (
    <form onSubmit={handleSignupRequestCode} className="space-y-4">
      <div className="relative">
        <FiUser className="absolute left-3 top-3 text-blue-400" />
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="relative">
        <FiMail className="absolute left-3 top-3 text-blue-400" />
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="relative">
        <FiLock className="absolute left-3 top-3 text-blue-400" />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="relative">
        <SiTelegram className="absolute left-3 top-3 text-blue-400" />
        <input
          type="text"
          placeholder="Telegram Chat ID"
          value={telegramChatId}
          required
          onChange={(e) => setTelegramChatId(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="relative">
        <FiCode className="absolute left-3 top-3 text-blue-400" />
        <input
          type="text"
          placeholder="Referral Code (optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
      >
        {loading ? "Sending Code..." : "Get Verification Code 📩"}
      </button>
      <p className="text-center text-sm mt-3">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => setMode("login")}
          className="text-blue-600 hover:underline font-semibold"
        >
          Login
        </button>
      </p>
    </form>
  );

  const renderSignupVerify = () => (
    <form onSubmit={handleSignupSubmit} className="space-y-4">
      <div className="relative">
        <FiCode className="absolute left-3 top-3 text-blue-400" />
        <input
          type="text"
          placeholder="Verification Code"
          value={verificationCode}
          required
          onChange={(e) => setVerificationCode(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
      >
        {loading ? "Signing up..." : "Verify & Sign Up ✅"}
      </button>
      <p className="text-center text-sm mt-3">
        <button
          type="button"
          onClick={() => setMode("signup")}
          className="text-blue-600 hover:underline font-semibold"
        >
          Back
        </button>
      </p>
    </form>
  );

  const renderLogin = () => (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="relative">
        <FiMail className="absolute left-3 top-3 text-blue-400" />
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="relative">
        <FiLock className="absolute left-3 top-3 text-blue-400" />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
      >
        {loading ? "Logging in..." : "Login 🔐"}
      </button>
      <p className="text-center text-sm mt-3">
        <button
          type="button"
          onClick={() => setMode("forgot")}
          className="text-blue-600 hover:underline font-semibold"
        >
          Forgot Password?
        </button>
      </p>
      <p className="text-center text-sm mt-3">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => setMode("signup")}
          className="text-blue-600 hover:underline font-semibold"
        >
          Sign Up
        </button>
      </p>
    </form>
  );

  // UPDATED Forgot Password page with New Password input
  const renderForgot = () => (
    <form onSubmit={handleForgotRequestCode} className="space-y-4">
      <div className="relative">
        <SiTelegram className="absolute left-3 top-3 text-blue-400" />
        <input
          type="text"
          placeholder="Telegram Chat ID"
          value={telegramChatId}
          required
          onChange={(e) => setTelegramChatId(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="relative">
        <FiLock className="absolute left-3 top-3 text-blue-400" />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          required
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
      >
        {loading ? "Sending Code..." : "Send Verification Code 📩"}
      </button>
      <p className="text-center text-sm mt-3">
        <button
          type="button"
          onClick={() => setMode("login")}
          className="text-blue-600 hover:underline font-semibold"
        >
          Back to Login
        </button>
      </p>
    </form>
  );

  // UPDATED Verify Code for forgot password sends new password along with code and telegram id
  const renderVerifyForgot = () => (
    <form onSubmit={handleVerifyForgot} className="space-y-4">
      <div className="relative">
        <FiCode className="absolute left-3 top-3 text-blue-400" />
        <input
          type="text"
          placeholder="Verification Code"
          value={verificationCode}
          required
          onChange={(e) => setVerificationCode(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
      >
        {loading ? "Verifying..." : "Verify & Reset Password 🔑"}
      </button>
      <p className="text-center text-sm mt-3">
        <button
          type="button"
          onClick={() => setMode("forgot")}
          className="text-blue-600 hover:underline font-semibold"
        >
          Back
        </button>
      </p>
    </form>
  );

  const renderReset = () => (
    <div className="text-center py-8">
      <div className="text-4xl">🔄</div>
      <div className="mt-2 font-semibold">Resetting Password...</div>
    </div>
  );

  const renderDone = () => (
    <div className="text-center py-8">
      <div className="text-4xl">🎉</div>
      <div className="mt-2 font-semibold">Success!</div>
      <button
        onClick={() => setMode("login")}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Back to Login
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-blue-50">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          {mode === "login" && "Login"}
          {mode === "signup" && "Sign Up"}
          {mode === "verifySignup" && "Verify Sign Up"}
          {mode === "forgot" && "Forgot Password"}
          {mode === "verifyForgot" && "Verify Code"}
          {mode === "reset" && "Reset Password"}
          {mode === "done" && "Success"}
        </h1>

        {mode === "login" && renderLogin()}
        {mode === "signup" && renderSignup()}
        {mode === "verifySignup" && renderSignupVerify()}
        {mode === "forgot" && renderForgot()}
        {mode === "verifyForgot" && renderVerifyForgot()}
        {mode === "reset" && renderReset()}
        {mode === "done" && renderDone()}
      </div>
    </div>
  );
}
