## AI Image Generation & Upload (December 2024)

### Опис

Інтеграція генерації промптів для зображень через Azure OpenAI та завантаження власних зображень через Telegram бота. Користувач може використовувати згенерований промпт в Google AI Studio (Gemini 3 Banana) для створення зображень або завантажити власне зображення з галереї.

### Файли

```
├── supabase/functions/generate-image-prompt/index.ts  # Edge Function для генерації промпту
├── supabase/functions/telegram-scraper/index.ts       # Виклик generate-image-prompt після пре-модерації
├── supabase/functions/telegram-webhook/index.ts       # Обробка завантаження зображень та callback кнопок
├── supabase/migrations/20251221_add_image_generation_prompt.sql  # Додавання полів для промпту
```

### Workflow

```
1. Новина проходить пре-модерацію (AI)
   ↓
2. Azure OpenAI генерує короткий промпт для зображення (1-3 речення, max 200 символів)
   ↓
3. Промпт показується користувачу в Telegram боті
   ↓
4. Користувач має 2 опції:
   ├─ 🖼️ Залишити поточне зображення (якщо є)
   │  → Підтверджується, що зображення залишено
   │
   └─ 📸 Завантажити власне зображення
      → Бот просить відповісти фото на це повідомлення
      → Користувач відправляє фото
      → Зображення завантажується в Supabase Storage (/custom/)
      → processed_image_url оновлюється в базі
      → Підтвердження з URL зображення
   ↓
5. Користувач може продовжити з публікацією (📰 В новини / 📝 В блог)
```

### Database Fields

**Таблиця `news` (і `blog_posts`):**
- `image_generation_prompt` (TEXT) - AI-згенерований промпт для Google AI Studio
- `prompt_generated_at` (TIMESTAMPTZ) - Час створення промпту
- `processed_image_url` (TEXT) - URL завантаженого зображення (власне або AI-згенероване)
- `image_processed_at` (TIMESTAMPTZ) - Час завантаження зображення

### Telegram Bot UI

```
┌─────────────────────────────────────────────────────┐
│  🆕 New Post from Telegram Channel                  │
│                                                     │
│  Channel: @geekneural                              │
│  Message ID: 12345                                 │
│  Content: Meta Unveils SAM Audio...                │
│                                                     │
│  🎨 Image Generation Prompt (копіюй в Google...): │
│  Professional illustration of audio waveforms...   │
│                                                     │
│  💡 Скопіюй промпт вище та використай в Google...  │
│  ⏳ Waiting for moderation...                       │
├─────────────────────────────────────────────────────┤
│  [📰 В новини]  [📝 В блог]                        │
│  [🖼️ Залишити зображення]  [📸 Завантажити власне]│
│  [🔗 LinkedIn EN] [LinkedIn NO] [LinkedIn UA]      │
│  [❌ Reject]                                        │
└─────────────────────────────────────────────────────┘
```

### Callbacks

| Callback Data | Дія |
|---------------|-----|
| `keep_image_${newsId}` | Залишити поточне зображення |
| `upload_image_${newsId}` | Почати процес завантаження власного зображення |

### Upload Flow

**1. Користувач натискає "📸 Завантажити власне":**
```
✅ Popup: "📸 Відправте фото у відповідь на це повідомлення"
✏️ Повідомлення оновлюється:
   "📸 Очікую фото...
    Reply to this message with your photo
    newsId:abc-123-def-456"
```

**2. Користувач відправляє фото у reply:**
```
1. Telegram webhook перевіряє:
   - Чи це reply на повідомлення?
   - Чи містить фото?
   - Чи текст містить "Очікую фото" та newsId?

2. Завантажує фото з Telegram Bot API
   → Зберігає в Supabase Storage (bucket: news-images, path: custom/${newsId}_${timestamp}.jpg)
   → Отримує публічний URL

3. Оновлює news запис:
   - processed_image_url = publicUrl
   - image_processed_at = now()

4. Підтверджує користувачу:
   "✅ Зображення завантажено!
    📸 URL: https://...
    🆔 News ID: abc-123-def-456"

5. Оновлює оригінальне повідомлення:
   "✅ Власне зображення завантажено"
```

### Generate Image Prompt Function

**Input:**
```json
{
  "newsId": "abc-123-def-456",
  "title": "Meta Unveils SAM Audio: A Breakthrough...",
  "content": "Meta has announced..."
}
```

**Output:**
```json
{
  "success": true,
  "prompt": "Professional illustration of audio waveforms transforming into colorful AI neural networks, modern tech style, vibrant blues and purples"
}
```

### Azure OpenAI Prompt Engineering

**Промпт зберігається в базі даних** (`ai_prompts` таблиця) з типом `image_generation` та може бути відредагований через Admin Panel → Settings → AI Prompts.

**Дефолтний промпт (людино-орієнтований підхід):**
```
Подивися на статтю очима людини якій далека тема але при цьому щось їй ну дуже цікаво.
Як ти вважаєш що саме було б цікаво цій людині? Яка картинка постала перед очима цієї людини?
Напиши одне коротке речення на основі якого я б передав би художнику реалісту твоє бачення!
Це може бути ілюстрація, фото реалістична картинка, футуристична, і тд.
Стиль повинен бути максимально наближений до духу статті.
Сам опис картини повинен бути детальним та зрозумілим з першого погляду навіть без тексту.

Ось стаття:

Заголовок: {title}

Текст: {content}

Твоє бачення (одне речення, max 200 символів):
```

**Плейсхолдери:**
- `{title}` - замінюється на заголовок статті
- `{content}` - замінюється на текст статті (перші 1000 символів)

**Характеристики промпту:**
- Емоційний, людино-орієнтований підхід
- Дивиться на статтю очима звичайної цікавої людини
- Створює детальний візуальний опис
- Виводить одне речення (max 200 символів)
- Адаптується до духу статті

**Як редагувати:**
1. Зайти в Admin Panel → Settings → AI Prompts
2. Знайти промпт "🎨 Генерація опису зображення" (тип: `image_generation`)
3. Відредагувати текст промпту
4. Зберегти зміни
5. Наступні генерації використовуватимуть новий промпт

**Приклади згенерованих описів:**

| Стаття | Згенерований опис (українською) |
|--------|----------------------------------|
| "Meta представила SAM Audio" | Футуристична ілюстрація де звукові хвилі перетворюються на кольорову нейронну мережу ШІ, сучасний tech-стиль з яскравими синьо-фіолетовими тонами |
| "Вчені виявили нову екзопланету" | Художня візуалізація синьо-зеленої планети схожої на Землю з двома сонцями на горизонті, космічний стиль ілюстрації |
| "Новий ШІ інструмент допомагає лікарям" | Чиста медична ілюстрація де штучний інтелект у вигляді світного мозку аналізує дані пацієнтів на голографічних дисплеях |

### Storage Structure

```
news-images/
├── telegram/               # Оригінальні зображення з Telegram
│   └── channelname/
│       ├── 12345.jpg
│       ├── 12345_1.jpg     # Multiple images support
│       └── 12345_2.jpg
└── custom/                 # Власні завантажені зображення
    ├── abc-123_1703123456789.jpg
    └── def-456_1703123456790.jpg
```

### Error Handling

**1. Генерація промпту не вдалася:**
- Новина все одно відправляється в бот
- Промпт не показується
- Кнопки вибору зображення залишаються

**2. Завантаження фото не вдалося:**
- Користувачу показується помилка
- Можна спробувати ще раз
- Оригінальне зображення залишається незмінним

**3. Azure OpenAI недоступний:**
- Функція логує помилку
- Повертає `success: false`
- Telegram бот продовжує працювати без промпту

### Використання промпту

**Google AI Studio (Gemini 3 Banana):**
1. Відкрити [Google AI Studio](https://aistudio.google.com/)
2. Вибрати модель Gemini 3 Banana (або інша з підтримкою генерації зображень)
3. Вставити скопійований промпт
4. Згенерувати зображення
5. Завантажити та відправити в Telegram бота

### Deploy

```bash
cd supabase

# Apply migrations (додає поля та оновлює промпт)
# Виконати SQL з файлів:
# - 20251221_add_image_generation_prompt.sql (додає поля)
# - 20251221_update_image_generation_prompt.sql (оновлює промпт)

# Функції задеплояться автоматично через GitHub Actions при merge в main
# Або вручну:
supabase functions deploy generate-image-prompt
supabase functions deploy telegram-webhook
supabase functions deploy telegram-scraper
```

**ВАЖЛИВО:** Перед deploy переконайтеся що в Supabase Secrets є всі необхідні змінні:
- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

---
