# Palette's UX Journal

## 2025-05-15 - Discoverable File Editor Keyboard Shortcuts
**Learning:** In headless or desktop-mode web admin portals (like Minecraft control panels), power users expect desktop-like interactions (such as `Ctrl+S` / `Cmd+S` for saving). Adding these makes the UI feel like a premium local application. By extending the visible `title` tooltip and screen-reader `aria-label` with the keyboard shortcut name, users organically discover these shortcuts during normal usage.
**Action:** Always add keyboard shortcut listeners for standard editor pages and document them directly in the hover/title labels to maximize discoverability.

## 2025-05-20 - Smooth, Non-Blocking Feedback for Server Configuration Save Actions
**Learning:** In administrator dashboard settings interfaces, replacing archaic browser-blocking `alert()` dialogs with custom, non-blocking floating toast notifications dramatically improves interface fluidity and professional feel. Proper inclusion of accessibility features like `role="status"` and `aria-live="polite"`, alongside clear manual close controls, ensures both high screen-reader compatibility and great visual UX.
**Action:** Replace `alert()` messages with localized or global responsive toast elements with dynamic transition animations.
