# 🏛️ Upraity And Son — Monumental Stonemasons & Memorial Architects

> **A 4th-Generation Heritage Stonemasonry Showcase, Visual Archive, CMS & CRM Web Application (Est. 1909)**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_4.21-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8.9-darkgreen?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

---

## 📖 Executive Summary

**Upraity And Son** is a bespoke full-stack web application developed for master monumental stonemasons. Built with inspiration from high-end minimalist, content-first editorial designs (such as `dzrgo.com`), the application combines:

1. **A Grand Architectural Showcase**: Curated grave structures, Carrara marble monuments, hand-chiseled 23k gold letterforms, and restoration studies.
2. **A 101-Photograph Visual Archive (`/gallery`)**: High-resolution gallery documenting real family grave enclosures, monolithic black granite kerbs, crosses, and plaques with instant keyword search and category filtering.
3. **Adaptive Dual-Theme System (Light & Dark)**: Bespoke alabaster stone (`#FBFBFB`) and polished granite slate (`#09090b`) color palettes with dynamic metallic typography shimmer.
4. **Admin CMS & Client CRM Dashboard (`/admin`)**: Real-time management of portfolio entries, supplier/quarry directory, and inquiry leads pipeline.
5. **Zero-Configuration Resilient Backend**: Dual-mode data persistence that connects to MongoDB when available or gracefully runs via an in-memory datastore populated with the complete 101-item catalog.

---

## 🛠️ Technology Stack Breakdown

| Layer | Technologies | Key Capabilities & Highlights |
| :--- | :--- | :--- |
| **Frontend Core** | **Next.js 16.4 (App Router, Turbopack) + React 19** | Server-side rendering, partial prerendering, static route generation across 17 pages, code splitting, and sub-second page transitions. |
| **Styling & Design System** | **Tailwind CSS v4 + Vanilla CSS Variables** | Custom token architecture (`:root` & `.dark`), responsive masonry columns, `@variant dark`, and custom `@font-face` bindings for **Optima** and **Harietta Bulmer**. |
| **State & Navigation** | **React Context + URL Query State** | Instant filter tab synchronization (`?tab=gallery`, `?category=structures`), localStorage theme retention, and accessible keyboard navigation. |
| **Backend & API** | **Node.js (ES Modules) + Express 4.21** | Modular REST API architecture with CORS, route controllers, multipart upload handling, and centralized error logging. |
| **Data & Storage** | **Mongoose 8.9 + In-Memory Fallback Store** | Robust schemas with text indexes for `Portfolio`, `InquiryLead`, and `BusinessContact`. If MongoDB is offline, the backend functions automatically with zero errors. |
| **Icons & Visuals** | **Lucide React + WebP/JPEG Image Engine** | Vector iconography, Next.js image optimization with blur placeholders, responsive `sizes`, and full-screen lightbox dialogs. |

---

## 📁 Repository Structure

```text
upraity/
├── backend/                               # Express REST API (ES Modules)
│   ├── src/
│   │   ├── config/                        # DB connection & Cloudinary setup
│   │   │   ├── cloudinary.js
│   │   │   └── db.js
│   │   ├── controllers/                   # REST route controllers
│   │   │   ├── authController.js
│   │   │   ├── boardController.js
│   │   │   ├── businessContactController.js
│   │   │   ├── crmController.js
│   │   │   ├── pinController.js
│   │   │   ├── portfolioController.js
│   │   │   └── userController.js
│   │   ├── data/
│   │   │   └── portfolioData.json         # 101 curated items with specifications
│   │   ├── models/                        # Mongoose schemas
│   │   │   ├── Board.js
│   │   │   ├── BusinessContact.js
│   │   │   ├── InquiryLead.js
│   │   │   ├── Pin.js
│   │   │   ├── Portfolio.js
│   │   │   └── User.js
│   │   ├── routes/                        # API route handlers
│   │   │   ├── authRoutes.js
│   │   │   ├── boardRoutes.js
│   │   │   ├── businessContactRoutes.js
│   │   │   ├── crmRoutes.js
│   │   │   ├── pinRoutes.js
│   │   │   ├── portfolioRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── store/
│   │   │   └── memoryStore.js             # In-memory datastore with 101 items
│   │   ├── seed.js                        # Seeder script for MongoDB
│   │   └── server.js                      # Express server entry point & health check
│   ├── .env.example                       # Backend environment template
│   └── package.json
│
├── frontend/                              # Next.js 16 App Router
│   ├── public/
│   │   ├── fonts/                         # Self-hosted Optima & Harietta Bulmer
│   │   ├── gallery/                       # 101 stonemasonry archival photographs
│   │   ├── logo.png                       # Crest logo (dark/light adapted)
│   │   └── logo-transparent.png
│   ├── src/
│   │   ├── app/
│   │   │   ├── about/page.tsx             # Master craft, mission & workshop story
│   │   │   ├── admin/page.tsx             # CMS & CRM Admin Portal
│   │   │   ├── contact/page.tsx           # Consultation booking & quote request
│   │   │   ├── experiments/page.tsx       # Prototype material studies
│   │   │   ├── gallery/page.tsx           # Dedicated 101-piece visual archive
│   │   │   ├── history/page.tsx           # 4-generation lineage timeline
│   │   │   ├── privacy/page.tsx           # Client privacy policy
│   │   │   ├── terms/page.tsx             # Terms of craftsmanship & regulations
│   │   │   ├── thoughts/page.tsx          # Masonry essays & stone guides
│   │   │   ├── globals.css                # Tailwind v4 theme tokens & animations
│   │   │   ├── layout.tsx                 # Root layout, theme script & SEO meta
│   │   │   └── page.tsx                   # Main editorial showcase & works grid
│   │   ├── components/
│   │   │   ├── AdminSidebar.tsx           # CMS navigation sidebar
│   │   │   ├── CraftsmanshipSection.tsx   # Stone cutting & leveling methodology
│   │   │   ├── ExperimentsSection.tsx     # Material experiments gallery
│   │   │   ├── GallerySection.tsx         # Photographic masonry component
│   │   │   ├── QuoteModal.tsx             # Price inquiry & consult dialog
│   │   │   ├── ThemeToggle.tsx            # Compact & segmented theme switchers
│   │   │   ├── ThoughtsSection.tsx        # Editorial masonry journal
│   │   │   ├── UpraityDetailModal.tsx     # Monument specification inspector
│   │   │   ├── UpraityFilterTabs.tsx      # Interactive category pills
│   │   │   ├── UpraityFooter.tsx          # Dual-theme footer with directory
│   │   │   ├── UpraityGrid.tsx            # Works multi-column grid
│   │   │   └── UpraitySidebar.tsx         # Desktop fixed & mobile slide-out menu
│   │   ├── context/
│   │   │   ├── AuthContext.tsx            # User session & admin state
│   │   │   └── ThemeContext.tsx           # Light/Dark mode reactive context
│   │   ├── data/
│   │   │   ├── experimentsData.ts         # Material study prototypes
│   │   │   ├── thoughtsData.ts            # Architectural essays
│   │   │   └── upraityData.ts             # 101 items typed as UpraityItem[]
│   │   ├── services/
│   │   │   └── cmsApi.ts                  # Axios/Fetch API client for backend
│   │   └── types/
│   │       └── cms.ts                     # TypeScript definitions for CMS & CRM
│   └── package.json
│
├── gallery/                               # Source archival image collection
├── package.json                           # Root workspace orchestrator
└── README.md                              # Project documentation
```

---

## ⚡ Quick Start & Execution

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher (tested on `v20` and `v26`)
- **npm**: `v9.0.0` or higher
- *(Optional)* **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/`) or MongoDB Atlas URI. If omitted, the server operates automatically using its in-memory store.

### 2. Installation
Install all root, backend, and frontend dependencies in one step:
```bash
# From workspace root:
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 3. Launch Development Servers
Run both the Express REST API (Port 5000) and Next.js Turbopack (Port 3000) concurrently:
```bash
npm run dev
```

| Application / Service | URL | Notes |
| :--- | :--- | :--- |
| **Public Showcase** | [http://localhost:3000](http://localhost:3000) | Home page with works, gallery, essays, and experiments |
| **Dedicated Gallery** | [http://localhost:3000/gallery](http://localhost:3000/gallery) | 101 photographic records with instant search & category pills |
| **Admin CMS & CRM** | [http://localhost:3000/admin](http://localhost:3000/admin) | Full management portal for inquiries, contacts, and portfolio |
| **Express Backend API** | [http://localhost:5000](http://localhost:5000) | Base REST API endpoint |
| **API Health Check** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | Returns server timestamp and status |

### 4. Other Available Commands
```bash
# Run only frontend
npm run dev:frontend

# Run only backend
npm run dev:backend

# Seed MongoDB with 101 items & initial demo users
npm run seed:backend

# Production Next.js build
npm run build:frontend

# Production Next.js server
npm run start:frontend
```

---

## 🎨 Dual-Theme Design System (Light & Dark)

The application features a tailored dual-theme architecture honoring traditional stone materials:

### Palette & Tokens
- **Light Mode (`#FBFBFB`)**: Warm alabaster card surfaces (`#ffffff`), dark slate typography (`#18181b`), and aged chisel bronze accents (`#8B7355`).
- **Dark Mode (`#09090b` / `#121212`)**: Mirror-polished Shanxi black granite background, subtle card borders (`border-white/10`), and imperial stone gold highlights (`#e5c07b`).

### Dynamic Typography & Animation
- **Optima Font Family**: Primary site-wide font providing legibility and classical grace across all body text, specs, and menus.
- **Harietta Bulmer**: Bespoke uppercase monumental heading typeface used for brand titles and editorial headers.
- **`.font-elegant-shimmer`**: Dual-gradient metallic sweep animation that shifts between deep bronze/charcoal in light mode and bright ivory/gold in dark mode.
- **Zero Hydration Flash**: An inline script in `RootLayout` reads `localStorage` before paint to apply the appropriate `.light` or `.dark` class without flickering.

---

## 🔌 REST API Documentation

The backend exposes a REST API at `http://localhost:5000/api`:

### 1. System Health
- **`GET /api/health`**
  - **Description:** Verifies service uptime.
  - **Response:**
    ```json
    {
      "status": "ok",
      "timestamp": "2026-10-26T00:00:00.000Z",
      "service": "Upraity And Son API (Node.js + Express)"
    }
    ```

### 2. Portfolio Management (`/api/portfolio`)
- **`GET /api/portfolio`**
  - **Query Parameters:**
    - `category` *(optional)*: Filter by `structures`, `monuments`, `engraving`, `restoration`, or `masonry`.
    - `search` *(optional)*: Text search across titles, stone materials, and descriptions.
    - `status` *(optional)*: `published` or `draft`.
    - `sort` *(optional)*: `order` or `date`.
  - **Response:** `{ "success": true, "count": 101, "items": [...] }`
- **`GET /api/portfolio/:id`**: Retrieve full specifications for a single piece.
- **`POST /api/portfolio`**: Create a new portfolio entry (supports image URL or file upload).
- **`PUT /api/portfolio/:id`**: Update existing monument details.
- **`DELETE /api/portfolio/:id`**: Remove an item from the catalog.

### 3. CRM & Inquiries (`/api/crm`)
- **`GET /api/crm/stats`**: Returns high-level metrics (total inquiries, open quotes, high-priority counts).
- **`GET /api/crm/inquiries`**: Retrieve customer inquiries with optional status/priority filters.
- **`POST /api/crm/inquiries`**: Create a new customer inquiry (submitted from public `QuoteModal` or `/contact`).
- **`PATCH /api/crm/inquiries/:id`**: Advance lead status (`new` → `contacted` → `site_visit` → `quoted` → `in_progress` → `completed` → `archived`).
- **`POST /api/crm/inquiries/:id/notes`**: Add internal stonemason workshop notes.

### 4. Quarry & Business Contacts (`/api/contacts`)
- **`GET /api/contacts`**: Directory of stone quarries, cemetery superintendents, church faculty officers, and gold leaf gilders.
- **`POST /api/contacts`**: Register a new stone supplier or trade partner.
- **`PUT /api/contacts/:id`**: Update partner contact details and stone specialties.
- **`DELETE /api/contacts/:id`**: Archive a trade contact.

---

## 📖 CMS & API Documentation

For exhaustive REST endpoint specifications, request/response formats, security parameters, and cURL examples, see:
- 🏛️ **[Backend CMS Documentation](file:///v:/client/upraity/backend/CMS_DOCUMENTATION.md)** (`backend/CMS_DOCUMENTATION.md`)
- 🎨 **[Frontend Documentation](file:///v:/client/upraity/frontend/README.md)** (`frontend/README.md`)

---

## 🔒 Configuration & Environment Variables

### Backend Configuration (`backend/.env`)
Create `backend/.env` (or copy from `backend/.env.example`):
```env
# Server Port
PORT=5000

# MongoDB URI (Falls back to in-memory store if unreachable)
MONGODB_URI=mongodb://127.0.0.1:27017/upraity_and_son

# JWT Secret for Authenticated Admin Operations
JWT_SECRET=super_secret_upraity_jwt_key_2026_xyz

# Frontend Application Origin for CORS
FRONTEND_URL=http://localhost:3000

# Optional Cloudinary Configuration for Image Uploads
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 🏛️ Brand & Editorial Standards

- **Brand Name**: Upraity And Son
- **Founding Year**: 1909 (Over 115 years of continuous family lineage)
- **Specializations**:
  - Full-kerb monolithic granite grave structures
  - Hand-carved Italian Bianco Carrara marble crosses & headstones
  - Deep V-cut Roman epitaph engraving with 23.5-karat double gold leaf
  - Structural re-leveling, lime mortar repointing, and biological conservation wash
  - Architectural Welsh slate estate nameplates and bespoke masonry commissions
- **Guarantees**: BRAMM / NAMM compliant installations, stainless steel dowels, lifetime foundation leveling stability.

---

## 📄 License & Attribution

All masonry photography, structural designs, and brand typography are the proprietary property of **Upraity And Son**. Built with pride by Antigravity.
