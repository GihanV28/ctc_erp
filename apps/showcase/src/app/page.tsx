import React from 'react';
import { Hero } from '../components/sections/Hero';
import { About } from '../components/sections/About';
import { Services } from '../components/sections/Services';
import { Features } from '../components/sections/Features';
import { HowItWorks } from '../components/sections/HowItWorks';
import { Stats } from '../components/sections/Stats';
import { Containers } from '../components/sections/Containers';
import { Testimonials } from '../components/sections/Testimonials';
import { CTA } from '../components/sections/CTA';
import { Contact } from '../components/sections/Contact';
import { FAQ } from '../components/sections/FAQ';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Features />
      <HowItWorks />
      <Stats />
      <Containers />
      <Testimonials />
      <CTA />
      <Contact />
      <FAQ />
    </>
  );
}
