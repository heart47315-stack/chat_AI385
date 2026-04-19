# 📱 Android WebView Implementation Guide

## 🎯 WebView Optimization Checklist

### **1. HTML Meta Tags**
Ensure your `public/index.html` has these meta tags:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Viewport for mobile -->
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  
  <!-- Safe area support -->
  <meta name="viewport" content="viewport-fit=cover" />
  
  <!-- Disable tap highlight -->
  <meta name="theme-color" content="#0f172a" />
  
  <!-- Android status bar -->
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

---

## 🔧 WebView Configuration (Android Side)

### **Kotlin (MainActivity.kt)**
```kotlin
val webView: WebView = binding.webView
webView.apply {
    // Settings
    settings.apply {
        javaScriptEnabled = true
        domStorageEnabled = true
        databaseEnabled = true
        mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        useWideViewPort = true
        loadWithOverviewMode = true
        
        // For notch support
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            forceDark = WebSettings.FORCE_DARK_OFF
        }
    }
    
    // Viewport settings
    setInitialScale(100)
    
    // Layout behavior
    layoutParams = FrameLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT
    )
    
    // Load URL
    loadUrl("file:///android_asset/index.html")
}
```

---

## 🎨 CSS Safe Area Support

The app includes automatic safe area support:

```css
/* Automatically applied in index.css */
@supports (padding: max(0px)) {
  body {
    padding-left: max(12px, env(safe-area-inset-left));
    padding-right: max(12px, env(safe-area-inset-right));
    padding-top: max(12px, env(safe-area-inset-top));
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }
}
```

This handles:
- ✅ Status bar (top)
- ✅ Navigation bar (bottom)
- ✅ Notches/Cutouts (sides)

---

## 🔌 JavaScript Bridge (WebView ↔ Android)

### **Android Side (Optional)**
```kotlin
class JSInterface {
    @JavascriptInterface
    fun showToast(message: String) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }
}

webView.addJavascriptInterface(JSInterface(), "Android")
```

### **React Side**
```typescript
// In your component
const callNativeCode = () => {
  if (window.Android) {
    (window.Android as any).showToast("Hello from React!")
  }
}
```

---

## 🐛 Common WebView Issues & Solutions

### **Issue 1: UI Looks Compressed/Stretched**
**Symptom**: Content appears squished or enlarged

**Solution**:
```html
<!-- Add to index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

---

### **Issue 2: Bottom Navbar Overlap on Notch Devices**
**Symptom**: Navbar hidden behind system navigation

**Solution**:
```css
/* Already in index.css */
@supports (padding: max(0px)) {
  body {
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }
}
```

---

### **Issue 3: Scrolling Issues**
**Symptom**: Content doesn't scroll smoothly

**Solution**:
```css
/* Add to component */
overflow-y: auto;
-webkit-overflow-scrolling: touch; /* Smooth momentum scrolling */
```

---

### **Issue 4: Input Focus Issues**
**Symptom**: Keyboard pushes content up

**Solution**:
```kotlin
// In MainActivity.kt
webView.settings.apply {
    // Prevent zoom on input focus
    setSupportZoom(false)
    builtInZoomControls = false
}
```

---

### **Issue 5: Fixed Elements Jump**
**Symptom**: Fixed navbar jumps when keyboard opens

**Solution**:
```tsx
// In BottomNav.tsx
useEffect(() => {
  // Prevent body scroll when fixed element
  const preventScroll = (e: TouchEvent) => {
    if (e.touches.length > 1) {
      e.preventDefault()
    }
  }
  
  document.addEventListener('touchmove', preventScroll, false)
  return () => {
    document.removeEventListener('touchmove', preventScroll)
  }
}, [])
```

---

### **Issue 6: Animations Lag**
**Symptom**: Animations are stuttery

**Solution**:
```css
/* Add to animated elements */
will-change: transform;
transform: translateZ(0);
-webkit-transform: translateZ(0);
```

---

### **Issue 7: Text Selection Issues**
**Symptom**: Text can't be selected or is too easy to select

**Solution**:
```css
/* Add to components */
user-select: none;
-webkit-user-select: none;
-webkit-touch-callout: none;
```

---

### **Issue 8: Date/Time Input Issues**
**Symptom**: Input types don't work

**Solution**:
```html
<!-- Use polyfill or standard input -->
<input type="text" placeholder="YYYY-MM-DD" />
```

---

## 📊 Testing Checklist

### **Before Deployment**
- [ ] Test on Android 8+ devices
- [ ] Test with screen notch/cutout
- [ ] Test keyboard popup behavior
- [ ] Test all animations smooth
- [ ] Test scrolling performance
- [ ] Test button touch areas (min 44x44px)
- [ ] Test image loading
- [ ] Test dark mode (if applicable)
- [ ] Test landscape orientation
- [ ] Test with slow network

### **Performance Benchmarks**
- Page load: < 2s
- Animation frame rate: 60fps
- Memory usage: < 100MB
- CPU usage: < 30%

---

## 🔍 Debugging WebView

### **Enable Debug Bridge**
```kotlin
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    WebView.setWebContentsDebuggingEnabled(true)
}
```

Then access Chrome DevTools:
1. Open Chrome browser
2. Go to `chrome://inspect`
3. Find your WebView
4. Click "Inspect"

### **Enable Logging**
```typescript
// In React code
console.log = function(...args) {
  if (window.Android) {
    (window.Android as any).log(args.join(' '))
  }
}
```

---

## 📦 Build Optimization

### **Reduce Bundle Size**
```bash
# Check bundle size
npm run build

# Analyze
npm install webpack-bundle-analyzer --save-dev
```

### **Compress Assets**
```javascript
// vite.config.ts
import compression from 'vite-plugin-compression'

export default {
  plugins: [
    compression({
      algorithm: 'gzip',
      ext: '.js.gz'
    })
  ]
}
```

---

## 🌐 Network Considerations

### **Handle Offline**
```typescript
useEffect(() => {
  const handleOnline = () => console.log('Back online')
  const handleOffline = () => console.log('Went offline')
  
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}, [])
```

### **Slow Network Handling**
```typescript
// Set timeout for API calls
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), 5000)
)

Promise.race([apiCall, timeout])
```

---

## 📱 Viewport Sizes to Test

| Device | Width | Height | DPI |
|--------|-------|--------|-----|
| Small phone | 360px | 640px | 2x |
| Medium phone | 375px | 812px | 3x |
| Large phone | 414px | 896px | 3x |
| Tablet | 768px | 1024px | 2x |

---

## ⚡ Performance Tips

1. **Lazy load images**
```tsx
<img loading="lazy" src="..." />
```

2. **Use CSS containment**
```css
.card { contain: layout style paint; }
```

3. **Minimize reflows**
```tsx
// Bad: Multiple DOM updates
for (let i = 0; i < 100; i++) {
  element.textContent += i // Reflow each time
}

// Good: Batch update
let html = ''
for (let i = 0; i < 100; i++) {
  html += i
}
element.textContent = html // Single reflow
```

4. **Use `transform` over `left/top`**
```css
/* Good: GPU accelerated */
transform: translateX(100px);

/* Bad: CPU intensive */
left: 100px;
```

---

## 🔐 Security Considerations

1. **Sanitize user input** (already done by React)
2. **Use HTTPS only** for API calls
3. **Enable CSP headers**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self' https:;">
```

4. **Disable file access** in WebView
```kotlin
settings.allowFileAccess = false
settings.allowFileAccessFromFileURLs = false
```

---

## 📚 Resources

- [Android WebView Documentation](https://developer.android.com/reference/android/webkit/WebView)
- [Chrome DevTools Remote Debugging](https://developer.chrome.com/docs/devtools/remote-debugging/remote-debuggingwebviews/)
- [Web Fundamentals - Mobile Optimization](https://web.dev/responsive-web-design-basics/)
- [Safe Area Guide](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)

---

## ✅ Final Verification

Before submitting to app store:
```
✓ No console errors
✓ All buttons clickable
✓ Smooth scrolling
✓ Images load properly
✓ No layout shifts
✓ Fast page transitions
✓ Battery usage acceptable
✓ No memory leaks
```

---

**Last Updated**: April 2026
**Status**: Production Ready
