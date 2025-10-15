# Hero Banner Slideshow

## Overview

The homepage hero section features an auto-rotating slideshow with smooth crossfade transitions between banner images.

## Current Setup

### Banner Images
Located in `/public/images/banners/`:
1. `hero-banner-1.webp` (588 KB)
2. `hero-banner-2.webp` (259 KB)
3. `hero-banner-3.jpg` (396 KB)
4. `hero-banner-4.jpg` (318 KB)
5. `hero-banner-5.jpg` (383 KB)

**Total**: 5 images rotating in the slideshow

### Slideshow Features
- ✅ **Auto-rotation**: Changes every 5 seconds
- ✅ **Smooth transitions**: 1-second crossfade effect
- ✅ **Dot indicators**: Shows current slide position
- ✅ **Manual navigation**: Click dots to jump to specific slide
- ✅ **Optimized loading**: First image prioritized for performance
- ✅ **Responsive overlay**: Dark gradient ensures text readability

## Implementation Details

### Timing
```typescript
setInterval(() => {
  setCurrentBanner((prev) => (prev + 1) % BANNER_IMAGES.length);
}, 5000); // 5 seconds per slide
```

### Transition Effect
```tsx
className={`absolute inset-0 transition-opacity duration-1000 ${
  index === currentBanner ? 'opacity-100' : 'opacity-0'
}`}
```

### Text Styling
All hero text uses white color with drop shadows for readability:
- **Heading**: `text-white drop-shadow-lg`
- **Description**: `text-white/90 drop-shadow-md`
- **Stats**: `text-white drop-shadow-lg`

### Gradient Overlay
```tsx
<div className="absolute inset-0 bg-gradient-to-b from-neutral-900/40 via-neutral-900/20 to-neutral-50" />
```
- Top: 40% dark overlay
- Middle: 20% dark overlay
- Bottom: Fades to page background

## How to Add More Slides

### Step 1: Add Image to Folder
Place your image in `/public/images/banners/`

### Step 2: Update the Array
Edit `src/app/page.tsx`:

```typescript
const BANNER_IMAGES = [
  "/images/banners/hero-banner-1.webp",
  "/images/banners/hero-banner-2.webp",
  "/images/banners/hero-banner-3.jpg",
  "/images/banners/hero-banner-4.jpg",
  "/images/banners/hero-banner-5.jpg",
  "/images/banners/your-new-banner.webp"  // ← Add here
];
```

### Step 3: Test
The slideshow will automatically include the new image in rotation.

## Customization Options

### Change Rotation Speed
```typescript
// Faster (3 seconds)
setInterval(() => { ... }, 3000);

// Slower (8 seconds)
setInterval(() => { ... }, 8000);
```

### Change Transition Speed
```tsx
// Faster fade (500ms)
className="transition-opacity duration-500"

// Slower fade (2000ms)
className="transition-opacity duration-2000"
```

### Pause on Hover
Add this to the section element:
```tsx
const [isPaused, setIsPaused] = useState(false);

useEffect(() => {
  if (isPaused) return;
  const interval = setInterval(() => { ... }, 5000);
  return () => clearInterval(interval);
}, [isPaused]);

<section 
  onMouseEnter={() => setIsPaused(true)}
  onMouseLeave={() => setIsPaused(false)}
>
```

### Add Navigation Arrows
```tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

// Add to hero section
<button 
  onClick={() => setCurrentBanner((prev) => 
    prev === 0 ? BANNER_IMAGES.length - 1 : prev - 1
  )}
  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 rounded-full p-3 backdrop-blur-sm"
>
  <ChevronLeft className="h-6 w-6 text-white" />
</button>

<button 
  onClick={() => setCurrentBanner((prev) => 
    (prev + 1) % BANNER_IMAGES.length
  )}
  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 rounded-full p-3 backdrop-blur-sm"
>
  <ChevronRight className="h-6 w-6 text-white" />
</button>
```

### Slide Animation Variants

#### Slide Effect
```tsx
className={`absolute inset-0 transition-transform duration-1000 ${
  index === currentBanner 
    ? 'translate-x-0' 
    : index < currentBanner 
      ? '-translate-x-full' 
      : 'translate-x-full'
}`}
```

#### Zoom Effect
```tsx
className={`absolute inset-0 transition-all duration-1000 ${
  index === currentBanner 
    ? 'scale-100 opacity-100' 
    : 'scale-110 opacity-0'
}`}
```

## Image Specifications

### Recommended Dimensions
- **Width**: 1920px minimum (2560px for 4K displays)
- **Height**: 600-800px
- **Aspect Ratio**: 16:9 or 21:9 (wider preferred)

### File Format
- **WebP**: Best compression (current setup)
- **JPG**: Good alternative
- **PNG**: If transparency needed

### File Size
- Target: < 300KB per image
- Maximum: 500KB per image
- Use compression tools: TinyPNG, Squoosh

### Optimization Tips
1. Convert to WebP format
2. Use 80-90% quality setting
3. Resize to exact dimensions needed
4. Use lazy loading for slides 2+

## Accessibility

### Current Implementation
```tsx
<button
  aria-label={`Go to slide ${index + 1}`}
  className="..."
>
```

### Screen Reader Support
Add to slideshow container:
```tsx
<div 
  role="region" 
  aria-label="Hero banner slideshow"
  aria-live="polite"
>
```

## Performance

### Optimization Strategy
1. First image loads with `priority` flag
2. Other images load normally (lazy)
3. WebP format reduces file size 30-50%
4. `quality={90}` balances visual quality and size

### Loading States
All images pre-load to prevent flashing during transitions.

## Troubleshooting

### Images Not Showing
1. Check file path is correct
2. Verify files exist in `/public/images/banners/`
3. Check file names match exactly (case-sensitive)
4. Clear browser cache

### Slow Transitions
1. Optimize image file sizes
2. Check internet connection
3. Use WebP format
4. Reduce image dimensions

### Slideshow Not Auto-Rotating
1. Check browser console for errors
2. Verify `useEffect` is running
3. Check interval is clearing properly

---

**Current Status**: ✅ Active with 5 banner images  
**Auto-rotation**: Every 5 seconds  
**Transition**: 1-second crossfade  
**Last Updated**: October 15, 2025
