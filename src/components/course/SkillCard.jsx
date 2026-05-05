import { useLanguage, createT } from '../../i18n';

// Short teasers for each lesson (marketing copy)
const TEASERS = {
  1: { en: 'Generate professional images from text — no Photoshop needed', he: 'צרו תמונות מקצועיות מטקסט — בלי פוטושופ' },
  2: { en: 'Understand any video — scene breakdown, transcription, emotions', he: 'הבינו כל סרטון — פירוק סצנות, תמלול, רגשות' },
  3: { en: 'Trim, merge, remove silences, add subtitles, create reels', he: 'חיתוך, מיזוג, הסרת שקטים, כתוביות, Reels' },
  4: { en: 'Create AI videos from your images with one prompt', he: 'צרו סרטוני AI מהתמונות שלכם בפרומפט אחד' },
  5: { en: 'Professional voiceover, music, and sound effects with AI', he: 'קריינות מקצועית, מוזיקה ואפקטים קוליים עם AI' },
  6: { en: 'Scrape any website — brand profiles, competitor analysis', he: 'סרקו כל אתר — פרופילי מותג, ניתוח מתחרים' },
  7: { en: 'Design and publish to 11 platforms in one click', he: 'עצבו ופרסמו ל-11 פלטפורמות בקליק אחד' },
  8: { en: 'Send and receive WhatsApp messages from Claude Code', he: 'שלחו וקבלו הודעות וואטסאפ מ-Claude Code' },
  9: { en: 'Create branded PowerPoint decks with storytelling', he: 'צרו מצגות PowerPoint ממותגות עם סיפור' },
  10: { en: 'Build a cinematic landing page and deploy it live', he: 'בנו אתר נחיתה קולנועי ופרסמו אותו' },
}

export default function SkillCard({ session }) {
  const { lang } = useLanguage();
  const t = createT(lang);
  const isHe = lang === 'he';

  const name = isHe ? session.name_he : session.name_en;
  const teaser = TEASERS[session.day]?.[lang] || TEASERS[session.day]?.en || '';

  return (
    <div className="skill-card relative rounded-2xl border border-white/10 overflow-hidden p-6 bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/15 transition-all duration-300">
      {/* Day badge + service */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-signal-red text-white font-mono text-sm font-bold">
          {session.day}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">
          {session.service}
        </span>
      </div>

      {/* Name */}
      <h3 className="font-sans font-bold text-lg text-white mb-2">
        {name}
      </h3>

      {/* Teaser */}
      {teaser && (
        <p className="font-sans text-sm text-white/40 leading-relaxed">
          {teaser}
        </p>
      )}
    </div>
  );
}
