import React, { useEffect, useMemo, useState } from "react";
import CaloocanLogo from "../assets/CaloocanLogo.png";
import Logo145 from "../assets/Logo145.png";
import BagongPilipinas from "../assets/BagongPilipinas.png";

// Import Material UI components at the top of your file
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  IconButton,
  Chip,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Visibility as EyeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as FileTextIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';

export default function BusinessClearance() {
  const apiBase = "http://localhost:5000";

  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate initial expiry date (1 year from today)
  const getInitialDates = () => {
    const today = new Date();
    const oneYearLater = new Date(today);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    
    return {
      dateIssued: today.toISOString().split("T")[0],
      dateExpired: oneYearLater.toISOString().split("T")[0]
    };
  };

  const [formData, setFormData] = useState({
    ownerName: "",
    businessName: "",
    natureOfBusiness: "",
    address: "",
    ...getInitialDates(),
    purpose: "Barangay Permit"
  });

  const purposeOptions = [
    "Barangay Permit", 
    "Business Registration", 
    "License Renewal", 
    "Tax Clearance", 
    "Bank Requirements", 
    "Government Requirements"
  ];

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      const res = await fetch(`${apiBase}/business-records`);
      const data = await res.json();
      setRecords(
        Array.isArray(data)
          ? data.map((r) => ({
              id: r.id,
              ownerName: r.owner_name,
              businessName: r.business_name,
              natureOfBusiness: r.nature_of_business,
              address: r.address,
              dateIssued: r.date_issued?.slice(0, 10) || "",
              dateExpired: r.date_expired?.slice(0, 10) || "",
              purpose: r.purpose,
              dateCreated: r.date_created,
            }))
          : []
      );
    } catch (e) {
      console.error(e);
    }
  }

  function handleDateIssuedChange(dateIssued) {
    if (dateIssued) {
      const issueDate = new Date(dateIssued);
      const expiredDate = new Date(issueDate);
      expiredDate.setFullYear(expiredDate.getFullYear() + 1);
      setFormData({ 
        ...formData, 
        dateIssued, 
        dateExpired: expiredDate.toISOString().split("T")[0] 
      });
    } else {
      setFormData({ ...formData, dateIssued: "", dateExpired: "" });
    }
  }

  const display = useMemo(() => {
    if (editingId || isFormOpen) return formData;
    if (selectedRecord) return selectedRecord;
    return formData;
  }, [editingId, isFormOpen, selectedRecord, formData]);

  function toServerPayload(data) {
    return {
      owner_name: data.ownerName,
      business_name: data.businessName,
      nature_of_business: data.natureOfBusiness,
      address: data.address,
      date_issued: data.dateIssued,
      date_expired: data.dateExpired,
      purpose: data.purpose,
    };
  }

  async function handleCreate() {
    try {
      const res = await fetch(`${apiBase}/business-records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toServerPayload(formData)),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = await res.json();
      const newRec = { ...formData, id: created.id };
      setRecords([newRec, ...records]);
      setSelectedRecord(newRec);
      resetForm();
      setActiveTab("records");
    } catch (e) {
      console.error(e);
      alert("Failed to create record");
    }
  }

  async function handleUpdate() {
    try {
      const res = await fetch(`${apiBase}/business-records/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toServerPayload(formData)),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = { ...formData, id: editingId };
      setRecords(records.map((r) => (r.id === editingId ? updated : r)));
      setSelectedRecord(updated);
      resetForm();
      setActiveTab("records");
    } catch (e) {
      console.error(e);
      alert("Failed to update record");
    }
  }

  function handleEdit(record) {
    setFormData({ ...record });
    setEditingId(record.id);
    setIsFormOpen(true);
    setActiveTab("form");
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this record?")) return;
    try {
      const res = await fetch(`${apiBase}/business-records/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setRecords(records.filter((r) => r.id !== id));
      if (selectedRecord?.id === id) setSelectedRecord(null);
    } catch (e) {
      console.error(e);
      alert("Failed to delete record");
    }
  }

  function handleView(record) {
    setSelectedRecord(record);
    setActiveTab("form");
  }

  function resetForm() {
    setFormData({
      ownerName: "",
      businessName: "",
      natureOfBusiness: "",
      address: "",
      ...getInitialDates(),
      purpose: "Barangay Permit"
    });
    setEditingId(null);
    setIsFormOpen(false);
  }

  function handleSubmit() {
    if (editingId) handleUpdate();
    else handleCreate();
  }

  const filteredRecords = useMemo(
    () =>
      records.filter(
        (r) =>
          r.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.address.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [records, searchTerm]
  );

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  return (
  <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', display: 'flex' }}>
      {/* LEFT: Certificate preview (previous layout) */}
      <Box sx={{ flex: 1, p: 2, overflow: 'auto',}}>
      <Box
        sx={{
          margin: 0,
          padding: 0,
          background: "#f2f2f2",
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          overflow: "auto",
           border: '1px solid black',
           marginBottom: 2,
        }}
      >
        <div
          style={{
            margin: 0,
            padding: 0,
            background: "#f2f2f2",
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            overflow: "auto",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "8.5in",
              height: "11in",
              margin: "20px auto",
              boxShadow: "0 0 8px rgba(0,0,0,0.2)",
              background: "#fff",
            }}
          >
            {/* Logos */}
            <img style={{ position: "absolute", width: "80px", height: "80px", top: "60px", left: "40px" }} src={CaloocanLogo} alt="Logo 1" />
            <img style={{ position: "absolute", width: "80px", height: "80px", top: "60px", left: "130px" }} src={BagongPilipinas} alt="Logo 2" />
            <img style={{ position: "absolute", width: "120px", height: "80px", top: "60px", right: "40px" }} src={Logo145} alt="Logo 3" />

            {/* Watermark */}
            <img
              style={{ position: "absolute", opacity: 0.2, width: "650px", left: "50%", top: "30px", transform: "translateX(-50%)" }}
              src={Logo145}
              alt="Watermark"
            />

            {/* Header Text */}
            <div style={{ position: "absolute", whiteSpace: "pre", textAlign: "center", width: "100%", fontSize: "20px", fontWeight: "bold", fontFamily: '"Lucida Calligraphy", cursive', top: "50px" }}>
              Republic of the Philippines
            </div>
            <div style={{ position: "absolute", whiteSpace: "pre", textAlign: "center", width: "100%", fontSize: "13pt", fontWeight: "bold", fontFamily: "Arial, sans-serif", top: "84px" }}>
              CITY OF CALOOCAN
            </div>
            <div style={{ position: "absolute", whiteSpace: "pre", textAlign: "center", width: "100%", fontSize: "15pt", fontWeight: "bold", fontFamily: '"Arial Black", sans-serif', top: "110px" }}>
              BARANGAY 145 ZONES 13 DIST. 1
            </div>
            <div style={{ position: "absolute", whiteSpace: "pre", textAlign: "center", width: "100%", fontSize: "15pt", fontWeight: "bold", fontFamily: '"Arial Black", sans-serif', top: "138px" }}>
              Tel. No. 8711 - 7134
            </div>
            <div style={{ position: "absolute", whiteSpace: "pre", textAlign: "center", width: "100%", fontSize: "12pt", fontWeight: "bold", fontFamily: '"Arial Black", sans-serif', top: "166px" }}>
              OFFICE OF THE BARANGAY CHAIRMAN
            </div>

            {/* Business Clearance Title */}
            <div style={{ position: "absolute", top: "196px", width: "100%", textAlign: "center" }}>
              <span style={{ fontFamily: '"Brush Script MT", cursive', fontSize: "28pt", fontWeight: "normal", display: "inline-block", background: "#0b7030", color: "#fff", padding: "4px 70px", borderRadius: "8px" }}>
                Business Clearance
              </span>
            </div>
            {/* Certificate Text */}
            <div style={{ position: "absolute", whiteSpace: "pre", top: "260px", left: "80px", width: "640px", textAlign: "justify", fontFamily: '"Times New Roman", serif', fontSize: "11pt", fontWeight: "bold", color: "black" }}>
              This is to certify that this Business Clearance for <span style={{ color: "red" }}>Business Permit</span> is<br />issued to:.
            </div>

            {/* Business Info */}
            <div style={{ position: "absolute", whiteSpace: "pre", top: "320px", left: "80px", width: "640px", lineHeight: "1.6", fontFamily: '"Times New Roman", serif', fontSize: "12pt", fontWeight: "bold" }}>
              <div>
                <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif' }}>Name:</span>{" "}
                <span style={{ color: "black", marginLeft: "10px", fontSize: "14pt" }}>{display.ownerName || ""}</span><br />
                <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif' }}>Business name:</span>{" "}
                <span style={{ color: "black", marginLeft: "10px", fontSize: "14pt" }}>{display.businessName || ""}</span><br />
                <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif' }}>Nature of Business:</span>{" "}
                <span style={{ color: "black", marginLeft: "10px", fontSize: "14pt" }}>{display.natureOfBusiness || ""}</span><br />
                <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif' }}>Address:</span>{" "}
                <span style={{ color: "black", marginLeft: "10px" }}>{display.address || ""}</span><br />
                <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif' }}>Date Issued:</span>{" "}
                <span style={{ color: "black", marginLeft: "10px" }}>{display.dateIssued ? formatDate(display.dateIssued) : ""}</span><br />
                <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif' }}>Date Expired:</span>{" "}
                <span style={{ color: "black", marginLeft: "10px" }}>{display.dateExpired ? formatDate(display.dateExpired) : ""}</span><br />
                <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif' }}>Remarks:</span>{" "}
                <span style={{ color: "black" }}>Subject to continuing compliance with the </span><br />
                <span style={{ color: "black" }}>above-mentioned laws and all applicable laws.</span>
              </div>
            </div>

            {/* Red Text */}
            <div style={{ position: "absolute", whiteSpace: "pre", top: "600px", left: "80px", fontFamily: '"Times New Roman", serif', fontSize: "12pt", fontWeight: "bold", color: "red" }}>
              This Business Clearance is issued for: <span style={{ color: "black" }}>{display.purpose || "Barangay Permit"}</span>
            </div>

            <div style={{ position: "absolute", whiteSpace: "pre", top: "640px", left: "80px", fontFamily: '"Times New Roman", serif', fontSize: "12pt", fontWeight: "bold", color: "red" }}>
              This certification is issued for: <span style={{ color: "black" }}>Local Employment</span>
            </div>

            {/* Owner's Signature */}
            <div style={{ position: "absolute", top: "720px", left: "80px", width: "200px", textAlign: "center", fontFamily: '"Times New Roman", serif', fontSize: "10pt", fontWeight: "bold" }}>
              <div style={{ fontWeight: "bold", color: "black", marginBottom: "10px" }}>Owner's Signature</div>
              <div style={{ width: "150px", height: "80px", border: "2px solid #000", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8pt", color: "#666", flexDirection: "column" }}>
                <div>Right</div>
                <div>Thumb</div>
                <div>Print</div>
              </div>
            </div>

            {/* Punong Barangay */}
            <div style={{ position: "absolute", top: "900px", right: "100px", width: "300px", textAlign: "center" }}>
              <div style={{ borderTop: "1px solid #000", width: "80%", margin: "auto" }}></div>
              <div style={{ fontFamily: "Impact, sans-serif", fontSize: "25pt", fontWeight: "bold", background: "linear-gradient(to bottom, orange, yellow, orange)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", WebkitTextStroke: "1px black", color: "orange" }}>
                Arnold Dondonayos
              </div>
              <div style={{ fontFamily: '"Brush Script MT", cursive', fontSize: "20pt", color: "#000", marginTop: "-8px" }}>
                Barangay Captain
              </div>
            </div>
          </div>
        </div>
      </Box>
      </Box>

      {/* RIGHT: CRUD container */}
  <Container maxWidth="sm" disableGutters sx={{ height: '100vh' }}>
    <Paper sx={{ 
        bgcolor: 'grey.50',
        borderLeft: 1,
        borderColor: 'grey.300',
        display: 'flex',
        flexDirection: 'column',
      }}>
    {/* Sticky Header */}
    <Paper 
      elevation={0}
      sx={{ 
        position: 'sticky',
        paddingTop: 5,
        zIndex: 10,
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: 1,
        borderColor: 'grey.300',
        
      }}
    >
      <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#445C3C' }}>
          Business Clearance
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FileTextIcon />}
          onClick={() => { 
            resetForm(); 
            setIsFormOpen(true); 
            setActiveTab("form"); 
          }}
          sx={{
            textTransform: 'none',
            fontSize: '0.875rem',
            color: 'grey.700',
            borderColor: 'grey.400',
            '&:hover': {
              bgcolor: '#445C3C',
              color: '#ffffff'
            }
          }}
        >
          New
        </Button>
      </Box>
      
      <Box sx={{ px: 1, pb: 1 }}>
        <Paper sx={{ p: 0.5, bgcolor: 'grey.200', borderRadius: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
            <Button
              onClick={() => setActiveTab("form")}
              variant={activeTab === "form" ? "contained" : "text"}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                py: 1,
                bgcolor: activeTab === "form" ? 'white' : 'transparent',
                color: activeTab === "form" ? 'success.main' : 'grey.600',
                boxShadow: activeTab === "form" ? 1 : 0,
                '&:hover': {
                  bgcolor: activeTab === "form" ? 'white' : 'grey.300',
                  color: activeTab === "form" ? 'success.main' : 'grey.800'
                }
              }}
            >
              Form
            </Button>
            <Button
              onClick={() => setActiveTab("records")}
              variant={activeTab === "records" ? "contained" : "text"}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                py: 1,
                bgcolor: activeTab === "records" ? 'white' : 'transparent',
                color: activeTab === "records" ? 'success.main' : 'grey.600',
                boxShadow: activeTab === "records" ? 1 : 0,
                '&:hover': {
                  bgcolor: activeTab === "records" ? 'white' : 'grey.300',
                  color: activeTab === "records" ? 'success.main' : 'grey.800'
                }
              }}
            >
              Records ({records.length})
            </Button>
          </Box>
        </Paper>
      </Box>
    </Paper>

    {/* Form Tab */}
    {activeTab === "form" && (
      <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
        <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
          <CardHeader
            title={
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: 'grey.800' }}>
                {editingId ? "Edit Business Record" : "New Business Clearance"}
              </Typography>
            }
            subheader={
              selectedRecord && !editingId && (
                <Typography variant="caption" sx={{ color: 'grey.500' }}>
                  Viewing: {selectedRecord.businessName}
                </Typography>
              )
            }
            sx={{ borderBottom: 1, borderColor: 'grey.200' }}
          />
          
          <CardContent>
            <Stack spacing={2}>
              <TextField
                label="Owner's Name *"
                variant="outlined"
                size="small"
                fullWidth
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'success.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'success.main',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'success.main',
                  },
                }}
              />

              <TextField
                label="Business Name *"
                variant="outlined"
                size="small"
                fullWidth
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'success.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'success.main',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'success.main',
                  },
                }}
              />

              <TextField
                label="Nature of Business *"
                variant="outlined"
                size="small"
                fullWidth
                placeholder="e.g., Sewing of Rugs, Food Service, Retail Store"
                value={formData.natureOfBusiness}
                onChange={(e) => setFormData({ ...formData, natureOfBusiness: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'success.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'success.main',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'success.main',
                  },
                }}
              />

              <TextField
                label="Business Address *"
                variant="outlined"
                size="small"
                fullWidth
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'success.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'success.main',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'success.main',
                  },
                }}
              />

              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <TextField
                    label="Date Issued *"
                    type="date"
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={formData.dateIssued}
                    onChange={(e) => handleDateIssuedChange(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'success.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'success.main',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'success.main',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Date Expired"
                    type="date"
                    variant="outlined"
                    size="small"
                    fullWidt
                    InputLabelProps={{ shrink: true }}
                    value={formData.dateExpired}
                    InputProps={{ 
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarTodayIcon sx={{ color: 'grey.400', fontSize: 16 }} />
                        </InputAdornment>
                      )
                    }}
                    helperText="Auto-calculated (1 year)"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'success.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'success.main',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'success.main',
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'grey.500',
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <FormControl 
                fullWidth 
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'success.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'success.main',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'success.main',
                  },
                }}
              >
                <InputLabel>Purpose *</InputLabel>
                <Select
                  value={formData.purpose}
                  label="Purpose *"
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                >
                  {purposeOptions.map((purpose) => (
                    <MenuItem key={purpose} value={purpose}>
                      {purpose}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  startIcon={<SaveIcon />}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(45deg, #2e7d32, #388e3c)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1b5e20, #2e7d32)',
                    },
                    fontWeight: 500,
                    py: 1.25,
                    textTransform: 'none'
                  }}
                >
                  {editingId ? "Update" : "Save"}
                </Button>
                {(editingId || isFormOpen) && (
                  <Button
                    onClick={resetForm}
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    sx={{
                      color: 'grey.700',
                      borderColor: 'grey.400',
                      '&:hover': {
                        bgcolor: 'grey.100',
                        borderColor: 'grey.400'
                      },
                      py: 1.25,
                      px: 2,
                      textTransform: 'none'
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    )}

    {/* Records Tab */}
    {activeTab === "records" && (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 1.5 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'grey.400', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'success.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'success.main',
                },
              },
            }}
          />
        </Box>
        
        <Box sx={{ flex: 1, overflow: 'auto', px: 1.5, pb: 1.5 }}>
          {filteredRecords.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center', color: 'grey.500' }}>
              <Typography variant="body2">
                {searchTerm ? "No records found" : "No records yet"}
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={1}>
              {filteredRecords.map((record) => (
                <Card 
                  key={record.id} 
                  sx={{ 
                    boxShadow: 1, 
                    '&:hover': { 
                      boxShadow: 2 
                    },
                    transition: 'box-shadow 0.2s'
                  }}
                >
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'grey.900', mb: 0.5 }}>
                          {record.businessName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'grey.700', display: 'block', mb: 0.5 }}>
                          Owner: {record.ownerName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'grey.600', display: 'block', mb: 0.5 }}>
                          {record.address}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                          <Chip 
                            label={record.natureOfBusiness} 
                            size="small" 
                            sx={{ 
                              bgcolor: 'grey.100', 
                              color: 'grey.700',
                              fontSize: '0.625rem',
                              height: 20
                            }} 
                          />
                          <Typography variant="caption" sx={{ color: 'grey.500', fontSize: '0.625rem' }}>
                            {record.purpose}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'grey.400', fontSize: '0.625rem' }}>
                            Issued: {formatDate(record.dateIssued)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleView(record)}
                          sx={{ 
                            color: 'info.main', 
                            '&:hover': { bgcolor: 'info.lighter' },
                            p: 0.75
                          }}
                          title="View"
                        >
                          <EyeIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEdit(record)}
                          sx={{ 
                            color: 'success.main', 
                            '&:hover': { bgcolor: 'success.lighter' },
                            p: 0.75
                          }}
                          title="Edit"
                        >
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(record.id)}
                          sx={{ 
                            color: 'error.main', 
                            '&:hover': { bgcolor: 'error.lighter' },
                            p: 0.75
                          }}
                          title="Delete"
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    )}
  </Paper>
</Container>
    </Box>
  );
}