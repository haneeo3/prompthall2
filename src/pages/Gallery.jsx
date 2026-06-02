import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import UpgradeModal from '../components/UpgradeModal'
import FilterBar from '../components/FilterBar'
import GalleryCard from '../components/GalleryCard'
import './Gallery.css'
  
function CookieBar() {
  const [visible, setVisible] = useState(() => !localStorage.getItem('ph_cookies_accepted'))

  if (!visible) return null

  function accept() {
    localStorage.setItem('ph_cookies_accepted', '1')
    setVisible(false)
  }

  function manage() {
    localStorage.setItem('ph_cookies_accepted', '1')
    setVisible(false)
    window.open('/cookies', '_blank')
  }

  return (
    <div className="cookie-bar">
      <div className="cookie-bar-inner">
        <div className="cookie-bar-left">
          <span className="cookie-bar-icon">🍪</span>
          <p className="cookie-bar-text">
            We use cookies to improve your experience. By continuing you agree to our{' '}
            <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.
          </p>
        </div>
        <div className="cookie-bar-actions">
          <button className="cookie-btn-manage" onClick={manage}>Manage</button>
          <button className="cookie-btn-accept" onClick={accept}>Accept all</button>
        </div>
      </div>
    </div>
  )
}


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
const ALL_FONTS = [
  { name: 'Fraunces', category: 'Display Serif', url: 'https://fonts.google.com/specimen/Fraunces', use: 'Hero headlines, editorial pull quotes, anything that needs gravitas with personality.', avoid: 'Body copy, small UI labels — it needs space to breathe.', personality: 'Optical, quirky, slow and confident. Fraunces says "I was designed, not generated."', sample: 'The prompt behind the pixel.' },
  { name: 'Playfair Display', category: 'Transitional Serif', url: 'https://fonts.google.com/specimen/Playfair+Display', use: 'Editorial headers, luxury brand sites, magazine-style layouts.', avoid: 'Small sizes — serifs get lost under 16px.', personality: 'Elegant, editorial, timeless. The font that makes everything feel like a fashion magazine.', sample: 'Design is not just what it looks like.' },
  { name: 'Space Grotesk', category: 'Geometric Sans', url: 'https://fonts.google.com/specimen/Space+Grotesk', use: 'Tech products, SaaS dashboards, developer tools.', avoid: 'Long body copy — it can feel mechanical at reading sizes.', personality: 'Technical, confident, slightly quirky. Built for the internet generation.', sample: 'Ship fast. Design faster.' },
  { name: 'DM Serif Display', category: 'High Contrast Serif', url: 'https://fonts.google.com/specimen/DM+Serif+Display', use: 'Landing page heroes, bold statements, premium product pages.', avoid: 'Body text or anything under 24px.', personality: 'Sharp, authoritative, high contrast. Demands attention without shouting.', sample: 'Every pixel has a purpose.' },
  { name: 'Bricolage Grotesque', category: 'Variable Grotesque', url: 'https://fonts.google.com/specimen/Bricolage+Grotesque', use: 'Modern brand sites, creative agency headers, bold CTAs.', avoid: 'Long paragraphs — use a lighter weight companion for body.', personality: 'Expressive, playful structure. Like a Swiss grotesque that went to art school.', sample: 'Build what you can imagine.' },
  { name: 'Cormorant Garamond', category: 'Classical Serif', url: 'https://fonts.google.com/specimen/Cormorant+Garamond', use: 'Luxury, fashion, editorial, anything needing old-world refinement.', avoid: 'Dark backgrounds — thin strokes disappear.', personality: 'Refined, classical, whisper-quiet luxury. It never raises its voice.', sample: 'Craft speaks louder than noise.' },
  { name: 'Syne', category: 'Display Grotesque', url: 'https://fonts.google.com/specimen/Syne', use: 'Creative portfolios, art direction, experimental layouts.', avoid: 'Corporate or conservative contexts — it is deliberately irregular.', personality: 'Irregular, artistic, rule-breaking. Built for designers who color outside the lines.', sample: 'Rules exist to be redesigned.' },
  { name: 'Outfit', category: 'Geometric Sans', url: 'https://fonts.google.com/specimen/Outfit', use: 'App UIs, dashboards, clean product sites.', avoid: 'High-end luxury brands — it is too friendly for that.', personality: 'Friendly, clean, approachable. The DM Sans for people who want something slightly rounder.', sample: 'Good design feels invisible.' },
]

const ALL_COLORS = [
  { hex: '#2D6AFF', name: 'Signal Blue', rgb: '45, 106, 255', use: 'Primary CTAs, interactive states, brand accents on light backgrounds.', avoid: 'Dark backgrounds without lightness adjustment.', mood: 'Trust, momentum, digital-native. The colour every SaaS reaches for.', pairsWith: ['#0A0A0A', '#F8FAFF', '#FFFFFF', '#FFD166'] },
  { hex: '#FF4757', name: 'Vermillion', rgb: '255, 71, 87', use: 'Error states, urgent CTAs, bold accent moments.', avoid: 'Large background areas — it overwhelms quickly.', mood: 'Energy, urgency, passion. Use sparingly for maximum punch.', pairsWith: ['#0A0A0A', '#FFF5F5', '#FFFFFF', '#2D6AFF'] },
  { hex: '#2ED573', name: 'Emerald Pulse', rgb: '46, 213, 115', use: 'Success states, fintech accents, health and wellness brands.', avoid: 'Purple or red heavy palettes — clashes badly.', mood: 'Growth, vitality, go. Nature distilled into a hex code.', pairsWith: ['#0A0A0A', '#F0FFF4', '#FFFFFF', '#1A1A2E'] },
  { hex: '#7C3AED', name: 'Deep Violet', rgb: '124, 58, 237', use: 'AI products, creative tools, premium SaaS.', avoid: 'Warm-toned palettes — fights with oranges and reds.', mood: 'Creative power, mystery, intelligence. The colour of the AI era.', pairsWith: ['#0A0A0A', '#F5F3FF', '#FFFFFF', '#FFD166'] },
  { hex: '#FF6B35', name: 'Ember Orange', rgb: '255, 107, 53', use: 'Bold CTAs, food brands, startup energy.', avoid: 'Blue-heavy designs unless used as pure contrast.', mood: 'Bold, hungry, kinetic. Grabs attention and does not apologize.', pairsWith: ['#0A0A0A', '#FFF8F5', '#FFFFFF', '#1A6BFF'] },
  { hex: '#06B6D4', name: 'Cyan Drift', rgb: '6, 182, 212', use: 'Tech brands, data visualization, modern dashboards.', avoid: 'Warm backgrounds — it needs cool or neutral tones to breathe.', mood: 'Fresh, digital, airy. Like the internet if it had a colour.', pairsWith: ['#0A0A0A', '#F0FDFF', '#FFFFFF', '#7C3AED'] },
  { hex: '#F59E0B', name: 'Solar Amber', rgb: '245, 158, 11', use: 'Warnings, stars, premium badges, warm accents.', avoid: 'White text on this colour — contrast is too low.', mood: 'Warmth, attention, quality. Gold without the pretension.', pairsWith: ['#0A0A0A', '#FFFBEB', '#FFFFFF', '#1A6BFF'] },
  { hex: '#EC4899', name: 'Lovable Pink', rgb: '236, 72, 153', use: 'Creative brands, beauty, bold personality statements.', avoid: 'Red-heavy palettes — they fight each other.', mood: 'Playful, bold, unapologetic. Joy at full saturation.', pairsWith: ['#0A0A0A', '#FDF2F8', '#FFFFFF', '#7C3AED'] },
]

function getDayIndex(arrayLength) {
  const start = new Date('2025-01-01')
  const today = new Date()
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24))
  return diff % arrayLength
}

const FONT_OF_DAY = ALL_FONTS[getDayIndex(ALL_FONTS.length)]
const COLOR_OF_DAY = ALL_COLORS[getDayIndex(ALL_COLORS.length)]

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
  { word: 'Choose', font: "'Cormorant Garamond', serif",  style: 'italic' },
{ word: 'Select', font: "'Cormorant Garamond', serif",         style: 'italic' },
{ word: 'Tap', font: "'Cormorant Garamond', serif",   style: 'italic' },
{ word: 'Claim', font: "'Cormorant Garamond', serif",                style: 'italic' },
{ word: 'Deploy', font: "'Cormorant Garamond', serif",  style: 'italic' },
{ word: 'Choose', font: "'Cormorant Garamond', serif",        style: 'italic' },
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
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [copiedHex, setCopiedHex] = useState(false)
const [copiedFont, setCopiedFont] = useState(false)
  const [activeTool, setActiveTool] = useState('all')
const [activeCategory, setActiveCategory] = useState('all')
  const [sites, setSites]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [sliderIndex, setSliderIndex] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused]   = useState(false)
  const [copiedId, setCopiedId] = useState(null)
const [limitReached, setLimitReached] = useState(false)
const [showUpgrade, setShowUpgrade] = useState(false)
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
    const CACHE_KEY = 'ph_sites_cache'
    const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

    // Try cache first
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { data: cachedData, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_TTL) {
          setSites(cachedData)
          setLoading(false)
          // Refresh in background silently
          fetchFromSupabase(CACHE_KEY, true)
          return
        }
      }
    } catch {}

    // No cache or expired — fetch normally
    fetchFromSupabase(CACHE_KEY, false)
  }

  async function fetchFromSupabase(CACHE_KEY, silent) {
    if (!silent) setLoading(true)
    const { data, error } = await supabase
      .from('sites')
      .select('*, ratings(rating)')
      .eq('approved', true)
      .order('created_at', { ascending: false })

    if (!error && data) {
      const enriched = data.map(site => {
        const ratings = site.ratings || []
        const avg = ratings.length
          ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length
          : 0
        return { ...site, avg_rating: avg, rating_count: ratings.length }
      })
      setSites(enriched)
      // Save to cache
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: enriched,
          timestamp: Date.now()
        }))
      } catch {}
    }
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
  const bg = document.getElementById('prompt-bg')
  if (!bg) return

  let mouseX = window.innerWidth / 2
  let mouseY = window.innerHeight / 2
  let rafId = null

  const chips = bg.querySelectorAll('[data-chip="true"]')

  function animate() {
    chips.forEach(chip => {
      const rect = chip.getBoundingClientRect()
      const chipX = rect.left + rect.width / 2
      const chipY = rect.top + rect.height / 2

      const dx = chipX - mouseX
      const dy = chipY - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const radius = 180

      if (dist < radius) {
        const force = (1 - dist / radius) * 28
        const angle = Math.atan2(dy, dx)
        const pushX = Math.cos(angle) * force
        const pushY = Math.sin(angle) * force
        chip.style.transform = `translate(${pushX}px, ${pushY}px)`
        chip.style.opacity = `${0.12 + (dist / radius) * 0.12}`
      } else {
        chip.style.transform = 'translate(0px, 0px)'
        chip.style.opacity = ''
      }
    })
    rafId = requestAnimationFrame(animate)
  }

  function onMouseMove(e) {
    mouseX = e.clientX
    mouseY = e.clientY
  }

  function onMouseLeave() {
    chips.forEach(chip => {
      chip.style.transform = 'translate(0px, 0px)'
      chip.style.opacity = ''
    })
  }

  window.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseleave', onMouseLeave)
  rafId = requestAnimationFrame(animate)

  return () => {
    window.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseleave', onMouseLeave)
    cancelAnimationFrame(rafId)
  }
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

  // Check if user is Pro
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (sub) {
    handleCopyPrompt(site)
    setCopiedId(site.id)
    setTimeout(() => setCopiedId(null), 2000)
    return
  }

  // Free user — check limit
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('prompt_unlocks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('unlocked_at', startOfDay.toISOString())

  if (count >= 2) { setLimitReached(true); return }

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
      <CookieBar />
      
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
    <div className="nav-avatar" title={user.user_metadata?.full_name || user.email}>
      {(user.user_metadata?.full_name || user.email || 'U')
        .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
    </div>
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
              <div className="mobile-avatar-row">
  <div className="nav-avatar nav-avatar--mobile">
    {(user.user_metadata?.full_name || user.email || 'U')
      .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
  </div>
  <span className="mobile-user">{user.user_metadata?.full_name || user.email}</span>
</div>
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
          <section className="hero-text-section" style={{ backgroundImage: 'url(/hero-image.jpg.jpg)' }}>
            <div className="hero-overlay" />
            <div className="hero-text-inner">
              <div className="hero-left">
                <h1 className="hero-headline">
                  <div className="hero-curtain-row">
                    <span className="curtain-left">Stop</span>
                    <span className="curtain-right">Guessing.</span>
                  </div>
                  <div className="hero-curtain-row hero-curtain-row--2">
                    <FlipWord />
                    <span className="curtain-right-static">a prompt.</span>
                  </div>
                </h1>
                
                <p className="hero-sub">
                 Copy prompts that actually work. Build faster.
                </p>
                
                <div className="hero-actions">
                  <button className="hero-cta-primary bouncy" onClick={() => galleryRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                    Browse the gallery ↓
                  </button>
                  <button className="hero-cta-ghost" onClick={onSubmit}>
                    Submit your site →
                  </button>
                </div>

                {/* User Circles - A, B, C only */}
                <div className="hero-users-section">
                  <div className="hero-user-circles">
                    {['KO', 'TW', 'M'].map((letter, i) => {
                      const colors = ['#1A6BFF', '#7C3AED', '#FF6B35'];
                      return (
                        <div key={i} className="hero-user-circle" style={{ background: colors[i] }}>
                          {letter}
                        </div>
                      );
                    })}
                    <div className="hero-users-badge">
                      <strong>200+</strong> builders
                    </div>
                  </div>
                </div>
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
                            <button className="featured-btn-view" onClick={e => { e.stopPropagation(); if (!user) { onSignIn(); return } navigate(`/personalise/${site.id}`) }}>
   Personalise prompt
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
  onSignIn={onSignIn}
  user={user}
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
                <div className="inspire-panel-header">
  <div className="inspire-tag">Font of the Day</div>
  <button
    className="inspire-copy-btn"
    onClick={() => {
      navigator.clipboard.writeText(FONT_OF_DAY.name)
      setCopiedFont(true)
      setTimeout(() => setCopiedFont(false), 2000)
    }}
  >
    {copiedFont
      ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Copied!</>
      : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy name</>
    }
  </button>
</div>
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
                <div className="inspire-panel-header">
  <div className="inspire-tag">Color of the Day</div>
  <button
    className="inspire-copy-btn"
    onClick={() => {
      navigator.clipboard.writeText(COLOR_OF_DAY.hex)
      setCopiedHex(true)
      setTimeout(() => setCopiedHex(false), 2000)
    }}
  >
    {copiedHex
      ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Copied!</>
      : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy hex</>
    }
  </button>
</div>
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
              <h2 className="submit-title">Submit your website.</h2>
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
          <div className="footer-col"><h4>Legal</h4><ul><li><a href="/privacy">Privacy Policy</a></li><li><a href="/dmca">DMCA</a></li><li><a href="/cookies">Cookie Policy</a></li></ul></div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 PromptHall. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#">About</a><a href="#">FAQs</a><a href="/privacy">Privacy Policy</a><a href="mailto:prompthall@gmail.com">Contact</a>
          </div>
        </div>
      </footer>

       {/* 
      This is a 
      multi-line comment in JSX 
    */}{limitReached && (
  <div className="limit-backdrop" onClick={() => setLimitReached(false)}>
    <div className="limit-modal" onClick={e => e.stopPropagation()}>
      <div className="upgrade-illustration">
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background circle */}
    <circle cx="60" cy="60" r="56" fill="#EEF3FF" />
    
    {/* Stars */}
    <circle cx="25" cy="30" r="2" fill="#1A6BFF" opacity="0.4"/>
    <circle cx="95" cy="25" r="1.5" fill="#1A6BFF" opacity="0.3"/>
    <circle cx="100" cy="70" r="2" fill="#1A6BFF" opacity="0.4"/>
    <circle cx="18" cy="75" r="1.5" fill="#1A6BFF" opacity="0.3"/>
    <circle cx="40" cy="15" r="1" fill="#1A6BFF" opacity="0.5"/>
    <circle cx="85" cy="95" r="1" fill="#1A6BFF" opacity="0.4"/>
    <circle cx="30" cy="95" r="1.5" fill="#1A6BFF" opacity="0.3"/>
    <circle cx="90" cy="45" r="1" fill="#1A6BFF" opacity="0.5"/>

    {/* Rocket trail */}
    <ellipse cx="67" cy="82" rx="5" ry="12" fill="#FFD166" opacity="0.6" transform="rotate(-35 67 82)"/>
    <ellipse cx="64" cy="87" rx="3" ry="8" fill="#FF6B35" opacity="0.4" transform="rotate(-35 64 87)"/>

    {/* Rocket body */}
    <path d="M60 28 C60 28 45 45 45 65 L60 72 L75 65 C75 45 60 28 60 28Z" fill="#1A6BFF"/>
    
    {/* Rocket nose */}
    <path d="M60 28 C60 28 52 38 52 45 L60 42 L68 45 C68 38 60 28 60 28Z" fill="#0A3FCC"/>
    
    {/* Rocket window */}
    <circle cx="60" cy="54" r="6" fill="white" opacity="0.9"/>
    <circle cx="60" cy="54" r="4" fill="#EEF3FF"/>
    <circle cx="60" cy="54" r="2" fill="#1A6BFF" opacity="0.6"/>

    {/* Rocket fins */}
    <path d="M45 65 L38 78 L52 70Z" fill="#0A3FCC"/>
    <path d="M75 65 L82 78 L68 70Z" fill="#0A3FCC"/>

    {/* Rocket exhaust */}
    <ellipse cx="60" cy="73" rx="6" ry="4" fill="#FFD166"/>
    <ellipse cx="60" cy="76" rx="4" ry="3" fill="#FF6B35" opacity="0.8"/>

    {/* Sparkles */}
    <path d="M35 48 L37 44 L39 48 L43 50 L39 52 L37 56 L35 52 L31 50Z" fill="#FFD166" opacity="0.8"/>
    <path d="M80 38 L81.5 35 L83 38 L86 39.5 L83 41 L81.5 44 L80 41 L77 39.5Z" fill="#FFD166" opacity="0.6"/>
  </svg>
</div>
      <h2>Daily limit reached</h2>
      <p>Free accounts can unlock 2 prompts per day. Upgrade to Pro for unlimited access and AI prompt customization.</p>
      <button className="limit-btn-pro" onClick={() => { setLimitReached(false); setShowUpgrade(true) }}>Upgrade to Pro →</button>
      <button className="limit-btn-ghost" onClick={() => setLimitReached(false)}>Maybe later</button>
    </div>
  </div>
)}

{showUpgrade && (
  <UpgradeModal
    user={user}
    onClose={() => setShowUpgrade(false)}
    onSuccess={(response) => {
      console.log('Payment success:', response)
      setShowUpgrade(false)
      alert('Payment successful! Your Pro account is being activated.')
    }}
  />
)} 


      <a href="https://wa.me/+2349032829889?text=Hi%2C%20I%20need%20help%20with%20PromptHall"
  target="_blank"
  rel="noreferrer"
  id="whatsapp-btn"
  title="Chat on WhatsApp"
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A0A0A">
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