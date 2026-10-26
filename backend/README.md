# 🏛️ Upraity And Son — Backend REST API

High-performance Express REST API powering the **Upraity And Son** monumental stonemasonry web application, CMS, and CRM.

## 🛠️ Architecture & Features

- **Dual-Mode Persistence**:
  - **MongoDB + Mongoose**: Connects when `MONGODB_URI` is available and active.
  - **Zero-Config In-Memory Fallback**: When MongoDB is offline, the API automatically falls back to an in-memory store loaded with the full 101-item catalog (`src/data/portfolioData.json`). No setup required to start developing.
- **REST Endpoints**:
  - `GET /api/health` — Reports status, uptime, storage mode (`mongodb` vs `in-memory-fallback`), and persistence model.
  - `/api/portfolio` — Catalog of 101 grave structures, headstones, and monuments with category, status (published/draft), and text search filtering.
  - `/api/crm` — Customer inquiries pipeline with stages (`new`, `contacted`, `site_visit`, `quoted`, `in_progress`, `completed`, `archived`), priorities, 60-second de-duplication, and internal workshop notes (`/api/crm/inquiries/:id/notes`).
  - `/api/contacts` — Protected trade partner directory (stone quarries, cemetery superintendents, church officials, gilders, and crane operators).
- **Authentication**: Strict Bearer token validation for admin operations with support for production JWT and local demo token (`mock_jwt_token_demo_mode_2026`).
- **File Uploads**: Local static uploads (`/uploads`) with optional Cloudinary storage support.
- **CORS Configured**: Pre-configured for seamless communication with Next.js at `http://localhost:3000`.

## 📖 CMS Documentation

For complete endpoint specifications, payload schemas, query parameters, data models, and cURL examples, see:
👉 **[CMS_DOCUMENTATION.md](./CMS_DOCUMENTATION.md)**

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Start in development mode (with --watch-path=src)
npm run dev

# Seed MongoDB with 101 items & initial demo users
npm run seed

# Start in production mode
npm start
```

Runs on **http://localhost:5000**.  
Health check: **http://localhost:5000/api/health**.  
Full CMS Specification: **[CMS_DOCUMENTATION.md](./CMS_DOCUMENTATION.md)**.
