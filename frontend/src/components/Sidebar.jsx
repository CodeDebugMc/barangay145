import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Collapse,
  IconButton,
  Divider
} from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { ChartBarIcon, ChartPieIcon, PieChartIcon } from 'lucide-react';

const drawerWidth = 250;

export default function Sidebar() {
  const { user, hasPermission } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [certOpen, setCertOpen] = useState(location.pathname.startsWith('/certificates'));

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const navItems = [
    { path: '/home', label: 'Home', icon: <HomeIcon />, permission: 'view_dashboard' },
    { path: '/residents', label: 'Residents', icon: <PeopleIcon />, permission: 'manage_residents' },
    { path: '/reports', label: 'Reports', icon: <ChartBarIcon />, permission: 'manage_residents' },
    {
      path: '/certificates',
      label: 'Certificates',
      icon: <AssignmentIcon />,
      permission: 'manage_certificates',
      children: [
        { path: '/certification-action', label: 'Certificate of Action', icon: <AssignmentIcon /> },
        { path: '/indigency', label: 'Indigency', icon: <AssignmentIcon /> },
        { path: '/barangay-clearance', label: 'Barangay Clearance', icon: <AssignmentIcon /> },
        { path: '/oath-job-seeker', label: 'Oath Job Seeker', icon: <AssignmentIcon /> },
        { path: '/solo-parent-form', label: 'Solo Parent', icon: <AssignmentIcon /> },
        { path: '/business-clearance', label: 'Business Clearance', icon: <AssignmentIcon /> },
        { path: '/certificate-residency', label: 'Certificate of Residency', icon: <AssignmentIcon /> },
        { path: '/permit-to-travel', label: 'Permit To Travel', icon: <AssignmentIcon /> },
        { path: '/cash-assistance', label: 'Cash Assistance', icon: <AssignmentIcon /> },
        { path: '/cohabitation', label: 'Cohabitation', icon: <AssignmentIcon /> },
        { path: '/financial-assistance', label: 'Financial Assistance', icon: <AssignmentIcon /> },
        { path: '/bhert-cert-positive', label: 'Bhert Certificate Positive', icon: <AssignmentIcon /> },
        { path: '/bhert-cert-normal', label: 'Bhert Certificate Normal', icon: <AssignmentIcon /> },

      ]
    },
    { path: '/users', label: 'Users', icon: <SettingsIcon />, permission: 'manage_users' }
  ].filter(item => hasPermission(item.permission));

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#445C3C', color: 'white', pt:8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, pb: 1.5 }}>
        <Avatar sx={{ bgcolor: 'white', color: '#445C3C' }}>
          <AccountCircleIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Profile</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{user?.name || 'Guest'}</Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />

      <List sx={{ p: 0 }}>
        {navItems.map(item => (
          <Box key={item.path}>
            <ListItemButton
              component={item.children ? 'button' : Link}
              to={item.children ? undefined : item.path}
              onClick={() => {
                if (item.children) setCertOpen(!certOpen);
                if (!item.children) setMobileOpen(false);
              }}
              sx={{
                color: 'white',
                '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.1)' },
                ...(location.pathname === item.path && !item.children ? { bgcolor: 'rgba(255,255,255,0.1)' } : {})
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
              {item.children ? (certOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />) : null}
            </ListItemButton>
            {item.children && (
              <Collapse in={certOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map(child => (
                    <ListItemButton
                      key={child.path}
                      component={Link}
                      to={child.path}
                      onClick={() => setMobileOpen(false)}
                      sx={{ pl: 6, color: 'white', ...(location.pathname === child.path ? { bgcolor: 'rgba(255,255,255,0.1)' } : {}) }}
                    >
                      <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                        {child.icon}
                      </ListItemIcon>
                      <ListItemText primary={child.label} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile toggle button */}
      <IconButton
        onClick={toggleMobile}
        sx={{
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: (theme) => theme.zIndex.drawer + 2,
          display: { xs: 'inline-flex', md: 'none' },
          bgcolor: 'rgba(13,71,21,0.9)',
          color: 'white'
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Temporary drawer for mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#445C3C' }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Permanent drawer for desktop */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#445C3C' }
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}



