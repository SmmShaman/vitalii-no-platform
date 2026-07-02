## Social Media Duplicate Prevention & Instagram Fixes (January 2025)

### Опис

Виправлення дублікатів постів в соцмережах та покращення Instagram інтеграції.

### Проблема 1: Дублікати постів (Race Condition)

**Симптоми:**
- Два однакових пости в Instagram при натисканні combo button
- "Already posted" показується хоча пост ще не публікувався

**Причина:**
Функція `wasAlreadyPosted` перевіряла тільки записи зі статусом `'posted'`. Але запис створюється зі статусом `'pending'` **ДО** фактичної публікації:

```
Запит 1: wasAlreadyPosted() → false → createSocialPost(pending) → публікуємо...
Запит 2: wasAlreadyPosted() → false (запис 1 ще 'pending'!) → createSocialPost(pending) → публікуємо...
→ Обидва пости публікуються! ❌
```

**Рішення:**
Тепер `wasAlreadyPosted` перевіряє **і `posted` і `pending`** записи:

```typescript
// Було
.eq('status', 'posted')

// Стало
.in('status', ['posted', 'pending'])
```

### Проблема 2: Instagram не підтримує клікабельні посилання

**Факт:** Instagram **НЕ ПІДТРИМУЄ** гіперлінки в підписах до постів. Це обмеження платформи Instagram, а не баг.

**Рішення:**
Замінено повний URL на короткий текст:

```typescript
// Було
const link = `\n\n${url}`;  // https://vitalii.no/news/long-slug-here

// Стало
const linkText = `\n\n🔗 Читати на vitalii.no`;
```

### Проблема 3: Instagram media validation в combo_all_en_no

**Симптоми:**
- Кнопка "🌍 EN+NO All" показувала довгу помилку про Telegram embed URLs
- Instagram не перевіряв наявність медіа перед публікацією

**Рішення:**
Додано перевірку медіа перед Instagram публікацією в combo handler:
- Якщо є Telegram відео + GitHub Actions → тригерить `instagram-video` workflow
- Якщо немає валідного медіа → показує коротке "Немає зображення"
- Якщо є зображення/відео → публікує нормально

### Змінені файли

| Файл | Зміни |
|------|-------|
| `_shared/social-media-helpers.ts` | `wasAlreadyPosted` повертає `{ posted, pending, postUrl }` |
| `_shared/facebook-helpers.ts` | `formatInstagramCaption` - короткий link text |
| `post-to-facebook/index.ts` | Обробка `pending` статусу |
| `post-to-instagram/index.ts` | Обробка `pending` статусу |
| `telegram-webhook/index.ts` | Instagram media validation в combo_all_en_no |

### Як працює захист від дублікатів

```
1. Запит на публікацію
2. wasAlreadyPosted() перевіряє:
   - status = 'posted' → Already posted!
   - status = 'pending' → Already in progress!
   - немає записів → Продовжуємо
3. createSocialPost(status: 'pending')
4. Публікуємо в соцмережу
5. updateSocialPostSuccess(status: 'posted')
```

Тепер другий запит побачить `pending` запис і пропустить публікацію.
