# Design System & Architecture Specification (`design.md`)
**Project:** Upraity And Son - Master Monumental Stonemasonry & Memorial Architecture  
**Inspiration & Aesthetic Benchmark:** [dzrgo.com](https://www.dzrgo.com/) (Minimalist, Content-First, High-Craft Editorial Layout)

---

## 1. Executive Vision & Brand Identity

### The Brand
**Upraity And Son** is a 4th-generation family monumental masonry business. Passed down through great-grandfather, grandfather, father, and today's master stonemasons. The craft is centered around dignity, lasting remembrance, and uncompromising precision.

### The Design Philosophy (Adapted from dzrgo.com)
The visual tone of `dzrgo.com` is characterized by:
1. **Asymmetric Two-Column Architecture**: Fixed, calm left sidebar with permanent brand positioning, narrative context, and tactile status indicator; paired with an expansive, fluid right content stream.
2. **Ultra-Refined Typography & Spacing**: Subtle muted captions (`text-foreground/40`), high typographic hierarchy, airy paddings, and quiet sophistication.
3. **Pill-Based Filter System**: Clean horizontal tabs (`All`, `Grave Structures`, `Monuments & Headstones`, `Plaques & Engraving`, `Restoration & Care`, `Custom Masonry`) with instant reactive transitions.
4. **Gallery of Tactile Craft**: Rich photographic cards with hairline borders (`border-black/5 dark:border-white/5`), subtle hover zooms, image-first presentation, and full-screen inspection modals.
5. **Dignified Restraint**: No flashy neon colors or aggressive sales popups. Monochromatic granite, marble, warm stone tones, and charcoal typography that honor the solemn and permanent nature of memorials.

---

## 2. Color Palette & Material Tones

| Role | Hex | Tailwind Token | Rationale |
| :--- | :--- | :--- | :--- |
| **Background (Light)** | `#FBFBFB` | `bg-[#fbfbfb]` | Warm alabaster paper tone; softer than stark `#fff` |
| **Surface Card** | `#FFFFFF` | `bg-white` | Pristine stone contrast |
| **Border Hairline** | `rgba(0, 0, 0, 0.07)` | `border-black/7` | Razor-sharp architectural precision |
| **Primary Text** | `#1A1A1A` | `text-[#1a1a1a]` | Deep slate black (reminiscent of engraved granite) |
| **Secondary Text** | `#6B6B6B` | `text-[#6b6b6b]` | Muted chisel pencil notes |
| **Subtle Caption** | `#9E9E9E` | `text-[#9e9e9e]` | Editorial caption tone (`text-foreground/40` on dzrgo) |
| **Accent / Heritage** | `#8B7355` | `text-[#8b7355]` | Aged bronze / chisel brass accent |
| **Dark Mode Background** | `#121212` | `dark:bg-[#121212]` | Polished Black Galaxy granite background |
| **Dark Mode Surface** | `#1C1C1C` | `dark:bg-[#1c1c1c]` | Honed slate stone |

---

## 3. Layout Anatomy

```text
+-----------------------------------------------------------------------------------+
|  [Sidebar: Fixed 288px (w-72)]       |  [Main Content Stream: Flexible width]    |
|                                      |                                            |
|  • Brand Name: UPRAITY AND SON       |  • Category Filter Pills:                  |
|    "Established by our              |    [All] [Grave Structures] [Monuments]    |
|     founding master stonemason"      |    [Plaques & Engraving] [Restoration]     |
|                                      |    [House Nameplates]                      |
|  • Lineage timeline badge:           |                                            |
|    1909 -> 1948 -> 1982 -> Present   |  • Visual Works Grid (Multi-column):       |
|                                      |    - Full grave structures                 |
|  • Quality Pillars:                  |    - Carved headstones                     |
|    Measurement • Alignment • Finish  |    - Lettering & portrait engraving        |
|                                      |    - Before/After renovation cases         |
|  • Quick Inquiries:                  |                                            |
|    [Call Mason] [WhatsApp Consultation]| • Detailed Story & Craft Section         |
|                                      |                                            |
|  • Live Status Indicator:            | • Comprehensive Services Breakdown        |
|    "Workshop open in London / Quarry | • Transparent Pricing & Inquiry Form      |
|     • 115 Years of Craftsmanship"    |                                            |
+-----------------------------------------------------------------------------------+
```

---

## 4. Content Architecture

### 1. Introduction & Heritage Narrative
> *"We make Grave Structures and Memorial Monuments; we understand that a grave monument is more than a structure. It is a lasting place of remembrance for family and loved ones. Our aim is to provide strong, well finished and dignified memorial structures that family can be proud of for years to come.*  
> *This company was established by my great-grandfather in 1909. Our family business passed down through generations. My grandfather continued the work followed by my father, and today, I proudly carry forward the legacy, values, and craftsmanship that began more than a century ago."*

### 2. Services Categorization
1. **Grave Structure Construction & Installation** (Full Kerb Sets, Ledger Slabs, Multi-Tiered Bases)
2. **Marble & Granite Monuments** (Carrara Marble, Shanxi Black, Blue Pearl, Balmoral Red)
3. **Memorial Plaques & Headstones** (Custom shaped arches, teardrops, books, and scroll stones)
4. **Engraving & Lettering** (Hand-cut V-groove, 23k Gold Leaf, deep sandblast, portrait etching)
5. **Restoration & Cemetery Maintenance** (Re-leveling sunken graves, replacing broken slabs, power-washing & anti-algae preservation)
6. **Architectural & Decorative Stone** (House nameplates, small masonry, ornamental urns)

### 3. Quality & Cemetery Compliance Standard
- Exact laser and spirit-level alignment.
- NAMM / BRAMM certified ground anchors and foundation piers.
- Cemetery regulation management (parish churches, municipal lawns, private burial grounds).
- 100% transparent pricing with no hidden cemetery permit surprises.

---

## 5. Micro-Interactions & UX Details
- **Filtering**: Instant client-side state transition with smooth fade and staggered reveal.
- **Card Inspection Modal**: Clicking any card opens a high-detail dialog with material specification, dimensions, cemetery guidelines suitability, and a direct inquiry button.
- **Dynamic Status Indicator**: Real-time workshop status indicator inspired by dzrgo.com's live status pill ("Workshop active • 115 years of uninterrupted craft").
- **Quote Calculator / Inquiry Drawer**: Interactive step-by-step calculator for memorial type, material, lettering count, and cemetery location.
