import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../store/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Box,
  Typography,
  ListItem,
  IconButton,
  Avatar,
  CircularProgress,
  Drawer,
  useMediaQuery,
  useTheme,
  Chip
} from "@mui/material";
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from "../../lib/axios.js";

const chat = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
	fetchHistory();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loading]);


  const fetchHistory = async () => {
	try {
	  const { data } = await api.get("/chat/history");
      const history = data.reverse().flatMap((chat) => [
        { sender: "user", text: chat.question },
        { sender: "bot", text: chat.answer, logId: chat._id, rating: chat.feedback, suggestions: chat.suggestions },
      ]);
	  setMessages(history.length ? history : []);
	} catch (error) {
	  console.error("Failed to fetch history:", error);
      setMessages([]);
	}
  };

  const handleSend = async (textOverride) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : input;
    if (!textToSend.trim()) return;

    const userMsg = { sender: "user", text: textToSend };
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
          suggestions: data.suggestions 
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
      setMessages((prev) =>
        prev.map((msg) =>
          msg.logId === logId ? { ...msg, rating } : msg
        )
      );
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const SidebarContent = (
      <Box sx={{ height: '100%', bgcolor: '#000', color: '#ececf1', display: 'flex', flexDirection: 'column', px: 1, pt: 3 }}>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, px: 2 }}>
              <Avatar sx={{ bgcolor: '#fff', color: '#000', width: 36, height: 36 }}>
                   <AutoAwesomeIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', fontSize: '1.2rem' }}>
                  GenAI
              </Typography>
          </Box>
          
          <Box sx={{ flex: 1, overflowY: 'auto' , mt:1 }}>
               {messages.length > 0 && (
                  <ListItem 
                    button 
                    sx={{ 
                        borderRadius: 0.5, 
                        px: 2,
                        py: 1.5,
                        mb: 0.5,
                        bgcolor: '#111',
                        border: 'none',
                        '&:hover': { bgcolor: '#222' },
                        transition: 'all 0.2s',
                        cursor:"pointer",
                    }}
                  >
                      <Typography variant="body2" noWrap sx={{ color: '#ececf1', fontSize: '0.9rem', fontWeight: 500 }}>
                          {messages[0].text.substring(0, 25) || 'Current Chat'}
                      </Typography>
                  </ListItem>
               )}
          </Box>

          <Box sx={{ pb: 2 }}>
              {user?.role === 'admin' && (
                   <ListItem 
                        button 
                        onClick={() => navigate('/admin')} 
                        sx={{ 
                            borderRadius: 0.5, 
                            bgcolor: 'transparent',
                            border: 'none',
                            color: '#999',
                            '&:hover': { 
                                bgcolor: '#111', 
                                color: '#fff'
                            },
                            p: 1.5, 
                            mb: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            transition: 'all 0.2s',
                            cursor:"pointer",
                        }}
                    >
                         <AdminPanelSettingsIcon sx={{ fontSize: 20, color: 'inherit' }} />
                         <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 500, fontSize: '0.9rem' }}>
                             Admin Dashboard
                         </Typography>
                   </ListItem>
              )}
               
               <Box 
                    sx={{ 
                        borderRadius: 0.5,
                        p: 1.5, 
                        border: 'none',
                        cursor:"pointer",
                        bgcolor: 'transparent',
                        transition: 'all 0.2s',
                        '&:hover': {
                            bgcolor: '#111',
                        }
                    }}
               >
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0 }}>
                       <Avatar sx={{ width: 32, height: 32, bgcolor: '#333', color: '#fff', fontSize: '0.9rem' }}>
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                       </Avatar>
                       <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>
                                {user?.username || 'User'}
                            </Typography>
                            <Typography 
                                    variant="caption" 
                                    onClick={logout}
                                    sx={{ 
                                        color: '#ef4444', 
                                        cursor: 'pointer', 
                                        '&:hover': { color: '#ff6666', textDecoration: 'underline' },
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        display: 'block',
                                        mt: 0
                                    }}
                            >
                                Sign out
                            </Typography>
                       </Box>
                   </Box>
               </Box>
          </Box>
      </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#000', color: '#fff' }}>

        {isMobile && (
             <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, height: 50, bgcolor: '#000', zIndex: 1100, display: 'flex', alignItems: 'center', px: 1, borderBottom: '1px solid #333' }}>
                 <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
                     <MenuIcon />
                 </IconButton>
                 <Typography sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 600 }}>GenAI</Typography>
                 <IconButton onClick={() => setMessages([])} sx={{ color: '#fff' }}>
                     <AddIcon />
                 </IconButton>
             </Box>
        )}


      <Box
        component="nav"
        sx={{ width: { md: 260 }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
             <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, bgcolor: '#000', color: '#fff', borderRight: 'none', borderRadius: 0 },
                }}
             >
                 {SidebarContent}
             </Drawer>
        ) : (
            <Drawer
                variant="permanent"
                sx={{
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, bgcolor: '#000', color: '#fff', borderRight: 'none', borderRadius: 0 },
                }}
                open
            >
                {SidebarContent}
            </Drawer>
        )}
      </Box>


      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#111', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
          
          <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pt: isMobile ? 8 : 4, pb: 20 }}>
              {messages.length === 0 ? (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
                       <Avatar sx={{ bgcolor: '#fff', color: '#000', width: 40, height: 40 }}>
                           <AutoAwesomeIcon sx={{ fontSize: 24 }} />
                       </Avatar>
                       <Typography variant="h5" sx={{ fontWeight: 600 }}>How can I help you today?</Typography>
                  </Box>
              ) : (
                  <Container maxWidth="md">
                      {messages.map((msg, index) => (
                          <Box key={index} sx={{ mb: 4, display: 'flex', gap: 2, flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                               <Avatar 
                                    sx={{ 
                                        width: 28, height: 28, 
                                        bgcolor: msg.sender === 'bot' ? 'transparent' : '#fff',
                                        border: msg.sender === 'bot' ? '1px solid #fff' : 'none',
                                        color: msg.sender === 'bot' ? '#fff' : '#000'
                                    }}
                               >
                                    {msg.sender === 'bot' ? <AutoAwesomeIcon sx={{ fontSize: 16 }} /> : <PersonIcon sx={{ fontSize: 18 }} />}
                               </Avatar>
                               
                               <Box sx={{ maxWidth: '85%' }}>
                                    <Box 
                                        sx={{ 
                                            lineHeight: 1.6, 
                                            color: '#fff', 
                                            fontWeight: 400,
                                            fontSize: '1rem',
                                            bgcolor: msg.sender === 'user' ? '#1e1e1e' : 'transparent',
                                            borderRadius: 2,
                                            px: msg.sender === 'user' ? 2 : 0,
                                            py: msg.sender === 'user' ? 1 : 0,
                                            '& p': { m: 0 },
                                            '& p + p': { mt: 1 },
                                            '& ul, & ol': { pl: 3, my: 1 },
                                            '& li': { mb: 0.5 },
                                            '& pre': { 
                                                bgcolor: '#0d0d0d', 
                                                p: 2, 
                                                borderRadius: 2, 
                                                overflowX: 'auto', 
                                                my: 2, 
                                                border: '1px solid #333' 
                                            },
                                            '& code': { 
                                                fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace', 
                                                fontSize: '0.875rem', 
                                                bgcolor: 'rgba(255,255,255,0.1)', 
                                                px: 0.6, 
                                                py: 0.1, 
                                                borderRadius: 0.5 
                                            },
                                            '& pre code': { 
                                                bgcolor: 'transparent', 
                                                p: 0, 
                                                color: '#f8f8f2',
                                                fontSize: '0.875rem'
                                            },
                                            '& a': { color: '#60a5fa', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
                                            '& table': { width: '100%', borderCollapse: 'collapse', my: 2, fontSize: '0.9rem' },
                                            '& th, & td': { border: '1px solid #333', p: 1.5, textAlign: 'left' },
                                            '& th': { bgcolor: '#1a1a1a', fontWeight: 600 },
                                            '& h1, & h2, & h3, & h4, & h5, & h6': { fontWeight: 600, mt: 3, mb: 1, lineHeight: 1.3 },
                                            '& h1': { fontSize: '1.5rem' },
                                            '& h2': { fontSize: '1.25rem' },
                                            '& h3': { fontSize: '1.1rem' },
                                            '& blockquote': { borderLeft: '4px solid #444', m: 0, pl: 2, color: '#aaa', fontStyle: 'italic' }

                                        }}
                                    >
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.text}
                                        </ReactMarkdown>
                                    </Box>
                                    
                                    {msg.sender === 'bot' && msg.logId && (
                                         <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                             <IconButton size="small" onClick={() => handleFeedback(msg.logId, 'thumbs_up')} sx={{ color: msg.rating === 'thumbs_up' ? '#fff' : '#666' }}>
                                                 <ThumbUpOutlinedIcon fontSize="small" />
                                             </IconButton>
                                             <IconButton size="small" onClick={() => handleFeedback(msg.logId, 'thumbs_down')} sx={{ color: msg.rating === 'thumbs_down' ? '#fff' : '#666' }}>
                                                 <ThumbDownOutlinedIcon fontSize="small"  />
                                             </IconButton>
                                         </Box>
                                    )}

                                    {msg.suggestions && msg.suggestions.length > 0 && (
                                        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {msg.suggestions.map((suggestion, i) => (
                                                <Chip 
                                                    key={i} 
                                                    label={suggestion} 
                                                    onClick={() => {
                                                        handleSend(suggestion);
                                                    }} 
                                                    sx={{ 
                                                        bgcolor: '#2c2c2c', 
                                                        color: '#e0e0e0',
                                                        border: '1px solid #444',
                                                        cursor: 'pointer',
                                                        '&:hover': { bgcolor: '#3c3c3c', borderColor: '#666' }
                                                    }} 
                                                />
                                            ))}
                                        </Box>
                                    )}
                               </Box>
                          </Box>
                      ))}
                      {loading && (
                           <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                               <Avatar 
                                    sx={{ 
                                        width: 28, height: 28, 
                                        bgcolor: 'transparent',
                                        border: '1px solid #fff',
                                        color: '#fff'
                                    }}
                               >
                                    <AutoAwesomeIcon sx={{ fontSize: 16 }} />
                               </Avatar>
                               <Box sx={{ 
                                   p: 2, 
                                   bgcolor: '#222', 
                                   borderRadius: 2, 
                                   borderTopLeftRadius: 0,
                                   display: 'flex',
                                   alignItems: 'center',
                                   gap: 0.5,
                                   height: 'fit-content'
                               }}>
                                    {[0, 1, 2].map((i) => (
                                        <Box key={i} sx={{
                                            width: 6,
                                            height: 6,
                                            bgcolor: '#888',
                                            borderRadius: '50%',
                                            animation: 'typing 1.4s infinite ease-in-out',
                                            animationDelay: `${i * 0.2}s`,
                                            '@keyframes typing': {
                                                '0%, 100%': { transform: 'translateY(0)', opacity: 0.4 },
                                                '50%': { transform: 'translateY(-4px)', opacity: 1 }
                                            }
                                        }} />
                                    ))}
                               </Box>
                           </Box>
                      )}
                      <div ref={scrollRef} />
                  </Container>
              )}
          </Box>
          

          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2 }}>
               <Container maxWidth="md">
                   <Box 
                        sx={{ 
                            bgcolor: '#1e1e1e',
                            borderRadius: 3,
                            display: 'flex',
                            gap:1,
                            alignItems: 'center',
                            p: 1.5,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                            transition: 'all 0.2s ease-in-out',
                            "&:focus-within": {
                                bgcolor: '#262626',
                                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                            }
                        }}
                   >
                       <TextField
                           fullWidth
                           multiline
                           maxRows={6}
                           placeholder="Message GenAI..."
                           value={input}
                           onChange={(e) => setInput(e.target.value)}
                           onKeyPress={(e) => {
                               if (e.key === 'Enter' && !e.shiftKey) {
                                   e.preventDefault();
                                   handleSend();
                               }
                           }}
                           variant="standard"
                           InputProps={{
                               disableUnderline: true,
                               sx: { 
                                   px: 2, 
                                   color: 'white', 
                                   '&::placeholder': { color: '#8e8ea0' } 
                               }
                           }}
                       />
                       <IconButton 
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            sx={{ 
                                bgcolor: input.trim() ? '#fff' : '#333', 
                                color: input.trim() ? '#000' : '#666',
                                width: 32, height: 32,
                                mb: 0.5, mr: 0.5,
                                transition: 'all 0.2s',
                                '&:hover': {
                                     bgcolor: input.trim() ? '#ccc' : '#333'
                                }
                            }}
                       >
                           <ArrowUpwardIcon sx={{ fontSize: 20 }} />
                       </IconButton>
                   </Box>
                   <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1.5, color: '#666', fontSize: '0.75rem' }}>
                       GenAI can make mistakes. Check important info.
                   </Typography>
               </Container>
          </Box>

      </Box>
    </Box>
  );
};
export default chat;
