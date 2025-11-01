import React, { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CaloocanLogo from "../../assets/CaloocanLogo.png";
import Logo145 from "../../assets/Logo145.png";
import BagongPilipinas from "../../assets/BagongPilipinas.png";
import WordName from "../../assets/WordName.png";

import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Autocomplete,
  Grid,
  Box,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  createTheme,
  ThemeProvider,
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
  QrCodeScanner as QrCodeIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
} from "@mui/icons-material";

import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RestartAlt as ResetIcon,
} from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: { main: "#41644A", light: "#A0B2A6", dark: "#0D4715" },
    secondary: { main: "#E9762B" },
    background: { default: "#F1F0E9", paper: "#FFFFFF" },
    text: { primary: "#0D4715", secondary: "#41644A" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: "8px" },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": { borderRadius: "8px" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#41644A" },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          "&.Mui-selected": { backgroundColor: "#FFFFFF", color: "#41644A" },
        },
      },
    },
    MuiTabs: { styleOverrides: { indicator: { display: "none" } } },
  },
});

export default function SoloParentForm() {
  // API base - update if needed
  const apiBase = "http://localhost:5000";

  // UI State
  const [records, setRecords] = useState([]);
  const [residents, setResidents] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.75);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // form fields matching your solo_parent DB
  const emptyForm = {
    resident_id: "",
    name: "",
    age: "",
    address: "",
    year_of_residency: "",
    unwed_year: "",
    daughter_name: "",
    daughter_age: "",
    daughter_birthday: "",
    son_name: "",
    son_age: "",
    son_birthday: "",
    date_issued: new Date().toISOString().split("T")[0],
    transaction_number: "",
  };

  const [formData, setFormData] = useState({ ...emptyForm });

  // load initial data
  useEffect(() => {
    loadResidents();
    loadRecords();
  }, []);

  async function loadResidents() {
    try {
      const res = await fetch(`${apiBase}/residents`);
      const data = await res.json();
      const formatted = Array.isArray(data)
        ? data.map((r) => ({
            ...r,
            full_name:
              r.full_name ||
              r.name ||
              `${r.first_name || ""} ${r.last_name || ""}`,
            dob: r.dob ? r.dob.split("T")[0] : "",
          }))
        : [];
      setResidents(formatted);
    } catch (e) {
      console.error("loadResidents:", e);
    }
  }

  async function loadRecords() {
    try {
      const res = await fetch(`${apiBase}/solo-parent`);
      const data = await res.json();
      const mapped = Array.isArray(data)
        ? data.map((r) => ({
            id: r.id,
            resident_id: r.resident_id,
            name: r.name || "",
            age: String(r.age ?? ""),
            address: r.address || "",
            year_of_residency: r.year_of_residency
              ? r.year_of_residency.split("T")[0]
              : "",
            unwed_year: r.unwed_year ? r.unwed_year.split("T")[0] : "",
            daughter_name: r.daughter_name || "",
            daughter_age: r.daughter_age || "",
            daughter_birthday: r.daughter_birthday
              ? r.daughter_birthday.split("T")[0]
              : "",
            son_name: r.son_name || "",
            son_age: r.son_age || "",
            son_birthday: r.son_birthday ? r.son_birthday.split("T")[0] : "",
            date_issued: r.date_issued ? r.date_issued.split("T")[0] : "",
            transaction_number:
              r.transaction_number || generateTransactionNumber(),
            date_created: r.date_created || null,
            date_updated: r.date_updated || null,
          }))
        : [];
      setRecords(mapped);
    } catch (e) {
      console.error("loadRecords:", e);
    }
  }

  // helpers: dates, transaction number
  function formatDateDisplay(dateString) {
    if (!dateString) return "";
    const d = dateString.includes("T") ? dateString.split("T")[0] : dateString;
    const [y, m, day] = d.split("-");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[parseInt(m, 10) - 1]} ${parseInt(day, 10)}, ${y}`;
  }

  function generateTransactionNumber(prefix = "SP") {
    const date = new Date();
    const yy = date.getFullYear().toString().slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const rnd = Math.floor(Math.random() * 900) + 100;
    return `${prefix}-${yy}${mm}${dd}-${rnd}`;
  }

  // birthday -> age calculation
  function handleBirthdayChange(field, value) {
    setFormData((p) => ({ ...p, [field]: value }));
    if (value) {
      const b = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - b.getFullYear();
      const m = today.getMonth() - b.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
      if (field === "daughter_birthday")
        setFormData((p) => ({ ...p, daughter_age: String(age) }));
      if (field === "son_birthday")
        setFormData((p) => ({ ...p, son_age: String(age) }));
    }
  }

  // display object used by preview and QR
  const display = useMemo(() => {
    if (editingId || isFormOpen) return formData;
    if (selectedRecord) return selectedRecord;
    return formData;
  }, [editingId, isFormOpen, selectedRecord, formData]);

  // QR generation
  useEffect(() => {
    const generateQRCode = async () => {
      if (!display) {
        setQrCodeUrl("");
        return;
      }
      const qrContent = `CERT VERIFICATION
Transaction No: ${display.transaction_number || "N/A"}
Name: ${display.name || ""}
Date Issued: ${display.date_issued || ""}
Document Type: Solo Parent Certification
Barangay 145, Caloocan City`;
      try {
        const url = await QRCode.toDataURL(qrContent, {
          width: 160,
          margin: 1,
          errorCorrectionLevel: "L",
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error("QR error:", err);
        setQrCodeUrl("");
      }
    };
    generateQRCode();
  }, [display]);

  // convert form to server payload (snake_case matching DB)
  function toServerPayload(d) {
    return {
      resident_id: d.resident_id || null,
      name: d.name || "",
      age: d.age ? Number(d.age) : null,
      address: d.address || "",
      year_of_residency: d.year_of_residency || null,
      unwed_year: d.unwed_year || null,
      daughter_name: d.daughter_name || "",
      daughter_age: d.daughter_age || "",
      daughter_birthday: d.daughter_birthday || null,
      son_name: d.son_name || "",
      son_age: d.son_age || "",
      son_birthday: d.son_birthday || null,
      date_issued: d.date_issued || null,
      transaction_number: d.transaction_number || "",
    };
  }

  // CRUD actions
  async function handleCreate() {
    try {
      const tx = formData.transaction_number || generateTransactionNumber("SP");
      const payload = toServerPayload({ ...formData, transaction_number: tx });
      const res = await fetch(`${apiBase}/solo-parent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = await res.json();
      // optimistic update using returned id if present
      const newRec = {
        ...payload,
        id: created?.id || Date.now(),
        date_created: new Date().toISOString(),
      };
      setRecords((r) => [newRec, ...r]);
      setSelectedRecord(newRec);
      storeCertificateData(newRec);
      resetForm();
      setActiveTab("records");
    } catch (e) {
      console.error(e);
      alert("Failed to create record");
    }
  }

  async function handleUpdate() {
    if (!editingId) return;
    try {
      const payload = toServerPayload(formData);
      const res = await fetch(`${apiBase}/solo-parent/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = { ...payload, id: editingId };
      setRecords((list) => list.map((r) => (r.id === editingId ? updated : r)));
      setSelectedRecord(updated);
      storeCertificateData(updated);
      resetForm();
      setActiveTab("records");
    } catch (e) {
      console.error(e);
      alert("Failed to update record");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this record?")) return;
    try {
      const res = await fetch(`${apiBase}/solo-parent/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setRecords((list) => list.filter((r) => r.id !== id));
      // remove from localStorage if present
      const existing = JSON.parse(localStorage.getItem("certificates") || "{}");
      delete existing[id];
      localStorage.setItem("certificates", JSON.stringify(existing));
      if (selectedRecord?.id === id) setSelectedRecord(null);
    } catch (e) {
      console.error(e);
      alert("Failed to delete record");
    }
  }

  function handleEdit(record) {
    setFormData({ ...record });
    setEditingId(record.id);
    setIsFormOpen(true);
    setActiveTab("form");
  }

  function handleView(record) {
    setSelectedRecord(record);
    setFormData({ ...record });
    setEditingId(record.id);
    setIsFormOpen(true);
    setActiveTab("form");
  }

  function resetForm() {
    setFormData({ ...emptyForm });
    setEditingId(null);
    setIsFormOpen(false);
    setSelectedRecord(null);
  }

  function handleSubmit() {
    if (editingId) handleUpdate();
    else handleCreate();
  }

  // store certificate for QR verification (localStorage)
  function storeCertificateData(certificateData) {
    if (!certificateData.id) return;
    const existing = JSON.parse(localStorage.getItem("certificates") || "{}");
    existing[certificateData.id] = certificateData;
    localStorage.setItem("certificates", JSON.stringify(existing));
  }

  // transaction search behavior
  function handleTransactionSearch() {
    if (!transactionSearch) return;
    const found = records.find(
      (r) =>
        (r.transaction_number || "").toLowerCase() ===
        transactionSearch.toLowerCase()
    );
    if (found) {
      handleView(found);
    } else alert("No certificate found with this transaction number");
  }

  // PDF generation and print (similar to Indigency for consistency)
  async function generatePDF() {
    if (!display.id) {
      alert("Please save the record first before downloading PDF");
      return;
    }
    setIsGeneratingPDF(true);
    try {
      const el = document.getElementById("solo-parent-certificate");
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: [8.5, 11],
      });
      pdf.addImage(img, "PNG", 0, 0, 8.5, 11);
      const fileName = `SoloParent_${display.id || "draft"}_${(
        display.name || ""
      ).replace(/\s+/g, "_")}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("generatePDF:", err);
      alert("Failed to generate PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  }

  function handlePrint() {
    if (!display.id) {
      alert("Please save the record first before printing");
      return;
    }
    const printWindow = window.open("", "_blank");
    const el = document.getElementById("solo-parent-certificate");
    if (!el) {
      alert("Certificate element missing");
      return;
    }
    const html = el.outerHTML;
    printWindow.document.write(`
      <html><head><title>Print</title><style>
        @page { size: 8.5in 11in; margin: 0; }
        body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        #solo-parent-certificate { width: 8.5in; height: 11in; }
      </style></head><body>${html}<script>window.onload=()=>{window.print();window.onafterprint=()=>window.close();}</script></body></html>
    `);
    printWindow.document.close();
  }

  // QR click handler: verification page if saved, dialog for draft
  const handleQrCodeClick = () => {
    if (display?.id) {
      const url = `${window.location.origin}/verify-certificate?id=${display.id}`;
      window.open(url, "_blank");
    } else setQrDialogOpen(true);
  };

  // Filtering for list and transactions
  const filteredRecords = useMemo(() => {
    const q = (searchTerm || "").toLowerCase();
    return records.filter(
      (r) =>
        (r.name || "").toLowerCase().includes(q) ||
        (r.address || "").toLowerCase().includes(q) ||
        (r.transaction_number || "").toLowerCase().includes(q)
    );
  }, [records, searchTerm]);

  const transactionFilteredRecords = useMemo(
    () =>
      records.filter((r) =>
        (r.transaction_number || "")
          .toLowerCase()
          .includes(transactionSearch.toLowerCase())
      ),
    [records, transactionSearch]
  );

  // Zoom keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "=" || e.key === "+") {
          e.preventDefault();
          setZoomLevel((z) => Math.min(z + 0.1, 2));
        }
        if (e.key === "-") {
          e.preventDefault();
          setZoomLevel((z) => Math.max(z - 0.1, 0.3));
        }
        if (e.key === "0") {
          e.preventDefault();
          setZoomLevel(0.75);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* LEFT: certificate preview */}
        <Box sx={{ flex: 1, overflow: "auto", bgcolor: "background.default" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              p: 2,
              bgcolor: "background.paper",
              borderBottom: 1,
              borderColor: "grey.200",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <IconButton
                onClick={() => setZoomLevel((z) => Math.max(z - 0.1, 0.3))}
                sx={{ border: "1px solid", borderColor: "grey.300" }}
              >
                <ZoomOutIcon />
              </IconButton>
              <Typography
                variant="body2"
                sx={{ minWidth: 60, textAlign: "center", fontWeight: 600 }}
              >
                {Math.round(zoomLevel * 100)}%
              </Typography>
              <IconButton
                onClick={() => setZoomLevel((z) => Math.min(z + 0.1, 2))}
                sx={{ border: "1px solid", borderColor: "grey.300" }}
              >
                <ZoomInIcon />
              </IconButton>
              <IconButton
                onClick={() => setZoomLevel(0.75)}
                sx={{ border: "1px solid", borderColor: "grey.300" }}
                title="Reset"
              >
                <ResetIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<QrCodeIcon />}
                onClick={handleQrCodeClick}
                disabled={!display?.id}
              >
                View Certificate Details
              </Button>
              <Button
                variant="contained"
                startIcon={<FileTextIcon />}
                onClick={generatePDF}
                disabled={!display?.id || isGeneratingPDF}
              >
                {isGeneratingPDF ? "Generating..." : "Download PDF"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={handlePrint}
                disabled={!display?.id}
              >
                Print
              </Button>
            </Box>
          </Box>

          <div
            style={{ display: "flex", justifyContent: "center", padding: 20 }}
          >
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "top center",
              }}
            >
              <div
                id="solo-parent-certificate"
                style={{
                  width: "8.5in",
                  height: "11in",
                  background: "#fff",
                  boxShadow: "0 0 8px rgba(0,0,0,0.2)",
                  position: "relative",
                  boxSizing: "border-box",
                }}
              >
                {/* logos and header */}
                <img
                  src={CaloocanLogo}
                  alt="logo"
                  style={{ position: "absolute", left: 32, top: 20, width: 90 }}
                />
                <img
                  src={Logo145}
                  alt="logo145"
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 10,
                    width: 110,
                  }}
                />
                <div
                  style={{
                    textAlign: "center",
                    marginTop: 70,
                    fontFamily: '"Times New Roman", serif',
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700 }}>
                    Republic Of the Philippines
                  </div>
                  <div style={{ fontSize: 13 }}>City of Caloocan</div>
                  <div style={{ fontSize: 11, marginTop: 6 }}>
                    BARANGAY 145 ZONE 13 DISTRICT 1
                  </div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>
                    OFFICE OF THE BARANGAY CAPTAIN
                  </div>
                </div>

                <div
                  style={{
                    textAlign: "center",
                    marginTop: 40,
                    fontSize: 18,
                    fontWeight: 700,
                    textDecoration: "underline",
                  }}
                >
                  BARANGAY CERTIFICATION
                </div>

                <div
                  style={{
                    padding: "30px 60px 0 60px",
                    fontFamily: '"Times New Roman", serif',
                    fontSize: 12,
                    lineHeight: 1.7,
                    textAlign: "justify",
                  }}
                >
                  <p>
                    <strong>
                      This is to certify that, {display.name || "Name"}{" "}
                      {display.age || "Age"} y/o is a Bonafide resident of{" "}
                      {display.address || "Address"} Barangay 145 of this city,
                      since {display.year_of_residency || "Year"}.
                    </strong>
                  </p>
                  <p>
                    <strong>
                      Upon verification, she is currently not in any form of
                      relationship and is qualified to apply for a Solo Parent
                      ID based on RA 8972.
                    </strong>
                  </p>
                  <p>
                    <strong>
                      Ms. {display.name || "Name"}, is UNWED, since{" "}
                      {display.unwed_year || "Year"}.
                    </strong>
                  </p>
                  <p>
                    <strong>
                      Moreover {display.name || "Name"} has dependents: daughter{" "}
                      {display.daughter_name || "—"} (
                      {display.daughter_age || "—"}) birthday{" "}
                      {display.daughter_birthday || "—"}; son{" "}
                      {display.son_name || "—"} ({display.son_age || "—"})
                      birthday {display.son_birthday || "—"}.
                    </strong>
                  </p>
                  <p>
                    <strong>{display.name || "Name"} is unemployed.</strong>
                  </p>
                  <p>
                    <strong>
                      This certification is issued solely for the purpose of
                      authentication of Ms. {display.name || "Name"},
                      qualification to apply for a Solo Parent ID and receive
                      all benefits that go with it.
                    </strong>
                  </p>
                  <p style={{ marginTop: 20 }}>
                    <strong>
                      Issued this{" "}
                      {display.date_issued
                        ? formatDateDisplay(display.date_issued)
                        : ""}
                      .
                    </strong>
                  </p>
                </div>

                {/* signature area and QR */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 80,
                    left: 60,
                    right: 60,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <div style={{ textAlign: "center", width: 300 }}>
                    <div
                      style={{
                        borderTop: "1px solid #000",
                        width: "80%",
                        margin: "0 auto 8px auto",
                      }}
                    />
                    <div style={{ fontWeight: 700 }}>ROSALINA P. ANORE</div>
                    <div style={{ fontWeight: 700 }}>Brgy. Secretary</div>
                  </div>

                  <div style={{ width: 240, textAlign: "center" }}>
                    <div
                      style={{
                        borderTop: "2px solid #000",
                        width: "65%",
                        margin: "0 auto 8px auto",
                      }}
                    />
                    <div>Applicant's Signature</div>
                    <div
                      style={{
                        marginTop: 10,
                        width: 150,
                        height: 75,
                        border: "1px solid #000",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    />
                    {qrCodeUrl && (
                      <div style={{ marginTop: 12 }}>
                        <img
                          src={qrCodeUrl}
                          alt="qr"
                          style={{
                            width: 150,
                            height: 150,
                            border: "2px solid #000",
                            padding: 6,
                            background: "#fff",
                            cursor: "pointer",
                          }}
                          onClick={handleQrCodeClick}
                        />
                        <div
                          style={{ fontSize: 9, color: "#666", marginTop: 6 }}
                        >
                          {display.date_created
                            ? new Date(display.date_created).toLocaleString()
                            : new Date().toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: "center", width: 300 }}>
                    <div
                      style={{
                        borderTop: "1px solid #000",
                        width: "80%",
                        margin: "0 auto 8px auto",
                      }}
                    />
                    <div style={{ fontWeight: 700 }}>ARNOLD DONDONAYOS</div>
                    <div style={{ fontWeight: 700 }}>Barangay Captain</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>

        {/* RIGHT: CRUD panel with Tabs (Form | Records | Transaction) */}
        <Container
          maxWidth={false}
          sx={{
            flexGrow: 1,
            minWidth: 420,
            maxWidth: 600,
            height: "100vh",
            borderLeft: 1,
            borderColor: "grey.300",
            p: 0,
          }}
          disableGutters
        >
          <Paper
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 0,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                paddingTop: 5,
                bgcolor: "rgba(255,255,255,0.9)",
                borderBottom: 1,
                borderColor: "grey.200",
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
                  sx={{ fontWeight: 800, color: "text.primary" }}
                >
                  Solo Parent Certifications
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                    disabled={!display?.id}
                  >
                    Print
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      resetForm();
                      setIsFormOpen(true);
                      setActiveTab("form");
                    }}
                  >
                    New
                  </Button>
                </Box>
              </Box>

              <Box sx={{ px: 1, pb: 1 }}>
                <Paper
                  sx={{
                    p: 0.5,
                    bgcolor: "background.default",
                    borderRadius: 2,
                  }}
                >
                  <Tabs
                    value={activeTab}
                    onChange={(e, v) => setActiveTab(v)}
                    variant="fullWidth"
                    sx={{ "& .MuiTabs-flexContainer": { gap: 0.5 } }}
                  >
                    <Tab value="form" label="Form" />
                    <Tab
                      value="records"
                      label={`Records (${records.length})`}
                    />
                    <Tab value="transaction" label="Transaction" />
                  </Tabs>
                </Paper>
              </Box>
            </Paper>

            {/* Form Tab */}
            {activeTab === "form" && (
              <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
                <Card>
                  <CardHeader
                    title={
                      <Typography sx={{ fontWeight: 600 }}>
                        {editingId
                          ? "Edit Solo Parent Record"
                          : "New Solo Parent Record"}
                      </Typography>
                    }
                    subheader={
                      selectedRecord &&
                      !editingId && (
                        <Typography variant="caption">
                          Viewing: {selectedRecord.name}
                        </Typography>
                      )
                    }
                    sx={{ borderBottom: 1, borderColor: "grey.200" }}
                  />
                  <CardContent>
                    <Stack spacing={2}>
                      <Autocomplete
                        options={residents}
                        getOptionLabel={(opt) =>
                          opt.full_name || opt.name || ""
                        }
                        value={
                          residents.find(
                            (r) => r.resident_id === formData.resident_id
                          ) || null
                        }
                        onChange={(e, nv) => {
                          if (nv)
                            setFormData((p) => ({
                              ...p,
                              resident_id: nv.resident_id,
                              name: nv.full_name || nv.name || "",
                              address: nv.address || "",
                              age: nv.age ? String(nv.age) : p.age,
                            }));
                          else
                            setFormData((p) => ({
                              ...p,
                              resident_id: "",
                              name: "",
                            }));
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Resident (autocomplete)"
                            size="small"
                            fullWidth
                          />
                        )}
                      />

                      <TextField
                        label="Full Name *"
                        size="small"
                        fullWidth
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, name: e.target.value }))
                        }
                      />
                      <TextField
                        label="Age"
                        size="small"
                        fullWidth
                        value={formData.age}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, age: e.target.value }))
                        }
                      />
                      <TextField
                        label="Address *"
                        size="small"
                        fullWidth
                        value={formData.address}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            address: e.target.value,
                          }))
                        }
                      />

                      <Grid container spacing={1.5}>
                        <Grid item xs={6}>
                          <TextField
                            label="Residents since (date)"
                            type="date"
                            size="small"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.year_of_residency}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                year_of_residency: e.target.value,
                              }))
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Unwed since (date)"
                            type="date"
                            size="small"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.unwed_year}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                unwed_year: e.target.value,
                              }))
                            }
                          />
                        </Grid>
                      </Grid>

                      <TextField
                        label="Daughter Name"
                        size="small"
                        fullWidth
                        value={formData.daughter_name}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            daughter_name: e.target.value,
                          }))
                        }
                      />
                      <Grid container spacing={1.5}>
                        <Grid item xs={6}>
                          <TextField
                            label="Daughter Age"
                            size="small"
                            fullWidth
                            value={formData.daughter_age}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                daughter_age: e.target.value,
                              }))
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Daughter Birthday"
                            size="small"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.daughter_birthday}
                            onChange={(e) =>
                              handleBirthdayChange(
                                "daughter_birthday",
                                e.target.value
                              )
                            }
                          />
                        </Grid>
                      </Grid>

                      <TextField
                        label="Son Name"
                        size="small"
                        fullWidth
                        value={formData.son_name}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            son_name: e.target.value,
                          }))
                        }
                      />
                      <Grid container spacing={1.5}>
                        <Grid item xs={6}>
                          <TextField
                            label="Son Age"
                            size="small"
                            fullWidth
                            value={formData.son_age}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                son_age: e.target.value,
                              }))
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Son Birthday"
                            size="small"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.son_birthday}
                            onChange={(e) =>
                              handleBirthdayChange(
                                "son_birthday",
                                e.target.value
                              )
                            }
                          />
                        </Grid>
                      </Grid>

                      <TextField
                        label="Date Issued"
                        type="date"
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={formData.date_issued}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            date_issued: e.target.value,
                          }))
                        }
                      />

                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          onClick={handleSubmit}
                          variant="contained"
                          startIcon={<SaveIcon />}
                          fullWidth
                        >
                          {editingId ? "Update" : "Save"}
                        </Button>
                        {(editingId || isFormOpen) && (
                          <Button
                            onClick={resetForm}
                            variant="outlined"
                            startIcon={<CloseIcon />}
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
                    placeholder="Search records by name, address, or transaction number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "grey.400" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1, px: 1.5, pb: 1.5, overflow: "auto" }}>
                  {filteredRecords.length === 0 ? (
                    <Paper
                      sx={{ p: 3, textAlign: "center", color: "grey.500" }}
                    >
                      <Typography variant="body2">
                        {searchTerm ? "No records found" : "No records yet"}
                      </Typography>
                    </Paper>
                  ) : (
                    <Stack spacing={1}>
                      {filteredRecords.map((record) => (
                        <Card key={record.id} sx={{ boxShadow: 1 }}>
                          <CardContent sx={{ p: 1.5 }}>
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
                                  sx={{ fontWeight: 600 }}
                                >
                                  {record.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "grey.600", display: "block" }}
                                >
                                  {record.address}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 0.5,
                                    alignItems: "center",
                                    mt: 0.5,
                                  }}
                                >
                                  <Chip
                                    label={record.transaction_number || "—"}
                                    size="small"
                                  />
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "grey.400" }}
                                  >
                                    Issued:{" "}
                                    {formatDateDisplay(record.date_issued)}
                                  </Typography>
                                </Box>
                              </Box>

                              <Box sx={{ display: "flex", gap: 0.5 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleView(record)}
                                  title="View"
                                >
                                  <EyeIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(record)}
                                  title="Edit"
                                >
                                  <EditIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(record.id)}
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

            {/* Transaction Tab */}
            {activeTab === "transaction" && (
              <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
                <Card sx={{ mb: 2 }}>
                  <CardHeader
                    title={
                      <Typography sx={{ fontWeight: 600 }}>
                        Search by Transaction Number
                      </Typography>
                    }
                    sx={{ borderBottom: 1, borderColor: "grey.200" }}
                  />
                  <CardContent>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter transaction no (e.g. SP-231001-123)"
                        value={transactionSearch}
                        onChange={(e) => setTransactionSearch(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ReceiptIcon sx={{ color: "grey.400" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleTransactionSearch}
                        startIcon={<SearchIcon />}
                      >
                        Search
                      </Button>
                    </Box>
                    <Typography variant="caption" sx={{ color: "grey.500" }}>
                      Transaction numbers are generated on save. Format:
                      SP-YYMMDD-XXX
                    </Typography>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader
                    title={
                      <Typography sx={{ fontWeight: 600 }}>
                        Recent Transactions
                      </Typography>
                    }
                    sx={{ borderBottom: 1, borderColor: "grey.200" }}
                  />
                  <CardContent>
                    {transactionFilteredRecords.length === 0 ? (
                      <Box
                        sx={{ p: 3, textAlign: "center", color: "grey.500" }}
                      >
                        <Typography variant="body2">
                          {transactionSearch
                            ? "No transactions found"
                            : "Enter a transaction number to search"}
                        </Typography>
                      </Box>
                    ) : (
                      <Stack spacing={1}>
                        {transactionFilteredRecords.map((r) => (
                          <Card key={r.id} sx={{ boxShadow: 0 }}>
                            <CardContent sx={{ p: 1.5 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                }}
                              >
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    {r.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "primary.main",
                                      fontWeight: 700,
                                    }}
                                  >
                                    {r.transaction_number}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ display: "block", color: "grey.600" }}
                                  >
                                    {r.address}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "grey.400" }}
                                  >
                                    Issued: {formatDateDisplay(r.date_issued)}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleView(r)}
                                  >
                                    <EyeIcon sx={{ fontSize: 16 }} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEdit(r)}
                                  >
                                    <EditIcon sx={{ fontSize: 16 }} />
                                  </IconButton>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Box>
            )}
          </Paper>
        </Container>

        {/* QR Dialog */}
        <Dialog
          open={qrDialogOpen}
          onClose={() => setQrDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: "primary.main", color: "#fff" }}>
            Certificate Details
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" sx={{ color: "grey.600" }}>
              Certificate ID:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {display?.id || "Draft (Not yet saved)"}
            </Typography>
            <Typography variant="body2" sx={{ color: "grey.600", mt: 1 }}>
              Transaction Number:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {display?.transaction_number || "N/A"}
            </Typography>
            <Typography variant="body2" sx={{ color: "grey.600", mt: 1 }}>
              Name:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {display?.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "grey.600", mt: 1 }}>
              Date Issued:
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              {formatDateDisplay(display?.date_issued)}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setQrDialogOpen(false)}>Close</Button>
            {display?.id && (
              <Button
                variant="contained"
                onClick={() => {
                  window.open(
                    `${window.location.origin}/verify-certificate?id=${display.id}`,
                    "_blank"
                  );
                  setQrDialogOpen(false);
                }}
              >
                Go to Verification Page
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
