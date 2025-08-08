import React from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export function ContactPage() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Web3Forms Access Key (replace with .env for production)
    formData.append("access_key", "175b5a08-bc28-435a-92df-c3d7211d67bd");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      toast.success("✅ Message sent successfully!");
      form.reset();
    } else {
      toast.error("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6">
      <Toaster position="top-right" />
      
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-8 border border-gray-100">
        
        {/* Back Link */}
        <Link
          to="/home"
          className="mb-4 text-blue-500 hover:underline inline-flex items-center gap-1"
        >
          ← Back
        </Link>

        {/* Title */}
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
          Contact Us
        </h1>
        <p className="text-gray-600 mb-6">
          Got a question or feedback? Fill out the form below and we’ll get back to you as soon as possible.
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Name</label>
            <input
              name="name"
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              placeholder="Your Name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Message</label>
            <textarea
              name="message"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              rows="5"
              placeholder="Write your message here..."
              required
            ></textarea>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition shadow-md"
          >
            Send Message ✉️
          </button>
        </form>
      </div>
    </div>
  );
}
