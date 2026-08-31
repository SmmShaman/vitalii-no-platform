'use client'

import { useState } from 'react';
import { Volume2 } from 'lucide-react';

interface FeatureDemoClipProps {
  src: string;
  type?: string | null;
  className?: string;
  title?: string;
  /**
   * When the feature has a narrated cut on YouTube, the silent loop doubles as
   * its poster: clicking swaps it for the embed, which plays with sound.
   * Added 2026-08-31 — before that the only way to hear the voiceover from the
   * site was a text link below the clip, which nobody followed.
   */
  youtubeId?: string | null;
  /** Localized label for the overlay button. */
  soundLabel?: string;
}

/**
 * Short silent demo clip (mp4/webm) played like a GIF:
 * autoplay, muted, looping, inline — no controls.
 * With `youtubeId` it becomes a click-to-unmute poster for the narrated cut.
 */
export const FeatureDemoClip = ({ src, type, className, title, youtubeId, soundLabel }: FeatureDemoClipProps) => {
  const [narrated, setNarrated] = useState(false);

  if (!src) return null;

  if (youtubeId && narrated) {
    return (
      <div className={`rounded-lg overflow-hidden border border-surface-border bg-black ${className || ''}`}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full aspect-video"
        />
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden border border-surface-border bg-black/20 ${className || ''}`}>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={title}
        className="w-full h-auto"
      >
        <source src={src} type={type || 'video/mp4'} />
      </video>

      {youtubeId && (
        <button
          type="button"
          onClick={() => setNarrated(true)}
          aria-label={soundLabel}
          className="absolute inset-0 flex items-end justify-center pb-4 sm:pb-5 bg-black/0 hover:bg-black/25 focus-visible:bg-black/25 transition-colors group"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-transform group-hover:scale-105">
            <Volume2 className="w-4 h-4" />
            {soundLabel}
          </span>
        </button>
      )}
    </div>
  );
};
