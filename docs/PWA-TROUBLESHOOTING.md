# PWA Troubleshooting Guide

## ✅ Fixed Issues

### Missing Icons (RESOLVED)
**Problem:** PWA icons were referenced in manifest.json but files didn't exist
- `icon-192x192.png` ❌
- `icon-256x256.png` ❌
- `icon-384x384.png` ❌
- `icon-512x512.png` ❌
- `apple-touch-icon.png` ❌

**Solution:** Generated all required icons from `icon.svg` using sharp library
```bash
npm install --save-dev sharp
node scripts/generate-icons.js
```

All icons now created ✅

---

## How to Test PWA Installation

### On Desktop (Chrome/Edge)

1. **Visit your site:** https://aiubfiles.app
2. **Open DevTools:** F12 or Right-click > Inspect
3. **Go to Application tab** > Manifest
4. **Check for errors:**
   - ✅ Manifest should be valid
   - ✅ All icons should be found
   - ✅ Service worker should be registered

5. **Install PWA:**
   - Look for install icon in address bar (⊕ or install button)
   - Click "Install Missing Semester"
   - App should open in standalone window

### On Mobile (Android)

1. **Visit:** https://aiubfiles.app in Chrome
2. **Wait for install banner** (may take a few seconds)
3. **Tap "Add to Home Screen"** when prompted
4. **Or manually:** Menu (⋮) > "Add to Home screen"
5. **App icon** should appear on home screen

### On iOS (iPhone/iPad)

1. **Visit:** https://aiubfiles.app in Safari
2. **Tap Share button** (box with arrow)
3. **Scroll down** and tap "Add to Home Screen"
4. **Tap "Add"** in top right
5. **App icon** should appear on home screen

---

## Common PWA Issues & Fixes

### Issue 1: "Add to Home Screen" doesn't appear

**Causes:**
- Service worker not registered
- Manifest issues
- Not served over HTTPS
- Icons missing or wrong size

**Fix:**
1. Check DevTools > Application > Manifest
2. Verify all icons exist in `/public`
3. Ensure site is on HTTPS (Vercel provides this)
4. Clear cache and reload

### Issue 2: Service Worker not updating

**Fix:**
```bash
# Development
# Service worker is disabled in dev mode by default (see next.config.js)

# Production
# Force update by incrementing version in manifest.json
# Or clear site data in DevTools > Application > Clear storage
```

### Issue 3: PWA won't install on iOS

**Common causes:**
- iOS requires apple-touch-icon.png (✅ now present)
- Must use Safari browser (Chrome/Firefox won't show install option)
- Need proper apple-mobile-web-app-capable meta tag (✅ configured in layout.tsx)

**Verify:**
```tsx
// Check src/app/layout.tsx for:
appleWebApp: {
  capable: true,
  statusBarStyle: "default",
  title: "Missing Semester",
}
```

### Issue 4: Icons look pixelated

**Fix:**
Regenerate icons with higher quality:
```bash
node scripts/generate-icons.js
```

Or use online tool for more control:
1. Visit: https://realfavicongenerator.net/
2. Upload: `public/icon.svg`
3. Configure and download
4. Extract to `public/` folder

---

## PWA Configuration Files

### 1. Manifest (`public/manifest.json`)
```json
{
  "name": "Missing Semester - Course Resources",
  "short_name": "Missing Semester",
  "start_url": "/",
  "display": "standalone",
  "icons": [...],
  "theme_color": "#2563eb",
  "background_color": "#ffffff"
}
```

### 2. Next.js PWA Config (`next.config.js`)
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})
```

### 3. Layout Metadata (`src/app/layout.tsx`)
```tsx
export const metadata: Metadata = {
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Missing Semester",
  },
  icons: { ... }
}
```

---

## Verify PWA is Working

### Using Chrome DevTools

1. **Open DevTools** (F12)
2. **Application tab** > Manifest
   - Should show: "Missing Semester - Course Resources"
   - All icons should load without 404 errors
   
3. **Application tab** > Service Workers
   - Status should be: "activated and is running"
   - sw.js should be registered
   
4. **Lighthouse tab**
   - Run "Progressive Web App" audit
   - Should score 90+ for installability

### Using Browser Address Bar

**Chrome/Edge:**
- Install icon (⊕) should appear in address bar
- Click to see install prompt

**Mobile Chrome:**
- Banner should appear: "Add Missing Semester to Home screen"
- May take 2-3 visits to appear (PWA engagement heuristics)

---

## After Deployment Checklist

After pushing changes to production:

- [ ] Visit https://aiubfiles.app
- [ ] Open DevTools > Application > Manifest
- [ ] Verify no 404 errors for icons
- [ ] Check Service Worker is registered
- [ ] Test "Add to Home Screen" on desktop
- [ ] Test "Add to Home Screen" on mobile (Android)
- [ ] Test "Add to Home Screen" on iOS/Safari
- [ ] Run Lighthouse PWA audit (should score 90+)
- [ ] Test offline functionality (disconnect internet)

---

## Debugging Commands

```bash
# Check if icons exist
ls public/*.png

# Regenerate icons if needed
node scripts/generate-icons.js

# Build and test locally
npm run build
npm run start

# Check build output for service worker
# Should see: public/sw.js and public/workbox-*.js
```

---

## Next Steps

1. **Push to production:**
   ```bash
   git add .
   git commit -m "fix: Add missing PWA icons and generator script"
   git push
   ```

2. **Wait for Vercel deployment** (~1-2 minutes)

3. **Test on live site:**
   - Desktop: https://aiubfiles.app
   - Mobile: Open on phone

4. **Monitor install analytics** (optional):
   - Add event tracking for `beforeinstallprompt`
   - Track successful installs
   - Monitor user engagement

---

## Resources

- [PWA Builder](https://www.pwabuilder.com/)
- [Favicon Generator](https://realfavicongenerator.net/)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker Cookbook](https://serviceworke.rs/)
- [next-pwa Documentation](https://github.com/shadowwalker/next-pwa)

---

**Status:** ✅ PWA icons generated and configured
**Next:** Deploy to production and test installation
