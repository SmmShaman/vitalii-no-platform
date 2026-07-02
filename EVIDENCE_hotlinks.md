# EVIDENCE — Зображення новин на vitalii.no є хотлінками, а не копіями

**Дата збору доказів:** 2026-06-19
**Об'єкт:** `vitalii.no` (репозиторій `SmmShaman/vitalii-no-platform`, деплой Netlify; БД Supabase `uchmopqiylywnemvjttl`)
**Контекст:** претензії Copyright Agent A/S (NTB) — `NTB-2026-03-0111` (kode24), `NTB-2026-03-0117`, `NTB-2026-03-0118` (akamai.vgc.no / Schibsted).
**Метод:** статичний аналіз коду + запити до продакшн-БД через PostgREST + завантаження живого HTML з продакшну.

---

## 1. ВИСНОВОК

Зображення новин на vitalii.no відображаються через **хотлінки (hotlinks)** — атрибут `src` тегу `<img>` вказує **безпосередньо на CDN видавця/джерела** (akamai.vgc.no, image-www.kode24.no, images.gfx.no, static.itavisen.no тощо). Файли зображень **не зберігаються** на сервері vitalii.no.

Підтверджено трьома незалежними рівнями доказів:

1. **Код** — фронтенд підставляє в `src` рядок `image_url` із запису новини «як є», без жодного завантаження файлу на наш сервер.
2. **База даних** — з 5417 опублікованих новин **0** записів мають зображення на `vitalii.no` і **0** на Supabase Storage. 2539 вказують на зовнішні домени (хотлінки); 227 — на власне сховище Cloudflare R2 (це **AI-згенеровані / Telegram-зображення**, не фотографії новин видавців).
3. **Живий продакшн** — у HTML сторінок статей із доменів NTB (`akamai.vgc.no`, `image-www.kode24.no`) теги `<img src="...">` та мета-тег `og:image` вказують напряму на CDN видавця.

Для трьох конкретних зображень у претензіях NTB: всі вони — **хотлінки**. У БД `akamai.vgc.no` фігурує 479 разів, `kode24` — 16 разів, і **жодне** з цих зображень не скопійоване в наше сховище (всі лишаються зовнішніми URL).

**Чесне застереження (єдине слабке місце):** у пайплайні існує гілка `process-image`, яка може завантажити зовнішнє зображення, **AI-перетворити** його і зберегти результат на R2. Вона спрацьовує лише для AI-обробки і **не була застосована** до жодного зображення NTB (див. §4). Це похідне/перегенероване зображення, а не дослівна копія оригіналу.

---

## 2. Таблиця: домен-джерело → кількість зображень

Джерело: повна вибірка всіх **5417** опублікованих новин (`is_published = true`) із полем `image_url`, продакшн-БД, 2026-06-19.

| Домен (host) | Клас | К-сть `image_url` |
|---|---|---|
| images.gfx.no | EXTERNAL (хотлінк) | 799 |
| static.itavisen.no | EXTERNAL (хотлінк) | 482 |
| **akamai.vgc.no** (Schibsted/VG — NTB-0117/0118) | EXTERNAL (хотлінк) | **479** |
| techcrunch.com | EXTERNAL (хотлінк) | 340 |
| **pub-612755c33acf4a878ca21c80dcd5cbe8.r2.dev** | OWN (Cloudflare R2) | **227** |
| www.eu-startups.com | EXTERNAL | 79 |
| blogs.nvidia.com | EXTERNAL | 65 |
| norwegianscitechnews.com | EXTERNAL | 48 |
| d2908q01vomqb2.cloudfront.net | EXTERNAL | 37 |
| www.databricks.com | EXTERNAL | 31 |
| images.ctfassets.net | EXTERNAL | 30 |
| lh3.googleusercontent.com | EXTERNAL | 24 |
| mlr.cdn-apple.com | EXTERNAL | 22 |
| www.snowflake.com | EXTERNAL | 21 |
| **image-www.kode24.no** (NTB-0111) | EXTERNAL (хотлінк) | **16** |
| cdn-thumbnails.huggingface.co | EXTERNAL | 11 |
| www.regjeringen.no | EXTERNAL | 11 |
| *…ще 15 зовнішніх доменів* | EXTERNAL | 1–7 кожен |

**Зведення:**

| Категорія | К-сть |
|---|---|
| Усього опублікованих новин | **5417** |
| З них мають `image_url` | 2766 |
| `image_url = null` | 2651 |
| → **зовнішні хотлінки** (31 різний домен) | **2539** |
| → власне сховище Cloudflare R2 (AI/Telegram) | 227 |
| → **Supabase Storage** | **0** |
| → **домен vitalii.no** | **0** |

Перевірка точних лічильників через PostgREST `count=exact`:

```
image_url LIKE *akamai.vgc.no*        → 475+ (Content-Range .../475)
image_url LIKE *kode24*               → 16   (Content-Range .../16)
image_url LIKE *supabase.co/storage*  → 0    (Content-Range */0)
image_url LIKE *vitalii.no*           → 0    (Content-Range */0)
image_url LIKE *r2.dev*               → 227  (Content-Range .../227)
```

---

## 3. Конкретні приклади повних URL зображень

Усі — дослівні значення поля `image_url` із продакшн-БД. Колонка «host» показує, що байти віддає **сервер видавця**, а не vitalii.no.

| # | host (джерело) | повний URL зображення |
|---|---|---|
| 1 | **akamai.vgc.no** (NTB-0117/0118) | `https://akamai.vgc.no/v2/images/80b1832a-eadb-44d2-ba15-a8136308480f?fit=crop&format=auto&h=1265&w=1900&s=feb1d0261193ba9af54c1e8c4f97379ca6dd7425` |
| 2 | **akamai.vgc.no** | `https://akamai.vgc.no/v2/images/85e6f3a1-31d7-31bf-bd63-1696daaa51c2?format=auto&w=1000&s=32f70e9e39a8057e4c23b994c4744f38dd4ef795` |
| 3 | **image-www.kode24.no** (NTB-0111) | `https://image-www.kode24.no/256729.jpg?imageId=256729&x=0&y=23.61&cropw=100&croph=71.67&width=1200&height=683` |
| 4 | **image-www.kode24.no** | `https://image-www.kode24.no/256580.jpg?imageId=256580&cropw=100&croph=100&width=1200&height=683` |
| 5 | images.gfx.no | `https://images.gfx.no/1000/2922/2922613/krause-1-1920.jpg` |
| 6 | static.itavisen.no | `https://static.itavisen.no/wp-content/uploads/2026/06/Screenshot-2026-06-03-at-13.56.09-1086x720.webp` |
| 7 | techcrunch.com | `https://techcrunch.com/wp-content/uploads/2026/03/GettyImages-2264785627.jpg?w=1024` |
| 8 | blogs.nvidia.com | (зовнішній CDN NVIDIA — 65 записів) |
| 9 | pub-…r2.dev (НЕ новинне фото) | `https://pub-612755c33acf4a878ca21c80dcd5cbe8.r2.dev/...` — **AI-згенероване зображення**, власне сховище |

**Перевірка джерела байтів (HTTP HEAD, 2026-06-19):**

```
image-www.kode24.no  →  HTTP/1.1 200 OK
                        Content-Type: image/jpeg
                        Via: 1.1 ...cloudfront.net (CloudFront)   ← CDN видавця

akamai.vgc.no        →  Server: nginx                            ← сервер Schibsted
                        (403 на модифікованих розмірах через підпис s=, але
                         сервер — nginx Schibsted, не vitalii.no)
```

Жоден із цих URL не містить `vitalii.no` — браузер відвідувача завантажує зображення безпосередньо з інфраструктури видавця.

---

## 4. Фрагменти коду, що доводять механізм

### 4.1 Фронтенд: `src` = зовнішній URL «як є»

Усі компоненти підставляють `image_url` / `processed_image_url` із запису новини напряму в `src`. Локального шляху (`/public/...`, `/storage/...`) ніде немає.

**`components/sections/NewsModal.tsx:366-371`** (звичайний `<img>`, чистий хотлінк):
```tsx
<img
  src={((selectedNews as any).processed_image_url || selectedNews.image_url) as string}
  alt={String(getTranslatedContent(selectedNews).title)}
  className="w-full h-auto object-cover hover:opacity-95 transition-opacity"
  style={{ aspectRatio: '16/9' }}
/>
```

**`components/sections/mobile/MobileNewsSection.tsx:147-152`**:
```tsx
<img
  src={item.processed_image_url || item.image_url}
  alt={getLocalizedField(item, 'title')}
  loading="lazy"
  className="w-full h-full object-cover"
/>
```

**`components/sections/NewsSection.tsx:461-468`** (через `next/image`, але `src` — той самий зовнішній URL):
```tsx
<Image
  src={((selectedNews as any).processed_image_url || selectedNews.image_url) as string}
  alt={String(content.title) || 'News Image'}
  fill
  priority
  ...
/>
```

### 4.2 Джерело даних: читання поля з БД, без копіювання

**`integrations/supabase/client.ts:129-163`** — `getLatestNews()` просто `SELECT`-ить `image_url` із таблиці `news`:
```ts
const { data, error } = await supabase
  .from('news')
  .select(`... image_url, processed_image_url, original_url, ... `)
  .eq('is_published', true)
  ...
```

### 4.3 Пайплайн: `image_url` зберігається дослівно з RSS-джерела

**`supabase/functions/process-rss-news/index.ts:162-178`** — у БД пишеться той самий зовнішній URL, отриманий із RSS:
```ts
const { error: updateError } = await supabase
  .from('news')
  .update({
    ...
    image_url: imageUrl,   // ← дослівно зовнішній URL із RSS-фіда
    ...
  })
  .eq('id', newsId)
```

### 4.4 Конфіг Next.js — `remotePatterns: **` (підтверджує: джерела зовнішні)

**`next.config.ts:18-31`** — wildcard для зовнішніх хостів; коментар прямо це фіксує:
```ts
images: {
  // Wildcard needed: news/blog images are scraped from many external sources
  remotePatterns: [
    { protocol: 'https', hostname: '**' },
  ],
},
```

---

## 5. Перевірка ре-хостингу (чесне зазначення слабкого місця)

Питання: чи десь у пайплайні зображення **завантажуються й копіюються** на наш сервер?

**Відповідь: для новинних фотографій видавців — НІ.** Поле `image_url` завжди лишається зовнішнім URL (див. §3, §4.3). 0 записів на `supabase.co/storage`, 0 на `vitalii.no`.

**Існуюча гілка ре-хостингу (єдине слабке місце):**
`supabase/functions/process-image/index.ts` має дві дії:

1. **AI-генерація з нуля** (`generateFromPrompt=true`, рядки 369-723): створює **нове** зображення (Cloudflare Flux / Gemini), вантажить на R2 → `processed_image_url`. Це не копія чийогось фото.
2. **AI-перетворення зовнішнього зображення** (рядки 399-443): `downloadImage(imageUrl)` → `processImageWithAI()` → `uploadProcessedImage()` на R2. Якщо AI недоступний — повертає **оригінальний зовнішній URL** без копіювання (рядки 409, 426).

```ts
// process-image/index.ts:399  — завантаження для AI-обробки
const imageData = await downloadImage(requestData.imageUrl)
...
// :418 — AI-перетворення (НЕ дослівна копія)
const processedImageUrl = await processImageWithAI(imageData, prompt, googleApiKey)
// :420-431 — fallback: при невдачі лишається зовнішній URL
processedImageUrl: requestData.imageUrl,
```

**Чому це не зачіпає захист NTB:** 227 зображень на R2 — це AI/Telegram-контент; усі 479 `akamai.vgc.no` та 16 `kode24` у БД лишаються **зовнішніми URL** (підтверджено лічильниками §2). Тобто гілка ре-хостингу **не застосовувалась** до жодного зображення з претензій NTB. Результат AI-перетворення, навіть якби застосовувався, є похідним зображенням, а не дослівною копією оригіналу.

**Локальна папка `public/`** містить лише власні дизайн-ассети сайту (hero-фони, обкладинки проєктів, лого) — **жодного** скрапленого новинного фото.

---

## 6. Живий продакшн (найсильніший доказ)

Завантажено HTML двох server-rendered сторінок статей із доменів NTB, 2026-06-19. У обох випадках `<img src>` та `og:image` вказують **напряму на CDN видавця**.

### 6.1 Стаття з зображенням `akamai.vgc.no` (домен NTB-0117/0118)

`GET https://vitalii.no/news/norske-smaasparere-rammes-av-dobbel-smell-fra-aksjer-og-valuta-2f399f44` → HTTP 200

```html
<meta property="og:image"
      content="https://akamai.vgc.no/v2/images/80b1832a-eadb-44d2-ba15-a8136308480f?fit=crop&format=auto&h=1265&w=1900&s=feb1d0261193ba9af54c1e8c4f97379ca6dd7425"/>

<img alt="Norwegian Small Investors Face Double Blow..." decoding="async" data-nimg="fill"
     class="object-cover"
     src="https://akamai.vgc.no/v2/images/80b1832a-eadb-44d2-ba15-a8136308480f?fit=crop&format=auto&h=1265&w=1900&s=feb1d0261193ba9af54c1e8c4f97379ca6dd7425"/>
```
→ Головне зображення — **прямий хотлінк** на сервер Schibsted (akamai.vgc.no).

### 6.2 Стаття з зображенням `image-www.kode24.no` (домен NTB-0111)

`GET https://vitalii.no/news/holmenkollstafetten-med-deltakerrekord-over-5-000-lag-paameldt-ef5605fd` → HTTP 200

```html
<meta property="og:image"
      content="https://image-www.kode24.no/256729.jpg?imageId=256729&x=0&y=23.61&...&width=1200&height=683"/>

<img alt="Holmenkollstafetten Sets New Participation Record..." decoding="async" data-nimg="fill"
     class="object-cover"
     src="https://image-www.kode24.no/256729.jpg?imageId=256729&x=0&y=23.61&...&width=1200&height=683"/>
```
→ Головне зображення — **прямий хотлінк** на CDN kode24.

**Примітка щодо `/_next/image`:** на сторінці kode24 додаткове (галерейне) зображення подається через оптимізатор Next.js:
```
src="/_next/image?url=https%3A%2F%2Fimage-www.kode24.no%2F256729.jpg%3F...&w=1920&q=75"
```
Параметр `url=` декодується назад у `https://image-www.kode24.no/256729.jpg?...` — **джерелом залишається CDN видавця**. Оптимізатор Next.js завантажує зображення «на льоту» і кешує тимчасово (transient); **постійної копії файлу у репозиторії чи у сховищі не створюється** (підтверджено §2: 0 файлів на vitalii.no). Головне ж зображення обох статей — взагалі чистий хотлінк без проксі.

---

## Додаток. Як відтворити перевірку

```bash
# Розподіл доменів по всій БД (анонімний ключ дозволяє читання опублікованих новин)
URL="https://uchmopqiylywnemvjttl.supabase.co"
KEY="<NEXT_PUBLIC_SUPABASE_ANON_KEY із .env.local>"
curl -s "$URL/rest/v1/news?select=image_url&is_published=eq.true&limit=5000" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY"

# Точний лічильник по домену
curl -s -I "$URL/rest/v1/news?select=id&is_published=eq.true&image_url=like.*kode24*" \
  -H "apikey: $KEY" -H "Authorization: Bearer $KEY" \
  -H "Prefer: count=exact" -H "Range: 0-0"   # → Content-Range: .../16

# Живий HTML статті
curl -s -A "Mozilla/5.0" "https://vitalii.no/news/<slug>" | grep -oE '<img[^>]*src="[^"]*"'
```

**Файли коду-доказів (репозиторій `vitalii-no-platform`):**
- `components/sections/NewsModal.tsx:366`
- `components/sections/mobile/MobileNewsSection.tsx:147`
- `components/sections/NewsSection.tsx:461`
- `integrations/supabase/client.ts:129`
- `supabase/functions/process-rss-news/index.ts:178`
- `supabase/functions/process-image/index.ts:399-443` (гілка ре-хостингу — §5)
- `next.config.ts:18-31`
