import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios.js";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

const Admin = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({ totalQueries: 0, feedbackStats: [] });

  const fetchDocs = async () => {
    try {
      const { data } = await api.get("/docs");
      setDocuments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/chat/stats");
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocs();
    fetchStats();
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/docs/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully!");
      fetchDocs();
    } catch (error) {
      alert("Upload failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/docs/${id}`);
      fetchDocs();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <Container sx={{ width: "100vw" }}>
      <Button onClick={() => navigate("/")} sx={{ mb: 2 }}>
        Back to Chat
      </Button>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Total Queries</Typography>
              <Typography variant="h3">{stats.totalQueries}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">
          Upload Knowledge Base Document (PDF/MD)
        </Typography>
        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <input
            type="file"
            accept=".pdf,.md"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button variant="contained" onClick={handleUpload}>
            Upload & Process
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Knowledge Base Documents</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Uploaded By</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc._id}>
                <TableCell>{doc.title}</TableCell>
                <TableCell>{doc.fileType}</TableCell>
                <TableCell>{doc.uploadedBy?.username || "Unknown"}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => handleDelete(doc._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};
export default Admin;
