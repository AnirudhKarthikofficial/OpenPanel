const fs = require('fs');
const path = 'src/pages/SettingsPage.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'className="p-5 md:p-10 max-w-7xl mx-auto"',
  'className="w-full relative z-10"'
);

fs.writeFileSync(path, content);
console.log('Updated SettingsPage spacing 2');
