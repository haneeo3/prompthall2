import React from 'react';
import {
  Navbar, Hero, WhatWeMonitor, HowItWorks, WeeklyReport,
  About, Team, FAQ, FinalCTA, Footer,
} from '../../components/intel/IntelSections';
import './IntelHome.css';

// Supply the booking link and team inbox from the parent application.
export default function IntelHome({ tryFreeHref = 'https://calendly.com/prompthall/30min', demoEmail = 'hello@prompthall.space' }) {
  return <div className="intel-site">
    <a className="intel-skip" href="#intel-main">Skip to content</a>
    <Navbar tryFreeHref={tryFreeHref} demoEmail={demoEmail} />
    <main id="intel-main">
      <Hero tryFreeHref={tryFreeHref} />
      <WhatWeMonitor />
      <HowItWorks />
      <WeeklyReport />
      <About />
      <Team />
      <FAQ />
      <FinalCTA tryFreeHref={tryFreeHref} demoEmail={demoEmail} />
    </main>
    <Footer demoEmail={demoEmail} />
  </div>;
}
