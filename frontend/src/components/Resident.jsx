import React, { useEffect, useMemo, useState } from 'react';
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
  Modal,
  Avatar,
  Fab,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  CardActions,
} from '@mui/material';
import {
  Save as SaveIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as FileTextIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Favorite as HeartIcon,
  CalendarToday as CalendarIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Add as AddIcon,
} from '@mui/icons-material';

export default function Residents() {
  const apiBase = 'http://localhost:5000';

  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    address: '',
    provincial_address: '',
    dob: '',
    age: '',
    civil_status: 'Single',
    contact_no: '',
    created_at: new Date().toISOString().split('T')[0],
  });

  const civilStatusOptions = [
    'Single',
    'Married',
    'Widowed',
    'Divorced',
    'Separated',
  ];

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
              dob: r.dob?.slice(0, 10) || '',
              age: String(r.age ?? ''),
              civil_status: r.civil_status,
              contact_no: r.contact_no || '',
              created_at: r.created_at?.slice(0, 10) || '',
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
      const age = Math.floor(
        (today - birthDate) / (365.25 * 24 * 60 * 60 * 1000)
      );
      setFormData({ ...formData, dob, age: String(age) });
    } else {
      setFormData({ ...formData, dob: '', age: '' });
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
      created_at: data.created_at || new Date().toISOString().split('T')[0],
    };
  }

  function validateForm() {
    const requiredFields = ['full_name', 'address', 'dob', 'civil_status'];
    for (let field of requiredFields) {
      if (!formData[field].trim()) {
        alert('Please fill all required fields.');
        return false;
      }
    }

    // Check for duplicate resident
    const isDuplicate = records.some(
      (r) =>
        r.full_name.trim().toLowerCase() ===
          formData.full_name.trim().toLowerCase() &&
        r.dob === formData.dob &&
        r.resident_id !== editingId
    );

    if (isDuplicate) {
      alert('Resident already exists (same name and date of birth).');
      return false;
    }

    return true;
  }

  async function handleCreate() {
    if (!validateForm()) return;
    try {
      const res = await fetch(`${apiBase}/residents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toServerPayload(formData)),
      });
      if (!res.ok) throw new Error('Create failed');
      const created = await res.json();
      const newRec = { ...formData, resident_id: created.resident_id };
      setRecords([newRec, ...records]);
      resetForm();
      alert('Resident added successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to create record');
    }
  }

  async function handleUpdate() {
    if (!validateForm()) return;
    try {
      const res = await fetch(`${apiBase}/residents/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toServerPayload(formData)),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = { ...formData, resident_id: editingId };
      setRecords(
        records.map((r) => (r.resident_id === editingId ? updated : r))
      );
      resetForm();
      alert('Resident updated successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to update record');
    }
  }

  function handleEdit(record) {
    setFormData({ ...record });
    setEditingId(record.resident_id);
    setIsModalOpen(true);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this resident?')) return;
    try {
      const res = await fetch(`${apiBase}/residents/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      setRecords(records.filter((r) => r.resident_id !== id));
      alert('Resident deleted successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to delete resident');
    }
  }

  function resetForm() {
    setFormData({
      full_name: '',
      address: '',
      provincial_address: '',
      dob: '',
      age: '',
      civil_status: 'Single',
      contact_no: '',
      created_at: new Date().toISOString().split('T')[0],
    });
    setEditingId(null);
    setIsModalOpen(false);
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
          (r.contact_no || '').includes(searchTerm)
      ),
    [records, searchTerm]
  );

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function getInitials(name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'grey.100',
        p: 2,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: '#445C3C',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'white', color: '#445C3C', mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Residents Information
            </Typography>
          </Box>
          <Typography variant="body1">
            Total Records: {records.length}
          </Typography>
        </Paper>

        {/* Search and View Controls */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TextField
            sx={{ width: '70%' }}
            size="small"
            placeholder="Search residents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'grey.400' }} />
                </InputAdornment>
              ),
            }}
          />
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            aria-label="view mode"
          >
            <ToggleButton value="grid" aria-label="grid view">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>

        {/* Records Display */}
        {filteredRecords.length === 0 ? (
          <Paper
            sx={{
              p: 5,
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: 'white',
            }}
          >
            <Typography variant="h6" color="textSecondary">
              {searchTerm ? 'No residents found' : 'No records yet'}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Click the + button to add a new resident
            </Typography>
          </Paper>
        ) : viewMode === 'grid' ? (
          <Grid container spacing={3}>
            {filteredRecords.map((record) => (
              <Grid item xs={12} sm={6} md={4} key={record.resident_id}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: '#445C3C' }}>
                        {getInitials(record.full_name)}
                      </Avatar>
                    }
                    title={record.full_name}
                    subheader={`Age: ${record.age}`}
                  />
                  <Divider />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <HomeIcon
                          fontSize="small"
                          sx={{ mr: 1, color: '#445C3C' }}
                        />
                        <Typography variant="body2">
                          {record.address}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CakeIcon
                          fontSize="small"
                          sx={{ mr: 1, color: '#445C3C' }}
                        />
                        <Typography variant="body2">
                          {formatDate(record.dob)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <HeartIcon
                          fontSize="small"
                          sx={{ mr: 1, color: '#445C3C' }}
                        />
                        <Typography variant="body2">
                          {record.civil_status}
                        </Typography>
                      </Box>
                      {record.contact_no && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhoneIcon
                            fontSize="small"
                            sx={{ mr: 1, color: '#445C3C' }}
                          />
                          <Typography variant="body2">
                            {record.contact_no}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon
                          fontSize="small"
                          sx={{ mr: 1, color: '#445C3C' }}
                        />
                        <Typography variant="body2">
                          Added: {formatDate(record.created_at)}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(record)}
                      sx={{ color: '#445C3C' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(record.resident_id)}
                      sx={{ color: '#d32f2f' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper elevation={3} sx={{ borderRadius: 3 }}>
            <List>
              {filteredRecords.map((record, index) => (
                <React.Fragment key={record.resident_id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#445C3C' }}>
                        {getInitials(record.full_name)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {record.full_name}
                        </Typography>
                      }
                      secondary={
                        <Stack spacing={0.5} sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <HomeIcon
                              fontSize="small"
                              sx={{ mr: 1, color: '#445C3C' }}
                            />
                            <Typography variant="body2">
                              {record.address}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CakeIcon
                              fontSize="small"
                              sx={{ mr: 1, color: '#445C3C' }}
                            />
                            <Typography variant="body2">
                              {formatDate(record.dob)} ({record.age} years old)
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <HeartIcon
                              fontSize="small"
                              sx={{ mr: 1, color: '#445C3C' }}
                            />
                            <Typography variant="body2">
                              {record.civil_status}
                            </Typography>
                          </Box>
                          {record.contact_no && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PhoneIcon
                                fontSize="small"
                                sx={{ mr: 1, color: '#445C3C' }}
                              />
                              <Typography variant="body2">
                                {record.contact_no}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleEdit(record)}
                        sx={{ color: '#445C3C', mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDelete(record.resident_id)}
                        sx={{ color: '#d32f2f' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < filteredRecords.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 16,
            bgcolor: '#445C3C',
            '&:hover': {
              bgcolor: '#2e3d28',
            },
          }}
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <AddIcon />
        </Fab>

        {/* Modal for Form */}
        <Modal
          open={isModalOpen}
          onClose={resetForm}
          aria-labelledby="resident-form-modal"
          aria-describedby="form-to-add-or-edit-resident"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: '70%', md: '50%' },
              maxHeight: '90vh',
              overflow: 'auto',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: '#445C3C', mr: 2 }}>
                <PersonIcon />
              </Avatar>
              <Typography variant="h5" component="h2">
                {editingId ? 'Edit Resident Record' : 'New Resident Record'}
              </Typography>
            </Box>

            <Stack spacing={2}>
              <TextField
                label="Full Name *"
                size="small"
                fullWidth
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Address *"
                size="small"
                fullWidth
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Date of Birth *"
                    type="date"
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={formData.dob}
                    onChange={(e) => handleDobChange(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CakeIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Age"
                    size="small"
                    fullWidth
                    value={formData.age}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
              <TextField
                label="Provincial Address"
                size="small"
                fullWidth
                value={formData.provincial_address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    provincial_address: e.target.value,
                  })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Contact Number"
                size="small"
                fullWidth
                value={formData.contact_no}
                onChange={(e) =>
                  setFormData({ ...formData, contact_no: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth size="small">
                <InputLabel>Civil Status *</InputLabel>
                <Select
                  value={formData.civil_status}
                  label="Civil Status *"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      civil_status: e.target.value,
                    })
                  }
                  startAdornment={
                    <InputAdornment position="start">
                      <HeartIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  {civilStatusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(45deg, #2e7d32, #388e3c)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1b5e20, #2e7d32)',
                    },
                  }}
                  onClick={handleSubmit}
                >
                  {editingId ? 'Update' : 'Save'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </Box>
            </Stack>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
}
