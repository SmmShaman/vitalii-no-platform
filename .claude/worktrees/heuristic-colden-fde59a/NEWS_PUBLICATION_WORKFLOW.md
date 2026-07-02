# 📰 Як Публікуються Новини - Повний Процес

## 🏗️ Архітектура Системи

```
┌─────────────────┐
│  Telegram Bot   │ ──► Отримує новини від користувача
└────────┬────────┘
         │
         ▼
┌──────────────────────────────┐
│  Supabase Edge Function      │
│  process-news                │ ──► Обробляє новини + AI переклад
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Supabase Database           │
│  ├─ news                     │ ──► Зберігає новини
│  ├─ news_sources             │ ──► Джерела новин
│  ├─ ai_prompts               │ ──► AI промпти для перекладу
│  └─ storage/news-images      │ ──► Картинки
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Frontend (React)            │
│  ├─ NewsSection              │ ──► Показує 3 останні новини
│  ├─ NewsModal                │ ──► Повний перегляд
│  └─ AdminDashboard           │ ──► Керування новинами
└──────────────────────────────┘
```

---

## 📊 Структура Бази Даних

### 1️⃣ Таблиця `news`

| Поле | Тип | Опис |
|------|-----|------|
| `id` | UUID | Унікальний ID новини |
| `source_id` | UUID | Посилання на джерело (news_sources) |
| `original_title` | TEXT | Оригінальна назва (з Telegram) |
| `original_content` | TEXT | Оригінальний контент |
| `original_url` | TEXT | Посилання на джерело |
| `image_url` | TEXT | **URL картинки з Supabase Storage** |
| `title_en/no/ua` | TEXT | Переклади назви (AI генерує) |
| `content_en/no/ua` | TEXT | Переклади контенту (AI генерує) |
| `description_en/no/ua` | TEXT | Короткий опис (AI генерує) |
| `tags` | TEXT[] | Теги новини |
| `published_at` | TIMESTAMP | Дата публікації |
| **`is_rewritten`** | BOOLEAN | ✅ Чи AI переклав новину? |
| **`is_published`** | BOOLEAN | ✅ Чи опублікована? |
| `views_count` | INT | Кількість переглядів |

### 2️⃣ Таблиця `news_sources`

| Поле | Тип | Опис |
|------|-----|------|
| `id` | UUID | ID джерела |
| `name` | TEXT | Назва (напр. "TechCrunch") |
| `url` | TEXT | URL сайту |
| `source_type` | ENUM | 'rss' \| 'telegram' \| 'web' |
| `is_active` | BOOLEAN | Чи активне джерело? |

### 3️⃣ View `latest_news`

```sql
CREATE VIEW latest_news AS
SELECT * FROM news
WHERE is_published = true
ORDER BY published_at DESC;
```

---

## 🔄 Процес Публікації (Крок за Кроком)

### **Варіант A: Через Telegram Бота** (Автоматизований)

#### 1️⃣ Користувач Відправляє Новину в Telegram

```
👤 Користувач → 📱 Telegram Bot
   ├─ Надсилає текст новини
   ├─ Додає картинку (опціонально)
   └─ Надсилає URL джерела (опціонально)
```

#### 2️⃣ Telegram Bot → Supabase Edge Function

Telegram бот **НЕ** зберігає новину відразу. Він викликає:

```
POST https://uchmopqiylywnemvjttl.supabase.co/functions/v1/process-news

Body: {
  "message": "текст новини",
  "image_url": "посилання на картинку",
  "source_url": "https://джерело.com/article"
}
```

#### 3️⃣ Edge Function `process-news` Обробляє Новину

**Що робить функція:**

```javascript
// 1. Завантажує картинку в Supabase Storage
const imageUrl = await uploadToStorage(image);
// Результат: https://uchmopqiylywnemvjttl.supabase.co/storage/v1/object/public/news-images/{id}.png

// 2. Створює запис в таблиці news з is_published = false
const { data: newsItem } = await supabase
  .from('news')
  .insert({
    original_title: extractedTitle,
    original_content: message,
    image_url: imageUrl,
    is_rewritten: false,
    is_published: false  // ❌ Ще НЕ опублікована!
  })
  .select()
  .single();

// 3. Викликає AI для перекладу (використовує ai_prompts таблицю)
const translations = await callAI({
  prompt: aiPrompt.prompt_text,  // З таблиці ai_prompts
  content: newsItem.original_content
});

// 4. Оновлює новину з перекладами
await supabase
  .from('news')
  .update({
    title_en: translations.en.title,
    title_no: translations.no.title,
    title_ua: translations.ua.title,
    content_en: translations.en.content,
    content_no: translations.no.content,
    content_ua: translations.ua.content,
    description_en: translations.en.description,
    description_no: translations.no.description,
    description_ua: translations.ua.description,
    tags: translations.tags,
    is_rewritten: true  // ✅ Переклад готовий!
  })
  .eq('id', newsItem.id);
```

#### 4️⃣ Користувач Публікує Новину в Telegram

Після обробки, бот показує кнопки:

```
✅ Publish  |  ❌ Delete  |  ✏️ Edit
```

**Коли натискають ✅ Publish:**

```javascript
// Edge function оновлює статус
await supabase
  .from('news')
  .update({
    is_published: true,        // ✅ Тепер опублікована!
    published_at: new Date()   // Встановлює дату публікації
  })
  .eq('id', newsItem.id);
```

#### 5️⃣ Новина З'являється на Сайті

Frontend фетчить через `getLatestNews()`:

```typescript
const { data } = await supabase
  .from('latest_news')          // VIEW фільтрує is_published = true
  .select('*')
  .order('published_at', { ascending: false })
  .limit(3);
```

---

### **Варіант B: Через Адмін Панель** (Ручний)

#### 1️⃣ Вхід в Адмін Панель

```
🌐 https://remarkable-monstera-e6ecfa.netlify.app/admin/login
   ├─ Email: admin@example.com
   └─ Password: ваш_пароль
```

#### 2️⃣ Перегляд Всіх Новин

```
📍 /admin/dashboard → News Management

┌─────────────────────────────────────┐
│  News Management         [+ Add]    │
├─────────────────────────────────────┤
│  🔍 Search news...                  │
├─────────────────────────────────────┤
│  📰 TechCrunch Disrupt 2025         │
│     ✅ Published  |  👁️ 125 views   │
│     [Edit] [Delete] [👁️ Unpublish] │
├─────────────────────────────────────┤
│  📰 AI Breakthrough 2025            │
│     📝 Draft                        │
│     [Edit] [Delete] [👁️ Publish]   │
└─────────────────────────────────────┘
```

#### 3️⃣ Публікація/Зняття з Публікації

**Натискання кнопки 👁️:**

```typescript
const togglePublished = async (newsItem) => {
  await supabase
    .from('news')
    .update({ 
      is_published: !newsItem.is_published  // Перемикає статус
    })
    .eq('id', newsItem.id);
};
```

---

## 🚨 Чому Картинки Не Відображаються?

### Проблема: `is_published = false`

Коли ви виконали:

```sql
UPDATE news 
SET is_published = false, is_rewritten = false
WHERE id = '480e0a4a-312f-418a-b2ee-efc0e6057ab3';
```

Це **скинуло статус публікації!**

### Рішення:

**Опція 1: SQL**
```sql
UPDATE news 
SET is_published = true 
WHERE id = '480e0a4a-312f-418a-b2ee-efc0e6057ab3';
```

**Опція 2: Telegram Бот**
- Знайдіть повідомлення "TechCrunch Disrupt 2025"
- Натисніть ✅ **Publish**

**Опція 3: Адмін Панель**
- Відкрийте `/admin/dashboard`
- Знайдіть новину
- Натисніть 👁️ **Publish**

---

## 🔍 Перевірка Статусу Новини

```sql
SELECT 
    id,
    title_en,
    is_rewritten,    -- Чи AI переклав?
    is_published,    -- Чи опублікована?
    image_url,       -- Чи є картинка?
    published_at     -- Коли опублікована?
FROM news
WHERE id = '480e0a4a-312f-418a-b2ee-efc0e6057ab3';
```

**Очікуваний результат для опублікованої новини:**

```json
{
  "is_rewritten": true,   ✅
  "is_published": true,   ✅
  "image_url": "https://uchmopqiylywnemvjttl.supabase.co/storage/v1/object/public/news-images/{id}.png",  ✅
  "published_at": "2025-10-27T12:00:00Z"  ✅
}
```

---

## 📋 Чеклист Публікації

- [ ] Новина створена в БД (`news` таблиця)
- [ ] AI переклав новину (`is_rewritten = true`)
- [ ] Картинка завантажена в Storage (`image_url` не null)
- [ ] Новина опублікована (`is_published = true`)
- [ ] Встановлена дата публікації (`published_at` не null)
- [ ] Новина з'являється на сайті в `NewsSection`

---

## 🛠️ Корисні SQL Команди

### Опублікувати всі перекладені новини:
```sql
UPDATE news 
SET is_published = true, published_at = NOW()
WHERE is_rewritten = true AND is_published = false;
```

### Переглянути тільки опубліковані новини:
```sql
SELECT * FROM latest_news LIMIT 10;
```

### Знайти новини без картинок:
```sql
SELECT id, title_en, image_url
FROM news
WHERE image_url IS NULL;
```

---

**Створено:** 2025-10-27  
**Версія:** 1.0
