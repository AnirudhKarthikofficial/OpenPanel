# Palette's UX Journal

## 2025-05-15 - Discoverable File Editor Keyboard Shortcuts
**Learning:** In headless or desktop-mode web admin portals (like Minecraft control panels), power users expect desktop-like interactions (such as `Ctrl+S` / `Cmd+S` for saving). Adding these makes the UI feel like a premium local application. By extending the visible `title` tooltip and screen-reader `aria-label` with the keyboard shortcut name, users organically discover these shortcuts during normal usage.
**Action:** Always add keyboard shortcut listeners for standard editor pages and document them directly in the hover/title labels to maximize discoverability.

## 2025-05-16 - Semantic Trigger Buttons and Focus States for Header Palettes
**Learning:** Decorative search bars or trigger elements containing non-interactive inputs (e.g., read-only command palette triggers) exclude keyboard and screen reader users when constructed as `div` elements. Converting the container to an explicit `<button>` with `focus-visible:ring-2` and setting `tabIndex={-1}` / `pointer-events-none` on nested presentation inputs makes the trigger fully keyboard-navigable and accessible without breaking click-through ergonomics.
**Action:** Always use semantic `<button>` wrappers for mock inputs or command palette triggers, and combine `group-hover` with `focus-visible` styles.
