import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { LogOut } from 'lucide-react';
import { useLanguage, createT } from '../i18n';
import { getSessions, checkMemberEmail } from '../utils/course';
import EmailGate from '../components/course/EmailGate';
import HubLessons from '../components/course/HubLessons';
import HubResources from '../components/course/HubResources';
import HubAbout from '../components/course/HubAbout';

const TABS = ['lessons', 'resources', 'about'];

export default function CourseHub() {
  const [member, setMember] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [activeTab, setActiveTab] = useState('lessons');
  const { lang, toggleLang } = useLanguage();
  const t = createT(lang);
  const isHe = lang === 'he';

  const tabLabels = {
    lessons: isHe ? 'שיעורים' : 'Lessons',
    resources: isHe ? 'משאבים' : 'Resources',
    about: isHe ? 'אודות' : 'About',
  };

  // Check saved email on mount
  useEffect(() => {
    async function verify() {
      const savedEmail = localStorage.getItem('course_member_email');
      if (savedEmail) {
        const m = await checkMemberEmail(savedEmail);
        if (m) {
          setMember(m);
        } else {
          localStorage.removeItem('course_member_email');
          localStorage.removeItem('course_member_name');
        }
      }
      setVerifying(false);
    }
    verify();
  }, []);

  // Fetch sessions when verified
  useEffect(() => {
    if (!member) return;
    getSessions().then((data) => {
      setSessions(data);
      setLoading(false);
    });
  }, [member]);

  const handleVerified = useCallback((m) => {
    setMember(m);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('course_member_email');
    localStorage.removeItem('course_member_name');
    setMember(null);
  };

  // Show loading while checking localStorage
  if (verifying) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-signal-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show email gate if not verified
  if (!member) {
    return (
      <>
        <Helmet>
          <title>{isHe ? 'כניסה לקורס | 10 ימים 10 סקילים' : 'Course Login | 10 Days 10 Skills'}</title>
        </Helmet>
        <EmailGate onVerified={handleVerified} />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isHe ? 'מרכז הקורס | 10 ימים 10 סקילים' : 'Course Hub | 10 Days 10 Skills'}</title>
      </Helmet>

      <div className="min-h-screen bg-black text-white" dir={isHe ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="border-b border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] text-signal-red uppercase tracking-widest">
                10 {isHe ? 'ימים' : 'Days'} 10 {isHe ? 'סקילים' : 'Skills'}
              </p>
              <h1 className="font-sans font-bold text-lg tracking-tight">
                {isHe ? 'מרכז הקורס' : 'Course Hub'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleLang}
                className="font-mono text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 hover:bg-signal-red hover:text-white hover:border-signal-red transition-all duration-200"
              >
                {lang === 'en' ? 'עב' : 'EN'}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="border-b border-white/10">
          <div className="max-w-4xl mx-auto px-6 flex gap-1 pt-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-mono text-xs uppercase tracking-wider px-5 py-3 transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-signal-red text-signal-red'
                    : 'border-transparent text-white/30 hover:text-white/60'
                }`}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-6 py-8">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse h-20" />
              ))}
            </div>
          ) : (
            <>
              {activeTab === 'lessons' && (
                <HubLessons sessions={sessions} memberName={member.name} />
              )}
              {activeTab === 'resources' && (
                <HubResources sessions={sessions} />
              )}
              {activeTab === 'about' && (
                <HubAbout />
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
