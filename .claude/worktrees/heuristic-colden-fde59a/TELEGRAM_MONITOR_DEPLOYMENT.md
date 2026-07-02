# 🚀 Deployment: Telegram Monitor

## 📋 Передумови

Перед deployment переконайтеся що ви завершили:

1. ✅ **TELEGRAM_CLIENT_API_SETUP.md** - отримали API credentials
2. ✅ **Додали Secrets в Supabase:**
   - `TELEGRAM_API_ID`
   - `TELEGRAM_API_HASH`
   - `TELEGRAM_SESSION`

---

## 🔧 Крок 1: Встановити Supabase CLI

### Linux/Mac:
```bash
npm install -g supabase
```

### Або через brew (Mac):
```bash
brew install supabase/tap/supabase
```

### Перевірка:
```bash
supabase --version
```

---

## 🔑 Крок 2: Login до Supabase

```bash
supabase login
```

Відкриється браузер для авторизації. Після успішної авторізації повернутеся в термінал.

---

## 📦 Крок 3: Link до вашого проекту

```bash
supabase link --project-ref uchmopqiylywnemvjttl
```

Введіть пароль БД коли запитає (це пароль від вашої Supabase БД).

---

## 🚀 Крок 4: Deploy Function

### Варіант A: Deploy через CLI (РЕКОМЕНДОВАНО)

```bash
cd supabase
supabase functions deploy telegram-monitor
```

### Варіант B: Deploy через скрипт

Використайте готовий скрипт:

```bash
chmod +x deploy-telegram-monitor.sh
./deploy-telegram-monitor.sh
```

---

## ✅ Крок 5: Перевірка Deployment

### 5.1. Відкрийте Supabase Dashboard

https://app.supabase.com/project/uchmopqiylywnemvjttl/functions

Ви маєте побачити:
- ✅ `telegram-webhook` (існуючий)
- ✅ `telegram-monitor` (новий!)

### 5.2. Тест вручну

Натисніть **"Invoke function"** на `telegram-monitor` або виконайте:

```bash
curl -X POST \
  "https://uchmopqiylywnemvjttl.supabase.co/functions/v1/telegram-monitor" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"
```

### Очікуваний результат:

```json
{
  "ok": true,
  "message": "Monitoring complete",
  "totalProcessed": 5,
  "results": [
    {
      "channel": "geekneural",
      "processed": 3
    },
    {
      "channel": "digital_gpt4_neyroseti",
      "processed": 2
    }
  ]
}
```

---

## ⚙️ Крок 6: Налаштувати Cron Job

### 6.1. Відкрийте SQL Editor

https://app.supabase.com/project/uchmopqiylywnemvjttl/sql/new

### 6.2. Створіть Cron Job

Виконайте SQL:

```sql
-- Create cron job to monitor Telegram channels every 5 minutes
SELECT cron.schedule(
  'telegram-monitor-job',        -- job name
  '*/5 * * * *',                -- every 5 minutes
  $$
  SELECT
    net.http_post(
      url:='https://uchmopqiylywnemvjttl.supabase.co/functions/v1/telegram-monitor',
      headers:=jsonb_build_object(
        'Content-Type','application/json',
        'Authorization','Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body:='{}'::jsonb
    ) as request_id;
  $$
);
```

### 6.3. Перевірте Cron Job

```sql
-- View all cron jobs
SELECT * FROM cron.job;
```

Має бути:
```
jobname               | schedule      | active
----------------------|---------------|--------
fetch-news-hourly     | 0 * * * *     | t
telegram-monitor-job  | */5 * * * *   | t
```

---

## 📊 Крок 7: Моніторинг

### 7.1. Перегляд Логів

У Supabase Dashboard:
https://app.supabase.com/project/uchmopqiylywnemvjttl/logs/edge-functions

Фільтр: `telegram-monitor`

### 7.2. Перевірка БД

```sql
-- Check latest news from Telegram
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

### 7.3. Перевірка last_fetched_at

```sql
-- Check when sources were last fetched
SELECT
  name,
  url,
  is_active,
  last_fetched_at
FROM news_sources
WHERE source_type = 'telegram'
ORDER BY last_fetched_at DESC;
```

---

## 🔍 Troubleshooting

### Проблема 1: "Missing Telegram API credentials"

**Причина:** Secrets не налаштовані в Supabase.

**Рішення:**
1. Перейдіть: https://app.supabase.com/project/uchmopqiylywnemvjttl/settings/secrets
2. Додайте всі 3 secrets:
   - TELEGRAM_API_ID
   - TELEGRAM_API_HASH
   - TELEGRAM_SESSION
3. **Важливо:** Після додавання secrets потрібно **redeploy** function!

```bash
supabase functions deploy telegram-monitor
```

### Проблема 2: "Session expired" / "Unauthorized"

**Причина:** Session string застарів або неправильний.

**Рішення:**
1. Запустіть `telegram-auth.js` заново (з `TELEGRAM_CLIENT_API_SETUP.md`)
2. Отримайте новий session string
3. Оновіть `TELEGRAM_SESSION` в Supabase Secrets
4. Redeploy:
```bash
supabase functions deploy telegram-monitor
```

### Проблема 3: "FloodWaitError: A wait of X seconds is required"

**Причина:** Перевищено rate limit Telegram.

**Рішення:**
1. Зменшіть частоту cron job (напр. з `*/5` на `*/10` - кожні 10 хвилин)
2. Зменшіть кількість моніторних каналів
3. Збільшіть затримку між каналами в коді (зараз 2 сек)

### Проблема 4: No new messages found

**Причина:** Можливо канали неактивні або `last_fetched_at` занадто недавній.

**Рішення:**
```sql
-- Reset last_fetched_at to fetch last 24 hours
UPDATE news_sources
SET last_fetched_at = NOW() - INTERVAL '24 hours'
WHERE source_type = 'telegram';
```

Потім викличте function вручну.

---

## 🎯 Оптимізація

### Налаштування частоти

**Для активних каналів (>10 постів/день):**
```sql
-- Every 5 minutes
SELECT cron.schedule('telegram-monitor-job', '*/5 * * * *', ...);
```

**Для помірних каналів (2-5 постів/день):**
```sql
-- Every 15 minutes
SELECT cron.schedule('telegram-monitor-job', '*/15 * * * *', ...);
```

**Для рідких каналів (<1 пост/день):**
```sql
-- Every hour
SELECT cron.schedule('telegram-monitor-job', '0 * * * *', ...);
```

### Обмеження кількості повідомлень

У `supabase/functions/telegram-monitor/index.ts:103`:

```typescript
const messages = await client.getMessages(entity, {
  limit: 20, // Збільште до 50 для дуже активних каналів
})
```

---

## 📈 Metrics

### Успішний Deployment:

- ✅ Function з'являється в Dashboard
- ✅ Manual invoke повертає `{ ok: true }`
- ✅ Нові записи з'являються в `news` таблиці
- ✅ `last_fetched_at` оновлюється після кожного запуску
- ✅ Cron job активний і викликається автоматично

### Перевірка Performance:

```sql
-- Count news from Telegram per day
SELECT
  DATE(created_at) as date,
  COUNT(*) as news_count
FROM news
WHERE source_url LIKE '%t.me%'
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 7;
```

---

## 🔄 Оновлення Function

Якщо ви вносите зміни в `telegram-monitor/index.ts`:

```bash
# 1. Збережіть зміни
git add supabase/functions/telegram-monitor/index.ts
git commit -m "Update telegram-monitor function"

# 2. Redeploy
cd supabase
supabase functions deploy telegram-monitor

# 3. Test
curl -X POST \
  "https://uchmopqiylywnemvjttl.supabase.co/functions/v1/telegram-monitor" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

---

## 🎉 Готово!

Після завершення всіх кроків:

- ✅ Telegram Client API підключено
- ✅ Edge Function deployed
- ✅ Cron job працює автоматично кожні 5 хвилин
- ✅ Нові пости з каналів автоматично обробляються
- ✅ Dashboard показує статус моніторингу

**Наступний крок:** `DASHBOARD_INTEGRATION.md` - додати контроль в Admin UI

---

**Створено:** 2025-10-27
**Версія:** 1.0
