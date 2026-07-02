import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAndFixDuplicates() {
  console.log('🔍 Перевіряю дублікати в news_sources...\n');

  // Отримати всі джерела
  const { data: sources, error } = await supabase
    .from('news_sources')
    .select('*')
    .order('name, source_type');

  if (error) {
    console.error('❌ Помилка:', error);
    return;
  }

  console.log(`📊 Всього джерел: ${sources.length}\n`);

  // Групувати по name
  const grouped = {};
  sources.forEach(s => {
    if (!grouped[s.name]) grouped[s.name] = [];
    grouped[s.name].push(s);
  });

  // Знайти дублікати
  const duplicates = Object.keys(grouped).filter(name => grouped[name].length > 1);

  if (duplicates.length === 0) {
    console.log('✅ Дублікатів не знайдено!\n');
    return;
  }

  console.log(`⚠️  Знайдено ${duplicates.length} джерел з дублікатами:\n`);

  const idsToDelete = [];

  duplicates.forEach(name => {
    const items = grouped[name];
    console.log(`📌 ${name}:`);
    items.forEach(item => {
      const isRssWithoutUrl = item.source_type === 'rss' && !item.rss_url;
      const isTelegramRss = item.url && item.url.includes('t.me');

      console.log(`   - ID: ${item.id}`);
      console.log(`     Type: ${item.source_type}`);
      console.log(`     URL: ${item.url || 'null'}`);
      console.log(`     RSS URL: ${item.rss_url || 'null'}`);

      if (isRssWithoutUrl && isTelegramRss) {
        console.log(`     ❌ ВИДАЛИТИ (RSS без rss_url для Telegram каналу)`);
        idsToDelete.push(item.id);
      } else {
        console.log(`     ✅ ЗАЛИШИТИ`);
      }
      console.log('');
    });
  });

  if (idsToDelete.length === 0) {
    console.log('✅ Нічого видаляти\n');
    return;
  }

  console.log(`\n🗑️  Видаляю ${idsToDelete.length} неправильних записів...\n`);
  console.log('IDs для видалення:', idsToDelete);

  // Видалити
  const { error: deleteError } = await supabase
    .from('news_sources')
    .delete()
    .in('id', idsToDelete);

  if (deleteError) {
    console.error('❌ Помилка при видаленні:', deleteError);
    return;
  }

  console.log('✅ Успішно видалено!\n');

  // Перевірити результат
  console.log('📊 Перевіряю результат...\n');

  const { data: afterSources } = await supabase
    .from('news_sources')
    .select('id, name, source_type, url, rss_url')
    .order('name, source_type');

  const afterGrouped = {};
  afterSources.forEach(s => {
    if (!afterGrouped[s.name]) afterGrouped[s.name] = [];
    afterGrouped[s.name].push(s);
  });

  const afterDuplicates = Object.keys(afterGrouped).filter(name => afterGrouped[name].length > 1);

  if (afterDuplicates.length === 0) {
    console.log('🎉 Всі дублікати видалені!\n');
    console.log('📋 Фінальний список джерел:\n');

    afterSources.forEach(s => {
      console.log(`✅ ${s.name} (${s.source_type})`);
      if (s.source_type === 'rss') console.log(`   RSS: ${s.rss_url || '❌ НЕМАЄ'}`);
      if (s.source_type === 'telegram') console.log(`   URL: ${s.url}`);
      console.log('');
    });
  } else {
    console.log('⚠️  Ще залишились дублікати:', afterDuplicates);
  }
}

checkAndFixDuplicates().catch(console.error);
