# Palette's UX Journal

## 2025-05-15 - Discoverable File Editor Keyboard Shortcuts
**Learning:** In headless or desktop-mode web admin portals (like Minecraft control panels), power users expect desktop-like interactions (such as `Ctrl+S` / `Cmd+S` for saving). Adding these makes the UI feel like a premium local application. By extending the visible `title` tooltip and screen-reader `aria-label` with the keyboard shortcut name, users organically discover these shortcuts during normal usage.
**Action:** Always add keyboard shortcut listeners for standard editor pages and document them directly in the hover/title labels to maximize discoverability.

## 2025-05-15 - Inline Confirmation States vs Browser Modals
**Learning:** Using browser native `confirm()` blocking dialogues halts the main thread and feels jarring for modern web control panels. Replacing them with localized inline states (e.g., `deletingUserId`) inside table rows keeps the user in the context of their action, matching the patterns of editing fields. Furthermore, extending these inline interactive states with accessible ARIA labels (e.g., `aria-label="Confirm deletion of user..."`) and focus indicators (`focus-visible:ring-2`) dramatically improves both UX delight and screen-reader compliance.
**Action:** Always prefer context-aware inline confirmation workflows over native window popup utilities for tables and grids, ensuring precise key navigation and descriptive ARIA descriptions.
