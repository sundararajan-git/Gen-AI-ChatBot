import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../store/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import api from "../../lib/axios.js";

const chat = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [messages, setMessages] = useState(defaultMsg);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chat/ask", { question: userMsg.text });
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.answer,
          logId: data.logsId,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I encountered an error." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (logId, rating) => {
    try {
      await api.post("/chat/feedback", { logId, rating });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{ mt: 4, height: "90vh", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Onboarding Chatbot</Typography>
        <Box>
          {user?.role === "admin" && (
            <IconButton onClick={() => navigate("/admin")} color="primary">
              <AdminPanelSettingsIcon />
            </IconButton>
          )}
          <IconButton onClick={logout} color="secondary">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          mb: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  bgcolor: msg.sender === "user" ? "primary.main" : "grey.200",
                  color: msg.sender === "user" ? "white" : "black",
                  maxWidth: "70%",
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {msg.text}
                </Typography>
                {msg.sender === "bot" && msg.logId && (
                  <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleFeedback(msg.logId, "thumbs_up")}
                    >
                      <ThumbUpIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleFeedback(msg.logId, "thumbs_down")}
                    >
                      <ThumbDownIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Paper>
            </ListItem>
          ))}
          {loading && (
            <Typography variant="caption" sx={{ ml: 2 }}>
              Typing...
            </Typography>
          )}
          <div ref={scrollRef} />
        </List>
      </Paper>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button variant="contained" endIcon={<SendIcon />} onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Container>
  );
};
export default chat;

const defaultMsg = [
  {
    sender: "bot",
    text: "Hello! I am your onboarding assistant. Ask me anything about company policies or tools.",
  },
];
