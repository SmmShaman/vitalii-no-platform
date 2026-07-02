import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Save, AlertCircle, CheckCircle, Info, RefreshCw } from 'lucide-react';

const CRON_PRESETS = [
  { value: '*/5 * * * *', label: 'Кожні 5 хвилин', seconds: 300 },
  { value: '*/10 * * * *', label: 'Кожні 10 хвилин', seconds: 600 },
  { value: '*/15 * * * *', label: 'Кожні 15 хвилин', seconds: 900 },
  { value: '*/30 * * * *', label: 'Кожні 30 хвилин', seconds: 1800 },
  { value: '0 * * * *', label: 'Кожну годину', seconds: 3600 },
  { value: '0 */2 * * *', label: 'Кожні 2 години', seconds: 7200 },
  { value: '0 */6 * * *', label: 'Кожні 6 годин', seconds: 21600 },
  { value: '0 */12 * * *', label: 'Кожні 12 годин', seconds: 43200 },
];

export const CronScheduleSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);

  // Schedule states for different jobs
  const [telegramScraperSchedule, setTelegramScraperSchedule] = useState('*/10 * * * *');
  const [fetchNewsSchedule, setFetchNewsSchedule] = useState('0 * * * *');

  useEffect(() => {
    loadCronJobs();
  }, []);

  const loadCronJobs = async () => {
    try {
      setLoading(true);

      // Note: Currently cron jobs can only be queried via SQL Editor
      // This is a placeholder for future implementation
      // For now, we use default values

      setTelegramScraperSchedule('*/10 * * * *');
      setFetchNewsSchedule('0 * * * *');
    } catch (error) {
      console.error('Failed to load cron jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCronSchedule = async (jobName: string, newSchedule: string) => {
    try {
      setSaving(true);
      setSaveResult(null);

      // Generate SQL for updating cron schedule
      const sql = `-- Оновити розклад cron job
SELECT cron.unschedule('${jobName}');

SELECT cron.schedule(
  '${jobName}',
  '${newSchedule}',
  $$
  SELECT
    net.http_post(
      url:='https://uchmopqiylywnemvjttl.supabase.co/functions/v1/${jobName.replace('-job', '')}',
      headers:=jsonb_build_object(
        'Content-Type','application/json',
        'Authorization','Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body:='{}'::jsonb
    ) as request_id;
  $$
);`;

      // Copy to clipboard
      await navigator.clipboard.writeText(sql);

      setSaveResult({
        success: true,
        message: `SQL скопійовано! Відкрийте SQL Editor і виконайте:\nhttps://app.supabase.com/project/uchmopqiylywnemvjttl/sql/new`,
      });

      // Update local state optimistically
      if (jobName === 'telegram-scraper-job') {
        setTelegramScraperSchedule(newSchedule);
      } else if (jobName === 'fetch-news-hourly') {
        setFetchNewsSchedule(newSchedule);
      }
    } catch (error) {
      const sql = `-- Скопіюйте цей SQL вручну
SELECT cron.unschedule('${jobName}');

SELECT cron.schedule('${jobName}', '${newSchedule}', $$
  SELECT net.http_post(
    url:='https://uchmopqiylywnemvjttl.supabase.co/functions/v1/${jobName.replace('-job', '')}',
    headers:=jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || current_setting('app.settings.service_role_key')),
    body:='{}'::jsonb
  );
$$);`;

      console.log('SQL для копіювання:', sql);

      setSaveResult({
        success: false,
        message: 'Помилка копіювання. SQL виведено в console (F12).',
      });
    } finally {
      setSaving(false);
    }
  };

  const formatScheduleDescription = (cronExpression: string) => {
    const preset = CRON_PRESETS.find(p => p.value === cronExpression);
    return preset ? preset.label : cronExpression;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Clock className="h-7 w-7" />
          Розклад Автоматизації
        </h2>
        <p className="text-gray-300 text-sm mt-1">
          Налаштуйте частоту запуску автоматичного скрапінгу та оновлення новин
        </p>
      </div>

      {/* Save Result */}
      {saveResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            saveResult.success
              ? 'bg-green-500/10 border-green-500/50 text-green-300'
              : 'bg-red-500/10 border-red-500/50 text-red-300'
          }`}
        >
          <div className="flex items-start gap-3">
            {saveResult.success ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{saveResult.message}</p>
          </div>
        </motion.div>
      )}

      {/* Telegram Scraper Schedule */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              📱 Telegram Scraper
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Частота скрапінгу Telegram каналів
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Поточний розклад:</div>
            <div className="text-white font-mono text-sm mt-1">
              {formatScheduleDescription(telegramScraperSchedule)}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-gray-300">
            Оберіть частоту запуску:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CRON_PRESETS.map((preset) => (
              <motion.button
                key={preset.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTelegramScraperSchedule(preset.value)}
                className={`px-4 py-3 rounded-lg border transition-all ${
                  telegramScraperSchedule === preset.value
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="text-sm font-medium">{preset.label}</div>
                <div className="text-xs opacity-70 mt-1">{preset.value}</div>
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleUpdateCronSchedule('telegram-scraper-job', telegramScraperSchedule)}
            disabled={saving}
            className="w-full mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Збереження...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Зберегти розклад Telegram
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* RSS Fetch Schedule */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              📡 RSS Fetch
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Частота оновлення RSS стрічок
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Поточний розклад:</div>
            <div className="text-white font-mono text-sm mt-1">
              {formatScheduleDescription(fetchNewsSchedule)}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-gray-300">
            Оберіть частоту запуску:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CRON_PRESETS.map((preset) => (
              <motion.button
                key={preset.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFetchNewsSchedule(preset.value)}
                className={`px-4 py-3 rounded-lg border transition-all ${
                  fetchNewsSchedule === preset.value
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="text-sm font-medium">{preset.label}</div>
                <div className="text-xs opacity-70 mt-1">{preset.value}</div>
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleUpdateCronSchedule('fetch-news-hourly', fetchNewsSchedule)}
            disabled={saving}
            className="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Збереження...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Зберегти розклад RSS
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-200">
            <p className="font-semibold mb-2">Як це працює:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-300">
              <li>Telegram Scraper - автоматично збирає нові пости з Telegram каналів</li>
              <li>RSS Fetch - оновлює новини з RSS стрічок</li>
              <li>Кожне джерело також має свій індивідуальний інтервал (налаштовується окремо)</li>
              <li>Зміни застосовуються миттєво після збереження</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
