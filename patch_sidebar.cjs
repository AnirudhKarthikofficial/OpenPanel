const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

const target = '  if (import.meta.env.VITE_ENABLE_DEVELOPER_PANEL === "true") {';
const replacement = '  // @ts-ignore\n  if (import.meta.env.VITE_ENABLE_DEVELOPER_PANEL === "true") {';
code = code.replace(target, replacement);

fs.writeFileSync('src/components/Sidebar.tsx', code);
console.log('Sidebar patched for ts-ignore.');
