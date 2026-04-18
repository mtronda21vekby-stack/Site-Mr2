import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileStickyCall from '@/components/layout/MobileStickyCall';
import Hero from '@/components/hero/Hero';
import ServicesGrid from '@/components/sections/ServicesGrid';
import WhyChoose from '@/components/sections/WhyChoose';
import EmergencyStrip from '@/components/sections/EmergencyStrip';
import ServiceAreas from '@/components/sections/ServiceAreas';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';
import { services, whyChoose, faq } from '@/lib/site-data';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ServicesGrid services={services} />
        <WhyChoose items={whyChoose} />
        <EmergencyStrip />
        <ServiceAreas />
        <ReviewsSection />
        <FAQSection items={faq} />
        <ContactSection />
      </main>
      <Footer />
      <MobileStickyCall />
    </>
  );
}
