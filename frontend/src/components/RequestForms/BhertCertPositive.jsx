import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CaloocanLogo from '../../assets/CaloocanLogo.png';
import Logo145 from '../../assets/Logo145.png';
import BagongPilipinas from '../../assets/BagongPilipinas.png';
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
  Chip,
  Stack,
  Autocomplete,
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
  Print as PrintIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';

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

export default function BhertCertificatePositive() {
  const apiBase = 'http://localhost:5000'; // change to include /api if needed

  const [records, setRecords] = useState([]);
  const [residents, setResidents] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [zoomLevel, setZoomLevel] = useState(0.75);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [formData, setFormData] = useState({
    bhert_certificate_positive_id: '',
    resident_id: '',
    full_name: '',
    address: '',
    request_reason: '',
    date_issued: new Date().toISOString().split('T')[0],
    transaction_number: '',
    is_active: 1,
    date_created: '',
  });

  // helper formatters
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

  function generateTransactionNumber() {
    const date = new Date();
    const yy = String(date.getFullYear()).slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `BHERT-${yy}${mm}${dd}-${rand}`;
  }

  // persist for verification page
  function storeCertificateData(cert) {
    if (!cert) return;
    const existing = JSON.parse(localStorage.getItem('certificates') || '{}');
    const key = cert.bhert_certificate_positive_id || `draft-${cert.transaction_number || 'no-txn'}`;
    existing[key] = cert;
    localStorage.setItem('certificates', JSON.stringify(existing));
  }

  // load residents (optional autocomplete)
  async function loadResidents() {
    try {
      const res = await fetch(`${apiBase}/residents`);
      const data = await res.json();
      setResidents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to load residents', err);
    }
  }

  // load bhert records
  async function loadRecords() {
    try {
      const res = await fetch(`${apiBase}/bhert-certificate-positive`);
      const data = await res.json();
      setRecords(
        Array.isArray(data)
          ? data.map((r) => ({
              bhert_certificate_positive_id: r.bhert_certificate_positive_id,
              resident_id: r.resident_id,
              full_name: r.full_name,
              address: r.address || '',
              request_reason: r.request_reason || '',
              date_issued: r.date_issued ? r.date_issued.split('T')[0] : '',
              transaction_number: r.transaction_number || generateTransactionNumber(),
              is_active: r.is_active ?? 1,
              date_created: r.date_created,
            }))
          : []
      );
    } catch (e) {
      console.error('Failed to load BHERT records', e);
    }
  }

  useEffect(() => {
    loadResidents();
    loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const display = useMemo(() => {
    if (editingId || isFormOpen) return formData;
    if (selectedRecord) return selectedRecord;
    return formData;
  }, [editingId, isFormOpen, selectedRecord, formData]);

  // QR generation: only if record is saved and full_name exists (PermitToTravel behaviour)
  useEffect(() => {
    const make = async () => {
      if (!display || !display.full_name) {
          setQrCodeUrl('');
          return;
        }

      const content = `BHERT CERTIFICATION (POSITIVE)\nTransaction: ${display.transaction_number}\nName: ${display.full_name}\nIssued: ${display.date_issued || ''}`;
      try {
        const url = await QRCode.toDataURL(content, { width: 140, margin: 1 });
        setQrCodeUrl(url);
        storeCertificateData(display);
      } catch (err) {
        console.error('QR error', err);
      }
    };
    make();
  }, [display.full_name, display.bhert_certificate_positive_id, display.transaction_number, display.date_issued]);

  function toServerPayload(data) {
    return {
      resident_id: data.resident_id || null,
      full_name: data.full_name,
      address: data.address || null,
      request_reason: data.request_reason || null,
      date_issued: data.date_issued || null,
      transaction_number: data.transaction_number,
      is_active: data.is_active ?? 1,
    };
  }

  async function handleCreate() {
    try {
      const tx = generateTransactionNumber();
      const updated = { ...formData, transaction_number: tx, date_created: new Date().toISOString() };
      const res = await fetch(`${apiBase}/bhert-certificate-positive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toServerPayload(updated)),
      });
      if (!res.ok) throw new Error('Create failed');
      const created = await res.json();
      const newRec = { ...updated, bhert_certificate_positive_id: created.bhert_certificate_positive_id };
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
      const res = await fetch(`${apiBase}/bhert-certificate-positive/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toServerPayload(formData)),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = { ...formData, bhert_certificate_positive_id: editingId };
      setRecords(records.map((r) => (r.bhert_certificate_positive_id === editingId ? updated : r)));
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
    setFormData({
      ...record,
      date_issued: record.date_issued || record.dateIssued || '',
    });
    setEditingId(record.bhert_certificate_positive_id);
    setIsFormOpen(true);
    setActiveTab('form');
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this record?')) return;
    try {
      const res = await fetch(`${apiBase}/bhert-certificate-positive/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setRecords(records.filter((r) => r.bhert_certificate_positive_id !== id));
      if (selectedRecord?.bhert_certificate_positive_id === id) setSelectedRecord(null);
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
    setEditingId(record.bhert_certificate_positive_id);
    setIsFormOpen(true);
    setActiveTab('form');
  }

  function resetForm() {
    setFormData({
      bhert_certificate_positive_id: '',
      resident_id: '',
      full_name: '',
      address: '',
      request_reason: '',
      date_issued: new Date().toISOString().split('T')[0],
      transaction_number: '',
      is_active: 1,
      date_created: '',
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
          (r.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.request_reason || '').toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [records, searchTerm]
  );

  const transactionFilteredRecords = useMemo(
    () =>
      records.filter((r) => (r.transaction_number || '').toLowerCase().includes(transactionSearch.toLowerCase())),
    [records, transactionSearch]
  );

  function handleTransactionSearch() {
    if (!transactionSearch) return;
    const found = records.find((r) => (r.transaction_number || '').toLowerCase() === transactionSearch.toLowerCase());
    if (found) handleView(found);
    else alert('No certificate found with this transaction number');
  }

  async function generatePDF() {
    if (!display.bhert_certificate_positive_id) {
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

      // metadata page
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
        `Certificate Type: BHERT Certification (Positive)`,
        `Certificate ID: ${display.bhert_certificate_positive_id}`,
        `Transaction Number: ${display.transaction_number}`,
        ``,
        `Full Name: ${display.full_name}`,
        `Address: ${display.address}`,
        `Request Reason: ${display.request_reason}`,
        ``,
        `Date Issued: ${formatDateDisplay(display.date_issued)}`,
        `Date Created (E-Signature Applied): ${createdDate}`,
        ``,
        `Issued by: Barangay 145 Zone 13 Dist. 1, Caloocan City`,
        `Verification URL: ${window.location.origin}/verify-certificate?id=${display.bhert_certificate_positive_id}`,
      ];
      details.forEach((line) => {
        pdf.text(line, 0.5, yPos);
        yPos += lineHeight;
      });

      const filename = `BHERT_Positive_${display.bhert_certificate_positive_id}_${(display.full_name||'').replace(/\s+/g,'_')}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  }

  function handlePrint() {
    if (!display.bhert_certificate_positive_id) { alert('Please save first'); return; }
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

  // open verification page when clicking QR or button
  function openVerifyPage() {
    const id = display.bhert_certificate_positive_id;
    if (id) {
      window.open(`${window.location.origin}/verify-certificate?id=${id}`, '_blank');
    } else {
      // draft: store draft keyed by draft-<txn> so verify page can read it
      const key = `draft-${display.transaction_number || 'no-txn'}`;
      storeCertificateData({ ...display, bhert_certificate_positive_id: key });
      window.open(`${window.location.origin}/verify-certificate?id=${encodeURIComponent(key)}`, '_blank');
    }
  }

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
              <Button variant="outlined" color="primary" onClick={() => { if (display.bhert_certificate_positive_id) window.open(window.location.origin + `/verify-certificate?id=${display.bhert_certificate_positive_id}`, '_blank'); }} startIcon={<QrCodeIcon />} disabled={!display.bhert_certificate_positive_id} sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}>View Certificate Details</Button>
              <Button variant="contained" color="success" onClick={generatePDF} disabled={!display.bhert_certificate_positive_id || isGeneratingPDF} startIcon={<FileTextIcon />} sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</Button>
            </Box>
          </Box>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flex: 1, overflow: 'auto', padding: '20px 0' }}>
            <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}>
              <div id="certificate-preview" style={{ position: 'relative', width: '8.5in', height: '11in', boxShadow: '0 0 8px rgba(0,0,0,0.2)', background: '#fff', overflow: 'hidden', fontWeight: 'bold' }}>
                {/* Logos */}
                 <div
              style={{
                position: 'absolute',
                top: '20px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                gap: '30px',
              }}
            >
              <img
                style={{ width: '80px', height: '80px' }}
                src={CaloocanLogo}
                alt="Caloocan"
              />
              <img
                style={{ width: '80px', height: '80px' }}
                src={BagongPilipinas}
                alt="Bagong Pilipinas"
              />
              <img
                style={{ width: '80px', height: '80px' }}
                src={Logo145}
                alt="Barangay 145"
              />
            </div>

                <img style={{ position: 'absolute', opacity: 0.12, width: '550px', left: '50%', top: '270px', transform: 'translateX(-50%)' }} src={Logo145} alt="Watermark" />

                {/* Header */}
            <div style={{ position: 'absolute', top: '120px', width: '100%' }}>
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '12pt',
                }}
              >
                Republic of the Philippines
              </div>
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '12pt',
                }}
              >
                City of Caloocan
              </div>
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '12pt',
                }}
              >
                BARANGAY 145 ZONE 13 DISTRICT 1
              </div>
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '16pt',
                  marginTop: '4px',
                }}
              >
                OFFICE OF THE BARANGAY CAPTAIN
              </div>
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '20pt',
                  letterSpacing: '6px',
                  marginTop: '30px',
                }}
              >
                B H E R T &nbsp; C E R T I F I C A T I O N
              </div>
            </div>

                {/* Body */}
                <div
              style={{
                position: 'absolute',
                top: '300px',
                fontSize: '14pt',
                textAlign: 'justify',
                margin: '0 80px',
                width: '640px',
              }}
            >
              To Whom It May Concern: <br />
              <p style={{ textIndent: '40px' }}>
                This is to certify that{' '}
                <span style={{ textDecoration: 'underline' }}>
                  {formData.full_name || '____________________'}
                </span>
                , a Filipino citizen and resident of{' '}
                <span style={{ textDecoration: 'underline' }}>
                  {formData.address || '____________________'}
                </span>{' '}
                Bagong Barrio Caloocan City. He/She is INCLUDED in the list of
                household in this barangay, who is being monitored with COVID-19
                and He/She is INCLUDED in the list of persons who is being
                monitored in this barangay to the PUI or CONFIRMED with
                COVID-19. She completed One Wk. Quarantine period, and monitored
                by our BHERT officer.
              </p>
              <p style={{ textIndent: '40px' }}>
                This Certification is issued upon request of the above-mentioned
                name for{' '}
                <span style={{ textDecoration: 'underline' }}>
                  {formData.request_reason || '___________'}
                </span>
                .
              </p>
              <p style={{ textIndent: '40px' }}>
                Done in the Office of the Punong Barangay 145, Zone 13, District
                1, City of Caloocan this{' '}
                {display.dateIssued ? formatDate(display.dateIssued) : ''}.
              </p>
            </div>

                {/* Signature Section */}
            <div style={{ position: 'absolute', left: '80px', top: '750px' }}>
              Certified by: <br />
              <br />
              ROSALINA P. ANORE
              <br />
              <span style={{ fontSize: '14pt' }}>Brgy. Secretary</span>
            </div>

            <div style={{ position: 'absolute', left: '80px', top: '900px' }}>
              Noted by: <br />
              <br />
              <span style={{ fontSize: '16pt' }}>ARNOLD DONDONAYOS</span>
              <br />
              <span style={{ fontSize: '14pt' }}>Punong Barangay</span>
            </div>

                {/* QR area (not part of certificate text) */}
                <div style={{ position: 'absolute', top: '820px', left: '50px', width: '250px', textAlign: 'center', fontFamily: '"Times New Roman", serif', fontSize: '12pt', fontWeight: 'bold' }}>
                  
                </div>
                 {/* QR area (bottom-right corner, visible for drafts too) */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '60px',
                    right: '60px',
                    textAlign: 'center',
                    fontFamily: '"Times New Roman", serif',
                    fontSize: '10pt',
                    fontWeight: 'bold',
                  }}
                >
                  {qrCodeUrl && (
                    <div style={{ marginTop: 12 }}>
                      <div
                        onClick={openVerifyPage}
                        style={{ cursor: 'pointer', display: 'inline-block' }}
                        title="Click to verify this certificate"
                      >
                        <img
                          src={qrCodeUrl}
                          alt="QR"
                          style={{
                            width: 150,
                            height: 150,
                            border: '2px solid #000',
                            padding: 5,
                            background: '#fff',
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: '8pt',
                          color: '#666',
                          marginTop: 6,
                          fontWeight: 'normal',
                        }}
                      >
                        {display.date_created
                          ? formatDateTimeDisplay(display.date_created)
                          : new Date().toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <style>{`@media print { body * { visibility: hidden; } #certificate-preview, #certificate-preview * { visibility: visible; } #certificate-preview { position: absolute; left: 0; top: 0; width: 8.5in; height: 11in; transform: none !important; } @page { size: portrait; margin: 0; } #certificate-preview * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }`}</style>
        </Box>

        {/* RIGHT: CRUD panel */}
        <Container maxWidth="sm" disableGutters sx={{ height: '100vh' }}>
          <Paper sx={{ bgcolor: 'grey.50', borderLeft: 1, borderColor: 'grey.300', display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={0} sx={{ position: 'sticky', paddingTop: 5, zIndex: 10, bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderBottom: 1, borderColor: 'grey.300' }}>
              <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>BHERT Certificate (Positive)</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" size="small" startIcon={<PrintIcon />} onClick={handlePrint} disabled={!display.bhert_certificate_positive_id} sx={{ color: 'primary.main', borderColor: 'primary.main' }}>Print</Button>
                  <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => { resetForm(); setIsFormOpen(true); setActiveTab('form'); }} color="primary">New</Button>
                </Box>
              </Box>

              <Box sx={{ px: 1, pb: 1 }}>
                <Paper sx={{ p: 0.5, bgcolor: 'background.default', borderRadius: 2 }}>
                  <Tabs value={activeTab} onChange={(e, nv) => setActiveTab(nv)} aria-label="bhert tabs" variant="fullWidth" sx={{ minHeight: 'unset', '& .MuiTabs-flexContainer': { gap: 0.5 } }}>
                    <Tab value="form" label="Form" sx={{ py: 1 }} />
                    <Tab value="records" label={`Records (${records.length})`} sx={{ py: 1 }} />
                    <Tab value="transaction" label="Transaction" sx={{ py: 1 }} />
                  </Tabs>
                </Paper>
              </Box>
            </Paper>

            {/* Form */}
            {activeTab === 'form' && (
              <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
                <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
                  <CardHeader title={<Typography variant="h6">{editingId ? 'Edit Record' : 'New BHERT Positive Record'}</Typography>} subheader={selectedRecord && !editingId && (<Typography variant="caption" sx={{ color: 'grey.500' }}>Viewing: {selectedRecord.full_name}</Typography>)} sx={{ borderBottom: 1, borderColor: 'grey.200' }} />
                  <CardContent>
                    <Stack spacing={2}>
                      <Autocomplete
                        options={residents}
                        getOptionLabel={(opt) => opt.full_name || ''}
                        value={residents.find((r) => r.resident_id === formData.resident_id) || null}
                        onChange={(e, nv) => {
                          if (nv) {
                            setFormData({
                              ...formData,
                              resident_id: nv.resident_id,
                              full_name: nv.full_name || formData.full_name,
                              address: nv.address || formData.address,
                            });
                          } else {
                            setFormData({ ...formData, resident_id: '', full_name: '' });
                          }
                        }}
                        renderInput={(params) => <TextField {...params} label="Full Name *" variant="outlined" size="small" fullWidth />}
                      />

                      

                      <TextField label="Address *" variant="outlined" size="small" fullWidth multiline rows={2} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />

                      <TextField label="Request Reason *" variant="outlined" size="small" fullWidth multiline rows={2} placeholder="Monitoring, Return to Work, etc." value={formData.request_reason} onChange={(e) => setFormData({ ...formData, request_reason: e.target.value })} />

                      <TextField label="Date Issued *" type="date" variant="outlined" size="small" fullWidth InputLabelProps={{ shrink: true }} value={formData.date_issued} onChange={(e) => setFormData({ ...formData, date_issued: e.target.value })} helperText={formData.date_issued ? (() => { const date=new Date(formData.date_issued); const day=date.getDate(); const month=date.toLocaleString('default',{month:'long'}); const year=date.getFullYear(); const suffix = day%10===1&&day!==11?'st':day%10===2&&day!==12?'nd':day%10===3&&day!==13?'rd':'th'; return `Formatted: ${day}${suffix} day of ${month}, ${year}`; })() : 'Select the date'} />

                      <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
                        <Button onClick={handleSubmit} variant="contained" startIcon={<SaveIcon />} fullWidth color="primary">{editingId ? 'Update' : 'Save'}</Button>
                        {(editingId || isFormOpen) && (<Button onClick={resetForm} variant="outlined" startIcon={<CloseIcon />} color="primary">Cancel</Button>)}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Records */}
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
                        <Card key={record.bhert_certificate_positive_id} sx={{ boxShadow: 1, '&:hover': { boxShadow: 2 }, transition: 'box-shadow 0.2s', borderLeft: '4px solid', borderColor: 'primary.main' }}>
                          <CardContent sx={{ p: 1.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{record.full_name}</Typography>
                                <Typography variant="caption" sx={{ color: 'grey.600', display: 'block' }}>{record.address}</Typography>
                                <Typography variant="caption" sx={{ color: 'grey.700', display: 'block', mt: 0.5 }}>{record.request_reason}</Typography>
                                <Typography variant="caption" sx={{ color: 'grey.400', display: 'block' }}>Issued: {formatDateDisplay(record.date_issued)}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                                <IconButton size="small" onClick={()=>handleView(record)} sx={{ color: 'info.main' }} title="View"><EyeIcon sx={{ fontSize: 16 }} /></IconButton>
                                <IconButton size="small" onClick={()=>handleEdit(record)} sx={{ color: 'success.main' }} title="Edit"><EditIcon sx={{ fontSize: 16 }} /></IconButton>
                                <IconButton size="small" onClick={()=>handleDelete(record.bhert_certificate_positive_id)} sx={{ color: 'error.main' }} title="Delete"><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
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

            {/* Transaction */}
            {activeTab === 'transaction' && (
              <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
                <Card sx={{ borderRadius: 3, boxShadow: 1, mb: 2 }}>
                  <CardHeader title={<Typography variant="h6">Search by Transaction Number</Typography>} sx={{ borderBottom: 1, borderColor: 'grey.200' }} />
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField fullWidth size="small" placeholder="Enter transaction number (e.g., BHERT-240101-123456)" value={transactionSearch} onChange={(e)=>setTransactionSearch(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><FileTextIcon sx={{ color: 'grey.400', fontSize: 20 }} /></InputAdornment>) }} />
                      <Button variant="contained" color="primary" onClick={handleTransactionSearch} startIcon={<SearchIcon />} sx={{ px: 3 }}>Search</Button>
                    </Box>
                    <Typography variant="caption" color="text.secondary">Transaction numbers are generated automatically. Format: BHERT-YYMMDD-######</Typography>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
                  <CardHeader title={<Typography variant="h6">Recent Transactions</Typography>} sx={{ borderBottom: 1, borderColor: 'grey.200' }} />
                  <CardContent>
                    {transactionFilteredRecords.length === 0 ? (
                      <Box sx={{ p: 3, textAlign: 'center', color: 'grey.500' }}>No transactions found</Box>
                    ) : (
                      <Stack spacing={1}>
                        {transactionFilteredRecords.map((r) => (
                          <Card key={r.bhert_certificate_positive_id} sx={{ boxShadow: 0, '&:hover': { boxShadow: 1 }, transition: 'box-shadow 0.2s', borderLeft: 3, borderColor: 'primary.main' }}>
                            <CardContent sx={{ p: 1.5 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.full_name}</Typography>
                                  <Typography variant="caption" sx={{ color: 'primary.main' }}>{r.transaction_number}</Typography>
                                  <Typography variant="caption" sx={{ display: 'block', color: 'grey.600' }}>{r.address}</Typography>
                                  <Typography variant="caption" sx={{ color: 'grey.400' }}>Issued: {formatDateDisplay(r.date_issued)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  <IconButton size="small" onClick={()=>handleView(r)} title="View"><EyeIcon sx={{ fontSize: 16 }} /></IconButton>
                                  <IconButton size="small" onClick={()=>handleEdit(r)} title="Edit"><EditIcon sx={{ fontSize: 16 }} /></IconButton>
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
