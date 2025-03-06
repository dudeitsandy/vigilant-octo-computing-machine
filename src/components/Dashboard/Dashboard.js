import React from 'react';
import { Box, Paper } from '@mui/material';
import { useData } from '../../contexts/DataContext';
import SampleDashboard from './SampleDashboard';

function Dashboard() {
  const { employeeData } = useData();

  if (!employeeData.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          No data available. Please go to Data Management to generate or upload data.
        </Paper>
      </Box>
    );
  }

  return <SampleDashboard />;
}

export default Dashboard; 