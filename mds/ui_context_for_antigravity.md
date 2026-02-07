# Thoughtsy UI Context - React Export for Antigravity

## Overview
Complete UI system for Thoughtsy - an AI-powered second brain planner and journal application. Built with React, Tailwind CSS, and modern component patterns.

---

## 1. DESIGN SYSTEM & STYLING

### Color Tokens (CSS Variables)
```css
/* Neutral Monotone Palette */
--background: 0 0% 10%;           /* Deep charcoal (#1A1A1A) */
--foreground: 0 0% 95%;            /* Off-white (#F2F2F2) */
--card: 0 0% 15%;                  /* Darker card background */
--card-foreground: 0 0% 95%;
--primary: 0 0% 40%;               /* Medium grey (#666666) */
--primary-foreground: 0 0% 95%;
--secondary: 0 0% 25%;             /* Darker grey (#404040) */
--secondary-foreground: 0 0% 95%;
--muted: 0 0% 30%;
--muted-foreground: 0 0% 65%;
--accent: 0 0% 45%;                /* Light grey (#737373) */
--accent-foreground: 0 0% 95%;
--destructive: 0 84.2% 60.2%;      /* Red for destructive actions */
--destructive-foreground: 0 0% 98%;
--border: 0 0% 35%;                /* Bright borders */
--input: 0 0% 20%;
--ring: 0 0% 50%;

/* Sidebar Colors */
--sidebar-background: 0 0% 12%;
--sidebar-foreground: 0 0% 95%;
--sidebar-primary: 0 0% 40%;
--sidebar-primary-foreground: 0 0% 95%;
--sidebar-accent: 0 0% 25%;
--sidebar-accent-foreground: 0 0% 95%;
--sidebar-border: 0 0% 35%;
--sidebar-ring: 0 0% 50%;

/* Link Type Colors (Earthy Pastel/Rusty) */
--youtube: 12 65% 55%;             /* Rusty Red (#C64D47) */
--reddit: 24 70% 50%;              /* Rusty Orange (#D97937) */
--twitter: 210 45% 50%;            /* Earthy Blue (#5B8FB8) */
```

### Typography
- **Font Family**: Sora (Google Fonts)
- **Heading Size**: text-5xl (3rem) - left-aligned, bold
- **Form Labels**: font-bold text-base
- **Button Text**: font-bold text-base
- **Body Text**: text-sm to text-base
- **Line Height**: leading-relaxed (1.625)

### Spacing Scale
- Use Tailwind's default spacing: p-4, gap-4, py-6, etc.
- No arbitrary values - stick to 4px, 8px, 12px, 16px, 24px, etc.

### Border Radius
- --radius: 0.5rem (8px)
- Cards: rounded-lg
- Buttons: rounded-lg
- Badge: rounded-full

---

## 2. COMPONENT STRUCTURE

### Global Layout Pattern
All authenticated pages use a **two-column layout**:
- **Left Sidebar** (w-64): Navigation, branding
- **Main Content Area** (flex-1): Page content

### Reusable Components Used
- Button (shadcn/ui)
- Input (shadcn/ui)
- Label (shadcn/ui)
- Textarea (shadcn/ui)
- Dialog/Modal (shadcn/ui)
- Select (shadcn/ui)

### Icons
Using `lucide-react` library:
- Plus, Edit2, Trash2, X, Share2, ExternalLink, ArrowRight

---

## 3. PAGE STRUCTURES

### Login Page (/page.tsx)
```
Layout: Centered form with background blur elements
Components:
  - Branding (Thoughtsy title, subtitle)
  - Email input field
  - Password input field with Show/Hide toggle
  - Remember me checkbox
  - Forgot password link
  - Sign in button with loading spinner
  - Sign up link (redirects to /signup)
  - Footer with Terms/Privacy links
```

**Key Features:**
- No logo - just text branding
- Left-aligned title, text-5xl, bold
- Form backdrop blur effect
- Animated background elements (subtle gradient orbs)
- Form has semi-transparent background: bg-card/50 backdrop-blur-xl

### Signup Page (/signup/page.tsx)
```
Layout: Same as login page
Components:
  - Full name input
  - Email input
  - Password input with Show/Hide toggle
  - Confirm password input with Show/Hide toggle
  - Password strength indicator (8+ chars)
  - Create account button
  - Sign in link
  - Error message display
```

### Content Page (/content/page.tsx)
```
Layout: Sidebar + Main Content
Sidebar:
  - Thoughtsy branding (text-2xl bold)
  - Navigation buttons: Content, Roadmaps, To-do Lists
  - Footer copyright

Main Content:
  - Header: "Content" title + description
  - Buttons: Share Brain (secondary), New Thought (primary)
  - Grid of thought cards (1 col mobile, 2 md, 3 lg)
  - Modal for creating/editing thoughts

Thought Card:
  - Full color background (YouTube/Reddit/Twitter color)
  - White text for contrast
  - Badge with type (YouTube/Reddit/Twitter)
  - Title (truncated with ellipsis)
  - Description (wraps with break-words)
  - Links list (breaks on long URLs)
  - Action buttons: Visit, Edit, Delete
  - Dynamic height based on description length
```

**Modal Form:**
- Title input
- Link Type selector (YouTube/Reddit/Twitter)
- Links input (textarea, one per line)
- Description/Thoughts (textarea)
- Cancel & Save/Update buttons

### Roadmap Page (/roadmap/page.tsx)
```
Layout: Sidebar + Main Content (same structure)
Main Content:
  - Header: "Roadmaps" title + description
  - Buttons: Share Brain, Create
  - Empty state placeholder
```

---

## 4. STATE MANAGEMENT PATTERN

### Content Page State
```typescript
interface Thought {
  id: string
  title: string
  description: string
  links: string[]
  type: 'youtube' | 'reddit' | 'twitter'
  createdAt: Date
}

// State hooks
const [thoughts, setThoughts] = useState<Thought[]>([])
const [isModalOpen, setIsModalOpen] = useState(false)
const [editingId, setEditingId] = useState<string | null>(null)
const [formData, setFormData] = useState({
  title: ''
  description: ''
  links: ''
  type: 'youtube'
})
```

### Form Actions
- **Add Thought**: Parse links by newline, create Thought object, add to array
- **Edit Thought**: Update existing thought by ID
- **Delete Thought**: Remove thought by ID from array
- **Modal Control**: Open/close modal, reset form on close

---

## 5. COLOR MAPPING FOR CARDS

```typescript
const linkTypeColors = {
  youtube: 'hsl(var(--youtube))',    // #C64D47 (rusty red)
  reddit: 'hsl(var(--reddit))',      // #D97937 (rusty orange)
  twitter: 'hsl(var(--twitter))',    // #5B8FB8 (earthy blue)
}

// Card background uses full color (no translucency)
// Text on cards is white: text-white, text-white/90, text-white/80
// Overlay on buttons: bg-white/20 hover:bg-white/30
```

---

## 6. ROUTING STRUCTURE

```
/                    → Login page
/signup              → Signup page
/content             → Content page (main dashboard)
/roadmap             → Roadmap page
/todo                → To-do page (to be built)
```

**Navigation Pattern:**
- Uses Next.js `useRouter` for client-side routing
- Button clicks: `router.push('/path')`
- Window navigation: `window.location.href = '/path'`

---

## 7. KEY INTERACTIONS

### Button States
- **Primary**: bg-primary hover:bg-primary/80
- **Secondary**: bg-secondary hover:bg-secondary/80
- **Destructive**: bg-destructive/10 border border-destructive/30
- **Ghost/Outline**: border border-border hover:bg-secondary/20

### Input Focus States
- Border focus: focus:border-accent/50
- Background: bg-input/50
- Placeholder: placeholder:text-muted-foreground/50

### Modal Overlay
- Dialog with semi-transparent background
- Centered on screen
- Backdrop blur effect

### Modals/Dialogs
- Dark background with border
- Modal stays in login/signup font (Geist)
- All other pages use Sora font

---

## 8. RESPONSIVE BREAKPOINTS

- **Mobile**: 1 column cards
- **Tablet (md)**: 2 column cards  
- **Desktop (lg)**: 3 column cards
- Sidebar always visible (not collapsible in current design)

---

## 9. TYPOGRAPHY HIERARCHY

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| Page Title | text-4xl | font-bold | Content/Roadmap headers |
| Branding Title | text-5xl | font-bold | Login/Signup pages |
| Card Title | text-lg | font-bold | Thought cards |
| Form Label | text-base | font-bold | Form fields |
| Body Text | text-sm | normal | Descriptions, placeholder text |
| Badge | text-xs | font-semibold | Type badges on cards |
| Small Text | text-xs | normal | Footer, hints |

---

## 10. CONVERSION NOTES FOR REACT

### Remove Next.js Specifics
- Remove `'use client'` directives
- Replace `useRouter` from 'next/navigation' with React Router or similar
- Replace `window.location.href` with router.push()

### Component Library
- You'll need to implement UI components (Button, Input, etc.) or use a library like:
  - Radix UI
  - Material-UI
  - Headless UI
  - Or create custom components matching the Tailwind styles

### State Management
- Can use simple `useState` for current design
- For scalability, consider Context API or Zustand

### CSS Framework
- Keep Tailwind CSS for styling
- Use the same color token system via CSS variables
- Same layout patterns (flexbox for main layouts)

### Key Imports to Replace
```typescript
// Next.js specific
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// React alternative
import { useNavigate } from 'react-router-dom'  // if using React Router
// Or implement custom components
```

---

## 11. ASSET REQUIREMENTS

- **Fonts**: Import Sora from Google Fonts
- **Icons**: lucide-react library
- **No images** currently needed (using emoji for empty states)

---

## 12. FORM VALIDATION

### Login
- Email required, valid format
- Password required, minimum 6 chars (for demo)

### Signup
- Name required
- Email required, valid format
- Password required, minimum 8 chars
- Passwords must match
- Show validation errors in red

### Content Modal
- Title required
- Links required (at least one)
- Description required
- Parse multiple links by newline separator

---

## Quick Build Checklist for Antigravity

✓ Set up Tailwind CSS with custom color variables
✓ Create Button, Input, Textarea, Dialog components
✓ Implement routing structure
✓ Build auth pages (Login/Signup)
✓ Build dashboard (Content + Sidebar)
✓ Implement modal for thought creation
✓ Style cards with link type colors
✓ Add form validation
✓ Connect navigation between pages
✓ Test responsive behavior

---

Generated for Thoughtsy React Migration
