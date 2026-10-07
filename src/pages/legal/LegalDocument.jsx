import { Link } from 'react-router-dom';
import { Footer } from '../../components/intel/IntelSections';
import { privacyDocument, termsDocument } from './documents';
import '../intel/IntelHome.css';
import './LegalDocument.css';

function Blocks({ blocks }) {
  const grouped = [];
  for (const block of blocks) {
    if (block.type === 'list') {
      const last = grouped[grouped.length - 1];
      if (last?.type === 'list') last.items.push(block.text);
      else grouped.push({ type: 'list', items: [block.text] });
    } else grouped.push(block);
  }
  return grouped.map((block, index) => {
    if (block.type === 'list') return <ul key={index}>{block.items.map((item, i) => <li key={i}>{item}</li>)}</ul>;
    if (block.type === 'table') return <div className="monitor-legal-table" key={index} tabIndex={0} role="region" aria-label="Agreement details table">
      <table>
        {block.header && <thead><tr>{block.rows[0].map((cell, i) => <th key={i} scope="col">{cell}</th>)}</tr></thead>}
        <tbody>{(block.header ? block.rows.slice(1) : block.rows).map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell || <span className="monitor-legal-pending">To be completed</span>}</td>)}</tr>)}</tbody>
      </table>
    </div>;
    return <p key={index}>{block.text}</p>;
  });
}

export default function LegalDocument({ kind }) {
  const privacy = kind === 'privacy';
  const document = privacy ? privacyDocument : termsDocument;
  const title = privacy ? 'Privacy Policy' : 'Terms of Service';
  return <div className="intel-site" id="top">
    <a className="intel-skip" href="#legal-main">Skip to content</a>
    <header className="monitor-legal-header">
      <div className="intel-container">
        <Link to="/" aria-label="PromptHall home"><img src="/images/prompthall-logo-transparent.png" alt="PromptHall" width="180" height="60" /></Link>
        <Link to="/">Back to home</Link>
      </div>
    </header>
    <main className="monitor-legal" id="legal-main">
      <p className="intel-eyebrow">PromptHall.space | Version 1.0</p>
      <h1>{title}</h1>
      <p className="monitor-legal-meta">{privacy ? 'Effective date: pending confirmation' : 'Website Monitoring Service Agreement | Issued September 2026'}</p>
      <aside className="monitor-legal-notice" aria-label="Draft status">
        <strong>Draft for legal review. Not final.</strong>
        <p>Business details and outstanding fields must be completed, and a qualified Nigerian legal professional must review this document before it is finalised.</p>
        {!privacy && <p>This is a service agreement template, not an agreement accepted by browsing this page. The agreement takes effect when both parties sign it, including the completed Schedule A.</p>}
      </aside>
      <div className="monitor-legal-introduction"><Blocks blocks={document.introduction} /></div>
      <nav className="monitor-legal-contents" aria-label="Document contents">
        <h2>Contents</h2>
        {document.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
      </nav>
      {document.sections.map((section) => <section className="monitor-legal-section" id={section.id} key={section.id}>
        <h2>{section.title}</h2>
        <Blocks blocks={section.blocks} />
      </section>)}
      <div className="monitor-legal-contact">
        <p>For general enquiries, contact <a href="mailto:hello@prompthall.space">hello@prompthall.space</a>. The designated privacy contact and registered business details are pending confirmation.</p>
        <Link to={privacy ? '/terms' : '/privacy'}>{privacy ? 'Read the Terms of Service' : 'Read the Privacy Policy'}</Link>
      </div>
    </main>
    <Footer demoEmail="hello@prompthall.space" homeHref="/" />
  </div>;
}
