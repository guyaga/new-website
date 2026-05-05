import { Helmet } from 'react-helmet-async';
import VideoHero from '../components/thoughts/VideoHero';
import ThoughtsParagraph from '../components/thoughts/ThoughtsParagraph';
import ContactForm from '../components/ContactForm';
import { useLanguage, createT } from '../i18n';

export default function ThoughtsPage() {
  const { lang } = useLanguage();
  const t = createT(lang);

  return (
    <>
      <Helmet>
        <title>{t('thoughts.pageTitle')}</title>
        <meta name="description" content={t('thoughts.metaDesc')} />
      </Helmet>
      <VideoHero />
      <ThoughtsParagraph />
      <ContactForm />
    </>
  );
}
