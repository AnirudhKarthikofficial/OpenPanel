const fs = require('fs');
const path = 'src/pages/AdminServers.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '<div className="p-5 md:p-10 max-w-7xl mx-auto text-foreground">',
  '<div className="w-full relative z-10 text-foreground">'
);

fs.writeFileSync(path, content);
console.log('Updated AdminServers spacing 2');
