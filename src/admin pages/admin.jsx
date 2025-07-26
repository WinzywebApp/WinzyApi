import React, { useState } from "react";
import {
  HiGift,
  HiCube,
  HiCurrencyDollar,
  HiLightBulb,
  HiClipboardList,
  HiCash,
} from "react-icons/hi";
import GiftCodes from "../admin pages/Agiftcode.jsx";
import Products from "../admin pages/Aproduct.jsx";
import BetItems from "../admin pages/Abetitem.jsx";
import EmojiQuestions from "../admin pages/Aquiz.jsx";
import Tasks from "../admin pages/Atask.jsx";
import Wallet from "../admin pages/wallet.jsx";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("gift");

  const pages = {
    gift: <GiftCodes />,
    product: <Products />,
    bet: <BetItems />,
    emoji: <EmojiQuestions />,
    task: <Tasks />,
    wallet: <Wallet />,
  };

  const navItems = [
    { key: "gift", label: "Gift Codes", icon: <HiGift className="text-2xl" /> },
    { key: "product", label: "Products", icon: <HiCube className="text-2xl" /> },
    { key: "bet", label: "Bet Items", icon: <HiCurrencyDollar className="text-2xl" /> },
    { key: "emoji", label: "Emoji Quiz", icon: <HiLightBulb className="text-2xl" /> },
    { key: "task", label: "Tasks", icon: <HiClipboardList className="text-2xl" /> },
    { key: "wallet", label: "Wallet", icon: <HiCash className="text-2xl" /> },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Scrollable Top Nav */}
      <nav className="h-[20vh] bg-white shadow-md flex overflow-x-auto no-scrollbar border-b">
        <div className="flex flex-nowrap items-center px-4 space-x-4 w-max">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActivePage(item.key)}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl min-w-[100px] transition-all duration-200 ${
                activePage === item.key
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span className="text-sm mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Page Content */}
      <main className="h-[80vh] overflow-y-auto p-4 bg-gray-50">
        {pages[activePage]}
      </main>
    </div>
  );
};

export default AdminDashboard;
