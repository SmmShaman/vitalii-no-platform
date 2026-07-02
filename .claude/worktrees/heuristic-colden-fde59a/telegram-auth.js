/**
 * Telegram Client API Authorization Script
 *
 * This script helps you authorize your application with Telegram
 * and generate a session string that can be used in the Edge Function.
 *
 * Usage:
 *   1. npm install telegram input
 *   2. Update apiId and apiHash below with your credentials
 *   3. node telegram-auth.js
 *   4. Follow the prompts
 *   5. Copy the session string and add it to Supabase Secrets
 */

const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');

// ⚠️ REPLACE THESE WITH YOUR ACTUAL VALUES from https://my.telegram.org/apps
const apiId = 1234567; // Your api_id
const apiHash = 'your_api_hash_here'; // Your api_hash

// Empty string = new authorization
// If you have an existing session, paste it here to reuse
const stringSession = new StringSession('');

(async () => {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║   🔐 Telegram Client API Authorization          ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');

  if (apiId === 1234567 || apiHash === 'your_api_hash_here') {
    console.error('❌ Error: Please update apiId and apiHash in this script first!');
    console.error('');
    console.error('Get your credentials from: https://my.telegram.org/apps');
    console.error('');
    process.exit(1);
  }

  console.log('📱 Starting authorization process...');
  console.log('');

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  try {
    await client.start({
      phoneNumber: async () => {
        console.log('');
        const phone = await input.text('📱 Enter your phone number (e.g., +380123456789): ');
        return phone;
      },
      password: async () => {
        console.log('');
        const pass = await input.text('🔒 Enter your 2FA password (press Enter if you don\'t have 2FA): ');
        return pass || undefined;
      },
      phoneCode: async () => {
        console.log('');
        console.log('📲 A code has been sent to your Telegram app');
        const code = await input.text('Enter the code: ');
        return code;
      },
      onError: (err) => {
        console.error('❌ Error during authorization:', err.message);
      },
    });

    console.log('');
    console.log('✅ Successfully authorized!');
    console.log('');
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║   📝 Your Session String (SAVE THIS!)           ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log('');
    const sessionString = client.session.save();
    console.log(sessionString);
    console.log('');
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║   🔒 IMPORTANT SECURITY NOTES                    ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log('');
    console.log('⚠️  This session string gives FULL ACCESS to your Telegram account!');
    console.log('⚠️  Keep it SECRET - never commit to git or share publicly');
    console.log('⚠️  Anyone with this string can:');
    console.log('    • Read all your messages');
    console.log('    • Send messages on your behalf');
    console.log('    • Join groups and channels');
    console.log('');
    console.log('✅ Add this to Supabase Secrets:');
    console.log('   1. Go to: https://app.supabase.com/project/uchmopqiylywnemvjttl/settings/secrets');
    console.log('   2. Click "Add new secret"');
    console.log('   3. Name: TELEGRAM_SESSION');
    console.log('   4. Value: (paste the session string above)');
    console.log('   5. Save');
    console.log('');
    console.log('🔄 If your session gets compromised:');
    console.log('   1. Go to: https://my.telegram.org/auth');
    console.log('   2. Go to "Active sessions"');
    console.log('   3. Find and terminate the session');
    console.log('   4. Run this script again to create a new session');
    console.log('');

    await client.disconnect();
    console.log('👋 Disconnected from Telegram');
    console.log('');
    console.log('🎉 Done! You can now deploy the telegram-monitor function.');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('❌ Authorization failed:', error.message);
    console.error('');
    console.error('Common issues:');
    console.error('  • Wrong phone number format (use international format: +380...)');
    console.error('  • Wrong verification code');
    console.error('  • Expired code (request a new one)');
    console.error('  • Wrong 2FA password');
    console.error('');
    console.error('Try again by running: node telegram-auth.js');
    console.error('');
    process.exit(1);
  }
})();
