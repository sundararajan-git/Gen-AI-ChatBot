import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider } from "./store/AuthContext";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { PrivateRoute } from "./guards/AuthGuard";
import Login from "./features/auth/Login.jsx";
import Chat from "./features/chat/Chat.jsx";
import Admin from "./features/admin/Admin.jsx";

const theme = createTheme({
  typography: {
    fontFamily: "Söhne, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif, 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    h4: {
      fontWeight: 600,
      letterSpacing: "-0.02em",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: "#ECECF1", 
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: "#FFFFFF", 
      contrastText: "#000000",
    },
    background: {
      default: "#000000", 
      paper: "#1e1e1e", 
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#9b9b9b",
    },
    action: {
       hover: "rgba(255, 255, 255, 0.1)",
       selected: "rgba(255, 255, 255, 0.15)"
    },
    success: {
       main: "#FFFFFF" 
    },
    info: {
       main: "#FFFFFF"
    }
  },
  shape: {
    borderRadius: 16, 
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#000000",
          color: "#FFFFFF",
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24, 
          color: "#FFFFFF",
          borderColor: "#333",
          padding: "8px 20px",
          fontWeight: 600,
          textTransform: "none"
        },
        containedPrimary: {
           backgroundColor: "#FFFFFF",
           color: "#000000",
           '&:hover': {
              backgroundColor: "#e0e0e0",
           }
        },
        outlined: {
            borderColor: "#333",
            color: "#FFFFFF",
            "&:hover": {
                borderColor: "#FFFFFF",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
            }
        }
      },
    },
     MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1e1e1e',
          border: '1px solid #333',
          borderRadius: 16,
        },
      },
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                backgroundColor: "#000000",
                color: "#FFFFFF",
                borderRight: "1px solid #333"
            }
        }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
           borderRadius: 16,
           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
               borderColor: "#FFFFFF",
               borderWidth: 1
           }
        }
      }
    }
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly>
                  <Admin />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};
export default App;
