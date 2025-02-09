import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, ShoppingCart } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import AddProduct from "./AddProduct";

// Modal component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const ProductsGrid = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sellerData = useSelector((state) => state.seller.sellerData);
  const sellerId = sellerData._id;
  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/product/seller/${sellerId}`);
      setProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle add product success
  const handleAddProductSuccess = () => {
    setIsModalOpen(false);
    fetchProducts(); // Refresh products list
  };

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        await axios.delete(`${API_URL}/product/${productId}`);
        setProducts(products.filter((product) => product._id !== productId));
      } catch (err) {
        setError("Failed to delete product");
        console.error("Error deleting product:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !products.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#049b83]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError("")}
            className="absolute top-0 right-0 px-4 py-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Add Product Card */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="bg-white p-4 rounded-lg shadow-md border-2 border-dashed border-[#049b83] flex flex-col items-center justify-center cursor-pointer hover:border-[#038671] transition-colors min-h-[300px]"
        >
          <PlusCircle className="w-12 h-12 text-[#049b83] mb-3" />
          <p className="text-[#049b83] font-medium text-center">
            Add New Product
          </p>
          <p className="text-sm text-gray-500 mt-2 text-center">
            List your products for sale
          </p>
        </div>

        {/* Product Cards */}
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative">
              <img
                src={product.productImage}
                alt={product.productName}
                className="w-full h-48 object-cover"
              />
              {product.quantity === 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                  Out of Stock
                </div>
              )}
              <button
                onClick={() => handleDeleteProduct(product._id)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-500 hover:text-white transition-colors"
                disabled={loading}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2">
              <h3 className="font-medium text-lg">{product.productName}</h3>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-lg">₹{product.price}</span>
                <span className="text-sm text-gray-500">
                  Stock: {product.quantity}
                </span>
              </div>
              <button
                className={`w-full py-2 px-4 rounded-md flex items-center justify-center space-x-2 ${
                  product.quantity > 0
                    ? "bg-[#049b83] text-white hover:bg-[#038671]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={product.quantity === 0}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>
                  {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddProduct onSuccess={handleAddProductSuccess} />
      </Modal>
    </div>
  );
};

export default ProductsGrid;
