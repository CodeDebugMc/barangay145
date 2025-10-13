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
  Stack,
  boxClasses
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Visibility as EyeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as FileTextIcon
} from '@mui/icons-material';

export default function BarangayClearance() {
  const apiBase = "http://localhost:5000";

  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    birthday: "",
    age: "",
    provincialAddress: "",
    contactNo: "",
    civilStatus: "Single",
    requestReason: "",
    dateIssued: new Date().toISOString().split("T")[0],
  });

  const civilStatusOptions = ["Single", "Married", "Widowed", "Divorced", "Separated"];

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      const res = await fetch(`${apiBase}/request-records`);
      const data = await res.json();
      setRecords(
        Array.isArray(data)
          ? data.map((r) => ({
              id: r.id,
              name: r.name,
              address: r.address,
              birthday: r.birthday?.slice(0, 10) || "",
              age: String(r.age ?? ""),
              provincialAddress: r.provincial_address || "",
              contactNo: r.contact_no || "",
              civilStatus: r.civil_status,
              requestReason: r.request_reason,
              dateIssued: r.date_issued?.slice(0, 10) || "",
              dateCreated: r.date_created,
            }))
          : []
      );
    } catch (e) {
      console.error(e);
    }
  }

  function handleBirthdayChange(birthday) {
    if (birthday) {
      const birthDate = new Date(birthday);
      const today = new Date();
      const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
      setFormData({ ...formData, birthday, age: String(age) });
    } else {
      setFormData({ ...formData, birthday: "", age: "" });
    }
  }

  const display = useMemo(() => {
    if (editingId || isFormOpen) return formData;
    if (selectedRecord) return selectedRecord;
    return formData;
  }, [editingId, isFormOpen, selectedRecord, formData]);

  function toServerPayload(data) {
    return {
      name: data.name,
      address: data.address,
      birthday: data.birthday || null,
      age: data.age ? Number(data.age) : null,
      provincial_address: data.provincialAddress || null,
      contact_no: data.contactNo || null,
      civil_status: data.civilStatus,
      request_reason: data.requestReason,
      date_issued: data.dateIssued,
    };
  }

  async function handleCreate() {
    try {
      const res = await fetch(`${apiBase}/request-records`, {
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
      const res = await fetch(`${apiBase}/request-records/${editingId}`, {
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
      const res = await fetch(`${apiBase}/request-records/${id}`, { method: "DELETE" });
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
      name: "",
      address: "",
      birthday: "",
      age: "",
      provincialAddress: "",
      contactNo: "",
      civilStatus: "Single",
      requestReason: "",
      dateIssued: new Date().toISOString().split("T")[0],
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
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.contactNo || "").includes(searchTerm)
      ),
    [records, searchTerm]
  );

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

   return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", display: "flex" }}>
      {/* LEFT SIDE - Certificate Preview */}
      <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
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
            border: "1px solid black",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "794px",
              height: "1123px",
              margin: "20px auto",
              boxShadow: "0 0 8px rgba(0,0,0,0.2)",
              background: "#fff",
              fontFamily: "Calibri, sans-serif",
              fontWeight: "bold",
            }}
          >
            {/* Logos */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                gap: "30px",
              }}
            >
              <img
                style={{ width: "80px", height: "80px" }}
                src={CaloocanLogo}
                alt="Caloocan"
              />
              <img
                style={{ width: "80px", height: "80px" }}
                src={BagongPilipinas}
                alt="Bagong Pilipinas"
              />
              <img
                style={{ width: "80px", height: "80px" }}
                src={Logo145}
                alt="Barangay 145"
              />
            </div>

            {/* Watermark */}
            <img
              style={{
                position: "absolute",
                opacity: 0.12,
                width: "600px",
                left: "50%",
                top: "200px",
                transform: "translateX(-50%)",
              }}
              src={Logo145}
              alt="Watermark"
            />

            {/* Header */}
            <div style={{ position: "absolute", top: "120px", width: "100%" }}>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "12pt",
                }}
              >
                Republic of the Philippines
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "12pt",
                }}
              >
                City of Caloocan
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "12pt",
                }}
              >
                BARANGAY 145 ZONE 13 DISTRICT 1
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "16pt",
                  marginTop: "4px",
                }}
              >
                OFFICE OF THE BARANGAY CAPTAIN
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "20pt",
                  letterSpacing: "6px",
                  marginTop: "30px",
                }}
              >
                B H E R T &nbsp; C E R T I F I C A T I O N
              </div>
            </div>

            {/* Body */}
            <div
              style={{
                position: "absolute",
                top: "300px",
                fontSize: "14pt",
                textAlign: "justify",
                margin: "0 80px",
                width: "640px",
              }}
            >
              To Whom It May Concern: <br />
              <p style={{ textIndent: "40px" }}>
                This is to certify that <span style={{ textDecoration: "underline" }}>
              {formData.name || "____________________"}
            </span>
            
            , a Filipino citizen and resident of{" "}<span style={{ textDecoration: "underline" }}>
              {formData.address || "____________________"}
            </span> {" "}
            Bagong Barrio Caloocan City. He/She is INCLUDED in the
            list of household in this barangay, who is being monitored with COVID-19 and
            He/She is INCLUDED in the list of persons who is being monitored in this barangay
            to the PUI or CONFIRMED with COVID-19. She completed One Wk. Quarantine period,
            and monitored by our BHERT officer.
              </p>

              <p style={{ textIndent: "40px" }}>
                  This Certification is issued upon request of the above-mentioned name for
            {" "}
            <span style={{ textDecoration: "underline" }}>
              {formData.requestReason || "___________"}
            </span>.
              </p>

              <p style={{ textIndent: "40px" }}>
                 Done in the Office of the Punong Barangay 145, Zone 13, District 1, City
            of Caloocan this {display.dateIssued ? formatDate(display.dateIssued) : ""}.
              </p>

        
            </div>

            {/* Signature Section */}
            <div style={{ position: "absolute", left: "80px", top: "900px" }}>
              Certified by: <br />
              <br />
              ROSALINA P. ANORE
              <br />
              <span style={{ fontSize: "14pt" }}>Brgy. Secretary</span>
            </div>

            <div style={{ position: "absolute", left: "80px", top: "1000px" }}>
              Noted by: <br />
              <br />
              <span style={{ fontSize: "16pt" }}>ARNOLD DONDONAYOS</span>
              <br />
              <span style={{ fontSize: "14pt" }}>Punong Barangay</span>
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
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#445C3C' }}>
          Barangay Clearance
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
                {editingId ? "Edit Record" : "New Clearance Record"}
              </Typography>
            }
            subheader={
              selectedRecord && !editingId && (
                <Typography variant="caption" sx={{ color: 'grey.500' }}>
                  Viewing: {selectedRecord.name}
                </Typography>
              )
            }
            sx={{ borderBottom: 1, borderColor: 'grey.200' }}
          />
          
          <CardContent>
            <Stack spacing={2}>
              <TextField
                label="Full Name *"
                variant="outlined"
                size="small"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                label="Address *"
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
                    label="Birthday *"
                    type="date"
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={formData.birthday}
                    onChange={(e) => handleBirthdayChange(e.target.value)}
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
                    label="Age"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={formData.age}
                    InputProps={{ readOnly: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'grey.100',
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <TextField
                label="Provincial Address"
                variant="outlined"
                size="small"
                fullWidth
                value={formData.provincialAddress}
                onChange={(e) => setFormData({ ...formData, provincialAddress: e.target.value })}
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
                label="Contact Number"
                variant="outlined"
                size="small"
                fullWidth
                placeholder="09XXXXXXXXX"
                value={formData.contactNo}
                onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
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
                <InputLabel>Civil Status *</InputLabel>
                <Select
                  value={formData.civilStatus}
                  label="Civil Status *"
                  onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}
                >
                  {civilStatusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Request Reason *"
                variant="outlined"
                size="small"
                fullWidth
                multiline
                rows={2}
                placeholder="Job application, School enrollment, etc."
                value={formData.requestReason}
                onChange={(e) => setFormData({ ...formData, requestReason: e.target.value })}
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
                label="Date Issued *"
                type="date"
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.dateIssued}
                onChange={(e) => setFormData({ ...formData, dateIssued: e.target.value })}
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
                          {record.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'grey.600', display: 'block', mb: 0.5 }}>
                          {record.address}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                          <Chip 
                            label={record.civilStatus} 
                            size="small" 
                            sx={{ 
                              bgcolor: 'grey.100', 
                              color: 'grey.700',
                              fontSize: '0.625rem',
                              height: 20
                            }} 
                          />
                          {record.contactNo && (
                            <Typography variant="caption" sx={{ color: 'grey.500', fontSize: '0.625rem' }}>
                              {record.contactNo}
                            </Typography>
                          )}
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




