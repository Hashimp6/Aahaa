import React, { useState } from "react";
import { Flame, Navigation, Heart, Settings } from "lucide-react";

const SidebarComponent = () => {
  const [activeButton, setActiveButton] = useState("trending");

  const menuItems = [
    { id: "trending", icon: Flame, label: "Trending" },
    { id: "nearby", icon: Navigation, label: "Nearby" },
    { id: "favorites", icon: Heart, label: "Favorites" },
  ];

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#049b83] via-black to-[#049b83]">
      {/* Left Sidebar with Trapezium Shape */}
      <div
        className="relative w-24 h-full bg-gradient-to-b from-[#049b83]/90 via-black/90 to-[#049b83]/90 shadow-xl flex flex-col justify-between items-center py-8"
        style={{
          clipPath: "polygon(0% 0%, 100% 5%, 100% 95%, 0% 100%)",
        }}
      >
        {/* Empty top space */}
        <div className="h-24"></div>

        {/* Menu Items */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group ${
                  activeButton === item.id
                    ? "bg-[#049b83] text-white"
                    : "text-white/60 hover:bg-white/10"
                }`}
                onClick={() => handleButtonClick(item.id)}
              >
                <Icon size={24} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Button */}
        <button className="w-16 h-16 rounded-xl flex flex-col items-center justify-center gap-2 mb-14 text-white/60 hover:bg-white/10 transition-all duration-300">
          <Settings size={24} />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarComponent;
