const fs = require('fs');
const path = 'src/pages/Dashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// Remove `<main ...>` and replace with `<div ...>` without the padding as Layout handles it.
content = content.replace(
  '<main className="relative z-10 mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-16">',
  '<div className="relative z-10 w-full">'
);
content = content.replace('</main>', '</div>');

content = content.replace('className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"', 'className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"');

fs.writeFileSync(path, content);
console.log('Updated Dashboard');
