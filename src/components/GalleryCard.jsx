import { useNavigate } from 'react-router-dom'
import './GalleryCard.css'

const TOOL_LABELS = {
  cursor: 'Cursor', bolt: 'Bolt', v0: 'v0', lovable: 'Lovable',
  replit: 'Replit', windsurf: 'Windsurf', copilot: 'GitHub Copilot',
  claude: 'Claude', chatgpt: 'ChatGPT', gemini: 'Gemini',
  codeium: 'Codeium', zed: 'Zed AI', cline: 'Cline',
  aider: 'Aider', continue: 'Continue', other: 'Other',
}

const TOOL_COLORS = {
  cursor: '#000', v0: '#A855F7', bolt: '#F97316', lovable: '#EC4899',
  replit: '#59B67C', windsurf: '#0EA5E9', claude: '#D97706',
  chatgpt: '#10A37F', gemini: '#4285F4', copilot: '#5e5b63', other: '#94A3B8',
}

export default function GalleryCard({ site, index, onView, onSignIn, user }) {
  const navigate = useNavigate()
  const authorName = site.author_name || site.author || 'Anonymous'
  const initials = authorName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const tags = site.tags || []
  const toolColor = TOOL_COLORS[site.tool] || '#94A3B8'
  const toolLabel = TOOL_LABELS[site.tool] || site.tool
  const avgRating = site.avg_rating || 0
  const ratingCount = site.rating_count || 0

  function handleVisit(e) {
    e.stopPropagation()
    window.open(site.url, '_blank')
  }

  function handlePersonalise(e) {
    e.stopPropagation()
    if (!user) { onSignIn(); return }
    navigate(`/personalise/${site.id}`)
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

        {/* Rating badge */}
        {ratingCount > 0 && (
          <div className="ph-card__rating-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>{avgRating.toFixed(1)}</span>
            <span className="ph-card__rating-count">({ratingCount})</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="ph-card__overlay">
          <button className="ph-card__overlay-btn ph-card__overlay-btn--visit" onClick={handleVisit}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Visit site
          </button>
          <button
            className="ph-card__overlay-btn ph-card__overlay-btn--personalise"
            onClick={handlePersonalise}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            Personalise prompt
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

      <div className="ph-card__accent" />
    </article>
  )
}