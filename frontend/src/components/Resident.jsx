import React, { useEffect, useMemo, useState } from "react";
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
} from "@mui/material";
import {
  Save as SaveIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as FileTextIcon
} from "@mui/icons-material";

export default function Residents() {
  const apiBase = "http://localhost:5000";

  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [searchTerm, setSearchTerm] = useState("");
  

  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    provincial_address: "",
    dob: "",
    age: "",
    civil_status: "Single",
    contact_no: "",
    created_at: new Date().toISOString().split("T")[0],
  });

  const civilStatusOptions = ["Single", "Married", "Widowed", "Divorced", "Separated"];

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    try {
      const res = await fetch(`${apiBase}/residents`);
      const data = await res.json();
      setRecords(
        Array.isArray(data)
          ? data.map((r) => ({
              resident_id: r.resident_id,
              full_name: r.full_name,
              address: r.address,
              provincial_address: r.provincial_address,
              dob: r.dob?.slice(0, 10) || "",
              age: String(r.age ?? ""),
              civil_status: r.civil_status,
              contact_no: r.contact_no || "",
              created_at: r.created_at?.slice(0, 10) || "",
            }))
          : []
      );
    } catch (e) {
      console.error(e);
    }
  }

  function handleDobChange(dob) {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
      setFormData({ ...formData, dob, age: String(age) });
    } else {
      setFormData({ ...formData, dob: "", age: "" });
    }
  }

  function toServerPayload(data) {
    return {
      full_name: data.full_name.trim(),
      address: data.address.trim(),
      provincial_address: data.provincial_address.trim(),
      dob: data.dob || null,
      age: data.age ? Number(data.age) : null,
      civil_status: data.civil_status,
      contact_no: data.contact_no.trim() || null,
      created_at: data.created_at || new Date().toISOString().split("T")[0],
    };
  }

function validateForm() {
  const requiredFields = ["full_name", "address", "dob", "civil_status"];
  for (let field of requiredFields) {
    if (!formData[field].trim()) {
      alert("Please fill all required fields.");
      return false;
    }
  }

  // ✅ Check for duplicate resident (same name + same birthday)
  const isDuplicate = records.some(
    (r) =>
      r.full_name.trim().toLowerCase() === formData.full_name.trim().toLowerCase() &&
      r.dob === formData.dob && // exact same birthdate
      r.resident_id !== editingId // ignore if editing same record
  );

  if (isDuplicate) {
    alert("Resident already exists (same name and date of birth).");
    return false;
  }

  return true;
}


  async function handleCreate() {
    if (!validateForm()) return;
    try {
      const res = await fetch(`${apiBase}/residents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toServerPayload(formData)),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = await res.json();
      const newRec = { ...formData, resident_id: created.resident_id };
      setRecords([newRec, ...records]);
      resetForm();
      alert("Resident added successfully!");
      setActiveTab("records");
    } catch (e) {
      console.error(e);
      alert("Failed to create record");
    }
  }

  async function handleUpdate() {
    if (!validateForm()) return;
    try {
      const res = await fetch(`${apiBase}/residents/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toServerPayload(formData)),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = { ...formData, resident_id: editingId };
      setRecords(records.map((r) => (r.resident_id === editingId ? updated : r)));
      resetForm();
      alert("Resident updated successfully!");
      setActiveTab("records");
    } catch (e) {
      console.error(e);
      alert("Failed to update record");
    }
  }

  function handleEdit(record) {
    setFormData({ ...record });
    setEditingId(record.resident_id);
    setIsFormOpen(true);
    setActiveTab("form");
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this resident?")) return;
    try {
      const res = await fetch(`${apiBase}/residents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setRecords(records.filter((r) => r.resident_id !== id));
      alert("Resident deleted successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to delete resident");
    }
  }

  function resetForm() {
    setFormData({
      full_name: "",
      address: "",
      provincial_address: "",
      dob: "",
      age: "",
      civil_status: "Single",
      contact_no: "",
      created_at: new Date().toISOString().split("T")[0],
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
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: "grey.100",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: 3,
          p: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#445C3C" }}>
            Residents Information
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

        {/* Tabs */}
        <Box sx={{ px: 1, pb: 1 }}>
          <Paper sx={{ p: 0.5, bgcolor: "grey.200", borderRadius: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.5 }}>
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
                  bgcolor: activeTab === "records" ? "white" : "transparent",
                  color: activeTab === "records" ? "success.main" : "grey.600",
                  boxShadow: activeTab === "records" ? 1 : 0,
                }}
              >
                Records ({records.length})
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* FORM */}
        {activeTab === "form" && (
          <Box sx={{ flex: 1, p: 2 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
              <CardHeader
                title={
                  <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600, color: "grey.800" }}>
                    {editingId ? "Edit Resident Record" : "New Resident Record"}
                  </Typography>
                }
              />
              <CardContent>
                <Stack spacing={2}>
                  <TextField
                    label="Full Name *"
                    size="small"
                    fullWidth
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                  <TextField
                    label="Address *"
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                  <Grid container spacing={1.5}>
                    <Grid item xs={6}>
                      <TextField
                        label="Date of Birth *"
                        type="date"
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={formData.dob}
                        onChange={(e) => handleDobChange(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField label="Age" size="small" fullWidth value={formData.age} InputProps={{ readOnly: true }} />
                    </Grid>
                  </Grid>
                  <TextField
                    label="Provincial Address"
                    size="small"
                    fullWidth
                    value={formData.provincial_address}
                    onChange={(e) => setFormData({ ...formData, provincial_address: e.target.value })}
                  />
                  <TextField
                    label="Contact Number"
                    size="small"
                    fullWidth
                    value={formData.contact_no}
                    onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
                  />
                  <FormControl fullWidth size="small">
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

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      fullWidth
                      sx={{
                        background: "linear-gradient(45deg, #2e7d32, #388e3c)",
                        "&:hover": {
                          background: "linear-gradient(45deg, #1b5e20, #2e7d32)",
                        },
                      }}
                      onClick={handleSubmit}
                    >
                      {editingId ? "Update" : "Save"}
                    </Button>
                    {(editingId || isFormOpen) && (
                      <Button variant="outlined" startIcon={<CloseIcon />} onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* RECORDS */}
        {activeTab === "records" && (
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 1.5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search residents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "grey.400", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ flex: 1, overflow: "auto", px: 1.5, pb: 1.5 }}>
              {filteredRecords.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: "center", color: "grey.500" }}>
                  <Typography variant="body2">
                    {searchTerm ? "No residents found" : "No records yet"}
                  </Typography>
                </Paper>
              ) : (
                <Stack spacing={1}>
                  {filteredRecords.map((record) => (
                    <Card key={record.resident_id} sx={{ boxShadow: 1 }}>
                      <CardContent sx={{ p: 1.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {record.full_name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "grey.600" }}>
                              {record.address}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              <Chip
                                label={record.civil_status}
                                size="small"
                                sx={{ bgcolor: "grey.100", fontSize: "0.625rem" }}
                              />
                              {record.contact_no && (
                                <Typography variant="caption" sx={{ color: "grey.500", fontSize: "0.625rem" }}>
                                  {record.contact_no}
                                </Typography>
                              )}
                              <Typography variant="caption" sx={{ color: "grey.400", fontSize: "0.625rem" }}>
                                Added: {formatDate(record.created_at)}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <IconButton size="small" onClick={() => handleEdit(record)}>
                              <EditIcon sx={{ fontSize: 16, color: "#2e7d32" }} />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDelete(record.resident_id)}>
                              <DeleteIcon sx={{ fontSize: 16, color: "#d32f2f" }} />
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
      </Box>
    </Box>
  );
}
