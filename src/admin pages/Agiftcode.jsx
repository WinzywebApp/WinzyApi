import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCoins, FaPen, FaTrash, FaPlus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import dotenv from "dotenv"
dotenv.config()
const API_BASE = process.env.API_BASE_URL;

const GiftCodePage = () => {
  const [giftCodes, setGiftCodes] = useState([]);
  const [editingGift, setEditingGift] = useState(null);
  const [newGift, setNewGift] = useState({ code: "", coins: "" });
  const [showForm, setShowForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };


  const API_URL = `${API_BASE}/api/redeem/gift`;

  useEffect(() => {
    fetchGiftCodes();
  }, []);

  const fetchGiftCodes = async () => {
    try {
      const res = await axios.get(API_URL, axiosConfig);
      setGiftCodes(res.data);
    } catch (err) {
      toast.error("❌ Failed to load gift codes");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, axiosConfig);
      toast.success("🗑️ Gift code deleted");
      await fetchGiftCodes();
    } catch (err) {
      toast.error("❌ Failed to delete");
    }
  };

  const handleEdit = (gift) => {
    setEditingGift(gift);
    setShowForm(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${API_URL}/${editingGift._id}`,
        {
          code: editingGift.code,
          coins: editingGift.coins,
        },
        axiosConfig
      );
      toast.success("✅ Gift code updated");
      setShowForm(false);
      setEditingGift(null);
      await fetchGiftCodes();
    } catch (err) {
      toast.error("❌ Failed to update");
    }
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/creat`,
        {
          code: newGift.code,
          coins: newGift.coins,
        },
        axiosConfig
      );
      toast.success(response.data.message || "Gift code created!");
      setShowAddForm(false);
      setNewGift({ code: "", coins: "" });
      await fetchGiftCodes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add gift code");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6 text-center text-emerald-700">
        🎁 Gift Code Manager
      </h1>

      {/* Gift codes grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 max-w-4xl mx-auto px-2">
        {giftCodes.map((gift) => (
          <div
            key={gift._id}
            className="bg-cyan-100 border border-blue-500 rounded-2xl p-5 relative shadow-md flex flex-col justify-between min-h-[130px]"
          >
            {/* Edit button top-right */}
            <button
              onClick={() => handleEdit(gift)}
              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-blue-100 transition"
              aria-label="Edit Gift Code"
            >
              <FaPen className="text-blue-600 w-5 h-5" />
            </button>

            {/* Gift info */}
            <div>
              <p className="text-xs font-semibold text-gray-600 truncate">
                ID: {gift._id}
              </p>
              <p className="text-xl font-bold text-emerald-800 truncate mt-1">
                Code: {gift.code}
              </p>
            </div>

            {/* Bottom row with coins and delete */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1 text-blue-700 font-semibold">
                <FaCoins className="w-5 h-5" />
                <span className="text-lg">{gift.coins}</span>
              </div>
              <button
                onClick={() => handleDelete(gift._id)}
                className="text-red-600 hover:text-red-800 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="Delete Gift Code"
              >
                <FaTrash className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form Modal */}
      {showForm && editingGift && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Gift Code</h2>
            <div className="mb-4">
              <label className="block text-black mb-1">Code</label>
              <input
                type="text"
                className="w-full border border-black p-2 rounded"
                value={editingGift.code}
                onChange={(e) =>
                  setEditingGift({ ...editingGift, code: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-black mb-1">Coins</label>
              <input
                type="number"
                className="w-full border border-black p-2 rounded"
                value={editingGift.coins}
                onChange={(e) =>
                  setEditingGift({ ...editingGift, coins: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingGift(null);
                }}
                className="btn btn-outline px-4 py-2 rounded border border-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
        aria-label="Add New Gift Code"
      >
        <FaPlus />
      </button>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add New Gift Code</h2>
            <div className="mb-4">
              <label className="block text-black mb-1">Code</label>
              <input
                type="text"
                className="w-full border border-black p-2 rounded"
                value={newGift.code}
                onChange={(e) => setNewGift({ ...newGift, code: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-black mb-1">Coins</label>
              <input
                type="number"
                className="w-full border border-black p-2 rounded"
                value={newGift.coins}
                onChange={(e) => setNewGift({ ...newGift, coins: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewGift({ code: "", coins: "" });
                }}
                className="btn btn-outline px-4 py-2 rounded border border-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftCodePage;
