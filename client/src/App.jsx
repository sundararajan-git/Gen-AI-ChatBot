import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider } from "./store/AuthContext";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { PrivateRoute } from "./guards/AuthGuard";
import Login from "./features/auth/Login.jsx";
import Chat from "./features/chat/Chat.jsx";
import Admin from "./features/admin/Admin.jsx";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
    background: { default: "#f4f6f8" },
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
