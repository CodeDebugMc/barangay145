import React, { useEffect, useMemo, useState } from "react";
import CaloocanLogo from "../assets/CaloocanLogo.png";
import Logo145 from "../assets/Logo145.png";
import BagongPilipinas from "../assets/BagongPilipinas.png";
import { Autocomplete } from "@mui/material";


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
  Description as FileTextIcon
} from '@mui/icons-material';

export default function Indigency() {
  const apiBase = "http://localhost:5000";

  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [searchTerm, setSearchTerm] = useState("");
  const [residents, setResidents] = useState([]);


  const [formData, setFormData] = useState({
    resident_id: "",
    full_name: "",
    address: "",
    dob: "",
    age: "",
    provincial_address: "",
    contact_no: "",
    civil_status: "Single",
    remarks: "Residence in this Barangay and certifies that he/she belongs to indigent families.",
    request_reason: "",
    date_issued: new Date().toISOString().split("T")[0],
  });

  const civilStatusOptions = ["Single", "Married", "Widowed", "Divorced", "Separated"];

  

async function loadResidents() {
  try {
    const res = await fetch(`${apiBase}/residents`);
    const data = await res.json();
    setResidents(data);
  } catch (e) {
    console.error(e);
  }
}

useEffect(() => {
  loadResidents();
  loadRecords();
}, []);


  async function loadRecords() {
    try {
      const res = await fetch(`${apiBase}/indigency`);
      const data = await res.json();
     setRecords(
          Array.isArray(data)
            ? data.map((r) => ({
                indigency_id: r.indigency_id,
                resident_id: r.resident_id,
                full_name: r.full_name,
                address: r.address,
                dob: r.dob?.slice(0, 10) || "",
                age: String(r.age ?? ""),
                provincial_address: r.provincial_address || "",
                contact_no: r.contact_no || "",
                civil_status: r.civil_status,
                remarks: r.remarks,
                request_reason: r.request_reason,
                date_issued: r.date_issued || "",
                date_created: r.date_created,
              }))
            : []
        );

    } catch (e) {
      console.error(e);
    }
  }

  function handleBirthdayChange(dob) {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
      setFormData({ ...formData, dob, age: String(age) });
    } else {
      setFormData({ ...formData, dob: "", age: "" });
    }
  }

  const display = useMemo(() => {
    if (editingId || isFormOpen) return formData;
    if (selectedRecord) return selectedRecord;
    return formData;
  }, [editingId, isFormOpen, selectedRecord, formData]);

    function toServerPayload(data) {
      return {
        resident_id: data.resident_id || null,
        full_name: data.full_name,
        address: data.address,
        dob: data.dob || null,
        age: data.age ? Number(data.age) : null,
        provincial_address: data.provincial_address || null,
        contact_no: data.contact_no || null,
        civil_status: data.civil_status,
        remarks: data.remarks,
        request_reason: data.request_reason,
        date_issued: data.date_issued,
      };
    }


  async function handleCreate() {
    try {
      const res = await fetch(`${apiBase}/indigency`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toServerPayload(formData)),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = await res.json();
      const newRec = { ...formData, indigency_id: created.indigency_id };

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
      const res = await fetch(`${apiBase}/indigency/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toServerPayload(formData)),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = { ...formData, indigency_id: editingId };
      setRecords(records.map((r) => (r.indigency_id === editingId ? updated : r)));
      setSelectedRecord(updated);
      resetForm();
      setActiveTab("records");
    } catch (e) {
      console.error(e);
      alert("Failed to update record");
    }
  }

  function handleEdit(record) {
  setFormData({ ...record }); // record already has indigency_id
  setEditingId(record.indigency_id);
  setIsFormOpen(true);
  setActiveTab("form");
}


  async function handleDelete(id) {
  if (!window.confirm("Delete this record?")) return;
  try {
    const res = await fetch(`${apiBase}/indigency/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    setRecords(records.filter((r) => r.indigency_id !== id));
    if (selectedRecord?.indigency_id === id) setSelectedRecord(null);
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
      full_name: "",
      address: "",
      dob: "",
      age: "",
      provincial_address: "",
      contact_no: "",
      civil_status: "Single",
      remarks: "Residence in this Barangay and certifies that he/she belongs to indigent families. ",
      request_reason: "",
      date_issued: new Date().toISOString().split("T")[0],
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
    r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.contact_no || "").includes(searchTerm)
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
               <img
                 style={{ position: "absolute", width: "80px", height: "80px", top: "60px", left: "40px" }}
                 src={CaloocanLogo}
                 alt="Logo 1"
               />
               <img
                 style={{ position: "absolute", width: "80px", height: "80px", top: "60px", left: "130px" }}
                 src={BagongPilipinas}
                 alt="Logo 2"
               />
               <img
                 style={{ position: "absolute", width: "100px", height: "100px", top: "50px", right: "40px" }}
                 src={Logo145}
                 alt="Logo 3"
               />
       
               {/* Watermark */}
               <img
                 style={{
                   position: "absolute",
                   opacity: 0.3,
                   width: "500px",
                   left: "50%",
                   top: "250px",
                   transform: "translateX(-50%)",
                 }}
                 src={Logo145}
                 alt="Watermark"
               />
       
               {/* Header Text */}
               <div
                 style={{
                   position: "absolute",
                   whiteSpace: "pre",
                   textAlign: "center",
                   width: "100%",
                   fontSize: "20px",
                   fontWeight: "bold",
                   fontFamily: '"Lucida Calligraphy", cursive',
                   top: "50px",
                 }}
               >
                 Republic of the Philippines
               </div>
       
               <div
                 style={{
                   position: "absolute",
                   whiteSpace: "pre",
                   textAlign: "center",
                   width: "100%",
                   fontSize: "13pt",
                   fontWeight: "bold",
                   fontFamily: "Arial, sans-serif",
                   top: "84px",
                 }}
               >
                 CITY OF CALOOCAN
               </div>
       
               <div
                 style={{
                   position: "absolute",
                   whiteSpace: "pre",
                   textAlign: "center",
                   width: "100%",
                   fontSize: "18px",
                   fontWeight: "bold",
                   fontFamily: '"Arial Black", sans-serif',
                   top: "110px",
                 }}
               >
                 BARANGAY 145 ZONES 13 DIST. 1
               </div>
       
               <div
                 style={{
                   position: "absolute",
                   whiteSpace: "pre",
                   textAlign: "center",
                   width: "100%",
                   fontSize: "18px",
                   fontWeight: "bold",
                   fontFamily: '"Arial Black", sans-serif',
                   top: "138px",
                 }}
               >
                 Tel. No. 8711 - 7134
               </div>
       
               <div
                 style={{
                   position: "absolute",
                   whiteSpace: "pre",
                   textAlign: "center",
                   width: "100%",
                   fontSize: "19px",
                   fontWeight: "bold",
                   fontFamily: '"Arial Black", sans-serif',
                   top: "166px",
                 }}
               >
                 OFFICE OF THE BARANGAY CHAIRMAN
               </div>
       
               <div
                 style={{
                   position: "absolute",
                   top: "220px",
                   width: "100%",
                   textAlign: "center",
                 }}
               >
                 <span
                   style={{
                     fontFamily: '"Brush Script MT", cursive',
                     fontSize: "30px",
                     fontWeight: "normal",
                     display: "inline-block",
                     background: "#0b7030",
                     color: "#fff",
                     padding: "4px 70px",
                     borderRadius: "8px",
                   }}
                 >
                   Certificate of Indigency
                 </span>
               </div>
       
               {/* Date */}
               <div
                 style={{
                   position: "absolute",
                   whiteSpace: "pre",
                   top: "320px",
                   right: "250px",
                   fontFamily: '"Times New Roman", serif',
                   fontSize: "12pt",
                   fontWeight: "bold",
                   color: "red",
                 }}
               >
                 Date: {display.date_issued ? formatDate(display.date_issued) : ""}
               </div>
       
               {/* Body */}
               <div
                 style={{
                   position: "absolute",
                   whiteSpace: "pre",
                   top: "370px",
                   left: "80px",
                   width: "640px",
                   textAlign: "justify",
                   fontFamily: '"Times New Roman", serif',
                   fontSize: "12pt",
                   fontWeight: "bold",
                   color: "black",
                 }}
               >
                 To whom it may concern:<br />
                 <span style={{ marginLeft: "50px" }}></span>This is to certify that the person whose name and thumb print
                 appear<br /> here on has requested a Certificate of Indigency from this office
                 and the result/s<br />  is/arelisted below and valid for six (6) months only.
               </div>
       
               {/* Info */}
               <div
                 style={{
                   position: "absolute",
                   whiteSpace: "pre",
                   top: "470px",
                   left: "80px",
                   width: "640px",
                   lineHeight: "1.6",
                   fontFamily: '"Times New Roman", serif',
                   fontSize: "12pt",
                   fontWeight: "bold",
                 }}
               >
                 <div>
                  
                   <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif' }}>Name:</span>{" "}
                                  <span style={{ color: "black", marginLeft: "10px" }}>{display.full_name || ""}</span><br />
                   <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif' }}>Address:</span>{" "}
                                  <span style={{ color: "black", marginLeft: "10px" }}>{display.address || ""}</span><br />
                   <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif'  }}>Birthday:</span>{" "}
                                   <span style={{ color: "black", marginLeft: "10px" }}>{display.dob ? formatDate(display.dob) : ""}</span>
                   <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif',  marginLeft: "320px" }}>Age:</span>{" "}
                                   <span style={{ color: "black", marginLeft: "10px" }}>{display.age || ""}</span><br />
                   <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif'  }}>Provincial Address:</span>{" "}
                                   <span style={{ color: "black", marginLeft: "10px" }}>{display.provincial_address || ""}</span>
                   <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif',  marginLeft: "200px" }}>Contact No.:</span>{" "}
                                   <span style={{ color: "black", marginLeft: "10px" }}>{display.contact_no || ""}</span><br />
                   <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif'  }}>Civil Status:</span>{" "}
                                   <span style={{ color: "black", marginLeft: "10px" }}>{display.civil_status || ""}</span><br />

                   <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif'  }}>Remarks:</span>{" "}
                   <span style={{ color: "black", fontWeight: "bold", fontFamily: '"Times New Roman", serif'  }}>
                     {display.remarks || ""}
                   </span>{" "}<br />
                   <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif'  }}>
                     This certification is being issued upon request for</span>{" "}
                                   <span style={{ color: "black" }}>{display.request_reason || ""}</span>

                  
                 </div>
               </div>
       
               {/* Applicant Signature */}
               <div
                 style={{
                   position: "absolute",
                   top: "750px",
                   left: "50px",
                   width: "250px",
                   textAlign: "center",
                   fontFamily: '"Times New Roman", serif',
                   fontSize: "12pt",
                   fontWeight: "bold",
                 }}
               >
                 <div style={{ borderTop: "2px solid #000", width: "65%", margin: "auto"}}></div>
                 <div style={{ color: "black", fontFamily: "inherit" }}>Applicant&apos;s Signature</div>
                 <div
                   style={{
                     margin: "15px auto 0 auto",
                     width: "150px",
                     height: "75px",
                     border: "1px solid #000",
                   }}
                 ></div>
               </div>
       
               {/* Punong Barangay */}
               <div
                 style={{
                   position: "absolute",
                   top: "900px",
                   right: "100px",
                   width: "300px",
                   textAlign: "center",
                 }}
               >
                 <div style={{ borderTop: "2.5px solid #000", width: "90%", margin: "auto" }}></div>
                 <div
                   style={{
                     fontFamily: "Impact, sans-serif",
                     fontSize: "25pt",
                     fontWeight: "bold",
                     backgroundImage: "linear-gradient(to bottom, orange 50%, yellow 20%, orange 70%)", 
                     WebkitBackgroundClip: "text",
                     WebkitTextFillColor: "transparent",
                     WebkitTextStroke: "1px black",
                     display: "inline-block", // keeps gradient tight to text
                   }}
                 >
                   Arnold Dondonayos
                 </div>
       
       
                 <div
                   style={{
                     fontFamily: '"Brush Script MT", cursive',
                     fontSize: "20pt",
                     color: "#000",
                     marginTop: "-8px",
                     fontWeight: "bold",
                   }}
                 >
                   Punong Barangay
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
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#445C3C' }}>
          Indigency
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
                {editingId ? "Edit Record" : "New Indigency Record"}
              </Typography>
            }
            subheader={
              selectedRecord && !editingId && (
                <Typography variant="caption" sx={{ color: 'grey.500' }}>
                  Viewing: {selectedRecord.full_name}
                </Typography>
              )
            }
            sx={{ borderBottom: 1, borderColor: 'grey.200' }}
          />
          
          <CardContent>
            <Stack spacing={2}>

              <Autocomplete
                options={residents}
                getOptionLabel={(option) => option.full_name}
                value={residents.find(r => r.full_name === formData.full_name) || null}
                onChange={(event, newValue) => {
                  if (newValue) {
                    // Auto-fill form fields from selected resident
                    setFormData({
                      ...formData,
                      resident_id: newValue.resident_id,
                      full_name: newValue.full_name,
                      address: newValue.address || "",
                      provincial_address: newValue.provincial_address || "",
                      dob: newValue.dob?.slice(0, 10) || "",
                      age: newValue.age ? String(newValue.age) : "",
                      civil_status: newValue.civil_status || "Single",
                      contact_no: newValue.contact_no || "",
                    });
                  } else {
                    setFormData({ ...formData, full_name: "" });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Full Name *"
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: 'success.main' },
                        '&.Mui-focused fieldset': { borderColor: 'success.main' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: 'success.main' },
                    }}
                  />
                )}
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
                    value={formData.dob}
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
                value={formData.provincial_address}
                onChange={(e) => setFormData({ ...formData, provincial_address: e.target.value })}
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
                value={formData.contact_no}
                onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
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
                  value={formData.civil_status}
                  label="Civil Status *"
                  onChange={(e) => setFormData({ ...formData, civil_status: e.target.value })}
                >
                  {civilStatusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

               <TextField
                label="Remarks *"
                variant="outlined"
                size="small"
                fullWidth
                multiline
                rows={2}
                
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
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
                label="Request Reason *"
                variant="outlined"
                size="small"
                fullWidth
                multiline
                rows={2}
                placeholder="Job application, School enrollment, etc."
                value={formData.request_reason}
                onChange={(e) => setFormData({ ...formData, request_reason: e.target.value })}
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
                value={formData.date_issued}
                onChange={(e) => setFormData({ ...formData, date_issued: e.target.value })}
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
                  key={record.indigency_id} 
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
                          {record.full_name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'grey.600', display: 'block', mb: 0.5 }}>
                          {record.address}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                          <Chip 
                            label={record.civil_status} 
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
                              {record.contact_no}
                            </Typography>
                          )}
                          <Typography variant="caption" sx={{ color: 'grey.400', fontSize: '0.625rem' }}>
                            Issued: {formatDate(record.date_issued)}
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
                          onClick={() => handleDelete(record.indigency_id)}
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




