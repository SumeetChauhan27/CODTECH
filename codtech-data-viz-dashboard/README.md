# 📊 Analytics Pro - Data Visualization Dashboard

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

A highly interactive, fully responsive **Data Visualization Dashboard** built with modern React.js, Tailwind CSS, Recharts, and Nivo. This project serves as a comprehensive analytics interface with global theming, dark mode, customizable settings, and deeply interactive charts.

---

## 👨‍💻 Intern Information
- **Intern ID:** CITS3982
- **Name:** Sumeet Kailash Chauhan
- **Internship Domain:** React.js Web Development
- **Organisation:** CODTECH IT Solutions Pvt. Ltd.
- **Duration:** 6 Weeks (06 June 2026 – 18 July 2026)

---

## ✨ Key Features

### 🎨 Global Theming & Customization
- **Dark/Light Mode:** Full system-aware and toggleable Dark Theme that instantly recolors all UI elements and charts.
- **Dynamic Accent Colors:** Choose between Blue, Purple, Green, or Rose global accent colors that immediately update chart strokes, buttons, and hover states.
- **Sidebar & Table Preferences:** Toggle compact sidebar mode, adjust table rows per page, and toggle chart animations globally via a dedicated Settings page. Settings persist via `localStorage`.

### 📈 Interactive Charts (Dashboard & Analytics)
- **Revenue Bar Chart:** Toggle between 2024 and 2023 financial data.
- **User Growth Line Chart:** Dynamically toggle "New Users" and "Returning Users" visibility.
- **Sales by Category:** A Nivo pie chart with a real-time toggle to switch between Pie and Donut visualizations.
- **Weekly Orders Area Chart:** Track completed vs cancelled orders with a toggle to view data as Stacked or Overlap.
- **Product Performance:** Recharts horizontal bar chart with sorting toggles (High → Low vs Low → High).
- **Device Sessions:** Nivo Bar chart tracking cross-platform usage with a Grouped vs Stacked layout toggle.
- **Mini Sparklines:** KPI cards feature embedded Recharts Area charts indicating positive/negative trend directions.

### 📋 Powerful Data Tables
- **Advanced Reports:** 30+ mock transaction records with pagination.
- **Live Search & Filter:** Instantly search by Product/Order ID and filter by Department Category.
- **Sorting:** Multi-column ascending/descending sorting.
- **Export capabilities:** Click to instantly export the *currently filtered* dataset as a CSV file.
- **Summary Chips:** Dynamic footer chips that recalculate totals based on your active filters.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19, Vite |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS v4, PostCSS |
| **Charts** | Recharts, `@nivo/pie`, `@nivo/bar` |
| **Icons** | Lucide React |
| **State Management** | React Context API, `useState`, `useMemo` |
| **Storage** | `localStorage` |
| **Notifications** | React Hot Toast |

---

## 📂 Folder Structure

```text
codtech-data-viz-dashboard/
├── src/
│   ├── components/       # Reusable UI elements
│   │   ├── ChartWrapper.jsx  # Card wrapper for charts with action slots
│   │   ├── DataTable.jsx     # Highly interactive sorting/filtering table
│   │   ├── Header.jsx        # Top navigation & global search
│   │   ├── Sidebar.jsx       # Collapsible side navigation
│   │   └── StatCard.jsx      # KPI cards with Recharts sparklines
│   ├── context/
│   │   └── SettingsContext.jsx # Global state for themes, accents, and prefs
│   ├── data/
│   │   ├── mockData.js       # Chart configurations and data arrays
│   │   └── transactions.js   # 30+ record dataset for the data table
│   ├── pages/
│   │   ├── Analytics.jsx     # Deep-dive interactive charts
│   │   ├── Dashboard.jsx     # Overview KPIs and high-level charts
│   │   ├── Reports.jsx       # Full-page data table with filters
│   │   └── Settings.jsx      # User preference controls
│   ├── App.jsx           # Router configuration
│   ├── Layout.jsx        # Main structural layout component
│   ├── index.css         # Global Tailwind directives and CSS variables
│   └── main.jsx          # Application entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SumeetChauhan27/codtech-data-viz-dashboard.git
   cd codtech-data-viz-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173`

---

## 📸 Screenshots

*(Add your high-resolution screenshots here once deployed!)*

- **Dashboard View:** Shows KPI cards with sparklines and toggleable charts.
- **Analytics View:** Shows Nivo/Recharts integration with dynamic Stacked/Overlap modes.
- **Reports Table:** Shows filtering, sorting, and pagination.
- **Settings View:** Shows global accent and theme customization.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).

---
**Crafted with ❤️ by Sumeet Chauhan for CODTECH IT Solutions.**
