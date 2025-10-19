# Design Guidelines: Loja de Roupas Moderna

## Design Approach

**Reference-Based**: Drawing inspiration from modern fashion e-commerce leaders like Everlane, Zara, and Aritzia, this design emphasizes clean product presentation, generous white space, and photography-first layouts that let the clothing speak for itself.

**Core Principle**: Minimalist sophistication with maximum focus on product imagery and effortless navigation.

---

## Color Palette

### Light Mode (Primary)
- **Background**: 0 0% 98% (off-white for softness)
- **Surface/Cards**: 0 0% 100% (pure white)
- **Text Primary**: 0 0% 10% (near black)
- **Text Secondary**: 0 0% 40% (medium gray)
- **Accent**: 25 75% 55% (warm terracotta/coral - fashion-forward, gender-neutral)
- **Border/Divider**: 0 0% 90% (subtle lines)

### Dark Mode (Optional Admin Panel)
- **Background**: 0 0% 8%
- **Surface**: 0 0% 12%
- **Text Primary**: 0 0% 95%
- **Accent**: Same terracotta maintains warmth

---

## Typography

**Fonts**: 
- **Primary (Headings)**: Inter (600, 500) - modern, clean sans-serif
- **Secondary (Body)**: Inter (400, 300) - consistent family for cohesion
- **Accent (Prices)**: Inter (700) - bold weight for price emphasis

**Hierarchy**:
- Hero/Page Titles: text-5xl md:text-6xl font-semibold
- Section Headers: text-3xl md:text-4xl font-medium
- Product Names: text-xl font-medium
- Prices: text-2xl font-bold (accent color)
- Body: text-base leading-relaxed
- Descriptions: text-sm text-secondary

---

## Layout System

**Spacing Units**: Consistent use of 4, 6, 8, 12, 16, 24 (Tailwind: p-4, p-6, p-8, p-12, p-16, p-24)

**Container Strategy**:
- Max width: max-w-7xl for content areas
- Padding: px-4 md:px-8 lg:px-16
- Section spacing: py-16 md:py-24 (generous vertical rhythm)

**Grid System**:
- Product Grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8
- Featured Items: Larger cards, grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Admin Forms: Single column max-w-2xl

---

## Component Library

### Navigation Header
- Transparent overlay on hero (sticky with backdrop blur)
- Logo left, navigation center, WhatsApp CTA right
- Mobile: Hamburger menu with slide-out drawer
- Height: h-16 md:h-20

### Product Cards
- Aspect ratio 3:4 for product images (portrait)
- Minimal card design: no heavy borders, subtle shadow on hover
- White background with 1px border (border-neutral-200)
- Content: Image → Name → Description (1-2 lines) → Price → WhatsApp button
- Hover: Subtle lift (translate-y-1) and shadow increase

### Featured Section
- Hero-style showcase at top of homepage
- Large hero image banner OR prominent carousel
- "Destaques" headline with 3-6 featured products in prominent grid
- Larger card size than regular products

### Call-to-Action Buttons
- **Primary (WhatsApp)**: Accent color background, white text, rounded-lg px-6 py-3
- **Secondary**: Outline style with accent border
- **Admin Actions**: Smaller, neutral variants (edit/delete icons)
- WhatsApp icon alongside text for clarity

### Forms (Admin Panel)
- Clean input fields: border rounded-lg focus:ring-2 focus:ring-accent
- Label above input pattern
- Image upload: Drag-and-drop zone with preview thumbnails
- Toggle switches for "Featured" status (modern, iOS-style)

### Contact Page
- Two-column layout: Contact info left, embedded map/visual right
- Social icons: Large (40px), circular, hover lift effect
- Instagram, WhatsApp, physical address with icons
- Clean typography hierarchy for readability

---

## Imagery Strategy

### Hero Section
**Primary Approach**: Full-width hero banner (h-[60vh] md:h-[70vh])
- Lifestyle shot showing clothing in context (person wearing outfit in aspirational setting)
- Overlay gradient (bottom fade) for text legibility
- CTA overlay: "Explore Collection" button with backdrop blur background

### Product Images
- High-quality, clean background product photography (white or neutral)
- Consistent aspect ratio across all products
- Multiple angles for kits (carousel or grid of 2-3 images)
- Hover: Slight zoom (scale-105 transition)

### Image Placement
- Hero: 1 large lifestyle banner
- Featured section: 3-6 product images
- Product grid: All products with primary image
- Kits: 2-4 images per kit showing different angles/pieces
- Admin preview: Thumbnail grid during upload

---

## Key Design Patterns

### Vitrine (Main Showcase)
- **Layout**: Asymmetric masonry grid OR standard equal-height grid
- **Filters**: Subtle top bar (All / Individual / Kits) with underline indicators
- **Infinite feel**: Products load smoothly, generous spacing between rows
- **Price Display**: Always visible, prominent, in accent color above button

### Items em Destaque
- **Position**: Immediately after hero section
- **Treatment**: Larger cards with "Destaque" badge (small accent pill)
- **Carousel Option**: Horizontal scroll on mobile, grid on desktop
- **Emphasis**: Slightly elevated design (deeper shadow, accent border)

### Admin Panel
- **Login**: Centered card, minimal form, logo at top
- **Dashboard**: Side navigation (desktop) / bottom nav (mobile)
- **Product Management**: Table view with quick actions, or card grid with overlays
- **Image Upload**: Prominent dropzone with "+" icon, preview grid below
- **Forms**: Clean, organized sections with clear labels

### WhatsApp Integration
- **Button Design**: Green WhatsApp brand color (#25D366) or custom accent
- **Icon**: Official WhatsApp icon alongside "Ver no WhatsApp" text
- **Hover**: Slight scale and shadow enhancement
- **Message Preview**: Tooltip on hover showing message template (optional but delightful)

---

## Responsive Behavior

**Mobile First** (Brazilian market insight: most users on mobile)
- Stack all multi-column layouts to single column
- Hamburger navigation with full-screen overlay menu
- Touch-friendly buttons (min 44px height)
- Product grid: 2 columns max on mobile
- Generous tap targets for WhatsApp buttons

**Desktop Enhancements**
- Multi-column grids (3-4 products wide)
- Sticky navigation with transparency
- Hover states and micro-interactions
- Admin panel: side-by-side layouts for forms

---

## Animations

**Minimal, Purposeful**:
- Page transitions: Subtle fade-in on route change
- Product cards: Hover lift (transform + shadow)
- Images: Lazy load with fade-in
- Buttons: Scale on press (active:scale-95)
- Admin toasts: Slide in from top for confirmations
- **No**: Excessive scroll animations, complex carousels, distracting motion

---

## Accessibility & Performance

- High contrast text (WCAG AA minimum)
- Alt text for all product images
- Keyboard navigation throughout
- Focus indicators on interactive elements
- Lazy loading for images below fold
- Optimized images (WebP format, responsive sizes)
- Fast WhatsApp redirect (no intermediary pages)

---

## Brand Personality

**Tone**: Modern, approachable, trustworthy
**Feel**: Clean boutique meets accessible shopping
**Vibe**: Instagram-worthy but functional, aspirational but attainable

This design balances minimalist aesthetics with e-commerce functionality, letting products shine while providing seamless WhatsApp integration for conversions.