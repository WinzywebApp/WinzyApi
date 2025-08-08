import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlus, FaPen, FaTrash, FaCoins } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE_URL; // fixed: removed trailing space

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
    quantaty: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const controllerRef = useRef(null);
  const didFetchRef = useRef(false); // fetch guard

  const fetchProducts = async () => {
    if (isFetching) return;
    setIsFetching(true);

    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token missing");

      const res = await axios.get(`${API_BASE}/api/product`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controllerRef.current.signal,
      });

      const productList = Array.isArray(res.data.products)
        ? res.data.products
        : Array.isArray(res.data.list)
        ? res.data.list
        : [];

      setProducts(productList);
    } catch (err) {
      const isCanceled =
        err?.name === "CanceledError" || err?.code === "ERR_CANCELED" || axios.isCancel?.(err);
      if (isCanceled) {
        // aborted, ignore
      } else {
        console.error("Fetch failed:", err?.response?.data || err?.message);
        setProducts([]);
        toast.error("❌ Failed to fetch products");
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (didFetchRef.current) return; // only once
    didFetchRef.current = true;
    fetchProducts();

    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, []);

  // debug: watch products updates (can remove later)
  useEffect(() => {
    console.log("Products state updated:", products);
  }, [products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (["coin_price", "main_price", "quantaty"].includes(name)) {
      val = value === "" ? "" : Number(value);
    }
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      coin_price: 0,
      main_price: 0,
      category: "tech",
      product_type: "a",
      quantaty: 0,
    });
    setEditId(null);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Token not found");

    if (!formData.name.trim() || !formData.description.trim()) {
      return toast.error("Name and Description are required");
    }

    try {
      if (editId) {
        const { product_id, ...payload } = formData;
        await axios.put(`${API_BASE}/api/product/edite/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("📝 Product updated");
      } else {
        await axios.post(`${API_BASE}/api/product/creat`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("🎁 Product added");
      }
      await fetchProducts();
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error("Submit error:", err?.response?.data || err?.message);
      const msg = err?.response?.data?.message || "Error submitting product";
      toast.error(`❌ ${msg}`);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || "",
      description: product.description || "",
      image: product.image || "",
      coin_price: product.coin_price || 0,
      main_price: product.main_price || 0,
      category: product.category || "tech",
      product_type: product.product_type || "a",
      quantaty: product.quantaty || 0,
      product_id: product.product_id,
    });
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
      await fetchProducts();
    } catch (err) {
      toast.error("❌ Delete failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-4">🎯 Admin Product Manager</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => {
          console.log("Rendering product:", product);
          return (
            <div
              key={product.product_id}
              className="relative group rounded-xl border bg-white shadow-lg hover:shadow-2xl transition duration-300"
            >
              <div className="overflow-hidden rounded-t-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="h-44 w-full object-cover group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("placeholder.com")) {
                      target.src = "https://via.placeholder.com/300x180?text=No+Image";
                    }
                  }}
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-lg text-gray-800 truncate">{product.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    📦 Type: <strong>{product.product_type}</strong>
                  </span>
                  <span>
                    📁 Cat: <strong>{product.category}</strong>
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>🔢 Quantity: {product.quantaty}</span>
                  <span className="flex items-center gap-1 text-yellow-600 font-semibold text-md mt-1">
                    <FaCoins /> {product.coin_price} 🪙 | Rs.{product.main_price}
                  </span>
                </div>
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-white p-2 rounded-full shadow hover:bg-blue-100"
                >
                  <FaPen className="text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(product.product_id)}
                  className="bg-white p-2 rounded-full shadow hover:bg-red-100"
                >
                  <FaTrash className="text-red-600" />
                </button>
              </div>
            </div>
          );
        })}
        {products.length === 0 && !isFetching && (
          <div className="col-span-full text-center text-gray-500 py-10">
            No products found. Add one using the + button.
          </div>
        )}
      </div>

      {/* Add Button */}
      <button
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow hover:bg-blue-700"
        aria-label="Add product"
      >
        <FaPlus />
      </button>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-semibold">{editId ? "🛠️ Edit Product" : "➕ Add Product"}</h3>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 border rounded"
            />
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 border rounded"
            />
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-2">
              <input
                name="coin_price"
                type="number"
                value={formData.coin_price}
                onChange={handleChange}
                placeholder="Coins"
                className="w-1/3 p-2 border rounded"
                min={0}
              />
              <input
                name="main_price"
                type="number"
                value={formData.main_price}
                onChange={handleChange}
                placeholder="Main Rs."
                className="w-1/3 p-2 border rounded"
                min={0}
              />
              <input
                name="quantaty"
                type="number"
                value={formData.quantaty}
                onChange={handleChange}
                placeholder="Quantity"
                className="w-1/3 p-2 border rounded"
                min={0}
              />
            </div>
            <div className="flex gap-2">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-1/2 p-2 border rounded"
              >
                <option value="tech">Tech</option>
                <option value="beauty">Beauty</option>
                <option value="perfume">Perfume</option>
              </select>
              <select
                name="product_type"
                value={formData.product_type}
                onChange={handleChange}
                className="w-1/2 p-2 border rounded"
              >
                <option value="a">A</option>
                <option value="b">B</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
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
