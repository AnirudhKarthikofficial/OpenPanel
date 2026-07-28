const fs = require('fs');

let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');

// Replace useDashboardData usage
content = content.replace(
  'const { stats, servers, state, refetch } = useDashboardData();',
  'const { stats, statsHistory, servers, state, refetch } = useDashboardData();'
);

// We need to replace generateSparkline calls inside the STATS array with real historical data.
content = content.replace(
  /const STATS = useMemo\(\(\) => \[[\s\S]*?\], \[stats, realServers\]\);/,
  `const STATS = useMemo(() => {
    const defaultData = Array(20).fill(0);
    const cpuData = statsHistory?.length ? statsHistory.map(s => s.cpuUsage || 0) : defaultData;
    const ramData = statsHistory?.length ? statsHistory.map(s => s.ramUsage || 0) : defaultData;
    const containersData = statsHistory?.length ? statsHistory.map(s => s.activeContainers || 0) : defaultData;
    
    // pad with 0s if length is less than 2
    while (cpuData.length < 2) cpuData.unshift(0);
    while (ramData.length < 2) ramData.unshift(0);
    while (containersData.length < 2) containersData.unshift(0);

    return [
      { id: 'cpu', label: 'Cluster CPU', value: \`\${(stats?.cpuUsage || 0).toFixed(1)}%\`, data: cpuData, color: '#8b5cf6' },
      { id: 'ram', label: 'Memory Usage', value: \`\${(stats?.ramUsage || 0).toFixed(1)}%\`, data: ramData, color: '#06b6d4' },
      { id: 'net', label: 'Servers Online', value: \`\${realServers.filter(s => s.status === 'online').length} / \${realServers.length}\`, data: defaultData, color: '#10b981' },
      { id: 'nodes', label: 'Active Containers', value: \`\${stats?.activeContainers || 0} / \${stats?.totalContainers || 0}\`, data: containersData, color: '#f59e0b' }
    ];
  }, [stats, statsHistory, realServers]);`
);

fs.writeFileSync('src/pages/Dashboard.tsx', content);
console.log("Dashboard.tsx patched.");
