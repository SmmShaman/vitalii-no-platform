## Professional Image Prompt Generation System (January 2026)

### Опис

Нова система генерації промптів для зображень на основі **двоетапного підходу**: класифікатор витягує структуровані дані зі статті, потім шаблон заповнюється цими даними. Замінює творчий AI-підхід на детермінований template-based підхід.

**Методологія:** Базується на [awesome-nanobanana-pro](https://github.com/ZeroLu/awesome-nanobanana-pro) репозиторії.

### Архітектура

```
┌─────────────────────────────────────────────────────────────┐
│  1. ВХІДНІ ДАНІ (зі статті)                                 │
│     • title, content, tags, source_link                     │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  2. CLASSIFIER (Azure OpenAI)                               │
│                                                             │
│     Витягує JSON:                                           │
│     {                                                       │
│       "company_name": "Higgsfield",                         │
│       "company_domain": "higgsfield.ai",                    │
│       "category": "tech_product",                           │
│       "product_type": "AI Platform",                        │
│       "key_features": ["30 sec videos", "customization"],   │
│       "visual_elements": ["AI avatar", "UI panels"],        │
│       "visual_concept": "AI influencer emerging from UI",   │
│       "color_scheme": "electric blue, magenta",             │
│       "style_hint": "tech infographic"                      │
│     }                                                       │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  3. TEMPLATE SELECTION                                      │
│                                                             │
│     category → template                                     │
│     "tech_product" → image_template_tech_product            │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  4. TEMPLATE FILLING                                        │
│                                                             │
│     {company_name} → "Higgsfield"                           │
│     {visual_elements} → "AI avatar, UI panels"              │
│     {key_features_formatted} → "□ 30 SEC VIDEOS..."         │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  5. ГОТОВИЙ ПРОМПТ                                          │
│                                                             │
│     Professional tech infographic poster...                 │
│     Logo: "HIGGSFIELD" in white uppercase...                │
│     Visual: AI influencer emerging from UI...               │
└─────────────────────────────────────────────────────────────┘
```

### Категорії та шаблони

| Категорія | prompt_type | Приклади контенту |
|-----------|-------------|-------------------|
| **Tech Product** | `image_template_tech_product` | Higgsfield, HeyGen, SaaS платформи |
| **Marketing Campaign** | `image_template_marketing_campaign` | Icelandair, бренд-активації |
| **AI Research** | `image_template_ai_research` | GPT-5, нові моделі, дослідження |
| **Business News** | `image_template_business_news` | Корпоративні новини, M&A |
| **Science** | `image_template_science` | Наукові відкриття, освіта |
| **Lifestyle** | `image_template_lifestyle` | Подорожі, культура, розваги |
| **General** | `image_template_general` | Універсальний fallback |

### Database: Нові промпти в `ai_prompts`

| prompt_type | Назва | Призначення |
|-------------|-------|-------------|
| `image_classifier` | 🔍 Image Prompt Classifier | Витягує JSON з даними |
| `image_template_tech_product` | 🖥️ Tech Product Template | Шаблон для tech/SaaS |
| `image_template_marketing_campaign` | 📢 Marketing Campaign Template | Шаблон для маркетингу |
| `image_template_ai_research` | 🤖 AI Research Template | Шаблон для AI новин |
| `image_template_business_news` | 📊 Business News Template | Шаблон для бізнесу |
| `image_template_science` | 🔬 Science Template | Шаблон для науки |
| `image_template_lifestyle` | ✨ Lifestyle Template | Шаблон для lifestyle |
| `image_template_general` | 📰 General Template | Універсальний fallback |

### Кольори за категоріями

```typescript
const CATEGORY_COLORS = {
  'tech_product':       { primary: '#00E5FF', secondary: '#FF2D92' },
  'marketing_campaign': { primary: '#FF6B35', secondary: '#004E89' },
  'ai_research':        { primary: '#7C3AED', secondary: '#00E5FF' },
  'business_news':      { primary: '#0066CC', secondary: '#00AA55' },
  'science':            { primary: '#10B981', secondary: '#3B82F6' },
  'lifestyle':          { primary: '#F59E0B', secondary: '#EC4899' },
  'general':            { primary: '#6366F1', secondary: '#8B5CF6' },
}
```

### Placeholders в шаблонах

| Placeholder | Заміна | Приклад |
|-------------|--------|---------|
| `{company_name}` | Назва компанії | "Higgsfield" |
| `{company_domain}` | Домен сайту | "higgsfield.ai" |
| `{product_type}` | Тип продукту | "AI Platform" |
| `{visual_concept}` | Візуальна концепція | "AI avatar emerging from UI" |
| `{visual_elements}` | Список елементів | "AI avatar, UI panels, video preview" |
| `{key_features_formatted}` | Фічі як bullets | "□ 30 SEC VIDEOS\n□ CUSTOMIZATION" |
| `{color_primary}` | Основний колір | "#00E5FF" |
| `{color_secondary}` | Додатковий колір | "#FF2D92" |
| `{color_scheme}` | Опис кольорів | "electric blue, magenta" |
| `{cta_text}` | Call-to-action | "Learn More" |

### Edge Function Response

**Новий формат відповіді:**
```json
{
  "success": true,
  "prompt": "Professional tech infographic poster...",
  "classifierData": {
    "company_name": "Higgsfield",
    "category": "tech_product",
    "visual_concept": "..."
  },
  "templateUsed": "image_template_tech_product"
}
```

### Приклад: Icelandair Marketing Campaign

**Вхідна стаття:**
> Icelandair Invites Londoners to Distinguish Real Icelandic Landscapes from AI-Generated Images...

**Classifier Output:**
```json
{
  "company_name": "Icelandair",
  "company_domain": "icelandair.com",
  "category": "marketing_campaign",
  "product_type": "Airline",
  "key_features": ["Real vs AI challenge", "London activation", "Iceland tourism"],
  "visual_elements": ["glacier", "volcanic beach", "waterfall", "northern lights"],
  "visual_concept": "Split-screen comparing real Iceland landscape with AI-generated version",
  "color_scheme": "icy blues, volcanic blacks, aurora green",
  "style_hint": "travel advertising meets tech exhibition"
}
```

**Template:** `image_template_marketing_campaign`

**Final Prompt:**
```
Professional marketing campaign poster with brand identity.

HEADER:
- Logo: "Icelandair" brand wordmark prominently displayed
- Campaign tagline or event name below

CENTRAL VISUAL:
Split-screen comparing real Iceland landscape with AI-generated version
- Main visual elements: glacier, volcanic beach, waterfall, northern lights
- Human silhouettes or figures for scale and engagement
- Dynamic composition with visual tension/contrast

CAMPAIGN INFO:
- Key message or question that creates curiosity
- Location/event details if applicable
- Call-to-action: "Learn More"

STYLE:
- Color palette: icy blues, volcanic blacks, aurora green
- Premium advertising aesthetic
- National Geographic meets modern brand campaign
- High contrast, attention-grabbing
- 4:5 aspect ratio

BOTTOM:
- Website URL: "icelandair.com"
- Brand logo repeated smaller

CRITICAL: "Icelandair" logo must be perfectly legible. Create visual that makes viewers stop scrolling.
```

### Переваги нового підходу

| Було (Creative AI) | Стало (Template-based) |
|--------------------|------------------------|
| AI придумує опис | AI тільки витягує факти |
| Непередбачуваний результат | Детермінований результат |
| Абстрактні образи | Конкретна інфографіка |
| Без логотипу | Точна назва компанії |
| Творчий підхід | Професійний підхід |

### Файли

```
├── supabase/functions/generate-image-prompt/index.ts     # Edge Function (v2)
├── supabase/migrations/20260122_add_image_prompt_templates.sql  # Шаблони
```

### Редагування шаблонів

Шаблони можна редагувати через **Admin Panel → Settings → AI Prompts**.

Шукайте промпти з типами:
- `image_classifier`
- `image_template_*`

### Deploy

```bash
cd supabase

# Міграція виконається автоматично через GitHub Actions
# Або вручну:
supabase functions deploy generate-image-prompt
```

---
