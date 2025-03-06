import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useData } from '../../contexts/DataContext';
import QueryVisualization from '../Visualizations/QueryVisualization';

function SampleDashboard() {
  const { employeeData } = useData();

  const getDepartmentHeadcount = () => {
    const counts = employeeData.reduce((acc, emp) => {
      if (!emp.terminationDate) {
        acc[emp.department] = (acc[emp.department] || 0) + 1;
      }
      return acc;
    }, {});
    return Object.entries(counts).map(([dept, count]) => ({
      department: dept,
      headcount: count
    }));
  };

  const getAverageSalaryByLevel = () => {
    const salaries = employeeData.reduce((acc, emp) => {
      if (!acc[emp.level]) {
        acc[emp.level] = { total: 0, count: 0 };
      }
      acc[emp.level].total += emp.salary;
      acc[emp.level].count += 1;
      return acc;
    }, {});

    return Object.entries(salaries).map(([level, data]) => ({
      level,
      averageSalary: Math.round(data.total / data.count)
    }));
  };

  const getPerformanceDistribution = () => {
    const distribution = employeeData.reduce((acc, emp) => {
      acc[emp.performanceScore] = (acc[emp.performanceScore] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(distribution).map(([score, count]) => ({
      score: `Score ${score}`,
      count
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        HR Analytics Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Headcount by Department
            </Typography>
            <QueryVisualization 
              data={getDepartmentHeadcount()} 
              type="bar" 
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Average Salary by Level
            </Typography>
            <QueryVisualization 
              data={getAverageSalaryByLevel()} 
              type="line" 
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Score Distribution
            </Typography>
            <QueryVisualization 
              data={getPerformanceDistribution()} 
              type="pie" 
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SampleDashboard; 