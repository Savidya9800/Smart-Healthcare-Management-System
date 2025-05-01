import React from "react";
import { Fab } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

const ChatbotLauncher = ({ onOpen }) => {
  return (
    <Fab
      color="secondary"
      aria-label="chat"
      onClick={onOpen}
      style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}
    >
      <ChatIcon />
    </Fab>
  );
};

export default ChatbotLauncher;