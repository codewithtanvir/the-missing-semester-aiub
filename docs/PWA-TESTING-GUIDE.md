# PWA Testing Guide for Mobile

## 🚀 Quick Start

### Step 1: Generate Icons (5 minutes)

1. **Open the icon generator**:
   ```
   http://localhost:3000/icon-generator.html
   ```

2. **Customize your icon**:
   - Enter text: "MS" (Missing Semester)
   - Choose colors (default blue works great!)
   - Click "Download All Icons"

3. **Place icons in `/public` folder**:
   - icon-192x192.png
   - icon-256x256.png
   - icon-384x384.png
   - icon-512x512.png
   - apple-touch-icon.png

### Step 2: Build the App

```bash
npm run build
npm run start
```

### Step 3: Test on Mobile

#### Option A: Using ngrok (Easy for Local Testing)

```bash
# Install ngrok
npm install -g ngrok

# Start your app
npm run start

# In another terminal, create tunnel
ngrok http 3000
```

You'll get a URL like: `https://abc123.ngrok.io`

#### Option B: Deploy to Vercel (Production)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 📱 Testing on Android

### Chrome Browser

1. Open the app URL on your phone
2. Wait 30 seconds
3. Chrome will show a banner: **"Add Missing Semester to Home screen"**
4. Tap "Add" or "Install"
5. App icon appears on home screen! 🎉

### Manual Install (if banner doesn't show)

1. Open the app in Chrome
2. Tap the **⋮** menu (3 dots)
3. Select **"Add to Home screen"**
4. Tap "Add"

### Verify Install

1. Check your home screen for the app icon
2. Tap to open
3. Should open **fullscreen** (no browser UI)
4. Check status bar color (should be blue)

## 📱 Testing on iPhone (iOS)

### Safari Browser

1. Open the app URL in Safari
2. Tap the **Share** button (box with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Edit name if needed
5. Tap "Add"

### Verify Install

1. Find the app icon on home screen
2. Tap to open
3. Should look like a native app

## ✅ Test Checklist

### Installation
- [ ] App can be installed from browser
- [ ] Icon appears on home screen
- [ ] Icon looks good (not pixelated)
- [ ] App name is correct ("Missing Semester")

### App Behavior
- [ ] Opens in fullscreen (no browser UI)
- [ ] Status bar color is blue (#2563eb)
- [ ] Splash screen appears briefly
- [ ] Navigation works smoothly

### Offline Functionality
- [ ] Enable Airplane mode
- [ ] Open installed app
- [ ] Previously visited pages load
- [ ] Cached content is accessible

### Performance
- [ ] App loads quickly
- [ ] Smooth scrolling
- [ ] No lag when navigating
- [ ] Search works properly

### Features
- [ ] Can browse courses
- [ ] Can view course details
- [ ] Can search for files
- [ ] Admin can access dashboard (if logged in)

## 🐛 Troubleshooting

### "Add to Home Screen" not appearing

**Check**:
- Using HTTPS (ngrok or Vercel)
- All icon files exist in `/public`
- manifest.json is valid
- Service worker is registered

**Solution**:
```bash
# Rebuild the app
npm run build
npm run start

# Clear browser cache on mobile
# Settings → Chrome → Clear browsing data
```

### Icons not showing

**Check**:
```bash
# Verify files exist
ls public/icon-*.png
ls public/apple-touch-icon.png
```

**Fix**: Re-generate icons using icon-generator.html

### App not working offline

**Check**:
1. Open Chrome DevTools on desktop
2. Application → Service Workers
3. Verify service worker is registered
4. Check "Update on reload"

**Fix**: Clear cache and reinstall

### Status bar color wrong

**Check** `src/app/layout.tsx`:
```typescript
export const viewport: Viewport = {
  themeColor: "#2563eb", // Should be here
}
```

## 🎯 PWA Audit (Desktop)

### Run Lighthouse Audit

1. Build and start production:
   ```bash
   npm run build
   npm run start
   ```

2. Open Chrome DevTools (F12)
3. Go to **Lighthouse** tab
4. Select **Progressive Web App**
5. Click **Generate report**

### Target Scores
- **PWA**: 90+ (green)
- **Performance**: 90+ 
- **Accessibility**: 90+
- **Best Practices**: 90+
- **SEO**: 90+

### Common Issues

| Issue | Fix |
|-------|-----|
| No manifest | Check manifest.json exists |
| No icons | Generate icons |
| Not installable | Add HTTPS |
| Service worker fails | Check next.config.js |
| Offline not working | Rebuild app |

## 📊 Real Device Testing

### Recommended Devices
- ✅ Android 8.0+ (Chrome)
- ✅ iOS 11.3+ (Safari)
- ✅ Desktop Chrome/Edge

### Test Scenarios

1. **First Visit**
   - Load homepage
   - Browse courses
   - View course details
   - Check install prompt

2. **After Install**
   - Open from home screen
   - Check fullscreen mode
   - Test navigation
   - Verify offline mode

3. **Return Visit**
   - Open app
   - Should load instantly (cached)
   - Check for updates
   - New content loads

## 🎨 Icon Quality Check

### Visual Inspection
- [ ] Icon is clear and sharp
- [ ] Text is readable
- [ ] Colors match brand
- [ ] No white borders/gaps
- [ ] Rounded corners look good

### Size Check
```bash
# Check file sizes
ls -lh public/icon-*.png

# Should be roughly:
# 192x192: 5-10 KB
# 256x256: 8-15 KB
# 384x384: 15-25 KB
# 512x512: 25-40 KB
```

## 📱 Share Your App

Once installed, users can share:
1. Open app
2. Share button (if implemented)
3. Or share the URL

Others can install directly from link!

## 🚀 Production Deployment

### Pre-deployment Checklist
- [ ] All icons generated and in `/public`
- [ ] manifest.json configured
- [ ] Service worker enabled in production
- [ ] HTTPS enabled (Vercel does this automatically)
- [ ] Lighthouse PWA score 90+
- [ ] Tested on real devices

### Deploy to Vercel
```bash
vercel --prod
```

### Post-deployment
1. Test install on mobile
2. Check Lighthouse score
3. Verify offline functionality
4. Monitor performance

---

**Ready to test?** 
1. Generate icons → `http://localhost:3000/icon-generator.html`
2. Build → `npm run build && npm run start`
3. Test → Use ngrok or deploy to Vercel

🎉 Your app is now a PWA!
