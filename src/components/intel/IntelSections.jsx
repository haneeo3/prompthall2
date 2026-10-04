import React, { useState } from 'react';
import { steps, team, faqs } from './content';

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const shapes = {
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="M5 5 19 19M19 5 5 19" />,
    check: <path d="m5 12 4 4L19 6" />,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18" /></>,
    pages: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    speed: <><path d="M4 17a9 9 0 1 1 16 0M12 13l4-5" /><circle cx="12" cy="17" r="1" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    message: <><path d="M4 5h16v12H8l-4 3V5Z" /><path d="M8 9h8M8 13h5" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18" /></>,
    bag: <><path d="M4 8h16l-1 13H5L4 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    school: <><path d="m3 10 9-6 9 6v11H3V10Z" /><path d="M3 11h18M9 21v-6h6v6" /></>,
    health: <><path d="M12 21S3 16 3 9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7-9 12-9 12Z" /><path d="M7 12h3l1-2 2 4 1-2h3" /></>,
    building: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h2m4 0h2M8 11h2m4 0h2M9 21v-5h6v5" /></>,
    home: <><path d="m3 11 9-8 9 8v10H3V11Z" /><path d="M9 21v-7h6v7" /></>,
    shield: <><path d="m12 2 8 4v6c0 5-3 8-8 10-5-2-8-5-8-10V6l8-4Z" /><path d="m8 12 3 3 5-6" /></>,
    bell: <><path d="M6 17h12l-2-3V9a4 4 0 0 0-8 0v5l-2 3ZM10 20h4" /></>,
  };
  return <svg {...common}>{shapes[name] || shapes.check}</svg>;
}

function Brand() {
  return <a className="intel-brand" href="#top" aria-label="PromptHall Intel, back to top">
    <span className="intel-brand-mark" aria-hidden="true">
      <span />
    </span>
    <span>PromptHall <strong>Intel</strong>
    </span>
  </a>;
}

function SectionHeading({ eyebrow, title, description, centered = false }) {
  return <div className={'intel-heading' + (centered ? ' intel-heading--center' : '')}>
    {eyebrow && <p className="intel-eyebrow">{eyebrow}</p>}
    <h2>{title}</h2>
    {description && <p className="intel-section-desc">{description}</p>}
  </div>;
}

function Actions({ tryFreeHref, demoEmail, primary = 'Get Started', secondary = 'Talk to Us' }) {
  return <div className="intel-actions">
    <a className="intel-button intel-button--primary" href={tryFreeHref}>{primary}<Icon name="arrow" size={17} /></a>
    <a className="intel-button intel-button--outline" href={'mailto:' + demoEmail + '?subject=PromptHall%20Intel%20enquiry'}>{secondary}</a>
  </div>;
}

export function Navbar({ tryFreeHref, demoEmail }) {
  const [open, setOpen] = useState(false);
  const links = [['What We Do', '#what-we-monitor'], ['How It Works', '#how-it-works'], ['Reports', '#reports'], ['Team', '#team'], ['FAQ', '#faq']];
  return <header className="intel-header">
    <div className="intel-container intel-nav">
      <Brand />
      <nav className={'intel-nav-links' + (open ? ' is-open' : '')} id="intel-mobile-menu" aria-label="Main navigation">
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <div className="intel-nav-mobile-actions"><a href={'mailto:' + demoEmail} onClick={() => setOpen(false)}>Talk to Us</a><a href={tryFreeHref} onClick={() => setOpen(false)}>Get Started <Icon name="arrow" size={16} /></a></div>
      </nav>

      <div className="intel-nav-actions">
        <a className="intel-link-button" href={'mailto:' + demoEmail}>Talk to Us</a>
        <a className="intel-button intel-button--primary intel-button--small" href={tryFreeHref}>Get Started <Icon name="arrow" size={15} /></a>
      </div>
      <button className="intel-menu-toggle"
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-controls="intel-mobile-menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}>
        <Icon name={open ? 'close' : 'menu'} size={22} />
      </button>
    </div>
  </header>;
}

export function Hero({ tryFreeHref }) {
  return <section className="intel-hero" id="top">
    <div className="intel-container intel-hero-grid">
      <div className="intel-hero-copy">
        <p className="intel-eyebrow">Managed website monitoring</p>
        <h1>Your website is working for your business. <em>Who's watching it?</em></h1>
        <p className="intel-hero-lede">Intel watches the parts of your website customers rely on and tells you when something needs attention.</p>

        <div className="intel-actions">
          <a className="intel-button intel-button--primary" href={tryFreeHref}>Protect My Website <Icon name="arrow" size={17} /></a><a className="intel-button intel-button--outline" href="#how-it-works">See How It Works</a>
        </div>
        <p className="intel-fine-print">Built for businesses without an in-house technical team.</p>
      </div>
      <div className="intel-video-shell" aria-label="Space reserved for the PromptHall Intel video">
        <div className="intel-video-play" aria-hidden="true">▶</div>
        <span>See how Intel keeps watch</span>
        <small>Product video coming soon</small>
      </div>
    </div>
  </section>;
}

export function WhatWeMonitor() {
  return <section className="intel-section intel-monitor-section" id="what-we-monitor">
    <div className="intel-container">
      <SectionHeading eyebrow="What Intel does" title={<>Someone watching <span className="intel-accent">what matters.</span></>} description="Your website may be online while a page your customers need isn't working." />
      <div className="intel-monitor-grid">
        <article className="intel-monitor-card">
          <span className="intel-icon-box">
            <Icon name="globe" size={25} />
          </span>
          <h3>We watch</h3>
          <p>Your website and the important pages customers use to reach you.</p>
        </article>
        <article className="intel-monitor-card">
          <span className="intel-icon-box">
            <Icon name="bell" size={25} />
          </span>
          <h3>You know</h3>
          <p>When something breaks or slows down, you get a clear signal.</p>
        </article>
        <article className="intel-monitor-card">
          <span className="intel-icon-box">
            <Icon name="message" size={25} />
          </span>
          <h3>You can act</h3>
          <p>See what happened and the next step in a simple report.</p>
        </article>
      </div>
      <p className="intel-who-line" id="who-its-for">For businesses that depend on enquiries, bookings, applications, or sales through their website.</p>
    </div>
  </section>;
}

export function HowItWorks() {
  return <section className="intel-section intel-steps-section" id="how-it-works">
    <div className="intel-container">
      <SectionHeading eyebrow="How it works" title={<>Simple to start. <span className="intel-accent">Clear when it matters.</span></>} centered />
      <div className="intel-steps-grid">
        {steps.map((step, index) => <article className="intel-step" key={step.title}>
          <span className="intel-step-number">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </article>)}
      </div>
    </div>
  </section>;
}

export function WeeklyReport() {
  const [selectedReport, setSelectedReport] = useState(0);
  const reports = [
    { image: '/images/report-needs-attention.png', title: 'When a website needs attention', alt: 'Full screenshot of a PromptHall Monitor weekly email report showing a 44 out of 100 health score, 20 pages checked and a recommendation to improve loading speed' },
    { image: '/images/report-healthy.png', title: 'When a website is healthy', alt: 'Full screenshot of a PromptHall Monitor weekly email report showing a 100 out of 100 health score, one page checked and no major issues' },
  ];
  return <section className="intel-section intel-report-section" id="reports">
    <div className="intel-container">
      <SectionHeading eyebrow="Real report examples" title={<>See the result
        <span className="intel-accent">in your inbox.</span></>} description="A clear score, what we checked, and what needs attention." />

      <div className="intel-report-tabs" role="group" aria-label="Choose a report example">
        {reports.map((report, index) =>
          <button key={report.image}
            type="button"
            className={selectedReport === index ? 'is-active' : ''}
            aria-pressed={selectedReport === index}
            onClick={() => setSelectedReport(index)}>{report.title}
          </button>)}
      </div>
      <figure className="intel-report-example" key={reports[selectedReport].image}>
        <a href={reports[selectedReport].image} target="_blank" rel="noopener noreferrer" aria-label={'Open full-size screenshot: ' + reports[selectedReport].title}>
          <img src={reports[selectedReport].image} alt={reports[selectedReport].alt} width="1366" height="720" loading="lazy" />
        </a>
        <figcaption>Open the image to view the full-size report.</figcaption>
      </figure>
    </div>
  </section>;
}

export function Team() {
  return <section className="intel-section intel-team-section" id="team">
    <div className="intel-container">
      <SectionHeading eyebrow="The people behind Intel" title={<>Built by the <span className="intel-accent">PromptHall team.</span></>} />
      <p className="intel-team-intro" id="about">We're building Intel for businesses that rely on their website and want someone keeping watch.</p>

      <div className="intel-team-grid">{team.map((person) => <article className="intel-team-card" key={person.name}>
        <div className="intel-team-photo">
          <img src={person.image} alt={person.name} loading="lazy" />
        </div>

        <div className="intel-team-info">
          <h3>{person.name}</h3>
          <p className="intel-team-role">{person.role}</p>
          <p>{person.detail}</p>
        </div>
      </article>)}
      </div>
    </div>
  </section>;
}

export function FAQ() {
  const [showAll, setShowAll] = useState(false);
  const featured = [faqs[0], faqs[1], faqs[2], faqs[10], faqs[19]];
  return <section className="intel-section intel-faq-section" id="faq">
    <div className="intel-container intel-faq-grid">
      <div>
        <SectionHeading eyebrow="Frequently asked questions" title={<>A few quick <span className="intel-accent">answers.</span></>} />
      </div>

      <div>
        <div className="intel-faq-list">{(showAll ? faqs : featured).map(([question, answer]) => <details key={question}><summary>{question}<span className="intel-faq-toggle" aria-hidden="true">+</span></summary>
          <p>{answer}</p>
        </details>
        )}
        </div>

        <button className="intel-faq-more"
          type="button" aria-expanded={showAll}
          onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show fewer questions' : 'View all 20 questions'}
        </button>
      </div>
    </div>
  </section>;
}

export function FinalCTA({ tryFreeHref, demoEmail }) {
  return <section className="intel-section intel-cta-section">
    <div className="intel-container intel-cta-inner">
      <p className="intel-eyebrow">Stay ahead of the problem</p>
      <h2>Your customers shouldn't be the first people to discover a website problem.</h2>
      <p>Let PromptHall Intel keep watch.</p>

      <Actions tryFreeHref={tryFreeHref} demoEmail={demoEmail} />
      <small>Currently onboarding a limited number of businesses.</small>
    </div>
  </section>;
}

export function Footer({ demoEmail }) {
  return <footer className="intel-footer">
    <div className="intel-container">
      <div className="intel-footer-grid">
        <div className="intel-footer-brand">
          <Brand />
          <p>Managed website monitoring for businesses that depend on their websites.</p>
        </div>

        <div>
          <h3>Product</h3>
          <a href="#what-we-monitor">What We Do</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#reports">Reports</a>
          <a href="#faq">FAQs</a>
        </div>

        <div>
          <h3>Company</h3>
          <a href="#about">About</a>
          <a href="#team">Team</a>
          <a href={'mailto:' + demoEmail}>Contact</a>
        </div>

        <div>
          <h3>Legal</h3>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>

      <div className="intel-footer-bottom">
        <span>© {new Date().getFullYear()} PromptHall Intel</span>
        <span>Built to keep watch.</span>
      </div>
    </div>
  </footer>;
}
