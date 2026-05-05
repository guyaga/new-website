import { useState } from 'react';
import { Gift, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n';
import LessonExpanded from './LessonExpanded';

export default function HubBonuses({ sessions }) {
  const [expandedId, setExpandedId] = useState(null);
  const { lang } = useLanguage();
  const isHe = lang === 'he';

  if (!sessions || sessions.length === 0) {
    return (
      <div dir={isHe ? 'rtl' : 'ltr'} className="text-center py-16">
        <Gift size={32} className="mx-auto text-white/20 mb-4" />
        <p className="font-sans text-white/40">
          {isHe ? 'בונוסים חדשים בדרך — חזרו בקרוב' : 'New bonuses coming soon — check back'}
        </p>
      </div>
    );
  }

  return (
    <div dir={isHe ? 'rtl' : 'ltr'}>
      {/* Intro */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-signal-red/10 border border-signal-red/30 mb-3">
          <Sparkles size={12} className="text-signal-red" />
          <span className="font-mono text-[10px] text-signal-red uppercase tracking-widest">
            {isHe ? 'בונוסים' : 'Bonuses'}
          </span>
        </div>
        <h2 className="font-sans font-bold text-2xl tracking-tight mb-2">
          {isHe ? 'תוכן נוסף לקורס' : 'Extra Content for the Course'}
        </h2>
        <p className="font-sans text-sm text-white/50 leading-relaxed max-w-2xl">
          {isHe
            ? 'סקילים נוספים, קישורי MCP, וכלים שקיבלתם כחלק מהקורס. לא חלק מ-10 הימים המרכזיים — תוספות שמרחיבות את ארגז הכלים שלכם.'
            : 'Extra skills, MCP links, and tools that come with the course. Not part of the core 10 days — additions that expand your toolkit.'}
        </p>
      </div>

      {/* Bonus cards */}
      <div className="space-y-3">
        {sessions.map((session) => {
          const isExpanded = expandedId === session.id;
          const name = isHe ? session.name_he : session.name_en;

          return (
            <div
              key={session.id}
              className={`border rounded-xl overflow-hidden transition-colors ${
                isExpanded
                  ? 'bg-white/[0.06] border-signal-red/20'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : session.id)}
                className="w-full flex items-center gap-4 p-5 text-start"
              >
                {/* Gift badge */}
                <span className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-signal-red/15 text-signal-red">
                  <Gift size={18} />
                </span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className="font-sans font-semibold text-sm text-white">
                    {name}
                  </span>
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-white/20 mt-0.5">
                    {session.service}
                  </span>
                </div>

                {/* Expand indicator */}
                {isExpanded
                  ? <ChevronUp size={18} className="text-white/30" />
                  : <ChevronDown size={18} className="text-white/30" />}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-white/10">
                  <LessonExpanded session={session} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
