const fs = require('fs');
const path = 'src/pages/ApiKeysPage.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full"',
  'className="w-full relative z-10"'
);
content = content.replace(
  '<div className="flex-1 p-6 md:p-8 flex items-center justify-center text-muted-foreground">',
  '<div className="w-full flex items-center justify-center text-muted-foreground">'
);
fs.writeFileSync(path, content);
console.log('Patched ApiKeysPage.tsx');
