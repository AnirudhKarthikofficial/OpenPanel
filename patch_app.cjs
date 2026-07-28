const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'import Nodes from "./pages/Nodes";',
  'import Nodes from "./pages/Nodes";\nimport DeveloperPanel from "./pages/DeveloperPanel";'
);

code = code.replace(
  '<Route path="/nodes" element={<Nodes />} />',
  '<Route path="/nodes" element={<Nodes />} />\n            {import.meta.env.VITE_ENABLE_DEVELOPER_PANEL === "true" && (\n              <Route path="/developer" element={<DeveloperPanel />} />\n            )}'
);

fs.writeFileSync('src/App.tsx', code);
console.log('App patched.');
