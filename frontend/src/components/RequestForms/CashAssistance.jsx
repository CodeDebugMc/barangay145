import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';

import CaloocanLogo from '../../assets/CaloocanLogo.png';
import Logo145 from '../../assets/Logo145.png';

// MUI
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
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  createTheme,
  ThemeProvider,
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
  QrCodeScanner as QrCodeIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';

// Theme (matching PermitToTravel style)
const theme = createTheme({
  palette: {
    primary: { main: '#41644A', light: '#A0B2A6', dark: '#0D4715' },
    success: { main: '#41644A' },
    background: { default: '#F1F0E9', paper: '#FFFFFF' },
    text: { primary: '#0D4715' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
      },
    },
  },
});

export default function CashAssistance() {
  const apiBase = 'http://localhost:5000'; // match backend base like PermitToTravel
  const navigate = useNavigate?.() || (() => {});

  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [residents, setResidents] = useState([]);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.75);

  const [formData, setFormData] = useState({
    cash_assistance_id: '',
    resident_id: '',
    full_name: '',
    sinceYear: '',
    address: '',
    request_reason: '',
    date_issued: new Date().toISOString().split('T')[0],
    transaction_number: '',
    is_active: 1,
    date_created: '',
  });

  // helper: format date without timezone issues
  function formatDateDisplay(dateString) {
    if (!dateString) return '';
    const dateOnly = dateString.includes('T') ? dateString.split('T')[0] : dateString;
    const [year, month, day] = dateOnly.split('-');
    const monthNames = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    return `${monthNames[parseInt(month,10)-1]} ${parseInt(day,10)}, ${year}`;
  }

  // helper: format date/time for created date
  function formatDateTimeDisplay(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const monthNames = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
  }

  // generate transaction number (CA-YYMMDD-######)
  function generateTransactionNumber() {
    const date = new Date();
    const yy = String(date.getFullYear()).slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `CA-${yy}${mm}${dd}-${rand}`;
  }

  // store certificate in localStorage for verification (same approach as PermitToTravel)
  function storeCertificateData(certificateData) {
    if (!certificateData?.cash_assistance_id) return;
    const existing = JSON.parse(localStorage.getItem('certificates') || '{}');
    existing[certificateData.cash_assistance_id] = certificateData;
    localStorage.setItem('certificates', JSON.stringify(existing));
  }

  // load residents for autocomplete
  async function loadResidents() {
    try {
      const res = await fetch(`${apiBase}/residents`);
      const data = await res.json();
      const formatted = Array.isArray(data)
        ? data.map((r) => ({ ...r, dob: r.dob ? r.dob.split('T')[0] : '', created_at: r.created_at || r.createdAt || null }))
        : [];
      setResidents(formatted);
    } catch (err) {
      console.error('Failed to load residents', err);
    }
  }

  // load cash assistance records
  async function loadRecords() {
    try {
      const res = await fetch(`${apiBase}/cash-assistance`);
      const data = await res.json();
      setRecords(
        Array.isArray(data)
          ? data.map((r) => ({
              cash_assistance_id: r.cash_assistance_id,
              resident_id: r.resident_id,
              full_name: r.full_name,
              sinceYear: r.since_year || r.sinceYear || '',
              address: r.address || '',
              request_reason: r.request_reason || '',
              date_issued: r.date_issued?.split('T')[0] || '',
              transaction_number: r.transaction_number || generateTransactionNumber(),
              is_active: r.is_active ?? 1,
              date_created: r.date_created,
            }))
          : []
      );
    } catch (e) {
      console.error('Failed to load cash assistance records', e);
    }
  }

  useEffect(() => {
    loadResidents();
    loadRecords();
  }, []);

  // when display changes or form changes, generate QR (and store certificate)
  const display = useMemo(() => {
    if (editingId || isFormOpen) return formData;
    if (selectedRecord) return selectedRecord;
    return formData;
  }, [editingId, isFormOpen, selectedRecord, formData]);

  useEffect(() => {
    const generateQRCode = async () => {
      if (!display) return setQrCodeUrl('');
      // store for verification
      storeCertificateData(display);
      const verificationUrl = `${window.location.origin}/verify-certificate?id=${display.cash_assistance_id || 'draft'}`;
      const qrContent = `CERTIFICATE VERIFICATION:
Transaction No: ${display.transaction_number || 'N/A'}
Name: ${display.full_name || ''}
Date Issued: ${display.date_created ? formatDateTimeDisplay(display.date_created) : new Date().toLocaleString()}
Document Type: Cash Assistance
Verification URL: ${verificationUrl}
`;
      try {
        const qr = await QRCode.toDataURL(qrContent, { width: 140, margin: 1 });
        setQrCodeUrl(qr);
      } catch (err) {
        console.error('QR error', err);
      }
    };
    generateQRCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display]);

  function toServerPayload(data) {
    return {
      resident_id: data.resident_id || null,
      full_name: data.full_name,
      since_year: data.sinceYear || null,
      address: data.address || null,
      request_reason: data.request_reason,
      date_issued: data.date_issued || data.dateIssued || null,
      transaction_number: data.transaction_number,
      is_active: data.is_active ?? 1,
    };
  }

  async function handleCreate() {
    try {
      const tx = generateTransactionNumber();
      const updated = { ...formData, transaction_number: tx, date_created: new Date().toISOString() };
      const res = await fetch(`${apiBase}/cash-assistance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toServerPayload(updated)),
      });
      if (!res.ok) throw new Error('Create failed');
      const created = await res.json();
      const newRec = { ...updated, cash_assistance_id: created.cash_assistance_id };
      setRecords([newRec, ...records]);
      setSelectedRecord(newRec);
      storeCertificateData(newRec);
      resetForm();
      setActiveTab('records');
    } catch (e) {
      console.error(e);
      alert('Failed to create record');
    }
  }

  async function handleUpdate() {
    try {
      const res = await fetch(`${apiBase}/cash-assistance/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toServerPayload(formData)),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = { ...formData, cash_assistance_id: editingId };
      setRecords(records.map((r) => (r.cash_assistance_id === editingId ? updated : r)));
      setSelectedRecord(updated);
      storeCertificateData(updated);
      resetForm();
      setActiveTab('records');
    } catch (e) {
      console.error(e);
      alert('Failed to update record');
    }
  }

  function handleEdit(record) {
    setFormData({ ...record, date_issued: record.date_issued || record.dateIssued || '' });
    setEditingId(record.cash_assistance_id);
    setIsFormOpen(true);
    setActiveTab('form');
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this record?')) return;
    try {
      const res = await fetch(`${apiBase}/cash-assistance/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setRecords(records.filter((r) => r.cash_assistance_id !== id));
      if (selectedRecord?.cash_assistance_id === id) setSelectedRecord(null);
      // remove from localStorage
      const existing = JSON.parse(localStorage.getItem('certificates') || '{}');
      delete existing[id];
      localStorage.setItem('certificates', JSON.stringify(existing));
    } catch (e) {
      console.error(e);
      alert('Failed to delete record');
    }
  }

  function handleView(record) {
    setSelectedRecord(record);
    setFormData({ ...record });
    setEditingId(record.cash_assistance_id);
    setIsFormOpen(true);
    setActiveTab('form');
  }

  function resetForm() {
    setFormData({
      cash_assistance_id: '',
      resident_id: '',
      full_name: '',
      sinceYear: '',
      address: '',
      request_reason: '',
      date_issued: new Date().toISOString().split('T')[0],
      transaction_number: '',
      is_active: 1,
      date_created: '',
    });
    setEditingId(null);
    setIsFormOpen(false);
    setSelectedRecord(null)
  }

  function handleSubmit() {
    if (editingId) handleUpdate();
    else handleCreate();
  }

  const filteredRecords = useMemo(
    () =>
      records.filter(
        (r) =>
          (r.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.request_reason || '').toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [records, searchTerm]
  );

  // transaction search
  const transactionFilteredRecords = useMemo(
    () =>
      records.filter((r) =>
        (r.transaction_number || '').toLowerCase().includes(transactionSearch.toLowerCase())
      ),
    [records, transactionSearch]
  );

  function handleTransactionSearch() {
    if (!transactionSearch) return;
    const found = records.find((r) => (r.transaction_number || '').toLowerCase() === transactionSearch.toLowerCase());
    if (found) {
      setSelectedRecord(found);
      setFormData({ ...found });
      setEditingId(found.cash_assistance_id);
      setIsFormOpen(true);
      setActiveTab('form');
    } else {
      alert('No certificate found with this transaction number');
    }
  }

  async function generatePDF() {
    if (!display.cash_assistance_id) {
      alert('Please save the record first before downloading PDF');
      return;
    }
    setIsGeneratingPDF(true);
    try {
      const el = document.getElementById('certificate-preview');
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: [8.5, 11] });
      pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11);

      // add metadata page similar to PermitToTravel
      pdf.addPage();
      pdf.setFontSize(18);
      pdf.setFont(undefined, 'bold');
      pdf.text('Certificate Verification Information', 0.5, 0.75);
      pdf.setLineWidth(0.02);
      pdf.line(0.5, 0.85, 8, 0.85);
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');

      const createdDate = display.date_created ? formatDateTimeDisplay(display.date_created) : new Date().toLocaleString();
      let yPos = 1.2;
      const lineHeight = 0.25;
      const details = [
        `Certificate Type: Cash Assistance`,
        `Certificate ID: ${display.cash_assistance_id}`,
        `Transaction Number: ${display.transaction_number}`,
        ``,
        `Full Name: ${display.full_name}`,
        `Since Year: ${display.sinceYear}`,
        `Address: ${display.address}`,
        `Request Reason: ${display.request_reason}`,
        ``,
        `Date Issued: ${formatDateDisplay(display.date_issued)}`,
        `Date Created (E-Signature Applied): ${createdDate}`,
        ``,
        `Issued by: Punong Barangay Arnold Dondonayos`,
        `Barangay: Barangay 145 Zone 13 Dist. 1, Caloocan City`,
        ``,
        `QR Code URL: ${window.location.origin}/verify-certificate?id=${display.cash_assistance_id}`,
      ];
      details.forEach((line) => {
        pdf.text(line, 0.5, yPos);
        yPos += lineHeight;
      });

      const filename = `Cash_Assistance_${display.cash_assistance_id}_${(display.full_name||'').replace(/\s+/g,'_')}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  }

  function handlePrint() {
    if (!display.cash_assistance_id) { alert('Please save first'); return; }
    const certificateElement = document.getElementById('certificate-preview');
    const printWindow = window.open('', '_blank');
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
        if (e.key === '+' || e.key === '=') { e.preventDefault(); handleZoomIn(); }
        if (e.key === '-') { e.preventDefault(); handleZoomOut(); }
        if (e.key === '0') { e.preventDefault(); handleResetZoom(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // QR dialog click handler
  const handleQrCodeClick = () => {
    if (display.cash_assistance_id) {
      const verificationUrl = `${window.location.origin}/verify-certificate?id=${display.cash_assistance_id}`;
      window.open(verificationUrl, '_blank');
    } else {
      setQrDialogOpen(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* LEFT: Certificate preview */}
        <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 1, p: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'grey.200' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton onClick={handleZoomOut} color="primary" sx={{ border: '1px solid', borderColor: 'grey.300' }}><ZoomOutIcon /></IconButton>
              <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'center', fontWeight: 600 }}>{Math.round(zoomLevel*100)}%</Typography>
              <IconButton onClick={handleZoomIn} color="primary" sx={{ border: '1px solid', borderColor: 'grey.300' }}><ZoomInIcon /></IconButton>
              <IconButton onClick={handleResetZoom} color="primary" size="small" sx={{ border: '1px solid', borderColor: 'grey.300' }}><ResetIcon fontSize="small" /></IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" color="primary" onClick={() => { if (display.cash_assistance_id) window.open(window.location.origin + `/verify-certificate?id=${display.cash_assistance_id}`, '_blank'); }} startIcon={<QrCodeIcon />} disabled={!display.cash_assistance_id} sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}>View Certificate Details</Button>
              <Button variant="contained" color="success" onClick={generatePDF} disabled={!display.cash_assistance_id || isGeneratingPDF} startIcon={<FileTextIcon />} sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</Button>
            </Box>
          </Box>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flex: 1, overflow: 'auto', padding: '20px 0' }}>
            <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}>
              <div id="certificate-preview" style={{ position: 'relative', width: '8.5in', height: '11in', boxShadow: '0 0 8px rgba(0,0,0,0.2)', background: '#fff', overflow: 'hidden' }}>
                {/* Logos & watermark */}
                <img style={{ position: 'absolute', width: '100px', height: '100px', top: '60px', left: '60px' }} src={CaloocanLogo} alt="Logo 1" />
                <img style={{ position: 'absolute', width: '110px', height: '110px', top: '60px', right: '40px' }} src={Logo145} alt="Logo 3" />
                <img style={{ position: 'absolute', opacity: 0.2, width: '550px', left: '50%', top: '270px', transform: 'translateX(-50%)' }} src={Logo145} alt="Watermark" />

                {/* Header */}
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
                <div style={{ position: 'absolute', top: '200px', width: '100%', textAlign: 'center' }}>
                  <span style={{ fontFamily: 'Times New Roman', fontSize: '20pt', fontWeight: 'bold', display: 'inline-block', color: '#0b7030', padding: '4px 70px', fontStyle: 'italic', textDecoration: 'underline' }}>CERTIFICATION</span>
                </div>

                {/* Body */}
                <div style={{ position: 'absolute', whiteSpace: 'pre-wrap', top: '330px', left: '80px', width: '640px', textAlign: 'justify', fontFamily: '"Times New Roman", serif', fontSize: '12pt', fontWeight: 'bold', color: 'black' }}>
                  TO WHOM IT MAY CONCERN:
                  <p style={{ textIndent: '50px' }}>
                    This is to certify that <span style={{ textDecoration: 'underline' }}>{formData.full_name || '____________________'}</span> is a bona fide resident of Barangay 145, Caloocan City since <span style={{ textDecoration: 'underline' }}>{formData.sinceYear || '________'}</span>, residing at <span style={{ textDecoration: 'underline' }}>{formData.address || '____________________'}</span>.
                  </p>
                  <p style={{ textIndent: '50px' }}>
                    This certification is issued upon the request of <span style={{ textDecoration: 'underline' }}>{formData.full_name || '____________________'}</span> for <span style={{ textDecoration: 'underline' }}>{formData.request_reason || '____________________'}</span> Cash Assistance.
                  </p>
                  <p style={{ textIndent: '50px' }}>
                    Issued this <span style={{ textDecoration: 'underline' }}>{formData.date_issued ? (() => { const date = new Date(formData.date_issued); const day = date.getDate(); const month = date.toLocaleString('default', { month: 'long' }); const year = date.getFullYear(); const suffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th'; return `${day}${suffix} day of ${month}, ${year}`; })() : '________'}</span>, at Barangay 145, Zone 13, Dist. 1, Caloocan City.
                  </p>
                </div>

                <div style={{ position: 'absolute', top: '600px', left: '80px', width: '250px', textAlign: 'left', fontFamily: '"Times New Roman", serif', fontSize: '12pt', fontWeight: 'bold' }}>
                  <div style={{ color: 'black', fontFamily: 'inherit' }}>Certified Correct:</div>
                  <br /><br />
                  <div style={{ color: 'black', fontFamily: 'inherit' }}>Roselyn Anore</div>
                  <div style={{ color: 'black', fontFamily: 'inherit' }}>Barangay Secretary</div>
                </div>

                <div style={{ position: 'absolute', top: '700px', right: '20px', width: '300px', textAlign: 'left', fontFamily: '"Times New Roman", serif', fontWeight: 'bold' }}>
                  <div style={{ color: 'black', fontFamily: 'inherit', fontSize: '12pt' }}>Attested:</div>
                  <br /><br />
                  <div style={{ color: 'black', fontFamily: 'inherit', fontSize: '16pt', fontStyle: 'italic' }}>ARNOLD DONDONAYOS</div>
                  <div style={{ color: 'black', fontFamily: 'inherit', fontSize: '12pt', fontStyle: 'italic' }}>Barangay Chairman</div>
                </div>

                {/* QR and signature area */}
                <div style={{ position: 'absolute', top: '780px', left: '50px', width: '250px', textAlign: 'center', fontFamily: '"Times New Roman", serif', fontSize: '12pt', fontWeight: 'bold' }}>
                  <div style={{ borderTop: '2px solid #000', width: '65%', margin: 'auto' }}></div>
                  <div style={{ color: 'black', fontFamily: 'inherit' }}>Applicant's Signature</div>

                  {qrCodeUrl && (
                    <div style={{ marginTop: '12px' }}>
                      <div onClick={handleQrCodeClick} style={{ cursor: 'pointer', display: 'inline-block' }} title="Click to view certificate details">
                        <img src={qrCodeUrl} alt="QR" style={{ width: '150px', height: '150px', border: '2px solid #000', padding: '5px', background: '#fff' }} />
                      </div>
                      <div style={{ fontSize: '8pt', color: '#666', marginTop: '6px', fontWeight: 'normal' }}>
                        {display.date_created ? formatDateTimeDisplay(display.date_created) : new Date().toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <style>{`@media print { body * { visibility: hidden; } #certificate-preview, #certificate-preview * { visibility: visible; } #certificate-preview { position: absolute; left: 0; top: 0; width: 8.5in; height: 11in; transform: none !important; } @page { size: portrait; margin: 0; } #certificate-preview * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; } }`}</style>
        </Box>

        {/* RIGHT: CRUD container */}
        <Container maxWidth={false} sx={{ flexGrow: 1, minWidth: '400px', maxWidth: '600px', height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', borderLeft: 1, borderColor: 'grey.300', p: 0 }} disableGutters>
          <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: 'background.paper', borderRadius: 0 }}>
            <Paper elevation={0} sx={{ position: 'sticky', paddingTop: 5, zIndex: 10, bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderBottom: 1, borderColor: 'grey.200' }}>
              <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>Cash Assistance</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" size="small" startIcon={<PrintIcon />} onClick={handlePrint} disabled={!display.cash_assistance_id} sx={{ color: 'primary.main', borderColor: 'primary.main' }}>Print</Button>
                  <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => { resetForm(); setIsFormOpen(true); setActiveTab('form'); }} color="primary">New</Button>
                </Box>
              </Box>

              <Box sx={{ px: 1, pb: 1 }}>
                <Paper sx={{ p: 0.5, bgcolor: 'background.default', borderRadius: 2 }}>
                  <Tabs value={activeTab} onChange={(e, nv) => setActiveTab(nv)} aria-label="cash tabs" variant="fullWidth" sx={{ minHeight: 'unset', '& .MuiTabs-flexContainer': { gap: 0.5 } }}>
                    <Tab value="form" label="Form" sx={{ minHeight: 'unset', py: 1, bgcolor: activeTab === 'form' ? 'background.paper' : 'transparent', color: activeTab === 'form' ? 'primary.main' : 'text.secondary' }} />
                    <Tab value="records" label={`Records (${records.length})`} sx={{ minHeight: 'unset', py: 1 }} />
                    <Tab value="transaction" label="Transaction" sx={{ minHeight: 'unset', py: 1 }} />
                  </Tabs>
                </Paper>
              </Box>
            </Paper>

            {/* Form Tab */}
            {activeTab === 'form' && (
              <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
                <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
                  <CardHeader title={<Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: 'grey.800' }}>{editingId ? 'Edit Record' : 'New Cash Assistance Record'}</Typography>} subheader={selectedRecord && !editingId && (<Typography variant="caption" sx={{ color: 'grey.500' }}>Viewing: {selectedRecord.full_name}</Typography>)} sx={{ borderBottom: 1, borderColor: 'grey.200' }} />
                  <CardContent>
                    <Stack spacing={2}>
                      <Autocomplete
                        options={residents}
                        getOptionLabel={(option) => option.full_name || ''}
                        value={residents.find((r) => r.resident_id === formData.resident_id) || null}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            // try to derive sinceYear from created_at if available
                            let sinceYear = formData.sinceYear;
                            if (newValue.created_at) {
                              const y = new Date(newValue.created_at).getFullYear();
                              sinceYear = String(y);
                            }
                            setFormData({
                              ...formData,
                              resident_id: newValue.resident_id,
                              full_name: newValue.full_name || '',
                              address: newValue.address || '',
                              sinceYear: sinceYear || formData.sinceYear,
                            });
                          } else {
                            setFormData({ ...formData, resident_id: '', full_name: '' });
                          }
                        }}
                        renderInput={(params) => (<TextField {...params} label="Full Name *" variant="outlined" size="small" fullWidth />)}
                      />

                      <TextField label="Year (Since Resident) *" type="number" variant="outlined" size="small" fullWidth placeholder="e.g. 2015" value={formData.sinceYear || ''} onChange={(e) => setFormData({ ...formData, sinceYear: e.target.value })} />

                      <TextField label="Address *" variant="outlined" size="small" fullWidth multiline rows={2} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />

                      <TextField label="Request Reason *" variant="outlined" size="small" fullWidth multiline rows={2} placeholder="Medical emergencies, Financial hardship, etc." value={formData.request_reason} onChange={(e) => setFormData({ ...formData, request_reason: e.target.value })} />

                      <TextField label="Date Issued *" type="date" variant="outlined" size="small" fullWidth InputLabelProps={{ shrink: true }} value={formData.date_issued} onChange={(e) => setFormData({ ...formData, date_issued: e.target.value })} helperText={formData.date_issued ? (()=>{ const date=new Date(formData.date_issued); const day=date.getDate(); const month = date.toLocaleString('default',{month:'long'}); const year = date.getFullYear(); const suffix = day%10===1&&day!==11? 'st' : day%10===2&&day!==12? 'nd' : day%10===3&&day!==13? 'rd' : 'th'; return `Formatted: ${day}${suffix} day of ${month}, ${year}`; })() : 'Select the date'} />

                      <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
                        <Button onClick={handleSubmit} variant="contained" startIcon={<SaveIcon />} fullWidth color="primary" sx={{ py: 1.25 }}>{editingId ? 'Update' : 'Save'}</Button>
                        {(editingId || isFormOpen) && (<Button onClick={resetForm} variant="outlined" startIcon={<CloseIcon />} color="primary" sx={{ py: 1.25, px: 2 }}>Cancel</Button>)}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Records Tab */}
            {activeTab === 'records' && (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 1.5 }}>
                  <TextField fullWidth size="small" placeholder="Search records..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: 'grey.400', fontSize: 20 }} /></InputAdornment>) }} />
                </Box>

                <Box sx={{ flex: 1, overflow: 'auto', px: 1.5, pb: 1.5 }}>
                  {filteredRecords.length === 0 ? (
                    <Paper sx={{ p: 3, textAlign: 'center', color: 'grey.500' }}><Typography variant="body2">{searchTerm ? 'No records found' : 'No records yet'}</Typography></Paper>
                  ) : (
                    <Stack spacing={1}>
                      {filteredRecords.map((record) => (
                        <Card key={record.cash_assistance_id} sx={{ boxShadow: 1, '&:hover': { boxShadow: 2 }, transition: 'box-shadow 0.2s', borderLeft: '4px solid', borderColor: 'primary.main' }}>
                          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>{record.full_name}</Typography>
                                <Typography variant="caption" sx={{ color: 'grey.600', display: 'block', mb: 0.5 }}>Since: {record.sinceYear}</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                                  <Chip label={`Issued: ${formatDateDisplay(record.date_issued)}`} size="small" sx={{ bgcolor: 'primary.light', color: 'primary.dark', fontSize: '0.625rem', height: 20 }} />
                                </Box>
                                <Typography variant="caption" sx={{ color: 'grey.700', display: 'block', mt: 0.5 }}>{record.request_reason}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                                <IconButton size="small" onClick={()=>handleView(record)} sx={{ color: 'info.main', '&:hover': { bgcolor: 'info.lighter' }, p: 0.75 }} title="View"><EyeIcon sx={{ fontSize: 16 }} /></IconButton>
                                <IconButton size="small" onClick={()=>handleEdit(record)} sx={{ color: 'success.main', '&:hover': { bgcolor: 'success.lighter' }, p: 0.75 }} title="Edit"><EditIcon sx={{ fontSize: 16 }} /></IconButton>
                                <IconButton size="small" onClick={()=>handleDelete(record.cash_assistance_id)} sx={{ color: 'error.main', '&:hover': { bgcolor: 'error.lighter' }, p: 0.75 }} title="Delete"><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
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
            {activeTab === 'transaction' && (
              <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
                <Card sx={{ borderRadius: 3, boxShadow: 1, mb: 2 }}>
                  <CardHeader title={<Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: 'grey.800' }}>Search by Transaction Number</Typography>} sx={{ borderBottom: 1, borderColor: 'grey.200' }} />
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField fullWidth size="small" placeholder="Enter transaction number (e.g., CA-240101-123456)" value={transactionSearch} onChange={(e)=>setTransactionSearch(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><ReceiptIcon sx={{ color: 'grey.400', fontSize: 20 }} /></InputAdornment>) }} />
                      <Button variant="contained" color="primary" onClick={handleTransactionSearch} startIcon={<SearchIcon />} sx={{ fontWeight: 600, px: 3 }}>Search</Button>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'grey.500' }}>Transaction numbers are automatically generated when creating a new certificate. Format: CA-YYMMDD-######</Typography>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
                  <CardHeader title={<Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: 'grey.800' }}>Recent Transactions</Typography>} sx={{ borderBottom: 1, borderColor: 'grey.200' }} />
                  <CardContent sx={{ p: 0 }}>
                    {transactionFilteredRecords.length === 0 ? (
                      <Box sx={{ p: 3, textAlign: 'center', color: 'grey.500' }}><Typography variant="body2">{transactionSearch ? 'No transactions found' : 'Enter a transaction number to search'}</Typography></Box>
                    ) : (
                      <Stack spacing={1}>
                        {transactionFilteredRecords.map((record) => (
                          <Card key={record.cash_assistance_id} sx={{ boxShadow: 0, '&:hover': { boxShadow: 1 }, transition: 'box-shadow 0.2s', borderLeft: 3, borderColor: 'primary.main' }}>
                            <CardContent sx={{ p: 1.5 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>{record.full_name}</Typography>
                                  <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', mb: 0.5, fontWeight: 600 }}>{record.transaction_number}</Typography>
                                  <Typography variant="caption" sx={{ color: 'grey.600', display: 'block', mb: 0.5 }}>{record.address}</Typography>
                                  <Typography variant="caption" sx={{ color: 'grey.400', fontSize: '0.625rem' }}>Issued: {formatDateDisplay(record.date_issued)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                                  <IconButton size="small" onClick={()=>handleView(record)} sx={{ color: 'info.main', '&:hover': { bgcolor: 'info.lighter' }, p: 0.75 }} title="View"><EyeIcon sx={{ fontSize: 16 }} /></IconButton>
                                  <IconButton size="small" onClick={()=>handleEdit(record)} sx={{ color: 'success.main', '&:hover': { bgcolor: 'success.lighter' }, p: 0.75 }} title="Edit"><EditIcon sx={{ fontSize: 16 }} /></IconButton>
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

      {/* QR Details Dialog (for unsaved/draft view) */}
      <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Certificate Details</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><Typography variant="body2" sx={{ color: 'grey.600' }}>Certificate ID:</Typography><Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>{display.cash_assistance_id || 'Draft (Not saved)'}</Typography></Grid>
            <Grid item xs={12} md={6}><Typography variant="body2" sx={{ color: 'grey.600' }}>Transaction Number:</Typography><Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>{display.transaction_number || 'N/A'}</Typography></Grid>
            <Grid item xs={12} md={6}><Typography variant="body2" sx={{ color: 'grey.600' }}>Full Name:</Typography><Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>{display.full_name}</Typography></Grid>
            <Grid item xs={12} md={6}><Typography variant="body2" sx={{ color: 'grey.600' }}>Address:</Typography><Typography variant="body1" sx={{ color: 'text.secondary' }}>{display.address}</Typography></Grid>
            <Grid item xs={12} md={6}><Typography variant="body2" sx={{ color: 'grey.600' }}>Date Issued:</Typography><Typography variant="body1" sx={{ color: 'text.secondary' }}>{display.date_issued ? formatDateDisplay(display.date_issued) : 'N/A'}</Typography></Grid>
            <Grid item xs={12}><Typography variant="body2" sx={{ color: 'grey.600' }}>Request Reason:</Typography><Typography variant="body1" sx={{ color: 'text.secondary' }}>{display.request_reason}</Typography></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
