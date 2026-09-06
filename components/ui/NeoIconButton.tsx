'use client'

import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from 'react'

/**
 * Neumorphic ("embossed") circle icon button.
 * The puck is cut from the same tone as the surface it sits on, so pass
 * `base` = the parent's surface token. Styles live in app/globals.css (.neo-btn).
 */
export type NeoEffect = 'press' | 'lift' | 'ring' | 'shine' | '3d'
export type NeoSize = 'sm' | 'md' | 'lg'
export type NeoBase = 'surface' | 'surface-darker' | 'surface-elevated' | 'surface-deep'

export interface NeoIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Hover/click behaviour. Default: press (sinks into the surface on click). */
  effect?: NeoEffect
  /** Puck diameter: sm 36px, md 44px, lg 56px. */
  size?: NeoSize
  /** Surface token of the parent, so the puck matches it. */
  base?: NeoBase
  /** Render the puck sunk in — for toggles that are "on". */
  pressed?: boolean
}

const SIZE_CLASS: Record<NeoSize, string> = {
  sm: 'neo-btn--sm w-9 h-9',
  md: 'w-11 h-11',
  lg: 'neo-btn--lg w-14 h-14',
}

const BASE_VAR: Record<NeoBase, string> = {
  surface: 'var(--surface-dark)',
  'surface-darker': 'var(--surface-darker)',
  'surface-elevated': 'var(--surface-elevated)',
  'surface-deep': 'var(--surface-deep)',
}

const NeoIconButton = forwardRef<HTMLButtonElement, NeoIconButtonProps>(function NeoIconButton(
  { effect = 'press', size = 'md', base = 'surface', pressed = false, className = '', style, type = 'button', children, ...rest },
  ref,
) {
  const mergedStyle = { '--neo-base': BASE_VAR[base], ...style } as CSSProperties
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={rest['aria-pressed'] ?? (pressed || undefined)}
      className={`neo-btn neo-btn--${effect} ${SIZE_CLASS[size]} ${pressed ? 'is-pressed' : ''} ${className}`.trim()}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </button>
  )
})

export default NeoIconButton
