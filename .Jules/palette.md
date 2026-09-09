# Palette's UX Journal

## 2025-05-15 - Discoverable File Editor Keyboard Shortcuts
**Learning:** In headless or desktop-mode web admin portals (like Minecraft control panels), power users expect desktop-like interactions (such as `Ctrl+S` / `Cmd+S` for saving). Adding these makes the UI feel like a premium local application. By extending the visible `title` tooltip and screen-reader `aria-label` with the keyboard shortcut name, users organically discover these shortcuts during normal usage.
**Action:** Always add keyboard shortcut listeners for standard editor pages and document them directly in the hover/title labels to maximize discoverability.

## 2025-05-18 - Keyboard Focus Visibility for Hover-Revealed Interactive Elements
**Learning:** Action buttons that are hidden by default using `opacity-0 group-hover:opacity-100` remain invisible when focused via keyboard navigation unless `focus:opacity-100` is also included. Keyboard users who Tab into these elements cannot see what element currently has focus.
**Action:** Always combine `group-hover:opacity-100` with `focus:opacity-100` and `focus-visible:ring-2` on hidden hover controls to guarantee keyboard visibility.
