const fs = require('fs');

let content = fs.readFileSync('src/server/services/docker.ts', 'utf-8');

content = content.replace('const mockState: Record<string, boolean> = {};', 'export const mockState: Record<string, boolean> = {};');

fs.writeFileSync('src/server/services/docker.ts', content);
console.log("mockState patched.");
