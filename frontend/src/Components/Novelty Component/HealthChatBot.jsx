import React, { useState } from "react";
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const HealthChatBot = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Tell me your symptoms and I'll help you." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.response || "Sorry, I couldn't understand." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error contacting server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 320, p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">AI Health Assistant</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ my: 1 }} />

        <Box flex={1} sx={{ overflowY: "auto", mb: 2 }}>
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                my: 1,
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: msg.sender === "user" ? "primary.main" : "grey.300",
                  color: msg.sender === "user" ? "white" : "black",
                  borderRadius: 2,
                  maxWidth: "80%",
                }}
              >
                {msg.text}
              </Box>
            </Box>
          ))}
        </Box>

        <Box>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your symptoms..."
            fullWidth
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSend}
            sx={{ mt: 1 }}
            disabled={loading || !input.trim()}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default HealthChatBot;