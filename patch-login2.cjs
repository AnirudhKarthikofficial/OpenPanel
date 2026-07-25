const fs = require('fs');
const path = 'src/pages/Login.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '<div className="font-bold text-2xl text-foreground mb-1"><50ms</div>',
  '<div className="font-bold text-2xl text-foreground mb-1">&lt;50ms</div>'
);

fs.writeFileSync(path, content);
console.log('Patched Login.tsx syntax');
