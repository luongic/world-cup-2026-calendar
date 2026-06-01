# ⚽ FIFA World Cup 2026 Schedule & Interactive Calendar Dashboard

> **🌐 Live Demo:** **[https://wc2026calendar.vercel.app/](https://wc2026calendar.vercel.app/)** 🚀

An interactive, responsive, and high-performance web dashboard displaying the complete **FIFA World Cup 2026 Schedule** (hosted across USA, Canada, and Mexico). The calendar highlights group stage fixtures, kickoff times converted dynamically to **your local timezone**, and utilizes custom-coded knockout stage sticker badges.

This project is built using **Vite**, **React 19**, **Tailwind CSS**, and **TypeScript**, delivering a premium dark-themed calendar UI optimized for both desktop and mobile viewing.

---

## 🌟 Key Features

* **Interactive Calendar Layout**: Displays June and July 2026 month grids highlighting match days.
* **Local Time Zone Conversion**: Kickoff times are dynamically parsed from Eastern Time (ET/EDT) and converted to **your browser's local timezone**, adjusting calendar day wraps automatically for late-night matches.
* **FlagCDN Integration**: Custom, crisp, border-framed country flags rendered dynamically instead of generic emojis, matching a physical premium poster aesthetic.
* **Knockout Stage Sticker Badges**: Color-coded, interactive badges (like *Round of 32*, *Round of 16*, *Quarter-finals*, *Semi-finals*, and *Final*) that group TBD fixtures with holographic hover shimmer animations.
* **Detailed Match Tooltips**: Hover over any match row to view the full fixture details, including exact team names, groups, local kickoff times, and host venues (e.g. Mexico City, Los Angeles, Toronto).
* **Fully Responsive Design**: Scalable calendar layout with responsive day headers (e.g., `MONDAY` on desktop, `MON` on mobile) preventing grid overflows.

---

## 🛠️ Technology Stack

* **Frontend Framework**: [React 19](https://react.dev/)
* **Build Tool**: [Vite 8](https://vite.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Asset Loading**: [FlagCDN](https://flagcdn.com/) for country flag images

---

## 🚀 Getting Started

Follow these steps to run the World Cup 2026 Calendar dashboard locally:

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/wc2026-calendar.git
   cd wc2026-calendar
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173/` (or the port specified in your console).

### Building for Production

To compile and optimize the app for production deployment:

```bash
npm run build
```

This will bundle assets into the `dist/` directory, ready to be hosted on Netlify, Vercel, GitHub Pages, or a custom web server.

---

## 📁 Project Structure

```text
wc2026-calendar/
├── src/
│   ├── components/
│   │   ├── CalendarDay.tsx      # Renders individual calendar day cells
│   │   ├── CalendarMonth.tsx    # Renders the full grid for a specific month
│   │   ├── MatchCard.tsx        # Row representation of individual fixtures
│   │   └── KnockoutBadge.tsx    # Sticker badges for TBD knockout phases
│   ├── data/
│   │   └── matches.json         # Match metadata, dates, times, and flag maps
│   ├── App.tsx                  # App entry point, contains local timezone conversion logic
│   ├── index.css                # Global styles, typography imports, theme colors
│   ├── types.ts                 # TypeScript type interfaces for Match data
│   └── main.tsx                 # React root injection mount
├── index.html                   # HTML template
├── package.json                 # Node package configuration and scripts
└── vite.config.ts               # Vite bundler configurations
```

---

## 📅 Timezone Details (Dynamic Local Time)

All matches in the original FIFA World Cup schedule are listed in **Eastern Time (ET/EDT)**. The application automatically detects your browser's local timezone and converts the kickoff times dynamically:
* **Timezone Offset Adjustment**: Standardizes Eastern Daylight Time (EDT, UTC-4) to UTC, and then converts it to your device's local timezone.
* **Midnight Date Roll-Over**: Automatically shifts matches to the next or previous day if the time zone conversion crosses midnight (e.g., late-night matches are correctly grouped under the correct local date).

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

*Disclaimer: This is a fan-made project and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with FIFA, the FIFA World Cup, or any of their subsidiaries or affiliates.*
