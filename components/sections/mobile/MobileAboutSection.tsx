'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { sectionColors } from './types'
import { VerticalLabel } from './VerticalLabel'
import type { TranslateFn } from './types'
import { stripMarkdown } from '@/utils/markdown'
import NeoIconButton from '@/components/ui/NeoIconButton'

// About Explosion Overlay - Fast word-by-word animation
const AboutExplosionOverlay = ({
  text,
  onClose,
  color,
}: {
  text: string
  onClose: () => void
  color: string
}) => {
  // Clean text and split into paragraphs
  const cleanText = stripMarkdown(text)
  const paragraphs = cleanText.split('\n\n').filter((p) => p.trim())

  // Flatten all words for stagger animation
  let wordIndex = 0

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-surface"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Close button */}
      <NeoIconButton
        onClick={onClose}
        className="absolute top-4 right-4 z-10"
        aria-label="Close"
      >
        <svg className="w-6 h-6" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </NeoIconButton>

      {/* Scrollable content */}
      <div className="h-full overflow-y-auto pt-16 pb-8 px-6">
        <div className="text-content-secondary" style={{ fontSize: '1rem', lineHeight: 1.8 }}>
          {paragraphs.map((paragraph, pIndex) => {
            const words = paragraph.trim().split(' ')
            const boldCount = Math.min(3, words.length)

            return (
              <p key={pIndex} className="mb-4">
                {words.map((word, wIndex) => {
                  const currentWordIndex = wordIndex++
                  const isBold = wIndex < boldCount

                  return (
                    <motion.span
                      key={`${pIndex}-${wIndex}`}
                      className={isBold ? 'font-bold' : ''}
                      initial={{
                        opacity: 0,
                        y: 20,
                        filter: 'blur(4px)',
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                      }}
                      transition={{
                        duration: 0.3,
                        delay: currentWordIndex * 0.02,
                        ease: 'easeOut',
                      }}
                    >
                      {word}{' '}
                    </motion.span>
                  )
                })}
              </p>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

interface MobileAboutSectionProps {
  t: TranslateFn
  currentLanguage: string
  sectionRef: (el: HTMLElement | null) => void
  isMounted: boolean
}

export const MobileAboutSection = ({ t, currentLanguage, sectionRef, isMounted }: MobileAboutSectionProps) => {
  const [typedText, setTypedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [isAboutExpanded, setIsAboutExpanded] = useState(false)
  const aboutTextRef = useRef<HTMLDivElement>(null)

  // Typewriter effect - shows full content
  useEffect(() => {
    const aboutText = stripMarkdown(t('about_content') as string)
    if (!isTyping) return

    if (typedText.length < aboutText.length) {
      const timer = setTimeout(() => {
        setTypedText(aboutText.substring(0, typedText.length + 1))
      }, 20)
      return () => clearTimeout(timer)
    } else {
      setIsTyping(false)
    }
  }, [typedText, isTyping, t])

  // Reset typewriter when language changes
  useEffect(() => {
    setTypedText('')
    setIsTyping(true)
  }, [currentLanguage])

  // Auto-scroll about text to keep cursor visible
  useEffect(() => {
    if (aboutTextRef.current && isTyping) {
      aboutTextRef.current.scrollTop = aboutTextRef.current.scrollHeight
    }
  }, [typedText, isTyping])

  return (
    <>
      <section ref={sectionRef} className="pt-2 mb-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setIsAboutExpanded(true)}
          className={`rounded-2xl p-4 pl-8 bg-gradient-to-br ${sectionColors.home.gradient} border border-surface-border shadow-[0_6px_18px_-6px_rgba(0,0,0,0.18)] relative h-48 flex flex-col cursor-pointer active:scale-[0.98] transition-transform`}
        >
          {/* Vertical Label */}
          <VerticalLabel text={t('about_title') as string} color={sectionColors.home.icon} />

          {/* Hint to tap */}
          {/* Own row, so the typed text never runs underneath it */}
          <div className="flex justify-end -mt-1 mb-1 text-xs font-medium opacity-60 flex-shrink-0" style={{ color: sectionColors.home.icon }}>
            {t('tap_to_expand')}
          </div>

          {/* Scrollable text container with auto-scroll; top edge fades instead of cutting glyphs */}
          <div
            ref={aboutTextRef}
            className="flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-thin scroll-smooth"
            style={{ maskImage: 'linear-gradient(to bottom, transparent 0, black 1.25rem)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, black 1.25rem)' }}
          >
            <p className="text-base leading-relaxed text-content-secondary whitespace-pre-line">
              {typedText}
              {isTyping && (
                <span className="inline-block w-0.5 h-4 bg-brand-light ml-0.5 animate-[cursor-blink_1s_steps(2)_infinite]" />
              )}
            </p>
          </div>
        </motion.div>
      </section>

      {/* About Explosion Overlay Portal */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {isAboutExpanded && (
              <AboutExplosionOverlay
                text={t('about_content') as string}
                onClose={() => setIsAboutExpanded(false)}
                color={sectionColors.home.icon}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}
