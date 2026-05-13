import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'
import './SitePage.css'

const TOOL_LABELS = {
  cursor: 'Cursor', bolt: 'Bolt', v0: 'v0', lovable: 'Lovable',
  replit: 'Replit', windsurf: 'Windsurf', copilot: 'GitHub Copilot',
  claude: 'Claude', chatgpt: 'ChatGPT', gemini: 'Gemini',
  codeium: 'Codeium', zed: 'Zed AI', cline: 'Cline',
  aider: 'Aider', continue: 'Continue', other: 'Other',
}

const TOOL_COLORS = {
  cursor: '#000', v0: '#000', bolt: '#FF6B00', lovable: '#E91E8C',
  replit: '#F26207', windsurf: '#0EA5E9', claude: '#D97706',
  chatgpt: '#10A37F', gemini: '#4285F4', copilot: '#6E40C9', other: '#6B7280',
}

const STEPS = [
  { number: '01', title: 'Copy the prompt', desc: "Hit \"Copy prompt\" to grab the full prompt. Make sure you're signed in — it's completely free.", color: '#1A6BFF' },
  { number: '02', title: 'Open your AI builder', desc: 'Go to Cursor, Bolt, v0, Lovable, or whichever tool this site was built with (shown in the badge above).', color: '#7C3AED' },
  { number: '03', title: 'Start a fresh project', desc: "Create a brand new project or blank workspace. Don't paste into an existing project — start clean for best results.", color: '#059669' },
  { number: '04', title: 'Paste & run', desc: 'Paste directly into the chat input and hit enter. The AI will generate your site — takes 30–90 seconds.', color: '#D97706' },
  { number: '05', title: 'Customise it', desc: 'Swap the brand name, colors, and copy in follow-up messages. Ask the AI to tweak anything.', color: '#DC2626' },
  { number: '06', title: 'Deploy & share', desc: "Use Vercel, Netlify, or the tool's built-in deploy. Your site will be live in under a minute.", color: '#0891B2' },
]

function getEmbedUrl(url) {
  if (!url) return null
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1&autoplay=1`
  const loom = url.match(/loom\.com\/share\/([a-f0-9]+)/)
  if (loom) return `https://www.loom.com/embed/${loom[1]}?autoplay=1`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`
  return null
}

function getThumb(url) {
  if (!url) return null
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/)
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/maxresdefault.jpg`
  return null
}

function StarRating({ value, onChange, readonly = false, size = 24 }) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || value
  return (
    <div className="star-row" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n} type="button"
          className={`star-btn ${display >= n ? 'star-filled' : ''} ${readonly ? 'star-readonly' : ''}`}
          style={{ '--sz': `${size}px` }}
          onMouseEnter={() => !readonly && setHovered(n)}
          onClick={() => !readonly && onChange?.(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >★</button>
      ))}
    </div>
  )
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function Avatar({ name, size = 38, bg = null }) {
  const initials = (name || 'A').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['#1A6BFF', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0891B2', '#DB2777']
  const color = bg || colors[(name?.charCodeAt(0) || 0) % colors.length]
  return (
    <div className="sp-avatar-circle" style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}>
      {initials}
    </div>
  )
}

export default function SitePage({ site, onBack, user, onSignIn }) {
  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(null)

  // Ratings
  const [avgRating, setAvgRating] = useState(0)
  const [ratingCount, setRatingCount] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [ratingLoading, setRatingLoading] = useState(false)
  const [ratingDist, setRatingDist] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
  const [ratingJustSaved, setRatingJustSaved] = useState(false)

  // Comments
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const commentInputRef = useRef(null)

  /* ── fetch ratings ── */
  const fetchRatings = async () => {
    if (!site) return
    const { data } = await supabase.from('ratings').select('rating, user_id, created_at').eq('site_id', site.id)
    if (!data?.length) return
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    data.forEach(r => { if (dist[r.rating] !== undefined) dist[r.rating]++ })
    setRatingDist(dist)
    setAvgRating(data.reduce((s, r) => s + r.rating, 0) / data.length)
    setRatingCount(data.length)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => { fetchRatings() }, [site])

  /* ── fetch user rating ── */
  useEffect(() => {
    if (!site || !user) return
    supabase.from('ratings').select('rating')
      .eq('site_id', site.id).eq('user_id', user.id).single()
      .then(({ data }) => { if (data) setUserRating(data.rating) })
  }, [site, user])

  /* ── fetch comments with user profiles ── */
  const fetchComments = async () => {
    if (!site) return
    setCommentsLoading(true)
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('site_id', site.id)
      .order('created_at', { ascending: false })
    setComments(data || [])
    setCommentsLoading(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => { fetchComments() }, [site])

  /* ── realtime subscription for comments ── */
  useEffect(() => {
    if (!site) return
    const channel = supabase
      .channel(`comments:${site.id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'comments',
        filter: `site_id=eq.${site.id}`
      }, () => fetchComments())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [site])

  if (!site) return null

  const authorName = site.author_name || site.author || 'Anonymous'
  const tags = site.tags || []
  const techStack = site.tech_stack || []
  const toolLabel = TOOL_LABELS[site.tool] || site.tool
  const toolColor = TOOL_COLORS[site.tool] || '#1A6BFF'
  const embedUrl = getEmbedUrl(site.video_url)
  const thumbUrl = getThumb(site.video_url)
  const hasVideo = !!embedUrl

  async function handleRate(star) {
    if (!user) { onSignIn(); return }
    setRatingLoading(true)
    const prev = userRating
    setUserRating(star)
    const { error } = await supabase.from('ratings').upsert(
      { site_id: site.id, user_id: user.id, rating: star },
      { onConflict: 'site_id,user_id' }
    )
    if (error) { setUserRating(prev); setRatingLoading(false); return }
    await fetchRatings()
    setRatingLoading(false)
    setRatingJustSaved(true)
    setTimeout(() => setRatingJustSaved(false), 2500)
  }

  function handleCopyPrompt() {
    if (!user) { onSignIn(); return }
    navigator.clipboard.writeText(site.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2200)
  }

  async function handleSubmitComment(e) {
    e.preventDefault()
    if (!commentText.trim() || !user) return
    setSubmitting(true)
    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous'
    const avatar_color = ['#1A6BFF', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0891B2'][name.charCodeAt(0) % 6]
    const { data, error } = await supabase.from('comments').insert({
      site_id: site.id,
      user_id: user.id,
      author_name: name,
      avatar_color,
      body: commentText.trim(),
    }).select().single()
    if (!error && data) {
      setComments(prev => [data, ...prev])
      setCommentText('')
    }
    setSubmitting(false)
  }

  async function handleDeleteComment(id) {
    if (deleteConfirm !== id) { setDeleteConfirm(id); return }
    const { error } = await supabase.from('comments').delete().eq('id', id).eq('user_id', user.id)
    if (!error) setComments(prev => prev.filter(c => c.id !== id))
    setDeleteConfirm(null)
  }

  const userCommentCount = comments.filter(c => c.user_id === user?.id).length

  return (
    <div className="sp-page">

      {/* ── BACK ── */}
      <button className="sp-back-btn" onClick={onBack}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to gallery
      </button>

      {/* ── HERO ── */}
      <div className="sp-hero">
        {site.screenshot_url
          ? <img src={site.screenshot_url} alt={site.title} />
          : <div className="sp-hero-placeholder"><span>{site.title?.toUpperCase()}</span></div>
        }
        <div className="sp-hero-overlay" />

        {/* Tool badge */}
        <span className="sp-tool-badge" style={{ background: toolColor }}>
          {toolLabel}
        </span>

        {/* Rating chip */}
        {ratingCount > 0 && (
          <div className="sp-hero-rating">
            <span className="sp-hero-star">★</span>
            <span className="sp-hero-avg">{avgRating.toFixed(1)}</span>
            <span className="sp-hero-count">({ratingCount})</span>
          </div>
        )}

        {/* Hero title overlay */}
        <div className="sp-hero-title-wrap">
          <h1 className="sp-hero-title">{site.title}</h1>
          {tags.length > 0 && (
            <div className="sp-hero-tags">
              {tags.slice(0, 3).map(t => <span key={t} className="sp-hero-tag">{t}</span>)}
            </div>
          )}
        </div>
      </div>

      {/* ── BODY GRID ── */}
      <div className="sp-body">
        <div className="sp-main">

          {/* Title + meta */}
          <div className="sp-title-block">
            <p className="sp-desc">{site.description || site.desc}</p>
            <div className="sp-meta-row">
              <Avatar name={authorName} size={36} />
              <div className="sp-author-info">
                <span className="sp-author-label">Submitted by</span>
                <span className="sp-author-name">{authorName}</span>
              </div>
              {site.url && (
                <a href={site.url} target="_blank" rel="noreferrer" className="sp-live-link">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  Live site
                </a>
              )}
              {site.github_url && (
                <a href={site.github_url} target="_blank" rel="noreferrer" className="sp-github-link">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* Design context */}
          {(site.color_reason || site.font_style || site.layout_style) && (
            <div className="sp-design-section">
              <h2 className="sp-section-heading">Design context</h2>
              <div className="sp-design-grid">
                {site.color_reason && (
                  <div className="sp-design-card">
                    <div className="sp-design-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" /><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" /><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" /><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>
                    </div>
                    <div>
                      <p className="sp-design-label">Color choices</p>
                      <p className="sp-design-text">{site.color_reason}</p>
                    </div>
                  </div>
                )}
                {(site.font_style || site.layout_style) && (
                  <div className="sp-design-meta-row">
                    {site.font_style && <div className="sp-design-meta-item"><span className="sp-design-meta-label">Font style</span><span className="sp-design-meta-val">{site.font_style}</span></div>}
                    {site.layout_style && <div className="sp-design-meta-item"><span className="sp-design-meta-label">Layout</span><span className="sp-design-meta-val">{site.layout_style}</span></div>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tech stack */}
          {techStack.length > 0 && (
            <div className="sp-tech-section">
              <h2 className="sp-section-heading">Tech stack</h2>
              <div className="sp-tech-chips">
                {techStack.map(t => (
                  <span key={t} className="sp-tech-chip">
                    <span className="sp-tech-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── PROMPT ── */}
          <div className="sp-prompt-section">
            <div className="sp-prompt-header">
              <div>
                <h2 className="sp-section-heading" style={{ margin: 0 }}>The Prompt</h2>
                <p className="sp-prompt-subhead">The exact prompt used to generate this site</p>
              </div>
              {user
                ? <button className="sp-copy-btn" onClick={handleCopyPrompt}>
                  {copied
                    ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg> Copied!</>
                    : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg> Copy prompt</>
                  }
                </button>
                : <button className="sp-copy-btn sp-copy-outline" onClick={onSignIn}>Sign in to copy</button>
              }
            </div>

            {user ? (
              <div className="sp-prompt-box">
                <div className="sp-prompt-toolbar">
                  <span className="sp-prompt-lang">prompt</span>
                  <button className="sp-prompt-copy-mini" onClick={handleCopyPrompt}>
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="sp-prompt-text">{site.prompt}</pre>
              </div>
            ) : (
              <div className="sp-prompt-gate">
                <div className="sp-gate-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <div className="sp-gate-text">
                  <p className="sp-gate-title">Sign in to unlock this prompt</p>
                  <p className="sp-gate-sub">Free account · 30 seconds · access every prompt in the gallery</p>
                </div>
                <button className="sp-gate-btn" onClick={onSignIn}>Create free account →</button>
              </div>
            )}
          </div>

          {/* ── VIDEO + HELP ── */}
          <div className="sp-guide-wrap">
            {hasVideo && (
              <div className="sp-video-block">
                <p className="sp-video-eyebrow">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  Walkthrough video
                </p>
                <div className="sp-player" onClick={() => !videoPlaying && setVideoPlaying(true)}>
                  {videoPlaying ? (
                    <iframe className="sp-player-frame" src={embedUrl} title="Walkthrough" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  ) : (
                    <>
                      <div className="sp-player-thumb">
                        {thumbUrl
                          ? <img src={thumbUrl} alt="thumbnail" />
                          : <div className="sp-player-thumb-bg" />
                        }
                        <div className="sp-player-scrim" />
                      </div>
                      <button className="sp-play-btn" aria-label="Play">
                        <span className="sp-play-ring" />
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 3 }}><path d="M8 5v14l11-7z" /></svg>
                      </button>
                      <div className="sp-player-caption">
                        <span>Watch how to use this prompt</span>
                        <span className="sp-caption-hint">Click to play</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Help Guide */}
            <div className="sp-help-dropdown">
              <button
                className={`sp-help-toggle ${helpOpen ? 'open' : ''}`}
                onClick={() => setHelpOpen(o => !o)}
              >
                <div className="sp-help-toggle-left">
                  <div className="sp-help-q-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div className="sp-help-toggle-text">
                    <span className="sp-help-label">Need help using this prompt?</span>
                    <span className="sp-help-sublabel">Step-by-step guide — from prompt to live website</span>
                  </div>
                </div>
                <div className="sp-help-toggle-right">
                  <span className="sp-help-steps-count">{STEPS.length} steps</span>
                  <div className={`sp-help-chevron ${helpOpen ? 'open' : ''}`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </button>

              <div className={`sp-help-body ${helpOpen ? 'open' : ''}`}>
                <div className="sp-help-content">
                  <div className="sp-help-intro">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <span>Built with <strong>{toolLabel}</strong>. Follow these steps to recreate or remix this into your own site.</span>
                  </div>
                  <div className="sp-steps">
                    {STEPS.map((step, i) => (
                      <div
                        key={i}
                        className={`sp-step ${activeStep === i ? 'active' : ''}`}
                        style={{ '--step-color': step.color }}
                        onClick={() => setActiveStep(activeStep === i ? null : i)}
                      >
                        <div className="sp-step-left">
                          <div className="sp-step-num">{step.number}</div>
                          {i < STEPS.length - 1 && <div className="sp-step-connector" />}
                        </div>
                        <div className="sp-step-right">
                          <div className="sp-step-row">
                            <span className="sp-step-title">{step.title}</span>
                            <svg
                              className={`sp-step-caret ${activeStep === i ? 'open' : ''}`}
                              width="13" height="13" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            ><polyline points="6 9 12 15 18 9" /></svg>
                          </div>
                          <div className={`sp-step-desc ${activeStep === i ? 'open' : ''}`}>
                            <p>{step.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="sp-help-tip">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span><strong>Pro tip:</strong> After pasting, add your brand name, niche, and color preferences in a follow-up message for dramatically better results.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RATINGS ── */}
          <div className="sp-rating-section">
            <div className="sp-section-heading-row">
              <h2 className="sp-section-heading" style={{ margin: 0 }}>Rate this prompt</h2>
              {ratingCount > 0 && (
                <div className="sp-rating-pill">
                  <span className="sp-rating-pill-star">★</span>
                  <span className="sp-rating-pill-val">{avgRating.toFixed(1)}</span>
                  <span className="sp-rating-pill-count">· {ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'}</span>
                </div>
              )}
            </div>

            <div className="sp-rate-box">
              {ratingCount > 0 && (
                <div className="sp-rating-dist">
                  {[5, 4, 3, 2, 1].map(n => {
                    const pct = ratingCount ? (ratingDist[n] / ratingCount) * 100 : 0
                    return (
                      <div key={n} className="sp-dist-row">
                        <span className="sp-dist-label">{n}<span className="sp-dist-star">★</span></span>
                        <div className="sp-dist-bar-bg">
                          <div className="sp-dist-bar-fill" style={{ width: `${pct}%`, '--bar-color': n >= 4 ? '#22C55E' : n === 3 ? '#F59E0B' : '#EF4444' }} />
                        </div>
                        <span className="sp-dist-count">{ratingDist[n]}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              {ratingCount > 0 && <div className="sp-rate-divider" />}

              {user ? (
                <div className="sp-rate-inner">
                  <p className="sp-rate-label">
                    {userRating
                      ? `You gave this ${userRating} star${userRating > 1 ? 's' : ''}`
                      : 'How helpful was this prompt?'
                    }
                  </p>
                  <div className="sp-rate-row">
                    <StarRating value={userRating} onChange={handleRate} size={36} />
                    {ratingLoading && <span className="sp-rate-saving">Saving…</span>}
                    {ratingJustSaved && !ratingLoading && (
                      <span className="sp-rate-saved">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        Saved
                      </span>
                    )}
                  </div>
                  {userRating > 0 && (
                    <p className="sp-rate-change-hint">Click a different star to update your rating</p>
                  )}
                </div>
              ) : (
                <div className="sp-rate-gated">
                  <div className="sp-rate-gated-stars">
                    <StarRating value={0} readonly size={30} />
                  </div>
                  <div>
                    <p className="sp-rate-gated-title">Rate this prompt</p>
                    <p className="sp-rate-gated-sub">Sign in to leave a rating</p>
                  </div>
                  <button className="sp-rate-signin-btn" onClick={onSignIn}>Sign in →</button>
                </div>
              )}
            </div>
          </div>

          {/* ── COMMENTS / DISCUSSION ── */}
          <div className="sp-comments-section">
            <div className="sp-section-heading-row">
              <h2 className="sp-section-heading" style={{ margin: 0 }}>Discussion</h2>
              <div className="sp-comment-meta-row">
                {comments.length > 0 && (
                  <span className="sp-comment-count-badge">{comments.length}</span>
                )}
                {user && userCommentCount > 0 && (
                  <span className="sp-your-comments-badge">
                    {userCommentCount} from you
                  </span>
                )}
              </div>
            </div>

            {user ? (
              <div className="sp-comment-form-wrap">
                <Avatar name={user.user_metadata?.full_name || user.email} size={38} />
                <div className="sp-comment-form-right">
                  <textarea
                    ref={commentInputRef}
                    className="sp-comment-input"
                    placeholder="Share your experience with this prompt…"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    rows={3}
                    maxLength={1000}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmitComment(e)
                    }}
                  />
                  <div className="sp-comment-form-footer">
                    <span className="sp-comment-chars">{commentText.length}/1000</span>
                    <span className="sp-comment-hint">⌘↵ to post</span>
                    <button
                      className="sp-comment-submit"
                      disabled={!commentText.trim() || submitting}
                      onClick={handleSubmitComment}
                    >
                      {submitting
                        ? <><span className="sp-submit-spinner" /> Posting…</>
                        : 'Post comment'
                      }
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button className="sp-comment-signin-cta" onClick={onSignIn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                Sign in to join the discussion
              </button>
            )}

            <div className="sp-comments-list">
              {commentsLoading ? (
                <div className="sp-comments-skeleton">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="sp-comment-skeleton-item">
                      <div className="sp-skel sp-skel-avatar" />
                      <div className="sp-skel-body">
                        <div className="sp-skel sp-skel-line" style={{ width: '22%' }} />
                        <div className="sp-skel sp-skel-line" style={{ width: '80%' }} />
                        <div className="sp-skel sp-skel-line" style={{ width: '55%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <div className="sp-comments-empty">
                  <div className="sp-comments-empty-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                  </div>
                  <p className="sp-comments-empty-title">No comments yet</p>
                  <p className="sp-comments-empty-sub">Be the first to share your experience with this prompt.</p>
                </div>
              ) : (
                comments.map((c, idx) => {
                  const isOwn = user?.id === c.user_id
                  const isDeleting = deleteConfirm === c.id
                  return (
                    <div
                      key={c.id}
                      className={`sp-comment ${isOwn ? 'sp-comment-own' : ''}`}
                      style={{ animationDelay: `${idx * 0.04}s` }}
                    >
                      <div className="sp-comment-avatar-wrap">
                        <div
                          className="sp-comment-avatar"
                          style={{ background: c.avatar_color || '#1A6BFF' }}
                        >
                          {c.author_name?.[0]?.toUpperCase() || '?'}
                        </div>
                      </div>
                      <div className="sp-comment-body">
                        <div className="sp-comment-meta">
                          <span className="sp-comment-author">{c.author_name || 'Anonymous'}</span>
                          {isOwn && <span className="sp-comment-you-badge">you</span>}
                          <span className="sp-comment-dot">·</span>
                          <span className="sp-comment-time">{timeAgo(c.created_at)}</span>
                          {isOwn && (
                            <button
                              className={`sp-comment-delete ${isDeleting ? 'confirming' : ''}`}
                              onClick={() => handleDeleteComment(c.id)}
                            >
                              {isDeleting ? 'Confirm delete' : 'Delete'}
                            </button>
                          )}
                          {isDeleting && (
                            <button className="sp-comment-cancel" onClick={() => setDeleteConfirm(null)}>
                              Cancel
                            </button>
                          )}
                        </div>
                        <p className="sp-comment-text">{c.body}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

        </div>

        {/* ── SIDEBAR ── */}
        <aside className="sp-sidebar">

          {/* CTA card */}
          <div className="sp-card sp-cta-card">
            {user ? (
              <>
                <button className="sp-cta-btn" onClick={handleCopyPrompt}>
                  {copied
                    ? <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg> Copied!</>
                    : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg> Copy prompt</>
                  }
                </button>
                <p className="sp-cta-hint">Paste into {toolLabel} to get started</p>
              </>
            ) : (
              <>
                <p className="sp-cta-tagline">Get the full prompt</p>
                <button className="sp-cta-btn" onClick={onSignIn}>Sign in — it's free →</button>
                <p className="sp-cta-hint">Access every prompt in the gallery</p>
              </>
            )}
          </div>

          {/* Site details */}
          <div className="sp-card">
            <h3 className="sp-card-title">Site details</h3>
            <div className="sp-detail-row">
              <span className="sp-detail-label">Tool</span>
              <span className="sp-tool-chip" style={{ background: toolColor }}>{toolLabel}</span>
            </div>
            {ratingCount > 0 && (
              <div className="sp-detail-row">
                <span className="sp-detail-label">Rating</span>
                <span className="sp-detail-val sp-detail-rating">
                  <span className="sp-detail-star">★</span>
                  {avgRating.toFixed(1)}
                  <span className="sp-detail-rcount">({ratingCount})</span>
                </span>
              </div>
            )}
            {tags[0] && <div className="sp-detail-row"><span className="sp-detail-label">Category</span><span className="sp-detail-val">{tags[0]}</span></div>}
            {site.font_style && <div className="sp-detail-row"><span className="sp-detail-label">Font</span><span className="sp-detail-val">{site.font_style}</span></div>}
            {site.layout_style && <div className="sp-detail-row"><span className="sp-detail-label">Layout</span><span className="sp-detail-val">{site.layout_style}</span></div>}
            <div className="sp-detail-row"><span className="sp-detail-label">Author</span><span className="sp-detail-val">{authorName}</span></div>
            {site.github_url && <div className="sp-detail-row"><span className="sp-detail-label">GitHub</span><a href={site.github_url} target="_blank" rel="noreferrer" className="sp-detail-link">View →</a></div>}
            {site.url && <div className="sp-detail-row"><span className="sp-detail-label">Live site</span><a href={site.url} target="_blank" rel="noreferrer" className="sp-detail-link">Visit →</a></div>}
          </div>

          {/* User activity — shows when signed in */}
          {user && (userRating > 0 || userCommentCount > 0) && (
            <div className="sp-card sp-activity-card">
              <h3 className="sp-card-title">Your activity</h3>
              {userRating > 0 && (
                <div className="sp-activity-row">
                  <span className="sp-activity-icon sp-activity-rating">★</span>
                  <div>
                    <p className="sp-activity-label">Rated this prompt</p>
                    <div className="sp-activity-stars">
                      {[1, 2, 3, 4, 5].map(n => (
                        <span key={n} className={`sp-activity-star ${n <= userRating ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {userCommentCount > 0 && (
                <div className="sp-activity-row">
                  <span className="sp-activity-icon sp-activity-comment">💬</span>
                  <div>
                    <p className="sp-activity-label">Posted {userCommentCount} comment{userCommentCount > 1 ? 's' : ''}</p>
                    <p className="sp-activity-sub">Scroll down to see your comments</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="sp-card">
              <h3 className="sp-card-title">Tags</h3>
              <div className="sp-sidebar-tags">
                {tags.map(t => <span key={t} className="sp-sidebar-tag">#{t}</span>)}
              </div>
            </div>
          )}

          {/* Tech stack */}
          {techStack.length > 0 && (
            <div className="sp-card">
              <h3 className="sp-card-title">Tech stack</h3>
              <div className="sp-sidebar-chips">
                {techStack.map(t => <span key={t} className="sp-sidebar-chip">{t}</span>)}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="sp-card">
            <h3 className="sp-card-title">Share</h3>
            <div className="sp-share-row">
              <button className="sp-share-btn" onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check out "${site.title}" on PromptHall — ${window.location.href}`, '_blank')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                Share on X
              </button>
              <button className="sp-share-btn" onClick={handleCopyLink}>
                {linkCopied
                  ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg> Copied!</>
                  : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg> Copy link</>
                }
              </button>
            </div>
          </div>

        </aside>
      </div>
    </div>
  )
}