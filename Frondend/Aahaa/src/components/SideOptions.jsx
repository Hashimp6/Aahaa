import React, { useState } from "react";
import { Flame, Navigation, Heart, Settings } from "lucide-react";

const SidebarComponent = () => {
  const [activeButton, setActiveButton] = useState("trending");

  const menuItems = [
    { id: "trending", icon: Flame, label: "Trending" },
    { id: "nearby", icon: Navigation, label: "Nearby" },
    { id: "favorites", icon: Heart, label: "Favorites" },
    { id: "settings", icon: Settings, label: "Settings" }
  ];

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex min-h-screen">
        <div
          className="relative w-24 h-full bg-gradient-to-b from-[#049b83]/90 via-black/90 to-[#049b83]/90 shadow-xl flex flex-col justify-between items-center py-8 overflow-hidden"
          style={{
            clipPath: "polygon(0% 0%, 100% 5%, 100% 95%, 0% 100%)",
          }}
        >
          <div className="h-24"></div>
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 overflow-y-auto scrollbar-hide">
            {menuItems.slice(0, -1).map((item) => {
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
          <button className="w-16 h-16 rounded-xl flex flex-col items-center justify-center gap-2 mb-14 text-white/60 hover:bg-white/10 transition-all duration-300">
            <Settings size={24} />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#049b83]/90 via-black/90 to-[#049b83]/90 p-2 z-50">
        <div className="flex justify-around items-center overflow-x-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`p-2 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
                  activeButton === item.id
                    ? "bg-[#049b83] text-white"
                    : "text-white/60"
                }`}
                onClick={() => handleButtonClick(item.id)}
              >
                <Icon size={20} />
                <span className="text-xs font-medium mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SidebarComponent;