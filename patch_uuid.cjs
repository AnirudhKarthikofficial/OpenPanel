const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'src/server/controllers/servers.ts');
let code = fs.readFileSync(p, 'utf8');

code = code.replace('import { v4 as uuidv4 } from "uuid";', 'import crypto from "crypto";');
code = code.replace('const id = uuidv4();', 'const id = crypto.randomUUID();');

fs.writeFileSync(p, code);
console.log("Replaced uuid with crypto");
