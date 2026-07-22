# Treasure Data Default Theme

The skill includes a pre-built **Treasure Data default theme** (`td-default`) used for all dashboards unless the customer specifies custom brand colors in Phase 1 Step 1c.

---

## Color Palette Overview

| Color | Hex | Purpose | Usage |
|-------|-----|---------|-------|
| **Primary (Blue)** | `#3b82f6` | Main brand color, headers, primary CTAs | Headers, active states, primary buttons, KPI highlights |
| **Success (Green)** | `#10b981` | Positive outcomes, growth | Positive trends, approval badges, good metrics |
| **Warning (Amber)** | `#f59e0b` | Caution, attention needed | Alerts, thresholds near limits, pending states |
| **Danger (Red)** | `#ef4444` | Errors, critical issues | Errors, critical alerts, negative trends |
| **Purple** | `#8b5cf6` | Secondary accent, alternative highlights | Secondary KPI cards, alternate palette series |
| **Gray-50** | `#f9fafb` | Lightest background | Page background, light card backgrounds |
| **Gray-100** | `#f3f4f6` | Light background | Section backgrounds, hover states |
| **Gray-200** | `#e5e7eb` | Borders, dividers | Lines, separators, subtle borders |
| **Gray-600** | `#4b5563` | Secondary text | Labels, subtitles, helper text |
| **Gray-900** | `#111827` | Primary text | Body text, headings, main content |

---

## CSS Theme Variables

All HTML Client templates use CSS variables (`:root`) for consistent theming. Apply these directly to the dashboard HTML in Phase 3.

```css
:root {
  --primary: #3b82f6;        /* Treasure Data blue — headers, primary buttons, KPI accents */
  --success: #10b981;        /* Green — positive indicators, success states */
  --warning: #f59e0b;        /* Amber — alerts, caution indicators */
  --danger: #ef4444;         /* Red — errors, critical states */
  --purple: #8b5cf6;         /* Purple — secondary accent, alternate KPI cards */
  --gray-50: #f9fafb;        /* Lightest gray — background, page background */
  --gray-100: #f3f4f6;       /* Light gray — card backgrounds, subtly highlighted areas */
  --gray-200: #e5e7eb;       /* Medium-light gray — borders, dividers */
  --gray-600: #4b5563;       /* Medium gray — secondary text, labels, subtitles */
  --gray-900: #111827;       /* Darkest gray — primary text, headings */
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--gray-50);
  color: var(--gray-900);
  line-height: 1.6;
}
```

---

## Chart Palette (TD Color Series)

For Chart.js visualizations, use the Treasure Data color series to maintain visual consistency:

```javascript
const TD_CHART_PALETTE = [
  "#B4E3E3",  // Teal
  "#ABB3DB",  // Lavender
  "#D9BFDF",  // Lilac
  "#F8E1B0",  // Peach
  "#8FD6D4",  // Mint
  "#828DCA",  // Slate blue
  "#C69ED0",  // Rose
  "#F5D389",  // Golden
  "#6AC8C6",  // Cyan
  "#5867B8"   // Periwinkle
];
```

**Use this palette for:**
- Line chart series
- Bar chart colors
- Pie/donut chart slices
- Area chart fills

---

## Component Styling with TD Theme

### KPI Cards

```css
.kpi-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border-left: 4px solid var(--primary);
}

.kpi-card.success { border-left-color: var(--success); }
.kpi-card.warning { border-left-color: var(--warning); }
.kpi-card.danger { border-left-color: var(--danger); }
.kpi-card.purple { border-left-color: var(--purple); }

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);  /* Use semantic color or custom brand color */
}

.kpi-label {
  font-size: 0.875rem;
  color: var(--gray-600);
  font-weight: 500;
}
```

### Buttons

```css
.btn-primary {
  background: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-900);
  border: 1px solid var(--gray-200);
}
```

### Tables & Data

```css
table thead {
  background: var(--gray-100);
  color: var(--gray-900);
  font-weight: 600;
}

table tbody tr:hover {
  background: var(--gray-50);
}

table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--gray-200);
}

.table-striped tbody tr:nth-child(even) {
  background: var(--gray-50);
}
```

### Headers & Titles

```css
h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--gray-600);
  font-size: 1rem;
}

.section-header {
  border-bottom: 2px solid var(--primary);
  padding-bottom: 0.75rem;
  margin-bottom: 1.5rem;
}
```

### Badges & Status

```css
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.badge-success { background: rgba(16, 185, 129, 0.1); color: var(--success); }
.badge-warning { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
.badge-danger { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
.badge-info { background: rgba(59, 130, 246, 0.1); color: var(--primary); }
```

---

## Custom Brand Color Override

If a customer specifies custom brand colors in Phase 1 Step 1c, override the CSS variables:

**From `state.md` (Phase 1):**
```yaml
dashboard_theme:
  primary_color: "#e74c3c"
  secondary_color: "#3498db"
  logo_url: "https://example.com/logo.png"
  logo_background: "white"
```

**In Phase 3 Template (override `:root`):**
```html
<style>
  :root {
    --primary: #e74c3c;        /* Custom brand primary */
    --purple: #3498db;         /* Custom brand secondary */
    /* Keep all other grays unchanged */
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    /* ... etc */
  }

  header {
    background: var(--gray-50);
    border-bottom: 2px solid var(--primary);
  }

  .logo {
    max-width: 150px;
    background: var(--logo-background);  /* or 'white' for white background */
  }
</style>

<header>
  <img src="..." alt="Brand Logo" class="logo">
  <h1>Dashboard Title</h1>
</header>
```

---

## Extended Color Palette (Tints & Shades)

For hover states, disabled states, and backgrounds, use lighter or darker variants:

### Blue Series (Primary)
```css
--blue-50: #eff6ff;    /* Lightest — backgrounds, light highlights */
--blue-100: #dbeafe;   /* Very light — hover backgrounds */
--blue-400: #60a5fa;   /* Light — secondary buttons, hover states */
--blue-500: #3b82f6;   /* Primary — use as --primary */
--blue-600: #2563eb;   /* Dark — hover on primary button */
--blue-700: #1d4ed8;   /* Darker — active/pressed state */
--blue-900: #1e3a8a;   /* Darkest — text on light backgrounds */
```

### Green Series (Success)
```css
--green-50: #f0fdf4;   /* Lightest — success backgrounds */
--green-100: #dcfce7;  /* Very light — success alerts */
--green-500: #10b981;  /* Standard — use as --success */
--green-600: #059669;  /* Dark — hover on success button */
--green-900: #064e3b;  /* Darkest — text variant */
```

### Amber Series (Warning)
```css
--amber-50: #fffbeb;   /* Lightest — warning backgrounds */
--amber-100: #fef3c7;  /* Very light — warning alerts */
--amber-500: #f59e0b;  /* Standard — use as --warning */
--amber-600: #d97706;  /* Dark — hover on warning button */
--amber-900: #78350f;  /* Darkest — text variant */
```

### Red Series (Danger)
```css
--red-50: #fef2f2;     /* Lightest — error backgrounds */
--red-100: #fee2e2;    /* Very light — error alerts */
--red-500: #ef4444;    /* Standard — use as --danger */
--red-600: #dc2626;    /* Dark — hover on danger button */
--red-900: #7f1d1d;    /* Darkest — text variant */
```

### Grayscale Series
```css
--gray-50: #f9fafb;    /* Lightest — page background */
--gray-100: #f3f4f6;   /* Very light — card/section background */
--gray-200: #e5e7eb;   /* Light — borders, dividers */
--gray-300: #d1d5db;   /* Medium light — disabled states */
--gray-400: #9ca3af;   /* Medium — placeholder text */
--gray-500: #6b7280;   /* Medium — secondary text */
--gray-600: #4b5563;   /* Dark — labels, subtitles */
--gray-700: #374151;   /* Darker — primary text (alt) */
--gray-900: #111827;   /* Darkest — primary text */
```

---

## Color Combinations & Accessibility

### Text on Colors (WCAG AA Compliant)

| Background | Good Text Color | Why |
|-----------|-----------------|-----|
| White / `--gray-50` | `--gray-900` (dark text) | 18:1 contrast ratio |
| `--gray-100` | `--gray-900` (dark text) | 15:1 contrast ratio |
| `--blue-500` | White text | 4.5:1 contrast ratio |
| `--green-500` | White text | 6.5:1 contrast ratio |
| `--amber-500` | `--gray-900` (dark text) | 5:1 contrast ratio |
| `--red-500` | White text | 4.5:1 contrast ratio |

**Rule:** Always check contrast ratios when using custom brand colors. Text on colored backgrounds should have minimum 4.5:1 ratio for normal text, 3:1 for large text (18pt+).

---

## Semantic Color Usage

**Use semantic colors consistently across all dashboards:**

```css
/* Status indicators */
.status-active { color: var(--success); }     /* ✓ Active, running, healthy */
.status-warning { color: var(--warning); }    /* ⚠ At-risk, degraded */
.status-error { color: var(--danger); }       /* ✗ Failed, critical, error */
.status-info { color: var(--primary); }       /* ℹ Informational, neutral */

/* Trend indicators */
.trend-up { color: var(--success); }          /* Revenue up, metric growing */
.trend-down { color: var(--danger); }         /* Revenue down, metric declining */
.trend-flat { color: var(--gray-600); }       /* No change */

/* Badges & tags */
.badge-success { background: rgba(16, 185, 129, 0.1); color: var(--success); }
.badge-warning { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
.badge-error { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
.badge-info { background: rgba(59, 130, 246, 0.1); color: var(--primary); }

/* Alerts */
.alert-success { background: var(--green-50); border-left: 4px solid var(--success); }
.alert-warning { background: var(--amber-50); border-left: 4px solid var(--warning); }
.alert-error { background: var(--red-50); border-left: 4px solid var(--danger); }
```

---

## Chart Color Series (Detailed)

For multi-series charts, use colors in this order to ensure visual distinctness:

```javascript
// Primary chart palette (10 colors)
const TD_CHART_PALETTE = [
  "#B4E3E3",  // 1. Teal — cool, calming
  "#ABB3DB",  // 2. Lavender — purple-ish, distinct
  "#D9BFDF",  // 3. Lilac — lighter purple
  "#F8E1B0",  // 4. Peach — warm accent
  "#8FD6D4",  // 5. Mint — green-teal
  "#828DCA",  // 6. Slate blue — deeper blue
  "#C69ED0",  // 7. Rose — soft pink
  "#F5D389",  // 8. Golden — warm yellow
  "#6AC8C6",  // 9. Cyan — bright blue-green
  "#5867B8"   // 10. Periwinkle — deep purple-blue
];

// When you need more than 10 series, repeat but adjust opacity:
// Series 11–20: Same colors but with opacity 0.7
// Series 21+: Reduce opacity further or use grayscale
```

---

## Dark Mode Consideration

If customers request a dark mode variant in Phase 1 Step 1c, apply these inversions:

```css
/* Dark mode overrides */
body.dark-mode {
  --gray-50: #111827;       /* Dark background */
  --gray-900: #f9fafb;      /* Light text */
  --gray-600: #d1d5db;      /* Light secondary text */
  background: var(--gray-50);
  color: var(--gray-900);
}

body.dark-mode .kpi-card {
  background: #1f2937;      /* Dark card */
  border-color: var(--primary);
}

/* Colors remain the same — semantic colors work on dark */
```

---

## Typography

**Font Stack:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Scales:**
- **Headings (h1):** 2rem, font-weight 700
- **Section headers (h2):** 1.5rem, font-weight 700
- **Subheadings (h3):** 1.125rem, font-weight 600
- **Body text:** 1rem, font-weight 400, line-height 1.6
- **Small text (labels):** 0.875rem, font-weight 500
- **Tiny text (captions):** 0.8125rem, font-weight 400

---

## Responsive Breakpoints

```css
/* Mobile-first approach */
@media (max-width: 640px) {
  .kpi-grid {
    grid-template-columns: 1fr;  /* 1 column on mobile */
  }
}

@media (min-width: 768px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);  /* 2 columns on tablet */
  }
}

@media (min-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(3, 1fr);  /* 3+ columns on desktop */
  }
}
```

---

## Shadow & Depth

```css
/* Subtle shadow — cards, lifted elements */
box-shadow: 0 1px 3px rgba(0,0,0,0.1);

/* Medium shadow — hover state */
box-shadow: 0 4px 6px rgba(0,0,0,0.1);

/* Strong shadow — modals, overlays */
box-shadow: 0 20px 25px rgba(0,0,0,0.15);
```

---

## Spacing Scale

Consistent spacing using 0.25rem (4px) units:
- `0.25rem` (4px) — very tight spacing
- `0.5rem` (8px) — tight spacing
- `0.75rem` (12px) — default spacing
- `1rem` (16px) — loose spacing
- `1.5rem` (24px) — section spacing
- `2rem` (32px) — major section spacing

---

## When to Use

| Scenario | Theme | Reference |
|----------|-------|-----------|
| Customer provided custom brand colors in Phase 1 Step 1c | Override CSS `:root` with custom colors | `state.md` → `dashboard_theme` |
| Customer chose "Treasure Data theme" or no preference | Use default TD theme (`td-default`) as-is | This document (no override needed) |
| Chart series colors | Always use TD Chart Palette array | `TD_CHART_PALETTE` above |
| Semantic colors (success/warning/error) | Use `--success`, `--warning`, `--danger` | CSS variables section |

---

## Implementation in Phase 3

**Step A:** Check `state.md` for custom brand colors:
```bash
grep -A 5 "dashboard_theme:" state.md
```

**Step B:** If custom colors exist:
1. Extract `primary_color`, `secondary_color`, `logo_url`, `logo_background`
2. Override CSS `:root` in template `<style>` block
3. Apply logo to header

**Step C:** If no custom colors (or theme = `td-default`):
1. Use template as-is — TD theme already applied
2. No CSS overrides needed

---

**Version:** 1.0.0  
**Last Updated:** 22 July 2026  
**Author:** FDE Team
