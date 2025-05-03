import React from "react";
import chatbotIcon from "../../assets/chatbot.png"; // Adjust if needed

const ChatbotLauncher = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="fixed z-50 p-0 bg-transparent border-none cursor-pointer bottom-5 right-5"
    >
      <img
        src={chatbotIcon}
        alt="chatbot"
        className="w-[12vw] max-w-[60px] min-w-[40px] animate-[shake_3s_infinite]"
      />
    </button>
  );
};

export default ChatbotLauncher;
