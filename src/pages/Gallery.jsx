import { useState, useEffect, useMemo, useRef } from 'react'
import { supabase } from '../supabase'
import FilterBar from '../components/FilterBar'
import GalleryCard from '../components/GalleryCard'
import './Gallery.css'

// ── Real tool website links ──────────────────────────────────────
const TOOL_LINKS = {
  'Cursor':         'https://cursor.com',
  'Bolt':           'https://bolt.new',
  'v0':             'https://v0.dev',
  'Lovable':        'https://lovable.dev',
  'Replit':         'https://replit.com',
  'Windsurf':       'https://codeium.com/windsurf',
  'GitHub Copilot': 'https://github.com/features/copilot',
  'Claude':         'https://claude.ai',
  'ChatGPT':        'https://chatgpt.com',
  'Gemini':         'https://gemini.google.com',
  'Codeium':        'https://codeium.com',
  'Zed AI':         'https://zed.dev',
  'Cline':          'https://cline.bot',
  'Aider':          'https://aider.chat',
  'Continue':       'https://continue.dev',
}

// ── Comprehensive smart synonym map ─────────────────────────────
const SYNONYM_MAP = {
  cursor:    ['cursor', 'ai editor', 'code editor', 'vs code ai', 'coding tool'],
  bolt:      ['bolt', 'bolt new', 'stackblitz', 'instant deploy'],
  v0:        ['v0', 'vercel ai', 'shadcn ai', 'component generator'],
  lovable:   ['lovable', 'gpt engineer', 'ai builder', 'no code ai'],
  replit:    ['replit', 'replitai', 'browser ide', 'online coding'],
  windsurf:  ['windsurf', 'codeium editor', 'ai flow', 'cascade'],
  copilot:   ['copilot', 'github copilot', 'microsoft ai', 'code suggestion'],
  claude:    ['claude', 'anthropic', 'sonnet', 'opus'],
  chatgpt:   ['chatgpt', 'gpt', 'openai', 'gpt4', 'gpt-4'],
  gemini:    ['gemini', 'google ai', 'bard', 'google bard'],
  codeium:   ['codeium', 'free copilot', 'ai autocomplete'],
  zed:       ['zed', 'zed ai', 'fast editor'],
  cline:     ['cline', 'claude cline', 'vscode agent'],
  aider:     ['aider', 'terminal ai', 'git ai', 'command line ai'],
  continue:  ['continue', 'open source copilot', 'local ai'],
  react:     ['react', 'reactjs', 'react.js', 'jsx', 'hooks', 'component'],
  nextjs:    ['next', 'nextjs', 'next.js', 'server side', 'ssr', 'vercel'],
  vue:       ['vue', 'vuejs', 'vue.js', 'nuxt'],
  nuxt:      ['nuxt', 'nuxtjs', 'vue ssr'],
  svelte:    ['svelte', 'sveltekit', 'svelte kit'],
  astro:     ['astro', 'astrojs', 'islands architecture'],
  remix:     ['remix', 'remixjs', 'full stack react'],
  angular:   ['angular', 'angularjs', 'typescript framework'],
  tailwind:  ['tailwind', 'tailwindcss', 'utility css', 'utility first'],
  nodejs:    ['node', 'nodejs', 'node.js', 'express', 'backend'],
  express:   ['express', 'expressjs', 'node backend', 'rest api'],
  fastapi:   ['fastapi', 'fast api', 'python api', 'python backend'],
  django:    ['django', 'python web', 'django rest'],
  laravel:   ['laravel', 'php', 'blade'],
  rails:     ['rails', 'ruby on rails', 'ruby'],
  supabase:  ['supabase', 'postgres', 'postgresql', 'realtime db', 'auth'],
  firebase:  ['firebase', 'firestore', 'google firebase', 'realtime database'],
  pocketbase:['pocketbase', 'pocket base', 'self hosted'],
  vercel:    ['vercel', 'edge functions', 'deployment', 'serverless'],
  netlify:   ['netlify', 'netlify deploy', 'jamstack'],
  cloudflare:['cloudflare', 'workers', 'pages', 'cdn'],
  business:  ['business', 'company', 'corporate', 'enterprise', 'agency', 'firm', 'brand'],
  sports:    ['sports', 'sport', 'gym', 'fitness', 'workout', 'training', 'team', 'athlete'],
  food:      ['food', 'restaurant', 'cafe', 'dining', 'menu', 'delivery', 'meal', 'eat', 'recipe', 'cuisine'],
  saas:      ['saas', 'software', 'tool', 'platform', 'app', 'product', 'subscription', 'dashboard'],
  portfolio: ['portfolio', 'showcase', 'personal', 'resume', 'cv', 'work', 'projects', 'designer', 'developer'],
  ecommerce: ['ecommerce', 'e-commerce', 'shop', 'store', 'marketplace', 'retail', 'selling', 'buy', 'product'],
  blog:      ['blog', 'article', 'post', 'writing', 'content', 'news', 'newsletter', 'publication'],
  booking:   ['booking', 'reservation', 'appointment', 'schedule', 'calendar', 'book', 'slot'],
  social:    ['social', 'community', 'network', 'chat', 'forum', 'connect', 'profile', 'feed'],
  education: ['education', 'learning', 'course', 'school', 'teach', 'tutorial', 'study', 'lms', 'class'],
  event:     ['event', 'events', 'conference', 'meetup', 'ticket', 'concert', 'webinar'],
  startup:   ['startup', 'launch', 'product hunt', 'mvp', 'venture', 'pitch'],
  finance:   ['finance', 'money', 'banking', 'payment', 'fintech', 'crypto', 'invest', 'wallet', 'budget', 'trading'],
  health:    ['health', 'medical', 'clinic', 'doctor', 'wellness', 'mental health', 'therapy', 'hospital'],
  travel:    ['travel', 'trip', 'tour', 'vacation', 'hotel', 'flight', 'airbnb', 'tourism'],
  gaming:    ['gaming', 'game', 'gamer', 'esports', 'leaderboard', 'arcade'],
  realestate:['real estate', 'property', 'housing', 'rental', 'rent', 'mortgage', 'realtor', 'listing'],
  minimal:   ['minimal', 'clean', 'simple', 'whitespace', 'light'],
  dark:      ['dark', 'dark mode', 'night', 'black'],
  bold:      ['bold', 'maximalist', 'colorful', 'vibrant'],
  glassmorphism:['glass', 'glassmorphism', 'blur', 'frosted', 'transparency'],
  brutalist: ['brutalist', 'brutalism', 'raw', 'stark'],
  retro:     ['retro', 'vintage', 'nostalgic', 'old school', '80s', '90s'],
  editorial: ['editorial', 'magazine', 'newspaper', 'typographic'],
  dashboard: ['dashboard', 'analytics', 'admin', 'metrics', 'chart', 'data'],
  landing:   ['landing', 'landing page', 'marketing', 'hero section'],
  prompt:    ['prompt', 'ai prompt', 'generated', 'vibe coded', 'vibe code', 'ai built'],
  design:    ['design', 'ui', 'ux', 'interface', 'visual', 'layout', 'style'],
  animation: ['animation', 'animated', 'motion', 'scroll', 'transition', 'interaction'],
  mobile:    ['mobile', 'responsive', 'pwa', 'app', 'ios', 'android'],
  api:       ['api', 'integration', 'webhook', 'rest', 'graphql'],
  ai:        ['ai', 'artificial intelligence', 'machine learning', 'ml', 'gpt', 'llm'],
}

function expandQuery(q) {
  const words = q.toLowerCase().trim().split(/\s+/)
  const expanded = new Set(words)
  expanded.add(q.toLowerCase().trim())

  words.forEach(w => {
    if (SYNONYM_MAP[w]) {
      SYNONYM_MAP[w].forEach(s => expanded.add(s))
    }
  })

  return Array.from(expanded)
}

// ── Scrolling prompt rows ────────────────────────────────────────
const PROMPT_ROWS = [
  ['Build me a SaaS landing page with animated hero, pricing table, and dark mode','Create a restaurant website with online booking, menu gallery, and contact form','Design a startup pitch page with scroll animations and investor-ready layout','Make a modern e-commerce store with product cards, cart, and checkout flow','Build a personal portfolio with case studies, skills section, and blog'],
  ['Create a fintech dashboard with real-time charts, transaction history, and wallet UI','Build a social media app UI with feed, profiles, stories, and DMs','Design an education platform with course cards, progress bars, and video player','Make a real estate listing site with map integration and property filters','Create a health and wellness app with habit tracker and mood logging'],
  ['Build a job board with company profiles, search filters, and application flow','Design a travel booking platform with destination cards and itinerary builder','Create a gaming leaderboard site with live scores and player profiles','Make a crypto portfolio tracker with live prices and performance charts','Build an event ticketing platform with seat selection and QR code generation'],
  ['Design a brutalist portfolio that breaks every design rule intentionally','Create a glassmorphism dashboard with blur effects and neon accents','Build an editorial magazine layout with bold typography and full-bleed images','Make a dark-mode SaaS app with sidebar navigation and data visualizations','Create a minimal agency site with whitespace, clean grid, and hover effects'],
]

// ── Real blog posts ──────────────────────────────────────────────
// Images live in /public — referenced as '/blog (N).png'
const BLOG_POSTS = [
  {
    id: 1,
    tag: 'Opinion',
    title: 'The Future of No-Code Is Prompts, Not Drag-and-Drop',
    date: 'Apr 24, 2025',
    read: '2 min read',
    href: 'https://medium.com/@prompthall/the-future-of-no-code-is-prompts-not-drag-and-drop-f52db6fea790',
    img: '/blog (3).png',
    color: '#7C3AED',
  },
  {
    id: 2,
    tag: 'Deep Dive',
    title: 'The Vibe Coding Revolution: A Deep Dive Into the Future of Building on the Web',
    date: 'Apr 24, 2025',
    read: '5 min read',
    href: 'https://medium.com/@prompthall/the-vibe-coding-revolution-a-deep-dive-into-the-future-of-building-on-the-web-c3f3163c5030',
    img: '/blog (2).png',
    color: '#1A6BFF',
  },
  {
    id: 3,
    tag: 'Tutorial',
    title: 'How to Write Prompts That Actually Build Full Apps',
    date: 'Apr 25, 2025',
    read: '2 min read',
    href: 'https://medium.com/@prompthall/how-to-write-prompts-that-actually-build-full-apps-1507eb5a01a4',
    img: '/blog (1).png',
    color: '#059669',
  },
]

// ── Font & Color of the Day ──────────────────────────────────────
const FONT_OF_DAY = {
  name: 'Fraunces',
  category: 'Display Serif',
  url: 'https://fonts.google.com/specimen/Fraunces',
  use: 'Hero headlines, editorial pull quotes, anything that needs gravitas with personality.',
  avoid: 'Body copy, small UI labels — it needs space to breathe.',
  personality: 'Optical, quirky, slow and confident. Fraunces says "I was designed, not generated."',
  sample: 'The prompt behind the pixel.',
}

const COLOR_OF_DAY = {
  hex: '#2D6AFF',
  name: 'Signal Blue',
  rgb: '45, 106, 255',
  use: 'Primary CTAs, interactive states, brand accents on white or very light backgrounds.',
  avoid: 'Dark backgrounds without adjustment — increase lightness to ~60% first.',
  mood: 'Trust, momentum, digital-native. The colour every SaaS reaches for — use it intentionally.',
  pairsWith: ['#0A0A0A', '#F8FAFF', '#FFFFFF', '#FFD166'],
}

// ── Tutorial videos ──────────────────────────────────────────────
const TUTORIALS = [
  { id: 1, title: 'How to Vibe Code Your First Website from Scratch', desc: 'A complete walkthrough — from prompt to deployed site in under an hour.', videoId: 'OVucTZZsiQI' },
  { id: 2, title: 'Prompt Engineering for Better UI: Colors, Layout & Typography', desc: 'Learn exactly how to describe your design to get premium-looking results every time.', videoId: 'htiaUaOoEH0' },
  { id: 3, title: 'Best AI Website Builder 2026 (My TOP Recommendation)', desc: 'I tested the best AI website builders of 2026 to see which ones actually make it faster and easier to launch a great-looking site.', videoId: '85HgbG2dRAg' },
]

const SUGGESTIONS = ['saas', 'dashboard', 'portfolio', 'landing page', 'e-commerce', 'ai tool', 'marketplace', 'blog', 'booking', 'cursor', 'bolt', 'v0', 'react', 'next.js', 'tailwind', 'dark mode', 'minimal', 'startup']

const CARDS_PER_PAGE = 10

// ── Flip-clock word cycler ───────────────────────────────────────
// Each word shown in a different premium Google Font
const FLIP_WORDS = [
  { word: 'Choose',   font: "'Fraunces', serif",           style: 'italic' },
  { word: 'Choose',   font: "'Playfair Display', serif",   style: 'normal' },
  { word: 'Choose',   font: "'Space Grotesk', sans-serif", style: 'normal' },
  { word: 'Choose',   font: "'DM Serif Display', serif",   style: 'italic' },
  { word: 'Choose',   font: "'Cormorant Garamond', serif", style: 'italic' },
  { word: 'Choose',   font: "'Cabinet Grotesk', sans-serif", style: 'normal' },
]

function FlipWord() {
  const [index, setIndex] = useState(0)
  const [flipping, setFlipping] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setFlipping(true)
      setTimeout(() => {
        setIndex(i => (i + 1) % FLIP_WORDS.length)
        setFlipping(false)
      }, 300)
    }, 2000)
    return () => clearInterval(t)
  }, [])

  const current = FLIP_WORDS[index]
  return (
    <span
      className={`flip-word ${flipping ? 'flipping' : ''}`}
      style={{
        fontFamily: current.font,
        fontStyle: current.style,
        color: 'var(--accent)',
        display: 'inline-block',
      }}
    >
      {current.word}
    </span>
  )
}

// ── Scroll observer hook ─────────────────────────────────────────
function useInView(ref, threshold = 0.12) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return inView
}

export default function Gallery({ onViewSite, onSubmit, onSignIn, onSignOut, onAdmin, user, isAdmin }) {
  const [query, setQuery]           = useState('')
  const [activeTool, setActiveTool] = useState('all')
const [activeCategory, setActiveCategory] = useState('all')
  const [sites, setSites]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [sliderIndex, setSliderIndex] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused]   = useState(false)
  const [copiedId, setCopiedId] = useState(null)
const [limitReached, setLimitReached] = useState(false)
  const [tutPlaying, setTutPlaying] = useState({})
  const [currentPage, setCurrentPage] = useState(1)

  const searchRef   = useRef(null)
  const blogRef     = useRef(null)
  const tutorialRef = useRef(null)
  const galleryRef  = useRef(null)
  const submitRef   = useRef(null)
  const featuredRef = useRef(null)
  const inspireRef  = useRef(null)
  const galleryTopRef = useRef(null)

  const blogInView     = useInView(blogRef)
  const tutorialInView = useInView(tutorialRef)
  const galleryInView  = useInView(galleryRef)
  const submitInView   = useInView(submitRef)
  const featuredInView = useInView(featuredRef)
  const inspireInView  = useInView(inspireRef)

  useEffect(() => {
    async function fetchSites() {
      const { data, error } = await supabase
        .from('sites').select('*').eq('approved', true).order('created_at', { ascending: false })
      if (!error && data) setSites(data)
      setLoading(false)
    }
    fetchSites()
  }, [])

  const featured = useMemo(() => [...sites].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5), [sites])

  const filtered = useMemo(() => {
  let result = sites
  if (activeTool !== 'all') result = result.filter(s => s.tool === activeTool)
  if (activeCategory !== 'all') result = result.filter(s =>
    (s.category || '').toLowerCase() === activeCategory.toLowerCase()
  )

  if (query.trim()) {
    const q = query.toLowerCase().trim()
    result = result.filter(s => {
      return (
        (s.title        || '').toLowerCase().includes(q) ||
        (s.description  || '').toLowerCase().includes(q) ||
        (s.category     || '').toLowerCase().includes(q) ||
        (s.tool         || '').toLowerCase().includes(q) ||
        (s.author_name  || '').toLowerCase().includes(q) ||
        (s.prompt       || '').toLowerCase().includes(q) ||
        (s.tags         || []).some(t => t.toLowerCase().includes(q)) ||
        (s.tech_stack   || []).some(t => t.toLowerCase().includes(q))
      )
    })
  }

  return result
}, [sites, activeTool, activeCategory, query])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE))
  const pageSites  = filtered.slice((currentPage - 1) * CARDS_PER_PAGE, currentPage * CARDS_PER_PAGE)

  // Reset page when filter/query changes
  useEffect(() => { setCurrentPage(1) }, [query, activeTool, activeCategory]) // eslint-disable-line react-hooks/exhaustive-deps

  function goToPage(p) {
    setCurrentPage(p)
    galleryTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const suggestionsFiltered = useMemo(() => {
    if (!query.trim()) return SUGGESTIONS
    return SUGGESTIONS.filter(s => s.includes(query.toLowerCase()))
  }, [query])

  useEffect(() => {
    if (featured.length < 2) return
    const t = setInterval(() => setSliderIndex(i => (i + 1) % featured.length), 4500)
    return () => clearInterval(t)
  }, [featured.length])

  useEffect(() => {
    let lastScroll = 0
    const handleScroll = () => {
      const nav = document.getElementById('navbar')
      const btn = document.getElementById('back-to-top')
      const curr = window.scrollY
      if (curr > lastScroll && curr > 80) nav?.classList.add('hidden')
      else nav?.classList.remove('hidden')
      lastScroll = curr
      if (curr > 400) btn?.classList.add('visible')
      else btn?.classList.remove('visible')
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleCopyPrompt(site) {
  if (!user) { onSignIn(); return }

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('prompt_unlocks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('unlocked_at', startOfDay.toISOString())

  if (count >= 76) { setLimitReached(true); return }

  const { data: existing } = await supabase
    .from('prompt_unlocks')
    .select('id')
    .eq('user_id', user.id)
    .eq('site_id', site.id)
    .maybeSingle()

  if (!existing) {
    await supabase.from('prompt_unlocks').insert({
      user_id: user.id,
      site_id: site.id,
    })
  }

  navigator.clipboard.writeText(site.prompt)
  setCopiedId(site.id)
  setTimeout(() => setCopiedId(null), 2000)
}

  const isSearching = query.trim().length > 0

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav id="navbar" className="navbar">
        <a href="/" className="nav-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#1A6BFF"/>
            <path d="M8 10h10v2H8zM8 15h14v2H8zM8 20h8v2H8z" fill="white"/>
            <circle cx="24" cy="22" r="4" fill="white"/>
          </svg>
          <span className="nav-logo-text">PROMPT<span>HALL</span></span>
        </a>

        <div className="nav-search-wrap" ref={searchRef}>
          <svg className="nav-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input className="nav-search-input" placeholder="Search tools, stacks, categories..." value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setSearchFocused(true)} />
          {query && <button className="nav-search-clear" onClick={() => setQuery('')}>✕</button>}
          {searchFocused && suggestionsFiltered.length > 0 && (
            <div className="nav-suggestions">
              {suggestionsFiltered.slice(0, 8).map(s => (
                <button key={s} className="nav-suggestion-item" onMouseDown={() => { setQuery(s); setSearchFocused(false) }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="nav-actions">
          <a href="https://www.youtube.com/@olajobihaneef" target="_blank" rel="noreferrer" className="nav-tutorial-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.8 12 2.8 12 2.8s-4.2 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.5 21.7 12 21.7 12 21.7s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/></svg>
            Tutorials
          </a>
          {user ? (
            <>
              <span className="nav-user">{user.user_metadata?.full_name?.split(' ')[0] || 'Account'}</span>
              <button className="nav-btn-ghost" onClick={onSignOut}>Sign out</button>
              {isAdmin && <button className="nav-btn-ghost" onClick={onAdmin}>Admin</button>}
            </>
          ) : (
            <button className="nav-btn-ghost" onClick={onSignIn}>Sign in</button>
          )}
          <button className="nav-btn-primary" onClick={onSubmit}>+ Submit site</button>
          <button className="nav-mobile-toggle" onClick={() => setMobileMenuOpen(o => !o)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="nav-mobile-menu">
          <div className="mobile-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <a href="https://www.youtube.com/@olajobihaneef" target="_blank" rel="noreferrer" className="mobile-link">Tutorials</a>
          {user ? (
            <>
              <span className="mobile-user">{user.user_metadata?.full_name || user.email}</span>
              <button className="mobile-link" onClick={() => { onSignOut(); setMobileMenuOpen(false) }}>Sign out</button>
              {isAdmin && <button className="mobile-link" onClick={() => { onAdmin(); setMobileMenuOpen(false) }}>Admin</button>}
            </>
          ) : (
            <button className="mobile-link" onClick={() => { onSignIn(); setMobileMenuOpen(false) }}>Sign in</button>
          )}
          <button className="mobile-submit" onClick={() => { onSubmit(); setMobileMenuOpen(false) }}>+ Submit site</button>
        </div>
      )}

      <main>

        {/* ── HERO ── */}
        {!isSearching && (
          <section className="hero-text-section">
            <div className="hero-prompt-bg" aria-hidden="true">
              {PROMPT_ROWS.map((row, ri) => (
                <div key={ri} className={`prompt-row prompt-row--${ri % 2 === 0 ? 'left' : 'right'}`} style={{ '--row-speed': `${55 + ri * 18}s` }}>
                  <div className="prompt-track">
                    {[...row, ...row].map((p, i) => <span key={i} className="prompt-chip">{p}</span>)}
                  </div>
                </div>
              ))}
              <div className="hero-bg-fade-left" /><div className="hero-bg-fade-right" />
              <div className="hero-bg-fade-top"  /><div className="hero-bg-fade-bottom"/>
            </div>

            <div className="hero-text-inner">
              <div className="hero-eyebrow">Used by 100+ vibe coders worldwide</div>
              <h1 className="hero-headline">
                <div className="hero-curtain-row">
                  <span className="curtain-left">Stop</span>
                  <span className="curtain-right">guessing.</span>
                </div>
                <div className="hero-curtain-row hero-curtain-row--2">
                  {/* Flip-clock word cycling through premium fonts */}
                  <FlipWord />
                  <span className="curtain-right-static">the prompt.</span>
                </div>
              </h1>
              <p className="hero-sub">
                Every site here was built with AI. Every prompt is unlockable. Browse, get inspired, and build something better — faster than you ever thought possible.
              </p>
              <div className="hero-actions">
                <button className="hero-cta-primary" onClick={onSubmit}>Submit your site →</button>
                <button className="hero-cta-ghost" onClick={onSignIn}>Get free access</button>
              </div>
              <div className="hero-stats">
                <div className="hero-stat"><strong>{sites.length}+</strong><span>Sites</span></div>
                <div className="hero-stat-divider" />
                <div className="hero-stat"><strong>100%</strong><span>Real prompts</span></div>
                <div className="hero-stat-divider" />
                <div className="hero-stat"><strong>Free</strong><span>To browse</span></div>
              </div>
            </div>
          </section>
        )}

        {/* ── FEATURED SLIDER ── */}
        {!isSearching && (
          <section className={`featured-section reveal-section ${featuredInView ? 'in-view' : ''}`} ref={featuredRef}>
            <div className="featured-label">Featured Sites</div>
            {loading ? <div className="featured-skeleton" /> : featured.length === 0 ? (
              <div className="featured-empty"><p>No featured sites yet.</p></div>
            ) : (
              <div className="featured-slider">
                <div className="featured-track" style={{ transform: `translateX(-${sliderIndex * 100}%)` }}>
                  {featured.map(site => (
                    <div key={site.id} className="featured-slide" onClick={() => onViewSite(site)}>
                      {site.screenshot_url ? <img src={site.screenshot_url} alt={site.title} className="featured-img" /> : <div className="featured-placeholder">{site.title?.toUpperCase()}</div>}
                      <div className="featured-overlay">
                        <div className="featured-meta">
                          <span className="featured-tool-badge">{site.tool}</span>
                          <h2 className="featured-title">{site.title}</h2>
                          <p className="featured-desc">{site.description}</p>
                          <div className="featured-ctas">
                            <button className="featured-btn-visit" onClick={e => { e.stopPropagation(); window.open(site.url, '_blank') }}>Visit site ↗</button>
                            <button className="featured-btn-view" onClick={e => { e.stopPropagation(); if (!user) { onSignIn(); return } navigator.clipboard.writeText(site.prompt); setCopiedId(site.id); setTimeout(() => setCopiedId(null), 2000) }}>
                              {copiedId === site.id ? '✓ Copied!' : 'Copy prompt'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="featured-dots">{featured.map((_, i) => <button key={i} className={`featured-dot${i === sliderIndex ? ' active' : ''}`} onClick={() => setSliderIndex(i)} />)}</div>
                <button className="featured-arrow left" onClick={() => setSliderIndex(i => (i - 1 + featured.length) % featured.length)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
                <button className="featured-arrow right" onClick={() => setSliderIndex(i => (i + 1) % featured.length)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>
              </div>
            )}
          </section>
        )}

        {/* ── FILTER + GALLERY ── */}
        <section className={`gallery-section reveal-section ${galleryInView ? 'in-view' : ''}`} ref={galleryRef}>
          <div ref={galleryTopRef} style={{ scrollMarginTop: '80px' }} />
          {isSearching && (
            <div className="search-results-header">
              <p>Results for <strong>"{query}"</strong> — {filtered.length} sites found</p>
              <button onClick={() => setQuery('')}>Clear search ✕</button>
            </div>
          )}
          <FilterBar
  activeTool={activeTool}
  onFilter={setActiveTool}
  activeCategory={activeCategory}
  onCategoryFilter={setActiveCategory}
/>
          <p className="results-meta">Showing <strong>{pageSites.length}</strong> of <strong>{filtered.length}</strong> sites</p>
          {loading ? (
            <div className="skeleton-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img" style={{ height: '220px' }} />
                  <div className="skeleton-body">
                    <div className="skeleton-line" style={{ width: '70%' }} />
                    <div className="skeleton-line" style={{ width: '90%' }} />
                    <div className="skeleton-line" style={{ width: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="gallery">
              <div className="empty-state">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <p>No sites found. Try a different search.</p>
                <button className="empty-cta" onClick={onSubmit}>Submit the first one →</button>
              </div>
            </div>
          ) : (
            <>
              <div className="gallery">
                {pageSites.map((site, i) => (
                  <div key={site.id} className="gallery-card-wrapper" style={{ '--card-delay': `${(i % 10) * 0.05}s` }}>
                    <GalleryCard
                      site={site} index={i}
                      onView={() => onViewSite(site)}
                      onSignIn={onSignIn} user={user}
                      onCopyPrompt={() => handleCopyPrompt(site)}
                      copied={copiedId === site.id}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination — shows whenever there are cards */}
              {filtered.length > 0 && (
                <div className="pagination">
                  <button
                    className="page-btn page-btn--nav"
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    Prev
                  </button>

                  <div className="page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                      const show = p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
                      if (!show) {
                        if (p === currentPage - 2 || p === currentPage + 2) return <span key={p} className="page-ellipsis">…</span>
                        return null
                      }
                      return (
                        <button key={p} className={`page-btn ${p === currentPage ? 'active' : ''}`} onClick={() => goToPage(p)}>
                          {p}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    className="page-btn page-btn--nav"
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    Next
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </button>

                  <p className="pagination-info">
                    Page {currentPage} of {totalPages} · {filtered.length} sites total
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {/* ── FONT & COLOR OF THE DAY ── */}
        {!isSearching && (
          <section className={`inspire-section ${inspireInView ? 'in-view' : ''}`} ref={inspireRef}>
            <div className="inspire-header">
              <div>
                <p className="section-eyebrow">Daily design intel</p>
                <h2 className="section-title">Font &amp; Color of the Day.</h2>
              </div>
              <p className="inspire-subline">Two things every builder should know today.</p>
            </div>

            <div className="inspire-grid">
              {/* Font panel */}
              <div className="inspire-panel inspire-panel--font">
                <div className="inspire-tag">Font of the Day</div>
                <div className="inspire-font-sample" style={{ fontFamily: FONT_OF_DAY.name + ', serif' }}>
                  {FONT_OF_DAY.sample}
                </div>
                <div className="inspire-panel-name">
                  {FONT_OF_DAY.name}
                  <span className="inspire-panel-category">{FONT_OF_DAY.category}</span>
                </div>
                <div className="inspire-facts">
                  <div className="inspire-fact">
                    <span className="inspire-fact-label">Best for</span>
                    <span className="inspire-fact-val">{FONT_OF_DAY.use}</span>
                  </div>
                  <div className="inspire-fact">
                    <span className="inspire-fact-label">Avoid</span>
                    <span className="inspire-fact-val">{FONT_OF_DAY.avoid}</span>
                  </div>
                  <div className="inspire-fact">
                    <span className="inspire-fact-label">Personality</span>
                    <span className="inspire-fact-val">{FONT_OF_DAY.personality}</span>
                  </div>
                </div>
                <a href={FONT_OF_DAY.url} target="_blank" rel="noreferrer" className="inspire-link">
                  View on Google Fonts →
                </a>
              </div>

              {/* Color panel */}
              <div className="inspire-panel inspire-panel--color">
                <div className="inspire-tag">Color of the Day</div>
                <div className="inspire-color-swatch">
                  <div className="inspire-swatch-main" style={{ background: COLOR_OF_DAY.hex }} />
                  <div className="inspire-swatch-pairs">
                    {COLOR_OF_DAY.pairsWith.map(c => (
                      <div key={c} className="inspire-swatch-pair" style={{ background: c }} title={c} />
                    ))}
                  </div>
                </div>
                <div className="inspire-panel-name">
                  {COLOR_OF_DAY.name}
                  <span className="inspire-panel-category">{COLOR_OF_DAY.hex} · rgb({COLOR_OF_DAY.rgb})</span>
                </div>
                <div className="inspire-facts">
                  <div className="inspire-fact">
                    <span className="inspire-fact-label">Best for</span>
                    <span className="inspire-fact-val">{COLOR_OF_DAY.use}</span>
                  </div>
                  <div className="inspire-fact">
                    <span className="inspire-fact-label">Avoid</span>
                    <span className="inspire-fact-val">{COLOR_OF_DAY.avoid}</span>
                  </div>
                  <div className="inspire-fact">
                    <span className="inspire-fact-label">Mood</span>
                    <span className="inspire-fact-val">{COLOR_OF_DAY.mood}</span>
                  </div>
                </div>
                <div className="inspire-pair-label">Pairs beautifully with</div>
                <div className="inspire-pair-chips">
                  {COLOR_OF_DAY.pairsWith.map(c => (
                    <span key={c} className="inspire-pair-chip" style={{ background: c, color: c === '#F8FAFF' || c === '#FFFFFF' ? '#000' : '#fff' }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── TUTORIAL SECTION ── */}
        {!isSearching && (
          <section className={`tutorial-section ${tutorialInView ? 'in-view' : ''}`} ref={tutorialRef}>
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Learn from the best</p>
                <h2 className="section-title">Watch. Learn. Build.</h2>
              </div>
              <a href="https://www.youtube.com/@olajobihaneef" target="_blank" rel="noreferrer" className="section-link">View all videos →</a>
            </div>
            <div className="tutorial-grid">
              {TUTORIALS.map((tut, i) => (
                <div key={tut.id} className="tutorial-card" style={{ '--delay': `${i * 0.14}s` }}>
                  <div className="tutorial-video-wrap">
                    {tutPlaying[tut.id] ? (
                      <iframe className="tutorial-iframe" src={`https://www.youtube.com/embed/${tut.videoId}?autoplay=1&rel=0`} title={tut.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    ) : (
                      <div className="tutorial-thumb" onClick={() => setTutPlaying(p => ({ ...p, [tut.id]: true }))}>
                        <img src={`https://img.youtube.com/vi/${tut.videoId}/maxresdefault.jpg`} alt={tut.title} onError={e => { e.target.style.display = 'none' }} />
                        <div className="tutorial-thumb-scrim"/>
                        <button className="tutorial-play-btn" aria-label="Play">
                          <span className="tutorial-play-ring"/>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 3 }}><path d="M8 5v14l11-7z"/></svg>
                        </button>
                        <span className="tutorial-duration-badge">Video</span>
                      </div>
                    )}
                  </div>
                  <div className="tutorial-card-body">
                    <span className="tutorial-tag">Tutorial</span>
                    <h3 className="tutorial-title">{tut.title}</h3>
                    <p className="tutorial-desc">{tut.desc}</p>
                    <a href={`https://www.youtube.com/watch?v=${tut.videoId}`} target="_blank" rel="noreferrer" className="tutorial-watch-link">Watch on YouTube →</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── BLOG SECTION — 3 real posts ── */}
        {!isSearching && (
          <section className={`blog-section ${blogInView ? 'in-view' : ''}`} ref={blogRef}>
            <div className="section-header">
              <div>
                <p className="section-eyebrow">From the blog</p>
                <h2 className="section-title">Words that build builders.</h2>
              </div>
              <a href="https://medium.com/@prompthall" target="_blank" rel="noreferrer" className="section-link">View all posts →</a>
            </div>
            <div className="blog-grid">
              {BLOG_POSTS.map((post, i) => (
                <a key={post.id} href={post.href} target="_blank" rel="noreferrer" className="blog-card" style={{ '--delay': `${i * 0.1}s`, textDecoration: 'none' }}>
                  <div className="blog-card-img">
                    {/* ── To add a real image: set img: '/your-image.jpg' in BLOG_POSTS above ── */}
                    {post.img
                      ? <img src={post.img} alt={post.title} />
                      : (
                        <div className="blog-img-placeholder" style={{ background: `${post.color}0d` }}>
                          {/* Dashed drop zone — visible signal to add an image */}
                          <div className="blog-img-dropzone" style={{ borderColor: `${post.color}35` }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={post.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                              <rect x="3" y="3" width="18" height="18" rx="2"/>
                              <circle cx="8.5" cy="8.5" r="1.5"/>
                              <polyline points="21 15 16 10 5 21"/>
                            </svg>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: post.color, opacity: 0.7, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                              Add cover image
                            </span>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(0,0,0,0.3)', marginTop: 2 }}>
                              Set img: '/path.jpg' in BLOG_POSTS
                            </span>
                          </div>
                          {/* Medium badge shown on hover */}
                          <div className="blog-medium-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={post.color}><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>
                            Read on Medium
                          </div>
                        </div>
                      )
                    }
                  </div>
                  <div className="blog-card-body">
                    <span className="blog-tag" style={{ color: post.color, background: `${post.color}15` }}>{post.tag}</span>
                    <h3 className="blog-title">{post.title}</h3>
                    <div className="blog-meta">
                      <span>{post.date}</span><span>·</span><span>{post.read}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── SUBMIT CTA ── */}
        {!isSearching && (
          <section className={`submit-section ${submitInView ? 'in-view' : ''}`} ref={submitRef}>
            <div className="submit-inner">
              <div className="submit-glow" />
              <p className="section-eyebrow">Get featured</p>
              <h2 className="submit-title">Submit your website for<br/>visibility and recognition.</h2>
              <p className="submit-desc">Join hundreds of builders showcasing their AI-built sites. Get discovered, get inspired, get credited.</p>
              <button className="submit-cta-btn bouncy" onClick={onSubmit}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Submit your site
              </button>
            </div>
          </section>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="/" className="footer-logo">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#1A6BFF"/>
                <path d="M8 10h10v2H8zM8 15h14v2H8zM8 20h8v2H8z" fill="white"/>
                <circle cx="24" cy="22" r="4" fill="white"/>
              </svg>
              <span className="footer-logo-text">PROMPT<span>HALL</span></span>
            </a>
            <p className="footer-tagline">The best vibe coded sites and the prompts behind them.</p>
          </div>
          <div className="footer-col"><h4>Product</h4><ul><li><a href="#">Gallery</a></li><li><a href="#" onClick={e => { e.preventDefault(); onSubmit() }}>Submit a site</a></li><li><a href="https://medium.com/@prompthall" target="_blank" rel="noreferrer">Blog</a></li><li><a href="#">FAQs</a></li></ul></div>
          <div className="footer-col"><h4>AI Tools</h4><ul>{Object.entries(TOOL_LINKS).slice(0, 6).map(([name, href]) => <li key={name}><a href={href} target="_blank" rel="noreferrer">{name} ↗</a></li>)}</ul></div>
          <div className="footer-col"><h4>More Tools</h4><ul>{Object.entries(TOOL_LINKS).slice(6).map(([name, href]) => <li key={name}><a href={href} target="_blank" rel="noreferrer">{name} ↗</a></li>)}</ul></div>
          <div className="footer-col"><h4>Learn</h4><ul><li><a href="https://www.youtube.com/@olajobihaneef" target="_blank" rel="noreferrer">Tutorials</a></li><li><a href="https://medium.com/@prompthall" target="_blank" rel="noreferrer">Blog</a></li><li><a href="#">Guides</a></li></ul></div>
          <div className="footer-col"><h4>Legal</h4><ul><li><a href="#">Privacy Policy</a></li><li><a href="#">DMCA</a></li><li><a href="#">Cookie Policy</a></li></ul></div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2025 PromptHall. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#">About</a><a href="#">FAQs</a><a href="#">Privacy Policy</a><a href="mailto:prompthall@gmail.com">Contact</a>
          </div>
        </div>
      </footer>

       {/* 
      This is a 
      multi-line comment in JSX 
    */}{limitReached && (
  <div className="limit-backdrop" onClick={() => setLimitReached(false)}>
    <div className="limit-modal" onClick={e => e.stopPropagation()}>
      <div className="limit-icon">⚡</div>
      <h2>Daily limit reached</h2>
      <p>Free accounts can unlock 2 prompts per day. Upgrade to Pro for unlimited access and AI prompt customization.</p>
      <button className="limit-btn-pro">Upgrade to Pro → $9/month</button>
      <button className="limit-btn-ghost" onClick={() => setLimitReached(false)}>Maybe later</button>
    </div>
  </div>
)} 


      <a href="https://wa.me/+2349032829889?text=Hi%2C%20I%20need%20help%20with%20PromptHall"
  target="_blank"
  rel="noreferrer"
  id="whatsapp-btn"
  title="Chat on WhatsApp"
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
</a>
<span className="whatsapp-label">Questions, Suggestions or Complaints? Chat With Us on WhatsApp</span>


      <button id="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} title="Back to top">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
      </button>
    </>
  )
}