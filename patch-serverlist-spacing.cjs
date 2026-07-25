const fs = require('fs');
const path = 'src/pages/ServerList.tsx';
let content = fs.readFileSync(path, 'utf8');

// ServerList is huge. Let's see if it has a `<main>` container with max-w-7xl
content = content.replace(
  '<main className="relative z-10 mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-16">',
  '<div className="relative z-10 w-full">'
);
content = content.replace('</main>', '</div>');

fs.writeFileSync(path, content);
console.log('Updated ServerList spacing');
