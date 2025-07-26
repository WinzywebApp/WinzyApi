import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlus, FaPen, FaTrash, FaCoins } from "react-icons/fa";

import dotenv from "dotenv"
dotenv.config()
const API_BASE = process.env.API_BASE_URL;

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    coin_price: 0,
    main_price: 0,
    category: "tech",
    product_type: "a",
  });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/product`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else {
        console.error("❌ Products not in expected format:", res.data);
        setProducts([]);
      }
    } catch (err) {
      console.error("Fetch failed:", err.message);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Token not found");

    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      if (editId) {
        await axios.put(`${API_BASE}/api/product/update/${editId}`, formData, config);
        toast.success("📝 Product updated");
      } else {
        await axios.post(`${API_BASE}/api/product/creat`, formData, config);
        toast.success("🎁 Product added");
      }
      fetchProducts();
      setShowForm(false);
      setFormData({
        name: "", description: "", image: "", coin_price: 0, main_price: 0, category: "tech", product_type: "a"
      });
      setEditId(null);
    } catch (err) {
      toast.error("❌ Error submitting product");
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditId(product.product_id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Token not found");
    try {
      await axios.delete(`${API_BASE}/api/product/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("❌ Delete failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-4">🎯 Admin Product Manager</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.product_id} className="relative group rounded-xl border bg-white shadow-lg hover:shadow-2xl transition duration-300">
            <div className="overflow-hidden rounded-t-xl">
              <img src={product.image} alt={product.name} className="h-44 w-full object-cover group-hover:scale-105 transition duration-300" />
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-lg text-gray-800 truncate">{product.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
              <div className="flex justify-between text-sm text-gray-600">
                <span>📦 Type: <strong>{product.product_type}</strong></span>
                <span>📁 Cat: <strong>{product.category}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-yellow-600 font-semibold text-md mt-1">
                <FaCoins className="inline-block" /> {product.coin_price} 🪙 | Rs.{product.main_price}
              </div>
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <button onClick={() => handleEdit(product)} className="bg-white p-2 rounded-full shadow hover:bg-blue-100">
                <FaPen className="text-blue-600" />
              </button>
              <button onClick={() => handleDelete(product.product_id)} className="bg-white p-2 rounded-full shadow hover:bg-red-100">
                <FaTrash className="text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <button
        onClick={() => {
          setShowForm(true);
          setEditId(null);
          setFormData({
            name: "", description: "", image: "", coin_price: 0, main_price: 0, category: "tech", product_type: "a"
          });
        }}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow hover:bg-blue-700"
      >
        <FaPlus />
      </button>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-semibold">{editId ? "🛠️ Edit Product" : "➕ Add Product"}</h3>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" />
            <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
            <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="w-full p-2 border rounded" />
            <div className="flex gap-2">
              <input name="coin_price" type="number" value={formData.coin_price} onChange={handleChange} placeholder="Coins" className="w-1/2 p-2 border rounded" />
              <input name="main_price" type="number" value={formData.main_price} onChange={handleChange} placeholder="Main Rs." className="w-1/2 p-2 border rounded" />
            </div>
            <div className="flex gap-2">
              <select name="category" value={formData.category} onChange={handleChange} className="w-1/2 p-2 border rounded">
                <option value="tech">Tech</option>
                <option value="beauty">Beauty</option>
                <option value="perfume">Perfume</option>
              </select>
              <select name="product_type" value={formData.product_type} onChange={handleChange} className="w-1/2 p-2 border rounded">
                <option value="a">A</option>
                <option value="b">B</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductPage;
