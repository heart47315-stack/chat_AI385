# 🎨 UI Components Guide

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── BottomNav.tsx      # Global bottom navigation bar
│   │   ├── Layout.tsx         # Layout wrapper with header & background
│   │   ├── PageTransition.tsx # Smooth page transition animation
│   │   └── index.ts           # Component exports
│   ├── pages/
│   │   ├── Home.tsx           # Character list page
│   │   ├── Chat.tsx           # Chat interface
│   │   ├── CreateCharacter.tsx # Create new character
│   │   ├── CreateProfile.tsx  # Create user profile
│   │   └── ProfilePage.tsx    # User profile page
│   ├── App.tsx                # Main app with routes & layout
│   ├── index.css              # Global styles + animations
│   └── index.tsx              # React root
└── package.json
```

## 🧩 Components Overview

### 1. **BottomNav.tsx** - Global Navigation Bar
- **Purpose**: Fixed navigation bar at bottom of screen (mobile-friendly)
- **Features**:
  - 4 navigation buttons: Home, Chat, Create, Profile
  - Active state indicator with animation
  - Smooth hover effects
  - Responsive design
  - Fixed position (doesn't overlap content)

**Props**: None (uses React Router)

**Key Features**:
```tsx
// Animated active tab indicator
<motion.div layoutId="activeTab" />

// Smooth nav items
<motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }} />
```

---

### 2. **Layout.tsx** - Page Wrapper Component
- **Purpose**: Wraps all pages with consistent header, background, and padding
- **Features**:
  - Animated gradient background with floating orbs
  - Page title & subtitle header
  - Proper bottom padding for navbar (pb-24)
  - Dark theme with glass morphism
  - Animated entrance

**Props**:
```tsx
interface LayoutProps {
  children: ReactNode
  title?: string       // Page title
  subtitle?: string    // Page subtitle
}
```

**Usage**:
```tsx
<Layout title="🔥 Characters" subtitle="Select a character to chat with">
  {/* Page content */}
</Layout>
```

---

### 3. **PageTransition.tsx** - Animation Wrapper
- **Purpose**: Smooth entrance/exit animations for pages
- **Features**:
  - Fade & scale animation on mount
  - Scale out animation on unmount
  - 300ms smooth transition

**Usage**:
```tsx
<PageTransition>
  {/* Page content */}
</PageTransition>
```

---

### 4. **Pages Overview**

#### **Home.tsx** - Character List
- Displays all available characters
- Search functionality
- Grid layout with hover animations
- Character cards with badges (NSFW, tags)
- "Start Chat" button per character

#### **Chat.tsx** - Chat Interface
- Message history display
- Sticky header with character info
- Auto-scroll to latest message
- Loading animation while waiting for reply
- Input field at bottom (fixed above navbar)
- Error handling with banner

#### **CreateCharacter.tsx** - Character Form
- 7 input fields with validation:
  - Name, Description, Personality
  - Scenario, Avatar URL, Tags
  - NSFW checkbox
- Image preview
- Animated form with staggered entrance
- Success redirect to home

#### **CreateProfile.tsx** - User Profile Form
- 3 input fields:
  - Username, Email, Avatar URL
- Image preview
- LocalStorage persistence
- Validation (email format)
- Redirect on success

#### **ProfilePage.tsx** - User Profile Display
- Shows saved profile info
- Avatar display
- Stats cards (Chats, Favorites, Created)
- Edit & Logout buttons
- Fallback UI if no profile

---

## 🎨 Styling & Design System

### **Color Palette**
- **Primary Gradient**: Blue → Cyan (`from-blue-600 to-cyan-600`)
- **Background**: Dark slate gradient (`from-slate-900 via-slate-800 to-slate-900`)
- **Glass**: Semi-transparent white with backdrop blur
- **Accents**: Blue-500, Cyan-500 for highlights

### **Component Utilities**
```css
/* Glass Morphism */
backdrop-blur-2xl
border border-white/10
bg-black/30 or bg-white/10

/* Gradients */
bg-gradient-to-r from-blue-600 to-cyan-600

/* Transitions */
transition-all duration-300
```

### **Responsive Design**
- Mobile-first approach
- Breakpoints: sm, md, lg
- Bottom navbar: 80px height
- Safe area inset for Android WebView
- Content padding: `pb-24` (80px) to avoid navbar

---

## 🚀 Features Implementation

### **Bottom Navigation (Fixed)**
✅ Fixed position at bottom
✅ No overlap with content (handled by padding)
✅ Active state indicator
✅ Smooth hover animations
✅ Mobile responsive
✅ Android WebView compatible

### **Animations**
✅ Page transitions (fade + scale)
✅ Framer Motion `motion.*` components
✅ Hover effects on buttons/cards
✅ Staggered entrance animations
✅ Loading spinners with rotation
✅ Message slide-in animations

### **Responsive Design**
✅ Works on mobile (100%)
✅ Works on tablet
✅ Works on desktop
✅ Safe area support (Android)
✅ Touch-friendly button sizes

---

## 📱 Android WebView Optimization

The UI is optimized for WebView with:

1. **Safe Area Insets** (index.css):
```css
@supports (padding: max(0px)) {
  body {
    padding-left: max(12px, env(safe-area-inset-left));
    padding-right: max(12px, env(safe-area-inset-right));
    padding-top: max(12px, env(safe-area-inset-top));
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }
}
```

2. **Scrollbar Styling**: Custom scrollbar visible on WebView

3. **No Position Fixed Issues**: Only navbar uses fixed, with proper z-index

---

## 🎬 Animation Details

### **Page Entrance**
```tsx
<motion.main
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.1 }}
/>
```

### **Button Interactions**
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
/>
```

### **Staggered List Items**
```tsx
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
  transition={{ staggerChildren: 0.1 }}
/>
```

---

## 🔧 Component Usage Examples

### **Using Layout + PageTransition**
```tsx
import { Layout, PageTransition } from '../components'

export default function MyPage() {
  return (
    <PageTransition>
      <Layout title="📝 My Page" subtitle="A great page">
        <div>Your content here</div>
      </Layout>
    </PageTransition>
  )
}
```

### **Creating Responsive Grids**
```tsx
{/* Mobile: 1 col | Tablet: 2 col | Desktop: 3 col */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (...))}
</div>
```

### **Adding Glass Effect**
```tsx
<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
  Content with glass morphism
</div>
```

---

## 🌐 Key CSS Classes

### **Layout Classes**
- `pb-24` - Bottom padding for navbar space (96px)
- `pb-20` - Alternative padding (80px)
- `pb-28` - Responsive bottom padding (112px)

### **Glass Morphism**
- `bg-white/10` - 10% opacity white background
- `backdrop-blur-md`, `backdrop-blur-xl`, `backdrop-blur-2xl` - Blur levels
- `border border-white/20` - Subtle border

### **Gradients**
- `bg-gradient-to-r from-X to-Y` - Horizontal gradient
- `bg-gradient-to-b from-X to-Y` - Vertical gradient
- `bg-gradient-to-br from-X to-Y` - Diagonal gradient

---

## 🐛 Troubleshooting

### **Content Hidden Behind Navbar**
✅ **Solution**: Add `pb-24` to container

### **Navbar Overlapping Content**
✅ **Solution**: Use `fixed` position with `bottom-0` + add bottom padding to main content

### **Page Doesn't Scroll on Mobile**
✅ **Solution**: Check if parent has `overflow-y-auto` and proper `max-height`

### **Animations Jank on Mobile**
✅ **Solution**: Use `will-change: transform` on animated elements

---

## 📦 Dependencies

- `react` - UI framework
- `react-router-dom` - Routing
- `framer-motion` - Animations
- `tailwindcss` - Styling
- `typescript` - Type safety

---

## ✨ Best Practices

1. **Always wrap pages** with `<PageTransition>` for consistent animations
2. **Use Layout** for standard page structure with title
3. **Responsive classes**: Always use `sm:`, `md:`, `lg:` prefixes
4. **Bottom padding**: Add `pb-24` to main content containers
5. **Animation delays**: Stagger children for visual interest
6. **Glass effect**: Combine `bg-white/10`, `backdrop-blur-md`, `border border-white/20`

---

## 📚 Component Tree

```
App
├── BottomNav (Global)
└── Routes
    ├── Home
    │  └── PageTransition
    │     └── Layout
    ├── Chat
    │  └── PageTransition
    ├── CreateCharacter
    │  └── PageTransition
    │     └── Layout
    ├── CreateProfile
    │  └── PageTransition
    │     └── Layout
    └── ProfilePage
       └── PageTransition
          └── Layout
```

---

Last Updated: April 2026
