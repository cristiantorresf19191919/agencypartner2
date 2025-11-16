# Migration Guide: HTML/CSS to Next.js with CSS Modules and Framer Motion

This guide explains the migration strategy and provides templates for converting remaining components.

## ✅ Completed Components

1. **Header** - `components/Header/`
   - Navigation with mobile menu
   - Wave SVG animation
   - CSS Modules implementation

2. **MobileMenu** - `components/Header/MobileMenu.js`
   - Framer Motion clip-path animation
   - Theme switcher integration

3. **Hero** - `components/Hero/`
   - Framer Motion animations
   - Particle.js integration
   - Statistics counter animation

4. **Theme Context** - `contexts/ThemeContext.js`
   - Dark mode by default
   - LocalStorage persistence

5. **Language Context** - `contexts/LanguageContext.js`
   - ES/EN language switching
   - Translation system

## 🔄 Remaining Components to Create

### 1. Services Overview (`components/Services/ServicesOverview.js`)

**Pattern to follow:**
```javascript
'use client';

import { motion } from 'framer-motion';
import styles from './ServicesOverview.module.css';

const ServicesOverview = () => {
  const services = [
    {
      title: 'Landing Pages',
      icon: 'fas fa-globe',
      gradient: 'green',
      features: [...]
    },
    // ... more services
  ];

  return (
    <section className={styles.services}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Service cards */}
      </motion.div>
    </section>
  );
};
```

**CSS Module approach:**
- Extract `.service-card` styles to CSS Module
- Use CSS variables for gradients
- Maintain hover effects with CSS transitions
- Add Framer Motion for entrance animations

### 2. Pricing (`components/Pricing/Pricing.js`)

**Key features:**
- Three pricing cards (Starter, Professional, Custom)
- Featured card highlighting
- Hover animations with Framer Motion
- Price animation on scroll

### 3. FAQ (`components/FAQ/FAQ.js`)

**Implementation:**
- Use Framer Motion's `AnimatePresence` for accordion
- Convert CSS accordion styles to CSS Modules
- Maintain smooth expand/collapse animations

```javascript
const [openIndex, setOpenIndex] = useState(null);

<AnimatePresence>
  {openIndex === index && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
    >
      {answer}
    </motion.div>
  )}
</AnimatePresence>
```

### 4. Portfolio (`components/Portfolio/Portfolio.js`)

**Features:**
- Grid layout with CSS Modules
- Image hover effects
- Statistics animation
- Staggered card entrance with Framer Motion

### 5. Contact (`components/Contact/Contact.js`)

**Implementation:**
- Form validation
- Firebase integration
- Loading states
- Success/error animations with Framer Motion

### 6. Footer (`components/Footer/Footer.js`)

**Features:**
- Wave SVG animation
- Links and copyright
- Responsive layout

### 7. FAB (`components/FAB/FAB.js`)

**Key features:**
- Floating Action Button with radial fan animation
- Theme toggle
- Language switcher
- WhatsApp link
- Framer Motion for smooth animations

## 📋 CSS Modules Conversion Pattern

### Original CSS:
```css
.service-card {
  background: linear-gradient(135deg, #2EDC9B 0%, #1cc7b6 100%);
  border-radius: 16px;
  padding: 2rem;
}
```

### CSS Module:
```css
/* ServicesOverview.module.css */
.serviceCard {
  background: linear-gradient(135deg, #2EDC9B 0%, #1cc7b6 100%);
  border-radius: 16px;
  padding: 2rem;
}
```

### Usage:
```javascript
import styles from './ServicesOverview.module.css';

<div className={styles.serviceCard}>...</div>
```

## 🎭 Framer Motion Animation Patterns

### Fade In on Scroll:
```javascript
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Staggered Children:
```javascript
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

<motion.div variants={container} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div variants={itemVariants} key={item.id}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Hover Effects:
```javascript
<motion.div
  whileHover={{ scale: 1.05, y: -5 }}
  transition={{ duration: 0.3 }}
>
  Hover me
</motion.div>
```

## 🔧 Key Considerations

### 1. Preserve Original Animations
- Convert CSS keyframes to Framer Motion animations
- Maintain timing and easing functions
- Keep visual consistency

### 2. CSS Variables
- Use CSS custom properties in `globals.css`
- Reference them in CSS Modules
- Support dark/light mode

### 3. Responsive Design
- Mobile-first approach in CSS Modules
- Use media queries in module files
- Test on multiple screen sizes

### 4. Performance
- Use `viewport={{ once: true }}` for scroll animations
- Lazy load images with Next.js Image
- Optimize Framer Motion with `AnimatePresence`

### 5. Accessibility
- Maintain ARIA labels
- Keyboard navigation
- Focus states
- Screen reader support

## 📦 File Structure for Each Component

```
components/
  ComponentName/
    ComponentName.js          # Main component
    ComponentName.module.css  # CSS Module
    index.js                  # Export
```

## 🚀 Next Steps

1. Create remaining components following the established patterns
2. Convert CSS animations to Framer Motion
3. Test responsiveness
4. Optimize performance
5. Add TypeScript (optional)
6. Deploy to Vercel/Netlify

## 📝 Notes

- All components use CSS Modules for scoped styling
- Framer Motion handles all animations
- Theme and language contexts provide global state
- Dark mode is default as per user preference
- Original design and animations are preserved

