# Palette's UX Journal

## 2025-05-15 - Discoverable File Editor Keyboard Shortcuts
**Learning:** In headless or desktop-mode web admin portals (like Minecraft control panels), power users expect desktop-like interactions (such as `Ctrl+S` / `Cmd+S` for saving). Adding these makes the UI feel like a premium local application. By extending the visible `title` tooltip and screen-reader `aria-label` with the keyboard shortcut name, users organically discover these shortcuts during normal usage.
**Action:** Always add keyboard shortcut listeners for standard editor pages and document them directly in the hover/title labels to maximize discoverability.

## 2025-05-16 - Accessible Custom Dropdown Cards & List Items
**Learning:** Interactive list items in custom dropdown overlays (such as notifications or search items) built with `div` elements are invisible to screen readers and inaccessible via keyboard unless explicitly enhanced. Combining `role="button"`, `tabIndex={0}`, keyboard event handlers (`Enter`/`Space`), `focus-visible:ring-2` focus indicators, and dynamic `aria-label` summary attributes makes custom overlay components fully accessible without changing visual layout or design tokens.
**Action:** Always audit interactive non-button cards in dropdown overlays to ensure proper keyboard navigation semantics, focus styles, and ARIA labels are present.
