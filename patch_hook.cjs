const fs = require('fs');

let content = fs.readFileSync('src/hooks/useDashboardData.ts', 'utf-8');

// Add statsHistory to state
content = content.replace(
  'const [stats, setStats] = useState<SystemStats | null>(null);',
  'const [stats, setStats] = useState<SystemStats | null>(null);\n  const [statsHistory, setStatsHistory] = useState<SystemStats[]>([]);'
);

// Update statsHistory
content = content.replace(
  'setStats(statsRes.value.data);',
  'setStats(statsRes.value.data);\n        setStatsHistory(prev => {\n          const next = [...prev, statsRes.value.data];\n          return next.slice(-20);\n        });'
);

// Add statsHistory to return
content = content.replace(
  'return { stats, servers, state, lastUpdated, refetch: fetchData };',
  'return { stats, statsHistory, servers, state, lastUpdated, refetch: fetchData };'
);

fs.writeFileSync('src/hooks/useDashboardData.ts', content);
console.log("Hook patched.");
