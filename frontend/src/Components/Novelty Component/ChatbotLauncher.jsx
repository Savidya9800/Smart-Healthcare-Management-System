import React, { useState, useEffect } from "react";
import chatbotIcon from "../../assets/chatbot.png";

const ChatbotLauncher = ({ onOpen }) => {
  const [showHint, setShowHint] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  // Occasionally remind users they can ask health questions
  useEffect(() => {
    // Show hint after 30 seconds of page load
    const hintTimer = setTimeout(() => {
      setShowHint(true);
      // Hide hint after 5 seconds
      setTimeout(() => setShowHint(false), 5000);
    }, 30000);

    // Pulse animation every 2 minutes to grab attention
    const pulseInterval = setInterval(() => {
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 3000);
    }, 120000);

    return () => {
      clearTimeout(hintTimer);
      clearInterval(pulseInterval);
    };
  }, []);

  return (
    <div className="fixed z-50 flex flex-col items-end bottom-5 right-5">
      {showHint && (
        <div className="bg-white text-blue-600 p-3 rounded-lg shadow-lg mb-2 max-w-[200px] text-sm animate-fadeIn">
          Ask me about heart attack symptoms or gastritis treatments!
        </div>
      )}
      
      <button
        onClick={onOpen}
        className="relative p-0 bg-transparent border-none cursor-pointer"
        aria-label="Open health assistant chatbot"
      >
        <img
          src={chatbotIcon}
          alt="AI Health Assistant"
          className={`w-[12vw] max-w-[60px] min-w-[40px] ${
            pulseAnimation 
              ? "animate-[pulse_0.5s_3]" 
              : "animate-[shake_3s_infinite]"
          }`}
        />
      </button>
    </div>
  );
};

export default ChatbotLauncher;