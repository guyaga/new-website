import { ExternalLink } from 'lucide-react';
import { useLanguage, createT } from '../../i18n';

const SOCIALS = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/guyaga/' },
  { name: 'YouTube', url: 'https://www.youtube.com/channel/UCc0ZbMyx7brZhdHf1G6ud2A' },
  { name: 'AI Academy', url: 'https://ai-academy.co.il' },
  { name: 'Website', url: 'https://bestguy.ai' },
];

export default function HubAbout() {
  const { lang } = useLanguage();
  const t = createT(lang);
  const isHe = lang === 'he';

  return (
    <div dir={isHe ? 'rtl' : 'ltr'}>
      {/* Instructor */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="shrink-0 w-32 h-32 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <img
            src="/course/instructor.jpg"
            alt="Guy Aga"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
        <div>
          <p className="font-mono text-[10px] text-signal-red uppercase tracking-widest mb-2">
            {isHe ? 'המרצה שלכם' : 'Your Instructor'}
          </p>
          <h3 className="font-sans font-bold text-2xl text-white mb-1">
            {t('course.instructor.heading')}
          </h3>
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-4">
            {t('course.instructor.role')}
          </p>
          <p className="font-sans text-sm text-white/60 leading-relaxed max-w-lg">
            {t('course.instructor.bio')}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { value: '10+', label: isHe ? 'שנות ניסיון' : 'Years Experience' },
          { value: '7', label: isHe ? 'לקוחות מובילים' : 'Top Clients' },
          { value: '1000+', label: isHe ? 'סטודנטים' : 'Students' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
            <span className="block font-serif italic text-3xl text-signal-red mb-1">{stat.value}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Social links */}
      <div>
        <p className="font-mono text-[10px] text-signal-red uppercase tracking-widest mb-4">
          {isHe ? 'קישורים' : 'Connect'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SOCIALS.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:border-signal-red/30 transition-colors group"
            >
              <span className="font-sans font-semibold text-sm text-white group-hover:text-signal-red transition-colors">
                {social.name}
              </span>
              <ExternalLink size={14} className="text-white/20 group-hover:text-signal-red transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* Course info */}
      <div className="mt-12 bg-white/[0.03] border border-white/10 rounded-xl p-6">
        <p className="font-mono text-[10px] text-signal-red uppercase tracking-widest mb-3">
          {isHe ? 'על הקורס' : 'About the Course'}
        </p>
        <h3 className="font-sans font-bold text-lg text-white mb-3">
          10 {isHe ? 'ימים' : 'Days'} 10 {isHe ? 'סקילים' : 'Skills'}
        </h3>
        <p className="font-sans text-sm text-white/50 leading-relaxed">
          {t('course.overview.desc')}
        </p>
        <p className="font-mono text-xs text-white/30 mt-4">
          {isHe ? 'שאלות? צרו קשר:' : 'Questions? Contact:'}{' '}
          <a href="mailto:Guy@aga.digital" className="text-signal-red hover:underline">Guy@aga.digital</a>
        </p>
      </div>
    </div>
  );
}
