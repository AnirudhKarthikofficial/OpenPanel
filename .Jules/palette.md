# Palette's UX Journal

## 2025-05-15 - Discoverable File Editor Keyboard Shortcuts
**Learning:** In headless or desktop-mode web admin portals (like Minecraft control panels), power users expect desktop-like interactions (such as `Ctrl+S` / `Cmd+S` for saving). Adding these makes the UI feel like a premium local application. By extending the visible `title` tooltip and screen-reader `aria-label` with the keyboard shortcut name, users organically discover these shortcuts during normal usage.
**Action:** Always add keyboard shortcut listeners for standard editor pages and document them directly in the hover/title labels to maximize discoverability.

## 2025-05-16 - Accessible Dropdown Item Actions & Keyboard Navigation
**Learning:** Interactive items within dropdown overlay menus (such as notifications) often rely solely on mouse `onClick` events and hover CSS (`group-hover:opacity-100`). This leaves keyboard and screen reader users unable to focus, trigger actions, or dismiss items. Adding explicit `role="button"`, `tabIndex={0}`, `onKeyDown` handlers (for Enter/Space), `focus-visible` outline rings, and `focus-visible:opacity-100` on hidden sub-actions restores full keyboard parity.
**Action:** Always ensure interactive list rows in dropdown menus have explicit tabIndex, keyboard trigger listeners, and make hover-only action buttons visible on `:focus-visible`.
