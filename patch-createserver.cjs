const fs = require('fs');
const path = 'src/pages/CreateServer.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'className="p-5 md:p-10 max-w-3xl mx-auto"',
  'className="w-full max-w-3xl mx-auto relative z-10"'
);

fs.writeFileSync(path, content);
console.log('Patched CreateServer.tsx');
