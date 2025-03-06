import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Paper, 
  Typography, 
  TextField,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import { useData } from '../../contexts/DataContext';
import { generateSyntheticData, generateAndSaveData, loadSavedData } from '../../utils/generateSyntheticData';

function DataIngestion() {
  const { setEmployeeData } = useData();
  const [employeeCount, setEmployeeCount] = useState(1000);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedData = loadSavedData();
    if (savedData) {
      setEmployeeData(savedData);
      setNotification({
        open: true,
        message: `Loaded ${savedData.length} saved records`,
        severity: 'success'
      });
    }
  }, []);

  const handleGenerateSyntheticData = () => {
    setIsLoading(true);
    try {
      const data = generateAndSaveData(employeeCount);
      setEmployeeData(data);
      setNotification({
        open: true,
        message: `Successfully generated ${employeeCount} employee records`,
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Error generating data',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setEmployeeData(data);
          setNotification({
            open: true,
            message: 'Successfully loaded data file',
            severity: 'success'
          });
        } catch (error) {
          setNotification({
            open: true,
            message: 'Error parsing file',
            severity: 'error'
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Data Management
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Generate Synthetic Data
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            type="number"
            label="Number of Employees"
            value={employeeCount}
            onChange={(e) => setEmployeeCount(Number(e.target.value))}
            sx={{ width: 200 }}
          />
          <Button 
            variant="contained" 
            onClick={handleGenerateSyntheticData}
            disabled={isLoading}
          >
            Generate Data
          </Button>
        </Box>
      </Paper>

      <Divider sx={{ my: 3 }} />

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload Data
        </Typography>
        <Button
          variant="contained"
          component="label"
        >
          Upload File
          <input
            type="file"
            hidden
            accept=".json,.csv"
            onChange={handleFileUpload}
          />
        </Button>
      </Paper>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DataIngestion; 