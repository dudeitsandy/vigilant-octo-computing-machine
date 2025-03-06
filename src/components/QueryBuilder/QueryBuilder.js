import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Button,
  Grid,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useData } from '../../contexts/DataContext';
import QueryVisualization from '../Visualizations/QueryVisualization';

const FIELDS = [
  { value: 'department', label: 'Department' },
  { value: 'location', label: 'Location' },
  { value: 'level', label: 'Level' },
  { value: 'salary', label: 'Salary' },
  { value: 'startDate', label: 'Start Date' },
  { value: 'terminationDate', label: 'Termination Date' },
  { value: 'performanceScore', label: 'Performance Score' },
];

const OPERATORS = [
  { value: '=', label: 'Equals' },
  { value: '!=', label: 'Not Equals' },
  { value: '>', label: 'Greater Than' },
  { value: '<', label: 'Less Than' },
  { value: 'LIKE', label: 'Contains' },
  { value: 'IS NULL', label: 'Is Empty' },
  { value: 'IS NOT NULL', label: 'Is Not Empty' },
];

function QueryBuilder() {
  const { employeeData, savedQueries, setSavedQueries, setQueryResults } = useData();
  const [selectedFields, setSelectedFields] = useState(['department', 'level', 'salary']);
  const [conditions, setConditions] = useState([{ field: '', operator: '', value: '' }]);
  const [results, setResults] = useState([]);
  const [saveQueryDialogOpen, setSaveQueryDialogOpen] = useState(false);
  const [queryName, setQueryName] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [visualizationType, setVisualizationType] = useState('table');

  const handleAddCondition = () => {
    setConditions([...conditions, { field: '', operator: '', value: '' }]);
  };

  const handleRemoveCondition = (index) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setConditions(newConditions);
  };

  const executeQuery = () => {
    let filteredData = [...employeeData];

    // Apply conditions
    conditions.forEach(({ field, operator, value }) => {
      if (!field || !operator) return;

      filteredData = filteredData.filter(record => {
        const recordValue = record[field];
        
        switch (operator) {
          case '=':
            return recordValue == value;
          case '!=':
            return recordValue != value;
          case '>':
            return recordValue > value;
          case '<':
            return recordValue < value;
          case 'LIKE':
            return String(recordValue).toLowerCase().includes(String(value).toLowerCase());
          case 'IS NULL':
            return !recordValue;
          case 'IS NOT NULL':
            return !!recordValue;
          default:
            return true;
        }
      });
    });

    // Select only requested fields
    const results = filteredData.map(record => {
      const result = {};
      selectedFields.forEach(field => {
        result[field] = record[field];
      });
      return result;
    });

    setResults(results);
    setQueryResults(results);
  };

  const handleSaveQuery = () => {
    const query = {
      id: Date.now(),
      name: queryName,
      config: {
        selectedFields,
        conditions,
      }
    };
    setSavedQueries([...savedQueries, query]);
    setSaveQueryDialogOpen(false);
    setQueryName('');
  };

  const loadSavedQuery = (query) => {
    setSelectedFields(query.config.selectedFields);
    setConditions(query.config.conditions);
    setActiveTab(0);
  };

  const exportResults = () => {
    const csv = [
      selectedFields.join(','),
      ...results.map(row => selectedFields.map(field => row[field]).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Query Builder
      </Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Build Query" />
        <Tab label="Saved Queries" />
      </Tabs>

      {activeTab === 0 ? (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Fields
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Fields</InputLabel>
              <Select
                multiple
                value={selectedFields}
                onChange={(e) => setSelectedFields(e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={FIELDS.find(f => f.value === value)?.label} 
                      />
                    ))}
                  </Box>
                )}
              >
                {FIELDS.map((field) => (
                  <MenuItem key={field.value} value={field.value}>
                    {field.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom>
              Conditions
            </Typography>
            {conditions.map((condition, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel>Field</InputLabel>
                    <Select
                      value={condition.field}
                      onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                    >
                      {FIELDS.map((field) => (
                        <MenuItem key={field.value} value={field.value}>
                          {field.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel>Operator</InputLabel>
                    <Select
                      value={condition.operator}
                      onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                    >
                      {OPERATORS.map((op) => (
                        <MenuItem key={op.value} value={op.value}>
                          {op.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Value"
                    value={condition.value}
                    onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                    disabled={['IS NULL', 'IS NOT NULL'].includes(condition.operator)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => handleRemoveCondition(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<AddIcon />} onClick={handleAddCondition}>
              Add Condition
            </Button>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={executeQuery}>
                Execute Query
              </Button>
              <Button 
                startIcon={<SaveIcon />}
                onClick={() => setSaveQueryDialogOpen(true)}
              >
                Save Query
              </Button>
              {results.length > 0 && (
                <Button 
                  startIcon={<FileDownloadIcon />}
                  onClick={exportResults}
                >
                  Export Results
                </Button>
              )}
            </Box>
          </Paper>

          {results.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Results ({results.length} records)
                </Typography>
                <FormControl sx={{ width: 200 }}>
                  <InputLabel>View Type</InputLabel>
                  <Select
                    value={visualizationType}
                    onChange={(e) => setVisualizationType(e.target.value)}
                  >
                    <MenuItem value="table">Table</MenuItem>
                    <MenuItem value="bar">Bar Chart</MenuItem>
                    <MenuItem value="pie">Pie Chart</MenuItem>
                    <MenuItem value="line">Line Chart</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {visualizationType === 'table' ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {selectedFields.map((field) => (
                          <TableCell key={field}>
                            {FIELDS.find(f => f.value === field)?.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.map((row, index) => (
                        <TableRow key={index}>
                          {selectedFields.map((field) => (
                            <TableCell key={field}>{row[field]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <QueryVisualization data={results} type={visualizationType} />
              )}
            </Paper>
          )}
        </>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Saved Queries
          </Typography>
          {savedQueries.map((query) => (
            <Box
              key={query.id}
              sx={{
                p: 2,
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography>{query.name}</Typography>
              <Button
                variant="outlined"
                onClick={() => loadSavedQuery(query)}
              >
                Load Query
              </Button>
            </Box>
          ))}
        </Paper>
      )}

      <Dialog open={saveQueryDialogOpen} onClose={() => setSaveQueryDialogOpen(false)}>
        <DialogTitle>Save Query</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Query Name"
            fullWidth
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveQueryDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveQuery} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default QueryBuilder; 