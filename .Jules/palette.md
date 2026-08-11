# Palette's UX Journal

## 2025-05-15 - Discoverable File Editor Keyboard Shortcuts
**Learning:** In headless or desktop-mode web admin portals (like Minecraft control panels), power users expect desktop-like interactions (such as `Ctrl+S` / `Cmd+S` for saving). Adding these makes the UI feel like a premium local application. By extending the visible `title` tooltip and screen-reader `aria-label` with the keyboard shortcut name, users organically discover these shortcuts during normal usage.
**Action:** Always add keyboard shortcut listeners for standard editor pages and document them directly in the hover/title labels to maximize discoverability.

## 2025-05-16 - Accessible Custom Boolean Switch Controls
**Learning:** This application implements custom interactive elements using basic `<button>` structures with visual transitions rather than native checkboxes. Screen readers do not announce these switches properly without semantic attributes. By adding standard ARIA attributes (`role="switch"`, `aria-checked`, and `aria-label`), custom toggle buttons are recognized as stateful switch inputs by assistive technologies.
**Action:** Always decorate custom checkbox/switch button controls with standard ARIA roles and state attributes to preserve accessibility.
