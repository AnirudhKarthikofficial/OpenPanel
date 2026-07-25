const fs = require('fs');
const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('import Register from "./pages/Register";')) {
  content = content.replace('import Login from "./pages/Login";', 'import Login from "./pages/Login";\nimport Register from "./pages/Register";');
}

if (!content.includes('<Route path="/register" element={<Register />} />')) {
  content = content.replace('<Route path="/login" element={<Login />} />', '<Route path="/login" element={<Login />} />\n          <Route path="/register" element={<Register />} />');
}

fs.writeFileSync(path, content);
console.log('Patched App.tsx');
