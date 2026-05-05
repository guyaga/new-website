import { useState } from 'react';
import { Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage, createT } from '../../i18n';
import LessonExpanded from './LessonExpanded';

export default function HubLessons({ sessions, memberName }) {
  const [expandedDay, setExpandedDay] = useState(null);
  const { lang } = useLanguage();
  const t = createT(lang);
  const isHe = lang === 'he';

  const unlocked = sessions.filter((s) => s.is_unlocked);
  const progress = unlocked.length;

  return (
    <div dir={isHe ? 'rtl' : 'ltr'}>
      {/* Welcome + Progress */}
      <div className="mb-8">
        <p className="font-sans text-lg text-white/60 mb-1">
          {isHe ? `שלום, ${memberName}` : `Welcome, ${memberName}`}
        </p>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-signal-red rounded-full transition-all duration-500"
              style={{ width: `${(progress / 10) * 100}%` }}
            />
          </div>
          <span className="font-mono text-xs text-white/40 shrink-0">
            {progress}/10
          </span>
        </div>
      </div>

      {/* All lessons */}
      <div className="space-y-3">
        {sessions.map((session) => {
          const isExpanded = expandedDay === session.day;
          const isLocked = !session.is_unlocked;
          const name = isHe ? session.name_he : session.name_en;

          return (
            <div
              key={session.id}
              className={`border rounded-xl overflow-hidden transition-colors ${
                isLocked
                  ? 'bg-white/[0.02] border-white/5 opacity-50'
                  : isExpanded
                    ? 'bg-white/[0.06] border-signal-red/20'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Header row */}
              <button
                onClick={() => !isLocked && setExpandedDay(isExpanded ? null : session.day)}
                disabled={isLocked}
                className="w-full flex items-center gap-4 p-5 text-start disabled:cursor-not-allowed"
              >
                {/* Day badge */}
                <span className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold ${
                  isLocked ? 'bg-white/5 text-white/20' : 'bg-signal-red text-white'
                }`}>
                  {session.day}
                </span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className={`font-sans font-semibold text-sm ${isLocked ? 'text-white/30' : 'text-white'}`}>
                    {name}
                  </span>
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-white/20 mt-0.5">
                    {session.service}
                  </span>
                </div>

                {/* Status */}
                {isLocked ? (
                  <div className="flex items-center gap-1.5">
                    <Lock size={14} className="text-white/20" />
                    <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
                      {isHe ? 'נעול' : 'Locked'}
                    </span>
                  </div>
                ) : (
                  isExpanded
                    ? <ChevronUp size={18} className="text-white/30" />
                    : <ChevronDown size={18} className="text-white/30" />
                )}
              </button>

              {/* Expanded content */}
              {isExpanded && !isLocked && (
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
