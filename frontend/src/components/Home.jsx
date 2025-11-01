import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Home = () => {
  const { user, hasPermission } = useAuth();
  const [stats, setStats] = useState({
    residents: 0,
    certificates: 0,
    users: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const [residentsRes, certificatesRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/residents'),
        axios.get('http://localhost:5000/certificates'),
        hasPermission('manage_users') ? axios.get('http://localhost:5000/users') : Promise.resolve({ data: [] })
      ]);

      setStats({
        residents: residentsRes.data.length,
        certificates: certificatesRes.data.length,
        users: usersRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const [residentsRes, certificatesRes] = await Promise.all([
        axios.get('http://localhost:5000/residents'),
        axios.get('http://localhost:5000/certificates')
      ]);

      const activities = [
        ...residentsRes.data.slice(0, 3).map(resident => ({
          type: 'resident',
          message: `New resident added: ${resident.full_name}`,
          time: new Date(resident.created_at || Date.now()).toLocaleDateString()
        })),
        ...certificatesRes.data.slice(0, 3).map(cert => ({
          type: 'certificate',
          message: `Certificate issued for ${cert.full_name}`,
          time: new Date(cert.date_issued || Date.now()).toLocaleDateString()
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'chairman': return 'primary';
      case 'staff': return 'success';
      default: return 'default';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <AdminIcon />;
      case 'chairman': return <PersonIcon />;
      case 'staff': return <PersonIcon />;
      default: return <PersonIcon />;
    }
  };

  const quickActions = [
    {
      title: 'Manage Residents',
      description: 'Add, edit, or view resident information',
      icon: <PeopleIcon />,
      permission: 'manage_residents',
      action: () => window.location.href = '/residents'
    },
    {
      title: 'Issue Certificates',
      description: 'Create and manage certificates',
      icon: <AssignmentIcon />,
      permission: 'manage_certificates',
      action: () => window.location.href = '/certificates'
    },
    {
      title: 'View Reports',
      description: 'Generate and view system reports',
      icon: <AssessmentIcon />,
      permission: 'view_reports',
      action: () => window.location.href = '/reports'
    },
    {
      title: 'Manage Users',
      description: 'Add, edit, or remove system users',
      icon: <SettingsIcon />,
      permission: 'manage_users',
      action: () => window.location.href = '/users'
    }
  ].filter(action => hasPermission(action.permission));

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#0D4715', fontWeight: 'bold' }}>
          Welcome back, {user?.name}!
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={getRoleIcon(user?.role)}
            label={user?.role?.toUpperCase()}
            color={getRoleColor(user?.role)}
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
          <Typography variant="body2" color="text.secondary">
            Barangay 145 Management System
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', backgroundColor: '#f8f9fa' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ color: '#0D4715', mr: 1, fontSize: '2rem' }} />
                <Typography variant="h4" component="div" sx={{ color: '#0D4715', fontWeight: 'bold' }}>
                  {stats.residents}
                </Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                Total Residents
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Registered in the system
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', backgroundColor: '#f8f9fa' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon sx={{ color: '#0D4715', mr: 1, fontSize: '2rem' }} />
                <Typography variant="h4" component="div" sx={{ color: '#0D4715', fontWeight: 'bold' }}>
                  {stats.certificates}
                </Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                Certificates Issued
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total certificates created
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {hasPermission('manage_users') && (
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', backgroundColor: '#f8f9fa' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SettingsIcon sx={{ color: '#0D4715', mr: 1, fontSize: '2rem' }} />
                  <Typography variant="h4" component="div" sx={{ color: '#0D4715', fontWeight: 'bold' }}>
                    {stats.users}
                  </Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  System Users
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active user accounts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#0D4715', fontWeight: 'bold', mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={action.action}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {action.icon}
                        <Typography variant="h6" sx={{ ml: 1, color: '#0D4715' }}>
                          {action.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#0D4715', fontWeight: 'bold', mb: 3 }}>
              Recent Activity
            </Typography>
            <List>
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        {activity.type === 'resident' ? <PeopleIcon color="primary" /> : <AssignmentIcon color="secondary" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.message}
                        secondary={activity.time}
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary="No recent activity"
                    secondary="Activity will appear here as you use the system"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;



