const fs = require('fs');
const path = 'src/pages/AdminServers.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '<div className="max-w-7xl mx-auto px-5 md:px-10 py-10 md:py-16 relative z-10">',
  '<div className="w-full relative z-10">'
);
content = content.replace('className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"', 'className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6"');

fs.writeFileSync(path, content);
console.log('Updated AdminServers spacing');
