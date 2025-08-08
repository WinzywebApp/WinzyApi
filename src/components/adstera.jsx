// src/components/AdsterraAd.jsx
import { useEffect } from "react";

const AdsterraAd = () => {
  useEffect(() => {
    // Script එක DOM එකට dynamically inject කරන්න
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//pl27372407.profitableratecpm.com/a7/dd/7c/a7dd7c35c350fb13d330fffd5ed65314.js";
    script.async = true;

    document.body.appendChild(script);

    // Clean-up on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // UI element එකක් display කරන්න අවශ්‍ය නැහැ
};

export default AdsterraAd;
