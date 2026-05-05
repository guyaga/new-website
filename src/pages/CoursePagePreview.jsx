import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../i18n';
import FloatingNav from '../components/course/landing/FloatingNav';
import Hero from '../components/course/landing/Hero';
import Demo from '../components/course/landing/Demo';
import Who from '../components/course/landing/Who';
import SkillsGallery from '../components/course/landing/SkillsGallery';
import WhatYouGet from '../components/course/landing/WhatYouGet';
import About from '../components/course/landing/About';
import Community from '../components/course/landing/Community';
import Testimonials from '../components/course/landing/Testimonials';
import Pricing from '../components/course/landing/Pricing';
import FAQ from '../components/course/landing/FAQ';
import FinalCTA from '../components/course/landing/FinalCTA';
import LandingFooter from '../components/course/landing/LandingFooter';

export default function CoursePagePreview() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';

  return (
    <>
      <Helmet>
        <title>
          {isHe
            ? '10 ימים, 10 סקילים — קורס Claude Code של גיא אגא'
            : '10 Days, 10 Skills — Claude Code Course by Guy Aga'}
        </title>
        <meta
          name="description"
          content={
            isHe
              ? 'ללמוד לעבוד עם Claude Code. סקיל ביום, 20 דקות בשיעור. בונים דברים אמיתיים — לא טוטוריאלים.'
              : 'Master Claude Code — one skill per day, 20 minutes per lesson. Build real things, not tutorials.'
          }
        />
      </Helmet>

      <main dir={isHe ? 'rtl' : 'ltr'} style={{ background: 'var(--off-white)' }}>
        <FloatingNav isHe={isHe} />
        <Hero isHe={isHe} />
        <Demo isHe={isHe} />
        <Who isHe={isHe} />
        <SkillsGallery isHe={isHe} />
        <WhatYouGet isHe={isHe} />
        <About isHe={isHe} />
        <Community isHe={isHe} />
        <Testimonials isHe={isHe} />
        <Pricing isHe={isHe} />
        <FAQ isHe={isHe} />
        <FinalCTA isHe={isHe} />
        <LandingFooter isHe={isHe} />
      </main>
    </>
  );
}
