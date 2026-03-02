import Hero from '../components/Hero';
import ClientLogos from '../components/ClientLogos';
import Features from '../components/Features';
import Philosophy from '../components/Philosophy';
import Testimonials from '../components/Testimonials';
import BlogPreview from '../components/BlogPreview';
import Protocol from '../components/Protocol';
import ContactForm from '../components/ContactForm';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ClientLogos />
      <Features />
      <Philosophy />
      <Testimonials />
      <BlogPreview />
      <Protocol />
      <ContactForm />
    </>
  );
}
