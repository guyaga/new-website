import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, Check, ClipboardList } from 'lucide-react';
import { useLanguage } from '../i18n';
import { checkMemberEmail, getSessions } from '../utils/course';
import { submitSurvey } from '../utils/survey';
import EmailGate from '../components/course/EmailGate';

const TIME_OPTIONS = [
  { value: 'lt1', he: 'פחות משעה', en: '< 1 hour' },
  { value: '1to3', he: '1-3 שעות', en: '1–3 hours' },
  { value: '3to10', he: '3-10 שעות', en: '3–10 hours' },
  { value: '10plus', he: '10 שעות ומעלה', en: '10+ hours' },
];

export default function CourseSurvey() {
  const [member, setMember] = useState(null);
  const [verifying, setVerifying] = useState(true);
  const [lessons, setLessons] = useState([]);

  const [name, setName] = useState('');
  const [nps, setNps] = useState(null);
  const [overallRating, setOverallRating] = useState(0);
  const [topUseful, setTopUseful] = useState([]);  // array of day numbers, max 3
  const [needsDepth, setNeedsDepth] = useState(null);
  const [whatBuilt, setWhatBuilt] = useState('');
  const [weeklyTime, setWeeklyTime] = useState('');
  const [nextTopic, setNextTopic] = useState('');
  const [additional, setAdditional] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { lang, setLang, toggleLang } = useLanguage();
  const isHe = lang === 'he';

  // Force Hebrew on first mount (user can toggle)
  useEffect(() => {
    setLang('he');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Verify membership + fetch lessons in parallel
  useEffect(() => {
    async function init() {
      const [savedEmail, sessions] = [localStorage.getItem('course_member_email'), await getSessions()];
      setLessons(sessions.filter((s) => (s.category || 'lesson') === 'lesson' && s.day >= 1 && s.day <= 10).sort((a, b) => a.day - b.day));
      if (savedEmail) {
        const m = await checkMemberEmail(savedEmail);
        if (m) {
          setMember(m);
          setName(m.name || '');
        } else {
          localStorage.removeItem('course_member_email');
          localStorage.removeItem('course_member_name');
        }
      }
      setVerifying(false);
    }
    init();
  }, []);

  const handleVerified = (m) => {
    setMember(m);
    setName(m.name || '');
  };

  const toggleUseful = (day) => {
    setTopUseful((prev) => {
      if (prev.includes(day)) return prev.filter((d) => d !== day);
      if (prev.length >= 3) return prev;  // cap at 3
      return [...prev, day];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await submitSurvey({
        email: member.email,
        name: name.trim() || member.name,
        nps,
        overall_rating: overallRating > 0 ? overallRating : undefined,
        top_useful_days: topUseful,
        needs_depth_day: needsDepth,
        what_built: whatBuilt.trim(),
        weekly_time_saved: weeklyTime || undefined,
        next_topic: nextTopic.trim(),
        additional_comments: additional.trim(),
        lang,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Submission failed');
    }
    setSubmitting(false);
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-mono text-xs text-white/40 uppercase tracking-widest">Loading...</div>
      </div>
    );
  }

  if (!member) {
    return <EmailGate onVerified={handleVerified} />;
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6" dir={isHe ? 'rtl' : 'ltr'}>
        <Helmet><title>{isHe ? 'תודה!' : 'Thank you!'}</title><meta name="robots" content="noindex,nofollow" /></Helmet>
        <div className="w-full max-w-md text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-signal-red/10 mb-6 mx-auto">
            <Check size={28} className="text-signal-red" />
          </div>
          <h1 className="font-sans font-bold text-3xl text-white mb-3">
            {isHe ? 'תודה רבה!' : 'Thank you!'}
          </h1>
          <p className="font-sans text-white/50 leading-relaxed">
            {isHe
              ? 'המשוב שלך התקבל. הוא עוזר לי לבנות את הקורס הבא טוב יותר.'
              : 'Your feedback was received. It helps me build the next course better.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white" dir={isHe ? 'rtl' : 'ltr'}>
      <Helmet><title>{isHe ? 'סקר קורס' : 'Course Survey'}</title><meta name="robots" content="noindex,nofollow" /></Helmet>

      {/* Header */}
      <div className="border-b border-white/10 px-6 md:px-12 py-5 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-signal-red mb-1 flex items-center gap-2">
            <ClipboardList size={12} /> {isHe ? 'סקר · 10 ימים 10 סקילים' : 'Survey · 10 Days 10 Skills'}
          </p>
          <p className="font-mono text-xs text-white/40">{member.email}</p>
        </div>
        <button
          onClick={toggleLang}
          className="font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-white px-3 py-1.5 border border-white/10 rounded-full"
        >
          {isHe ? 'EN' : 'עב'}
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        <h1 className="font-sans font-bold text-3xl md:text-4xl tracking-tight mb-3">
          {isHe ? 'סקר קצר על הקורס' : 'Quick course survey'}
        </h1>
        <p className="font-sans text-white/50 leading-relaxed mb-12 max-w-xl">
          {isHe
            ? '8 שאלות, ~3 דקות. עוזר לי להבין מה עבד ומה הקורס הבא צריך לכלול.'
            : '8 questions, ~3 minutes. Helps me understand what worked and what the next course should include.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Q1: NPS */}
          <div>
            <label className="block font-sans text-base font-semibold text-white mb-2">
              1. {isHe ? 'כמה סביר שתמליצו על הקורס לחבר/ה?' : 'How likely are you to recommend this course?'}
            </label>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-4">
              0 = {isHe ? 'בכלל לא' : 'Not at all'} · 10 = {isHe ? 'בוודאות' : 'Definitely'}
            </p>
            <div className="grid grid-cols-11 gap-1.5" dir="ltr">
              {Array.from({ length: 11 }, (_, n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNps(n)}
                  className={`aspect-square rounded-lg font-mono text-sm font-bold transition-colors ${
                    nps === n
                      ? 'bg-signal-red text-white'
                      : 'bg-white/[0.03] border border-white/10 text-white/60 hover:border-white/30'
                  }`}
                >{n}</button>
              ))}
            </div>
          </div>

          {/* Q2: Overall rating */}
          <div>
            <label className="block font-sans text-base font-semibold text-white mb-4">
              2. {isHe ? 'ציון כולל לקורס' : 'Overall rating'}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n} type="button"
                  onClick={() => setOverallRating(n === overallRating ? 0 : n)}
                  className={`p-2 rounded-lg transition-colors ${n <= overallRating ? 'text-signal-red' : 'text-white/20 hover:text-white/40'}`}
                >
                  <Star size={32} fill={n <= overallRating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          {/* Q3: Top 3 useful */}
          <div>
            <label className="block font-sans text-base font-semibold text-white mb-2">
              3. {isHe ? 'אילו 3 סקילים היו הכי שימושיים?' : 'Top 3 most useful skills'}
            </label>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-4">
              {isHe ? `נבחרו ${topUseful.length}/3` : `${topUseful.length}/3 selected`}
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {lessons.map((l) => {
                const selected = topUseful.includes(l.day);
                const disabled = !selected && topUseful.length >= 3;
                return (
                  <button
                    key={l.day} type="button"
                    onClick={() => toggleUseful(l.day)}
                    disabled={disabled}
                    className={`text-start p-3 rounded-lg border transition-colors ${
                      selected
                        ? 'bg-signal-red/10 border-signal-red/40'
                        : disabled
                          ? 'bg-white/[0.02] border-white/5 opacity-30'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-signal-red uppercase tracking-widest">Day {l.day}</span>
                    <span className="block font-sans text-sm text-white mt-0.5">{isHe ? l.name_he : l.name_en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Q4: Needs depth */}
          <div>
            <label className="block font-sans text-base font-semibold text-white mb-4">
              4. {isHe ? 'איזה סקיל הרגשתם שצריך עומק נוסף?' : 'Which skill needed more depth?'}
            </label>
            <div className="grid sm:grid-cols-2 gap-2">
              {lessons.map((l) => {
                const selected = needsDepth === l.day;
                return (
                  <button
                    key={l.day} type="button"
                    onClick={() => setNeedsDepth(selected ? null : l.day)}
                    className={`text-start p-3 rounded-lg border transition-colors ${
                      selected ? 'bg-amber-500/10 border-amber-500/40' : 'bg-white/[0.03] border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className={`font-mono text-[10px] uppercase tracking-widest ${selected ? 'text-amber-400' : 'text-signal-red'}`}>Day {l.day}</span>
                    <span className="block font-sans text-sm text-white mt-0.5">{isHe ? l.name_he : l.name_en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Q5: What built */}
          <div>
            <label className="block font-sans text-base font-semibold text-white mb-2">
              5. {isHe ? 'מה בניתם בקורס?' : 'What did you build during the course?'}
            </label>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">
              {isHe ? '(לא חובה)' : '(optional)'}
            </p>
            <textarea
              value={whatBuilt} onChange={(e) => setWhatBuilt(e.target.value)}
              rows={3} dir={isHe ? 'rtl' : 'ltr'}
              placeholder={isHe ? 'אפליקציה, אתר, כלי אוטומציה, פרויקט...' : 'An app, a site, an automation, a project...'}
              className="w-full bg-white/[0.03] border border-white/10 focus:border-signal-red rounded-xl p-4 font-sans text-white outline-none transition-colors placeholder:text-white/20 resize-none"
            />
          </div>

          {/* Q6: Time saved */}
          <div>
            <label className="block font-sans text-base font-semibold text-white mb-4">
              6. {isHe ? 'כמה זמן בשבוע אתם חוסכים עם הכלים החדשים?' : 'How much time do you save per week with the new tools?'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.value} type="button"
                  onClick={() => setWeeklyTime(opt.value === weeklyTime ? '' : opt.value)}
                  className={`p-3 rounded-lg border font-sans text-sm transition-colors ${
                    weeklyTime === opt.value ? 'bg-signal-red/10 border-signal-red/40 text-white' : 'bg-white/[0.03] border-white/10 text-white/60 hover:border-white/30'
                  }`}
                >{isHe ? opt.he : opt.en}</button>
              ))}
            </div>
          </div>

          {/* Q7: Next topic */}
          <div>
            <label className="block font-sans text-base font-semibold text-white mb-2">
              7. {isHe ? 'איזה נושא הייתם רוצים בקורס מתקדם?' : 'What topic for an advanced course?'}
            </label>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">
              {isHe ? '(לא חובה)' : '(optional)'}
            </p>
            <textarea
              value={nextTopic} onChange={(e) => setNextTopic(e.target.value)}
              rows={2} dir={isHe ? 'rtl' : 'ltr'}
              placeholder={isHe ? 'AI agents, MCP מתקדם, אוטומציה, סוכני קוד...' : 'AI agents, advanced MCP, automation, coding agents...'}
              className="w-full bg-white/[0.03] border border-white/10 focus:border-signal-red rounded-xl p-4 font-sans text-white outline-none transition-colors placeholder:text-white/20 resize-none"
            />
          </div>

          {/* Q8: Additional */}
          <div>
            <label className="block font-sans text-base font-semibold text-white mb-2">
              8. {isHe ? 'משהו נוסף?' : 'Anything else?'}
            </label>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">
              {isHe ? '(לא חובה)' : '(optional)'}
            </p>
            <textarea
              value={additional} onChange={(e) => setAdditional(e.target.value)}
              rows={3} dir={isHe ? 'rtl' : 'ltr'}
              className="w-full bg-white/[0.03] border border-white/10 focus:border-signal-red rounded-xl p-4 font-sans text-white outline-none transition-colors placeholder:text-white/20 resize-none"
            />
          </div>

          {error && <p className="font-sans text-sm text-signal-red">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto px-8 bg-signal-red text-white py-3 rounded-full font-sans font-bold text-sm transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
          >
            {submitting ? (isHe ? 'שולח...' : 'Sending...') : (isHe ? 'שליחת הסקר' : 'Submit survey')}
          </button>
        </form>
      </div>
    </div>
  );
}
