'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useCookieConsent } from '@/contexts/CookieConsentContext'
import { useTranslations } from '@/contexts/TranslationContext'

/**
 * Slim consent bar.
 *
 * Only Google Analytics and GTM are gated by this: they set cookies and send
 * data to Google, so ePrivacy (ekomloven §3-15) requires consent first.
 * Cloudflare Web Analytics, which feeds the view counters, stores nothing on
 * the device and identifies nobody, so it runs without consent and keeps
 * working when a reader declines here.
 *
 * Deliberately one line: no toggles (the "necessary" one was decorative), no
 * card, no overlay. Declining is one click, the same size as accepting.
 */
export function CookieConsentBanner() {
  const { showBanner, updateConsent } = useCookieConsent()
  const { t } = useTranslations()

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          role="region"
          aria-label={t('cookie_banner_title')}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="fixed bottom-0 left-0 right-0 md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-auto z-[9999] px-2 pb-2 md:px-0 md:pb-0"
          style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        >
          <div className="flex flex-wrap md:flex-nowrap items-center gap-x-3 gap-y-2 rounded-xl border border-white/10 bg-[#1C1C22]/95 px-3 py-2 shadow-lg backdrop-blur-md">
            <p className="text-[11px] leading-snug text-white/75 flex-1 min-w-[190px]">
              {t('cookie_bar_text')}{' '}
              <Link
                href="/informasjonskapsler"
                className="underline underline-offset-2 text-white/55 hover:text-white/90 transition-colors"
              >
                {t('cookie_read_more')}
              </Link>
            </p>
            <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
              <button
                onClick={() => updateConsent(false)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                {t('cookie_only_necessary')}
              </button>
              <button
                onClick={() => updateConsent(true)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white/90 text-[#1C1C22] hover:bg-white transition-colors"
              >
                {t('cookie_accept_all')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
