-- Migration: Fix CTA localization in social media teaser prompts
-- Date: 2025-02-05
-- Purpose: Update AI prompts to generate language-specific CTAs instead of Ukrainian-only

-- LinkedIn prompt - update CTA instructions
UPDATE ai_prompts
SET prompt_text = 'Напиши тизер для LinkedIn на основі цієї статті.

Заголовок: {title}
Зміст: {content}

ВИМОГИ:
✅ Мінімум 2 абзаци (обов''язково!)
✅ Професійний тон, але з емоцією
✅ Почни з хуку: питання, факт або інсайт
✅ Використовуй 2-3 емодзі (📊 💡 🚀 ✨ 🎯 📈)
✅ НЕ копіюй текст статті — створи інтригу
✅ Фокус на бізнес-цінності та професійний розвиток

✅ Закінчи call-to-action МОВОЮ ВІДПОВІДІ:
   - English: "Read full article →"
   - Norwegian: "Les hele artikkelen →"
   - Ukrainian: "Читати повністю →"
НЕ КОПІЮЙ приклади буквально! Напиши CTA мовою {language}.

Мова відповіді: {language}

Формат відповіді (СТРОГО дотримуйся):
[Хук з емодзі — питання або цікавий факт]

[Основний текст — чому це важливо для професіоналів, 2-3 речення]

🔗 [CTA мовою відповіді] →',
    updated_at = NOW()
WHERE prompt_type = 'social_teaser_linkedin';

-- Facebook prompt - update CTA instructions
UPDATE ai_prompts
SET prompt_text = 'Напиши тизер для Facebook на основі цієї статті.

Заголовок: {title}
Зміст: {content}

ВИМОГИ:
✅ Мінімум 2 абзаци (обов''язково!)
✅ Дружній, розмовний тон — наче розповідаєш другу
✅ Почни з питання або цікавого факту
✅ Використовуй 3-5 емодзі розподілених по тексту
✅ Додай елемент curiosity gap ("Ви не повірите...", "Виявляється...")
✅ НЕ копіюй статтю — зацікав читача

✅ Закінчи CTA або запрошенням до дискусії МОВОЮ ВІДПОВІДІ:
   - English: "Read more →" / "Share your thoughts 👇"
   - Norwegian: "Les mer →" / "Del dine tanker 👇"
   - Ukrainian: "Читати далі →" / "Що думаєте? 👇"
НЕ КОПІЮЙ приклади буквально! Напиши CTA мовою {language}.

Мова відповіді: {language}

Формат відповіді (СТРОГО дотримуйся):
[Питання або хук з емодзі] 🤔

[Інтригуючий текст — що цікавого, чому варто прочитати, 2-3 речення з емодзі]

[CTA або запрошення до обговорення мовою відповіді] 👇',
    updated_at = NOW()
WHERE prompt_type = 'social_teaser_facebook';

-- Instagram prompt - update CTA instructions
UPDATE ai_prompts
SET prompt_text = 'Напиши тизер для Instagram на основі цієї статті.

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

✅ CTA МОВОЮ ВІДПОВІДІ:
   - English: "Check it out! 💫" / "Link in bio 🔗"
   - Norwegian: "Sjekk det ut! 💫" / "Link i bio 🔗"
   - Ukrainian: "Переходь за посиланням! 💫" / "Посилання в біо 🔗"
НЕ КОПІЮЙ приклади буквально! Напиши CTA мовою {language}.

Мова відповіді: {language}

Формат відповіді (СТРОГО дотримуйся):
[Емодзі-хук — яскравий початок] ✨

[Текст з емодзі між реченнями — енергійно та візуально]

[CTA мовою відповіді] 💫

#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5',
    updated_at = NOW()
WHERE prompt_type = 'social_teaser_instagram';

-- Twitter prompt - update CTA instructions
UPDATE ai_prompts
SET prompt_text = 'Напиши тизер для Twitter/X на основі цієї статті.

Заголовок: {title}
Зміст: {content}

ВИМОГИ:
✅ 2 коротких абзаци (до 250 символів загалом!)
✅ Хук ПЕРШИМ — чому це важливо ЗАРАЗ
✅ Використовуй 2-3 емодзі
✅ Провокативний або curiosity-based тон
✅ Закінчи з інтригою (не розкривай всього!)
✅ Без хештегів (вони будуть додані окремо)

✅ Пиши МОВОЮ ВІДПОВІДІ:
   - English: use English
   - Norwegian: use Norwegian
   - Ukrainian: use Ukrainian

Мова відповіді: {language}

Формат відповіді (СТРОГО дотримуйся):
[Хук з емодзі — провокативний або шокуючий] 🔥

[Інтрига — що читач дізнається, чому важливо]',
    updated_at = NOW()
WHERE prompt_type = 'social_teaser_twitter';
