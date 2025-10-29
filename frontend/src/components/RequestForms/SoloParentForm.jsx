import React, { useEffect, useMemo, useState } from "react";
import CaloocanLogo from "../../assets/CaloocanLogo.png";
import Logo145 from "../../assets/Logo145.png";
import BagongPilipinas from "../../assets/BagongPilipinas.png";

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
} from "@mui/material";
import {
  Add as AddIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Visibility as EyeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as FileTextIcon,
} from "@mui/icons-material";

export default function SoloParentForm() {
  const apiBase = "http://localhost:5000";

  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    address: "",
    residentsSinceYear: "",
    unwedSinceYear: "",
    daughterName: "",
    daughterAge: "",
    daughterBirthday: "",
    daughterLevel: "",
    sonName: "",
    sonAge: "",
    sonBirthday: "",
    sonLevel: "",
    employmentStatus: "", // "Employed" or "Unemployed"
    dateIssued: new Date().toISOString().split("T")[0],
  });

  const civilStatusOptions = [
    "Single",
    "Married",
    "Widowed",
    "Divorced",
    "Separated",
  ];
  const employmentOptions = ["Employed", "Unemployed"];

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
      const age = Math.floor(
        (today - birthDate) / (365.25 * 24 * 60 * 60 * 1000)
      );
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
      const res = await fetch(`${apiBase}/request-records/${id}`, {
        method: "DELETE",
      });
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
      age: "",
      address: "",
      residentsSinceYear: "",
      unwedSinceYear: "",
      daughterName: "",
      daughterAge: "",
      daughterBirthday: "",
      daughterLevel: "",
      sonName: "",
      sonAge: "",
      sonBirthday: "",
      sonLevel: "",
      employmentStatus: "",
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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    // Function to add ordinal suffix (st, nd, rd, th)
    const getOrdinal = (n) => {
      if (n > 3 && n < 21) return "th";
      switch (n % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${getOrdinal(day)} day of ${month}, ${year}`;
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", display: "flex" }}>
      {/* LEFT: Certificate preview (previous layout) */}
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
              {/* Placeholder for Logos */}
              <div
                style={{
                  position: "absolute",
                  width: "90px",
                  height: "100px",
                  top: "28px",
                  left: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                }}
              >
                <img
                  src={CaloocanLogo}
                  alt="City Logo"
                  style={{
                    position: "absolute",
                    width: "90px",
                    top: "20px",
                    left: "32px",
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  width: "92px",
                  height: "107px",
                  top: "26px",
                  right: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  color: "#999",
                }}
              >
                <img
                  src={Logo145}
                  alt="Logo 145"
                  style={{
                    position: "absolute",
                    width: "110px",
                    top: "5px",
                    right: "5px",
                  }}
                />
              </div>

              {/* Watermark placeholder */}
              <div
                style={{
                  position: "absolute",
                  top: "200px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  opacity: 0.2,
                  width: "500px",
                  height: "500px",
                  border: "2px dashed #ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              >
                <img src={Logo145} alt="Logo 145" />
              </div>

              {/* Header */}
              <div
                style={{
                  position: "absolute",
                  top: "70px",
                  width: "100%",
                  textAlign: "center",
                  fontSize: "14pt",
                  fontWeight: "bold",
                  lineHeight: 1.5,
                }}
              >
                <div
                  style={{
                    fontFamily: 'Lucida Calligraphy, "Times New Roman", serif',
                  }}
                >
                  Republic Of the Philippines
                </div>
                <div style={{ fontSize: "13pt" }}>City of Caloocan</div>
                <div
                  style={{
                    fontSize: "12pt",
                    marginTop: "4px",
                    fontFamily: "Bodoni MT Black",
                  }}
                >
                  BARANGAY 145 ZONE 13 DISTRICT 1
                </div>
                <div
                  style={{
                    fontSize: "11pt",
                    marginTop: "8px",
                    fontFamily: "Bodoni MT Black",
                  }}
                >
                  OFFICE OF THE BARANGAY CAPTAIN
                </div>
              </div>

              {/* Title */}
              <div
                style={{
                  position: "absolute",
                  top: "190px",
                  width: "100%",
                  textAlign: "center",
                  fontFamily: 'Bodoni MT Black, "Times New Roman", serif',
                  fontSize: "18pt",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  letterSpacing: "1px",
                }}
              >
                BARANGAY CERTIFICATION
              </div>

              {/* Main Content */}
              <div
                style={{
                  position: "absolute",
                  top: "270px",
                  left: "60px",
                  width: "680px",
                  fontFamily: '"Times New Roman", serif',
                  fontSize: "12pt",
                  lineHeight: 1.8,
                  textAlign: "justify",
                  zIndex: 1,
                }}
              >
                <p style={{ marginBottom: "20px" }}>
                  <strong>
                    This is to certify that, {display.name || "Name"},{" "}
                    {display.age || "Age"} y/o is a Bonafide resident of{" "}
                    {display.address || "Address"} Barangay 145 of this city,
                    since {display.yearOfResidency || "Year"}.
                  </strong>
                </p>

                <p style={{ marginBottom: "20px" }}>
                  <strong>
                    Upon verification, she is currently not in any form of
                    relationship and is qualified to apply for a Solo Parent ID
                    based on the classification set forth by RA 8972, otherwise
                    known as the Solo Parents Welfare Act 2000.
                  </strong>
                </p>

                <p style={{ marginBottom: "20px" }}>
                  <strong>
                    Ms. {display.name || "Name"}, is UNWED, since,{" "}
                    {display.unwedYear || "Year"}.
                  </strong>
                </p>

                <p style={{ marginBottom: "20px" }}>
                  <strong>
                    Moreover {display.name || "Name"} has two qualified
                    dependent living with her, her daughter{" "}
                    {display.daughterName || " Daughter Name"},{" "}
                    {display.daughterAge || "Daughter Age"} y/o, birthday-
                    {display.daughterBirthday || "Daugther Birthday"}; her son{" "}
                    {display.sonName || "Son Name"},{" "}
                    {display.sonAge || "Son Age"} y/o, birthday-
                    {display.sonBirthday || "Son Birthday"}, Kinder student.
                  </strong>
                </p>

                <p style={{ marginBottom: "20px" }}>
                  <strong>{display.name || "Name"} is unemployed.</strong>
                </p>

                <p style={{ marginBottom: "30px" }}>
                  <strong>
                    This certification is issued solely for the purpose of
                    authentication of Ms. {display.name || "Name"},
                    qualification to apply for a Solo Parent ID and receive all
                    benefits that go with it.
                  </strong>
                </p>

                <p style={{ marginBottom: "40px" }}>
                  <strong>
                    Issued this{" "}
                    {display.dateIssued ? formatDate(display.dateIssued) : ""}.
                  </strong>
                </p>
              </div>

              {/* Bottom Section */}
              <div
                style={{
                  position: "absolute",
                  bottom: "80px",
                  left: "60px",
                  width: "680px",
                  fontFamily: '"Times New Roman", serif',
                  fontSize: "12pt",
                  fontWeight: "bold",
                }}
              >
                <div style={{ marginBottom: "50px" }}>
                  Brgy. SOLO PARENT Focal Person/Barangay Officials
                </div>

                {/* Signatures */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "50px",
                  }}
                >
                  <div style={{ textAlign: "center", width: "300px" }}>
                    <div
                      style={{
                        borderTop: "1px solid #000",
                        width: "80%",
                        margin: "0 auto 8px auto",
                      }}
                    ></div>
                    <div style={{ fontWeight: "bold" }}>ROSALINA P. ANORE</div>
                    <div style={{ fontWeight: "bold" }}>Brgy. Secretary</div>
                  </div>

                  <div style={{ textAlign: "center", width: "300px" }}>
                    <div
                      style={{
                        borderTop: "1px solid #000",
                        width: "80%",
                        margin: "0 auto 8px auto",
                      }}
                    ></div>
                    <div style={{ fontWeight: "bold" }}>ARNOLD DONDONAYOS</div>
                    <div style={{ fontWeight: "bold" }}>Barangay Captain</div>
                  </div>
                </div>
              </div>

              {/* Signature Area */}
            </div>
          </div>
        </Box>
      </Box>

      {/* RIGHT: CRUD container */}
      <Container maxWidth="sm" disableGutters sx={{ height: "100vh" }}>
        <Paper
          sx={{
            bgcolor: "grey.50",
            borderLeft: 1,
            borderColor: "grey.300",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Sticky Header */}
          <Paper
            elevation={0}
            sx={{
              position: "sticky",
              paddingTop: 5,
              zIndex: 10,
              bgcolor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(8px)",
              borderBottom: 1,
              borderColor: "grey.300",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#445C3C" }}
              >
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
                  textTransform: "none",
                  fontSize: "0.875rem",
                  color: "grey.700",
                  borderColor: "grey.400",
                  "&:hover": {
                    bgcolor: "#445C3C",
                    color: "#ffffff",
                  },
                }}
              >
                New
              </Button>
            </Box>

            <Box sx={{ px: 1, pb: 1 }}>
              <Paper sx={{ p: 0.5, bgcolor: "grey.200", borderRadius: 2 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 0.5,
                  }}
                >
                  <Button
                    onClick={() => setActiveTab("form")}
                    variant={activeTab === "form" ? "contained" : "text"}
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      py: 1,
                      bgcolor: activeTab === "form" ? "white" : "transparent",
                      color: activeTab === "form" ? "success.main" : "grey.600",
                      boxShadow: activeTab === "form" ? 1 : 0,
                      "&:hover": {
                        bgcolor: activeTab === "form" ? "white" : "grey.300",
                        color:
                          activeTab === "form" ? "success.main" : "grey.800",
                      },
                    }}
                  >
                    Form
                  </Button>
                  <Button
                    onClick={() => setActiveTab("records")}
                    variant={activeTab === "records" ? "contained" : "text"}
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      py: 1,
                      bgcolor:
                        activeTab === "records" ? "white" : "transparent",
                      color:
                        activeTab === "records" ? "success.main" : "grey.600",
                      boxShadow: activeTab === "records" ? 1 : 0,
                      "&:hover": {
                        bgcolor: activeTab === "records" ? "white" : "grey.300",
                        color:
                          activeTab === "records" ? "success.main" : "grey.800",
                      },
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
            <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
              <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
                <CardHeader
                  title={
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "grey.800",
                      }}
                    >
                      {editingId ? "Edit Record" : "New Clearance Record"}
                    </Typography>
                  }
                  subheader={
                    selectedRecord &&
                    !editingId && (
                      <Typography variant="caption" sx={{ color: "grey.500" }}>
                        Viewing: {selectedRecord.name}
                      </Typography>
                    )
                  }
                  sx={{ borderBottom: 1, borderColor: "grey.200" }}
                />

                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      label="Full Name *"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "success.main",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "success.main",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "success.main",
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
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "success.main",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "success.main",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "success.main",
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
                            "& .MuiOutlinedInput-root": {
                              "&:hover fieldset": {
                                borderColor: "success.main",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "success.main",
                              },
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "success.main",
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
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "grey.100",
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          provincialAddress: e.target.value,
                        })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "success.main",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "success.main",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "success.main",
                        },
                      }}
                    />

                    <TextField
                      label="Daughter Name"
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder=""
                      value={formData.daughterName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          daughterName: e.target.value,
                        })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "success.main",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "success.main",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "success.main",
                        },
                      }}
                    />

                    <FormControl
                      fullWidth
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "success.main",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "success.main",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "success.main",
                        },
                      }}
                    >
                      <InputLabel>Civil Status *</InputLabel>
                      <Select
                        value={formData.civilStatus}
                        label="Civil Status *"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            civilStatus: e.target.value,
                          })
                        }
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requestReason: e.target.value,
                        })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "success.main",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "success.main",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "success.main",
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
                      onChange={(e) =>
                        setFormData({ ...formData, dateIssued: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "success.main",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "success.main",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "success.main",
                        },
                      }}
                    />

                    <Box sx={{ display: "flex", gap: 1, pt: 1 }}>
                      <Button
                        onClick={handleSubmit}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        fullWidth
                        sx={{
                          background:
                            "linear-gradient(45deg, #2e7d32, #388e3c)",
                          "&:hover": {
                            background:
                              "linear-gradient(45deg, #1b5e20, #2e7d32)",
                          },
                          fontWeight: 500,
                          py: 1.25,
                          textTransform: "none",
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
                            color: "grey.700",
                            borderColor: "grey.400",
                            "&:hover": {
                              bgcolor: "grey.100",
                              borderColor: "grey.400",
                            },
                            py: 1.25,
                            px: 2,
                            textTransform: "none",
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
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
                        <SearchIcon sx={{ color: "grey.400", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "success.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "success.main",
                      },
                    },
                  }}
                />
              </Box>

              <Box sx={{ flex: 1, overflow: "auto", px: 1.5, pb: 1.5 }}>
                {filteredRecords.length === 0 ? (
                  <Paper sx={{ p: 3, textAlign: "center", color: "grey.500" }}>
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
                          "&:hover": {
                            boxShadow: 2,
                          },
                          transition: "box-shadow 0.2s",
                        }}
                      >
                        <CardContent
                          sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: "grey.900",
                                  mb: 0.5,
                                }}
                              >
                                {record.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "grey.600",
                                  display: "block",
                                  mb: 0.5,
                                }}
                              >
                                {record.address}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                  alignItems: "center",
                                }}
                              >
                                <Chip
                                  label={record.civilStatus}
                                  size="small"
                                  sx={{
                                    bgcolor: "grey.100",
                                    color: "grey.700",
                                    fontSize: "0.625rem",
                                    height: 20,
                                  }}
                                />
                                {record.contactNo && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "grey.500",
                                      fontSize: "0.625rem",
                                    }}
                                  >
                                    {record.contactNo}
                                  </Typography>
                                )}
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "grey.400",
                                    fontSize: "0.625rem",
                                  }}
                                >
                                  Issued: {formatDate(record.dateIssued)}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: "flex", gap: 0.5, ml: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleView(record)}
                                sx={{
                                  color: "info.main",
                                  "&:hover": { bgcolor: "info.lighter" },
                                  p: 0.75,
                                }}
                                title="View"
                              >
                                <EyeIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(record)}
                                sx={{
                                  color: "success.main",
                                  "&:hover": { bgcolor: "success.lighter" },
                                  p: 0.75,
                                }}
                                title="Edit"
                              >
                                <EditIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(record.id)}
                                sx={{
                                  color: "error.main",
                                  "&:hover": { bgcolor: "error.lighter" },
                                  p: 0.75,
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
