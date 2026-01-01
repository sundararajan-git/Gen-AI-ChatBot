import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider } from "./store/AuthContext";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { PrivateRoute } from "./guards/AuthGuard";

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
            <Route path="/login" element={<p>Login</p>} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <p>Chat</p>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly>
                  <p>Admin</p>
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
