import React from "react";
import { motion } from "framer-motion";
import { MapPin, Instagram, Phone, Mail, ArrowRight } from "lucide-react";

const SellerGrid = () => {
  const sellers = [
    {
      _id: "677ad775714927feed7731bf",
      companyName: "Chakki Fresh Foods",
      description:
        "Premium quality fresh vegetables and fruits delivered to your doorstep. We source directly from local farmers.",
      category: "supermarket",
      profileImage:
        "https://res.cloudinary.com/dhed9kuow/image/upload/v1736103789/seller_images/wbg13swznsdbcp8ywtuy.png",
      contact: {
        phone: "+1234567890",
        instagram: "@chakkifresh",
        whatsapp: "+1234567890",
        email: "contact@chakkifresh.com",
      },
      location: {
        type: "Point",
        coordinates: [76.2673, 9.9312],
      },
      badge: "premium",
      verified: true,
      createdAt: new Date("2025-01-05T19:03:17.815Z"),
      updatedAt: new Date("2025-01-05T22:31:18.692Z"),
    },
    {
      _id: "677ad775714927feed7731c0",
      companyName: "Urban Grocers",
      description:
        "Your neighborhood grocery store with international products and local specialties.",
      category: "grocery",
      profileImage:
        "https://res.cloudinary.com/dhed9kuow/image/upload/v1736103789/seller_images/wbg13swznsdbcp8ywtuy.png",
      contact: {
        phone: "+1987654321",
        instagram: "@urbangrocers",
        whatsapp: "+1987654321",
        email: "hello@urbangrocers.com",
      },
      location: {
        type: "Point",
        coordinates: [76.2674, 9.9313],
      },
      badge: "basic",
      verified: false,
      createdAt: new Date("2025-01-05T20:03:17.815Z"),
      updatedAt: new Date("2025-01-05T23:31:18.692Z"),
    },
    {
      _id: "677ad775714927feed7731c1",
      companyName: "Fresh Mart Plus",
      description:
        "Organic produce and artisanal products from local producers. Supporting sustainable farming.",
      category: "supermarket",
      profileImage:
        "https://res.cloudinary.com/dhed9kuow/image/upload/v1736103789/seller_images/wbg13swznsdbcp8ywtuy.png",
      contact: {
        phone: "+1122334455",
        instagram: "@freshmartplus",
        whatsapp: "+1122334455",
        email: "info@freshmartplus.com",
      },
      location: {
        type: "Point",
        coordinates: [76.2675, 9.9314],
      },
      badge: "gold",
      verified: true,
      createdAt: new Date("2025-01-05T21:03:17.815Z"),
      updatedAt: new Date("2025-01-06T00:31:18.692Z"),
    },
    {
      _id: "677ad775714927feed7731bf",
      companyName: "Chakki Fresh Foods",
      description:
        "Premium quality fresh vegetables and fruits delivered to your doorstep. We source directly from local farmers.",
      category: "supermarket",
      profileImage:
        "https://res.cloudinary.com/dhed9kuow/image/upload/v1736103789/seller_images/wbg13swznsdbcp8ywtuy.png",
      contact: {
        phone: "+1234567890",
        instagram: "@chakkifresh",
        whatsapp: "+1234567890",
        email: "contact@chakkifresh.com",
      },
      location: {
        type: "Point",
        coordinates: [76.2673, 9.9312],
      },
      badge: "premium",
      verified: true,
      createdAt: new Date("2025-01-05T19:03:17.815Z"),
      updatedAt: new Date("2025-01-05T22:31:18.692Z"),
    },
    {
      _id: "677ad775714927feed7731c0",
      companyName: "Urban Grocers",
      description:
        "Your neighborhood grocery store with international products and local specialties.",
      category: "grocery",
      profileImage:
        "https://res.cloudinary.com/dhed9kuow/image/upload/v1736103789/seller_images/wbg13swznsdbcp8ywtuy.png",
      contact: {
        phone: "+1987654321",
        instagram: "@urbangrocers",
        whatsapp: "+1987654321",
        email: "hello@urbangrocers.com",
      },
      location: {
        type: "Point",
        coordinates: [76.2674, 9.9313],
      },
      badge: "basic",
      verified: false,
      createdAt: new Date("2025-01-05T20:03:17.815Z"),
      updatedAt: new Date("2025-01-05T23:31:18.692Z"),
    },
    {
      _id: "677ad775714927feed7731c1",
      companyName: "Fresh Mart Plus",
      description:
        "Organic produce and artisanal products from local producers. Supporting sustainable farming.",
      category: "supermarket",
      profileImage:
        "https://res.cloudinary.com/dhed9kuow/image/upload/v1736103789/seller_images/wbg13swznsdbcp8ywtuy.png",
      contact: {
        phone: "+1122334455",
        instagram: "@freshmartplus",
        whatsapp: "+1122334455",
        email: "info@freshmartplus.com",
      },
      location: {
        type: "Point",
        coordinates: [76.2675, 9.9314],
      },
      badge: "gold",
      verified: true,
      createdAt: new Date("2025-01-05T21:03:17.815Z"),
      updatedAt: new Date("2025-01-06T00:31:18.692Z"),
    },
    {
      _id: "677ad775714927feed7731bf",
      companyName: "Chakki Fresh Foods",
      description:
        "Premium quality fresh vegetables and fruits delivered to your doorstep. We source directly from local farmers.",
      category: "supermarket",
      profileImage:
        "https://res.cloudinary.com/dhed9kuow/image/upload/v1736103789/seller_images/wbg13swznsdbcp8ywtuy.png",
      contact: {
        phone: "+1234567890",
        instagram: "@chakkifresh",
        whatsapp: "+1234567890",
        email: "contact@chakkifresh.com",
      },
      location: {
        type: "Point",
        coordinates: [76.2673, 9.9312],
      },
      badge: "premium",
      verified: true,
      createdAt: new Date("2025-01-05T19:03:17.815Z"),
      updatedAt: new Date("2025-01-05T22:31:18.692Z"),
    },
  ];

  return (
    <div className="overflow-y-auto w-full p-6 bg-gray-100 rounded-xl shadow-lg">
      <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 p-6">
        {sellers.map((seller, index) => (
          <motion.div
            key={seller._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative h-48">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              <img
                src={seller.profileImage}
                alt={seller.companyName}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {seller.verified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <span className="w-2 h-2 bg-white rounded-full" />
                  Verified
                </motion.div>
              )}
              {seller.badge && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1 rounded-full capitalize shadow-lg">
                  {seller.badge}
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                {seller.companyName}
              </h3>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                <span className="capitalize">{seller.category}</span>
              </div>

              <div className="flex gap-4 mb-4">
                {seller.contact.instagram && (
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="cursor-pointer"
                  >
                    <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-500 transition-colors" />
                  </motion.div>
                )}
                {seller.contact.phone && (
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="cursor-pointer"
                  >
                    <Phone className="w-5 h-5 text-gray-400 hover:text-green-500 transition-colors" />
                  </motion.div>
                )}
                {seller.contact.email && (
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="cursor-pointer"
                  >
                    <Mail className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
                  </motion.div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
              >
                Know More
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SellerGrid;
