import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshCw, CheckCircle, XCircle, Zap, AlertCircle } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';

interface NewsSource {
  id: string;
  name: string;
  url: string;
  rss_url: string | null;
  source_type: 'rss' | 'telegram' | 'web';
  is_active: boolean;
  fetch_interval: number;
  last_fetched_at: string | null;
}

const INTERVAL_OPTIONS = [
  { value: 900, label: '15 хвилин' },
  { value: 1800, label: '30 хвилин' },
  { value: 3600, label: '1 година' },
  { value: 7200, label: '2 години' },
  { value: 21600, label: '6 годин' },
  { value: 43200, label: '12 годин' },
  { value: 86400, label: '24 години' },
];

export const AutoPublishSettings = () => {
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalInterval, setGlobalInterval] = useState(3600);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitorResult, setMonitorResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);

  // Historical load state
  const [selectedSourceId, setSelectedSourceId] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyResult, setHistoryResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news_sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSources(data || []);

      // Set global interval from first source
      if (data && data.length > 0) {
        setGlobalInterval(data[0].fetch_interval);
      }
    } catch (error) {
      console.error('Failed to load news sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSource = async (sourceId: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('news_sources')
        .update({ is_active: !currentActive })
        .eq('id', sourceId);

      if (error) throw error;
      loadSources();
    } catch (error) {
      console.error('Failed to toggle source:', error);
      alert('Помилка при зміні статусу джерела');
    }
  };

  const handleUpdateInterval = async (sourceId: string, interval: number) => {
    try {
      const { error } = await supabase
        .from('news_sources')
        .update({ fetch_interval: interval })
        .eq('id', sourceId);

      if (error) throw error;
      loadSources();
    } catch (error) {
      console.error('Failed to update interval:', error);
      alert('Помилка при оновленні інтервалу');
    }
  };

  const handleUpdateAllIntervals = async () => {
    try {
      const { error } = await supabase
        .from('news_sources')
        .update({ fetch_interval: globalInterval })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all

      if (error) throw error;
      loadSources();
      alert('Інтервал оновлено для всіх джерел!');
    } catch (error) {
      console.error('Failed to update all intervals:', error);
      alert('Помилка при оновленні інтервалів');
    }
  };

  const handleTestFetch = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      // Try to call the edge function
      const response = await fetch(
        'https://uchmopqiylywnemvjttl.supabase.co/functions/v1/fetch-news',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setTestResult({
          success: true,
          message: 'Fetch успішно запущено! Перевірте нові новини через 1-2 хвилини.',
        });
        // Reload sources to get updated last_fetched_at
        setTimeout(loadSources, 3000);
      } else {
        await response.text();
        setTestResult({
          success: false,
          message: `Edge Function не знайдено або не працює. Статус: ${response.status}`,
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Помилка з\'єднання. Edge Function може не існувати.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTelegramMonitor = async () => {
    setIsMonitoring(true);
    setMonitorResult(null);

    try {
      // Call the telegram-scraper edge function
      const response = await fetch(
        'https://uchmopqiylywnemvjttl.supabase.co/functions/v1/telegram-scraper',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMonitorResult({
          success: true,
          message: `Моніторинг Telegram завершено! Оброблено: ${data.totalProcessed} постів`,
          details: data.results,
        });
        // Reload sources to get updated last_fetched_at
        setTimeout(loadSources, 3000);
      } else {
        await response.text();
        setMonitorResult({
          success: false,
          message: `Telegram Scraper не працює. Статус: ${response.status}. Перевірте що function deployed.`,
        });
      }
    } catch (error) {
      setMonitorResult({
        success: false,
        message: 'Помилка з\'єднання. Переконайтеся що telegram-scraper deployed.',
      });
    } finally {
      setIsMonitoring(false);
    }
  };

  const handleLoadHistoricalPosts = async () => {
    // Validation
    if (!selectedSourceId) {
      setHistoryResult({
        success: false,
        message: 'Будь ласка, виберіть джерело',
      });
      return;
    }

    if (!fromDate) {
      setHistoryResult({
        success: false,
        message: 'Будь ласка, вкажіть початкову дату',
      });
      return;
    }

    setIsLoadingHistory(true);
    setHistoryResult(null);

    try {
      const requestBody: any = {
        source_id: selectedSourceId,
        from_date: fromDate,
      };

      // Add to_date if specified
      if (toDate) {
        requestBody.to_date = toDate;
      }

      // Call telegram-scraper with date range parameters
      const response = await fetch(
        'https://uchmopqiylywnemvjttl.supabase.co/functions/v1/telegram-scraper',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setHistoryResult({
          success: true,
          message: `Історичне завантаження завершено! Оброблено: ${data.totalProcessed} постів`,
          details: data.results,
        });
        // Reload sources
        setTimeout(loadSources, 3000);
      } else {
        await response.text();
        setHistoryResult({
          success: false,
          message: `Помилка завантаження. Статус: ${response.status}`,
        });
      }
    } catch (error) {
      setHistoryResult({
        success: false,
        message: 'Помилка з\'єднання при завантаженні історичних постів',
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const formatLastFetch = (timestamp: string | null) => {
    if (!timestamp) return 'Ніколи';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Щойно';
    if (diffMins < 60) return `${diffMins} хв тому`;
    if (diffHours < 24) return `${diffHours} год тому`;
    return date.toLocaleDateString('uk-UA');
  };

  const getNextFetchTime = (interval: number) => {
    const now = new Date();
    const next = new Date(now.getTime() + interval * 1000);
    return next.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const activeCount = sources.filter(s => s.is_active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Clock className="h-7 w-7" />
            Автоматична Публікація
          </h2>
          <p className="text-gray-300 text-sm mt-1">
            Керуйте графіком та джерелами автоматичного завантаження новин
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTelegramMonitor}
            disabled={isMonitoring}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            title="Запустити моніторинг Telegram каналів через Client API"
          >
            {isMonitoring ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Моніторинг...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.67-.52.36-.99.53-1.39.52-.46-.01-1.34-.26-2-.48-.81-.27-1.45-.42-1.4-.88.03-.24.37-.48 1.02-.73 3.99-1.73 6.65-2.87 7.98-3.42 3.8-1.58 4.59-1.86 5.1-1.87.11 0 .36.03.53.16.14.11.18.26.2.37.01.06.03.24.02.38z"/>
                </svg>
                Telegram Monitor
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTestFetch}
            disabled={isTesting}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {isTesting ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Запуск...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                RSS Fetch
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            testResult.success
              ? 'bg-green-500/10 border-green-500/50 text-green-300'
              : 'bg-red-500/10 border-red-500/50 text-red-300'
          }`}
        >
          <div className="flex items-start gap-3">
            {testResult.success ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{testResult.message}</p>
          </div>
        </motion.div>
      )}

      {/* Telegram Monitor Result */}
      {monitorResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            monitorResult.success
              ? 'bg-green-500/10 border-green-500/50 text-green-300'
              : 'bg-red-500/10 border-red-500/50 text-red-300'
          }`}
        >
          <div className="flex items-start gap-3">
            {monitorResult.success ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold mb-2">{monitorResult.message}</p>
              {monitorResult.details && monitorResult.details.length > 0 && (
                <div className="mt-2 space-y-1">
                  {monitorResult.details.map((result: any, index: number) => (
                    <div key={index} className="text-xs opacity-80 flex items-center gap-2">
                      <span>📡 {result.channel}:</span>
                      {result.error ? (
                        <span className="text-red-300">❌ {result.error}</span>
                      ) : (
                        <span>✅ {result.processed} постів</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Historical Load Section */}
      <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-lg rounded-lg p-6 border border-amber-500/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Історичне Завантаження Постів
        </h3>
        <p className="text-sm text-gray-300 mb-4">
          Завантажте старі пости з вказаного Telegram каналу за певний період. Ці пости стануть базовою точкою для майбутнього моніторингу.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Source Selector */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Виберіть джерело Telegram:</label>
            <select
              value={selectedSourceId}
              onChange={(e) => setSelectedSourceId(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="" className="bg-gray-800">-- Оберіть канал --</option>
              {sources
                .filter(s => s.source_type === 'telegram')
                .map(source => (
                  <option key={source.id} value={source.id} className="bg-gray-800">
                    {source.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Date Range Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Від дати (обов'язково):</label>
              <input
                type="datetime-local"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">До дати (опціонально):</label>
              <input
                type="datetime-local"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Load Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLoadHistoricalPosts}
          disabled={isLoadingHistory}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all font-semibold"
        >
          {isLoadingHistory ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              Завантаження історичних постів...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Завантажити Історичні Пости
            </>
          )}
        </motion.button>

        {/* Historical Load Result */}
        {historyResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-lg border ${
              historyResult.success
                ? 'bg-green-500/10 border-green-500/50 text-green-300'
                : 'bg-red-500/10 border-red-500/50 text-red-300'
            }`}
          >
            <div className="flex items-start gap-3">
              {historyResult.success ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold mb-2">{historyResult.message}</p>
                {historyResult.details && historyResult.details.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {historyResult.details.map((result: any, index: number) => (
                      <div key={index} className="text-xs opacity-80 flex items-center gap-2">
                        <span>📡 {result.channel}:</span>
                        {result.error ? (
                          <span className="text-red-300">❌ {result.error}</span>
                        ) : (
                          <span>✅ {result.processed} постів</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Info Note */}
        <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
          <p className="text-xs text-amber-200">
            💡 <strong>Як це працює:</strong> Після завантаження історичних постів, вони будуть збережені в базі даних з оригінальними датами публікації.
            Автоматичний моніторинг продовжить працювати і завантажувати лише нові пости, які з'явились після останнього автоматичного сканування.
          </p>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-300 mb-1">Статус</div>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              {activeCount > 0 ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span>Активно</span>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-400" />
                  <span>Вимкнено</span>
                </>
              )}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-300 mb-1">Активних джерел</div>
            <div className="text-2xl font-bold text-white">
              {activeCount} / {sources.length}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-300 mb-1">Наступний fetch</div>
            <div className="text-2xl font-bold text-white">
              {activeCount > 0 ? getNextFetchTime(globalInterval) : '-'}
            </div>
          </div>
        </div>
      </div>

      {/* Global Interval Settings */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Глобальний Інтервал
        </h3>
        <div className="flex items-center gap-4">
          <select
            value={globalInterval}
            onChange={(e) => setGlobalInterval(Number(e.target.value))}
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {INTERVAL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-800">
                {option.label}
              </option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpdateAllIntervals}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors whitespace-nowrap"
          >
            Застосувати до всіх
          </motion.button>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Встановіть інтервал фетчу для всіх активних джерел одразу
        </p>
      </div>

      {/* Sources List */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Джерела Новин</h3>

        {sources.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-300">Немає налаштованих джерел</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sources.map((source) => (
              <motion.div
                key={source.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white font-semibold">{source.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        source.source_type === 'rss'
                          ? 'bg-blue-500/20 text-blue-300'
                          : source.source_type === 'telegram'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {source.source_type.toUpperCase()}
                      </span>
                      {source.is_active ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                          Активний
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs">
                          Вимкнено
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{source.url}</p>
                    {source.rss_url && (
                      <p className="text-xs text-gray-500">RSS: {source.rss_url}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="text-gray-400">
                        Останній fetch: {formatLastFetch(source.last_fetched_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 items-end">
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xs text-gray-400 mb-1">Інтервал скрапінгу:</div>
                        <select
                          value={source.fetch_interval}
                          onChange={(e) => handleUpdateInterval(source.id, Number(e.target.value))}
                          disabled={!source.is_active}
                          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 min-w-[140px]"
                        >
                          {INTERVAL_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value} className="bg-gray-800">
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleSource(source.id, source.is_active)}
                        className={`p-3 rounded-lg transition-colors ${
                          source.is_active
                            ? 'bg-green-500/20 hover:bg-green-500/30 text-green-300'
                            : 'bg-gray-500/20 hover:bg-gray-500/30 text-gray-300'
                        }`}
                        title={source.is_active ? 'Вимкнути' : 'Увімкнути'}
                      >
                        {source.is_active ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                      </motion.button>
                    </div>
                    {source.is_active && (
                      <div className="text-xs text-gray-400 italic">
                        Наступний fetch: ~{Math.floor(source.fetch_interval / 60)} хв
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-200">
            <p className="font-semibold mb-2">Як це працює:</p>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-blue-100 mb-1">📡 RSS Fetch:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-300 ml-2">
                  <li>Cron job викликає Edge Function кожну годину</li>
                  <li>Завантажує нові статті з RSS джерел</li>
                  <li>Підтримує стандартні RSS/Atom фіди</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-blue-100 mb-1">📱 Telegram Monitor (Web Scraping):</p>
                <ul className="list-disc list-inside space-y-1 text-blue-300 ml-2">
                  <li>Використовує веб-скрапінг публічних каналів через t.me/s/</li>
                  <li>Читає останні пости з каналів типу "telegram"</li>
                  <li>Працює БЕЗ авторізації та API credentials</li>
                  <li>Завантажує текст, фото, дату публікації</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-blue-100 mb-1">🤖 Обробка:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-300 ml-2">
                  <li>AI автоматично перекладає новини на 3 мови</li>
                  <li>Новини зберігаються з is_published=false</li>
                  <li>Ви отримуєте повідомлення в Telegram для підтвердження публікації</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
