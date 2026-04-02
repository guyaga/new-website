import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { checkMemberEmail } from '../../utils/course';
import { useLanguage, createT } from '../../i18n';

export default function EmailGate({ onVerified }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { lang } = useLanguage();
  const t = createT(lang);
  const isHe = lang === 'he';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const member = await checkMemberEmail(email);

    if (member) {
      localStorage.setItem('course_member_email', member.email);
      localStorage.setItem('course_member_name', member.name);
      onVerified(member);
    } else {
      setError(isHe
        ? 'האימייל לא נמצא. צריכים להירשם לקורס?'
        : 'Email not found. Need to enroll?'
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6" dir={isHe ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        {/* Gate card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-signal-red/10 mb-6 mx-auto">
            <Lock size={24} className="text-signal-red" />
          </div>

          <h1 className="font-sans font-bold text-2xl text-white text-center mb-2">
            {isHe ? 'כניסה לקורס' : 'Access Course'}
          </h1>
          <p className="font-sans text-sm text-white/40 text-center mb-8">
            {isHe
              ? 'הזינו את האימייל שנרשמתם איתו לקורס'
              : 'Enter the email you enrolled with'
            }
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
                {isHe ? 'אימייל' : 'Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full bg-transparent border-b border-white/20 focus:border-signal-red py-3 font-sans text-white outline-none transition-colors placeholder:text-white/20"
                dir="ltr"
              />
            </div>

            {error && (
              <div className="text-center">
                <p className="font-sans text-sm text-signal-red mb-2">{error}</p>
                <a
                  href="https://my.schooler.biz/s/112677/Claudecodeskills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-signal-red hover:underline"
                >
                  {isHe ? 'הרשמה לקורס ←' : 'Enroll Now →'}
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-signal-red text-white py-3 rounded-full font-sans font-bold text-sm transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading
                ? (isHe ? 'בודק...' : 'Checking...')
                : (isHe ? 'כניסה לקורס' : 'Access Course')
              }
            </button>
          </form>
        </div>

        {/* Bottom links */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Link
            to="/course/10-days-10-skills"
            className="font-mono text-[10px] text-white/20 hover:text-white/40 transition-colors uppercase tracking-widest"
          >
            {isHe ? 'דף הקורס' : 'Course Page'}
          </Link>
          <span className="text-white/10">·</span>
          <Link
            to="/"
            className="font-mono text-[10px] text-white/20 hover:text-white/40 transition-colors uppercase tracking-widest"
          >
            bestguy.ai
          </Link>
        </div>
      </div>
    </div>
  );
}
