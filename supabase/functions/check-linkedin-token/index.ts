import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const LINKEDIN_ACCESS_TOKEN = Deno.env.get('LINKEDIN_ACCESS_TOKEN')
const FACEBOOK_PAGE_ACCESS_TOKEN = Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN')
const FACEBOOK_PAGE_ID = Deno.env.get('FACEBOOK_PAGE_ID')
const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
const TELEGRAM_ADMIN_CHAT_ID = Deno.env.get('TELEGRAM_ADMIN_CHAT_ID') || Deno.env.get('TELEGRAM_CHAT_ID')

const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/developers/tools/oauth/token-generator'

serve(async (_req) => {
  const result: Record<string, unknown> = {}

  // LinkedIn check
  if (!LINKEDIN_ACCESS_TOKEN) {
    result.linkedin = { status: 'no_token' }
    await sendTelegramAlert('⚠️ LinkedIn: LINKEDIN_ACCESS_TOKEN not set in Supabase secrets!')
  } else {
    try {
      const resp = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}` },
      })
      if (resp.status === 401) {
        result.linkedin = { status: 'expired' }
        await sendTelegramAlert(
          '🔴 <b>LinkedIn токен ПРОСТРОЧЕНИЙ!</b>\n\n' +
          '👉 <a href="' + LINKEDIN_TOKEN_URL + '">Натисни тут — відкрити LinkedIn Token Generator</a>\n\n' +
          'Після генерації нового токена оновити секрет <code>LINKEDIN_ACCESS_TOKEN</code> в Supabase.'
        )
      } else if (!resp.ok) {
        result.linkedin = { status: 'error', code: resp.status, body: (await resp.text()).slice(0, 200) }
      } else {
        result.linkedin = { status: 'ok' }
      }
    } catch (err) {
      result.linkedin = { status: 'error', message: String(err) }
    }
  }

  // Facebook check
  if (!FACEBOOK_PAGE_ACCESS_TOKEN || !FACEBOOK_PAGE_ID) {
    result.facebook = { status: 'no_token' }
  } else {
    try {
      const resp = await fetch(`https://graph.facebook.com/v19.0/${FACEBOOK_PAGE_ID}?fields=id,name&access_token=${FACEBOOK_PAGE_ACCESS_TOKEN}`)
      if (!resp.ok) {
        const body = await resp.text()
        result.facebook = { status: 'error', code: resp.status, body: body.slice(0, 300) }
        await sendTelegramAlert(`🔴 <b>Facebook токен проблема!</b>\n\n${body.slice(0, 300)}`)
      } else {
        const data = await resp.json()
        result.facebook = { status: 'ok', page: data.name }
      }
    } catch (err) {
      result.facebook = { status: 'error', message: String(err) }
    }
  }

  console.log('Token check result:', JSON.stringify(result))
  return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } })
})

async function sendTelegramAlert(message: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) {
    console.warn('Cannot send Telegram alert: bot token or chat ID missing')
    return
  }
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_ADMIN_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })
  } catch (err) {
    console.error('Failed to send Telegram alert:', err)
  }
}
