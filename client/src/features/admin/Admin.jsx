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
  Card,
  CardContent,
  Snackbar,
  Alert,
  TableContainer
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DescriptionIcon from '@mui/icons-material/Description';

const Admin = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({ totalQueries: 0, feedbackStats: [] });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

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

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleUpload = async () => {
    if (!file) return showSnackbar("Please select a file", "warning");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/docs/upload", formData);
      showSnackbar("File uploaded successfully!", "success");
      setFile(null);
      fetchDocs();
    } catch (error) {
        console.error("Upload error:", error);
        showSnackbar(error.response?.data?.message || "Upload failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await api.delete(`/docs/${id}`);
      showSnackbar("Document deleted successfully", "success");
      fetchDocs();
    } catch (err) {
        showSnackbar("Delete failed", "error");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#000", color: "#fff", display: "flex", flexDirection: "column" }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%", bgcolor: '#222', color: '#fff' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Container maxWidth="md" sx={{ mt: 6, mb: 10 }}>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate("/")} 
                sx={{ mr: 2, color: '#999', textTransform: 'none', '&:hover': { color: '#fff' } }}
            >
                Back
            </Button>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
                Admin Dashboard
            </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

             <Card elevation={0} sx={{ border: "1px solid #333", bgcolor: '#111', borderRadius: 2 }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3, '&:last-child': { pb: 3 }, gap: 3 }}>
                    <Box sx={{ p: 2, bgcolor: "#222", borderRadius: 2, color: "#fff", display: 'flex' }}>
                        <AnalyticsIcon fontSize="large" />
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{ color: "#999", fontWeight: 500, mb: 0.5 }}>Total Queries Processed</Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ color: "#fff", letterSpacing: '-0.03em' }}>{stats.totalQueries}</Typography>
                    </Box>
                  </CardContent>
             </Card>


             <Paper elevation={0} sx={{ p: 4, border: "1px solid #333", bgcolor: '#111', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: '#fff' }}>
                  Upload Knowledge
                </Typography>
                <Typography variant="body2" color="#999" paragraph sx={{ mb: 3 }}>
                    Upload PDF or Markdown files to expand the chatbot's knowledge base.
                </Typography>
                
                <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                   <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<DescriptionIcon />}
                      sx={{ 
                          py: 2, 
                          borderStyle: 'dashed', 
                          borderWidth: 1, 
                          borderColor: '#444',
                          color: '#ccc',
                          borderRadius: 2,
                          '&:hover': { borderColor: '#fff', color: '#fff', bgcolor: 'transparent' }
                      }}
                   >
                     {file ? file.name : "Select File"}
                     <input
                        type="file"
                        hidden
                        accept=".pdf,.md"
                        onChange={(e) => setFile(e.target.files[0])}
                     />
                   </Button>
                   <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={handleUpload}
                      disabled={!file}
                      startIcon={<CloudUploadIcon />}
                      sx={{ py: 2, bgcolor: '#fff', color: '#000', borderRadius: 2, fontWeight: 600, '&:hover': { bgcolor: '#e0e0e0' } }}
                   >
                     Upload & Process
                   </Button>
                </Box>
             </Paper>


             <Paper elevation={0} sx={{ border: "1px solid #333", overflow: 'hidden', bgcolor: '#111', borderRadius: 2 }}>
                <Box sx={{ p: 3, borderBottom: "1px solid #333" }}>
                    <Typography variant="h6" fontWeight="600" sx={{ color: '#fff' }}>Knowledge Base</Typography>
                </Box>
                <TableContainer>
                    <Table>
                      <TableHead sx={{ bgcolor: "#1a1a1a" }}>
                        <TableRow>
                          <TableCell sx={{ color: '#888', borderBottom: "1px solid #333", py: 2 }}>Document Title</TableCell>
                          <TableCell sx={{ color: '#888', borderBottom: "1px solid #333", py: 2 }}>Type</TableCell>
                          <TableCell sx={{ color: '#888', borderBottom: "1px solid #333", py: 2 }}>Uploaded By</TableCell>
                          <TableCell sx={{ color: '#888', borderBottom: "1px solid #333", py: 2 }} align="right">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {documents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#666', borderBottom: "none" }}>
                                    No documents found. Upload one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            documents.map((doc) => (
                              <TableRow key={doc._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell sx={{ color: '#fff', borderColor: "#333", fontWeight: 500, py: 2.5 }}>{doc.title}</TableCell>
                                <TableCell sx={{ borderColor: "#333", py: 2.5 }}>
                                    <Box component="span" sx={{ 
                                        px: 1.5, py: 0.5, 
                                        borderRadius: 1, 
                                        bgcolor: '#222', 
                                        color: '#ccc', 
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        fontWeight: 600,
                                        border: '1px solid #333'
                                    }}>
                                        {doc.fileType}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ color: '#999', borderColor: "#333", py: 2.5 }}>{doc.uploadedBy?.username || "Unknown"}</TableCell>
                                <TableCell align="right" sx={{ borderColor: "#333", py: 2.5 }}>
                                  <Button 
                                    size="small"
                                    startIcon={<DeleteIcon />} 
                                    onClick={() => handleDelete(doc._id)}
                                    sx={{ color: '#ff4444', opacity: 0.8, borderRadius: 1, '&:hover': { opacity: 1, bgcolor: 'rgba(255, 68, 68, 0.1)' } }}
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                </TableContainer>
             </Paper>
        </Box>
      </Container>
    </Box>
  );
};
export default Admin;
