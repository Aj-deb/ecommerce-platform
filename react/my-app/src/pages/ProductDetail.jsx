// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

import Navbar from "../components/Navbar";
import fetchDetail from "../api/productdetail";
import {AddToCart} from "../api/cart.api";

const ProductDetail = () => {
  const { id } = useParams();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product-detail", id],
    queryFn: () => fetchDetail(id),
    enabled: !!id,
  });

  const product = data;

  const addItem = useMutation({
    mutationFn: AddToCart,
    onSuccess: () => {
      alert("Added to cart!");
    },
    onError: () => {
      alert("Failed to add item to cart");
    },
  });

  const handleAddToCart = () => {
    addItem.mutate({
      product_id: Number(id),
      quantity,
    });
  };

  useEffect(() => {
    if (product?.reviews) {
      setReviews(product.reviews);
    }
  }, [product]);

  if (isLoading) return <div className="p-10">Loading...</div>;
  if (isError || !product) return <div className="p-10">Product not found</div>;

  const {
    name,
    description,
    final_price,
    stock_quantity,
    images = [],
    sku,
    features = [],
    specifications = [],
    warranty,
    return_policy,
    url,
  } = product;

  const productImages =
    images.length > 0 ? images.map((img) => img.image_url) : [url];

  const inStock = stock_quantity > 0;

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const incrementQuantity = () => {
    if (quantity < stock_quantity) setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <ChevronRight size={14} />
          <span className="text-gray-800 font-medium truncate max-w-[220px]">
            {name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT */}
          <div className="space-y-4">
            <div
              className="relative bg-white p-4 rounded-2xl shadow-sm overflow-hidden cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <div className="relative h-[420px] overflow-hidden rounded-xl">
                <img
                  src={productImages[selectedImage] || "/placeholder.png"}
                  alt={name}
                  className={`w-full h-full object-contain transition-transform duration-200 ${
                    isZoomed ? "scale-150" : "scale-100"
                  }`}
                  style={
                    isZoomed
                      ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                      : {}
                  }
                />
              </div>

              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? productImages.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === productImages.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 ${
                    selectedImage === index ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={Number(avgRating) >= s ? "#f59e0b" : "none"}
                    stroke="#f59e0b"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({reviews.length} reviews)</span>
              <span className="text-sm text-gray-400">SKU: {sku}</span>
            </div>

            <div className="text-3xl font-bold text-gray-900">
              ${Number(final_price || 0).toFixed(2)}
            </div>

            <div className="flex items-center gap-2">
              {inStock ? (
                <>
                  <Check className="text-green-600" size={18} />
                  <span className="text-green-600 font-medium">
                    In Stock
                    {stock_quantity <= 15 && (
                      <span className="text-orange-500 ml-2">
                        (Only {stock_quantity} left)
                      </span>
                    )}
                  </span>
                </>
              ) : (
                <span className="text-red-500 font-medium">Out of Stock</span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">{description}</p>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-xl overflow-hidden">
                <button onClick={decrementQuantity} className="px-4 py-2 hover:bg-gray-100">
                  <Minus size={16} />
                </button>
                <span className="px-5 py-2 font-medium">{quantity}</span>
                <button onClick={incrementQuantity} className="px-4 py-2 hover:bg-gray-100">
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addItem.isPending || !inStock}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {addItem.isPending ? "Adding..." : "Add to Cart"}
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
                <ShieldCheck className="text-green-600 mt-0.5" size={18} />
                <div>
                  <p className="font-medium text-sm">Warranty</p>
                  <p className="text-xs text-gray-600">{warranty}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
                <RotateCcw className="text-blue-600 mt-0.5" size={18} />
                <div>
                  <p className="font-medium text-sm">Return Policy</p>
                  <p className="text-xs text-gray-600">{return_policy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex gap-6 border-b overflow-x-auto">
            {["description", "specifications", "features", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 capitalize font-medium border-b-2 transition ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === "description" && (
              <p className="text-gray-700 leading-relaxed">{description}</p>
            )}

            {activeTab === "specifications" && (
              <div className="border rounded-xl overflow-hidden">
                {specifications.length ? (
                  specifications.map((spec, index) => (
                    <div key={index} className="grid grid-cols-2 border-b last:border-b-0">
                      <div className="bg-gray-50 px-4 py-3 font-medium text-sm">
                        {spec.name}
                      </div>
                      <div className="px-4 py-3 text-sm text-gray-700">
                        {spec.value}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-gray-500">No specifications available.</p>
                )}
              </div>
            )}

            {activeTab === "features" && (
              <div className="space-y-3">
                {features.length ? (
                  features.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check size={16} className="text-green-600 mt-1" />
                      <p className="text-gray-700 text-sm">{item.feature}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No features available.</p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                {reviews.length ? (
                  reviews.map((review, index) => (
                    <div key={index} className="border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{review.author}</h4>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              fill={review.rating >= s ? "#f59e0b" : "none"}
                              stroke="#f59e0b"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="font-medium text-sm mb-1">{review.title}</p>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No reviews yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;