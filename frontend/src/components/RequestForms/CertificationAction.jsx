import React, { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import CaloocanLogo from "../../assets/CaloocanLogo.png";
import Logo145 from "../../assets/Logo145.png";

// MUI
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  IconButton,
  Stack,
  Autocomplete,
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
  Print as PrintIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RestartAlt as ResetIcon,
} from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: { main: "#41644A", light: "#A0B2A6", dark: "#0D4715" },
    success: { main: "#41644A" },
    background: { default: "#F1F0E9", paper: "#FFFFFF" },
    text: { primary: "#0D4715" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: 8 },
      },
    },
  },
});

export default function CertificateOfAction() {
  const apiBase = "http://localhost:5000"; // change to include /api if needed

  const [records, setRecords] = useState([]);
  const [residents, setResidents] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [zoomLevel, setZoomLevel] = useState(0.75);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [formData, setFormData] = useState({
    certificate_of_action_id: "",
    resident_id: "",
    complainant_name: "",
    respondent_name: "",
    barangay_case_no: "",
    request_reason: "",
    filed_date: new Date().toISOString().split("T")[0],
    date_issued: new Date().toISOString().split("T")[0],
    transaction_number: "",
    is_active: 1,
    date_created: "",
  });

  // formatting helpers
  function formatDateDisplay(dateString) {
    if (!dateString) return "";
    const dateOnly = dateString.includes("T") ? dateString.split("T")[0] : dateString;
    const [year, month, day] = dateOnly.split("-");
    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];
    return `${monthNames[parseInt(month,10)-1]} ${parseInt(day,10)}, ${year}`;
  }
  function formatDateTimeDisplay(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
  }

  function generateTransactionNumber() {
    const date = new Date();
    const yy = String(date.getFullYear()).slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `COA-${yy}${mm}${dd}-${rand}`;
  }

  function storeCertificateData(cert) {
    if (!cert) return;
    const existing = JSON.parse(localStorage.getItem("certificates") || "{}");
    const key = cert.certificate_of_action_id || `draft-${cert.transaction_number || "no-txn"}`;
    existing[key] = cert;
    localStorage.setItem("certificates", JSON.stringify(existing));
  }

  async function loadResidents() {
    try {
      const res = await fetch(`${apiBase}/residents`);
      const data = await res.json();
      setResidents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Could not load residents:", err);
    }
  }

  async function loadRecords() {
    try {
      const res = await fetch(`${apiBase}/certificate-of-action`);
      const data = await res.json();
      setRecords(
        Array.isArray(data)
          ? data.map((r) => ({
              certificate_of_action_id: r.certificate_of_action_id,
              resident_id: r.resident_id,
              complainant_name: r.complainant_name,
              respondent_name: r.respondent_name,
              barangay_case_no: r.barangay_case_no,
              request_reason: r.request_reason,
              filed_date: r.filed_date ? r.filed_date.split("T")[0] : "",
              date_issued: r.date_issued ? r.date_issued.split("T")[0] : "",
              transaction_number: r.transaction_number || generateTransactionNumber(),
              is_active: r.is_active ?? 1,
              date_created: r.date_created,
            }))
          : []
      );
    } catch (e) {
      console.error("Failed to load certificate_of_action records", e);
    }
  }

  useEffect(() => {
    loadResidents();
    loadRecords();
  }, []);

  const display = useMemo(() => {
    if (editingId || isFormOpen) return formData;
    if (selectedRecord) return selectedRecord;
    return formData;
  }, [editingId, isFormOpen, selectedRecord, formData]);

  // QR generation: visible for drafts too — once complainant_name exists
  useEffect(() => {
    const make = async () => {
      if (!display || !display.complainant_name) {
        setQrCodeUrl("");
        return;
      }
      const content = `Certificate of Action\nTransaction: ${display.transaction_number || "N/A"}\nComplainant: ${display.complainant_name}\nCase: ${display.barangay_case_no || ""}\nIssued: ${display.date_issued || ""}`;
      try {
        const url = await QRCode.toDataURL(content, { width: 140, margin: 1 });
        setQrCodeUrl(url);
        storeCertificateData(display);
      } catch (err) {
        console.error("QR error", err);
      }
    };
    make();
  }, [display.complainant_name, display.transaction_number, display.barangay_case_no, display.date_issued, display.certificate_of_action_id]);

  function toServerPayload(data) {
    return {
      resident_id: data.resident_id || null,
      complainant_name: data.complainant_name,
      respondent_name: data.respondent_name,
      barangay_case_no: data.barangay_case_no,
      request_reason: data.request_reason,
      filed_date: data.filed_date || null,
      date_issued: data.date_issued || null,
      transaction_number: data.transaction_number,
      is_active: data.is_active ?? 1,
    };
  }

  async function handleCreate() {
    try {
      const tx = generateTransactionNumber();
      const updated = { ...formData, transaction_number: tx, date_created: new Date().toISOString() };
      const res = await fetch(`${apiBase}/certificate-of-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toServerPayload(updated)),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = await res.json();
      const newRec = { ...updated, certificate_of_action_id: created.certificate_of_action_id };
      setRecords([newRec, ...records]);
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
    try {
      const res = await fetch(`${apiBase}/certificate-of-action/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toServerPayload(formData)),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = { ...formData, certificate_of_action_id: editingId };
      setRecords(records.map((r) => (r.certificate_of_action_id === editingId ? updated : r)));
      setSelectedRecord(updated);
      storeCertificateData(updated);
      resetForm();
      setActiveTab("records");
    } catch (e) {
      console.error(e);
      alert("Failed to update record");
    }
  }

  function handleEdit(record) {
    setFormData({
      ...record,
      filed_date: record.filed_date || record.filedDate || "",
      date_issued: record.date_issued || record.dateIssued || "",
    });
    setEditingId(record.certificate_of_action_id);
    setIsFormOpen(true);
    setActiveTab("form");
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this record?")) return;
    try {
      const res = await fetch(`${apiBase}/certificate-of-action/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setRecords(records.filter((r) => r.certificate_of_action_id !== id));
      if (selectedRecord?.certificate_of_action_id === id) setSelectedRecord(null);
      const existing = JSON.parse(localStorage.getItem("certificates") || "{}");
      delete existing[id];
      localStorage.setItem("certificates", JSON.stringify(existing));
    } catch (e) {
      console.error(e);
      alert("Failed to delete record");
    }
  }

  function handleView(record) {
    setSelectedRecord(record);
    setFormData({ ...record });
    setEditingId(record.certificate_of_action_id);
    setIsFormOpen(true);
    setActiveTab("form");
  }

  function resetForm() {
    setFormData({
      certificate_of_action_id: "",
      resident_id: "",
      complainant_name: "",
      respondent_name: "",
      barangay_case_no: "",
      request_reason: "",
      filed_date: new Date().toISOString().split("T")[0],
      date_issued: new Date().toISOString().split("T")[0],
      transaction_number: "",
      is_active: 1,
      date_created: "",
    });
    setEditingId(null);
    setIsFormOpen(false);
    setSelectedRecord(null);
  }

  function handleSubmit() {
    if (editingId) handleUpdate();
    else handleCreate();
  }

  const filteredRecords = useMemo(
    () =>
      records.filter(
        (r) =>
          (r.complainant_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.respondent_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.barangay_case_no || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [records, searchTerm]
  );

  const transactionFilteredRecords = useMemo(
    () => records.filter((r) => (r.transaction_number || "").toLowerCase().includes(transactionSearch.toLowerCase())),
    [records, transactionSearch]
  );

  function handleTransactionSearch() {
    if (!transactionSearch) return;
    const found = records.find((r) => (r.transaction_number || "").toLowerCase() === transactionSearch.toLowerCase());
    if (found) handleView(found);
    else alert("No certificate found with this transaction number");
  }

  async function generatePDF() {
    if (!display.certificate_of_action_id) {
      alert("Please save the record first before downloading PDF");
      return;
    }
    setIsGeneratingPDF(true);
    try {
      const el = document.getElementById("certificate-preview");
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: [8.5, 11] });
      pdf.addImage(imgData, "PNG", 0, 0, 8.5, 11);

      pdf.addPage();
      pdf.setFontSize(18);
      pdf.setFont(undefined, "bold");
      pdf.text("Certificate Verification Information", 0.5, 0.75);
      pdf.setLineWidth(0.02);
      pdf.line(0.5, 0.85, 8, 0.85);
      pdf.setFontSize(12);
      pdf.setFont(undefined, "normal");

      const createdDate = display.date_created ? formatDateTimeDisplay(display.date_created) : new Date().toLocaleString();
      let yPos = 1.2;
      const lineHeight = 0.25;
      const details = [
        `Certificate Type: Certificate of Action`,
        `Certificate ID: ${display.certificate_of_action_id}`,
        `Transaction Number: ${display.transaction_number}`,
        ``,
        `Complainant: ${display.complainant_name}`,
        `Respondent: ${display.respondent_name}`,
        `Case No: ${display.barangay_case_no}`,
        `Request Reason: ${display.request_reason}`,
        ``,
        `Filed Date: ${formatDateDisplay(display.filed_date)}`,
        `Date Issued: ${formatDateDisplay(display.date_issued)}`,
        `Date Created (E-Signature Applied): ${createdDate}`,
        ``,
        `Issued by: Barangay 145 Zone 13 Dist. 1, Caloocan City`,
        `Verification URL: ${window.location.origin}/verify-certificate?id=${display.certificate_of_action_id}`,
      ];
      details.forEach((line) => {
        pdf.text(line, 0.5, yPos);
        yPos += lineHeight;
      });

      const filename = `CertificateOfAction_${display.certificate_of_action_id}_${(display.complainant_name||'').replace(/\s+/g,'_')}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  }

  function handlePrint() {
    if (!display.certificate_of_action_id) { alert("Please save first"); return; }
    const certificateElement = document.getElementById("certificate-preview");
    const printWindow = window.open("", "_blank");
    const certificateHTML = certificateElement.outerHTML;
    printWindow.document.write(`<!doctype html><html><head><title>Print</title><style>body{margin:0}#certificate-preview{width:8.5in;height:11in}</style></head><body>${certificateHTML}<script>window.onload=()=>{window.print();window.onafterprint=()=>window.close();}</script></body></html>`);
    printWindow.document.close();
  }

  const handleZoomIn = () => setZoomLevel((p) => Math.min(p + 0.1, 2));
  const handleZoomOut = () => setZoomLevel((p) => Math.max(p - 0.1, 0.3));
  const handleResetZoom = () => setZoomLevel(0.75);

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "+" || e.key === "=") { e.preventDefault(); handleZoomIn(); }
        if (e.key === "-") { e.preventDefault(); handleZoomOut(); }
        if (e.key === "0") { e.preventDefault(); handleResetZoom(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // open verify page
  function openVerifyPage() {
    const id = display.certificate_of_action_id;
    if (id) {
      window.open(`${window.location.origin}/verify-certificate?id=${id}`, "_blank");
    } else {
      const key = `draft-${display.transaction_number || "no-txn"}`;
      storeCertificateData({ ...display, certificate_of_action_id: key });
      window.open(`${window.location.origin}/verify-certificate?id=${encodeURIComponent(key)}`, "_blank");
    }
  }

  // if resident selected -> autofill complainant_name
  function onResidentSelect(option) {
    if (option) {
      setFormData((prev) => ({
        ...prev,
        resident_id: option.resident_id,
        complainant_name: option.full_name || prev.complainant_name,
      }));
    } else {
      setFormData((prev) => ({ ...prev, resident_id: "", complainant_name: "" }));
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* LEFT: Certificate preview */}
        <Box sx={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 1, p: 2, bgcolor: "background.paper", borderBottom: 1, borderColor: "grey.200" }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <IconButton onClick={handleZoomOut} color="primary" sx={{ border: "1px solid", borderColor: "grey.300" }}><ZoomOutIcon /></IconButton>
              <Typography variant="body2" sx={{ minWidth: 60, textAlign: "center", fontWeight: 600 }}>{Math.round(zoomLevel * 100)}%</Typography>
              <IconButton onClick={handleZoomIn} color="primary" sx={{ border: "1px solid", borderColor: "grey.300" }}><ZoomInIcon /></IconButton>
              <IconButton onClick={handleResetZoom} color="primary" size="small" sx={{ border: "1px solid", borderColor: "grey.300" }}><ResetIcon fontSize="small" /></IconButton>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" color="primary" onClick={() => { if (display.certificate_of_action_id) window.open(window.location.origin + `/verify-certificate?id=${display.certificate_of_action_id}`, "_blank"); }} startIcon={<QrCodeIcon />} disabled={!display.certificate_of_action_id} sx={{ textTransform: "none", fontWeight: 600, px: 3 }}>View Certificate Details</Button>
              <Button variant="contained" color="success" onClick={generatePDF} disabled={!display.certificate_of_action_id || isGeneratingPDF} startIcon={<FileTextIcon />} sx={{ textTransform: "none", fontWeight: 600, px: 3 }}>{isGeneratingPDF ? "Generating..." : "Download PDF"}</Button>
            </Box>
          </Box>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", flex: 1, overflow: "auto", padding: "20px 0" }}>
            <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}>
              {/* certificate preview container - DO NOT CHANGE LAYOUT; values inserted for live-update */}
              <div id="certificate-preview" style={{ ...certificateStyles.page }}>
                {/* Logos */}
                <img src={CaloocanLogo} alt="City Logo" style={{ width: "100px", position: "absolute", top: "20px", left: "20px" }} />
                <img src={Logo145} alt="Barangay Logo" style={{ width: "120px", position: "absolute", top: "20px", right: "20px" }} />
                <img src={Logo145} alt="Watermark" style={certificateStyles.watermarkImg} />

                {/* Header texts (unchanged) */}
                <div style={{ fontFamily: '"Lucida Calligraphy", cursive', fontSize: "20px", textAlign: "center" }}>Republic of the Philippines</div>
                <div style={{ fontFamily: "Arial, sans-serif", fontSize: "20px", textAlign: "center" }}>CITY OF CALOOCAN</div>
                <div style={{ fontFamily: "Arial Black, Gadget, sans-serif", fontSize: "15px", textAlign: "center" }}>
                  BARANGAY 145 ZONES 13 DIST. 1 <br />
                  Tel. No. 8711-7134
                </div>
                <div style={{ fontFamily: "Arial Black, Gadget, sans-serif", fontSize: "20px", textAlign: "center", marginBottom: "20px" }}>OFFICE OF THE BARANGAY CHAIRMAN</div>
                <div style={certificateStyles.lupon}>OFFICE OF THE LUPONG TAGAPAMAYAPA</div>

                {/* date (live) */}
                <div style={certificateStyles.date}>
                  {/* live update of date_issued (if user types) otherwise default in form */}
                  {display.date_issued ? formatDateDisplay(display.date_issued) : ""}
                </div>

                {/* case info (live) */}
                <div style={certificateStyles.caseInfo}>
                  {display.barangay_case_no ? `BARANGAY CASE NO. ${display.barangay_case_no}` : "BARANGAY CASE NO. ________"} <br />
                  FOR: {display.request_reason ? display.request_reason : "________________"}
                </div>

                {/* Parties - live update complainant/respondent */}
                <div style={certificateStyles.content}>
                  <p>
                    <b>{display.complainant_name || "________________"}</b>
                    <br />
                    <b>COMPLAINANT</b>
                  </p>
                  <p style={{ textAlign: "left" }}>-against-</p>
                  <p>
                    <b>{display.respondent_name || "________________"}</b>
                    <br />
                    <b>RESPONDENT</b>
                  </p>
                </div>

                {/* Title (unchanged) */}
                <div style={{ fontFamily: "Calibri", fontSize: "20px", textAlign: "center", fontStyle: "italic" }}>CERTIFICATION TO FILE ACTION</div>

                {/* Body: keep structure but use live dates */}
                <div style={certificateStyles.content}>
                  <b style={{ paddingBottom: "150px" }}>This is to certify that:</b>
                  <ol style={{ paddingLeft: "7.5em", paddingBottom: "30px" }}>
                    <li style={{ marginBottom: "15px" }}>
                      <b>This complaint was filed on {display.filed_date ? formatDateDisplay(display.filed_date) : "__________"}.</b>
                    </li>
                    <li style={{ marginBottom: "15px" }}>
                      <b>
                        There has no personal confrontation between the parties before the Punong Barangay because the respondent was absent and that mediation failed.
                      </b>
                    </li>
                    <li style={{ marginBottom: "15px" }}>
                      <b>
                        The Pangkat Tagapagkasundo was constituted but there has been no personal confrontation before the Pangkat likewise did not result into a settlement because the respondent was absent.
                      </b>
                    </li>
                    <li>
                      <b>
                        Therefore, the corresponding complaint for the dispute may now be filed in the court/government office.
                      </b>
                    </li>
                  </ol>
                </div>

                <div style={certificateStyles.content}>
                  <b>Issued this {display.date_issued ? (() => {
                    const date = new Date(display.date_issued);
                    const day = date.getDate();
                    const month = date.toLocaleString("default", { month: "long" });
                    const year = date.getFullYear();
                    const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
                    return `${day}${suffix} day of ${month}, ${year}`;
                  })() : "__________"}, at Barangay 145 office.</b>
                </div>

                {/* Bottom Section (signatures) unchanged but live not necessary */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", width: "100%", fontStyle: "italic" }}>
                  <div>
                    <div style={{ fontFamily: "Calibri, sans-serif", fontSize: "15px", textAlign: "center" }}>
                      <b>Prepared by:</b> <br /><br /><br />
                      <b style={{ fontSize: "20px" }}>Rosalina P. Anore</b>
                      <br />
                      <b style={{ display: "block", textAlign: "center", fontSize: "15px" }}>Secretary</b>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", fontFamily: "Calibri, sans-serif", fontSize: "22px" }}>
                    <br /><br /><br /><br /><br /><br />
                    <b>ARNOLD L. DONDONAYOS</b>
                    <br />
                    <b>Barangay 145 Chairperson</b>
                  </div>
                </div>

                {/* QR: bottom-right corner (visible for drafts too) */}
                {qrCodeUrl && (
                  <div style={{ position: "absolute", bottom: 60, left: 60, textAlign: "center", fontFamily: '"Times New Roman", serif', fontSize: "10pt", fontWeight: "bold" }}>
                    <div onClick={openVerifyPage} style={{ cursor: "pointer", display: "inline-block" }} title="Click to verify this certificate">
                      <img src={qrCodeUrl} alt="QR" style={{ width: 120, height: 120, border: "2px solid #000", padding: 5, background: "#fff" }} />
                    </div>
                    <div style={{ fontSize: "8pt", color: "#666", marginTop: 6 }}>
                      {display.date_created ? formatDateTimeDisplay(display.date_created) : new Date().toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <style>{`@media print { body * { visibility: hidden; } #certificate-preview, #certificate-preview * { visibility: visible; } #certificate-preview { position: absolute; left: 0; top: 0; width: 8.5in; height: 11in; transform: none !important; } @page { size: portrait; margin: 0; } #certificate-preview * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }`}</style>
        </Box>

        {/* RIGHT: CRUD panel */}
        <Container maxWidth="sm" disableGutters sx={{ height: "100vh" }}>
          <Paper sx={{ bgcolor: "grey.50", borderLeft: 1, borderColor: "grey.300", display: "flex", flexDirection: "column" }}>
            <Paper elevation={0} sx={{ position: "sticky", paddingTop: 5, zIndex: 10, bgcolor: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", borderBottom: 1, borderColor: "grey.300" }}>
              <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>Certificate of Action</Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button variant="outlined" size="small" startIcon={<PrintIcon />} onClick={handlePrint} disabled={!display.certificate_of_action_id} sx={{ color: "primary.main", borderColor: "primary.main" }}>Print</Button>
                  <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => { resetForm(); setIsFormOpen(true); setActiveTab("form"); }} color="primary">New</Button>
                </Box>
              </Box>

              <Box sx={{ px: 1, pb: 1 }}>
                <Paper sx={{ p: 0.5, bgcolor: "background.default", borderRadius: 2 }}>
                  <Tabs value={activeTab} onChange={(e, nv) => setActiveTab(nv)} aria-label="coa tabs" variant="fullWidth" sx={{ minHeight: "unset", "& .MuiTabs-flexContainer": { gap: 0.5 } }}>
                    <Tab value="form" label="Form" sx={{ py: 1 }} />
                    <Tab value="records" label={`Records (${records.length})`} sx={{ py: 1 }} />
                    <Tab value="transaction" label="Transaction" sx={{ py: 1 }} />
                  </Tabs>
                </Paper>
              </Box>
            </Paper>

            {/* FORM */}
            {activeTab === "form" && (
              <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
                <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
                  <CardHeader title={<Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600, color: "grey.800" }}>{editingId ? "Edit Record" : "New Certificate of Action"}</Typography>} subheader={selectedRecord && !editingId && (<Typography variant="caption" sx={{ color: "grey.500" }}>Viewing: {selectedRecord.complainant_name}</Typography>)} sx={{ borderBottom: 1, borderColor: "grey.200" }} />
                  <CardContent>
                    <Stack spacing={2}>
                      <Autocomplete
                        options={residents}
                        getOptionLabel={(opt) => opt.full_name || ""}
                        value={residents.find((r) => r.resident_id === formData.resident_id) || null}
                        onChange={(e, nv) => { onResidentSelect(nv); }}
                        renderInput={(params) => <TextField {...params} label="Complainant Name" variant="outlined" size="small" fullWidth />}
                      />

                
                      <TextField label="Respondent Name *" variant="outlined" size="small" fullWidth value={formData.respondent_name} onChange={(e) => setFormData({ ...formData, respondent_name: e.target.value })} />

                      <TextField label="Barangay Case No. *" variant="outlined" size="small" fullWidth value={formData.barangay_case_no} onChange={(e) => setFormData({ ...formData, barangay_case_no: e.target.value })} />

                      <TextField label="Request Reason *" variant="outlined" size="small" fullWidth multiline rows={2} value={formData.request_reason} onChange={(e) => setFormData({ ...formData, request_reason: e.target.value })} placeholder="Reason for certification" />

                      <TextField label="Filed Date *" type="date" variant="outlined" size="small" fullWidth InputLabelProps={{ shrink: true }} value={formData.filed_date} onChange={(e) => setFormData({ ...formData, filed_date: e.target.value })} />

                      <TextField label="Date Issued *" type="date" variant="outlined" size="small" fullWidth InputLabelProps={{ shrink: true }} value={formData.date_issued} onChange={(e) => setFormData({ ...formData, date_issued: e.target.value })} helperText={formData.date_issued ? (() => { const date = new Date(formData.date_issued); const day = date.getDate(); const month = date.toLocaleString("default", { month: "short" }); const year = date.getFullYear(); const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th"; return `Formatted: ${day}${suffix} day of ${month}, ${year}`; })() : "Select the date"} />

                      <Box sx={{ display: "flex", gap: 1, pt: 1 }}>
                        <Button onClick={handleSubmit} variant="contained" startIcon={<SaveIcon />} fullWidth color="primary" sx={{ py: 1.25 }}>{editingId ? "Update" : "Save"}</Button>
                        {(editingId || isFormOpen) && (<Button onClick={resetForm} variant="outlined" startIcon={<CloseIcon />} color="primary" sx={{ py: 1.25 }}>Cancel</Button>)}
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
                  <TextField fullWidth size="small" placeholder="Search records..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: "grey.400", fontSize: 20 }} /></InputAdornment>) }} />
                </Box>

                <Box sx={{ flex: 1, overflow: "auto", px: 1.5, pb: 1.5 }}>
                  {filteredRecords.length === 0 ? (
                    <Paper sx={{ p: 3, textAlign: "center", color: "grey.500" }}><Typography variant="body2">{searchTerm ? "No records found" : "No records yet"}</Typography></Paper>
                  ) : (
                    <Stack spacing={1}>
                      {filteredRecords.map((record) => (
                        <Card key={record.certificate_of_action_id} sx={{ boxShadow: 1, '&:hover': { boxShadow: 2 }, transition: "box-shadow 0.2s", borderLeft: "4px solid", borderColor: "primary.main" }}>
                          <CardContent sx={{ p: 1.5 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{record.complainant_name}</Typography>
                                <Typography variant="caption" sx={{ color: "grey.600", display: "block" }}>{record.respondent_name}</Typography>
                                <Typography variant="caption" sx={{ color: "grey.700", display: "block", mt: 0.5 }}>{record.barangay_case_no}</Typography>
                                <Typography variant="caption" sx={{ color: "grey.400", display: "block" }}>Filed: {formatDateDisplay(record.filed_date)}</Typography>
                              </Box>
                              <Box sx={{ display: "flex", gap: 0.5, ml: 1 }}>
                                <IconButton size="small" onClick={() => handleView(record)} sx={{ color: "info.main" }} title="View"><EyeIcon sx={{ fontSize: 16 }} /></IconButton>
                                <IconButton size="small" onClick={() => handleEdit(record)} sx={{ color: "success.main" }} title="Edit"><EditIcon sx={{ fontSize: 16 }} /></IconButton>
                                <IconButton size="small" onClick={() => handleDelete(record.certificate_of_action_id)} sx={{ color: "error.main" }} title="Delete"><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
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

            {/* TRANSACTION */}
            {activeTab === "transaction" && (
              <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
                <Card sx={{ borderRadius: 3, boxShadow: 1, mb: 2 }}>
                  <CardHeader title={<Typography variant="h6">Search by Transaction Number</Typography>} sx={{ borderBottom: 1, borderColor: "grey.200" }} />
                  <CardContent>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <TextField fullWidth size="small" placeholder="Enter transaction number (e.g., COA-240101-123456)" value={transactionSearch} onChange={(e) => setTransactionSearch(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><FileTextIcon sx={{ color: "grey.400", fontSize: 20 }} /></InputAdornment>) }} />
                      <Button variant="contained" color="primary" onClick={handleTransactionSearch} startIcon={<SearchIcon />} sx={{ px: 3 }}>Search</Button>
                    </Box>
                    <Typography variant="caption" color="text.secondary">Transaction numbers are generated automatically. Format: COA-YYMMDD-######</Typography>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
                  <CardHeader title={<Typography variant="h6">Recent Transactions</Typography>} sx={{ borderBottom: 1, borderColor: "grey.200" }} />
                  <CardContent>
                    {transactionFilteredRecords.length === 0 ? (
                      <Box sx={{ p: 3, textAlign: "center", color: "grey.500" }}>No transactions found</Box>
                    ) : (
                      <Stack spacing={1}>
                        {transactionFilteredRecords.map((r) => (
                          <Card key={r.certificate_of_action_id} sx={{ boxShadow: 0, '&:hover': { boxShadow: 1 }, transition: "box-shadow 0.2s", borderLeft: 3, borderColor: "primary.main" }}>
                            <CardContent sx={{ p: 1.5 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.complainant_name}</Typography>
                                  <Typography variant="caption" sx={{ color: "primary.main" }}>{r.transaction_number}</Typography>
                                  <Typography variant="caption" sx={{ display: "block", color: "grey.600" }}>{r.barangay_case_no}</Typography>
                                  <Typography variant="caption" sx={{ color: "grey.400" }}>Issued: {formatDateDisplay(r.date_issued)}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                  <IconButton size="small" onClick={() => handleView(r)} title="View"><EyeIcon sx={{ fontSize: 16 }} /></IconButton>
                                  <IconButton size="small" onClick={() => handleEdit(r)} title="Edit"><EditIcon sx={{ fontSize: 16 }} /></IconButton>
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
      </Box>
    </ThemeProvider>
  );
}

// Reuse your original certificate styles (kept intact)
const certificateStyles = {
  page: {
    width: "8.5in",
    minHeight: "11in",
    margin: "20px auto",
    padding: "40px",
    position: "relative",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    fontWeight: "bold",
    maxWidth: "100%",
    overflow: "auto",
  },
  watermarkImg: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    opacity: 0.2,
    width: "60%",
    pointerEvents: "none",
    zIndex: 0,
  },
  lupon: {
    textAlign: "center",
    fontFamily: "Calibri, sans-serif",
    fontStyle: "italic",
    fontSize: "16px",
    marginBottom: "2px",
    fontWeight: "bold",
  },
  date: {
    textAlign: "right",
    fontFamily: "Calibri, sans-serif",
    fontSize: "14px",
    marginBottom: "20px",
    fontStyle: "italic",
  },
  caseInfo: {
    textAlign: "right",
    fontFamily: "Calibri, sans-serif",
    fontSize: "14px",
    marginBottom: "20px",
    fontStyle: "italic",
  },
  content: {
    margin: "5px 0",
    fontFamily: "Calibri, sans-serif",
    fontSize: "14px",
    position: "relative",
    zIndex: 1,
    fontStyle: "italic",
  },
};

