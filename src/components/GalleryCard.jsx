import './GalleryCard.css'

const TOOL_LABELS = {
  cursor: 'Cursor',
  bolt: 'Bolt',
  v0: 'v0',
  lovable: 'Lovable',
  replit: 'Replit',
  other: 'Other',
}

const TOOL_COLORS = {
  cursor: '#00C2FF',
  bolt:   '#F97316',
  v0:     '#A855F7',
  lovable:'#EC4899',
  replit: '#59B67C',
  other:  '#94A3B8',
}

export default function GalleryCard({ site, index, onView, onSignIn, user, onCopyPrompt, copied }) {
  const authorName = site.author_name || site.author || 'Anonymous'
  const initials = authorName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const tags = site.tags || []
  const toolColor = TOOL_COLORS[site.tool] || '#94A3B8'
  const toolLabel = TOOL_LABELS[site.tool] || site.tool

  function handleVisit(e) {
    e.stopPropagation()
    window.open(site.url, '_blank')
  }

  function handleCopy(e) {
    e.stopPropagation()
    if (!user) { onSignIn(); return }
    onCopyPrompt && onCopyPrompt()
  }

  return (
    <article
      className="ph-card"
      style={{ '--tool-color': toolColor, animationDelay: `${index * 0.05}s` }}
      onClick={() => onView(site)}
    >
      {/* Image area */}
      <div className="ph-card__image">
        {site.screenshot_url
          ? <img src={site.screenshot_url} alt={site.title} loading="lazy" />
          : (
            <div className="ph-card__placeholder">
              <span>{site.title?.slice(0, 2).toUpperCase()}</span>
            </div>
          )
        }

        {/* Tool badge */}
        <div className="ph-card__tool-badge">
          <span className="ph-card__tool-dot" />
          {toolLabel}
        </div>

        {/* Hover overlay */}
        <div className="ph-card__overlay">
          <button className="ph-card__overlay-btn ph-card__overlay-btn--visit" onClick={handleVisit}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Visit site
          </button>
          <button
            className={`ph-card__overlay-btn ph-card__overlay-btn--copy ${copied ? 'ph-card__overlay-btn--copied' : ''}`}
            onClick={handleCopy}
          >
            {copied
              ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Copy prompt
                </>
              )
            }
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="ph-card__body">
        <div className="ph-card__top">
          <h3 className="ph-card__title">{site.title}</h3>
          <p className="ph-card__desc">{site.description || site.desc}</p>
        </div>

        <div className="ph-card__footer">
          <div className="ph-card__author">
            <div className="ph-card__avatar">{initials}</div>
            <span className="ph-card__author-name">{authorName}</span>
          </div>

          {tags.length > 0 && (
            <div className="ph-card__tags">
              {tags.slice(0, 2).map(t => (
                <span key={t} className="ph-card__tag">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="ph-card__accent" />
    </article>
  )
}