'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import USBusinessSection from '@/components/USBusinessSection/USBusinessSection';
import ServicesOverview from '@/components/Services/ServicesOverview';
import Pricing from '@/components/Pricing/Pricing';
import FAQ from '@/components/FAQ/FAQ';
import Portfolio from '@/components/Portfolio/Portfolio';
import OurTeam from '@/components/OurTeam/OurTeam';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import FAB from '@/components/FAB/FAB';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <USBusinessSection />
      <ServicesOverview />
      <Pricing />
      <FAQ
        title={
          <>
            Preguntas <strong>Frecuentes</strong>
          </>
        }
      />
      <Portfolio />
      <OurTeam />
      <Contact />
      <Footer />
      <FAB />
    </main>
  );
}


