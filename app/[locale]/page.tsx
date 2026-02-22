'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import LogoMarquee from '@/components/LogoMarquee/LogoMarquee';
import USBusinessSection from '@/components/USBusinessSection/USBusinessSection';
import ServicesOverview from '@/components/Services/ServicesOverview';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import Pricing from '@/components/Pricing/Pricing';
import ResultsBanner from '@/components/ResultsBanner/ResultsBanner';
import Testimonials from '@/components/Testimonials/Testimonials';
import CTABanner from '@/components/CTABanner/CTABanner';
import FAQ from '@/components/FAQ/FAQ';
import Portfolio from '@/components/Portfolio/Portfolio';
import OurTeam from '@/components/OurTeam/OurTeam';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function Home() {
  return (
    <main className="homeMain">
      <Header />
      <Hero />
      <LogoMarquee />
      <AnimatedSection>
        <USBusinessSection />
      </AnimatedSection>
      <AnimatedSection>
        <ServicesOverview />
      </AnimatedSection>
      <AnimatedSection>
        <HowItWorks />
      </AnimatedSection>
      <AnimatedSection>
        <Pricing />
      </AnimatedSection>
      <ResultsBanner />
      <AnimatedSection>
        <Testimonials />
      </AnimatedSection>
      <CTABanner />
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
