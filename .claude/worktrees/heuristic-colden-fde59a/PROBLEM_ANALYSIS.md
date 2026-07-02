# 🔍 Аналіз проблеми: Чому новини не надходять автоматично

## 🎯 Проблема

Ви очікували що:
1. Система автоматично сканує Telegram канали
2. AI робить пре-модерацію
3. Схвалені новини надсилаються вам у Telegram бота

**Але цього не відбувається.**

---

## 🔎 Причини (можливі)

### 1️⃣ Не налаштовані Cron Jobs

Автоматичне сканування працює через **pg_cron** - розклад задач у PostgreSQL.

**Перевірка:** Виконайте в Supabase SQL Editor:
```sql
SELECT * FROM cron.job WHERE jobname LIKE '%telegram%';
```

**Якщо результат порожній** → Cron jobs НЕ налаштовані!

**Рішення:** Виконайте файл `setup-smart-automation-cron.sql`

---

### 2️⃣ Немає активних Telegram джерел

Telegram-scraper потребує активні джерела в БД.

**Перевірка:**
```sql
SELECT * FROM news_sources WHERE source_type = 'telegram' AND is_active = true;
```

**Якщо результат порожній** → Немає джерел для сканування!

**Рішення:** 
1. Відкрийте Admin Dashboard → Settings → News Sources
2. Додайте Telegram канал (наприклад @geekneural)
3. Переконайтесь що `is_active = true`

---

### 3️⃣ Telegram Bot працює тільки з Forward

Згідно з документацією `HOW_CHANNEL_MONITORING_WORKS.md`:

**Спосіб A (Працює ЗАРАЗ):**
- Ви вручну форвардите пости з каналу боту
- Бот обробляє їх

**Спосіб B (Потребує налаштування):**
- telegram-scraper автоматично скрапить канали
- Потребує: Cron jobs + активні джерела

**Можлива причина:** Ви очікували автоматичний Спосіб B, але він не налаштований.

---

### 4️⃣ Відсутні Environment Variables

telegram-scraper потребує:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

**Перевірка:** Supabase Dashboard → Edge Functions → Settings → Secrets

**Якщо відсутні** → Новини не можуть надсилатися в бота!

---

## ✅ ПОВНА ДІАГНОСТИКА

Виконайте файл **`diagnostic-check.sql`** в Supabase SQL Editor.

Це покаже:
1. Які Telegram джерела налаштовані
2. Які cron jobs запущені
3. Останні новини з Telegram
4. Відхилені новини
5. Встановлені extensions

---

## 🚀 ШВИДКЕ РІШЕННЯ

### Крок 1: Увімкніть автоматизацію

```sql
-- Виконайте в Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Створіть cron job
SELECT cron.schedule(
  'telegram-scraper-auto',
  '*/10 * * * *',  -- Кожні 10 хвилин
  $$
  SELECT net.http_post(
    url:='https://uchmopqiylywnemvjttl.supabase.co/functions/v1/telegram-scraper',
    headers:=jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body:='{}'::jsonb
  );
  $$
);
```

### Крок 2: Додайте Telegram джерело

1. Admin Dashboard → Settings → News Sources
2. Quick Add: `@geekneural`
3. Source Type: `telegram`
4. Is Active: ✅

### Крок 3: Налаштуйте Secrets

Supabase → Edge Functions → Settings → Secrets:
- `TELEGRAM_BOT_TOKEN` = `8223281731:AAEUlmDSJCG1RVm2uGOSX-atnQiLEXNfXd8`
- `TELEGRAM_CHAT_ID` = ваш chat ID

### Крок 4: Вручну запустіть скан (для тесту)

```bash
curl -X POST \
  https://uchmopqiylywnemvjttl.supabase.co/functions/v1/telegram-scraper \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

Або через Supabase Dashboard → Edge Functions → telegram-scraper → Invoke

### Крок 5: Перевірте логи

Supabase → Edge Functions → telegram-scraper → Logs

Має бути:
```
🕷️  Scraping channel: @geekneural
📨 Found X posts
🤖 AI Pre-moderation...
✅ Post sent to Telegram bot
```

---

## 📋 Файли для виконання

1. **diagnostic-check.sql** - діагностика системи
2. **setup-smart-automation-cron.sql** - налаштування автоматизації
3. **setup-telegram-scraper-cron.sql** - простий варіант cron job

---

**Виконайте діагностику і скажіть що показало!**
