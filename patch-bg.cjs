const fs = require('fs');

const layoutPath = 'src/components/Layout.tsx';
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
layoutContent = layoutContent.replace(/w-full bg-background/g, 'w-full bg-transparent');
layoutContent = layoutContent.replace(/relative bg-background/g, 'relative bg-transparent');
layoutContent = layoutContent.replace(/bg-card border-b/g, 'bg-card/80 backdrop-blur-xl border-b');
fs.writeFileSync(layoutPath, layoutContent);

const sidebarPath = 'src/components/Sidebar.tsx';
let sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
sidebarContent = sidebarContent.replace(/flex-col bg-card border-r/g, 'flex-col bg-card/80 backdrop-blur-xl border-r');
fs.writeFileSync(sidebarPath, sidebarContent);

console.log("Patched background and layout");
