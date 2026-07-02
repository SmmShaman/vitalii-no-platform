## Mobile Layout System (January 2025)

### BentoGridMobile Component

Мобільна версія головної сторінки з **Bottom Navigation App-стилем** та портованими ефектами з desktop версії.

**Файл:** `components/sections/BentoGridMobile.tsx`

### Архітектура

```
┌─────────────────────────────────────┐
│          Header (Fixed)             │
├─────────────────────────────────────┤
│                                     │
│        Scrollable Content           │
│     (Active Section Content)        │
│                                     │
│    ╭──────────────────────────╮     │
│    │  Section-specific        │     │
│    │  content with animations │     │
│    ╰──────────────────────────╯     │
│                                     │
├─────────────────────────────────────┤
│ 🏠   💼   📁   ✨   📰   📖  │
│ Bottom Navigation (Fixed)           │
└─────────────────────────────────────┘
```

### Портовані ефекти з Desktop

#### 1. About Section - Typewriter Effect

```typescript
// Typewriter animation (30ms per character)
const [typedText, setTypedText] = useState('')
const [isTyping, setIsTyping] = useState(true)

useEffect(() => {
  const aboutText = (t('about_content') as string).split('\n\n')[0]
  if (!isTyping || expandedAbout) return
  if (typedText.length < aboutText.length) {
    const timer = setTimeout(() => {
      setTypedText(aboutText.substring(0, typedText.length + 1))
    }, 30)
    return () => clearTimeout(timer)
  }
}, [typedText, isTyping])
```

**Функціонал:**
- Друкує текст посимвольно (30ms інтервал)
- Блимаючий курсор в кінці
- Кнопка "Show more" розгортає повний текст
- При розгортанні typewriter зупиняється

#### 2. Services Section - Rotation Animation

```typescript
// Service title rotation every 3 seconds
const [currentServiceIndex, setCurrentServiceIndex] = useState(0)

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentServiceIndex(prev => (prev + 1) % services.length)
  }, 3000)
  return () => clearInterval(interval)
}, [])
```

**Функціонал:**
- Автоматична ротація заголовків сервісів (3 сек)
- AnimatePresence для плавних переходів
- Горизонтальний скролл карточок сервісів
- Індикатор активного сервісу (кольорова крапка)

#### 3. Projects Section - Carousel + Explosion Grid

```typescript
// Touch/swipe support
const handleProjectTouchStart = (e: React.TouchEvent) => {
  touchStartRef.current = { x: e.touches[0].clientX, time: Date.now() }
}

const handleProjectTouchEnd = (e: React.TouchEvent) => {
  if (!touchStartRef.current) return
  const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x
  const deltaTime = Date.now() - touchStartRef.current.time
  if (Math.abs(deltaX) > 50 && deltaTime < 300) {
    if (deltaX < 0) nextProject()
    else prevProject()
  }
}
```

**Функціонал:**
- **Carousel mode:** Один проект на весь екран зі swipe
- **Progress bar:** Візуальний індикатор до наступного проекту
- **Explosion grid:** Кнопка "Show all" → сітка всіх проектів
- **Swipe gesture:** 50px threshold, 300ms max duration
- **Унікальні градієнти** для кожного проекту

#### 4. Skills Section - Tags/Logos Toggle

```typescript
const [isSkillsExpanded, setIsSkillsExpanded] = useState(false)

// Toggle between tags view and logos grid
<motion.button onClick={() => setIsSkillsExpanded(!isSkillsExpanded)}>
  {isSkillsExpanded ? 'Show Tags' : 'Show Logos'}
</motion.button>
```

**Функціонал:**
- **Tags view:** Компактні бейджі з категоріями (кольоровані)
- **Logos view:** Сітка логотипів технологій (explosion-like)
- Spring animation при перемиканні
- Категорії: development, ui, ai, automation, marketing, integration

#### 5. News Section - Horizontal Scroll Cards

```typescript
// Staggered animation on mount
<motion.div
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.1 }}
/>
```

**Функціонал:**
- Горизонтальний скролл карточок новин
- Зображення, заголовок, дата, кількість переглядів
- Stagger animation (100ms delay per card)
- Посилання на повну статтю

#### 6. Blog Section - Horizontal Scroll Cards

Ідентично News Section з власними стилями та даними з Supabase.

### Bottom Navigation

**Файл:** `components/layout/BottomNavigation.tsx`

```typescript
const navItems = [
  { id: 'home', icon: Home, labelKey: 'nav_home' },
  { id: 'services', icon: Briefcase, labelKey: 'nav_services' },
  { id: 'projects', icon: FolderOpen, labelKey: 'nav_projects' },
  { id: 'news', icon: Newspaper, labelKey: 'nav_news' },
  { id: 'blog', icon: BookOpen, labelKey: 'nav_blog' },
  { id: 'contact', icon: Mail, labelKey: 'nav_contact' },
]
```

**Стилі:**
- Glassmorphism ефект (blur + transparency)
- Safe area insets для iPhone X+
- Кольорова індикація активної секції
- Animated dot indicator

### Кольори секцій

| Section | Color | HEX |
|---------|-------|-----|
| Home/About | Brown-Orange | `#AF601A` |
| Services | Fuchsia | `#EC008C` |
| Projects | Emerald | `#009B77` |
| Skills | Light Pink | `#fde5e5` |
| News | Greenery | `#88B04B` |
| Blog | Classic Blue | `#0F4C81` |
| Contact | Purple | `#764BB0` |

### Використання

```tsx
// app/page.tsx
import { useIsMobile } from '@/hooks/useIsMobile'
import { BentoGridMobile } from '@/components/sections/BentoGridMobile'

export default function Home() {
  const isMobile = useIsMobile()

  return isMobile ? (
    <BentoGridMobile onHoveredSectionChange={handleHover} />
  ) : (
    <BentoGrid onHoveredSectionChange={handleHover} />
  )
}
```

### Desktop vs Mobile Effects Comparison

| Feature | Desktop | Mobile |
|---------|---------|--------|
| About Text | GSAP SplitText explosion | Typewriter effect |
| Services | GSAP scatter/gather chars | AnimatePresence rotation |
| Projects | GSAP timeline carousel | Swipe carousel + grid toggle |
| Skills | Particle logo explosion | Tags/Logos toggle view |
| News/Blog | Expand/fullscreen modal | Horizontal scroll cards |
| Navigation | Hover on sections | Bottom Navigation tabs |

---
