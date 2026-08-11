'use client'

interface FeatureDemoClipProps {
  src: string;
  type?: string | null;
  className?: string;
  title?: string;
}

/**
 * Short silent demo clip (mp4/webm) played like a GIF:
 * autoplay, muted, looping, inline — no controls.
 */
export const FeatureDemoClip = ({ src, type, className, title }: FeatureDemoClipProps) => {
  if (!src) return null;

  return (
    <div className={`rounded-lg overflow-hidden border border-surface-border bg-black/20 ${className || ''}`}>
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
    </div>
  );
};
