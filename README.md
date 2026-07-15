# 📋 TaskFlow — Premium SaaS-Style Task Management Client

TaskFlow is a modern, responsive, and elegant SaaS-style task management web application frontend. Built with **pure semantic HTML5, CSS3 Custom Properties (Variables), and Vanilla ES6+ JavaScript**, it delivers a polished user experience without relying on external UI frameworks (no React, Vue, Tailwind CSS, or Bootstrap in the client-side code).

This workspace has been polished with the **Sleek Interface** design theme, featuring elegant **Plus Jakarta Sans** and **Inter** typography, custom dark/light theme persistence, soft fluid transitions, micro-interactions, and a native-feeling stackable toast notification system.

---

## ✨ Features

- **💼 Sleek SaaS UI/UX**: Designed with a clean, high-contrast, premium aesthetic, including interactive cards, micro-elevations on hover, custom-styled checkbox animations, and modern typography.
- **🌓 Adaptive Dark & Light Modes**: Seamless dark and light mode rendering featuring standard CSS Variables with browser cache and system-preference persistence (`localStorage`).
- **📱 Fluid Multi-Device Responsiveness**: 
  - Desktop double-column dashboard with static task creation panel and scrollable cards list.
  - Collapsible sidebar with quick-access category filters (Today, Important, Completed, Pending).
  - Responsive tablet and mobile overlays that convert the static form into a beautiful sliding modal triggerable by a Floating Action Button (FAB).
- **🛠️ Rich Task Operations (Vanilla JS)**:
  - **Create & Update**: Inline-validated task creation with character counter indicators (50 chars max for Title, 200 chars for Description).
  - **Edit & Delete**: Seamless dynamic card reloading for edit-states and secure confirmation modal overlays before absolute card removal.
  - **Priority Indicators**: High, Medium, and Low urgencies featuring subtle pastel colored labels and highlighted card left-borders.
  - **Category Badging**: Assign tasks to *Work*, *Personal*, *Shopping*, or *Health* and filter dynamically.
- **🔍 Active Filter & Search Engine**: Instantly search by title/description, filter by categories, and sort by due dates, priority weight, or alphabetical order.
- **✨ Pure CSS/HTML Empty State**: Beautifully designed minimalist glassmorphic planner board illustration created entirely out of native CSS and HTML (no external images or heavy assets).
- **🔔 Stackable Toast Notification System**: High-priority real-time toast banners that stack nicely at the bottom right corner of the screen to notify user on status transitions (Task Added, Task Deleted, Task Completed, etc.).
- **📊 Real-time Focus & Progress Stats**: Visual progression bar showing completed vs active tasks along with quick-count counters for active/overdue tasks.

---

## 📂 Project Structure

```bash
TaskFlow/
│
├── index.html       # Primary semantic layout & modal overlays
├── style.css        # Pure CSS3 Custom Properties, Custom Scrollbars & Animations
├── script.js        # Core DOM Manipulation, Event Dispatchers, and State Engine
├── metadata.json    # Application configurations & capabilities
├── package.json     # Node dev environment scripts
└── .env.example     # Workspace environment configurations
```

---

## 🚀 Getting Started

### Prerequisites

You only need a modern web browser to run the application, as it is a client-side frontend package. For local developer server setups, you can run a local HTTP server.

### Quick Local Dev Execution

1. Clone or download the repository files.
2. In the project root, start a simple HTTP server:
   ```bash
   # Using Python 3
   python3 -m http.server 3000

   # Or using Node.js (npx)
   npx serve -p 3000
   ```
3. Open `http://localhost:3000` in your web browser.

---

## 🎨 Styling Specifications

The application's **Sleek Interface** aesthetic is guided by structural design tokens declared in `style.css`:

- **Display Headings**: `Plus Jakarta Sans`
- **Body & Controls**: `Inter`
- **Indigo Accent Palette**:
  - Accent Color: `#4f46e5`
  - Accent Light: `rgba(79, 70, 229, 0.07)`
  - Accent Glow: `rgba(79, 70, 229, 0.2)`
- **Standard Corners (Micro-radius style)**: `5px`, `8px`, `10px`, `14px`
- **Theme Color Schemes**:
  - Light Theme Base: Soft Slate (`#f8fafc`) background and crisp white cards.
  - Dark Theme Base: Steel Slate (`#090d16`) backdrop with deep slate (`#111827`) cards and `#1f2937` borders.

---

## ♿ Accessibility (A11y)

- Used semantic HTML5 section elements (`<aside>`, `<main>`, `<nav>`, `<header>`, `<section>`).
- Included `sr-only` labels where visual labels are omitted.
- Fully accessible modal focus control and native-select configurations for keyboard inputs compatibility.
- Contrast ratio checked to meet WCAG AA standards.
