import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [employeeData, setEmployeeData] = useState([]);
  const [dashboardConfig, setDashboardConfig] = useState([]);
  const [queryResults, setQueryResults] = useState(null);
  const [savedQueries, setSavedQueries] = useState([]);

  const value = {
    employeeData,
    setEmployeeData,
    dashboardConfig,
    setDashboardConfig,
    queryResults,
    setQueryResults,
    savedQueries,
    setSavedQueries,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
} 