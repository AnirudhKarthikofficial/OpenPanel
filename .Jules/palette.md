# Palette's UX Journal

## 2025-05-15 - Discoverable File Editor Keyboard Shortcuts
**Learning:** In headless or desktop-mode web admin portals (like Minecraft control panels), power users expect desktop-like interactions (such as `Ctrl+S` / `Cmd+S` for saving). Adding these makes the UI feel like a premium local application. By extending the visible `title` tooltip and screen-reader `aria-label` with the keyboard shortcut name, users organically discover these shortcuts during normal usage.
**Action:** Always add keyboard shortcut listeners for standard editor pages and document them directly in the hover/title labels to maximize discoverability.

## 2025-05-16 - Visible Focus States for Hover-Triggered Action Buttons
**Learning:** Interactive icon buttons inside list items that rely solely on `group-hover:opacity-100` remain invisible to keyboard users Tabbing through elements. Adding `focus:opacity-100` alongside `group-hover:opacity-100` ensures that keyboard focus reveals the control cleanly.
**Action:** Whenever using `group-hover:opacity-100` on interactive sub-elements, always append `focus:opacity-100` and provide a descriptive `aria-label`.
