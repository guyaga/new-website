import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import PromptCard from './PromptCard';

export default function PromptGrid({ prompts, loading, onCardClick }) {
  const gridRef = useRef(null);

  useEffect(() => {
    if (loading || !prompts.length) return;
    const ctx = gsap.context(() => {
      gsap.from('.seedance-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power3.out',
      });
    }, gridRef);
    return () => ctx.revert();
  }, [loading, prompts.length]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden animate-pulse">
            <div className="aspect-video bg-white/5" />
            <div className="p-3 md:p-4 space-y-2">
              <div className="h-4 bg-white/5 rounded w-3/4" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!prompts.length) {
    return (
      <div className="text-center py-24">
        <p className="font-sans text-lg text-white/40">No prompts found</p>
        <p className="font-mono text-sm text-white/20 mt-2">Try a different search term</p>
      </div>
    );
  }

  return (
    <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {prompts.map((prompt) => (
        <div key={prompt.id} className="seedance-card">
          <PromptCard prompt={prompt} onClick={onCardClick} />
        </div>
      ))}
    </div>
  );
}
