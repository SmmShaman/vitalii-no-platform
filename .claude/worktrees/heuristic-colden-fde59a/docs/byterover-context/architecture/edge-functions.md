## Supabase Edge Functions Reference

Всі Edge Functions написані на Deno та знаходяться в `/supabase/functions/`.

| Функція | Опис | Тригер | Input → Output |
|---------|------|--------|----------------|
| **telegram-scraper** | Скрапінг RSS/Telegram каналів, детекція медіа | Scheduled / Manual | news_sources → news records |
| **pre-moderate-news** | AI фільтрація спаму/реклами через Azure OpenAI | telegram-scraper | news content → status (approved/rejected) |
| **generate-image-prompt** | AI генерація описів для зображень | pre-moderate-news | title + content → image prompt |
| **process-news** | AI переклад контенту на EN/NO/UA | Telegram bot | news + language → translated content |
| **process-blog-post** | Конвертація новини в блог-пост | Telegram bot "📝 В блог" | news ID → blog_posts record |
| **post-to-linkedin** | Публікація в LinkedIn через OAuth 2.0 | Telegram bot LinkedIn buttons | news/blog ID → linkedin_post_id |
| **generate-social-teasers** | AI генерація унікальних тизерів для соцмереж | post-to-linkedin, telegram-webhook | title + content → platform-specific teaser |
| **telegram-webhook** | Обробка Telegram bot callbacks | Telegram messages | callback_query → DB updates |
| **find-source-link** | Витягування URL джерел з контенту | telegram-scraper | text content → source_link |
| **fetch-news** | Завантаження новин з RSS | Manual / Scheduled | RSS URL → raw data |
| **process-image** | Обробка зображень через Google Gemini AI | telegram-webhook / manual | image + prompt → enhanced image |
| **resend-to-bot** | Повторна відправка failed submissions | Scheduled | pending news → bot message |
| **telegram-monitor** | Моніторинг статусу Telegram бота | Scheduled | - → health check logs |
| **test-youtube-auth** | Тестування YouTube OAuth налаштувань | Manual | - → token validity |
| **manage-sources** | Управління джерелами новин (enable/disable/delete) | Manual | action + names → updated sources |
| **resend-stuck-posts** | Повторна відправка застряглих approved постів | Manual | - → resent to bot |
| **reprocess-videos** | Повторна обробка відео (cleanup mode) | Manual | options → reprocessed videos |
| **send-contact-email** | Відправка email через контактну форму (Resend API) | Contact form submit | name, email, message → email to admin |

### Shared Helpers (`_shared/`)

```typescript
// youtube-helpers.ts
- getAccessToken()           // Refresh YouTube OAuth token
- uploadVideoToYouTube()     // Upload video with metadata
- getChannelInfo()           // Get channel details

// github-actions.ts
- triggerVideoProcessing()   // Trigger process-video GitHub Action
- triggerLinkedInVideo()     // Trigger linkedin-video GitHub Action
- isGitHubActionsEnabled()   // Check if GH_PAT is configured
```

### Deploy Edge Functions

```bash
cd supabase

# Deploy single function
supabase functions deploy telegram-scraper --no-verify-jwt

# Deploy all functions
for dir in supabase/functions/*/; do
  if [ -d "$dir" ] && [ "$(basename $dir)" != "_shared" ]; then
    supabase functions deploy $(basename $dir) --no-verify-jwt
  fi
done

# Set secrets
supabase secrets set AZURE_OPENAI_ENDPOINT="https://..."
supabase secrets set AZURE_OPENAI_API_KEY="..."
```

---
