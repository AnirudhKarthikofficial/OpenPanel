const fs = require('fs');

const path = 'src/pages/Dashboard.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  "{ id: 'nodes', label: 'Active Containers', value: \\`\\${stats?.activeContainers || 0} / \\${stats?.totalContainers || 0}\\`, data: generateSparkline(10, 90, 100), color: '#f59e0b' }",
  "{ id: 'nodes', label: 'Disk Usage', value: \\`\\${stats?.diskUsage || 0}%\\`, data: generateSparkline(10, 90, 100), color: '#f59e0b' }"
);

fs.writeFileSync(path, code);
console.log('Patched dashboard box');
