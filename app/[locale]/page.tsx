'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import USBusinessSection from '@/components/USBusinessSection/USBusinessSection';
import ServicesOverview from '@/components/Services/ServicesOverview';
import Pricing from '@/components/Pricing/Pricing';
import Testimonials from '@/components/Testimonials/Testimonials';
import FAQ from '@/components/FAQ/FAQ';
import Portfolio from '@/components/Portfolio/Portfolio';
import OurTeam from '@/components/OurTeam/OurTeam';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <AnimatedSection>
        <USBusinessSection />
      </AnimatedSection>
      <AnimatedSection>
        <ServicesOverview />
      </AnimatedSection>
      <AnimatedSection>
        <Pricing />
      </AnimatedSection>
      <AnimatedSection>
        <Testimonials />
      </AnimatedSection>
      <AnimatedSection>
        <FAQ />
      </AnimatedSection>
      <AnimatedSection>
        <Portfolio />
      </AnimatedSection>
      <AnimatedSection>
        <OurTeam />
      </AnimatedSection>
      <AnimatedSection>
        <Contact />
      </AnimatedSection>
      <Footer />
    </main>
  );
}

