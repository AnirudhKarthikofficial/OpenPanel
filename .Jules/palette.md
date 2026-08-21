# Palette's UX Journal

## 2025-05-15 - Discoverable File Editor Keyboard Shortcuts
**Learning:** In headless or desktop-mode web admin portals (like Minecraft control panels), power users expect desktop-like interactions (such as `Ctrl+S` / `Cmd+S` for saving). Adding these makes the UI feel like a premium local application. By extending the visible `title` tooltip and screen-reader `aria-label` with the keyboard shortcut name, users organically discover these shortcuts during normal usage.
**Action:** Always add keyboard shortcut listeners for standard editor pages and document them directly in the hover/title labels to maximize discoverability.

## 2025-05-20 - Exposing Orphaned Console Log Controls
**Learning:** Dense system logs and terminal views in admin panels can easily overwhelm users if filtering and clipboard controls are hidden or missing. Exposing orphaned state (like severity filters with line counts, copy-to-clipboard, and clear buffer) in a compact, accessible toolbar directly below the header drastically improves log triage and screen-reader accessibility without taking away screen real estate.
**Action:** When working with streaming console or terminal components, check for orphaned log state and expose accessible filter pills with counts and single-click copy/clear action buttons.
