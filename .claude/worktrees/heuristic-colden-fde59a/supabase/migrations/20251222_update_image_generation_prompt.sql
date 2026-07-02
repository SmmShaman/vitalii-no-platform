-- Update image generation prompt to be more human-centered and emotional
-- This prompt helps AI understand the article from a curious person's perspective
-- Can be edited in Admin Panel → Settings → AI Prompts

-- First, check if prompt exists, if not insert it
INSERT INTO ai_prompts (prompt_type, prompt_text, description, is_active, name)
SELECT
  'image_generation',
  'Подивися на статтю очима людини якій далека тема але при цьому щось їй ну дуже цікаво. Як ти вважаєш що саме було б цікаво цій людині? Яка картинка постала перед очима цієї людини? Напиши одне коротке речення на основі якого я б передав би художнику реалісту твоє бачення! Це може бути ілюстрація, фото реалістична картинка, футуристична, і тд. Стиль повинен бути максимально наближений до духу статті. Сам опис картини повинен бути детальним та зрозумілим з першого погляду навіть без тексту.

Ось стаття:

Заголовок: {title}

Текст: {content}

Твоє бачення (одне речення, max 200 символів):',
  'Промпт для генерації опису зображення через людський погляд. Плейсхолдери: {title}, {content}',
  true,
  '🎨 Генерація опису зображення'
WHERE NOT EXISTS (
  SELECT 1 FROM ai_prompts WHERE prompt_type = 'image_generation'
);

-- If it exists, update it
UPDATE ai_prompts
SET
  prompt_text = 'Подивися на статтю очима людини якій далека тема але при цьому щось їй ну дуже цікаво. Як ти вважаєш що саме було б цікаво цій людині? Яка картинка постала перед очима цієї людини? Напиши одне коротке речення на основі якого я б передав би художнику реалісту твоє бачення! Це може бути ілюстрація, фото реалістична картинка, футуристична, і тд. Стиль повинен бути максимально наближений до духу статті. Сам опис картини повинен бути детальним та зрозумілим з першого погляду навіть без тексту.

Ось стаття:

Заголовок: {title}

Текст: {content}

Твоє бачення (одне речення, max 200 символів):',
  description = 'Промпт для генерації опису зображення через людський погляд. Плейсхолдери: {title}, {content}',
  name = '🎨 Генерація опису зображення',
  is_active = true,
  updated_at = NOW()
WHERE prompt_type = 'image_generation';

-- Comment for documentation
COMMENT ON COLUMN ai_prompts.prompt_text IS 'Промпт може містити плейсхолдери: {title}, {content}, {url}, {description} - вони будуть замінені реальним контентом статті';
