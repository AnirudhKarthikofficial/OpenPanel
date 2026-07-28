const fs = require('fs');

const path = 'src/server/routes/system.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  'diskSpace = parts[4];',
  'diskSpace = parseInt(parts[4].replace("%", "")) || 0;'
);
code = code.replace(
  'let diskSpace = "0%";',
  'let diskSpace = 0;'
);

fs.writeFileSync(path, code);
console.log("Fixed diskSpace type");
