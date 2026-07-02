-- Migration: Add AI prompts for social media teaser generation
-- Date: 2025-01-18
-- Purpose: Platform-specific prompts for generating unique teasers

-- LinkedIn prompt (professional, analytical)
INSERT INTO ai_prompts (name, description, prompt_text, prompt_type, is_active)
VALUES (
  '🔗 LinkedIn Teaser Generator',
  'Generates professional, analytical teasers for LinkedIn posts with 2+ paragraphs',
  'Напиши тизер для LinkedIn на основі цієї статті.

Заголовок: {title}
Зміст: {content}

ВИМОГИ:
✅ Мінімум 2 абзаци (обов''язково!)
✅ Професійний тон, але з емоцією
✅ Почни з хуку: питання, факт або інсайт
✅ Використовуй 2-3 емодзі (📊 💡 🚀 ✨ 🎯 📈)
✅ Закінчи call-to-action: "Читати повністю →" або "Дізнатися більше →"
✅ НЕ копіюй текст статті — створи інтригу
✅ Фокус на бізнес-цінності та професійний розвиток

Мова відповіді: {language}

Формат відповіді (СТРОГО дотримуйся):
[Хук з емодзі — питання або цікавий факт]

[Основний текст — чому це важливо для професіоналів, 2-3 речення]

🔗 Читати повністю →',
  'social_teaser_linkedin',
  true
)
ON CONFLICT DO NOTHING;

-- Facebook prompt (emotional, friendly)
INSERT INTO ai_prompts (name, description, prompt_text, prompt_type, is_active)
VALUES (
  '📘 Facebook Teaser Generator',
  'Generates friendly, emotional teasers for Facebook posts with curiosity gap',
  'Напиши тизер для Facebook на основі цієї статті.

Заголовок: {title}
Зміст: {content}

ВИМОГИ:
✅ Мінімум 2 абзаци (обов''язково!)
✅ Дружній, розмовний тон — наче розповідаєш другу
✅ Почни з питання або цікавого факту
✅ Використовуй 3-5 емодзі розподілених по тексту
✅ Додай елемент curiosity gap ("Ви не повірите...", "Виявляється...")
✅ Закінчи запрошенням до дискусії або CTA
✅ НЕ копіюй статтю — зацікав читача

Мова відповіді: {language}

Формат відповіді (СТРОГО дотримуйся):
[Питання або хук з емодзі] 🤔

[Інтригуючий текст — що цікавого, чому варто прочитати, 2-3 речення з емодзі]

[CTA або запрошення до обговорення] 👇',
  'social_teaser_facebook',
  true
)
ON CONFLICT DO NOTHING;

-- Instagram prompt (visual, trending)
INSERT INTO ai_prompts (name, description, prompt_text, prompt_type, is_active)
VALUES (
  '📸 Instagram Teaser Generator',
  'Generates visual, energetic teasers for Instagram with hashtags',
  'Напиши тизер для Instagram на основі цієї статті.

Заголовок: {title}
Зміст: {content}

ВИМОГИ:
✅ Мінімум 2 абзаци (обов''язково!)
✅ Візуальний, енергійний стиль
✅ Використовуй 5-7 емодзі рівномірно розподілених
✅ Додай 5-7 релевантних хештегів в кінці
✅ Почни з emoji-хуку (яскравого!)
✅ Короткі речення, розділені емодзі
✅ Trending вайб — молодіжний, сучасний

Мова відповіді: {language}

Формат відповіді (СТРОГО дотримуйся):
[Емодзі-хук — яскравий початок] ✨

[Текст з емодзі між реченнями — енергійно та візуально]

[CTA з емодзі] 💫

#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5',
  'social_teaser_instagram',
  true
)
ON CONFLICT DO NOTHING;

-- Twitter prompt (short, provocative)
INSERT INTO ai_prompts (name, description, prompt_text, prompt_type, is_active)
VALUES (
  '🐦 Twitter/X Teaser Generator',
  'Generates short, provocative teasers for Twitter/X (max 250 chars)',
  'Напиши тизер для Twitter/X на основі цієї статті.

Заголовок: {title}
Зміст: {content}

ВИМОГИ:
✅ 2 коротких абзаци (до 250 символів загалом!)
✅ Хук ПЕРШИМ — чому це важливо ЗАРАЗ
✅ Використовуй 2-3 емодзі
✅ Провокативний або curiosity-based тон
✅ Закінчи з інтригою (не розкривай всього!)
✅ Без хештегів (вони будуть додані окремо)

Мова відповіді: {language}

Формат відповіді (СТРОГО дотримуйся):
[Хук з емодзі — провокативний або шокуючий] 🔥

[Інтрига — що читач дізнається, чому важливо]',
  'social_teaser_twitter',
  true
)
ON CONFLICT DO NOTHING;
