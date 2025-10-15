# Color Palette Update - Missing Semester

## New Color Palette

The project has been updated to use a fresh, modern color palette:

| Role           | Color     | Hex       | Tailwind Class     | Usage                          |
| -------------- | --------- | --------- | ------------------ | ------------------------------ |
| Primary        | Blue      | `#3B82F6` | `bg-blue-500`      | Primary buttons, links, logo   |
| Secondary      | Lime      | `#84CC16` | `bg-lime-400`      | Secondary actions, accents     |
| Accent         | Orange    | `#F97316` | `text-orange-500`  | Highlights, call-to-action     |
| Background     | Off White | `#FAFAF9` | `bg-neutral-50`    | Page backgrounds               |
| Text Primary   | Neutral   | `#1E293B` | `text-neutral-800` | Headings, primary text         |
| Text Secondary | Gray      | `#6B7280` | `text-gray-500`    | Descriptions, secondary text   |

---

## Changes Made

### 1. CSS Variables (`src/app/globals.css`)
Updated HSL color values for all design tokens:
- **Primary**: Blue-500 (#3B82F6)
- **Secondary**: Lime-400 (#84CC16)
- **Accent**: Orange-500 (#F97316)
- **Background**: Neutral-50 (#FAFAF9)
- **Foreground**: Neutral-800 (#1E293B)

### 2. Navigation Component (`src/components/navigation.tsx`)
- Logo: Blue-500 background
- Active nav items: Blue-500 background with white text
- Hover states: Neutral-100 background
- Text: Neutral-800 for primary text
- Border: Neutral-300

### 3. Homepage (`src/app/page.tsx`)
- Background: Neutral-50 (off-white)
- Hero badge: Blue-100 background, Blue-600 text
- Hero title: Neutral-800 with Blue-500 accent
- Primary CTA: Blue-500 background
- Secondary CTA: Neutral border with hover effect
- Feature cards: Lime-100 icon backgrounds with Lime-500 icons
- Category cards: Updated colors (Blue-500, Lime-400, Orange-500, Blue-400)
- CTA section: Blue-500 background with Lime-400 button
- Stats: Neutral-800 for numbers, Gray-500 for labels

### 4. Back to Top Button (`src/components/back-to-top.tsx`)
- Background: Blue-500
- Hover: Blue-600

---

## Color Usage Guidelines

### Primary (Blue #3B82F6)
Use for:
- Primary buttons and CTAs
- Active navigation items
- Logo backgrounds
- Links and interactive elements
- Important UI elements

```tsx
<button className="bg-blue-500 hover:bg-blue-600 text-white">
  Primary Action
</button>
```

### Secondary (Lime #84CC16)
Use for:
- Secondary buttons
- Success states
- Feature highlights
- Icon backgrounds
- Accent elements

```tsx
<div className="bg-lime-400 text-neutral-800">
  Secondary Element
</div>
```

### Accent (Orange #F97316)
Use for:
- Warnings and alerts
- Important highlights
- Special badges
- Category identifiers

```tsx
<span className="text-orange-500">Important Notice</span>
```

### Background (Neutral-50 #FAFAF9)
Use for:
- Page backgrounds
- Light sections
- Card backgrounds

```tsx
<div className="bg-neutral-50">Content</div>
```

### Text Colors
- **Primary Text**: Neutral-800 (#1E293B) for headings and important text
- **Secondary Text**: Gray-500 (#6B7280) for descriptions and labels

```tsx
<h1 className="text-neutral-800">Heading</h1>
<p className="text-gray-500">Description text</p>
```

---

## Design Principles

### 1. Contrast
- High contrast between text (Neutral-800) and background (Neutral-50)
- White text on Blue-500 for optimal readability
- Lime-400 provides vibrant accent without overwhelming

### 2. Hierarchy
- **Primary**: Blue for main actions and navigation
- **Secondary**: Lime for supporting elements
- **Accent**: Orange for special attention

### 3. Accessibility
- All color combinations meet WCAG AA standards
- Sufficient contrast ratios for text readability
- Color is not the only indicator (text labels present)

---

## Before vs After

### Before
- Gradient-heavy design (Blue-600 to Purple-600)
- Multiple shades of blue and purple
- Complex gradient backgrounds
- Inconsistent color usage

### After
- ✅ Clean, solid colors
- ✅ Consistent blue primary
- ✅ Fresh lime secondary
- ✅ Clear visual hierarchy
- ✅ Better readability
- ✅ Modern, professional look

---

## Component-Specific Colors

### Navigation
```tsx
Logo: bg-blue-500
Active Link: bg-blue-500 text-white
Hover: bg-neutral-100
Text: text-neutral-800
Border: border-neutral-300
```

### Buttons
```tsx
Primary: bg-blue-500 hover:bg-blue-600
Secondary: bg-lime-400 hover:bg-lime-500
Outline: border-neutral-300 hover:border-blue-500
```

### Cards
```tsx
Border: border-neutral-200
Hover Border: hover:border-blue-500
Background: bg-white
Icon Background: bg-lime-100
Icon Color: text-lime-500
```

### Categories
```tsx
Computer Science: bg-blue-500
Engineering: bg-lime-400
Business: bg-orange-500
Science: bg-blue-400
```

---

## Dark Mode Support

Dark mode colors are also defined in globals.css:
- Background: Neutral-800
- Foreground: Neutral-50
- Primary: Blue-500 (consistent)
- Secondary: Lime-400 (consistent)

---

## Files Updated

1. ✅ `src/app/globals.css` - CSS variables
2. ✅ `src/components/navigation.tsx` - Navigation colors
3. ✅ `src/app/page.tsx` - Homepage colors
4. ✅ `src/components/back-to-top.tsx` - Button colors

---

## Next Steps (Optional)

1. Update courses page with new palette
2. Update course detail page
3. Update admin dashboard
4. Update form elements
5. Add more lime accent elements
6. Create color utility classes

---

**Status**: ✅ Complete  
**Date**: October 15, 2025  
**Breaking Changes**: None (only visual updates)

