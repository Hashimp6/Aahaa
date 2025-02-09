import React, { useEffect, useState } from "react";
import {
  Instagram,
  WhatsApp,
  Call,
  Email,
  Settings,
} from "@mui/icons-material";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Mail, Phone, ShoppingCart } from "lucide-react";
import ShareProfileButton from "./ShareProfileButton";
import NavComponent from "./Nav";

const SellerProfile = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const location = useLocation();
  const [sellerData, setSellerData] = useState(location.state?.sellerData || null);
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const response = await axios.get(`${API_URL}/sellers/seller/${id}`);
        setSellerData(response.data);
      } catch (error) {
        console.error("Error fetching seller data:", error);
        setError(error.response?.data?.message || "Error fetching seller data");
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/post/seller/${id}`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(error.response?.data?.message || "Error fetching posts");
      }
    };
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/product/seller/${id}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.response?.data?.message || "Error fetching posts");
      }
    };
    const fetchStories = async () => {
      try {
        const response = await axios.get(`${API_URL}/stories/seller/${id}`);
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      // If we don't have sellerData from location state, fetch it
      if (!sellerData) {
        await fetchSellerData();
      }
      await Promise.all([fetchPosts(),fetchProducts(), fetchStories()]);
      setLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id, API_URL, sellerData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!sellerData) return <p>No seller data available</p>;

  return (
    <div className=" bg-gray-100">
      <NavComponent/>
      {/* Mobile Layout */}
      <div className="md:hidden">
        <MobileSellerProfileLayout
          sellerData={sellerData}
          posts={posts}
          stories={stories}
          products={products}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex w-screen  overflow-hidden">
        {/* Left Side - Profile Section */}
        <div className="w-1/4 border-r border-gray-300 bg-white  ">
          <div className="flex flex-col bg-white shadow-lg rounded-xl  h-full">
            {/* Header with Profile */}
            <div className="relative mb-6">
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-teal-500 to-teal-600  " />

              <div className="relative flex flex-col items-center">
                <div className="absolute top-4 right-4">
                  <ShareProfileButton sellerData={sellerData} />
                </div>
                <img
                  src={sellerData.profileImage}
                  alt="Profile"
                  className="rounded-full w-28 h-28 border-4 border-white shadow-md object-cover mt-4"
                />
                <h1 className="text-xl font-bold text-gray-800 mt-3">
                  {sellerData.companyName}
                </h1>
                <p className="text-base text-teal-600 font-medium">
                  {sellerData.category}
                </p>
                <p className="text-sm text-gray-600 text-center mt-2 max-w-sm">
                  {sellerData.description}
                </p>
              </div>
            </div>

            {/* Contact Links */}
            <div className="space-y-3 p-2">
              <h2 className="text-base font-semibold text-gray-800 mb-3">
                Contact Information
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={sellerData.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl text-white text-sm hover:opacity-90 transition-all hover:shadow-md"
                  style={{
                    background:
                      "linear-gradient(45deg, #f09433, #e6683c 75%, #dc2743)",
                  }}
                >
                  <Instagram className="w-5 h-5" />
                  <span className="font-medium">Instagram</span>
                </a>
                <a
                  href={sellerData.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-green-500 text-white text-sm hover:opacity-90 transition-all hover:shadow-md"
                >
                  <WhatsApp className="w-5 h-5" />
                  <span className="font-medium">WhatsApp</span>
                </a>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${sellerData.contact.phone}`}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-teal-500 text-white text-sm hover:opacity-90 transition-all hover:shadow-md"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Call</span>
                </a>
                <a
                  href={`mailto:${sellerData.contact.email}`}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-teal-600 text-white text-sm hover:opacity-90 transition-all hover:shadow-md"
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Scrollable Section */}
        <div className="w-3/4 p-4 overflow-y-auto bg-white">
          {/* Stories Section */}
          <StoriesSection stories={stories} />

          {/* Tabs */}
          <TabSection activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Content Section */}
          <ContentSection
            activeTab={activeTab}
            posts={posts}
            products={products}
          />
        </div>
      </div>
    </div>
  );
};

const renderContactLink = (href, icon, text, bgClass) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`text-white ${bgClass} px-4 py-2 rounded-lg flex items-center gap-2 w-full justify-center`}
  >
    {icon} {text}
  </a>
);

const StoriesSection = ({ stories }) => (
  <div className="overflow-x-auto pl-2 scrollbar-hide">
    <div className="flex space-x-4 py-4">
      {stories.map((story) => (
        <div key={story.id} className="flex-shrink-0">
          <div className="w-32 h-32 rounded-lg overflow-hidden ring-2 ring-[#049b83] p-0.5 bg-white relative">
            <img
              src={story.media}
              alt={story.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <p className="text-white text-sm truncate">{story.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TabSection = ({ activeTab, setActiveTab }) => (
  <div className="flex space-x-4 border-b mb-6">
    {["posts", "products"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`${
          activeTab === tab
            ? "text-[#049b83] border-b-2 border-[#049b83]"
            : "text-gray-500"
        } px-4 py-2 capitalize`}
      >
        {tab}
      </button>
    ))}
  </div>
);

const ContentSection = ({ activeTab, posts, products }) => {
  const renderGrid = (items, type) => (
    <div
      className={`grid ${
        type === "posts" ? "grid-cols-5" : "grid-cols-2"
      } gap-4`}
    >
      {items.length > 0 ? (
        items.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={type === "posts" ? item.media : item.image}
              alt={type === "posts" ? "Post" : item.name}
              className="w-full h-40 object-cover rounded-lg"
            />
            <p className="mt-2 text-sm text-gray-600">
              {type === "posts" ? item.description : item.description}
            </p>
          </div>
        ))
      ) : (
        <p>No {type} available.</p>
      )}
    </div>
  );

  return (
    <div>
      {activeTab === "posts" && renderGrid(posts, "posts")}
      {activeTab === "products" && renderGrid(products, "products")}
    </div>
  );
};

const MobileSellerProfileLayout = ({ sellerData, posts, stories,products }) => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="bg-white">
      {/* Mobile Profile Header */}
      <div className="flex items-centerit justify-between p-4">
        <div className="flex items-center space-x-4">
          <img
            src={sellerData.profileImage}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-xl font-bold">{sellerData.companyName}</h1>
            <p className="text-sm text-gray-600">{sellerData.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
    <ShareProfileButton sellerData={sellerData} />
   
  </div>
      </div>

      {/* Social Media Links */}
      <div className="flex justify-around p-4 border-b">
        {[
          {
            link: sellerData.contact.instagram,
            icon: <Instagram className="w-6 h-6 text-[#049b83]" />,
          },
          {
            link: `https://wa.me/${sellerData.contact.whatsapp}`,
            icon: <WhatsApp className="w-6 h-6 text-[#049b83]" />,
          },
          {
            link: `tel:${sellerData.contact.phone}`,
            icon: <Call className="w-6 h-6 text-[#049b83]" />,
          },
          {
            link: `mailto:${sellerData.contact.email}`,
            icon: <Email className="w-6 h-6 text-[#049b83]" />,
          },
        ].map(({ link, icon }, index) => (
          <a key={index} href={link} target="_blank" rel="noopener noreferrer">
            {icon}
          </a>
        ))}
      </div>

      {/* Stories Section */}
      <StoriesSection stories={stories} />

      {/* Tabs */}
      <TabSection activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content Section */}
      {/* Content Section */}
<div className="p-4">
  {activeTab === "posts" && (
    <div className="grid grid-cols-3 gap-2">
      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map((post) => (
          <img
            key={post._id}
            src={post.media}
            alt="Post"
            className="w-full aspect-square object-cover"
          />
        ))
      ) : (
        <p className="col-span-3 text-center text-gray-500">No posts available</p>
      )}
    </div>
  )}

  {activeTab === "products" && (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {products && Array.isArray(products) && products.length > 0 ? (
        products.map((product) => (
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
        ))
      ) : (
        <p className="col-span-2 text-center text-gray-500">No products available</p>
      )}
    </div>
  )}
</div>
    </div>
  );
};

export default SellerProfile;
