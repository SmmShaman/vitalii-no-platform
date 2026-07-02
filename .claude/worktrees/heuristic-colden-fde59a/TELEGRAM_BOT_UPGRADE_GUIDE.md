# 🚀 Telegram Bot Upgrade Guide

## 📋 Що Змінилося

Ваш Telegram бот **ВЖЕ існує** і працює, але обробляє тільки кнопки Publish/Reject.

**Додаємо 2 нові функції:**
1. ✅ **Ручна публікація** - ви пишете боту текст/фото → бот обробляє
2. ✅ **Моніторинг каналів** - бот автоматично отримує пости з каналів

---

## 🎯 Крок 1: Замінити Код Edge Function

### Поточний файл:
```
supabase/functions/telegram-webhook/index.ts
```

### Новий файл:
```
supabase/functions/telegram-webhook/index-UPDATED.ts
```

**Що робити:**

```bash
# 1. Перейменувати старий файл (backup)
mv supabase/functions/telegram-webhook/index.ts supabase/functions/telegram-webhook/index-OLD.ts

# 2. Перейменувати новий файл
mv supabase/functions/telegram-webhook/index-UPDATED.ts supabase/functions/telegram-webhook/index.ts

# 3. Задеплоїти
cd supabase
./deploy.sh telegram-webhook
```

---

## 🎯 Крок 2: Використання Бота

### ⚠️ ВАЖЛИВО: Для Публічних Каналів

Якщо ви **НЕ власник** каналів (@geekneural, @digital_gpt4_neyroseti), ви **НЕ МОЖЕТЕ** додати бота як адміна.

### ✅ Рішення: Ручна Пересилка

Замість автоматичного моніторингу використовуйте пересилку:

1. **Відкрийте канал** у Telegram
2. **Виберіть пост** який хочете опублікувати
3. **Forward** → пошукайте вашого бота
4. Бот автоматично обробить пост!

### Для автоматичного моніторингу:

Дивіться `HOW_TO_MONITOR_TELEGRAM_CHANNELS.md` для варіантів:
- RSS Bridge (self-hosted)
- Telegram Client API

---

## 🎯 Крок 3: Тестування

### Тест 1: Автоматичний моніторинг каналу

1. Напишіть пост в одному з ваших каналів (напр. @geekneural)
2. Через 1-5 секунд перевірте:
   ```sql
   SELECT * FROM news ORDER BY created_at DESC LIMIT 1;
   ```
3. Нова новина має з'явитися з `is_published = false`

### Тест 2: Ручна публікація

1. Напишіть боту (@your_bot) будь-який текст
2. Бот має відповісти: `✅ Your message has been sent for processing...`
3. Перевірте БД - нова новина має з'явитися

### Тест 3: Переслане повідомлення

1. Перешліть боту пост з каналу (Forward)
2. Бот має відповісти: `✅ Forwarded message sent for processing!`
3. Новина має з'явитися в БД

### Тест 4: Кнопки (має працювати як раніше)

1. Після обробки новини бот надсилає кнопки
2. Натисніть ✅ Publish
3. Новина має опублікуватися (`is_published = true`)

---

## 📊 Нові Можливості

### 1. Автоматичний моніторинг

Бот автоматично отримує **ВСІ** нові пости з каналів де він адмін.

**Фільтрація:**
- Обробляються тільки канали з таблиці `news_sources` де:
  - `source_type = 'telegram'`
  - `is_active = true`

### 2. Ручна публікація

Надішліть боту:
- Текст
- Текст + фото
- Тільки фото з підписом

Бот обробить і надішле на AI переклад.

### 3. Переслані повідомлення

Якщо перешліть боту пост з каналу - він розпізнає це і обробить як пост з каналу.

---

## 🔍 Troubleshooting

### Бот не отримує пости з каналу

**Причина:** Бот не є адміном
**Рішення:** Додайте бота як адміна (див. Крок 2)

### Бот обробляє не ті канали

**Причина:** Канал не в списку дозволених
**Рішення:** Перевірте таблицю `news_sources`:

```sql
SELECT * FROM news_sources WHERE source_type = 'telegram';
```

Переконайтеся що:
- `url` містить `https://t.me/channel_username`
- `is_active = true`

### Бот не відповідає на повідомлення

**Причина:** Edge Function не задеплоєна або webhook не налаштований
**Рішення:**

```bash
# Перезапустити webhook
./setup-telegram-webhook.ps1
```

Або вручну:
```
https://api.telegram.org/bot{YOUR_TOKEN}/setWebhook?url=https://uchmopqiylywnemvjttl.supabase.co/functions/v1/telegram-webhook
```

### Фото не завантажуються

**Причина:** Помилка при getFile
**Рішення:** Перевірте логи Edge Function:

```
Supabase Dashboard → Edge Functions → telegram-webhook → Logs
```

---

## 📝 Структура Оновленого Коду

```typescript
// Обробник channel_post (НОВИЙ!)
if (update.channel_post) {
  // 1. Перевірити чи канал дозволений
  // 2. Отримати текст і фото
  // 3. Викликати process-news
}

// Обробник message (НОВИЙ!)
if (update.message) {
  // 1. Перевірити чи це forwarded з каналу
  // 2. Отримати текст і фото
  // 3. Викликати process-news
}

// Обробник callback_query (ІСНУЮЧИЙ - БЕЗ ЗМІН!)
if (update.callback_query) {
  // Publish/Reject кнопки
}
```

---

## ✅ Checklist Deployment

- [ ] Замінив код (index-UPDATED.ts → index.ts)
- [ ] Задеплоїв Edge Function (`./deploy.sh telegram-webhook`)
- [ ] Додав бота як адміна в канали:
  - [ ] @digital_gpt4_neyroseti
  - [ ] @geekneural
- [ ] Протестував автоматичний моніторинг (пост в канал)
- [ ] Протестував ручну публікацію (повідомлення боту)
- [ ] Протестував кнопки Publish/Reject
- [ ] Перевірив що новини з'являються в БД
- [ ] Перевірив що AI переклади працюють

---

## 🎉 Готово!

Після deployment ваш бот буде:

1. ✅ **Автоматично читати** нові пости з каналів
2. ✅ **Приймати ручні** повідомлення від вас
3. ✅ **Обробляти переслані** пости з каналів
4. ✅ **Публікувати через кнопки** (як раніше)

**Все в одному боті!** 🚀

---

**Створено:** 2025-10-27
**Бот Token:** `8223281731:AAEUlmDSJCG1RVm2uGOSX-atnQiLEXNfXd8`
**Webhook:** `https://uchmopqiylywnemvjttl.supabase.co/functions/v1/telegram-webhook`
