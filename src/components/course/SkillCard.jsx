import { Link } from 'react-router-dom';
import { Lock, Github, FileText, CheckCircle } from 'lucide-react';
import { useLanguage, createT } from '../../i18n';

export default function SkillCard({ session }) {
  const { lang } = useLanguage();
  const t = createT(lang);
  const isHe = lang === 'he';

  const name = isHe ? session.name_he : session.name_en;
  const desc = isHe ? session.desc_he : session.desc_en;
  const isLocked = !session.is_unlocked;

  const card = (
    <div
      className={`skill-card relative rounded-2xl border overflow-hidden p-6 transition-all duration-300 ${
        isLocked
          ? 'bg-white/5 border-white/5 opacity-60'
          : 'bg-white/[0.08] border-white/10 hover:border-signal-red/30 cursor-pointer'
      }`}
    >
      {/* Day badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-mono text-sm font-bold ${
          isLocked ? 'bg-white/10 text-white/30' : 'bg-signal-red text-white'
        }`}>
          {session.day}
        </span>

        {isLocked ? (
          <div className="flex items-center gap-1.5">
            <Lock size={14} className="text-white/30" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
              {t('course.skills.locked')}
            </span>
          </div>
        ) : (
          <CheckCircle size={16} className="text-emerald-400/60" />
        )}
      </div>

      {/* Service tag */}
      <span className="inline-block font-mono text-[10px] uppercase tracking-widest text-signal-red/70 mb-2">
        {session.service}
      </span>

      {/* Name */}
      <h3 className={`font-sans font-bold text-lg mb-2 ${isLocked ? 'text-white/40' : 'text-white'}`}>
        {name}
      </h3>

      {/* Description */}
      {desc && !isLocked && (
        <p className="font-sans text-sm text-white/50 mb-4 line-clamp-2">
          {desc}
        </p>
      )}

      {/* Resource indicators */}
      {!isLocked && (
        <div className="flex items-center gap-3 mt-auto pt-2">
          {session.github_url && (
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white/30">
              <Github size={12} />
              Repo
            </span>
          )}
          {session.pdf_url && (
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white/30">
              <FileText size={12} />
              {isHe ? 'מדריך' : 'Guide'}
            </span>
          )}
        </div>
      )}
    </div>
  );

  // Unlocked cards link to the course hub
  if (!isLocked) {
    return <Link to="/course/hub">{card}</Link>;
  }

  return card;
}
