import React, { useState } from "react";
import { Star, MessageCircle, ShoppingCart } from "lucide-react";

const RightSideComponent = () => {
  const [activeTab, setActiveTab] = useState("posts");
  
  const stories = [
    {
      id: 1,
      username: "Dom_Hill",
      image: "../../public/puffs.png",
      title: "Adventure Time",
    },
    {
      id: 2,
      username: "John_Kelson",
      image: "../../public/puffs.png",
      title: "Road Trip",
    },
    {
      id: 3,
      username: "Sarah_Wave",
      image: "../../public/puffs.png",
      title: "Beach Day",
    },
    {
      id: 4,
      username: "Mike_Adventure",
      image: "../../public/puffs.png",
      title: "Mountain View",
    },
    {
      id: 5,
      username: "Travel_Pro",
      image: "../../public/puffs.png",
      title: "City Lights",
    }
  ];

  const posts = [
    {
      id: 1,
      image: "../../public/puffs.png",
      description: "Amazing sunset view from the mountain top!",
      rating: 4.5,
      username: "John_Kelson",
      comments: 38,
    },
    {
      id: 2,
      image: "../../public/puffs.png",
      description: "Perfect weekend getaway at the beach",
      rating: 5,
      username: "Dom_Hill",
      comments: 45,
    },
    {
      id: 3,
      image: "../../public/puffs.png",
      description: "Desert adventures are the best",
      rating: 4,
      username: "Travel_Pro",
      comments: 29,
    }
  ];

  const products = [
    {
      id: 1,
      name: "Adventure Backpack",
      image: "../../public/puffs.png",
      price: 89.99,
      rating: 4.8,
      description: "Perfect for all your travel needs",
      inStock: true
    },
    {
      id: 2,
      name: "Travel Camera",
      image: "../../public/puffs.png",
      price: 599.99,
      rating: 4.9,
      description: "Capture your memories in high quality",
      inStock: true
    },
    {
      id: 3,
      name: "Hiking Boots",
      image: "../../public/puffs.png",
      price: 149.99,
      rating: 4.7,
      description: "Comfortable and durable for any terrain",
      inStock: false
    },
    {
      id: 4,
      name: "Camping Tent",
      image: "../../public/puffs.png",
      price: 299.99,
      rating: 4.6,
      description: "Spacious 4-person tent for outdoor adventures",
      inStock: true
    }
  ];

  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < fullStars
                ? "text-yellow-400 fill-yellow-400"
                : index === fullStars && hasHalfStar
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Stories Section */}
      <div className="mb-8 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 py-4">
          {stories.map((story) => (
            <div key={story.id} className="flex-shrink-0">
              <div className="w-40 h-40 rounded-lg overflow-hidden ring-2 ring-purple-500 p-0.5 bg-white relative">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-sm truncate">{story.username}</p>
                  <p className="text-white/80 text-xs truncate">{story.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 font-medium ${
            activeTab === "posts"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 font-medium ${
            activeTab === "products"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Products
        </button>
      </div>

      {/* Posts Grid */}
      {activeTab === "posts" && (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="break-inside-avoid mb-6 bg-white rounded-lg shadow-md"
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <RatingStars rating={post.rating} />
                    <span className="ml-1">{post.rating}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span>{post.comments} comments</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{post.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {activeTab === "products" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {!product.inStock && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                    Out of Stock
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <div className="flex items-center justify-between mb-2">
                  <RatingStars rating={product.rating} />
                  <span className="font-bold text-lg">${product.price}</span>
                </div>
                <button
                  className={`w-full py-2 px-4 rounded-md flex items-center justify-center space-x-2 ${
                    product.inStock
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RightSideComponent;