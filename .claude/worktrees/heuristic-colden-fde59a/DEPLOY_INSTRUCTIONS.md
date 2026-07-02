# 📦 Як задеплоїти виправлені Edge Functions

## Варіант 1: Через Supabase Dashboard (найпростіше!)

### 1️⃣ Підготуйте файли

Файли які потрібно оновити:
- `supabase/functions/telegram-scraper/index.ts`
- `supabase/functions/fetch-news/index.ts`
- `supabase/functions/pre-moderate-news/index.ts`

### 2️⃣ Для кожної функції:

1. Відкрийте: https://supabase.com/dashboard/project/uchmopqiylywnemvjttl/functions
2. Натисніть на функцію (наприклад "pre-moderate-news")
3. Натисніть **"Edit function"** або **"Deploy new version"**
4. Скопіюйте вміст файлу з вашого проекту
5. Вставте в editor
6. Натисніть **"Deploy"**

### 3️⃣ Повторіть для всіх 3-х функцій

✅ pre-moderate-news  
✅ telegram-scraper  
✅ fetch-news

---

## Варіант 2: Через Git Integration (якщо налаштовано)

Якщо у вас налаштована інтеграція з GitHub:

1. Supabase Dashboard → Functions → Settings
2. Connect to GitHub repository
3. Select branch: `claude/investigate-duplicate-news-bug-011CUbyydUtLk1y63Qa2nUCT`
4. Supabase автоматично задеплоїть при кожному push

---

## Варіант 3: Через Supabase CLI (для технічних)

```bash
# Встановлення
curl -fsSL https://deno.land/x/install/install.sh | sh
deno install -Afg jsr:@supabase/cli

# Deploy
supabase login
supabase link --project-ref uchmopqiylywnemvjttl
supabase functions deploy telegram-scraper
supabase functions deploy fetch-news
supabase functions deploy pre-moderate-news
```

---

## 🧪 Як перевірити що спрацювало:

1. Видаліть стару rejected новину з БД:
```sql
DELETE FROM news 
WHERE original_title LIKE '%айтишник%';
```

2. Запустіть новий скан через Admin Dashboard

3. Новина має пройти без помилки "Duplicate content detected"!
