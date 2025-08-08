import React from "react";
import { useNavigate } from "react-router-dom";

export function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-lg mt-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-500 hover:underline flex items-center gap-1"
      >
        ← Back
      </button>

      {/* Title */}
      <h1 className="text-3xl font-extrabold text-blue-700 mb-4">
        Privacy Policy
      </h1>

      {/* Intro */}
      <p className="text-gray-700 mb-6 leading-relaxed">
        We value your privacy and are committed to keeping your personal
        information safe. This page explains what information we collect,
        why we collect it, and how it is used.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        1. Data Sharing Policy
      </h2>
      <p className="text-gray-700 mb-4">
        We do <strong>not</strong> share, sell, or trade your personal
        information with any third parties under any circumstances. Your data
        remains strictly confidential.
      </p>

      {/* Section 2 */}
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        2. Why We Ask for Your Telegram ID
      </h2>
      <p className="text-gray-700 mb-4">
        We request your <span className="font-semibold">Telegram ID</span> only
        so that we can send you instant notifications via our{" "}
        <span className="text-blue-600 font-semibold">Notification Bot</span>.
        These notifications may include:
      </p>
      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
        <li>Updates about your orders or winnings</li>
        <li>Important account alerts</li>
        <li>Exclusive event reminders</li>
      </ul>
      <p className="text-gray-700 mb-4">
        Your Telegram ID will <strong>never</strong> be used for advertising
        purposes or shared with anyone outside of our team.
      </p>

      {/* Section 3 */}
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        3. Data Storage & Security
      </h2>
      <p className="text-gray-700 mb-4">
        All your information is stored securely in our encrypted databases. We
        take technical and organizational measures to protect your data from
        unauthorized access.
      </p>

      {/* Section 4 */}
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        4. Your Rights
      </h2>
      <p className="text-gray-700 mb-4">
        You have the right to request a copy of your personal data, ask us to
        delete it, or update it at any time. To do so, please contact our
        support team.
      </p>

      {/* Last Updated */}
      <p className="text-sm text-gray-500 mt-6">
        Last Updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
