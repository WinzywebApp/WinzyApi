import React, { useState } from "react";
import { FaGift, FaTasks, FaBoxOpen, FaPuzzlePiece, FaDice } from "react-icons/fa";
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
    wallet:<Wallet/>
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Menu (20%) */}
      <nav className="h-[20vh] bg-blue-500 flex items-center justify-around text-white text-sm sm:text-base font-semibold shadow-md">
        <button onClick={() => setActivePage("gift")} className="flex flex-col items-center">
          <FaGift className="text-2xl" /> Gift Codes
        </button>
        <button onClick={() => setActivePage("product")} className="flex flex-col items-center">
          <FaBoxOpen className="text-2xl" /> Products
        </button>
        <button onClick={() => setActivePage("bet")} className="flex flex-col items-center">
          <FaDice className="text-2xl" /> Bet Items
        </button>
        <button onClick={() => setActivePage("emoji")} className="flex flex-col items-center">
          <FaPuzzlePiece className="text-2xl" /> Emoji Quiz
        </button>
        <button onClick={() => setActivePage("task")} className="flex flex-col items-center">
          <FaTasks className="text-2xl" /> Tasks
        </button>
         <button onClick={() => setActivePage("Wallet")} className="flex flex-col items-center">
          <FaTasks className="text-2xl" /> Wallet
        </button>
      </nav>

      {/* Page Content (80%) */}
      <main className="h-[80vh] overflow-y-auto p-4 bg-gray-50">
        {pages[activePage]}
      </main>
    </div>
  );
};

export default AdminDashboard;
