# Palette's Journal - OpenPanel UX & Accessibility

This journal records critical UX/accessibility learnings during our development journey.

## 2025-02-23 - Micro-interactions & Accessible Icon Buttons
**Learning:** Screen readers and keyboard users rely on explicit semantic attributes like `aria-label` and `title` to understand icon-only buttons. Interactive controls (such as toggling sidebars, layout grids, or clearing inputs) should not be purely visual.
**Action:** Always provide explicit, descriptive `aria-label` and matching `title` attributes on all icon-only button elements.
