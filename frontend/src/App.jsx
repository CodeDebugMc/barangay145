import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  createTheme,
  ThemeProvider,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  HomeFilled
} from '@mui/icons-material';
import axios from 'axios';

// Import existing components
import Login from './components/Login';
import Footer from './components/Footer';
import Indigency from './components/Indigency';
import CertificationAction from './components/CertificationAction';
import Home from './components/Home';
import UserManagement from './components/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import CaloocanLogo from './assets/CaloocanLogo.png';
import Logo145 from './assets/Logo145.png';
import BarangayClearance from './components/BarangayClearance';
import Sidebar from './components/Sidebar';
import OathJobSeeker from './components/OathJobSeeker';
import SoloParentForm from './components/SoloParentForm';
import BarangayClearanceCRUD from './components/BarangayClearanceCRUD';
import BusinessClearance from './components/BusinessClearance';
import { useNavigate } from 'react-router-dom';


const drawerWidth = 250;

// Header component for non-authenticated users
function Header() {
  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: '#445C3C',
        color: 'white',
        padding: '10px 20px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={CaloocanLogo}
          alt="Caloocan Logo"
          style={{
            height: '40px',
            marginRight: '15px',
          }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2, margin: 0 }}>
           Caloocan Barangay 145
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.2, margin: 0, opacity: 0.9 }}>
            Information and Management Request System
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// Navigation component for authenticated users
function Navigation() {
  const { user, logout, hasPermission } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [certificatesDropdownOpen, setCertificatesDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    setTimeout(() => {
        navigate('/home');
      }, 1500);
  };

  const handleCertificatesDropdownToggle = () => {
    setCertificatesDropdownOpen(!certificatesDropdownOpen);
  };

  const navigationItems = [
    { path: '/home', label: 'Home', icon: <HomeFilled />, permission: 'view_dashboard' },
    { path: '/residents', label: 'Residents', icon: <PeopleIcon />, permission: 'manage_residents' },
    { 
      path: '/certificates', 
      label: 'Certificates', 
      icon: <AssignmentIcon />, 
      permission: 'manage_certificates',
      hasDropdown: true,
      dropdownItems: [
        { path: '/certificates/certification-action', label: 'Certification Action', icon: <AssignmentIcon /> },
        { path: '/certificates/indigency', label: 'Indigency', icon: <AssignmentIcon /> }
      ]
    },
    { path: '/users', label: 'Users', icon: <SettingsIcon />, permission: 'manage_users' },
  ].filter(item => hasPermission(item.permission));

  return (
    <AppBar
      position="fixed"
      sx={{ 
        zIndex: 1201, 
        bgcolor: '#445C3C', 
        height: '65px',
        top: 0,
        left: 0,
        right: 0
      }}
    >
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={CaloocanLogo}
              alt="Logo"
              style={{
                height: '45px',
                marginRight: '10px',
              }}
            />
           
            <Box>
              <Typography variant="h5" noWrap sx={{ lineHeight: 1.3, color: 'white', fontWeight: 'bold', marginTop: '8px' }}>
                Caloocan Barangay 145 
              </Typography>
              <Typography variant="subtitle1" noWrap sx={{ color: 'white', fontWeight: 'bold', marginTop: '-5px' }}>
               Information and Request Management System
              </Typography>
            </Box>
          </Box>
        </Box>



        {/* User Profile Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'white', mr: 2, display: { xs: 'none', sm: 'block' } }}>
            {user?.name} ({user?.role?.toUpperCase()})
          </Typography>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <Box sx={{ 
          display: { xs: 'block', md: 'none' }, 
          bgcolor: '#445C3C',
          p: 2,
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          {navigationItems.map((item) => (
            <Box key={item.path}>
              {item.hasDropdown ? (
                <Box>
                  <Button
                    color="inherit"
                    startIcon={item.icon}
                    endIcon={certificatesDropdownOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    onClick={handleCertificatesDropdownToggle}
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      mb: 1,
                      backgroundColor: location.pathname.startsWith(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                  {certificatesDropdownOpen && (
                    <Box sx={{ ml: 2 }}>
                      {item.dropdownItems.map((dropdownItem) => (
                        <Button
                          key={dropdownItem.path}
                          color="inherit"
                          startIcon={dropdownItem.icon}
                          href={dropdownItem.path}
                          fullWidth
                          sx={{
                            justifyContent: 'flex-start',
                            mb: 1,
                            backgroundColor: location.pathname === dropdownItem.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.1)',
                            },
                          }}
                        >
                          {dropdownItem.label}
                        </Button>
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                <Button
                  color="inherit"
                  startIcon={item.icon}
                  href={item.path}
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    mb: 1,
                    backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              )}
            </Box>
          ))}
        </Box>
      )}
    </AppBar>
  );
}

function AppContent() {
  const [settings, setSettings] = useState({});
  const { user, loading } = useAuth();

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#445C3C'
      }}>
        Loading...
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        '& *': {
          boxSizing: 'border-box'
        }
      }}
    >
      {user && <Navigation />}
      {!user && <Header />}

      {/* Main Content */}
      <Box sx={{ display: 'flex', width: '100%' }}>
        {user && <Sidebar />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'transparent',
            p: user ? 3 : 5,
            fontFamily: 'Poppins, sans-serif',
            ml: user ? { xs: 0, md: `${drawerWidth}px` } : 0
          }}
        >
          {user && <Toolbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff', 'chairman']}>
                <Home />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/residents" 
            element={
            <ProtectedRoute allowedRoles={['admin', 'staff', 'chairman']}>                
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/certificates" 
            element={
               <ProtectedRoute allowedRoles={['admin', 'staff', 'chairman']}>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/certification-action" 
            element={
               <ProtectedRoute allowedRoles={['admin', 'staff', 'chairman']}>
                <CertificationAction />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/indigency" 
            element={
               <ProtectedRoute allowedRoles={['admin', 'staff', 'chairman']}>
                <Indigency />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/barangay-clearance" 
            element={
               <ProtectedRoute allowedRoles={['admin', 'staff', 'chairman']}>
                <BarangayClearance />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/oath-job-seeker" 
            element={
               <ProtectedRoute allowedRoles={['admin', 'staff', 'chairman']}>
                <OathJobSeeker />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/solo-parent-form" 
            element={
               <ProtectedRoute allowedRoles={['admin', 'staff', 'chairman']}>
                <SoloParentForm />
              </ProtectedRoute>
            } 
          />

           <Route 
            path="/business-clearance" 
            element={
               <ProtectedRoute allowedRoles={['admin', 'staff', 'chairman']}>
                <BusinessClearance />
              </ProtectedRoute>
            } 
          />


          <Route 
            path="/clearance" 
            element={
               <ProtectedRoute allowedRoles={['admin', 'staff', 'chairman']}>
                <BarangayClearanceCRUD />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/users" 
            element={
              <ProtectedRoute requiredPermission="manage_users">
                <UserManagement />
              </ProtectedRoute>
            } 
          />
        </Routes>
        </Box>
      </Box>


      {/* Footer */}
      <Box
        component="footer"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#445C3C',
          color: 'white',
          textAlign: 'center',
          padding: '20px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        <img
          src={CaloocanLogo}
          alt="Caloocan Logo"
          style={{
            height: '40px',
          }}
        />
       
        <Typography variant="body2">
          {'© 2025 - Caloocan Barangay 145 Information and Request Management System. All rights reserved.'}
        </Typography>

        <img
          src={Logo145}
          alt="Barangay 145 Logo"
          style={{
            height: '43px',
          }}
        />
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider
      theme={createTheme({
        typography: {
          fontFamily: 'Poppins, sans-serif',
          body1: { fontSize: '13px' },
        },
      })}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

