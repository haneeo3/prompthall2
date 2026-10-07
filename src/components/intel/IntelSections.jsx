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

function Brand({ footer = false }) {
  return <a className="intel-brand" href="#top" aria-label="PromptHall, back to top">
    <img className="intel-brand-logo" src={footer ? '/images/prompthall-logo-footer.png' : '/images/prompthall-logo-transparent.png'} alt="PromptHall" width="900" height="300" />
  </a>;
}

function SectionHeading({ eyebrow, title, description, centered = false }) {
  return <div className={'intel-heading' + (centered ? ' intel-heading--center' : '')}>
    {eyebrow && <p className="intel-eyebrow">{eyebrow}</p>}
    <h2>{title}</h2>
    {description && <p className="intel-section-desc">{description}</p>}
  </div>;
}

function Actions({ tryFreeHref, demoEmail, primary = 'Start Your Free Trial', secondary = 'Talk to the Team' }) {
  return <div className="intel-actions">
    <a className="intel-button intel-button--primary" href={tryFreeHref}>{primary}<Icon name="arrow" size={17} /></a>
    <a className="intel-button intel-button--outline" href={'mailto:' + demoEmail + '?subject=PromptHall%20website%20monitoring%20enquiry'}>{secondary}</a>
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
        <div className="intel-nav-mobile-actions"><a href={'mailto:' + demoEmail} onClick={() => setOpen(false)}>Talk to the Team</a><a href={tryFreeHref} onClick={() => setOpen(false)}>Start Your Free Trial <Icon name="arrow" size={16} /></a></div>
      </nav>

      <div className="intel-nav-actions">
        <a className="intel-link-button" href={'mailto:' + demoEmail}>Talk to the Team</a>
        <a className="intel-button intel-button--primary intel-button--small" href={tryFreeHref}>Start Your Free Trial <Icon name="arrow" size={15} /></a>
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
        <p className="intel-eyebrow">For businesses that depend on online enquiries</p>
        <h1>Do You Want a Website <em>Your Customers Can Rely On?</em></h1>
        <p className="intel-hero-lede">Work with the PromptHall team to spot broken pages, slow loading times, and website issues that get in the way of enquiries, bookings, and sales. Know what to fix first, without figuring out the technical details yourself.</p>

        <div className="intel-actions">
          <a className="intel-button intel-button--primary" href={tryFreeHref}>Start Your Free Trial <Icon name="arrow" size={17} /></a><a className="intel-button intel-button--outline" href="#how-it-works">See How It Works</a>
        </div>
        <p className="intel-fine-print">Run your business. Let us keep an eye on your website.</p>
      </div>
      <div className="intel-video-shell" aria-label="Space reserved for the PromptHall website monitoring video">
        <div className="intel-video-play" aria-hidden="true">▶</div>
        <span>See how we spot website problems</span>
        <small>Walkthrough coming soon</small>
      </div>
    </div>
  </section>;
}

export function WhatWeMonitor() {
  return <section className="intel-section intel-monitor-section" id="what-we-monitor">
    <div className="intel-container">
      <SectionHeading eyebrow="The problems that cost you customers" title={<>A live website isn't always <span className="intel-accent">a working website.</span></>} description="Your homepage loads. But the page they need won't open. They leave without calling, booking, or buying. You never hear why." />
      <div className="intel-monitor-grid">
        <article className="intel-monitor-card">
          <span className="intel-icon-box">
            <Icon name="globe" size={25} />
          </span>
          <h3>Find the broken pages</h3>
          <p>A working homepage can hide a broken contact, booking, or product page. We check beyond the front door.</p>
        </article>
        <article className="intel-monitor-card">
          <span className="intel-icon-box">
            <Icon name="bell" size={25} />
          </span>
          <h3>Spot the slowdowns</h3>
          <p>Customers won't wait around for a slow page. See where loading speed needs attention before you send more traffic there.</p>
        </article>
        <article className="intel-monitor-card">
          <span className="intel-icon-box">
            <Icon name="message" size={25} />
          </span>
          <h3>Know what to fix first</h3>
          <p>No wall of technical data. Get a clear report you can use yourself or hand to your developer.</p>
        </article>
      </div>
      <p className="intel-who-line" id="who-its-for">For service businesses, shops, schools, and clinics where a missed enquiry, booking, or sale matters.</p>
    </div>
  </section>;
}

export function HowItWorks() {
  return <section className="intel-section intel-steps-section" id="how-it-works">
    <div className="intel-container">
      <SectionHeading eyebrow="How it works" title={<>You run the business. <span className="intel-accent">We watch the website.</span></>} centered />
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
    { image: '/images/report-issue-detected.png', title: 'When a website needs attention', alt: 'PromptHall issue alert email showing a homepage server error, HTTP 503, its impact on visitors, and recommended next steps for the developer', width: 1366, height: 768 },
    { image: '/images/report-healthy.png', title: 'When a website is healthy', alt: 'Full screenshot of a PromptHall Monitor weekly email report showing a 100 out of 100 health score, one page checked and no major issues', width: 1366, height: 720 },
  ];
  return <section className="intel-section intel-report-section" id="reports">
    <div className="intel-container">
      <SectionHeading eyebrow="See exactly what you get" title={<>No guesswork.
        <span className="intel-accent">Just your next move.</span></>} description="See what was checked, where your website is falling short, and what to prioritise. These are actual report examples, not a list of promises." />

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
          <img src={reports[selectedReport].image} alt={reports[selectedReport].alt} width={reports[selectedReport].width} height={reports[selectedReport].height} loading="lazy" />
        </a>
        <figcaption>Open the image to view the full-size report.</figcaption>
      </figure>
    </div>
  </section>;
}

export function About() {
  return <section className="intel-section intel-about-section" id="about" aria-labelledby="about-heading">
    <div className="intel-container">
      <div className="intel-heading">
        <p className="intel-eyebrow">About PromptHall</p>
        <h2 id="about-heading">Website monitoring. <span className="intel-accent">Without the technical burden.</span></h2>
      </div>
      <p>PromptHall provides managed website monitoring for small businesses that rely on online enquiries, bookings, and sales, without an in-house technical team to keep watch.</p>
      <p>We check your public website from the outside, explain detected problems in plain language, and recommend the next step. Your developer or hosting provider handles the fix. We check again to see whether the issue has cleared. No dashboard to manage or software to install.</p>
    </div>
  </section>;
}

export function Team() {
  return <section className="intel-section intel-team-section" id="team">
    <div className="intel-container">
      <SectionHeading eyebrow="The people behind the work" title={<>Real people. <span className="intel-accent">Not another dashboard.</span></>} />
      <p className="intel-team-intro">You shouldn't need to become a developer to know whether your website is doing its job. Our team brings product, engineering, and business expertise to make the next step clear.</p>

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
  return <section className="intel-section intel-faq-section" id="faq">
    <div className="intel-container intel-faq-grid">
      <div>
        <SectionHeading eyebrow="Frequently asked questions" title={<>A few quick <span className="intel-accent">answers.</span></>} />
      </div>

      <div>
        <div className="intel-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span className="intel-faq-toggle" aria-hidden="true">+</span></summary>
          <p>{answer}</p>
        </details>
        )}
        </div>

      </div>
    </div>
  </section>;
}

export function FinalCTA({ tryFreeHref, demoEmail }) {
  return <section className="intel-section intel-cta-section">
    <div className="intel-container intel-cta-inner">
      <p className="intel-eyebrow">Stop leaving it to chance</p>
      <h2>Your next customer is on their way. Is your website ready?</h2>
      <p>Know which pages need attention before you spend more sending people to them.</p>

      <Actions tryFreeHref={tryFreeHref} demoEmail={demoEmail} />
      <small>Start with your website. Get clarity on what needs attention.</small>
    </div>
  </section>;
}

export function Footer({ demoEmail, homeHref = '' }) {
  return <footer className="intel-footer">
    <div className="intel-container">
      <div className="intel-footer-grid">
        <div className="intel-footer-brand">
          <Brand footer />
          <p>You bring customers to your website. We help you spot the problems that send them away.</p>
        </div>

        <div>
          <h3>Product</h3>
          <a href={homeHref + "#what-we-monitor"}>What We Do</a>
          <a href={homeHref + "#how-it-works"}>How It Works</a>
          <a href={homeHref + "#reports"}>Reports</a>
          <a href={homeHref + "#faq"}>FAQs</a>
        </div>

        <div>
          <h3>Company</h3>
          <a href={homeHref + "#about"}>About</a>
          <a href={homeHref + "#team"}>Team</a>
          <a href={'mailto:' + demoEmail}>Contact</a>
          <a href="https://www.tiktok.com/@prompthall?lang=en-GB" target="_blank" rel="noopener noreferrer">TikTok</a>
          <a href="https://www.linkedin.com/company/prompthall/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>

        <div>
          <h3>Legal</h3>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>

      <div className="intel-footer-bottom">
        <span>© {new Date().getFullYear()} PromptHall</span>
        <span>Less guesswork. Clear next steps.</span>
      </div>
    </div>
  </footer>;
}
