import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaShoppingCart,
  FaHeart,
  FaCoins,
  FaMoneyBillWave,
} from "react-icons/fa";

const API_BASE = "http://localhost:5000";

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);

  useEffect(() => {
    if (!product) {
      axios
        .get(`${API_BASE}/api/product/${id}`)
        .then((res) => {
          setProduct(res.data.product);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch product by ID", err);
          setLoading(false);
        });
    }
  }, [id, product]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!product) return <div className="text-center mt-10">Product not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between bg-white px-4 py-3 shadow-sm sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-xl p-2 rounded-full text-white transition"
>
          <FaArrowLeft />
        </button>
       
      </header>

      {/* Product Card */}
      <section className="bg-white rounded-2xl overflow-hidden shadow-md mt-4 mx-4">
        {/* Image */}
        <div className="bg-gray-100 flex justify-center items-center h-64">
          <img
            src={product.image}
            alt={product.name}
            className="h-full object-contain drop-shadow-lg"
          />
        </div>

        {/* Info */}
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {product.name}
            </h2>
            <FaHeart className="text-red-400 text-xl hover:scale-110 transition" />
          </div>
          <p className="text-gray-600 text-sm">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2 text-yellow-600 font-semibold">
              <FaCoins />
              Coins: {product.coin_price}
            </div>
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <FaMoneyBillWave />
              Rs. {product.main_price}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-4 py-6 bg-white">
        <button
          onClick={() => navigate("/orderinfo", { state: { product}})}
          className="w-full py-4 bg-blue-500  text-white font-semibold rounded-xl shadow-md hover:from-indigo-600 hover:to-blue-700 transition text-lg"
>
          🚀 Buy Now
        </button>
      </footer>
    </div>
);
};

export default ProductPage;