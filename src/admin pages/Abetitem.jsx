import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCoins, FaPen, FaTrash, FaPlus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const emptyForm = {
  name: "",
  description: "",
  image: "",
  coin_price: 0,
  main_price: 0,
  bet_start: "",
  bet_end: "",
};

const BetItemPage = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState(emptyForm);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/bets-item/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const formatted = res.data.map((item) => ({
        ...item,
        bet_start: new Date(item.start_time).toISOString().slice(0, 16),
        bet_end: new Date(item.end_time).toISOString().slice(0, 16),
      }));
      setItems(formatted);
    } catch {
      toast.error("❌ Failed to load bet items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSubmit = async () => {
    if (
      !newItem.name ||
      !newItem.description ||
      !newItem.image ||
      !newItem.bet_start ||
      !newItem.bet_end
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await axios.post(
        `${API_BASE}/api/bets-item/creat`,
        {
          name: newItem.name,
          description: newItem.description,
          image: newItem.image,
          coin_price: newItem.coin_price,
          main_price: newItem.main_price,
          start_time: newItem.bet_start,
          end_time: newItem.bet_end,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("🎯 Bet item created");
      setShowAddForm(false);
      setNewItem(emptyForm);
      fetchItems();
    } catch {
      toast.error("❌ Failed to create bet item");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm delete this bet item?")) return;
    try {
      await axios.delete(`${API_BASE}/api/bets-item/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("🗑️ Bet item deleted");
      fetchItems();
    } catch {
      toast.error("❌ Failed to delete bet item");
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setShowEditForm(true);
  };

  const handleUpdate = async () => {
    if (
      !editingItem.name ||
      !editingItem.description ||
      !editingItem.image ||
      !editingItem.bet_start ||
      !editingItem.bet_end
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await axios.put(
        `${API_BASE}/api/bets-item/${editingItem._id}`,
        {
          name: editingItem.name,
          description: editingItem.description,
          image: editingItem.image,
          coin_price: editingItem.coin_price,
          main_price: editingItem.main_price,
          start_time: editingItem.bet_start,
          end_time: editingItem.bet_end,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("✅ Bet item updated");
      setShowEditForm(false);
      setEditingItem(null);
      fetchItems();
    } catch {
      toast.error("❌ Failed to update bet item");
    }
  };

  return (
    <div className="p-4">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">🎲 Bet Items</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <FaPlus /> Add Item
        </button>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <ModalForm
          item={newItem}
          setItem={setNewItem}
          onClose={() => {
            setNewItem(emptyForm);
            setShowAddForm(false);
          }}
          onSubmit={handleSubmit}
          title="Add New Bet Item"
        />
      )}

      {/* Edit Form Modal */}
      {showEditForm && editingItem && (
        <ModalForm
          item={editingItem}
          setItem={setEditingItem}
          onClose={() => {
            setShowEditForm(false);
            setEditingItem(null);
          }}
          onSubmit={handleUpdate}
          title="Edit Bet Item"
        />
      )}

      {/* List */}
      <div className="grid sm:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <p className="text-center text-gray-500">No bet items found.</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-xl shadow space-y-2">
              <div className="flex gap-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover" />
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm mt-1">
                    <FaCoins className="inline text-yellow-500" /> {item.coin_price} | 💰 LKR {item.main_price}
                  </p>
                  <p className="text-xs text-gray-500">
                    Start: {new Date(item.start_time).toLocaleString()}<br />
                    End: {new Date(item.end_time).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEditClick(item)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
                >
                  <FaPen className="inline" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                >
                  <FaTrash className="inline" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ModalForm = ({ item, setItem, onClose, onSubmit, title }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
    <div className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-auto">
      <h2 className="text-lg font-semibold mb-6">{title}</h2>
      {["name", "image", "description", "coin_price", "main_price", "bet_start", "bet_end"].map((field) => (
        <div key={field} className="mb-4">
          <label className="block mb-1 capitalize text-sm">{field.replace("_", " ")}</label>
          {field === "description" ? (
            <textarea
              name={field}
              value={item[field]}
              onChange={(e) => setItem({ ...item, [field]: e.target.value })}
              className="w-full border p-2 rounded text-sm"
              rows={3}
            />
          ) : (
            <input
              type={field.includes("price") ? "number" : field.includes("bet") ? "datetime-local" : "text"}
              name={field}
              value={item[field]}
              onChange={(e) => setItem({ ...item, [field]: e.target.value })}
              className="w-full border p-2 rounded text-sm"
            />
          )}
        </div>
      ))}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 border rounded text-sm">
          Cancel
        </button>
        <button onClick={onSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded text-sm">
          Save
        </button>
      </div>
    </div>
  </div>
);

export default BetItemPage;
