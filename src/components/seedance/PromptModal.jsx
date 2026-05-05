import { useEffect, useRef, useState } from 'react';
import { X, Copy, Check, ExternalLink, Play } from 'lucide-react';

export default function PromptModal({ prompt, onClose }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 md:p-8 overflow-y-auto"
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-4xl bg-[#111] border border-white/10 rounded-lg overflow-hidden my-8 animate-[modalIn_0.2s_ease-out]"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Video / Thumbnail with source link */}
        <div className="aspect-video bg-black relative">
          {!videoFailed ? (
            <video
              src={prompt.video_url}
              controls
              autoPlay
              playsInline
              onError={() => setVideoFailed(true)}
              className="w-full h-full object-contain"
            />
          ) : (
            <a
              href={prompt.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full relative group"
            >
              <img
                src={prompt.thumbnail_url}
                alt={prompt.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-signal-red flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-white ml-1" fill="white" />
                </div>
                <span className="font-mono text-xs text-white/70">Watch on source</span>
              </div>
            </a>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h2 className="font-sans font-bold text-xl md:text-2xl text-white mb-2">
            {prompt.title}
          </h2>

          <p className="font-sans text-sm text-white/60 mb-6 leading-relaxed">
            {prompt.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-6">
            {prompt.author && (
              <span className="font-mono text-xs text-white/40">
                {prompt.author_url ? (
                  <a
                    href={prompt.author_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-signal-red transition-colors"
                  >
                    {prompt.author}
                  </a>
                ) : prompt.author}
              </span>
            )}
            {prompt.date && (
              <span className="font-mono text-xs text-white/30">{prompt.date}</span>
            )}
            {prompt.source_url && (
              <a
                href={prompt.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-white/30 hover:text-signal-red transition-colors flex items-center gap-1"
              >
                Source <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Prompt text */}
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                Prompt
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 font-mono text-xs bg-signal-red/10 text-signal-red hover:bg-signal-red hover:text-white px-3 py-1.5 rounded-full transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="bg-black/50 border border-white/10 rounded-lg p-4 max-h-[300px] overflow-y-auto">
              <pre className="font-mono text-xs text-white/70 whitespace-pre-wrap break-words leading-relaxed">
                {prompt.prompt}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
