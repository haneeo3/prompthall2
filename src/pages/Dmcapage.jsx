import './LegalPage.css'

const LAST_UPDATED = 'May 17, 2025'
const CONTACT_EMAIL = 'dmca@prompthall.com'
const COMPANY = 'PromptHall'
const WEBSITE = 'https://prompthall.com'

export default function DMCAPage({ onBack }) {
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
          <h1 className="legal-title">DMCA Policy</h1>
          <div className="legal-meta">
            <span>Last updated: {LAST_UPDATED}</span>
          </div>
          <p className="legal-intro">
            {COMPANY} respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA), 17 U.S.C. § 512, and equivalent international copyright laws. This policy describes our procedures for handling claims of copyright infringement and counter-notifications.
          </p>
        </div>

        <div className="legal-body">

          <section className="legal-section">
            <h2>1. Our Platform and User Content</h2>
            <p>PromptHall is a user-generated content platform. Users submit AI-built websites, associated prompts, screenshots, descriptions, and other content ("User Content"). We do not create, own, or endorse User Content submitted by our users.</p>
            <p>By submitting content to PromptHall, users represent and warrant that:</p>
            <ul>
              <li>They are the original author or rights holder of all submitted content, or have obtained all necessary rights, licences, and permissions;</li>
              <li>The content does not infringe any third-party intellectual property rights, including copyright, trademark, or trade secrets;</li>
              <li>The submitted prompts are their original work or they have the right to share them;</li>
              <li>Screenshots and images of websites do not infringe on third-party copyrights or rights of publicity.</li>
            </ul>
            <p>Users who submit infringing content are solely responsible for any resulting claims, damages, and liabilities.</p>
          </section>

          <section className="legal-section">
            <h2>2. Reporting Copyright Infringement (DMCA Takedown Notice)</h2>
            <p>If you believe that content on PromptHall infringes your copyright, you may submit a DMCA takedown notice to our designated agent. Your notice must include <strong>all</strong> of the following elements required by 17 U.S.C. § 512(c)(3):</p>
            <ol>
              <li><strong>Physical or electronic signature</strong> of the copyright owner or a person authorised to act on their behalf;</li>
              <li><strong>Identification of the copyrighted work</strong> claimed to have been infringed. If multiple works are covered by a single notification, provide a representative list;</li>
              <li><strong>Identification of the infringing material</strong> and its location on PromptHall (provide the specific URL(s) where the infringing content can be found);</li>
              <li><strong>Your contact information:</strong> name, address, telephone number, and email address;</li>
              <li>A statement that you have a <strong>good faith belief</strong> that use of the material in the manner complained of is not authorised by the copyright owner, its agent, or the law;</li>
              <li>A statement, <strong>made under penalty of perjury</strong>, that the information in the notification is accurate and that you are the copyright owner or are authorised to act on behalf of the copyright owner.</li>
            </ol>

            <div className="legal-highlight-box">
              <p><strong>Send DMCA notices to our designated agent:</strong></p>
              <p>Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
              <p>Subject line: DMCA Takedown Notice — [Brief description of infringing content]</p>
            </div>

            <p><strong>Warning:</strong> Submitting a false or bad-faith DMCA notice may result in liability for damages, including costs and legal fees, under 17 U.S.C. § 512(f). Do not submit a notice if you are not the rights holder or authorised agent.</p>
          </section>

          <section className="legal-section">
            <h2>3. Our Response to Valid Takedown Notices</h2>
            <p>Upon receipt of a valid and complete DMCA notice, we will:</p>
            <ul>
              <li>Promptly remove or disable access to the allegedly infringing content;</li>
              <li>Notify the user who submitted the content that their submission has been removed;</li>
              <li>Provide the user with a copy of the takedown notice (with personal contact information redacted where appropriate);</li>
              <li>Inform the user of their right to submit a counter-notification;</li>
              <li>Maintain a record of the notice for our repeat infringer policy (see Section 6).</li>
            </ul>
            <p>We aim to process valid notices within <strong>72 hours</strong> of receipt. Incomplete notices will not be actioned until all required information is provided.</p>
          </section>

          <section className="legal-section">
            <h2>4. Counter-Notification Procedure</h2>
            <p>If you believe your content was removed due to a mistake or misidentification, you may submit a counter-notification under 17 U.S.C. § 512(g). Your counter-notification must include:</p>
            <ol>
              <li><strong>Your physical or electronic signature;</strong></li>
              <li><strong>Identification of the removed material</strong> and the location where it appeared before removal;</li>
              <li>A statement under <strong>penalty of perjury</strong> that you have a good faith belief the material was removed or disabled as a result of mistake or misidentification;</li>
              <li><strong>Your name, address, and telephone number;</strong></li>
              <li>A statement that you <strong>consent to the jurisdiction</strong> of the federal court in the district where you reside (or, if outside the US, any judicial district in which PromptHall may be found), and that you will accept service of process from the person who submitted the original DMCA notice or their agent.</li>
            </ol>
            <p>Send counter-notifications to: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
            <p>Upon receipt of a valid counter-notification, we will forward it to the original complainant and may restore the removed content within <strong>10–14 business days</strong>, unless the complainant notifies us they have filed a court action seeking an injunction against the content's restoration.</p>
          </section>

          <section className="legal-section">
            <h2>5. Trademark and Other IP Infringement</h2>
            <p>This DMCA policy applies specifically to copyright claims. If you believe content on PromptHall infringes your <strong>trademark, trade dress, or other intellectual property rights</strong>, please contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with:</p>
            <ul>
              <li>A description of the IP right you believe has been infringed;</li>
              <li>Evidence of your ownership of the right;</li>
              <li>The specific URL(s) of the allegedly infringing content;</li>
              <li>Your full contact information.</li>
            </ul>
            <p>We will investigate such claims and take appropriate action, which may include removal of the infringing content.</p>
          </section>

          <section className="legal-section">
            <h2>6. Repeat Infringer Policy</h2>
            <p>PromptHall has a strict repeat infringer policy. In accordance with 17 U.S.C. § 512(i), we will:</p>
            <ul>
              <li>Maintain records of all DMCA notices received and the accounts associated with infringing content;</li>
              <li>Issue a formal warning to users on their first substantiated infringement;</li>
              <li><strong>Permanently terminate the accounts</strong> of users who are determined to be repeat infringers (defined as two or more substantiated infringement claims within any 12-month period);</li>
              <li>Retain the right to terminate any account at our sole discretion upon a single severe infringement (e.g., wholesale copying of another creator's portfolio);</li>
              <li>Blacklist the email addresses and IP addresses of terminated repeat infringers to prevent re-registration.</li>
            </ul>
            <p>Termination under this policy is permanent and non-reversible. No refunds will be issued.</p>
          </section>

          <section className="legal-section">
            <h2>7. AI-Generated Content and Copyright</h2>
            <p>PromptHall hosts prompts used to generate AI-built websites. We acknowledge the evolving legal landscape around AI-generated content and clarify our position:</p>
            <ul>
              <li><strong>Prompts:</strong> We treat submitted prompts as the original creative expression of the submitting user. If you believe a submitted prompt reproduces your copyrighted text, you may submit a DMCA notice under Section 2.</li>
              <li><strong>AI-generated outputs:</strong> The copyright status of AI-generated content is actively evolving in law. PromptHall does not make representations about the copyright ownership of AI-generated website outputs. Users are solely responsible for ensuring their use of AI-generated content complies with applicable law and the terms of the AI tools they use.</li>
              <li><strong>Screenshots:</strong> Screenshots of third-party websites submitted without authorisation may infringe copyright. Rights holders may submit takedown notices for such screenshots.</li>
              <li><strong>Third-party tool terms:</strong> Users must comply with the terms of service of AI tools used to generate content (e.g., Lovable, Bolt, v0, Cursor). Violations of those terms are the user's sole responsibility.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>8. Safe Harbour</h2>
            <p>PromptHall qualifies as a service provider under the DMCA's safe harbour provisions (17 U.S.C. § 512(c)) for user-submitted content, provided we:</p>
            <ul>
              <li>Do not have actual knowledge of infringing material or, upon obtaining such knowledge, act expeditiously to remove it;</li>
              <li>Do not receive a financial benefit directly attributable to the infringing activity in circumstances where we have the right and ability to control such activity;</li>
              <li>Respond expeditiously to remove or disable access to material upon receiving valid DMCA notices;</li>
              <li>Have adopted and implemented a repeat infringer policy (see Section 6).</li>
            </ul>
            <p>Nothing in this policy limits our right to remove any content that we determine, in our sole discretion, violates our Terms of Service or any applicable law, regardless of whether a formal DMCA notice has been submitted.</p>
          </section>

          <section className="legal-section">
            <h2>9. No Legal Advice</h2>
            <p>This policy is provided for informational purposes and does not constitute legal advice. If you have questions about copyright law or whether your use of content constitutes infringement, please consult a qualified intellectual property attorney.</p>
          </section>

          <section className="legal-section">
            <h2>10. Contact</h2>
            <div className="legal-contact-block">
              <p><strong>DMCA Designated Agent — PromptHall</strong></p>
              <p>Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
              <p>Website: <a href={WEBSITE} target="_blank" rel="noreferrer">{WEBSITE}</a></p>
            </div>
            <p>Please include "DMCA Notice" or "DMCA Counter-Notice" in your subject line to ensure prompt processing.</p>
          </section>

        </div>

        <div className="legal-footer-note">
          <p>Last updated: {LAST_UPDATED}. This DMCA policy is governed by the laws of the United States and applicable international copyright treaties.</p>
        </div>
      </div>
    </div>
  )
}