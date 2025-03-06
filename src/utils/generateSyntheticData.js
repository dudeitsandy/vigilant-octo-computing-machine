const DEPARTMENTS = {
  Engineering: { minSalary: 80000, maxSalary: 180000, targetSize: 0.35 },
  Sales: { minSalary: 60000, maxSalary: 150000, targetSize: 0.2 },
  Marketing: { minSalary: 55000, maxSalary: 140000, targetSize: 0.15 },
  HR: { minSalary: 50000, maxSalary: 130000, targetSize: 0.1 },
  Finance: { minSalary: 65000, maxSalary: 160000, targetSize: 0.1 },
  Operations: { minSalary: 45000, maxSalary: 120000, targetSize: 0.1 },
};

const LOCATIONS = {
  'US-NY': 0.25,
  'US-CA': 0.2,
  'US-TX': 0.15,
  'UK-LON': 0.15,
  'IN-BLR': 0.15,
  'SG-SIN': 0.1,
};

const LEVELS = {
  'Entry Level': { salaryMultiplier: 0.7, targetSize: 0.25 },
  'Associate': { salaryMultiplier: 0.85, targetSize: 0.3 },
  'Senior': { salaryMultiplier: 1.0, targetSize: 0.25 },
  'Lead': { salaryMultiplier: 1.2, targetSize: 0.1 },
  'Manager': { salaryMultiplier: 1.5, targetSize: 0.07 },
  'Director': { salaryMultiplier: 2.0, targetSize: 0.03 },
};

function getRandomFromDistribution(distribution) {
  const rand = Math.random();
  let cumulative = 0;
  
  for (const [key, value] of Object.entries(distribution)) {
    cumulative += typeof value === 'number' ? value : value.targetSize;
    if (rand < cumulative) {
      return key;
    }
  }
  
  return Object.keys(distribution)[0];
}

function generateDateInRange(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generatePerformanceHistory(years) {
  const history = [];
  for (let i = 0; i < years; i++) {
    history.push({
      year: new Date().getFullYear() - i,
      score: Math.floor(Math.random() * 3) + 3 // 3-5 score range
    });
  }
  return history;
}

export function generateSyntheticData(count = 1000) {
  const employees = [];
  const today = new Date();
  const fiveYearsAgo = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());

  for (let i = 0; i < count; i++) {
    const department = getRandomFromDistribution(DEPARTMENTS);
    const level = getRandomFromDistribution(LEVELS);
    const location = getRandomFromDistribution(LOCATIONS);
    
    const baseSalary = Math.floor(
      Math.random() * 
      (DEPARTMENTS[department].maxSalary - DEPARTMENTS[department].minSalary) + 
      DEPARTMENTS[department].minSalary
    );
    
    const adjustedSalary = Math.floor(baseSalary * LEVELS[level].salaryMultiplier);
    const startDate = generateDateInRange(fiveYearsAgo, today);
    const terminationDate = Math.random() > 0.9 ? generateDateInRange(startDate, today) : null;
    const yearsOfHistory = Math.floor((today - startDate) / (1000 * 60 * 60 * 24 * 365));
    const performanceHistory = generatePerformanceHistory(yearsOfHistory);
    const latestPerformance = performanceHistory[0] || { score: 4 };

    employees.push({
      id: i + 1,
      department,
      location,
      level,
      salary: adjustedSalary,
      startDate: startDate.toISOString().split('T')[0],
      terminationDate: terminationDate?.toISOString().split('T')[0],
      performanceScore: latestPerformance.score,
      performanceHistory,
      manager: i > 10 ? Math.floor(Math.random() * (i - 1)) + 1 : null,
      totalYearsExperience: Math.floor(Math.random() * 20) + 1,
      age: Math.floor(Math.random() * 35) + 22, // 22-57 age range
      gender: Math.random() > 0.5 ? 'F' : 'M',
      ethnicity: ['Asian', 'Black', 'Hispanic', 'White', 'Other'][Math.floor(Math.random() * 5)],
      educationLevel: ['Bachelor', 'Master', 'PhD', 'High School'][Math.floor(Math.random() * 4)],
      promotionDate: Math.random() > 0.7 ? generateDateInRange(startDate, today).toISOString().split('T')[0] : null,
    });
  }

  return employees;
}

export function generateAndSaveData(count = 5000) {
  const data = generateSyntheticData(count);
  localStorage.setItem('hr_analytics_data', JSON.stringify(data));
  return data;
}

export function loadSavedData() {
  const saved = localStorage.getItem('hr_analytics_data');
  return saved ? JSON.parse(saved) : null;
} 