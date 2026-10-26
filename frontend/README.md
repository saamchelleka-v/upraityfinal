# 🏛️ Upraity And Son — Frontend Application

Next.js 16 (App Router + Turbopack) web application for **Upraity And Son**, heritage monumental stonemasons (Est. 1909).

## 🚀 Key Features

- **Editorial Home Showcase (`/`)**: Asymmetric 2-column layout with fixed brand positioning, reactive filter pills (*Works, Gallery, Thoughts, Experiments*), and photographic cards.
- **Dedicated 101-Photograph Gallery (`/gallery`)**: Full visual archive featuring real cemetery memorials, live keyword search, category filter pills with live counters, and high-resolution lightbox inspection.
- **Admin CMS & CRM Portal (`/admin`)**:
  - **Inquiry Pipeline**: Track quotes through status stages (`new`, `contacted`, `site_visit`, `quoted`, `in_progress`, `completed`).
  - **Portfolio Manager**: Add, edit, or toggle publication state of grave structures and monuments.
  - **Directory**: Manage stone quarries, church faculty officials, and cemetery superintendents.
- **Adaptive Light & Dark Mode**:
  - Pure CSS tokens in `:root` and `.dark` (`--background`, `--foreground`, `--stone-gold`, `--card-bg`).
  - `.font-elegant-shimmer` metallic gradient adapting to light bronze-gold and dark ivory-gold.
  - Pre-hydration script eliminating theme flash.
- **Story & Information Routes**:
  - `/about`: Philosophy of stonemasonry, quarry standards, and mission statement.
  - `/history`: 4-generation lineage timeline (1909 to present day).
  - `/contact`: Interactive consultation scheduler and quotation request.
  - `/terms`: BRAMM / NAMM cemetery alignment and craftsmanship warranty.
  - `/privacy`: GDPR-aligned client confidentiality policy.

## 💻 Tech Stack
- **Framework**: Next.js 16.4.2 (Turbopack)
- **UI Library**: React 19.3.0
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"`, `@variant dark`)
- **Icons**: Lucide React
- **Typography**: Optima (Body & Headings) + Harietta Bulmer (Brand Titles)

## 🏃‍♂️ Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run typecheck and production build
npm run build

# Start production server
npm start
```
Frontend runs on **http://localhost:3000** and connects to the backend API at **http://localhost:5000/api**.
