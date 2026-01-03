import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import { AuthContext } from "../../store/AuthContext";

const login = () => {
  const { login, register, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("employee");
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isRegister) {
        await register(username, password, role);
      } else {
        await login(username, password);
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      if (isRegister && err.response && err.response.data && err.response.data.message === "User already exists") {
          setSnackbar({
             open: true,
             message: "You are already registered! Please login.",
             severity: "warning"
          });
          setIsRegister(false);
      } else if (!isRegister && err.response && err.response.data && err.response.data.message === "user not found !") {
           setSnackbar({
              open: true,
              message: "User not found! Please register first.",
              severity: "warning"
           });
           setIsRegister(true);
      } else {
        setError("Authentication failed. Check credentials.");
      }
    }
  };

  const handleCloseSnackbar = () => {
      setSnackbar({ ...snackbar, open: false });
  };

  if (loading || user) {
      return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#000' }}>
              <CircularProgress sx={{ color: '#fff' }} />
          </Box>
      );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        color: "text.primary"
      }}
    >
      <Container component="main" maxWidth="xs">
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%", boxShadow: 3, borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
             <Box 
                sx={{ 
                    p: 1.5, 
                    bgcolor: "#fff", 
                    borderRadius: "50%", 
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: "black" 
                }}
             >
                 <AutoAwesomeIcon sx={{ fontSize: 24 }} />
             </Box>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 600, mb: 1, letterSpacing: '-0.02em', color: "white" }}>
                {isRegister ? "Create your account" : "Welcome back"}
            </Typography>
            <Typography variant="body1" sx={{ color: "#9b9b9b", fontSize: '1rem' }}>
                {isRegister ? "Start chatting with GenAI today" : "Sign in to continue to GenAI"}
            </Typography>
        </Box>

        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: "100%" }}
        >
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#9b9b9b' }}>Username</Typography>
                    <TextField
                      required
                      fullWidth
                      placeholder="Enter your username"
                      autoFocus
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      variant="outlined"
                      sx={{
                          '& .MuiOutlinedInput-root': {
                              bgcolor: 'transparent',
                              borderRadius: 0.5,
                              '& fieldset': { borderColor: '#333' },
                              '&:hover fieldset': { borderColor: '#666' },
                              '&.Mui-focused fieldset': { borderColor: '#fff' }
                          },
                          '& .MuiInputBase-input': { py: 1.5 }
                      }}
                      InputProps={{ sx: { color: 'white' } }}
                    />
                </Box>

                <Box>
                     <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#9b9b9b' }}>Password</Typography>
                    <TextField
                      required
                      fullWidth
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      variant="outlined"
                      sx={{
                          '& .MuiOutlinedInput-root': {
                              bgcolor: 'transparent',
                              borderRadius: 0.5,
                              '& fieldset': { borderColor: '#333' },
                              '&:hover fieldset': { borderColor: '#666' },
                              '&.Mui-focused fieldset': { borderColor: '#fff' }
                          },
                          '& .MuiInputBase-input': { py: 1.5 }
                      }}
                      InputProps={{ sx: { color: 'white' } }}
                    />
                </Box>

                {isRegister && (
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#9b9b9b' }}>Role</Typography>
                        <Select
                            fullWidth
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            sx={{
                                bgcolor: 'transparent',
                                borderRadius: 0.5,
                                color: 'white',
                                '.MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#666' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
                                '& .MuiSvgIcon-root': { color: '#666' },
                                '& .MuiSelect-select': { py: 1.5 }
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: '#000',
                                        border: '1px solid #333',
                                        '& .MuiMenuItem-root': {
                                            color: 'white',
                                            '&:hover': { bgcolor: '#222' },
                                            '&.Mui-selected': { bgcolor: '#333', '&:hover': { bgcolor: '#444' } }
                                        }
                                    }
                                }
                            }}
                          >
                            <MenuItem value="employee">Employee</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                          </Select>
                    </Box>
                )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 3, bgcolor: "#333", color: "#fff", border: '1px solid #555', borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                  mt: 3, 
                  mb: 3, 
                  py: 1.25, 
                  fontSize: '1rem', 
                  borderRadius: 0.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  bgcolor: "#fff",
                  color: "#000",
                  '&:hover': { bgcolor: '#e0e0e0' }
              }}
            >
              {isRegister ? "Create account" : "Sign in"}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#9b9b9b' }}>
                    {isRegister ? "Already have an account? " : "Don't have an account? "}
                    <Button 
                        onClick={() => setIsRegister(!isRegister)}
                        sx={{ 
                            textTransform: 'none', 
                            fontWeight: 500, 
                            p: 0, 
                            minWidth: 0, 
                            color: '#fff',
                            textDecoration: 'underline',
                            '&:hover': { bgcolor: 'transparent', color: '#ccc' }
                        }}
                        disableRipple
                    >
                      {isRegister ? "Sign in" : "Sign up"}
                    </Button>
                </Typography>
            </Box>
        </Box>
      </Container>
    </Box>
  );
};
export default login;
