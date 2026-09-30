'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // A chunk that 404s right after a VPS release crashes the page once; one reload fixes it
  useEffect(() => {
    const isChunkError = error?.name === 'ChunkLoadError' || /Loading (CSS )?chunk|dynamically imported module/i.test(error?.message || '')
    if (!isChunkError) return
    try {
      if (sessionStorage.getItem('chunk_reload')) return
      sessionStorage.setItem('chunk_reload', '1')
    } catch { return }
    window.location.reload()
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>Error</h1>
        <h2 className="text-2xl font-semibold mb-4" style={{ color: '#ffffff' }}>Something went wrong</h2>
        <p className="mb-8 max-w-md mx-auto" style={{ color: '#d1d5db' }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 font-medium transition-colors"
          style={{ color: '#ffffff' }}
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
