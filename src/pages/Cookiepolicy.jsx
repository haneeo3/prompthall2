import './Legalpage.css'

const LAST_UPDATED = 'May 17, 2025'
const CONTACT_EMAIL = 'legal@prompthall.com'
const COMPANY = 'PromptHall'
const WEBSITE = 'https://prompthall.com'

export default function CookiePolicy({ onBack }) {
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
          <h1 className="legal-title">Cookie Policy</h1>
          <div className="legal-meta">
            <span>Last updated: {LAST_UPDATED}</span>
          </div>
          <p className="legal-intro">
            This Cookie Policy explains what cookies are, how {COMPANY} uses them on {WEBSITE}, and your choices regarding their use. This policy should be read alongside our Privacy Policy, which provides broader context on how we handle your personal information.
          </p>
        </div>

        <div className="legal-body">

          <section className="legal-section">
            <h2>1. What Are Cookies?</h2>
            <p>Cookies are small text files placed on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work efficiently and to provide information to website owners.</p>
            <p>Similar technologies include:</p>
            <ul>
              <li><strong>Local storage:</strong> A browser-based storage mechanism (distinct from cookies) used to persist data locally on your device between sessions.</li>
              <li><strong>Session storage:</strong> Similar to local storage but cleared when the browser session ends.</li>
              <li><strong>Pixels and web beacons:</strong> Tiny invisible files embedded in pages or emails that signal when they have been accessed.</li>
            </ul>
            <p>This policy covers cookies and all substantially similar tracking technologies used by PromptHall.</p>
          </section>

          <section className="legal-section">
            <h2>2. Cookies We Use</h2>
            <p>We categorise our cookies as follows:</p>

            <div className="legal-cookie-table">
              <div className="legal-cookie-category">
                <div className="legal-cookie-cat-header">
                  <span className="legal-cookie-cat-label legal-cookie-cat-required">Strictly Necessary</span>
                  <span className="legal-cookie-cat-note">Cannot be disabled</span>
                </div>
                <p>These cookies are essential for PromptHall to function. They enable core functionality such as authentication, security, and session management. You cannot opt out of these cookies without disabling core platform features.</p>
                <div className="legal-cookie-list">
                  <div className="legal-cookie-item">
                    <div className="legal-cookie-name">sb-[project]-auth-token</div>
                    <div className="legal-cookie-desc">Supabase authentication session token. Keeps you logged in between page visits. Set by Supabase. Duration: up to 1 week, or until you sign out.</div>
                  </div>
                  <div className="legal-cookie-item">
                    <div className="legal-cookie-name">sb-[project]-auth-token-code-verifier</div>
                    <div className="legal-cookie-desc">PKCE code verifier used during OAuth authentication flows. Temporary — deleted after login completes.</div>
                  </div>
                </div>
              </div>

              <div className="legal-cookie-category">
                <div className="legal-cookie-cat-header">
                  <span className="legal-cookie-cat-label legal-cookie-cat-functional">Functional</span>
                  <span className="legal-cookie-cat-note">Can be disabled</span>
                </div>
                <p>These cookies enable enhanced functionality and personalisation. Disabling them may affect your experience but will not prevent basic use of the platform.</p>
                <div className="legal-cookie-list">
                  <div className="legal-cookie-item">
                    <div className="legal-cookie-name">ph-filter-prefs</div>
                    <div className="legal-cookie-desc">Remembers your last-used gallery filter settings (tool, category). Duration: 30 days.</div>
                  </div>
                  <div className="legal-cookie-item">
                    <div className="legal-cookie-name">ph-theme</div>
                    <div className="legal-cookie-desc">Stores your display preference (if applicable). Duration: 1 year.</div>
                  </div>
                </div>
              </div>

              <div className="legal-cookie-category">
                <div className="legal-cookie-cat-header">
                  <span className="legal-cookie-cat-label legal-cookie-cat-analytics">Analytics</span>
                  <span className="legal-cookie-cat-note">Can be disabled</span>
                </div>
                <p>These cookies help us understand how visitors interact with PromptHall. The data is used in aggregate to improve platform performance and features. We do not use analytics cookies to identify you personally.</p>
                <div className="legal-cookie-list">
                  <div className="legal-cookie-item">
                    <div className="legal-cookie-name">_ga, _ga_[ID]</div>
                    <div className="legal-cookie-desc">Google Analytics — tracks page views, session duration, and general usage patterns. Data is anonymised. Duration: 2 years. You may opt out at <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">tools.google.com/dlpage/gaoptout</a>.</div>
                  </div>
                </div>
              </div>

              <div className="legal-cookie-category">
                <div className="legal-cookie-cat-header">
                  <span className="legal-cookie-cat-label legal-cookie-cat-third">Third-Party</span>
                  <span className="legal-cookie-cat-note">Set by third parties</span>
                </div>
                <p>When you interact with embedded content on PromptHall (such as YouTube videos), third-party cookies may be set by those platforms. We do not control these cookies and they are subject to the respective third party's privacy and cookie policies.</p>
                <div className="legal-cookie-list">
                  <div className="legal-cookie-item">
                    <div className="legal-cookie-name">YouTube / Google cookies</div>
                    <div className="legal-cookie-desc">Set when you play an embedded YouTube video. May track your viewing behaviour and preferences across Google properties. Subject to Google's Privacy Policy. We embed YouTube videos in no-cookie mode (youtube-nocookie.com) where technically feasible.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>3. Local Storage</h2>
            <p>In addition to cookies, PromptHall uses browser local storage for:</p>
            <ul>
              <li><strong>Authentication tokens:</strong> Supabase may store session tokens in local storage as part of the authentication flow. This data is encrypted and tied to your session.</li>
              <li><strong>UI state:</strong> Temporary state such as open/closed panels or wizard progress during active sessions.</li>
            </ul>
            <p>Local storage data can be cleared at any time through your browser settings (typically under Privacy or Storage settings).</p>
          </section>

          <section className="legal-section">
            <h2>4. Why We Use Cookies</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Keep you authenticated between page loads without requiring you to log in repeatedly;</li>
              <li>Protect the platform against cross-site request forgery (CSRF) and other security threats;</li>
              <li>Remember your preferences to provide a consistent experience;</li>
              <li>Understand which features are most used so we can improve the platform;</li>
              <li>Enable embedded third-party content such as tutorial videos.</li>
            </ul>
            <p>We do <strong>not</strong> use cookies for:</p>
            <ul>
              <li>Targeted or behavioural advertising;</li>
              <li>Selling your data to advertisers or data brokers;</li>
              <li>Building advertising profiles;</li>
              <li>Tracking you across third-party websites.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Your Cookie Choices</h2>
            <h3>5.1 Browser Controls</h3>
            <p>You can control and manage cookies through your browser settings. All major browsers allow you to:</p>
            <ul>
              <li>View cookies currently stored;</li>
              <li>Delete individual cookies or all cookies;</li>
              <li>Block all cookies or only third-party cookies;</li>
              <li>Set preferences for specific websites.</li>
            </ul>
            <p>Browser-specific instructions:</p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noreferrer">Microsoft Edge</a></li>
            </ul>
            <p><strong>Please note:</strong> Blocking strictly necessary cookies will prevent you from logging in and using authenticated features of PromptHall.</p>

            <h3>5.2 Opt-Out Tools</h3>
            <ul>
              <li><strong>Google Analytics:</strong> Install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">Google Analytics Opt-out Browser Add-on</a>.</li>
              <li><strong>Do Not Track:</strong> Some browsers support a "Do Not Track" signal. While we respect this preference for non-essential tracking, it does not affect strictly necessary cookies.</li>
            </ul>

            <h3>5.3 Consent</h3>
            <p>Where required by law (e.g., EU/UK GDPR, ePrivacy Directive), we will ask for your consent before placing non-essential cookies. You may withdraw this consent at any time by adjusting your browser settings or contacting us at {CONTACT_EMAIL}. Withdrawal of consent does not affect the lawfulness of processing carried out before withdrawal.</p>
          </section>

          <section className="legal-section">
            <h2>6. Cookies and Children</h2>
            <p>We do not knowingly use cookies to collect information from children under 13. If you believe a child has used our platform and cookies have been set, please contact us at {CONTACT_EMAIL} and we will take appropriate action.</p>
          </section>

          <section className="legal-section">
            <h2>7. Updates to This Policy</h2>
            <p>We may update this Cookie Policy as our platform evolves or when required by law. When we make material changes, we will update the "Last updated" date and, where appropriate, notify you via email or an on-platform notice. Continued use of PromptHall after any changes constitutes your acceptance of the updated policy.</p>
          </section>

          <section className="legal-section">
            <h2>8. Contact Us</h2>
            <p>If you have questions about our use of cookies or this policy, please contact us:</p>
            <div className="legal-contact-block">
              <p><strong>PromptHall</strong></p>
              <p>Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
              <p>Website: <a href={WEBSITE} target="_blank" rel="noreferrer">{WEBSITE}</a></p>
            </div>
          </section>

        </div>

        <div className="legal-footer-note">
          <p>Last updated: {LAST_UPDATED}. This Cookie Policy applies to {WEBSITE} and all subdomains operated by {COMPANY}.</p>
        </div>
      </div>
    </div>
  )
}