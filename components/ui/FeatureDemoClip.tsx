'use client'

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface FeatureDemoClipProps {
  src: string;
  type?: string | null;
  className?: string;
  title?: string;
  /**
   * The clip carries a voiceover, so offer a sound toggle. Muted autoplay stays
   * the default — browsers block anything else, and a page that starts talking
   * on load is hostile.
   *
   * 2026-08-31: this replaces a short-lived version that swapped the whole
   * player for a YouTube embed. Same file, same moment in the timeline, no
   * third-party iframe (and no Google cookies fired before the consent banner).
   */
  hasSound?: boolean;
  soundOnLabel?: string;
  soundOffLabel?: string;
}

/**
 * Short demo clip (mp4/webm) played like a GIF: autoplay, muted, looping,
 * inline — no controls. With `hasSound` it also gets an unmute button.
 */
export const FeatureDemoClip = ({
  src,
  type,
  className,
  title,
  hasSound,
  soundOnLabel,
  soundOffLabel,
}: FeatureDemoClipProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  // React does not reliably emit the `muted` attribute during SSR, which can
  // cost us the muted-autoplay allowance — set it on the element directly.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  if (!src) return null;

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    setMuted(next);
    if (!next) void video.play().catch(() => undefined);
  };

  return (
    <div className={`relative rounded-lg overflow-hidden border border-surface-border bg-black/20 ${className || ''}`}>
      <video
        ref={videoRef}
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

      {hasSound && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? soundOnLabel : soundOffLabel}
          className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-black/70 px-3.5 py-2 text-sm font-medium text-white backdrop-blur-sm transition-transform hover:scale-105 focus-visible:scale-105"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{muted ? soundOnLabel : soundOffLabel}</span>
        </button>
      )}
    </div>
  );
};
