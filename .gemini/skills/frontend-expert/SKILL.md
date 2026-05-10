---
name: frontend-expert
description: Next.js architecture, Tailwind CSS V4+ design system, responsive layout, and data visualization (Recharts). Use when building UI components or the frontend app.
---

# Frontend Expert

Expert procedural guidance for Next.js development and UI/UX design within the Vault Pro ecosystem.

## 1. UI/UX Design System (Tailwind CSS V4+)
- **Color Palette:**
    - **Background:** `bg-slate-950` (Main), `bg-slate-900` (Cards/Modals).
    - **Accents:** `text-emerald-500` (Income/Profit), `text-rose-500` (Expense/Loss), `text-sky-500` (Transfers).
    - **Border:** `border-slate-800`.
- **Typography:** Sans-serif (Inter/Geist), monospaced for numeric values to ensure alignment.

## 2. Components & Layout
- **Responsiveness:** Mobile-first approach for quick transaction entry.
- **Dashboard:** Sidebar-based navigation with top header for user profile/notifications.

## 3. Data Visualization
- **Charts:** Use `Recharts` with custom tooltips matching the Slate theme.
- **Chart Types:** Area charts for balance trends; Pie charts for Jar distribution.
