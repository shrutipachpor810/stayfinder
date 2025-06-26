import React, { useState, useRef } from "react";
import {
  Box,
  IconButton,
  TextField,
  Paper,
  Typography,
  Tooltip,
  CircularProgress
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import MicIcon from "@mui/icons-material/Mic";
import DescriptionIcon from "@mui/icons-material/Description";
import jsPDF from "jspdf";
import API from "../api";
import { parseItineraryText } from "../utils/parseItinerary";

// Voice recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

const FloatingChatbot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const handleVoiceInput = () => {
    if (!recognition) return alert("Speech Recognition not supported.");
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage((prev) => prev + " " + transcript);
    };

    recognition.onerror = (err) => {
      console.error("Voice error:", err);
    };
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    setMessages((prev) => [...prev, { sender: "user", text: message }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await API.post("/gemini/chat", {
        message,
        userId,
      });

      let botReply = res.data.reply || "Sorry, I didn’t get that.";

      if (botReply.toLowerCase().includes("day 1")) {
        const parsed = parseItineraryText(botReply);
        botReply = parsed
          .map(
            (day) =>
              `${day.title}\n` +
              day.activities.map((act) => `• ${act}`).join("\n")
          )
          .join("\n\n");
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Failed to get response." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Poppins");
    doc.setFontSize(12);
    messages.forEach((msg, i) => {
      const label = msg.sender === "user" ? "You:" : "AI:";
      doc.text(`${label} ${msg.text}`, 10, 10 + i * 10);
    });
    doc.save("chat_history.pdf");
  };

  return (
    <Box fontFamily="'Poppins', sans-serif">
      {!open && (
        <Tooltip title="Trip Planner AI">
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              background: "linear-gradient(135deg, #ec407a, #8e24aa)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #d81b60, #6a1b9a)"
              },
              zIndex: 1300,
            }}
          >
            <SmartToyIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      )}

      {open && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 80,
            right: 20,
            width: 360,
            height: 500,
            display: "flex",
            flexDirection: "column",
            zIndex: 1300,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 1.5,
              background: "linear-gradient(135deg, #ec407a, #8e24aa)",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Trip Planner AI
            </Typography>
            <Box>
              <Tooltip title="Download chat as PDF">
                <IconButton size="small" onClick={exportToPDF} sx={{ color: "white" }}>
                  <DescriptionIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <IconButton onClick={() => setOpen(false)} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Messages */}
          <Box
            ref={chatRef}
            sx={{
              flex: 1,
              p: 1,
              overflowY: "auto",
              bgcolor: "#f8f8f8",
            }}
          >
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  mb: 1,
                  textAlign: msg.sender === "user" ? "right" : "left",
                }}
              >
                <Typography
                  sx={{
                    display: "inline-block",
                    px: 1.5,
                    py: 0.8,
                    borderRadius: 2,
                    bgcolor: msg.sender === "user" ? "#fce4ec" : "#e8f5e9",
                    maxWidth: "80%",
                    whiteSpace: "pre-wrap",
                    fontSize: "0.9rem",
                    color: "#000",
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            ))}
            {loading && (
              <Typography variant="body2" color="text.secondary">
                Typing...
              </Typography>
            )}
          </Box>

          {/* Input */}
          <Box
            sx={{
              p: 1,
              borderTop: "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <IconButton onClick={handleVoiceInput} sx={{ color: "#ec407a" }}>
              <MicIcon />
            </IconButton>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Ask your travel query..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              sx={{
                fontFamily: "'Poppins', sans-serif",
                input: { fontSize: "0.9rem" },
              }}
            />
            <IconButton onClick={handleSend} disabled={loading} sx={{ color: "#ec407a" }}>
              {loading ? <CircularProgress size={20} /> : <SendIcon />}
            </IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default FloatingChatbot;
