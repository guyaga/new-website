import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, Check } from 'lucide-react';
import { useLanguage } from '../i18n';
import { checkMemberEmail } from '../utils/course';
import { submitTestimonial } from '../utils/testimonials';
import EmailGate from '../components/course/EmailGate';

const TEMPLATES = {
  he: [
    'הקורס פתח לי אפשרויות שלא חשבתי שאני אהיה מסוגל לעשות. כבר בניתי: ___',
    'גיא לוקח את AI ומפרק אותו לשפה פשוטה. מה שלקח לי שעות של חיפוש בגוגל לוקח לי עכשיו 20 דקות.',
    'לא הייתי [מתכנת/ת / יוצר/ת / מעצב/ת] לפני הקורס. עכשיו יש לי [פרויקט / אתר / אפליקציה] שעובד.',
    'אם אתם שוקלים את הקורס — אל תחכו. זה הקורס הכי שימושי שלקחתי השנה.',
  ],
  en: [
    "This course opened doors I didn't know existed. In 10 days I built [_______].",
    'Guy turns AI into something I can actually use. What used to take hours of Googling now takes me 20 minutes.',
    "I wasn't a [coder / creator / designer] before this. Now I have a [project / app / site] that actually works.",
    "If you're on the fence about this course — don't be. It's the most useful course I've taken this year.",
  ],
};

export default function CourseFeedback() {
  const [member, setMember] = useState(null);
  const [verifying, setVerifying] = useState(true);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [rating, setRating] = useState(0);
  const [testimonial, setTestimonial] = useState('');

  const [improvement, setImprovement] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { lang, setLang, toggleLang } = useLanguage();
  const isHe = lang === 'he';

  // Force Hebrew on first mount of this page (user can still toggle)
  useEffect(() => {
    setLang('he');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function verify() {
      const savedEmail = localStorage.getItem('course_member_email');
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
    verify();
  }, []);

  const handleVerified = (m) => {
    setMember(m);
    setName(m.name || '');
  };

  const handlePickTemplate = (text) => {
    setTestimonial(text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!testimonial.trim() || testimonial.trim().length < 10) {
      setError(isHe ? 'הטקסט קצר מדי (10 תווים לפחות)' : 'Testimonial too short (10 chars min)');
      return;
    }
    setSubmitting(true);
    try {
      await submitTestimonial({
        email: member.email,
        name: name.trim() || member.name,
        role: role.trim(),
        company: company.trim(),
        linkedin_url: linkedinUrl.trim(),
        rating: rating > 0 ? rating : undefined,
        testimonial: testimonial.trim(),
        improvement: improvement.trim(),
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
        <Helmet>
          <title>{isHe ? 'תודה!' : 'Thank you!'}</title>
          <meta name="robots" content="noindex,nofollow" />
        </Helmet>
        <div className="w-full max-w-md text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-signal-red/10 mb-6 mx-auto">
            <Check size={28} className="text-signal-red" />
          </div>
          <h1 className="font-sans font-bold text-3xl text-white mb-3">
            {isHe ? 'תודה רבה!' : 'Thank you!'}
          </h1>
          <p className="font-sans text-white/50 leading-relaxed">
            {isHe
              ? 'ההמלצה שלך התקבלה. אני מעריך את זה מאוד.'
              : 'Your testimonial was received. I really appreciate it.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white" dir={isHe ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>{isHe ? 'ספרו על החוויה' : 'Share Your Experience'}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      {/* Header */}
      <div className="border-b border-white/10 px-6 md:px-12 py-5 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-signal-red mb-1">
            {isHe ? 'משוב · 10 ימים 10 סקילים' : 'Feedback · 10 Days 10 Skills'}
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

      <div className="max-w-2xl mx-auto px-6 md:px-12 py-12">
        <h1 className="font-sans font-bold text-3xl md:text-4xl tracking-tight mb-3">
          {isHe ? 'ספרו על החוויה שלכם' : 'Share your experience'}
        </h1>
        <p className="font-sans text-white/50 leading-relaxed mb-10 max-w-lg">
          {isHe
            ? 'בחרו תבנית והתאימו אישית, או כתבו משהו משלכם. תודה על הזמן.'
            : 'Pick a template and customize it, or write your own. Thanks for taking the time.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Templates */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">
              {isHe ? 'תבניות מהירות' : 'Quick templates'}
            </p>
            <div className="space-y-2">
              {TEMPLATES[lang].map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePickTemplate(t)}
                  className="w-full text-start bg-white/[0.03] border border-white/10 hover:border-signal-red/40 hover:bg-white/[0.06] rounded-xl p-4 transition-colors"
                >
                  <p className="font-sans text-sm text-white/70 leading-relaxed">{t}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Testimonial textarea */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">
              {isHe ? 'ההמלצה שלך *' : 'Your testimonial *'}
            </label>
            <textarea
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              required
              minLength={10}
              rows={5}
              dir={isHe ? 'rtl' : 'ltr'}
              placeholder={isHe ? 'בחרו תבנית למעלה או כתבו משהו משלכם...' : 'Pick a template above or write your own...'}
              className="w-full bg-white/[0.03] border border-white/10 focus:border-signal-red rounded-xl p-4 font-sans text-white outline-none transition-colors placeholder:text-white/20 resize-none"
            />
            <p className="mt-2 font-mono text-[10px] text-white/30">
              {testimonial.length} {isHe ? 'תווים' : 'chars'}
            </p>
          </div>

          {/* Improvement (optional, private) */}
          <div className="border border-white/10 bg-white/[0.02] rounded-xl p-5">
            <label className="block font-mono text-[10px] uppercase tracking-widest text-amber-400/70 mb-2">
              {isHe ? 'מה אפשר לשפר? (לא חובה · פרטי)' : 'What could be improved? (optional · private)'}
            </label>
            <p className="font-sans text-xs text-white/40 mb-3 leading-relaxed">
              {isHe
                ? 'משוב פרטי בשבילי. לא יוצג לאף אחד ולא ישמש להמלצה.'
                : 'Private feedback for me only. Never shown to anyone, never used as a testimonial.'}
            </p>
            <textarea
              value={improvement}
              onChange={(e) => setImprovement(e.target.value)}
              rows={3}
              dir={isHe ? 'rtl' : 'ltr'}
              placeholder={isHe ? 'מה היה יכול להיות טוב יותר? משהו חסר?' : 'Anything that could have been better? Anything missing?'}
              className="w-full bg-transparent border border-white/10 focus:border-amber-400/40 rounded-lg p-3 font-sans text-white text-sm outline-none transition-colors placeholder:text-white/20 resize-none"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">
              {isHe ? 'דירוג (לא חובה)' : 'Rating (optional)'}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n === rating ? 0 : n)}
                  className={`p-2 rounded-lg transition-colors ${
                    n <= rating ? 'text-signal-red' : 'text-white/20 hover:text-white/40'
                  }`}
                >
                  <Star size={28} fill={n <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          {/* Name + Role + Company grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
                {isHe ? 'שם' : 'Name'} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent border-b border-white/20 focus:border-signal-red py-3 font-sans text-white outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
                {isHe ? 'תפקיד (לא חובה)' : 'Role (optional)'}
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 focus:border-signal-red py-3 font-sans text-white outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
                {isHe ? 'חברה (לא חובה)' : 'Company (optional)'}
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 focus:border-signal-red py-3 font-sans text-white outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
                LinkedIn (optional)
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                dir="ltr"
                className="w-full bg-transparent border-b border-white/20 focus:border-signal-red py-3 font-sans text-white outline-none transition-colors placeholder:text-white/20"
              />
            </div>
          </div>

          {error && (
            <p className="font-sans text-sm text-signal-red">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || testimonial.trim().length < 10}
            className="w-full md:w-auto px-8 bg-signal-red text-white py-3 rounded-full font-sans font-bold text-sm transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
          >
            {submitting
              ? (isHe ? 'שולח...' : 'Sending...')
              : (isHe ? 'שליחת המלצה' : 'Submit testimonial')}
          </button>
        </form>
      </div>
    </div>
  );
}
