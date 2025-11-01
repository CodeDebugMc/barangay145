import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#FF3366'];

const Reports = () => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [indigencyData, setIndigencyData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [monthFilter, setMonthFilter] = useState(currentMonth);
  const [yearFilter, setYearFilter] = useState(currentYear);

  useEffect(() => {
    fetchIndigency();
  }, []);

  useEffect(() => {
    generateReport();
  }, [indigencyData, monthFilter, yearFilter]);

  const fetchIndigency = async () => {
    try {
      const res = await axios.get('http://localhost:5000/indigency');
      setIndigencyData(res.data);
    } catch (error) {
      console.error('Error fetching indigency data:', error);
    }
  };

  const generateReport = () => {
    let filteredData = indigencyData;

    if (monthFilter !== 'all') {
      filteredData = filteredData.filter(item => {
        const itemMonth = new Date(item.date_created).getMonth() + 1;
        return itemMonth === parseInt(monthFilter);
      });
    }

    if (yearFilter !== 'all') {
      filteredData = filteredData.filter(item => {
        const itemYear = new Date(item.date_created).getFullYear();
        return itemYear === parseInt(yearFilter);
      });
    }

    const counts = {};
    filteredData.forEach(item => {
      counts[item.request_reason] = (counts[item.request_reason] || 0) + 1;
    });

    const chartData = Object.keys(counts).map(reason => ({
      name: reason,
      value: counts[reason]
    }));

    setReportData(chartData);
  };

  const years = Array.from(new Set(indigencyData.map(item => new Date(item.date_created).getFullYear())));
  if (!years.includes(currentYear)) years.push(currentYear); // ensure current year exists

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#0D4715', fontWeight: 'bold' }}>
        Reports
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              label="Month"
            >
              <MenuItem value="all">All</MenuItem>
              {[...Array(12)].map((_, i) => (
                <MenuItem key={i+1} value={i+1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              label="Year"
            >
              <MenuItem value="all">All</MenuItem>
              {years.sort((a,b)=>b-a).map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Indigency Requests by Reason
            </Typography>
            {reportData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {reportData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography>No data available for selected filters</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Total Indigency Requests
            </Typography>
            <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
              <Typography variant="h3" sx={{ color: '#0D4715', fontWeight: 'bold' }}>
                {indigencyData.filter(item => {
                  const d = new Date(item.date_created);
                  const monthCheck = monthFilter === 'all' || d.getMonth() + 1 === parseInt(monthFilter);
                  const yearCheck = yearFilter === 'all' || d.getFullYear() === parseInt(yearFilter);
                  return monthCheck && yearCheck;
                }).length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Requests recorded in the system
              </Typography>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
