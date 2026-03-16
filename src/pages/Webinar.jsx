import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useLanguage, createT } from '../i18n';

export default function Webinar() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';

  return (
    <>
      <Helmet>
        <title>{isHe ? 'וובינר – כל מה שחדש בכלי AI בתחילת 2026 | BestGuy.AI' : 'Webinar – Everything New in AI Tools, Beginning of 2026 | BestGuy.AI'}</title>
        <meta name="description" content={isHe ? 'וובינר מקצועי לחברי AI-Academy – כל מה שחדש בכלי AI בתחילת 2026' : 'Professional webinar for AI-Academy members – Everything new in AI tools at the beginning of 2026'} />
        <meta property="og:title" content="Everything New in AI Tools – Beginning of 2026 | BestGuy.AI" />
        <meta property="og:description" content="Professional webinar for AI-Academy members about the latest AI tools in early 2026." />
        <meta property="og:type" content="video.other" />
        <meta property="og:video" content="https://www.youtube.com/embed/3Ll0PmAavn8" />
      </Helmet>

      <main className="pt-32 pb-24 px-6" dir={isHe ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase text-black/50 hover:text-signal-red transition-colors mb-8"
          >
            {isHe ? '→' : '←'} {isHe ? 'חזרה לדף הבית' : 'Back to Home'}
          </Link>

          {/* Label */}
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-signal-red mb-4">
            {isHe ? 'וובינר' : 'Webinar Replay'}
          </p>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            {isHe
              ? 'כל מה שחדש בכלי AI בתחילת 2026'
              : 'Everything New in AI Tools — Beginning of 2026'}
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-lg md:text-xl text-black/60 mb-10 max-w-2xl">
            {isHe
              ? 'וובינר מקצועי שנערך לחברי AI-Academy – סקירה מקיפה של הכלים, העדכונים והטרנדים החדשים בעולם ה-AI.'
              : 'A professional webinar made for AI-Academy members — a comprehensive overview of the newest tools, updates, and trends in the AI world.'}
          </p>

          {/* Video embed */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black mb-10 shadow-xl">
            <iframe
              src="https://www.youtube.com/embed/3Ll0PmAavn8"
              title="Everything New in AI Tools – Beginning of 2026"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Details */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-paper/50 rounded-xl p-6">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-black/40 mb-2">
                {isHe ? 'נושא' : 'Topic'}
              </p>
              <p className="font-sans font-medium">
                {isHe ? 'כלי AI חדשים 2026' : 'New AI Tools 2026'}
              </p>
            </div>
            <div className="bg-paper/50 rounded-xl p-6">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-black/40 mb-2">
                {isHe ? 'קהל יעד' : 'Audience'}
              </p>
              <p className="font-sans font-medium">
                {isHe ? 'חברי AI-Academy' : 'AI-Academy Members'}
              </p>
            </div>
            <div className="bg-paper/50 rounded-xl p-6">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-black/40 mb-2">
                {isHe ? 'מציג' : 'Presented by'}
              </p>
              <p className="font-sans font-medium">Guy Aga</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center border-t border-black/10 pt-12">
            <p className="font-sans text-lg text-black/60 mb-6">
              {isHe
                ? 'רוצים ללמוד עוד על AI? הצטרפו ל-AI-Academy.'
                : 'Want to learn more about AI? Join the AI-Academy.'}
            </p>
            <a
              href="https://ai-academy.co.il"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-signal-red text-white font-sans font-medium px-8 py-3 rounded-full hover:bg-red-700 transition-colors"
            >
              {isHe ? 'הצטרפו עכשיו' : 'Join AI-Academy'}
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
