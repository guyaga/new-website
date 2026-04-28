import { Github, FileText, Terminal, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../i18n';

export default function HubResources({ sessions }) {
  const { lang } = useLanguage();
  const isHe = lang === 'he';

  const unlocked = sessions.filter((s) => s.is_unlocked);
  const repos = unlocked.filter((s) => s.github_url);
  const guides = unlocked.filter((s) => s.pdf_url);

  return (
    <div dir={isHe ? 'rtl' : 'ltr'}>
      {/* Setup section */}
      <div className="mb-10">
        <p className="font-mono text-[10px] text-signal-red uppercase tracking-widest mb-3">
          {isHe ? 'הגדרה ראשונית' : 'Getting Started'}
        </p>
        <h3 className="font-sans font-bold text-xl text-white mb-4">
          {isHe ? 'מה צריך כדי להתחיל' : 'What You Need'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Terminal,
              title: 'Claude Code',
              desc: isHe ? 'מנוי Pro או Max' : 'Pro or Max subscription',
              url: 'https://claude.ai/code',
            },
            {
              icon: Github,
              title: 'GitHub Account',
              desc: isHe ? 'חשבון חינמי' : 'Free account',
              url: 'https://github.com',
            },
            {
              icon: Terminal,
              title: 'Node.js 20+',
              desc: isHe ? 'סביבת ריצה' : 'Runtime environment',
              url: 'https://nodejs.org',
            },
          ].map((item) => (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-signal-red/30 transition-colors group"
            >
              <item.icon size={20} className="text-signal-red mb-3" />
              <h4 className="font-sans font-semibold text-sm text-white mb-1 group-hover:text-signal-red transition-colors">
                {item.title}
              </h4>
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">{item.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* GitHub repos */}
      <div className="mb-10">
        <p className="font-mono text-[10px] text-signal-red uppercase tracking-widest mb-3">
          GitHub Repositories
        </p>
        <h3 className="font-sans font-bold text-xl text-white mb-4">
          {isHe ? 'מאגרי קוד' : 'Code Repositories'}
        </h3>
        {repos.length === 0 ? (
          <p className="font-sans text-sm text-white/30">
            {isHe ? 'עדיין אין מאגרים זמינים' : 'No repositories available yet'}
          </p>
        ) : (
          <div className="space-y-2">
            {repos.map((s) => (
              <a
                key={s.id}
                href={s.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:border-signal-red/30 transition-colors group"
              >
                <span className="w-8 h-8 rounded-full bg-signal-red/10 text-signal-red font-mono text-xs font-bold flex items-center justify-center">
                  {s.day}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-sans font-semibold text-sm text-white group-hover:text-signal-red transition-colors">
                    {isHe ? s.name_he : s.name_en}
                  </span>
                  <span className="block font-mono text-[10px] text-white/30 truncate">{s.github_url}</span>
                </div>
                <ExternalLink size={14} className="text-white/20 group-hover:text-signal-red transition-colors" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Guides */}
      <div>
        <p className="font-mono text-[10px] text-signal-red uppercase tracking-widest mb-3">
          {isHe ? 'מדריכים' : 'Guides'}
        </p>
        <h3 className="font-sans font-bold text-xl text-white mb-4">
          {isHe ? 'מדריכי סקילים' : 'Skill Guides'}
        </h3>
        {guides.length === 0 ? (
          <p className="font-sans text-sm text-white/30">
            {isHe ? 'עדיין אין מדריכים זמינים' : 'No guides available yet'}
          </p>
        ) : (
          <div className="space-y-2">
            {guides.map((s) => (
              <a
                key={s.id}
                href={s.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:border-signal-red/30 transition-colors group"
              >
                <FileText size={18} className="text-signal-red" />
                <div className="flex-1 min-w-0">
                  <span className="font-sans font-semibold text-sm text-white group-hover:text-signal-red transition-colors">
                    {isHe ? `יום ${s.day}: ${s.name_he}` : `Day ${s.day}: ${s.name_en}`}
                  </span>
                </div>
                <ExternalLink size={14} className="text-white/20 group-hover:text-signal-red transition-colors" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
