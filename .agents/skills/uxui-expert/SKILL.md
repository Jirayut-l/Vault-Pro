---
name: uxui-expert
description: Vault Pro design system, Tailwind CSS V4 styling, color palettes, and data visualization aesthetics. Use when designing user interfaces, styling components, or ensuring visual consistency.
---

# UX/UI Expert (Design & Styling)

Expert guidance on the visual language and user experience of Vault Pro.

## 1. Design System (Tailwind CSS V4+)
- **Theme:** Dark-mode first, Slate-based palette.
- **Colors:**
    - **Background:** `bg-slate-950` (Main), `bg-slate-900` (Cards/Modals).
    - **Accents:** `text-emerald-500` (Income/Profit), `text-rose-500` (Expense/Loss), `text-sky-500` (Transfers).
    - **Borders:** `border-slate-800`.
- **Typography:** `Inter` or `Geist` sans-serif. Use monospaced fonts for numeric values in tables/dashboards.

## 2. Layout & Responsiveness
- **Principles:** Mobile-first design for quick entries.
- **Navigation:** Sidebar-based for desktop, bottom-nav or drawer for mobile.
- **Feedback:** Use subtle animations (Framer Motion) for transitions and interactive states.

## 3. Data Visualization Styling
- **Aesthetics:** `Recharts` with Slate-themed tooltips and grids.
- **Gradients:** Use subtle gradients for area charts to enhance depth without clutter.

## 4. Accessibility (A11y)
- **Standards:** Ensure WCAG AA compliance. Use Radix UI primitives for accessible components (Modals, Dropdowns).
