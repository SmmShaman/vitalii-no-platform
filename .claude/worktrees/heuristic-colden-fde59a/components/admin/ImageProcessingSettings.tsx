'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Image,
  Sparkles,
  RefreshCw,
  Save,
  Plus,
  Trash2,
  Check,
  Snowflake,
  Sun,
  Flower2,
  Leaf,
  Heart,
  Star,
  Zap,
  Layers,
  Activity,
  Eye,
  EyeOff,
  ExternalLink,
  Key,
  AlertCircle
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface ImagePrompt {
  id: string
  name: string
  prompt_type: string
  prompt_text: string
  description: string | null
  is_active: boolean
  usage_count: number
}

// Predefined seasonal themes
const SEASONAL_THEMES = [
  {
    id: 'christmas',
    name: '🎄 Різдвяний',
    icon: Snowflake,
    prompt: `Edit this image with a festive Christmas theme:
- Add subtle warm holiday lighting effects
- Enhance with cozy winter atmosphere
- Keep professional look suitable for LinkedIn
- Add gentle snow or sparkle effects if appropriate
- Maintain the original subject clearly visible
Output a professionally enhanced Christmas-themed version.`
  },
  {
    id: 'spring',
    name: '🌸 Весняний',
    icon: Flower2,
    prompt: `Edit this image with a fresh spring theme:
- Brighten colors with spring freshness
- Add subtle floral or nature elements
- Enhance with warm, optimistic lighting
- Keep professional appearance for LinkedIn
- Make colors vibrant but not oversaturated
Output a professionally enhanced spring-themed version.`
  },
  {
    id: 'easter',
    name: '🐰 Пасхальний',
    icon: Star,
    prompt: `Edit this image with an Easter/spring celebration theme:
- Add warm, hopeful lighting
- Enhance with soft pastel tones
- Keep professional look for LinkedIn
- Add subtle festive elements if appropriate
- Maintain clear visibility of the subject
Output a professionally enhanced Easter-themed version.`
  },
  {
    id: 'summer',
    name: '☀️ Літній',
    icon: Sun,
    prompt: `Edit this image with a bright summer theme:
- Enhance with warm, sunny lighting
- Make colors vibrant and energetic
- Add summer freshness and brightness
- Keep professional for LinkedIn posting
- Optimize contrast for outdoor visibility
Output a professionally enhanced summer-themed version.`
  },
  {
    id: 'autumn',
    name: '🍂 Осінній',
    icon: Leaf,
    prompt: `Edit this image with a cozy autumn theme:
- Add warm golden/orange tones
- Enhance with soft autumn lighting
- Create comfortable, professional atmosphere
- Keep suitable for LinkedIn
- Add subtle warmth without overdoing colors
Output a professionally enhanced autumn-themed version.`
  },
  {
    id: 'valentine',
    name: '💝 Валентина',
    icon: Heart,
    prompt: `Edit this image with a Valentine's Day theme:
- Add soft romantic lighting
- Enhance with subtle pink/red accents
- Keep professional appearance for LinkedIn
- Add gentle warmth and elegance
- Maintain clear subject visibility
Output a professionally enhanced Valentine-themed version.`
  },
]

// Provider definitions for cascading mode display
const CASCADING_PROVIDERS = [
  { name: 'Cloudflare FLUX', key: 'CLOUDFLARE_AI_TOKEN', freeLimit: '~150 img/day', icon: '☁️' },
  { name: 'Together AI FLUX', key: 'TOGETHER_API_KEY', freeLimit: 'Unlimited (free endpoint)', icon: '🤝' },
  { name: 'Pollinations', key: '', freeLimit: 'Unlimited (no key)', icon: '🌸' },
  { name: 'HuggingFace FLUX', key: 'HUGGINGFACE_TOKEN', freeLimit: '~100 req/hour', icon: '🤗' },
  { name: 'Gemini (paid fallback)', key: 'GOOGLE_API_KEY', freeLimit: 'Pay-per-use', icon: '💎' },
]

// API keys required for cascading providers (editable in dashboard)
const PROVIDER_API_KEYS = [
  { keyName: 'CLOUDFLARE_ACCOUNT_ID', label: 'Cloudflare Account ID', provider: 'Cloudflare FLUX', helpUrl: 'https://dash.cloudflare.com/', helpText: 'Cloudflare Dashboard' },
  { keyName: 'CLOUDFLARE_AI_TOKEN', label: 'Cloudflare AI Token', provider: 'Cloudflare FLUX', helpUrl: 'https://dash.cloudflare.com/profile/api-tokens', helpText: 'API Tokens' },
  { keyName: 'TOGETHER_API_KEY', label: 'Together AI API Key', provider: 'Together AI FLUX', helpUrl: 'https://api.together.xyz/settings/api-keys', helpText: 'Together AI Keys' },
  { keyName: 'HUGGINGFACE_TOKEN', label: 'HuggingFace Token', provider: 'HuggingFace FLUX', helpUrl: 'https://huggingface.co/settings/tokens', helpText: 'HF Tokens' },
]

export const ImageProcessingSettings = () => {
  const [prompts, setPrompts] = useState<ImagePrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activePromptId, setActivePromptId] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [showCustomEditor, setShowCustomEditor] = useState(false)

  // Image generation mode state
  const [imageGenMode, setImageGenMode] = useState<'gemini_only' | 'cascading'>('gemini_only')
  const [savedImageGenMode, setSavedImageGenMode] = useState<'gemini_only' | 'cascading'>('gemini_only')
  const [savingMode, setSavingMode] = useState(false)
  const [providerUsage, setProviderUsage] = useState<Record<string, { success: number; failure: number }>>({})

  // Provider API keys state
  const [providerKeyValues, setProviderKeyValues] = useState<Record<string, string>>({})
  const [savedProviderKeyValues, setSavedProviderKeyValues] = useState<Record<string, string>>({})
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [showKeyValues, setShowKeyValues] = useState<Record<string, boolean>>({})
  const [providerTestResults, setProviderTestResults] = useState<Record<string, 'success' | 'error' | null>>({})
  const [testingKey, setTestingKey] = useState<string | null>(null)

  useEffect(() => {
    loadPrompts()
    loadImageGenMode()
    loadProviderUsage()
    loadProviderKeys()
  }, [])

  const loadImageGenMode = async () => {
    try {
      const { data } = await supabase
        .from('api_settings')
        .select('key_value')
        .eq('key_name', 'IMAGE_GENERATION_MODE')
        .single()

      if (data?.key_value) {
        const mode = data.key_value as 'gemini_only' | 'cascading'
        setImageGenMode(mode)
        setSavedImageGenMode(mode)
      }
    } catch {
      // Default to gemini_only if not found
    }
  }

  const loadProviderUsage = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('image_provider_usage')
        .select('provider_name, success_count, failure_count')
        .eq('usage_date', today)

      if (data) {
        const usage: Record<string, { success: number; failure: number }> = {}
        data.forEach(row => {
          usage[row.provider_name] = {
            success: row.success_count || 0,
            failure: row.failure_count || 0,
          }
        })
        setProviderUsage(usage)
      }
    } catch {
      // Table may not exist yet
    }
  }

  const saveImageGenMode = async (mode: 'gemini_only' | 'cascading') => {
    try {
      setSavingMode(true)
      setImageGenMode(mode)

      // Try update first
      const { data, error } = await supabase
        .from('api_settings')
        .update({ key_value: mode, updated_at: new Date().toISOString() })
        .eq('key_name', 'IMAGE_GENERATION_MODE')
        .select()

      if (!data || data.length === 0) {
        // Insert if not found
        await supabase
          .from('api_settings')
          .insert({
            key_name: 'IMAGE_GENERATION_MODE',
            key_value: mode,
            description: 'Image generation mode: gemini_only or cascading',
            is_active: true,
          })
      }

      setSavedImageGenMode(mode)
    } catch (error) {
      console.error('Failed to save image generation mode:', error)
      setImageGenMode(savedImageGenMode) // Revert on error
    } finally {
      setSavingMode(false)
    }
  }

  const loadProviderKeys = async () => {
    try {
      const keyNames = PROVIDER_API_KEYS.map(k => k.keyName)
      const { data } = await supabase
        .from('api_settings')
        .select('key_name, key_value')
        .in('key_name', keyNames)

      const values: Record<string, string> = {}
      data?.forEach(row => {
        values[row.key_name] = row.key_value || ''
      })
      setProviderKeyValues(values)
      setSavedProviderKeyValues(values)
    } catch {
      // Keys may not exist yet
    }
  }

  const saveProviderKey = async (keyName: string) => {
    try {
      setSavingKey(keyName)
      const value = providerKeyValues[keyName] || ''

      // Try update first
      const { data } = await supabase
        .from('api_settings')
        .update({ key_value: value, updated_at: new Date().toISOString() })
        .eq('key_name', keyName)
        .select()

      if (!data || data.length === 0) {
        // Insert if not found
        await supabase
          .from('api_settings')
          .insert({
            key_name: keyName,
            key_value: value,
            description: `API key for cascading image provider: ${keyName}`,
            is_active: true,
          })
      }

      setSavedProviderKeyValues(prev => ({ ...prev, [keyName]: value }))
    } catch (error) {
      console.error(`Failed to save ${keyName}:`, error)
    } finally {
      setSavingKey(null)
    }
  }

  const testProviderKey = async (keyName: string) => {
    setTestingKey(keyName)
    setProviderTestResults(prev => ({ ...prev, [keyName]: null }))

    try {
      if (keyName === 'CLOUDFLARE_AI_TOKEN') {
        const accountId = providerKeyValues['CLOUDFLARE_ACCOUNT_ID']
        const token = providerKeyValues['CLOUDFLARE_AI_TOKEN']
        if (!accountId || !token) {
          setProviderTestResults(prev => ({ ...prev, [keyName]: 'error' }))
          return
        }
        const res = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/models/search`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setProviderTestResults(prev => ({ ...prev, [keyName]: res.ok ? 'success' : 'error' }))
      } else if (keyName === 'TOGETHER_API_KEY') {
        const token = providerKeyValues['TOGETHER_API_KEY']
        if (!token) {
          setProviderTestResults(prev => ({ ...prev, [keyName]: 'error' }))
          return
        }
        const res = await fetch('https://api.together.xyz/v1/models', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setProviderTestResults(prev => ({ ...prev, [keyName]: res.ok ? 'success' : 'error' }))
      } else if (keyName === 'HUGGINGFACE_TOKEN') {
        const token = providerKeyValues['HUGGINGFACE_TOKEN']
        if (!token) {
          setProviderTestResults(prev => ({ ...prev, [keyName]: 'error' }))
          return
        }
        const res = await fetch('https://huggingface.co/api/whoami-v2', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setProviderTestResults(prev => ({ ...prev, [keyName]: res.ok ? 'success' : 'error' }))
      }
    } catch {
      setProviderTestResults(prev => ({ ...prev, [keyName]: 'error' }))
    } finally {
      setTestingKey(null)
    }
  }

  const loadPrompts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('ai_prompts')
        .select('*')
        .like('prompt_type', 'image_%')
        .order('is_active', { ascending: false })

      if (error) throw error

      setPrompts(data || [])

      // Find active prompt
      const active = data?.find(p => p.is_active && p.prompt_type === 'image_linkedin_optimize')
      if (active) {
        setActivePromptId(active.id)
        setCustomPrompt(active.prompt_text)
      }
    } catch (error) {
      console.error('Failed to load prompts:', error)
    } finally {
      setLoading(false)
    }
  }

  const activatePrompt = async (promptId: string) => {
    try {
      setSaving(true)

      // Deactivate all image_linkedin_optimize prompts
      await supabase
        .from('ai_prompts')
        .update({ is_active: false })
        .eq('prompt_type', 'image_linkedin_optimize')

      // Activate selected prompt
      await supabase
        .from('ai_prompts')
        .update({ is_active: true })
        .eq('id', promptId)

      setActivePromptId(promptId)
      await loadPrompts()
    } catch (error) {
      console.error('Failed to activate prompt:', error)
    } finally {
      setSaving(false)
    }
  }

  const applySeasonalTheme = async (theme: typeof SEASONAL_THEMES[0]) => {
    try {
      setSaving(true)

      // Check if theme prompt already exists
      const { data: existing } = await supabase
        .from('ai_prompts')
        .select('id')
        .eq('prompt_type', 'image_linkedin_optimize')
        .eq('name', theme.name)
        .single()

      let promptId: string

      if (existing) {
        // Update existing
        await supabase
          .from('ai_prompts')
          .update({ prompt_text: theme.prompt })
          .eq('id', existing.id)
        promptId = existing.id
      } else {
        // Create new
        const { data: newPrompt, error } = await supabase
          .from('ai_prompts')
          .insert({
            name: theme.name,
            prompt_type: 'image_linkedin_optimize',
            prompt_text: theme.prompt,
            description: `Сезонна тема: ${theme.name}`,
            is_active: false
          })
          .select('id')
          .single()

        if (error) throw error
        promptId = newPrompt.id
      }

      // Activate this prompt
      await activatePrompt(promptId)
      setCustomPrompt(theme.prompt)

    } catch (error) {
      console.error('Failed to apply theme:', error)
    } finally {
      setSaving(false)
    }
  }

  const saveCustomPrompt = async () => {
    if (!customPrompt.trim()) return

    try {
      setSaving(true)

      // Update or create custom prompt
      const { data: existing } = await supabase
        .from('ai_prompts')
        .select('id')
        .eq('prompt_type', 'image_linkedin_optimize')
        .eq('name', '✏️ Власний промпт')
        .single()

      let promptId: string

      if (existing) {
        await supabase
          .from('ai_prompts')
          .update({ prompt_text: customPrompt })
          .eq('id', existing.id)
        promptId = existing.id
      } else {
        const { data: newPrompt, error } = await supabase
          .from('ai_prompts')
          .insert({
            name: '✏️ Власний промпт',
            prompt_type: 'image_linkedin_optimize',
            prompt_text: customPrompt,
            description: 'Користувацький промпт для обробки зображень',
            is_active: false
          })
          .select('id')
          .single()

        if (error) throw error
        promptId = newPrompt.id
      }

      await activatePrompt(promptId)
      setShowCustomEditor(false)

    } catch (error) {
      console.error('Failed to save custom prompt:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl">
          <Image className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Обробка зображень</h2>
          <p className="text-gray-400 text-sm">Налаштування Gemini AI для LinkedIn</p>
        </div>
      </div>

      {/* Image Generation Mode Toggle */}
      <div className={`bg-white/5 rounded-xl p-6 border-2 transition-all ${
        imageGenMode !== savedImageGenMode ? 'border-yellow-500/50' : 'border-white/10'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Режим генерації зображень</h3>
          {savingMode && <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Gemini Only */}
          <button
            onClick={() => saveImageGenMode('gemini_only')}
            disabled={savingMode}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              imageGenMode === 'gemini_only'
                ? 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-500/30'
                : 'bg-white/5 border-white/10 hover:border-white/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💎</span>
              <span className="text-white font-semibold">Gemini Only</span>
              {imageGenMode === 'gemini_only' && <Check className="h-4 w-4 text-blue-400 ml-auto" />}
            </div>
            <p className="text-gray-400 text-sm">
              Поточний стан. Використовує Google Gemini для генерації. Підтримує текст на зображеннях (дата, vitalii.no). Платний.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded">~$0.13/img</span>
            </div>
          </button>

          {/* Cascading Providers */}
          <button
            onClick={() => saveImageGenMode('cascading')}
            disabled={savingMode}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              imageGenMode === 'cascading'
                ? 'bg-green-500/20 border-green-500 ring-2 ring-green-500/30'
                : 'bg-white/5 border-white/10 hover:border-white/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔗</span>
              <span className="text-white font-semibold">Cascading Providers</span>
              {imageGenMode === 'cascading' && <Check className="h-4 w-4 text-green-400 ml-auto" />}
            </div>
            <p className="text-gray-400 text-sm">
              Спочатку безкоштовні сервіси (Cloudflare, Together AI, Pollinations, HuggingFace), потім Gemini як fallback. Брендинг через overlay.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-300 rounded">~$0/img (free tier)</span>
              <span className="text-xs px-2 py-0.5 bg-gray-500/20 text-gray-300 rounded">fallback: $0.02/img</span>
            </div>
          </button>
        </div>

        {/* Provider Status (only shown in cascading mode) */}
        {imageGenMode === 'cascading' && (
          <div className="mt-4 bg-black/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="text-sm text-white font-medium">Провайдери (пріоритет зверху вниз):</span>
            </div>
            <div className="space-y-2">
              {CASCADING_PROVIDERS.map((provider, idx) => {
                const usage = providerUsage[provider.name]
                return (
                  <div key={provider.name} className="flex items-center gap-3 text-sm">
                    <span className="text-gray-500 w-5">{idx + 1}.</span>
                    <span>{provider.icon}</span>
                    <span className="text-white flex-1">{provider.name}</span>
                    <span className="text-gray-500">{provider.freeLimit}</span>
                    {usage && (
                      <span className="text-green-400 text-xs">
                        {usage.success} ok{usage.failure > 0 ? ` / ${usage.failure} fail` : ''}
                      </span>
                    )}
                    {provider.key && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-400">
                        {provider.key}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
            <p className="text-gray-500 text-xs mt-3">
              Якщо провайдер не може згенерувати (ліміт/помилка) — переходить до наступного в списку.
            </p>

            {/* Provider API Keys */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Key className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-white font-medium">API ключі провайдерів:</span>
              </div>
              <div className="space-y-3">
                {PROVIDER_API_KEYS.map((keyConfig) => {
                  const isChanged = (providerKeyValues[keyConfig.keyName] || '') !== (savedProviderKeyValues[keyConfig.keyName] || '')
                  const hasValue = !!(savedProviderKeyValues[keyConfig.keyName])

                  return (
                    <div key={keyConfig.keyName} className={`bg-black/20 rounded-lg p-3 border transition-all ${
                      isChanged ? 'border-yellow-500/50' : 'border-white/5'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-medium">{keyConfig.label}</span>
                          {hasValue ? (
                            <span className="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">OK</span>
                          ) : (
                            <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">Not set</span>
                          )}
                        </div>
                        <a
                          href={keyConfig.helpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                        >
                          {keyConfig.helpText}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <input
                            type={showKeyValues[keyConfig.keyName] ? 'text' : 'password'}
                            value={providerKeyValues[keyConfig.keyName] || ''}
                            onChange={(e) =>
                              setProviderKeyValues(prev => ({ ...prev, [keyConfig.keyName]: e.target.value }))
                            }
                            placeholder={`${keyConfig.label}...`}
                            className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 pr-10"
                          />
                          <button
                            onClick={() =>
                              setShowKeyValues(prev => ({ ...prev, [keyConfig.keyName]: !prev[keyConfig.keyName] }))
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showKeyValues[keyConfig.keyName] ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                        <button
                          onClick={() => saveProviderKey(keyConfig.keyName)}
                          disabled={savingKey === keyConfig.keyName || !isChanged}
                          className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {savingKey === keyConfig.keyName ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <Save className="h-3 w-3" />
                          )}
                          Save
                        </button>
                        {keyConfig.keyName !== 'CLOUDFLARE_ACCOUNT_ID' && providerKeyValues[keyConfig.keyName] && (
                          <button
                            onClick={() => testProviderKey(keyConfig.keyName)}
                            disabled={testingKey === keyConfig.keyName}
                            className={`flex items-center gap-1 px-3 py-2 rounded text-xs transition-colors ${
                              providerTestResults[keyConfig.keyName] === 'success'
                                ? 'bg-green-600 text-white'
                                : providerTestResults[keyConfig.keyName] === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                          >
                            {testingKey === keyConfig.keyName ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : providerTestResults[keyConfig.keyName] === 'success' ? (
                              <Check className="h-3 w-3" />
                            ) : providerTestResults[keyConfig.keyName] === 'error' ? (
                              <AlertCircle className="h-3 w-3" />
                            ) : (
                              <RefreshCw className="h-3 w-3" />
                            )}
                            Test
                          </button>
                        )}
                      </div>
                      {providerTestResults[keyConfig.keyName] && (
                        <p className={`text-xs mt-1 ${
                          providerTestResults[keyConfig.keyName] === 'success' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {providerTestResults[keyConfig.keyName] === 'success'
                            ? '✓ API ключ працює коректно'
                            : keyConfig.keyName === 'CLOUDFLARE_AI_TOKEN' && !providerKeyValues['CLOUDFLARE_ACCOUNT_ID']
                              ? '✗ Потрібно також вказати Cloudflare Account ID'
                              : '✗ API ключ недійсний або не має доступу'}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">Provider: {keyConfig.provider}</p>
                    </div>
                  )
                })}
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Pollinations не потребує ключа. Google API Key налаштовується у вкладці API Keys.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Current Active Theme */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Check className="h-5 w-5 text-green-400" />
          <h3 className="text-white font-semibold">Активна тема:</h3>
        </div>
        <p className="text-green-300">
          {prompts.find(p => p.id === activePromptId)?.name || 'Стандартна оптимізація'}
        </p>
      </div>

      {/* Seasonal Themes */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-400" />
          Сезонні теми
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Оберіть тему для автоматичної обробки всіх зображень з Telegram
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SEASONAL_THEMES.map((theme) => {
            const Icon = theme.icon
            const isActive = prompts.find(p => p.id === activePromptId)?.name === theme.name

            return (
              <motion.button
                key={theme.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => applySeasonalTheme(theme)}
                disabled={saving}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isActive
                    ? 'bg-purple-500/20 border-purple-500 text-white'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                  <span className="font-medium">{theme.name}</span>
                </div>
                {isActive && (
                  <span className="text-xs text-purple-400">✓ Активна</span>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Custom Prompt Editor */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            ✏️ Власний промпт
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCustomEditor(!showCustomEditor)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
          >
            {showCustomEditor ? 'Згорнути' : 'Редагувати'}
          </motion.button>
        </div>

        {showCustomEditor && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              Напишіть інструкції для Gemini AI. Цей промпт буде відправлятися при кожній генерації зображення для LinkedIn.
            </p>

            {/* Placeholders Info */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-purple-300 font-medium mb-2">🔤 Доступні плейсхолдери:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div className="bg-black/20 rounded p-2">
                  <code className="text-green-400">{'{title}'}</code>
                  <p className="text-gray-400 text-xs mt-1">Заголовок статті</p>
                </div>
                <div className="bg-black/20 rounded p-2">
                  <code className="text-green-400">{'{description}'}</code>
                  <p className="text-gray-400 text-xs mt-1">Опис/контент статті</p>
                </div>
                <div className="bg-black/20 rounded p-2">
                  <code className="text-green-400">{'{url}'}</code>
                  <p className="text-gray-400 text-xs mt-1">URL статті</p>
                </div>
              </div>
            </div>

            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={`Based on this reference image and the article context below, create a NEW professional illustration for LinkedIn.

ARTICLE CONTEXT:
Title: {title}
Description: {description}

INSTRUCTIONS:
1. Create a completely NEW illustration that represents the article theme
2. Style: Modern, professional, suitable for LinkedIn
3. Use vibrant but professional colors
4. NO text on the image
5. Landscape orientation (16:9)

Generate a high-quality illustration.`}
              className="w-full h-64 px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={saveCustomPrompt}
                disabled={saving || !customPrompt.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Збереження...' : 'Зберегти та активувати'}
              </motion.button>

              <button
                onClick={() => setShowCustomEditor(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Скасувати
              </button>
            </div>

            {/* Tips */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
              <h4 className="text-blue-300 font-medium mb-2">💡 Поради для промпту:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Використовуйте <code className="text-green-400">{'{title}'}</code> та <code className="text-green-400">{'{description}'}</code> щоб AI розумів контекст статті</li>
                <li>• Вказуйте конкретний стиль: modern, professional, minimalist</li>
                <li>• Описуйте що має бути на зображенні: visual metaphors, symbols, icons</li>
                <li>• Вкажіть що НЕ має бути: NO text, NO logos, NO faces</li>
                <li>• Landscape (16:9) - найкращий формат для LinkedIn</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <h4 className="text-green-300 font-medium mb-2">🔄 Як працює генерація:</h4>
        <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
          <li>При публікації в LinkedIn беремо <strong>оригінальне зображення</strong> з поста</li>
          <li>Беремо <strong>заголовок</strong> та <strong>опис</strong> новини</li>
          <li>Відправляємо в <strong>Gemini AI</strong> разом з промптом</li>
          <li>AI генерує <strong>нове зображення</strong> на основі контексту статті</li>
          <li>Згенероване зображення публікується в LinkedIn</li>
        </ol>
      </div>

      {/* Info */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <h4 className="text-yellow-300 font-medium mb-2">⚠️ Важливо:</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Потрібен <strong>GOOGLE_API_KEY</strong> - налаштуйте в <strong>API Keys</strong></li>
          <li>• Генерація відбувається тільки при публікації в LinkedIn</li>
          <li>• Оброблене зображення зберігається для повторного використання</li>
        </ul>
      </div>

      {/* Refresh button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadPrompts}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
        >
          <RefreshCw className="h-4 w-4" />
          Оновити
        </motion.button>
      </div>
    </div>
  )
}
