# 🕷️ Telegram Web Scraper - Повний Гайд

## 🎯 Що це?

**Telegram Web Scraper** - це Edge Function що автоматично збирає пости з публічних Telegram каналів через веб-скрапінг.

### Переваги:
- ✅ **Не потребує авторізації** (без api_id, api_hash, session)
- ✅ **Працює для всіх публічних каналів**
- ✅ **Простий deployment** (1 команда)
- ✅ **Автоматична обробка фото**
- ✅ **Інтеграція з Dashboard**

### Недоліки:
- ⚠️ Може ламатися при змінах дизайну Telegram
- ⚠️ Трохи повільніше ніж API

---

## 🚀 Швидкий Старт (5 хвилин)

### Крок 1: Deploy Edge Function

```bash
./deploy-telegram-scraper.sh
```

Або вручну:
```bash
cd supabase
supabase functions deploy telegram-scraper
```

### Крок 2: Тест

**Варіант A: Через Dashboard**
1. Відкрити: https://app.supabase.com/project/uchmopqiylywnemvjttl/functions
2. Знайти `telegram-scraper`
3. Натиснути **"Invoke function"**

**Варіант B: Через curl**
```bash
curl -X POST \
  "https://uchmopqiylywnemvjttl.supabase.co/functions/v1/telegram-scraper" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

**Варіант C: Через Dashboard UI**
1. Відкрити Admin → Auto Publish Settings
2. Натиснути **"Telegram Monitor"** (використовує telegram-scraper)

### Крок 3: Налаштувати Cron Job

**SQL запит в Supabase:**
```sql
-- Автоматичний скрапінг кожні 10 хвилин
SELECT cron.schedule(
  'telegram-scraper-job',
  '*/10 * * * *',  -- кожні 10 хвилин
  $$
  SELECT
    net.http_post(
      url:='https://uchmopqiylywnemvjttl.supabase.co/functions/v1/telegram-scraper',
      headers:=jsonb_build_object(
        'Content-Type','application/json',
        'Authorization','Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body:='{}'::jsonb
    ) as request_id;
  $$
);
```

**Перевірити cron job:**
```sql
SELECT * FROM cron.job;
```

---

## 🔧 Як це працює

### Архітектура:

```
Cron Job (кожні 10 хв)
        ↓
telegram-scraper Edge Function
        ↓
Для кожного активного каналу:
  1. Fetch https://t.me/s/channel_name
  2. Parse HTML (deno-dom)
  3. Витягти пости (текст, фото, дата)
  4. Фільтрувати нові (після last_fetched_at)
  5. Завантажити фото → Supabase Storage
  6. Викликати process-news для кожного поста
  7. Оновити last_fetched_at
```

### Що скрапить:

З кожного поста витягується:
- **Текст:** повний текст повідомлення
- **Фото:** URL зображення (якщо є)
- **Дата:** точна дата публікації
- **Message ID:** унікальний ідентифікатор
- **Original URL:** https://t.me/channel/messageId

---

## 📊 Додавання Каналів

### Через Dashboard:

1. **Відкрити:** Admin → News Sources Manager
2. **Натиснути:** "Add Source"
3. **Заповнити:**
   ```
   Name: GeekNeural News
   Type: telegram
   URL: https://t.me/geekneural
   Category: tech
   Active: ✓
   Interval: 600 (10 хвилин)
   ```
4. **Зберегти**

### Через SQL:

```sql
INSERT INTO news_sources (name, url, source_type, category, is_active, fetch_interval)
VALUES
  ('GeekNeural', 'https://t.me/geekneural', 'telegram', 'tech', true, 600),
  ('Digital GPT4', 'https://t.me/digital_gpt4_neyroseti', 'telegram', 'ai', true, 600);
```

### Формати URL:

Scraper підтримує всі формати:
```
✅ https://t.me/geekneural
✅ t.me/geekneural
✅ @geekneural
✅ geekneural
```

---

## 🧪 Тестування

### Тест 1: Ручний запуск через Dashboard

1. Відкрити Admin → Auto Publish Settings
2. Натиснути **"Telegram Monitor"**
3. Побачити результат:
   ```
   Моніторинг Telegram завершено! Оброблено: 5 постів
   📡 geekneural: ✅ 3 пости
   📡 digital_gpt4_neyroseti: ✅ 2 пости
   ```

### Тест 2: Перевірка БД

```sql
-- Нові новини з Telegram
SELECT
  title,
  source_url,
  created_at,
  is_published
FROM news
WHERE source_url LIKE '%t.me%'
ORDER BY created_at DESC
LIMIT 10;
```

### Тест 3: Перевірка last_fetched_at

```sql
-- Коли останній раз фетчились канали
SELECT
  name,
  url,
  last_fetched_at,
  EXTRACT(EPOCH FROM (NOW() - last_fetched_at))/60 as minutes_ago
FROM news_sources
WHERE source_type = 'telegram'
ORDER BY last_fetched_at DESC;
```

---

## 📈 Моніторинг

### Перегляд Логів

**Supabase Dashboard:**
https://app.supabase.com/project/uchmopqiylywnemvjttl/logs/edge-functions

**Фільтр:** `telegram-scraper`

**Що дивитись:**
```
🕷️  Scraping channel: @geekneural
📡 Fetching: https://t.me/s/geekneural
✅ Fetched HTML (245678 bytes)
🔍 Found 20 message elements
📨 Found 20 posts
🕒 Filtering posts since: 2025-10-27T18:30:00.000Z
✅ Found 5 new post(s)
🔄 Processing post 123...
📸 Photo uploaded: https://...
✅ Post 123 processed successfully
```

### Метрики

```sql
-- Статистика по каналам за останні 7 днів
SELECT
  DATE(created_at) as date,
  COUNT(*) as posts_count
FROM news
WHERE source_url LIKE '%t.me%'
  AND created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## 🔍 Troubleshooting

### Проблема 1: "No active sources"

**Причина:** Немає активних каналів з `source_type = 'telegram'`

**Рішення:**
```sql
-- Активувати канали
UPDATE news_sources
SET is_active = true
WHERE source_type = 'telegram';
```

### Проблема 2: "Failed to fetch channel: 404"

**Причина:** Канал не існує або приватний

**Рішення:**
- Перевірити що канал публічний: відкрийте https://t.me/s/channel_name в браузері
- Якщо 404 - канал приватний або видалений

### Проблема 3: Не знаходить пости (Found 0 posts)

**Причина:** Telegram змінив структуру HTML

**Рішення:**
1. Відкрити https://t.me/s/channel_name в браузері
2. Inspect Element
3. Подивитись чи є `<div class="tgme_widget_message">`
4. Якщо структура змінилась - потрібно оновити парсер в index.ts

### Проблема 4: Всі пости старі (Found 0 new posts)

**Причина:** `last_fetched_at` занадто недавній

**Рішення:**
```sql
-- Reset last_fetched_at щоб отримати останні 24 години
UPDATE news_sources
SET last_fetched_at = NOW() - INTERVAL '24 hours'
WHERE source_type = 'telegram';
```

### Проблема 5: Фото не завантажуються

**Причина:** Telegram блокує прямі запити до зображень

**Рішення:**
- Скрапер вже має User-Agent
- Якщо не допомагає - фото будуть null (текст все одно обробиться)

---

## ⚙️ Налаштування

### Частота скрапінгу

**Рідкі канали (<5 постів/день):**
```sql
-- Кожні 30 хвилин
SELECT cron.schedule('telegram-scraper-job', '*/30 * * * *', ...);
```

**Помірні канали (5-20 постів/день):**
```sql
-- Кожні 10 хвилин (рекомендовано)
SELECT cron.schedule('telegram-scraper-job', '*/10 * * * *', ...);
```

**Активні канали (>20 постів/день):**
```sql
-- Кожні 5 хвилин
SELECT cron.schedule('telegram-scraper-job', '*/5 * * * *', ...);
```

### Кількість постів для перевірки

У `supabase/functions/telegram-scraper/index.ts` за замовчуванням завантажується ВСЯ сторінка (останні ~20-30 постів).

Якщо потрібно більше - Telegram автоматично показує більше при скролі, але через scraping це важко отримати.

### Rate Limiting

Між каналами є затримка **3 секунди**:
```typescript
await new Promise((resolve) => setTimeout(resolve, 3000))
```

Можна збільшити до 5 сек якщо Telegram блокує:
```typescript
await new Promise((resolve) => setTimeout(resolve, 5000))
```

---

## 🆚 Порівняння з Telegram Client API

| Параметр | Web Scraper | Client API |
|----------|-------------|------------|
| **Авторізація** | Не потрібна | Потрібна (api_id, api_hash, session) |
| **Складність setup** | Дуже легко | Середньо |
| **Час setup** | 5 хвилин | 30 хвилин |
| **Надійність** | Середня (залежить від HTML) | Висока |
| **Швидкість** | Середня | Швидка |
| **Rate Limits** | Немає офіційних | Є (Telegram API limits) |
| **Публічні канали** | ✅ Так | ✅ Так |
| **Приватні канали** | ❌ Ні | ✅ Так (якщо ви член) |
| **Історія постів** | ~20-30 останніх | Будь-яка кількість |

---

## 🔄 Оновлення Function

Якщо потрібно змінити логіку scraping:

```bash
# 1. Відредагувати код
nano supabase/functions/telegram-scraper/index.ts

# 2. Redeploy
./deploy-telegram-scraper.sh

# 3. Тест
curl -X POST \
  "https://uchmopqiylywnemvjttl.supabase.co/functions/v1/telegram-scraper" \
  -H "Authorization: Bearer YOUR_KEY"
```

---

## 📊 Dashboard Integration

Кнопка **"Telegram Monitor"** в `AutoPublishSettings.tsx` викликає:
```typescript
fetch('https://uchmopqiylywnemvjttl.supabase.co/functions/v1/telegram-scraper', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${ANON_KEY}`,
  },
})
```

**Примітка:** Наразі кнопка називається "Telegram Monitor" але викликає `telegram-monitor` (Client API версію).

Щоб переключити на scraper, потрібно змінити в коді:
```typescript
// Було:
'/functions/v1/telegram-monitor'

// Стало:
'/functions/v1/telegram-scraper'
```

---

## ✅ Checklist

### Початкове Налаштування:
- [ ] Deploy telegram-scraper function
- [ ] Додати Telegram канали в news_sources
- [ ] Налаштувати cron job
- [ ] Протестувати ручний запуск
- [ ] Перевірити логи

### Регулярне Обслуговування:
- [ ] Перевіряти логи раз на тиждень
- [ ] Моніторити чи всі канали працюють
- [ ] Якщо Telegram змінить HTML - оновити парсер

---

## 🎉 Готово!

Тепер у вас працює **повністю автоматичний** моніторинг Telegram каналів без будь-якої авторізації!

**Наступні кроки:**
1. Deploy function
2. Додати канали
3. Налаштувати cron
4. Насолоджуватись автоматичними новинами! 🚀

---

**Створено:** 2025-10-27
**Версія:** 1.0
**Метод:** Web Scraping через https://t.me/s/
