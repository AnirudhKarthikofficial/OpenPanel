const fs = require('fs');
const path = 'src/pages/SettingsPage.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '<div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">',
  '<div className="w-full relative z-10">'
);
content = content.replace(
  '<h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight text-foreground drop-shadow-sm flex items-center">',
  '<h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight text-foreground drop-shadow-sm flex items-center">'
);

fs.writeFileSync(path, content);
console.log('Updated SettingsPage spacing');
