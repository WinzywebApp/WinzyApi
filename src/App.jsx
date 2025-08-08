import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../src/costomer_pages/home-page.jsx";
import AuthPage from "../src/costomer_pages/login_singup_page.jsx";
import './App.css';
import { Toaster } from "react-hot-toast";
import AccountPage from "./costomer_pages/account_info.jsx";
import ProductPage from "./costomer_pages/productpage.jsx";
import OrderInfoPage from "./costomer_pages/oderinfopage.jsx";
import GiftCodePage from "./costomer_pages/giftcode.jsx";
import SpinAndWin from "./costomer_pages/spinpage.jsx";
import QuestionPage from "./costomer_pages/questionpage.jsx";
import Plans from "./costomer_pages/plans.jsx"
import Animation from "./costomer_pages/giftt.jsx"
import WatchAdsPage from "./costomer_pages/ads.jsx";
import TaskPage from "./costomer_pages/task.jsx";
import BetItemsGrid from "./costomer_pages/bets.jsx";
import BetPage from "./costomer_pages/betinfo.jsx";
import AdminDashboard from "./admin pages/admin.jsx";
import UserWalletHistoryPage from "./costomer_pages/wallethostory.jsx";
import  {ContactPage } from "./menu/contact.jsx"
import {PrivacyPolicyPage } from "./menu/privasy_police.jsx"
import{TermsConditionsPage} from "./menu/terms&conditions.jsx"



function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Toaster position="top-center" /> 
       
        <Routes>
          <Route path="/*" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/orderinfo" element={<OrderInfoPage />} />
          <Route path="/redeem" element={<GiftCodePage />} />
          <Route path="/spin" element={<SpinAndWin/>} />
           <Route path="/quize" element={<QuestionPage/>} />
           <Route path="/plans" element={<Plans/>} />
           <Route path="/animation" element={<Animation/>}/>
           <Route path="/watch" element={<WatchAdsPage/>}/>
           <Route path="/task" element={<TaskPage/>}/>
           <Route path="/bet-item" element={<BetItemsGrid/>}/>
           <Route path="/bet" element={<BetPage/>}/>
           <Route path="/wallet/history" element={<UserWalletHistoryPage/>}/>
           <Route path="/path/admin-dashbord/winzy" element={<AdminDashboard/>}/>
           <Route path="/contact" element={<ContactPage />} />
           <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
           <Route path="/terms-conditions" element={<TermsConditionsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
