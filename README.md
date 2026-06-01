# ⚽ FIFA World Cup 2026 Schedule & Interactive Calendar Dashboard

> **🌐 Live Demo:** **[https://wc2026calendar.vercel.app/](https://wc2026calendar.vercel.app/)** 🚀

An interactive, responsive, and high-performance web dashboard displaying the complete **FIFA World Cup 2026 Schedule** (hosted across USA, Canada, and Mexico). The calendar highlights group stage fixtures, kickoff times converted to **Vietnam Time (GMT+7)**, and utilizes custom-coded knockout stage sticker badges.

This project is built using **Vite**, **React 19**, **Tailwind CSS**, and **TypeScript**, delivering a premium dark-themed calendar UI optimized for both desktop and mobile viewing.

---

## 🌟 Key Features

* **Interactive Calendar Layout**: Displays June and July 2026 month grids highlighting match days.
* **Vietnam Time Zone Conversion**: Kickoff times are dynamically parsed from Eastern Time (ET/EDT) and converted to **Vietnam Time (GMT+7 / ICT)**, adjusting calendar day wraps automatically for late-night matches.
* **FlagCDN Integration**: Custom, crisp, border-framed country flags rendered dynamically instead of generic emojis, matching a physical premium poster aesthetic.
* **Knockout Stage Sticker Badges**: Color-coded, interactive badges (like *Round of 32*, *Round of 16*, *Quarter-finals*, *Semi-finals*, and *Final*) that group TBD fixtures with holographic hover shimmer animations.
* **Detailed Match Tooltips**: Hover over any match row to view the full fixture details, including exact team names, groups, GMT+7 kickoff times, and host venues (e.g. Mexico City, Los Angeles, Toronto).
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
│   ├── App.tsx                  # App entry point, contains GMT+7 conversion logic
│   ├── index.css                # Global styles, typography imports, theme colors
│   ├── types.ts                 # TypeScript type interfaces for Match data
│   └── main.tsx                 # React root injection mount
├── index.html                   # HTML template
├── package.json                 # Node package configuration and scripts
└── vite.config.ts               # Vite bundler configurations
```

---

## 📅 Timezone Details (Vietnam GMT+7)

All matches in the original FIFA World Cup schedule are listed in **Eastern Time (ET/EDT)**. The application automatically calculates and shifts dates using the client-side conversion logic:
* **Daylight Saving Adjustment**: Converts EDT (UTC-4) to UTC, then translates to Indochina Time (ICT, UTC+7 / GMT+7).
* **Midnight Date Roll-Over**: Automatically moves a match to the next day when adding the 11-hour timezone offset causes the time to cross past `00:00` midnight (e.g. a match on June 11 at 21:00 ET rolls over to June 12 at 08:00 GMT+7).

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

*Disclaimer: This is a fan-made project and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with FIFA, the FIFA World Cup, or any of their subsidiaries or affiliates.*
