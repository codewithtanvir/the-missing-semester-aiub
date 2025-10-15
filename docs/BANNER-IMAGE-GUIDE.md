# Banner Image Guide

## Current Setup

The homepage hero section now uses a background banner image located at:
```
/public/images/banners/hero-banner.svg
```

## How to Add Your Own Banner

### Option 1: Replace the SVG
Simply replace `hero-banner.svg` with your own image file. Recommended formats:
- **JPG**: For photos (smaller file size)
- **PNG**: For graphics with transparency
- **WebP**: Modern format (best compression)
- **SVG**: Vector graphics (scalable)

### Option 2: Add a New Banner
1. Place your banner image in `/public/images/banners/`
2. Update the Image component in `src/app/page.tsx`:

```tsx
<Image 
  src="/images/banners/your-banner-name.jpg" 
  alt="Hero Background"
  fill
  className="object-cover"
  priority
/>
```

## Recommended Specifications

### Desktop Banner
- **Resolution**: 1920x600px minimum
- **Aspect Ratio**: 16:5 or wider
- **File Size**: < 500KB (optimized)
- **Format**: WebP or JPG

### Mobile Banner (Optional)
- **Resolution**: 768x400px
- Create a separate mobile version for better performance

### Design Tips
1. **Keep text area clear**: Center 800px should have minimal details
2. **Use subtle patterns**: Avoid busy backgrounds that compete with text
3. **Optimize contrast**: Ensure text remains readable
4. **Brand colors**: Use your color palette (Blue, Lime, Orange)

## Using Different Banners for Different Pages

### Courses Page Banner
```tsx
// In src/app/courses/page.tsx
<Image 
  src="/images/banners/courses-banner.jpg" 
  alt="Courses Background"
  fill
  className="object-cover"
/>
```

### Course Detail Banner
```tsx
// In src/app/course/[id]/page.tsx
<Image 
  src="/images/banners/course-detail-banner.jpg" 
  alt="Course Background"
  fill
  className="object-cover"
/>
```

## Current Banner Features

The default SVG banner includes:
- Gradient background (Blue → Neutral → Lime)
- Subtle grid pattern
- Decorative circles in brand colors
- Academic-themed shapes (books, graduation cap)
- Bottom wave element

## Customization Examples

### Add Gradient Overlay
```tsx
<div className="absolute inset-0 -z-10">
  <Image src="/images/banners/hero-banner.jpg" alt="Hero" fill />
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-lime-400/20" />
</div>
```

### Parallax Effect
```tsx
<motion.div 
  className="absolute inset-0 -z-10"
  style={{ y: scrollY }}
>
  <Image src="/images/banners/hero-banner.jpg" alt="Hero" fill />
</motion.div>
```

### Dark Mode Support
```tsx
<Image 
  src="/images/banners/hero-banner-light.jpg" 
  alt="Hero"
  fill
  className="object-cover dark:hidden"
/>
<Image 
  src="/images/banners/hero-banner-dark.jpg" 
  alt="Hero"
  fill
  className="object-cover hidden dark:block"
/>
```

## Image Optimization

Next.js automatically optimizes images when using the `Image` component:
- ✅ Lazy loading (except when `priority` is set)
- ✅ Responsive sizing
- ✅ Format conversion (WebP when supported)
- ✅ Blur placeholder

### For Hero Images
Always use `priority` to load immediately:
```tsx
<Image 
  src="/images/banners/hero-banner.jpg" 
  alt="Hero Background"
  fill
  className="object-cover"
  priority  // ← Prevents lazy loading
/>
```

## Free Banner Resources

Places to find free banner images:
1. **Unsplash**: unsplash.com (free high-res photos)
2. **Pexels**: pexels.com (free stock photos)
3. **Pixabay**: pixabay.com (free images)
4. **SVGBackgrounds**: svgbackgrounds.com (SVG patterns)

Search terms:
- "education gradient"
- "learning abstract"
- "academic background"
- "minimalist pattern"

---

**Current Banner**: Custom SVG with brand colors  
**Location**: `/public/images/banners/hero-banner.svg`  
**Status**: ✅ Active
