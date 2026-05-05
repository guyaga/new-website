import { Play } from 'lucide-react';

export default function PromptCard({ prompt, onClick }) {
  return (
    <button
      onClick={() => onClick(prompt)}
      className="group text-left w-full bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-white/5">
        <img
          src={prompt.thumbnail_url}
          alt={prompt.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-signal-red/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 md:p-4">
        <h3 className="font-sans text-sm font-medium text-white line-clamp-1 mb-1">
          {prompt.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-white/40 truncate">
            {prompt.author}
          </span>
          {prompt.date && (
            <span className="font-mono text-[11px] text-white/30 shrink-0 ml-2">
              {prompt.date}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
