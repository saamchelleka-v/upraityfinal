# 🏛️ Upraity And Son — Backend CMS & CRM API Documentation

Comprehensive REST API and architectural documentation for the **Upraity And Son** Content Management System (CMS) and Customer Relationship Management (CRM) backend.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication & Security](#authentication--security)
3. [Health & Storage Monitoring](#health--storage-monitoring)
4. [Portfolio CMS Endpoints (`/api/portfolio`)](#portfolio-cms-endpoints)
5. [Business Directory Endpoints (`/api/contacts`)](#business-directory-endpoints)
6. [CRM Inquiry Pipeline Endpoints (`/api/crm`)](#crm-inquiry-pipeline-endpoints)
7. [Data Models & Enumerations](#data-models--enumerations)
8. [Response Format & Error Handling](#response-format--error-handling)
9. [Integration & Code Examples](#integration--code-examples)

---

## 1. Architecture Overview

The backend operates on a **dual-mode persistence architecture**:

```
+-----------------------------------------------------------+
|               Client Requests (Next.js / cURL)            |
+-----------------------------------------------------------+
                             │
                             ▼
+-----------------------------------------------------------+
|             Express Router & Auth Middleware              |
|        (Bearer JWT Verification / 10MB Payload Limit)     |
+-----------------------------------------------------------+
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [ MongoDB Active ]               [ MongoDB Offline ]
   Persistent storage               High-reliability fallback
   Mongoose models                  In-memory store populated
   Indexes & ACID persistence       from portfolioData.json (101 items)
```

- **MongoDB Mode**: Activated when MongoDB is connected (`mongoose.connection.readyState === 1`). Changes persist permanently across server restarts.
- **In-Memory Fallback Mode**: If MongoDB is unreachable, the API gracefully falls back to `memoryStore.js` initialized with all 101 archival portfolio records from `src/data/portfolioData.json`. All CRUD mutations, searches, and validations function identically.
- **Payload Limits**: `express.json` and `express.urlencoded` configured with `limit: '10mb'`.
- **CORS**: Configured with credentials support for `http://localhost:3000` (or `process.env.FRONTEND_URL`).

---

## 2. Authentication & Security

Sensitive administrative operations (creating, editing, publishing, and deleting portfolio works, trade directory contacts, and managing customer inquiries) require an authorization token.

### Header Format

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Supported Tokens

1. **Production JWT**: Signed by `process.env.JWT_SECRET` with user payload `{ id: user._id }`.
2. **Authorized Development/Demo Token**:
   `mock_jwt_token_demo_mode_2026`
   Allows out-of-the-box local development and testing without credential barriers.
3. **Invalid / Expired Tokens**: Rejected with `HTTP 401 Unauthorized`.

---

## 3. Health & Storage Monitoring

### `GET /api/health`

Returns operational status, uptime timestamp, and storage connectivity mode.

- **Access**: Public
- **Response**: `200 OK`

```json
{
  "status": "ok",
  "timestamp": "2026-10-25T21:46:14.533Z",
  "service": "Upraity And Son API (Node.js + Express)",
  "database": {
    "connected": true,
    "storageMode": "mongodb",
    "persistence": "persistent"
  },
  "version": "1.0.0"
}
```

*When running without MongoDB, `database.connected` reports `false` and `storageMode` reports `"in-memory-fallback"`.*

---

## 4. Portfolio CMS Endpoints

Base Path: `/api/portfolio`

### `GET /api/portfolio`

Fetches portfolio items with optional filtering, search, and sorting.

- **Access**: Public
- **Query Parameters**:
  - `category` *(string, optional)*: Filter by category (`structures`, `monuments`, `engraving`, `restoration`, `masonry`, or `all`).
  - `search` *(string, optional)*: Case-insensitive search matching `title`, `material`, `description`, `categoryLabel`, and `cemeteryType`.
  - `status` *(string, optional)*: Filter by `published`, `draft`, or `all`.
    - **Note:** If `status` is omitted, public requests automatically exclude drafts and only receive published records.
  - `sort` *(string, optional)*: `'order'` sorts by manual display rank; default sorts by `createdAt` descending.
- **Response**: `200 OK`

```json
{
  "success": true,
  "count": 101,
  "items": [
    {
      "_id": "monument-001",
      "title": "Monolithic Shanxi Black Granite Full Kerb Set",
      "category": "structures",
      "categoryLabel": "Grave Structure",
      "material": "Grade-A Shanxi Black Granite",
      "dimensions": "6ft 6in x 2ft 6in (198cm x 76cm)",
      "cemeteryType": "Traditional Kerbed Lawn Section",
      "image": "/gallery/IMG_20260309_162334.jpg",
      "caption": "Full kerbed family allotment with monolithic headpiece",
      "description": "Substantial full kerb memorial structure crafted from deep-luster Shanxi black granite...",
      "craftsmanshipNotes": "Engineered foundation installed on solid concrete piers with NAMM-approved stainless steel ground anchor dowels.",
      "year": "1994 Archive",
      "aspectRatio": "wide",
      "featured": true,
      "status": "published",
      "order": 1,
      "createdAt": "2026-10-25T18:11:13.238Z",
      "updatedAt": "2026-10-25T18:11:13.238Z"
    }
  ]
}
```

---

### `GET /api/portfolio/:id`

Retrieves a single portfolio work by its unique ID.

- **Access**: Public
- **Response**: `200 OK` or `404 Not Found`

```json
{
  "success": true,
  "item": { ... }
}
```

---

### `POST /api/portfolio`

Creates a new portfolio record in the catalog.

- **Access**: **Protected** (Requires Bearer Token)
- **Request Body**:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Yes** | Title of the memorial work |
| `material` | `string` | **Yes** | Stone/granite/marble specification |
| `image` | `string` | **Yes** | Local image path (`/gallery/...`) or URL |
| `category` | `string` | No | `structures` \| `monuments` \| `engraving` \| `restoration` \| `masonry` (default: `structures`) |
| `categoryLabel` | `string` | No | Display label (e.g. `Grave Structure`) |
| `dimensions` | `string` | No | Physical dimensions (e.g. `6ft x 3ft`) |
| `cemeteryType` | `string` | No | Cemetery / churchyard regulation zone |
| `caption` | `string` | No | Short image caption |
| `description` | `string` | No | Editorial narrative description |
| `craftsmanshipNotes`| `string` | No | Masonry technique and anchor notes |
| `year` | `string` | No | Year or commission era tag |
| `aspectRatio` | `string` | No | `standard` (4:3) \| `tall` (3:4) \| `wide` (16:10) \| `square` (1:1) |
| `featured` | `boolean`| No | Highlight on front page (default: `true`) |
| `status` | `string` | No | `published` \| `draft` (default: `published`) |
| `order` | `number` | No | Sort rank integer (default: `0`) |

- **Response**: `201 Created`

```json
{
  "success": true,
  "item": {
    "_id": "monument-1792964845860",
    "title": "Celtic Knot Cross in Portland Stone",
    "category": "monuments",
    "categoryLabel": "Granite/Marble Monument",
    "material": "Portland Limestone",
    "aspectRatio": "tall",
    "status": "published",
    "createdAt": "2026-10-25T21:47:25.000Z"
  }
}
```

---

### `PUT /api/portfolio/:id`

Updates an existing portfolio work (including publishing/draft status toggling).

- **Access**: **Protected** (Requires Bearer Token)
- **Request Body**: Any subset of portfolio fields.
- **Response**: `200 OK` or `404 Not Found`

```json
{
  "success": true,
  "item": { ... }
}
```

---

### `DELETE /api/portfolio/:id`

Removes a work from the portfolio.

- **Access**: **Protected** (Requires Bearer Token)
- **Response**: `200 OK`

```json
{
  "success": true,
  "message": "Portfolio item deleted",
  "item": { ... }
}
```

---

## 5. Business Directory Endpoints

Base Path: `/api/contacts`  
Manages trade contacts, quarries, cemetery superintendents, churchwardens, gilders, and crane operators.

All directory endpoints require authorization to safeguard trade relationships and partner privacy.

### `GET /api/contacts`

Lists trade contacts with search and category filtering.

- **Access**: **Protected** (Requires Bearer Token)
- **Query Parameters**:
  - `category` *(string, optional)*: Filter by trade category.
  - `search` *(string, optional)*: Search across `name`, `organization`, `email`, `phone`, and `notes`.
  - `status` *(string, optional)*: Filter by `active`, `preferred`, or `archived`.
- **Response**: `200 OK`

```json
{
  "success": true,
  "count": 12,
  "contacts": [
    {
      "_id": "contact-01",
      "name": "Arthur Pendelton",
      "organization": "Cornish Silver Granite Quarries Ltd",
      "category": "Quarry & Stone",
      "roleTitle": "Chief Quarry Master",
      "phone": "+44 (0) 1872 552 104",
      "email": "pendelton@cornishgranite.co.uk",
      "address": "Penryn Granite Works, Cornwall TR10 8AE",
      "status": "preferred",
      "notes": "Direct supplier for fine-grained silver-grey granite monolith blocks.",
      "specialties": ["Raw Granite Blocks", "Honed Slabs", "Kerb Kerbing"]
    }
  ]
}
```

---

### `POST /api/contacts`

Registers a new trade contact.

- **Access**: **Protected** (Requires Bearer Token)
- **Required Fields**: `name`, `organization`, `phone`.
- **Response**: `201 Created`

```json
{
  "name": "Father Thomas Sterling",
  "organization": "St. Mary the Virgin Parish",
  "category": "Parish / Church Official",
  "roleTitle": "Parish Vicar & Faculty Registrar",
  "phone": "+44 20 7946 0192",
  "email": "rector@stmarychurchyard.org",
  "address": "Parish Office, High Street, Kent",
  "status": "active",
  "specialties": ["Churchyard Regulations", "Diocesan Faculty Approval"]
}
```

---

### `PUT /api/contacts/:id`

Updates partner details, specialties, or status.

- **Access**: **Protected** (Requires Bearer Token)
- **Response**: `200 OK`

---

### `DELETE /api/contacts/:id`

Deletes a partner from the trade directory.

- **Access**: **Protected** (Requires Bearer Token)
- **Response**: `200 OK`

---

## 6. CRM Inquiry Pipeline Endpoints

Base Path: `/api/crm`

### Pipeline Progression

$$\text{new} \longrightarrow \text{contacted} \longrightarrow \text{site\_visit} \longrightarrow \text{quoted} \longrightarrow \text{in\_progress} \longrightarrow \text{completed} \longrightarrow \text{archived}$$

---

### `GET /api/crm/stats`

Calculates live pipeline metrics and database counts.

- **Access**: **Protected** (Requires Bearer Token)
- **Response**: `200 OK`

```json
{
  "success": true,
  "stats": {
    "totalInquiries": 8,
    "newInquiries": 2,
    "activeInquiries": 5,
    "highPriorityCount": 1,
    "statusCounts": {
      "new": 2,
      "contacted": 1,
      "site_visit": 1,
      "quoted": 1,
      "in_progress": 0,
      "completed": 2,
      "archived": 1
    },
    "totalContacts": 12,
    "activeContacts": 10,
    "totalPortfolioWorks": 101,
    "publishedPortfolioWorks": 98
  }
}
```

*`activeInquiries` accurately counts only active cases, excluding `completed` and `archived`.*

---

### `GET /api/crm/inquiries`

Lists customer consultation leads with filters.

- **Access**: **Protected** (Requires Bearer Token)
- **Query Parameters**:
  - `status`: `new` | `contacted` | `site_visit` | `quoted` | `in_progress` | `completed` | `archived` | `all`
  - `priority`: `normal` | `high` | `urgent` | `all`
  - `serviceType`: Substring match on service requested
  - `search`: Substring search on client name, email, phone, cemetery, or message
- **Response**: `200 OK`

---

### `POST /api/crm/inquiries`

Receives consultation and quote requests from public website visitors.

- **Access**: **Public** (Protected by anti-spam de-duplication)
- **Validation**:
  - `name`: Required non-empty string.
  - `email`: Required valid email address (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
  - `phone`: Required valid phone number (minimum 6 digits).
  - **De-duplication Protection**: Identical submissions from the same email within 60 seconds return HTTP 200 with the existing inquiry, preventing double submissions.
- **Request Body**:

```json
{
  "name": "Eleanor Vance",
  "email": "eleanor.vance@stoneheritage.org",
  "phone": "+44 20 7946 0912",
  "cemetery": "Highgate Cemetery, West Section",
  "serviceType": "Lettering & Engraving",
  "message": "Requesting hand-cut lettering consultation for family vault.",
  "estimatedBudget": "£3,500",
  "source": "contact_form"
}
```

- **Response**: `201 Created`

```json
{
  "success": true,
  "message": "Thank you. Your consultation inquiry has been logged with our stonemasons.",
  "inquiry": {
    "_id": "inq-1792964845861",
    "name": "Eleanor Vance",
    "status": "new",
    "priority": "normal",
    "internalNotes": [
      {
        "note": "Initial web inquiry received via public portal.",
        "author": "System",
        "createdAt": "2026-10-25T21:47:25.861Z"
      }
    ],
    "createdAt": "2026-10-25T21:47:25.861Z"
  }
}
```

---

### `PATCH /api/crm/inquiries/:id`

Updates inquiry pipeline stage, priority, estimated quote, or assigned mason.

- **Access**: **Protected** (Requires Bearer Token)
- **Validation**:
  - `status` must be one of: `['new', 'contacted', 'site_visit', 'quoted', 'in_progress', 'completed', 'archived']`. Invalid stages return `400 Bad Request`.
  - `priority` must be one of: `['normal', 'high', 'urgent']`.
- **Request Body**:

```json
{
  "status": "site_visit",
  "priority": "high",
  "estimatedBudget": "£4,200",
  "assignedTo": "Senior Letter Carver"
}
```

- **Response**: `200 OK`

---

### `POST /api/crm/inquiries/:id/notes`

Appends an internal mason note to the inquiry's audit history without altering pipeline stages.

- **Access**: **Protected** (Requires Bearer Token)
- **Request Body**:

```json
{
  "note": "Inspected cemetery plot. Soil is clay-heavy; recommend reinforced 6-inch precast concrete sub-base."
}
```

- **Response**: `201 Created`

```json
{
  "success": true,
  "note": {
    "note": "Inspected cemetery plot. Soil is clay-heavy; recommend reinforced 6-inch precast concrete sub-base.",
    "author": "Head Mason",
    "createdAt": "2026-10-25T21:47:26.100Z"
  },
  "inquiry": { ... }
}
```

---

### `DELETE /api/crm/inquiries/:id`

Permanently removes an inquiry from the pipeline.

- **Access**: **Protected** (Requires Bearer Token)
- **Response**: `200 OK`

---

## 7. Data Models & Enumerations

### Category Types (`category`)

| Key | Label | Scope |
| :--- | :--- | :--- |
| `structures` | Grave Structure | Full kerb sets, enclosures, ledger slabs |
| `monuments` | Granite/Marble Monument | Monolithic headstones, crosses, obelisks |
| `engraving` | Lettering & Engraving | V-cut lettering, 23k gold leaf, relief carving |
| `restoration` | Grave Renovation | Chemical poultice cleaning, re-leveling, repair |
| `masonry` | Small Masonry | House nameplates, boundary markers, garden stone |

### Aspect Ratio Values (`aspectRatio`)

| Value | Ratio | Grid Presentation |
| :--- | :--- | :--- |
| `standard` | 4:3 | Default balanced masonry card |
| `tall` | 3:4 | Tall portrait crosses & headstones |
| `wide` | 16:10 | Panoramic full kerbs & ledger monuments |
| `square` | 1:1 | Nameplates, emblems, and details |

### Trade Contact Categories (`category`)

- `Quarry & Stone`
- `Cemetery Superintendent`
- `Parish / Church Official`
- `Gilding & Gold Leaf`
- `Logistics & Crane`
- `Architect / Representative`
- `Trade Association / NAMM`
- `Other Partner`

---

## 8. Response Format & Error Handling

All JSON responses follow a standardized envelope:

### Success Response

```json
{
  "success": true,
  "count": 10,
  "items": [ ... ]
}
```

### Structured Error Response

```json
{
  "success": false,
  "message": "Invalid inquiry status \"pending\". Allowed values: new, contacted, site_visit, quoted, in_progress, completed, archived"
}
```

### HTTP Status Codes

| Code | Meaning | Typical Scenario |
| :--- | :--- | :--- |
| `200 OK` | Request succeeded | `GET`, `PATCH`, `PUT`, `DELETE` operations |
| `201 Created` | Resource created | `POST` portfolio, contact, inquiry, or note |
| `400 Bad Request` | Validation failure | Missing required fields or invalid stage name |
| `401 Unauthorized`| Authentication error | Missing, invalid, or expired Bearer token |
| `404 Not Found` | Entity not found | Invalid `_id` supplied in parameter |
| `500 Server Error`| Internal failure | Database or file system exception |

---

## 9. Integration & Code Examples

### cURL: Create a Portfolio Work

```bash
curl -X POST http://localhost:5000/api/portfolio \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mock_jwt_token_demo_mode_2026" \
  -d '{
    "title": "Carrara Marble Gothic Memorial",
    "category": "monuments",
    "material": "Bianco Carrara Marble",
    "image": "/gallery/IMG_20260309_162334.jpg",
    "aspectRatio": "tall",
    "dimensions": "4ft 2in x 2ft 4in",
    "status": "published"
  }'
```

### cURL: Advance Inquiry to "Site Visit"

```bash
curl -X PATCH http://localhost:5000/api/crm/inquiries/inq-1792964845861 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mock_jwt_token_demo_mode_2026" \
  -d '{
    "status": "site_visit",
    "priority": "high",
    "estimatedBudget": "£3,800"
  }'
```

### Frontend Fetch Example (TypeScript)

```typescript
import { createPortfolioItem, updateInquiry } from '@/services/cmsApi';

// Create a new monument
const newItem = await createPortfolioItem({
  title: 'Shanxi Black Granite Ledger',
  category: 'structures',
  categoryLabel: 'Grave Structure',
  material: 'Shanxi Black Granite',
  image: '/gallery/IMG_20260309_162334.jpg',
  aspectRatio: 'wide',
  status: 'published',
  featured: true,
});

// Update inquiry stage
const updatedLead = await updateInquiry('inq-1792964845861', {
  status: 'quoted',
  estimatedBudget: '£4,500',
});
```

---

*Upraity And Son — Fourth-generation monumental stonemasons established 1909.*
