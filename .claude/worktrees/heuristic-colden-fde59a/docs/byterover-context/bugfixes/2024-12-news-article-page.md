## News Article Page (December 2024)

### Опис

Окрема сторінка для новин (`/news/[slug]`) з білим фоном та підтримкою всіх типів відео. Використовується для прямих посилань (LinkedIn, SEO).

### Файл

```
app/news/[slug]/NewsArticle.tsx
```

### Дизайн

- **Фон:** Білий (`bg-white`)
- **Текст:** Темно-сірий (`text-gray-900`, `text-gray-700`)
- **Посилання:** Синій (`text-blue-600`)
- **Tags:** Світло-сірий бейдж (`bg-gray-100`)
- **Author block:** Світло-сірий з рамкою (`bg-gray-50 border-gray-100`)

### Структура сторінки

```
┌─────────────────────────────────────────────────┐
│  Home / News / Article Title...                 │
│  ← Back to Home                                 │
│                                                 │
│  [Featured Image або Video]                     │
│                                                 │
│  Meta Unveils SAM Audio: A Breakthrough...      │
│  📅 December 17, 2025  👁 2 views               │
│                                                 │
│  [Article content - description_en]             │
│                                                 │
│  #ai #technology #meta                          │
│                                                 │
│  [Read Original Article] ← кнопка              │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Curated by                               │   │
│  │ Vitalii Berbeha                          │   │
│  │ E-commerce & Marketing Expert            │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Video Support

Підтримуються всі типи відео:
- **YouTube:** Нативний iframe player
- **Telegram embed:** Красивий fallback з кнопкою "Дивитись в Telegram"
- **Direct URL:** HTML5 video player

### SEO Features

- JSON-LD `NewsArticle` schema
- JSON-LD `BreadcrumbList` schema
- Open Graph metadata
- Twitter Cards
- Canonical URLs
- Hreflang tags

---
