import { Github, FileText, Terminal, ExternalLink, Presentation, Link2 } from 'lucide-react';
import { useLanguage } from '../../i18n';

const SERVICES = [
  { day: 1, name: 'Google AI Studio', url: 'https://aistudio.google.com/apikey', desc: 'Gemini API keys' },
  { day: 3, name: 'ffmpeg', url: 'https://ffmpeg.org/download.html', desc: 'Free, local install' },
  { day: 4, name: 'fal.ai', url: 'https://fal.ai/dashboard/keys', desc: 'Video generation' },
  { day: 5, name: 'ElevenLabs', url: 'https://elevenlabs.io', desc: 'Voice & audio' },
  { day: 6, name: 'Firecrawl', url: 'https://firecrawl.dev', desc: 'Web scraping' },
  { day: 7, name: 'Upload Post', url: 'https://upload-post.com', desc: 'Social publishing' },
  { day: 8, name: 'Green API', url: 'https://green-api.com', desc: 'WhatsApp API' },
  { day: 10, name: 'Netlify', url: 'https://netlify.com', desc: 'Free hosting' },
];

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Terminal, title: 'Claude Code', desc: isHe ? 'מנוי Pro או Max' : 'Pro or Max subscription', url: 'https://code.claude.com/docs/en/overview' },
            { icon: Github, title: 'GitHub Account', desc: isHe ? 'חשבון חינמי' : 'Free account', url: 'https://github.com' },
            { icon: Terminal, title: 'Node.js 20+', desc: isHe ? 'סביבת ריצה' : 'Runtime environment', url: 'https://nodejs.org' },
            { icon: Terminal, title: 'Git', desc: isHe ? 'נדרש לווינדוס' : 'Required for Windows', url: 'https://git-scm.com/downloads' },
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

      {/* Slide Presentations */}
      <div className="mb-10">
        <p className="font-mono text-[10px] text-signal-red uppercase tracking-widest mb-3">
          {isHe ? 'מצגות' : 'Slide Presentations'}
        </p>
        <h3 className="font-sans font-bold text-xl text-white mb-4">
          {isHe ? 'חזרה על השיעורים' : 'Review the Lessons'}
        </h3>
        <a
          href="https://guyaga-slides.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:border-signal-red/30 transition-colors group"
        >
          <Presentation size={18} className="text-signal-red" />
          <div className="flex-1 min-w-0">
            <span className="font-sans font-semibold text-sm text-white group-hover:text-signal-red transition-colors">
              {isHe ? 'מצגות כל השיעורים — דו-לשוני' : 'All Lesson Slides — Bilingual'}
            </span>
            <span className="block font-mono text-[10px] text-white/30 mt-0.5">guyaga-slides.netlify.app</span>
          </div>
          <ExternalLink size={14} className="text-white/20 group-hover:text-signal-red transition-colors" />
        </a>
      </div>

      {/* Service Accounts */}
      <div className="mb-10">
        <p className="font-mono text-[10px] text-signal-red uppercase tracking-widest mb-3">
          {isHe ? 'שירותים חיצוניים' : 'External Services'}
        </p>
        <h3 className="font-sans font-bold text-xl text-white mb-4">
          {isHe ? 'פתיחת חשבונות וקבלת מפתחות API' : 'Sign Up & Get API Keys'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SERVICES.map((s) => (
            <a
              key={`${s.day}-${s.name}`}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:border-signal-red/30 transition-colors group"
            >
              <span className="w-7 h-7 rounded-full bg-signal-red/10 text-signal-red font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                {s.day}
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-sans font-semibold text-sm text-white group-hover:text-signal-red transition-colors block truncate">
                  {s.name}
                </span>
                <span className="font-mono text-[10px] text-white/30 truncate block">{s.desc}</span>
              </div>
              <ExternalLink size={12} className="text-white/20 shrink-0" />
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
      <div className="mb-10">
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

      {/* Billing profiles */}
      <div>
        <p className="font-mono text-[10px] text-signal-red uppercase tracking-widest mb-3">
          {isHe ? 'חיוב' : 'Billing'}
        </p>
        <h3 className="font-sans font-bold text-xl text-white mb-4">
          {isHe ? 'ניהול תשלומים' : 'Manage Payments'}
        </h3>
        <div className="space-y-2">
          <a href="https://console.cloud.google.com/billing" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:border-signal-red/30 transition-colors group">
            <Link2 size={16} className="text-signal-red" />
            <span className="flex-1 font-sans text-sm text-white/70 group-hover:text-signal-red transition-colors">Google Cloud Billing</span>
            <ExternalLink size={12} className="text-white/20" />
          </a>
          <a href="https://fal.ai/dashboard/usage-billing/credits" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:border-signal-red/30 transition-colors group">
            <Link2 size={16} className="text-signal-red" />
            <span className="flex-1 font-sans text-sm text-white/70 group-hover:text-signal-red transition-colors">fal.ai Credits</span>
            <ExternalLink size={12} className="text-white/20" />
          </a>
        </div>
      </div>
    </div>
  );
}
