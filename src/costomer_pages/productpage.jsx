import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaCoins } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

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
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col">
      {/* Back Button */}
      <header className="absolute top-4 left-4 z-10">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 p-3 rounded-full text-white shadow hover:bg-blue-700 transition"
        >
          <FaArrowLeft />
        </button>
      </header>

      {/* Product Image */}
      <div className="w-full h-[50vh] bg-white flex justify-center items-center shadow-md">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="mt-3 text-gray-600 text-base">{product.description}</p>

          <div className="mt-5 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <FaCoins className="text-gray-800" />
            Coins: {product.coin_price}
          </div>
        </div>

        {/* Buy Now Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/orderinfo", { state: { product } })}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition text-lg"
          >
            🚀 Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
