# Palette's UX Journal

## 2025-05-16 - Semantic Search Modal Trigger & Command Palette Roles
**Learning:** Command palette search bars in headers are often structured as clickable `<div>` elements wrapping read-only `<input>` elements for aesthetic reasons, rendering them completely invisible to keyboard focus (`Tab` key navigation) and screen reader element trees. Replacing the outer `<div>` with a `<button type="button">` using `aria-label`, `aria-expanded`, and `focus-visible:ring-2` allows keyboard users to focus and activate search without breaking visual design.
**Action:** When creating global search header triggers, always wrap the mock input in a semantic `<button type="button">` with focus-visible ring styles and listbox/option roles on search results.

## 2025-05-15 - Discoverable File Editor Keyboard Shortcuts
**Learning:** In headless or desktop-mode web admin portals (like Minecraft control panels), power users expect desktop-like interactions (such as `Ctrl+S` / `Cmd+S` for saving). Adding these makes the UI feel like a premium local application. By extending the visible `title` tooltip and screen-reader `aria-label` with the keyboard shortcut name, users organically discover these shortcuts during normal usage.
**Action:** Always add keyboard shortcut listeners for standard editor pages and document them directly in the hover/title labels to maximize discoverability.
