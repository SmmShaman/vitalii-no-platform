# 📱 Telegram Channel Monitoring - Quick Start Guide

## 🎯 Огляд

Ви можете моніторити **публічні** Telegram канали двома способами:

### ✅ Варіант 1: Ручна Пересилка (Працює ЗАРАЗ)
**Найпростіше рішення** - використовує існуючий Telegram бот.

### ✅ Варіант 2: Автоматичний Моніторинг (Потребує Налаштування)
**Повністю автоматично** - використовує Telegram Client API.

---

## 🚀 Варіант 1: Ручна Пересилка

### Як працює:
```
Ви бачите пост в каналі → Forward боту → Бот обробляє автоматично
```

### Інструкція:

1. **Відкрийте канал** (напр. @geekneural) у Telegram
2. **Виберіть пост** який хочете опублікувати
3. **Натисніть Forward** → знайдіть вашого бота
4. **Готово!** Бот відповість: `✅ Forwarded message sent for processing!`

### Переваги:
- ✅ Працює ЗАРАЗ (не потрібно deployment)
- ✅ Працює для БУДЬ-ЯКИХ каналів
- ✅ Ви контролюєте які пости публікувати
- ✅ Немає rate limits

### Недоліки:
- ❌ Потрібна ваша дія для кожного поста

---

## 🤖 Варіант 2: Автоматичний Моніторинг

### Що це дає:
- ✅ Повністю автоматично
- ✅ Моніторить публічні канали без доступу адміна
- ✅ Інтеграція з Dashboard (кнопка "Telegram Monitor")
- ✅ Cron job кожні 5 хвилин

### Швидкий Старт (3 кроки):

#### 📝 Крок 1: Отримати API Credentials

1. Відкрийте: https://my.telegram.org/auth
2. Введіть номер телефону → отримайте код в Telegram
3. Перейдіть до: https://my.telegram.org/apps
4. Створіть додаток → отримаєте `api_id` і `api_hash`

**Детально:** `TELEGRAM_CLIENT_API_SETUP.md`

#### 🔑 Крок 2: Авторізуватися

```bash
# 1. Встановити залежності
npm install telegram input

# 2. Відредагувати telegram-auth.js
# Замінити apiId та apiHash на ваші

# 3. Запустити авторізацію
node telegram-auth.js

# 4. Скопіювати session string
```

**Детально:** `TELEGRAM_CLIENT_API_SETUP.md` (Крок 4)

#### 🚀 Крок 3: Deploy

1. **Додати Secrets в Supabase:**
   - Відкрити: https://app.supabase.com/project/uchmopqiylywnemvjttl/settings/secrets
   - Додати 3 secrets:
     - `TELEGRAM_API_ID` = ваш api_id
     - `TELEGRAM_API_HASH` = ваш api_hash
     - `TELEGRAM_SESSION` = session string з telegram-auth.js

2. **Deploy Edge Function:**
   ```bash
   ./deploy-telegram-monitor.sh
   ```

3. **Налаштувати Cron Job** (SQL в Supabase):
   ```sql
   SELECT cron.schedule(
     'telegram-monitor-job',
     '*/5 * * * *',  -- кожні 5 хвилин
     $$
     SELECT net.http_post(
       url:='https://uchmopqiylywnemvjttl.supabase.co/functions/v1/telegram-monitor',
       headers:=jsonb_build_object(
         'Content-Type','application/json',
         'Authorization','Bearer ' || current_setting('app.settings.service_role_key')
       )
     );
     $$
   );
   ```

**Детально:** `TELEGRAM_MONITOR_DEPLOYMENT.md`

---

## 📊 Використання Dashboard

### Після Deployment:

1. **Відкрийте Dashboard** → Admin → Auto Publish Settings
2. **Натисніть "Telegram Monitor"** для ручного запуску
3. **Побачите результати:**
   ```
   Моніторинг Telegram завершено! Оброблено: 5 постів
   📡 geekneural: ✅ 3 постів
   📡 digital_gpt4_neyroseti: ✅ 2 пости
   ```

### Додавання Каналів:

У Dashboard → News Sources Manager:

```
Type: telegram
URL: https://t.me/geekneural
Active: ✓
Interval: 1 година (3600 сек)
```

---

## 🔍 Порівняння Варіантів

| Параметр | Ручна Пересилка | Автоматичний Monitor |
|----------|-----------------|---------------------|
| **Складність** | Дуже легко | Потребує налаштування |
| **Час** | 2 хвилини | 30 хвилин (одноразово) |
| **Автоматизація** | Ні | Так |
| **Доступ до каналів** | Будь-які | Будь-які публічні |
| **Rate Limits** | Немає | Є (Telegram API) |
| **Dashboard** | Ні | Так |
| **Cron Job** | Ні | Так |

---

## 📚 Документація

### Основні Гайди:

1. **TELEGRAM_CLIENT_API_SETUP.md**
   - Детальні інструкції отримання credentials
   - Авторізація через telegram-auth.js
   - Безпека та best practices

2. **TELEGRAM_MONITOR_DEPLOYMENT.md**
   - Deployment через Supabase CLI
   - Налаштування Cron Job
   - Troubleshooting
   - Оптимізація

3. **HOW_TO_MONITOR_TELEGRAM_CHANNELS.md**
   - Всі 3 варіанти моніторингу
   - RSS Bridge (self-hosted)
   - Порівняння підходів

4. **HOW_CHANNEL_MONITORING_WORKS.md**
   - Архітектура системи
   - Dashboard інтеграція
   - Як додавати/видаляти канали

### Технічна Документація:

- **supabase/functions/telegram-monitor/index.ts** - код Edge Function
- **telegram-auth.js** - скрипт авторізації
- **deploy-telegram-monitor.sh** - deployment скрипт

---

## 🆘 Допомога

### Помилка: "Missing Telegram API credentials"
**Рішення:** Додайте всі 3 secrets в Supabase і redeploy function

### Помилка: "Session expired"
**Рішення:** Запустіть `telegram-auth.js` заново і оновіть TELEGRAM_SESSION

### Помилка: "FloodWaitError"
**Рішення:** Зменшіть частоту cron job (напр. кожні 10 хвилин замість 5)

### Не з'являються нові пости
**Рішення:**
```sql
-- Reset last_fetched_at
UPDATE news_sources
SET last_fetched_at = NOW() - INTERVAL '24 hours'
WHERE source_type = 'telegram';
```

---

## 🎯 Рекомендація

### Для початку:
**Використовуйте Варіант 1 (Ручна Пересилка)** - працює відразу без налаштувань!

### Якщо потрібна автоматизація:
**Налаштуйте Варіант 2 (Автоматичний Monitor)** - займе ~30 хвилин одноразово.

---

## ✅ Checklist

### Варіант 1 (Ручна Пересилка):
- [ ] Відкрити канал у Telegram
- [ ] Forward пост боту
- [ ] Перевірити що бот відповів
- [ ] Натиснути ✅ Publish в боті

### Варіант 2 (Автоматичний):
- [ ] Отримати API credentials з my.telegram.org
- [ ] Запустити telegram-auth.js і отримати session
- [ ] Додати 3 secrets в Supabase
- [ ] Deploy telegram-monitor function
- [ ] Налаштувати cron job
- [ ] Протестувати через Dashboard

---

**Створено:** 2025-10-27
**Версія:** 1.0
**Бот Token:** `8223281731:AAEUlmDSJCG1RVm2uGOSX-atnQiLEXNfXd8`
**Supabase Project:** `uchmopqiylywnemvjttl`
