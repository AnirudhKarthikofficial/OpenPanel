const fs = require('fs');
let content = fs.readFileSync('install.sh', 'utf-8');

// Revert back to 5 options in menu
content = content.replace(
  'echo -e "  ${BOLD}5)${NC} Developer Panel Setup (Port 3000 & Podman - dev.jtg)"\n    echo -e "  ${BOLD}6)${NC} Exit"\n    echo -e "\\n========================================================"\n    read -p " Choose an option (1-6): " CHOICE',
  'echo -e "  ${BOLD}5)${NC} Exit"\n    echo -e "\\n========================================================"\n    read -p " Choose an option (1-5): " CHOICE'
);

// Remove the case block for 5 and change 6 back to 5
content = content.replace(
  '        5)\n            setup_dev_panel\n            read -p "Press Enter to return to main menu..."\n            ;;\n        6)\n            echo -e "\\n${YELLOW}Exiting script... Goodbye!${NC}\\n"\n            exit 0\n            ;;\n        *)\n            log_error "Invalid option! Please enter 1, 2, 3, 4, 5, or 6."',
  '        5)\n            echo -e "\\n${YELLOW}Exiting script... Goodbye!${NC}\\n"\n            exit 0\n            ;;\n        *)\n            log_error "Invalid option! Please enter 1, 2, 3, 4, or 5."'
);

// We can leave `setup_dev_panel()` function defined just in case, but let's remove it entirely.
const startIdx = content.indexOf('setup_dev_panel() {');
if (startIdx !== -1) {
    const endStr = '\\n}\\n\\n# Main menu loop';
    const endIdx = content.indexOf(endStr, startIdx);
    if (endIdx !== -1) {
        content = content.slice(0, startIdx) + '# Main menu loop' + content.slice(endIdx + endStr.length - 16); // -16 is length of '# Main menu loop'
    }
}

fs.writeFileSync('install.sh', content);
console.log("install.sh patched.");
