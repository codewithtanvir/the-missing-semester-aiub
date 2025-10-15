# Banner Images

Place your banner images in this folder.

Recommended specifications:
- **Hero Banner**: 1920x600px or larger
- **Format**: JPG, PNG, or WebP
- **File names**: 
  - `hero-banner.jpg` - Main homepage hero background
  - `hero-banner-dark.jpg` - Dark mode variant (optional)
  - `course-banner.jpg` - Courses page banner (optional)

Example usage:
```tsx
<Image 
  src="/images/banners/hero-banner.jpg" 
  alt="Hero Banner"
  fill
  className="object-cover"
  priority
/>
```
