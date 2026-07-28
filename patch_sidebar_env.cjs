const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
code = code.replace(
  '  // @ts-ignore\\n  if (import.meta.env.VITE_ENABLE_DEVELOPER_PANEL === "true") {',
  '  if ((import.meta as any).env.VITE_ENABLE_DEVELOPER_PANEL === "true") {'
);
code = code.replace(
  '  if (import.meta.env.VITE_ENABLE_DEVELOPER_PANEL === "true") {',
  '  if ((import.meta as any).env.VITE_ENABLE_DEVELOPER_PANEL === "true") {'
);
fs.writeFileSync('src/components/Sidebar.tsx', code);

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace(
  '{/* @ts-ignore */}\\n            {import.meta.env.VITE_ENABLE_DEVELOPER_PANEL === "true" && (',
  '            {(import.meta as any).env.VITE_ENABLE_DEVELOPER_PANEL === "true" && ('
);
appCode = appCode.replace(
  '{import.meta.env.VITE_ENABLE_DEVELOPER_PANEL === "true" && (',
  '{(import.meta as any).env.VITE_ENABLE_DEVELOPER_PANEL === "true" && ('
);
fs.writeFileSync('src/App.tsx', appCode);
console.log('Patched with import.meta as any');
