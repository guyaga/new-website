import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage, createT } from '../i18n';
import { getSessions } from '../utils/course';
import CourseHero from '../components/course/CourseHero';
import CourseOverview from '../components/course/CourseOverview';
import SkillsGrid from '../components/course/SkillsGrid';
import WhatYoullLearn from '../components/course/WhatYoullLearn';
import InstructorBio from '../components/course/InstructorBio';
import Pricing from '../components/course/Pricing';
import CourseFAQ from '../components/course/CourseFAQ';

const LMS_URL = 'https://my.schooler.biz/s/112677/Claudecodeskills';

export default function CoursePage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  const t = createT(lang);

  useEffect(() => {
    getSessions().then((data) => {
      setSessions(data);
      setLoading(false);
    });
  }, []);

  // Skeleton sessions for initial render
  const displaySessions = loading
    ? Array.from({ length: 10 }, (_, i) => ({
        id: i,
        day: i + 1,
        name_en: '',
        name_he: '',
        desc_en: '',
        desc_he: '',
        service: '',
        is_unlocked: false,
        github_url: '',
        pdf_url: '',
        video_url: '',
      }))
    : sessions;

  return (
    <>
      <Helmet>
        <title>{t('course.meta.title')}</title>
        <meta name="description" content={t('course.meta.desc')} />
        <meta property="og:title" content={t('course.meta.title')} />
        <meta property="og:description" content={t('course.meta.desc')} />
        <meta property="og:image" content="/course/og-image.jpg" />
      </Helmet>

      <main>
        <CourseHero />
        <CourseOverview />
        <SkillsGrid sessions={displaySessions} />
        <WhatYoullLearn />
        <InstructorBio />
        <Pricing lmsUrl={LMS_URL} />
        <CourseFAQ />
      </main>
    </>
  );
}
