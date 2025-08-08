import React from "react";
import { useNavigate } from "react-router-dom";

export function TermsConditionsPage() {
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
        Terms & Conditions
      </h1>

      {/* Intro */}
      <p className="text-gray-700 mb-6 leading-relaxed">
        By using this website, you agree to the following terms and conditions.
        Please read them carefully before placing orders or participating in any
        activities on our platform.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        1. Wallet Balance Requirements
      </h2>
      <p className="text-gray-700 mb-4">
        To place an order through our website, you must have a{" "}
        <strong>sufficient coin balance</strong> in your wallet. Without the
        required balance, you will not be able to complete your purchase.
      </p>

      {/* Section 2 */}
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        2. Wallet Top-Up Instructions
      </h2>
      <p className="text-gray-700 mb-4">
        When topping up your wallet, please use <strong>only</strong> the
        account numbers provided by us. Do <strong>not</strong> send funds to
        any other account numbers. We are <strong>not responsible</strong> for
        any losses or issues caused by sending money to incorrect accounts.
      </p>

      {/* Section 3 */}
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        3. Betting Process
      </h2>
      <p className="text-gray-700 mb-4">
        When you place a bet, it is similar to purchasing a ticket for the
        selected product. Once the bet time ends, a{" "}
        <span className="font-semibold">random winner</span> will be selected
        through our website and displayed publicly.
      </p>

      {/* Section 4 */}
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        4. Order Delivery
      </h2>
      <p className="text-gray-700 mb-4">
        All winning orders will be processed and delivered promptly to the
        respective winners.
      </p>

      {/* Disclaimer */}
      <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300 mt-6">
        <p className="text-yellow-800 text-sm">
          ⚠️ We reserve the right to modify these terms at any time. Please
          check this page regularly for updates.
        </p>
      </div>

      {/* Last Updated */}
      <p className="text-sm text-gray-500 mt-6">
        Last Updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
