# 🔑 Налаштування Telegram Client API

## 📝 Що це?

**Telegram Client API** дозволяє вашому коду працювати як звичайний Telegram клієнт (як мобільний додаток), а не як бот. Це дає змогу:

- ✅ Читати пости з **будь-яких** публічних каналів
- ✅ Не потрібен доступ адміна
- ✅ Повністю автоматичний моніторинг
- ✅ Більше можливостей ніж Bot API

---

## 🎯 Крок 1: Отримати API Credentials

### 1.1. Відкрийте https://my.telegram.org/auth

1. Введіть ваш **номер телефону** (той що використовуєте в Telegram)
2. Отримаєте **код підтвердження** в Telegram
3. Введіть код

### 1.2. Перейдіть до API Development Tools

URL: https://my.telegram.org/apps

### 1.3. Створіть новий додаток

Заповніть форму:
```
App title: News Monitor (або будь-яка назва)
Short name: newsmonitor
Platform: Other
Description: Automated news monitoring from Telegram channels
```

### 1.4. Отримайте credentials

Після створення ви побачите:
```
App api_id: 1234567
App api_hash: abcdef1234567890abcdef1234567890
```

⚠️ **ВАЖЛИВО:** Збережіть ці дані! Вони потрібні для налаштування.

---

## 🔐 Крок 2: Додати Credentials в Supabase

### 2.1. Відкрийте Supabase Dashboard

https://app.supabase.com/project/uchmopqiylywnemvjttl/settings/secrets

### 2.2. Додайте нові Secrets

Натисніть **"Add new secret"** для кожного:

```
Name: TELEGRAM_API_ID
Value: 1234567 (ваш api_id)

Name: TELEGRAM_API_HASH
Value: abcdef1234567890... (ваш api_hash)

Name: TELEGRAM_SESSION
Value: (залишіть пустим поки що)
```

---

## 📱 Крок 3: Авторізація

### ⚠️ Важлива Примітка про Авторизацію

Telegram Client API потребує **одноразової авторізації** через номер телефону.

### Два підходи:

#### Підхід A: Авторизація через локальний скрипт (РЕКОМЕНДОВАНО)

1. Створити локальний Node.js скрипт
2. Запустити авторизацію
3. Отримати **session string**
4. Додати session string в Supabase Secrets
5. Edge Function використовує цей session (не потрібна повторна авторизація)

#### Підхід B: Авторизація в Edge Function

- Складніше (потрібен stdin для отримання коду)
- Не рекомендується для production

---

## 🖥️ Крок 4: Локальна Авторізація (Підхід A)

### 4.1. Створіть локальний скрипт

Створіть файл `telegram-auth.js`:

```javascript
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');

const apiId = 1234567; // ВАШ api_id
const apiHash = 'your_api_hash'; // ВАШ api_hash
const stringSession = new StringSession(''); // пустий для нової авторізації

(async () => {
  console.log('🔐 Starting Telegram authorization...');

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text('📱 Enter your phone number: '),
    password: async () => await input.text('🔒 Enter your password (if 2FA): '),
    phoneCode: async () => await input.text('📲 Enter the code you received: '),
    onError: (err) => console.log('❌ Error:', err),
  });

  console.log('✅ Successfully authorized!');
  console.log('\n📝 Your session string (save this in Supabase Secrets as TELEGRAM_SESSION):');
  console.log('\n' + client.session.save());
  console.log('\n⚠️  Keep this secret! Anyone with this string can access your account.');

  await client.disconnect();
})();
```

### 4.2. Встановіть залежності

```bash
npm init -y
npm install telegram input
```

### 4.3. Запустіть авторізацію

```bash
node telegram-auth.js
```

Вас попросять:
1. **Номер телефону:** +380xxxxxxxxx
2. **Код з Telegram:** (отримаєте в месенджері)
3. **Пароль 2FA:** (якщо увімкнений)

### 4.4. Збережіть Session String

Скрипт виведе довгий рядок типу:
```
1AgAOMTQ5LjE1NC4xNjUuMjcBuwYVgvdW+DN3...
```

**Скопіюйте його цілком!**

### 4.5. Додайте в Supabase Secrets

Поверніться до Supabase Dashboard → Secrets → TELEGRAM_SESSION:
```
Name: TELEGRAM_SESSION
Value: 1AgAOMTQ5LjE1NC4xNjUuMjcBuwYVgvdW+DN3... (ваш session string)
```

---

## ✅ Перевірка Налаштування

Переконайтеся що у вас є всі 3 secrets в Supabase:

```bash
✓ TELEGRAM_API_ID = 1234567
✓ TELEGRAM_API_HASH = abcdef1234567890...
✓ TELEGRAM_SESSION = 1AgAOMTQ5LjE1NC4xNjUuMjcB...
```

---

## 🚀 Наступні Кроки

Після завершення цих кроків:

1. ✅ Edge Function `telegram-monitor` зможе читати канали
2. ✅ Не потрібна повторна авторізація
3. ✅ Автоматичний моніторинг працюватиме

Перейдіть до файлу `TELEGRAM_MONITOR_DEPLOYMENT.md` для deployment інструкцій.

---

## 🔒 Безпека

### ⚠️ КРИТИЧНО ВАЖЛИВО:

- **НІКОЛИ** не комітьте API credentials в git
- **НІКОЛИ** не діліться session string
- **Session string** = повний доступ до вашого Telegram акаунту!

### Що може хтось з вашим session:

- ✅ Читати всі ваші чати
- ✅ Надсилати повідомлення від вашого імені
- ✅ Приєднуватися до груп/каналів

### Якщо session скомпрометований:

1. Відкличте доступ: https://my.telegram.org/auth → Active sessions → Terminate
2. Створіть новий session через `telegram-auth.js`
3. Оновіть TELEGRAM_SESSION в Supabase

---

## 📊 Обмеження

### Telegram API Limits:

- **Flood limits:** ~20 запитів в 60 секунд на канал
- **Rate limiting:** Telegram може тимчасово обмежити при великій кількості запитів

### Рекомендації:

- Моніторити не більше **10-15 каналів** одночасно
- Інтервал між перевірками: **мінімум 5 хвилин**
- Використовувати cron: `*/5 * * * *` (кожні 5 хвилин)

---

**Створено:** 2025-10-27
**Версія:** 1.0
