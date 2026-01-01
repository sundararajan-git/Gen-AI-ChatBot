import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import { AuthContext } from "../../store/AuthContext";

const login = () => {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("employee");
  const [error, setError] = useState(null);

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
      setError("Authentication failed. Check credentials.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {isRegister ? "Register" : "Sign In"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isRegister && (
            <Select
              fullWidth
              value={role}
              onChange={(e) => setRole(e.target.value)}
              sx={{ mt: 2 }}
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          )}
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isRegister ? "Sign Up" : "Sign In"}
          </Button>
          <Button fullWidth onClick={() => setIsRegister(!isRegister)}>
            {isRegister
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
export default login;
