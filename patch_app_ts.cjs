const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target = '{import.meta.env.VITE_ENABLE_DEVELOPER_PANEL === "true" && (';
const replacement = '            {/* @ts-ignore */}\n            {import.meta.env.VITE_ENABLE_DEVELOPER_PANEL === "true" && (';
code = code.replace(target, replacement);

fs.writeFileSync('src/App.tsx', code);
console.log('App patched for ts-ignore.');
