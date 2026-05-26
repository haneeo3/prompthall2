import './LegalPage.css'

const LAST_UPDATED = 'May 17, 2025'
const EFFECTIVE_DATE = 'May 17, 2025'
const CONTACT_EMAIL = 'legal@prompthall.com'
const COMPANY = 'PromptHall'
const WEBSITE = 'https://prompthall.com'

export default function PrivacyPolicy({ onBack }) {
  return (
    <div className="legal-page">
      <div className="legal-topbar">
        <button className="legal-back-btn" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <div className="legal-topbar-logo">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#1A6BFF"/><path d="M8 10h10v2H8zM8 15h14v2H8zM8 20h8v2H8z" fill="white"/><circle cx="24" cy="22" r="4" fill="white"/></svg>
          PromptHall
        </div>
      </div>

      <div className="legal-container">
        <div className="legal-header">
          <span className="legal-eyebrow">Legal</span>
          <h1 className="legal-title">Privacy Policy</h1>
          <div className="legal-meta">
            <span>Effective: {EFFECTIVE_DATE}</span>
            <span className="legal-meta-sep">·</span>
            <span>Last updated: {LAST_UPDATED}</span>
          </div>
          <p className="legal-intro">
            {COMPANY} ("{COMPANY}", "we", "us", or "our") operates {WEBSITE}. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our platform. By accessing or using PromptHall, you agree to this policy. If you do not agree, please discontinue use immediately.
          </p>
        </div>

        <div className="legal-toc">
          <p className="legal-toc-title">Contents</p>
          {[
            '1. Information We Collect',
            '2. How We Use Your Information',
            '3. Legal Bases for Processing',
            '4. Information Sharing and Disclosure',
            '5. Cookies and Tracking',
            '6. Data Retention',
            '7. Security',
            '8. Your Rights',
            '9. Children\'s Privacy',
            '10. Third-Party Services',
            '11. International Transfers',
            '12. Changes to This Policy',
            '13. Contact Us',
          ].map((item, i) => (
            <a key={i} className="legal-toc-item" href={`#section-${i + 1}`}>{item}</a>
          ))}
        </div>

        <div className="legal-body">

          <section id="section-1" className="legal-section">
            <h2>1. Information We Collect</h2>
            <h3>1.1 Information You Provide Directly</h3>
            <p>We collect information you voluntarily provide when you:</p>
            <ul>
              <li><strong>Create an account:</strong> Name, email address, profile picture (via OAuth providers such as Google).</li>
              <li><strong>Submit a site:</strong> Site name, URL, description, screenshot, AI prompt, tool used, tech stack, tags, categories, color preferences, font choices, layout style, GitHub profile URL, and any other content you voluntarily include.</li>
              <li><strong>Post comments or ratings:</strong> Comment text, star rating, and the timestamp of your activity.</li>
              <li><strong>Contact us:</strong> Any information you include in communications sent to our support or legal email addresses.</li>
              <li><strong>Use the Prompt Personaliser:</strong> Business name, business description, target audience, design preferences, contact details, and other inputs you provide to generate a personalised prompt.</li>
            </ul>

            <h3>1.2 Information Collected Automatically</h3>
            <p>When you use PromptHall, we automatically collect:</p>
            <ul>
              <li><strong>Log data:</strong> IP address, browser type and version, operating system, referring URLs, pages viewed, time and date of visits, and clickstream data.</li>
              <li><strong>Device data:</strong> Device type, unique device identifiers, screen resolution, and language settings.</li>
              <li><strong>Usage data:</strong> Features used, search queries entered, sites viewed, prompts copied, and time spent on pages.</li>
              <li><strong>Cookies and similar technologies:</strong> See Section 5 for full details.</li>
            </ul>

            <h3>1.3 Information from Third Parties</h3>
            <p>We receive information from:</p>
            <ul>
              <li><strong>Authentication providers (e.g., Google OAuth):</strong> Name, email address, profile picture, and unique provider ID.</li>
              <li><strong>Supabase (our database and authentication provider):</strong> Authentication tokens, session data, and database records associated with your account.</li>
              <li><strong>Google Gemini API:</strong> We send prompt content and your personalisation inputs to the Gemini API to generate personalised prompts. We do not receive personal data back from Gemini beyond the generated text output.</li>
            </ul>
          </section>

          <section id="section-2" className="legal-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul>
              <li><strong>To provide and operate the platform:</strong> Displaying submitted sites, enabling prompt copying, processing ratings and comments, and authenticating users.</li>
              <li><strong>To personalise your experience:</strong> Remembering your preferences and tailoring content shown to you.</li>
              <li><strong>To power the Prompt Personaliser:</strong> Sending your inputs to the Google Gemini API to generate personalised prompts on your behalf.</li>
              <li><strong>To communicate with you:</strong> Sending transactional emails (e.g., account-related notifications). We do not send marketing emails without your explicit consent.</li>
              <li><strong>To enforce our policies:</strong> Detecting, investigating, and preventing fraudulent, abusive, or illegal activity, including intellectual property infringement.</li>
              <li><strong>To improve the platform:</strong> Analysing usage patterns, diagnosing technical issues, and developing new features.</li>
              <li><strong>To comply with legal obligations:</strong> Responding to lawful requests from courts, law enforcement, and regulatory authorities.</li>
              <li><strong>To protect rights and safety:</strong> Enforcing our Terms of Service and protecting the rights, property, and safety of PromptHall, our users, and the public.</li>
            </ul>
            <p>We do not sell, rent, or trade your personal information to third parties for their marketing purposes under any circumstances.</p>
          </section>

          <section id="section-3" className="legal-section">
            <h2>3. Legal Bases for Processing</h2>
            <p>Where applicable (including under the GDPR and similar laws), we process your personal data on the following legal bases:</p>
            <ul>
              <li><strong>Contractual necessity:</strong> Processing required to provide you with the services you requested, including account creation, site submissions, and prompt generation.</li>
              <li><strong>Legitimate interests:</strong> Improving our platform, preventing fraud, ensuring security, and analytics — where these interests are not overridden by your rights.</li>
              <li><strong>Legal obligation:</strong> Complying with applicable laws and responding to lawful legal processes.</li>
              <li><strong>Consent:</strong> Where we rely on consent (e.g., optional analytics cookies), you may withdraw it at any time without affecting the lawfulness of prior processing.</li>
            </ul>
          </section>

          <section id="section-4" className="legal-section">
            <h2>4. Information Sharing and Disclosure</h2>
            <p>We share your information only in the following circumstances:</p>
            <ul>
              <li><strong>Service providers:</strong> We share data with trusted third-party vendors who help us operate PromptHall, including Supabase (database and authentication), Google (OAuth and Gemini AI), and Netlify (hosting). These providers are contractually obligated to use your data only to provide services to us and in accordance with this policy.</li>
              <li><strong>Public content:</strong> Information you submit publicly (site submissions, comments, ratings, author name) is visible to all users of the platform by design. Exercise caution about what you include in publicly submitted content.</li>
              <li><strong>Legal requirements:</strong> We may disclose your information if required to do so by law, subpoena, court order, or other governmental or legal process, or if we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others.</li>
              <li><strong>Business transfers:</strong> In the event of a merger, acquisition, reorganisation, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you via email or prominent notice on the platform before your information is transferred and becomes subject to a different privacy policy.</li>
              <li><strong>With your explicit consent:</strong> We may share your information for any other purpose with your prior explicit consent.</li>
            </ul>
            <p><strong>We do not share your information with advertisers.</strong> PromptHall does not display third-party advertisements and does not allow advertisers to access user data.</p>
          </section>

          <section id="section-5" className="legal-section">
            <h2>5. Cookies and Tracking</h2>
            <h3>5.1 What We Use</h3>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li><strong>Essential cookies:</strong> Maintain your authentication session and remember your login state. These are strictly necessary and cannot be disabled without breaking the platform.</li>
              <li><strong>Functional cookies:</strong> Remember your preferences (e.g., search filters, display settings).</li>
              <li><strong>Analytics cookies:</strong> Understand how users interact with the platform (e.g., pages visited, features used). These may be disabled. See our Cookie Policy for full details.</li>
            </ul>
            <h3>5.2 Third-Party Cookies</h3>
            <p>Embedded YouTube videos on our platform may set cookies from Google/YouTube when you interact with them. These are subject to Google's Privacy Policy. We have no control over these cookies.</p>
            <h3>5.3 Your Choices</h3>
            <p>You may disable non-essential cookies via your browser settings or our cookie preference centre. Disabling essential cookies will impair platform functionality.</p>
          </section>

          <section id="section-6" className="legal-section">
            <h2>6. Data Retention</h2>
            <p>We retain your personal information for as long as:</p>
            <ul>
              <li>Your account remains active;</li>
              <li>Necessary to provide you with our services;</li>
              <li>Required by law (e.g., tax, accounting, or regulatory obligations); or</li>
              <li>Necessary to resolve disputes, enforce agreements, or protect our legal interests.</li>
            </ul>
            <p>When you delete your account, we will delete or anonymise your personal information within <strong>30 days</strong>, except where retention is required by law or legitimate business necessity (e.g., fraud prevention records). Publicly submitted content (site submissions, comments) may remain visible if it has been interacted with by other users, but will be disassociated from your identity.</p>
            <p>Prompt Personaliser inputs sent to the Gemini API are processed in real time and are not stored by PromptHall beyond your active session.</p>
          </section>

          <section id="section-7" className="legal-section">
            <h2>7. Security</h2>
            <p>We implement industry-standard technical and organisational security measures, including:</p>
            <ul>
              <li>HTTPS encryption for all data in transit;</li>
              <li>Supabase row-level security (RLS) policies to restrict database access;</li>
              <li>Authentication via OAuth 2.0 with established providers;</li>
              <li>API keys stored as environment variables and never exposed client-side (except public anon keys with appropriate RLS);</li>
              <li>Regular review of access controls and permissions.</li>
            </ul>
            <p>However, <strong>no method of transmission over the internet or electronic storage is 100% secure.</strong> We cannot guarantee absolute security. In the event of a data breach that affects your rights and freedoms, we will notify affected users and relevant authorities as required by applicable law.</p>
            <p>You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately at {CONTACT_EMAIL} if you suspect unauthorised access to your account.</p>
          </section>

          <section id="section-8" className="legal-section">
            <h2>8. Your Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data ("right to be forgotten"), subject to legal exceptions.</li>
              <li><strong>Restriction:</strong> Request that we restrict processing of your data in certain circumstances.</li>
              <li><strong>Portability:</strong> Request your data in a structured, machine-readable format.</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interests or for direct marketing.</li>
              <li><strong>Withdraw consent:</strong> Where processing is based on consent, withdraw it at any time without affecting prior lawful processing.</li>
              <li><strong>Lodge a complaint:</strong> File a complaint with your local data protection authority (e.g., ICO in the UK, your national DPA in the EU).</li>
            </ul>
            <p>To exercise any of these rights, contact us at <strong>{CONTACT_EMAIL}</strong>. We will respond within 30 days. We may need to verify your identity before processing your request.</p>
            <p>California residents may have additional rights under the CCPA/CPRA, including the right to know about, delete, and opt out of the sale of personal information. We do not sell personal information.</p>
            <p>Nigerian users are protected under the Nigeria Data Protection Act (NDPA) 2023 and may contact the Nigeria Data Protection Commission (NDPC) to lodge complaints.</p>
          </section>

          <section id="section-9" className="legal-section">
            <h2>9. Children's Privacy</h2>
            <p>PromptHall is not directed to individuals under the age of <strong>13</strong> (or 16 in certain jurisdictions). We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected personal information from a child under the applicable age threshold without verified parental consent, we will take immediate steps to delete that information.</p>
            <p>If you believe we have collected information from a child, please contact us immediately at {CONTACT_EMAIL}.</p>
          </section>

          <section id="section-10" className="legal-section">
            <h2>10. Third-Party Services</h2>
            <p>PromptHall integrates with or links to third-party services. Their privacy practices are governed by their own policies, which we encourage you to review:</p>
            <ul>
              <li><strong>Google / Google OAuth:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">policies.google.com/privacy</a></li>
              <li><strong>Google Gemini AI:</strong> <a href="https://ai.google.dev/terms" target="_blank" rel="noreferrer">ai.google.dev/terms</a></li>
              <li><strong>Supabase:</strong> <a href="https://supabase.com/privacy" target="_blank" rel="noreferrer">supabase.com/privacy</a></li>
              <li><strong>Netlify:</strong> <a href="https://www.netlify.com/privacy/" target="_blank" rel="noreferrer">netlify.com/privacy</a></li>
              <li><strong>YouTube:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">policies.google.com/privacy</a></li>
            </ul>
            <p>We are not responsible for the privacy practices of third-party services. Links to external websites do not constitute endorsement.</p>
          </section>

          <section id="section-11" className="legal-section">
            <h2>11. International Data Transfers</h2>
            <p>PromptHall operates globally. Your information may be processed and stored in countries other than your country of residence, including the United States and the European Economic Area. These countries may have different data protection laws than your jurisdiction.</p>
            <p>Where we transfer personal data from the EEA, UK, or Switzerland to third countries, we rely on appropriate safeguards such as Standard Contractual Clauses (SCCs) approved by the European Commission, or other legally recognised transfer mechanisms. By using PromptHall, you consent to such transfers.</p>
          </section>

          <section id="section-12" className="legal-section">
            <h2>12. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. When we do, we will:</p>
            <ul>
              <li>Update the "Last updated" date at the top of this page;</li>
              <li>Notify registered users via email for material changes; and</li>
              <li>Post a prominent notice on the platform for 30 days following material changes.</li>
            </ul>
            <p>Your continued use of PromptHall after changes become effective constitutes acceptance of the revised policy. If you do not agree to the revised policy, you must discontinue use and may request deletion of your account.</p>
          </section>

          <section id="section-13" className="legal-section">
            <h2>13. Contact Us</h2>
            <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
            <div className="legal-contact-block">
              <p><strong>PromptHall</strong></p>
              <p>Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
              <p>Website: <a href={WEBSITE} target="_blank" rel="noreferrer">{WEBSITE}</a></p>
            </div>
            <p>We aim to respond to all legitimate requests within <strong>30 days</strong>. If your request is complex or numerous, it may take longer, in which case we will inform you.</p>
          </section>

        </div>

        <div className="legal-footer-note">
          <p>This Privacy Policy was last updated on {LAST_UPDATED}. This document was drafted to comply with applicable data protection laws including GDPR (EU), UK GDPR, CCPA/CPRA (California), and NDPA (Nigeria).</p>
        </div>
      </div>
    </div>
  )
}