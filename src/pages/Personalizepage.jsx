import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'
import './Personalizepage.css'

const PAGES = [
  {
    page: 1,
    label: 'Foundation',
    questions: [
      {
        id: 'business',
        label: 'What is your business and what does it do?',
        hint: 'One sentence — AI will use this to categorize your niche and recommend everything else',
        type: 'text',
        placeholder: 'e.g. We make and deliver fresh healthy meals to busy families in Lagos',
        required: true,
      },
      {
        id: 'name',
        label: 'What is your brand name?',
        hint: 'Injected into every headline, footer, and meta tag',
        type: 'text',
        placeholder: 'e.g. Bella Studio',
        required: true,
      },
      {
        id: 'location',
        label: 'Where are you based?',
        hint: 'Localises copy — "Lagos delivery" vs "London delivery"',
        type: 'location',
        placeholder: 'Search city...',
        required: true,
      },
      {
        id: 'whatsapp',
        label: 'WhatsApp number',
        hint: 'Used for CTA buttons and contact section',
        type: 'phone',
        placeholder: '801 234 5678',
        required: false,
      },
      {
        id: 'email',
        label: 'Business email',
        hint: 'Goes in the footer and contact section',
        type: 'email',
        placeholder: 'hello',
        required: false,
      },
    ]
  },
  {
    page: 2,
    label: 'Conversion',
    questions: [
      {
        id: 'cta_action',
        label: 'What actions do you want visitors to take?',
        hint: 'Select all that apply — AI will suggest the best primary one',
        type: 'cta-multi',
        aiSuggest: true,
        options: [
          { label: 'Book a call', value: 'Book a call — use a calendar booking CTA throughout', icon: '📞' },
          { label: 'Buy a product', value: 'Buy a product — use shop / add to cart CTAs throughout', icon: '🛒' },
          { label: 'Send a WhatsApp', value: 'Send a WhatsApp message — all CTAs open a WhatsApp chat link', icon: '💬' },
          { label: 'Sign up', value: 'Sign up — use email signup / account creation CTAs throughout', icon: '✉️' },
          { label: 'Get a quote', value: 'Get a quote — use a quote request form as the primary CTA', icon: '📋' },
          { label: 'Visit the store', value: 'Visit the physical store — CTAs show address and directions', icon: '📍' },
          { label: 'Download something', value: 'Download — use download CTA buttons throughout', icon: '⬇️' },
          { label: 'Watch a video', value: 'Watch a video — embed video as primary hero CTA', icon: '▶️' },
        ],
        required: true,
      },
      {
        id: 'pricing_show',
        label: 'Do you want to show pricing on the site?',
        hint: 'Controls whether a pricing section is generated',
        type: 'options',
        options: [
          { label: 'Yes — price range', value: 'show_range' },
          { label: 'Yes — exact prices', value: 'show_exact' },
          { label: 'No — "Get a quote"', value: 'no_pricing' },
        ],
        required: true,
      },
      {
        id: 'pricing_amount',
        label: 'What is your starting price?',
        hint: 'Numbers only — e.g. 5000 or 29',
        type: 'price',
        placeholder: '5000',
        required: false,
        conditional: (answers) => answers.pricing_show === 'show_range' || answers.pricing_show === 'show_exact',
      },
      {
        id: 'social',
        label: 'Social media handles (optional)',
        hint: 'AI adds follow links and social proof copy',
        type: 'social',
        required: false,
      },
      {
        id: 'needs_backend',
        label: 'Does your site need a backend?',
        hint: 'AI will grade complexity and flag what needs external services',
        type: 'options',
        options: [
          { label: 'No — frontend only', value: 'frontend_only' },
          { label: 'Yes — user login / signup', value: 'needs_auth' },
          { label: 'Yes — database / storage', value: 'needs_db' },
          { label: 'Yes — payments', value: 'needs_payments' },
          { label: 'Not sure — AI decide', value: 'ai_decide' },
        ],
        required: true,
      },
    ]
  },
  {
    page: 3,
    label: 'Content',
    questions: [
      {
        id: 'ideal_customer',
        label: 'Describe your ideal customer',
        hint: 'AI writes copy that speaks directly to this person',
        type: 'text',
        placeholder: 'e.g. Working mothers aged 25–40 in Abuja who want healthy food fast',
        required: false,
      },
      {
        id: 'problem_solved',
        label: 'What problem do you solve for them?',
        hint: 'Becomes the pain point the hero section addresses',
        type: 'text',
        placeholder: "e.g. They don't have time to cook but want their family eating well",
        required: false,
      },
      {
        id: 'services',
        label: 'List up to 3 services or products',
        hint: 'These become real service cards — not "Service 1, Service 2"',
        type: 'text',
        placeholder: 'e.g. Hair braiding, Lash extensions, Nail art',
        required: false,
      },
      {
        id: 'testimonial',
        label: 'Any real customer feedback?',
        hint: 'One quote — AI writes 3 testimonials in the same tone',
        type: 'text',
        placeholder: '"Best jollof I\'ve ever ordered!" — Tolu, Lekki',
        required: false,
      },
      {
        id: 'image_links',
        label: 'Any image links to include? (optional)',
        hint: 'Paste a Google Drive, Instagram, or direct image URL — AI injects it into hero or gallery',
        type: 'text',
        placeholder: 'e.g. https://drive.google.com/...',
        required: false,
      },
    ]
  },
  {
    page: 4,
    label: 'Visual',
    questions: [
      {
        id: 'primary_color',
        label: 'Primary color',
        hint: 'Used for buttons, links, and highlights',
        type: 'color-pick',
        colors: [
          { name: 'Midnight Black', hex: '#0A0A0A' },
          { name: 'Navy Blue', hex: '#1E3A5F' },
          { name: 'Royal Blue', hex: '#1A6BFF' },
          { name: 'Deep Purple', hex: '#5B21B6' },
          { name: 'Forest Green', hex: '#166534' },
          { name: 'Emerald', hex: '#059669' },
          { name: 'Crimson Red', hex: '#DC2626' },
          { name: 'Rose Pink', hex: '#E11D74' },
          { name: 'Burnt Orange', hex: '#EA580C' },
          { name: 'Gold', hex: '#B45309' },
          { name: 'Teal', hex: '#0D9488' },
          { name: 'Slate Gray', hex: '#475569' },
        ],
        required: false,
      },
      {
        id: 'background_tone',
        label: 'Background tone',
        hint: 'Sets the overall page feel',
        type: 'options',
        options: [
          { label: 'Light', value: 'light background — white or off-white surfaces' },
          { label: 'Dark', value: 'dark background — near-black or deep navy surfaces' },
          { label: 'Neutral', value: 'neutral background — warm beige, soft gray, or cream surfaces' },
        ],
        required: false,
      },
      {
        id: 'font_personality',
        label: 'Font personality',
        hint: 'Click a font to preview how your site will feel',
        type: 'font-pick',
        fonts: [
          { name: 'Fraunces', category: 'Serif Editorial', personality: 'Slow, confident, quirky', sample: 'The prompt behind the pixel', googleFont: 'Fraunces:wght@400;700' },
          { name: 'Playfair Display', category: 'Transitional Serif', personality: 'Elegant, editorial, timeless', sample: 'Design is not what it looks like', googleFont: 'Playfair+Display:wght@400;700' },
          { name: 'Space Grotesk', category: 'Geometric Sans', personality: 'Technical, confident, quirky', sample: 'Ship fast. Design faster.', googleFont: 'Space+Grotesk:wght@400;700' },
          { name: 'Outfit', category: 'Geometric Sans', personality: 'Friendly, clean, approachable', sample: 'Good design feels invisible.', googleFont: 'Outfit:wght@400;700' },
          { name: 'Bricolage Grotesque', category: 'Variable Grotesque', personality: 'Expressive, playful structure', sample: 'Build what you can imagine.', googleFont: 'Bricolage+Grotesque:wght@400;700' },
          { name: 'Cormorant Garamond', category: 'Classical Serif', personality: 'Refined, whisper-quiet luxury', sample: 'Craft speaks louder than noise.', googleFont: 'Cormorant+Garamond:wght@400;700' },
          { name: 'Syne', category: 'Display Grotesque', personality: 'Irregular, artistic, rule-breaking', sample: 'Rules exist to be redesigned.', googleFont: 'Syne:wght@400;700' },
          { name: 'DM Serif Display', category: 'High Contrast Serif', personality: 'Sharp, authoritative, high contrast', sample: 'Every pixel has a purpose.', googleFont: 'DM+Serif+Display' },
        ],
        required: false,
      },
      {
        id: 'pages',
        label: 'Pages to include',
        hint: 'AI will also recommend pages based on your business type',
        type: 'multi',
        options: ['Home', 'About', 'Services', 'Portfolio', 'Shop', 'Pricing', 'Blog', 'Contact', 'FAQ', 'Gallery', 'Testimonials', 'Booking'],
        required: false,
      },
      {
        id: 'features',
        label: 'Special features',
        hint: 'Select anything you want built in',
        type: 'multi',
        options: ['Online Booking', 'Payments', 'Login / Signup', 'WhatsApp Button', 'Photo Gallery', 'Newsletter', 'Search', 'Dark Mode', 'Animations', 'Map', 'Social Media Links'],
        required: false,
      },
    ]
  },
]

const LOADING_MESSAGES = [
  'Parsing prompt architecture...',
  'Extracting design tokens...',
  'Mapping brand variables...',
  'Injecting business context...',
  'Resolving component hierarchy...',
  'Calibrating output schema...',
  'Optimising instruction density...',
  'Compiling personalised prompt...',
]

function useLoadingMessage(active) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setIndex(0), 0)
      return () => clearTimeout(t)
    }
    const t = setInterval(() => setIndex(i => (i + 1) % LOADING_MESSAGES.length), 1600)
    return () => clearInterval(t)
  }, [active])
  return LOADING_MESSAGES[index]
}

function useTypewriter(text, active, speed = 3) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const idx = useRef(0)

  useEffect(() => {
    const reset = setTimeout(() => { setDisplayed(''); setDone(false) }, 0)
    idx.current = 0
    if (!text || !active) return () => clearTimeout(reset)
    const chunk = Math.max(1, Math.floor(text.length / 200))
    const t = setInterval(() => {
      const end = Math.min(idx.current + chunk, text.length)
      setDisplayed(text.slice(0, end))
      idx.current = end
      if (end >= text.length) { clearInterval(t); setDone(true) }
    }, speed)
    return () => clearInterval(t)
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, active])
  return { displayed, done }
}

function LovableLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#E91E8C"/>
      <path d="M24 34.5C24 34.5 10.5 26.7 10.5 18.75C10.5 15.02 13.52 12 17.25 12C19.8 12 22.02 13.41 23.25 15.54C24.48 13.41 26.7 12 29.25 12C32.98 12 36 15.02 36 18.75C36 26.7 24 34.5 24 34.5Z" fill="white"/>
    </svg>
  )
}

const NIGERIAN_CITIES = [
  'Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Benin City', 'Maiduguri',
  'Zaria', 'Aba', 'Jos', 'Ilorin', 'Oyo', 'Enugu', 'Abeokuta', 'Onitsha',
  'Warri', 'Sokoto', 'Calabar', 'Kaduna', 'Akure', 'Bauchi', 'Owerri',
  'Asaba', 'Umuahia', 'Uyo', 'Makurdi', 'Minna', 'Yola', 'Lafia', 'Gusau',
]

const WORLD_CITIES = [
  // Africa
  'Accra, Ghana', 'Nairobi, Kenya', 'Johannesburg, South Africa',
  'Cape Town, South Africa', 'Cairo, Egypt', 'Addis Ababa, Ethiopia',
  'Dar es Salaam, Tanzania', 'Kampala, Uganda', 'Dakar, Senegal',
  'Douala, Cameroon', 'Lusaka, Zambia', 'Harare, Zimbabwe',
  'Kigali, Rwanda', 'Freetown, Sierra Leone', 'Banjul, Gambia',
  // Europe
  'London, UK', 'Berlin, Germany', 'Paris, France', 'Amsterdam, Netherlands',
  'Stockholm, Sweden', 'Madrid, Spain', 'Rome, Italy', 'Lisbon, Portugal',
  'Dublin, Ireland', 'Brussels, Belgium', 'Vienna, Austria', 'Zurich, Switzerland',
  // Americas
  'New York, US', 'Los Angeles, US', 'Houston, US', 'Chicago, US',
  'Toronto, Canada', 'Vancouver, Canada', 'São Paulo, Brazil',
  'Mexico City, Mexico', 'Buenos Aires, Argentina', 'Bogotá, Colombia',
  // Middle East
  'Dubai, UAE', 'Abu Dhabi, UAE', 'Riyadh, Saudi Arabia', 'Doha, Qatar',
  'Kuwait City, Kuwait', 'Beirut, Lebanon', 'Amman, Jordan',
  // Asia & Oceania
  'Mumbai, India', 'Delhi, India', 'Bangalore, India', 'Singapore',
  'Kuala Lumpur, Malaysia', 'Jakarta, Indonesia', 'Manila, Philippines',
  'Bangkok, Thailand', 'Tokyo, Japan', 'Seoul, South Korea',
  'Shanghai, China', 'Sydney, Australia', 'Melbourne, Australia',
]

const ALL_LOCATIONS = [
  ...NIGERIAN_CITIES.map(c => `${c}, Nigeria`),
  ...WORLD_CITIES,
]

const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', prefix: 'instagram.com/' },
  { id: 'twitter', label: 'X (Twitter)', prefix: 'x.com/' },
  { id: 'facebook', label: 'Facebook', prefix: 'facebook.com/' },
  { id: 'tiktok', label: 'TikTok', prefix: 'tiktok.com/@' },
  { id: 'linkedin', label: 'LinkedIn', prefix: 'linkedin.com/in/' },
]
function LocationInput({ value, placeholder, onChange }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  return (
    <div className="pp-location-wrap">
      <input
        className="pp-input"
        placeholder={placeholder}
        value={value || query}
        onChange={e => {
          setQuery(e.target.value)
          onChange(e.target.value)
          setFocused(true)
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
      />
      {focused && (
        <div className="pp-location-dropdown">
          {ALL_LOCATIONS
            .filter(l => l.toLowerCase().includes((value || query).toLowerCase()))
            .slice(0, 8)
            .map(l => (
              <button key={l} className="pp-location-option" onMouseDown={() => {
                onChange(l)
                setQuery(l)
                setFocused(false)
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {l}
              </button>
            ))
          }
        </div>
      )}
    </div>
  )
}

export default function PersonalizePage({ site, onBack, user, onSignIn }) {
  const [currentPage, setCurrentPage]   = useState(0)
  const [answers, setAnswers]           = useState({})
  const [multiSelects, setMultiSelects] = useState({})
  const [phase, setPhase] = useState('questions')
  const [reviewAnswers, setReviewAnswers] = useState({})
  const [socialHandles, setSocialHandles] = useState({})
  const [aiSuggestions, setAiSuggestions] = useState({})
  const [suggestLoading, setSuggestLoading] = useState(false)
  const [fontLoaded, setFontLoaded] = useState({})
  const [_savedAt, setSavedAt] = useState(null)
  const [saveStatus, setSaveStatus] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [fieldError, setFieldError]     = useState('')
  const [apiError, setApiError]         = useState('')
  const [copied, setCopied]             = useState(false)
  const [downloaded, setDownloaded]     = useState(false)
  const [purchaseId, setPurchaseId] = useState(null)
  const [promptPreview, setPromptPreview] = useState('')
  const resultRef                       = useRef(null)

  // Only show questions whose conditional (if any) passes
  const totalPages = PAGES.length
  const activePage = PAGES[currentPage]
  const activeQuestions = activePage.questions.filter(q => !q.conditional || q.conditional(answers))
  const progress = Math.round(((currentPage) / totalPages) * 100)
  const loadingMsg = useLoadingMessage(phase === 'generating')
  const { displayed: typedPrompt, done: typingDone } = useTypewriter(generatedPrompt, phase === 'result')

  // Auto-save to Supabase on every answer change
  useEffect(() => {
    if (!user || Object.keys(answers).length === 0) return
    const timeout = setTimeout(async () => {
      try {
        await supabase.from('personalise_progress').upsert({
          user_id: user.id,
          site_id: site.id,
          answers: { ...answers, ...multiSelects, social: socialHandles },
          page: currentPage,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,site_id' })
        setSavedAt(new Date())
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus(''), 2000)
      } catch { setSaveStatus('error') }
    }, 1500)
    return () => clearTimeout(timeout)
  }, [answers, multiSelects, socialHandles]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load saved progress on mount
  useEffect(() => {
    if (!user) return
    async function loadProgress() {
      const { data } = await supabase
        .from('personalise_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('site_id', site.id)
        .maybeSingle()
      if (data?.answers) {
        setAnswers(data.answers)
        const multi = {}
        ;['pages', 'features', 'cta_action'].forEach(key => {
          if (Array.isArray(data.answers[key])) multi[key] = data.answers[key]
        })
        setMultiSelects(multi)
        setSocialHandles(data.answers.social || {})
        setCurrentPage(data.page || 0)
        setSavedAt(new Date(data.updated_at))
      }
    }
    loadProgress()
  }, [user, site.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load Google Fonts for font picker
  useEffect(() => {
    PAGES[3].questions.find(q => q.id === 'font_personality')?.fonts?.forEach(font => {
      if (fontLoaded[font.name]) return
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`
      document.head.appendChild(link)
      setFontLoaded(prev => ({ ...prev, [font.name]: true }))
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // AI suggestions when business description is filled
  useEffect(() => {
    const business = answers.business
    if (!business || business.length < 20 || aiSuggestions.cta) return
    const timeout = setTimeout(() => fetchAiSuggestions(business), 800)
    return () => clearTimeout(timeout)
  }, [answers.business]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchAiSuggestions(business) {
    setSuggestLoading(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Business: "${business}"
            
Respond ONLY with a JSON object, no markdown:
{
  "cta": "one of: Book a call, Buy a product, Send a WhatsApp, Sign up, Get a quote, Visit the store",
  "pages": ["array of recommended page names from: Home, About, Services, Portfolio, Shop, Pricing, Blog, Contact, FAQ, Gallery, Testimonials, Booking"],
  "features": ["array of recommended features from: Online Booking, Payments, Login / Signup, WhatsApp Button, Photo Gallery, Newsletter, Search, Dark Mode, Animations, Map, Social Media Links"],
  "niche": "one word niche category",
  "complexity": "Simple landing page | Multi-page site | Complex app",
  "grade": "High Integrity / Easy | Moderate complexity | Requires external services"
}`
          }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || '{}'
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
      setAiSuggestions(parsed)

      // Auto-pre-select recommended pages and features
      if (parsed.pages) setMultiSelects(ms => ({ ...ms, pages: parsed.pages }))
      if (parsed.features) setMultiSelects(ms => ({ ...ms, features: parsed.features }))
    } catch { /* silent fail */ }
    setSuggestLoading(false)
  }

  useEffect(() => {
    if (phase === 'result' && resultRef.current) {
      setTimeout(() => resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    }
  }, [phase])

  function handleOptionPick(qId, val) {
    setAnswers(a => ({ ...a, [qId]: val }))
  }

  function handleColorPick(hex, name, qId) {
    setAnswers(a => ({ ...a, [qId]: `${name} (${hex})` }))
  }

  function handleFontPick(fontName, qId) {
    setAnswers(a => ({ ...a, [qId]: fontName }))
  }

  function handleMultiToggle(qId, opt) {
    setMultiSelects(ms => {
      const curr = ms[qId] || []
      return { ...ms, [qId]: curr.includes(opt) ? curr.filter(x => x !== opt) : [...curr, opt] }
    })
  }

  function validatePage() {
    for (const q of activeQuestions) {
      if (q.required && q.type === 'text' && !(answers[q.id] || '').trim()) {
        return `${q.label} is required`
      }
      if (q.required && q.type === 'location' && !(answers[q.id] || '').trim()) {
        return 'Location is required'
      }
      if (q.required && q.type === 'options' && !answers[q.id]) {
        return `${q.label} is required`
      }
    }
    return null
  }

  function nextPage() {
    const err = validatePage()
    if (err) { setFieldError(err); return }
    setFieldError('')
    if (currentPage < totalPages - 1) {
      setCurrentPage(p => p + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const finalAnswers = {
        ...answers,
        ...Object.fromEntries(Object.entries(multiSelects).map(([k, v]) => [k, v])),
        social: socialHandles,
        whatsapp: answers.whatsapp ? `${answers[`whatsapp_code`] || '+234'}${answers.whatsapp}` : '',
        email: answers.email ? `${answers.email}${answers.email_domain || '@gmail.com'}` : '',
        ai_suggestions: aiSuggestions,
      }
      setReviewAnswers(finalAnswers)
      setPhase('review')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      setCurrentPage(p => p - 1)
      setFieldError('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  async function generate(finalAnswers) {
  setPhase('generating')
  setApiError('')

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not signed in')

    const { data: siteData } = await supabase
      .from('sites')
      .select('prompt')
      .eq('id', site.id)
      .single()

    if (!siteData?.prompt) throw new Error('Original prompt not found')

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-prompt`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          answers: finalAnswers,
          site_id: site.id,
          original_prompt: siteData.prompt,
        }),
      }
    )

    const result = await res.json()
    if (!res.ok) throw new Error(result.error || 'Generation failed')

    setPurchaseId(result.purchase_id)
    setPromptPreview(result.preview)

    if (result.already_paid) {
      await fetchFullPurchasedPrompt(result.purchase_id)
    } else {
      // Check if user is Pro — skip payment if they are
    setPhase('payment')  
    }
  } catch (err) {
    setApiError(err.message)
    setPhase('error')
  }
}

async function fetchFullPurchasedPrompt(id) {
  const { data } = await supabase
    .from('prompt_purchases')
    .select('generated_prompt, paid')
    .eq('id', id)
    .single()

  if (data?.paid && data?.generated_prompt) {
    setGeneratedPrompt(data.generated_prompt)
    setPhase('result')
  } else {
    setApiError('Payment not confirmed yet. Please wait a moment and try again.')
    setPhase('error')
  }
}

  function handleCopy() {
    navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  function handleDownload() {
    const blob = new Blob([generatedPrompt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(site.title || 'prompt').replace(/\s+/g, '-').toLowerCase()}-personalised.txt`
    a.click()
    URL.revokeObjectURL(url)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2500)
  }

  function openInLovable() {
    const encoded = encodeURIComponent(generatedPrompt)
    window.open(`https://lovable.dev/new?prompt=${encoded}`, '_blank')
  }

  function restart() {
    setCurrentPage(0); setAnswers({}); setMultiSelects({})
    setGeneratedPrompt(''); setPhase('questions')
    setFieldError(''); setApiError('')
    setSocialHandles({}); setAiSuggestions({})
    setReviewAnswers({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

function handlePayment() {
  if (!user?.email) { onSignIn(); return }

  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email: user.email,
    amount: 399900,
    currency: 'NGN',
    ref: `pp_${site.id}_${user.id}_${Date.now()}`,
    metadata: {
      purchase_id: purchaseId,
      site_id: site.id,
      user_id: user.id,
    },
    callback: function() {
  pollForConfirmation(purchaseId)
},
    onClose: function() {},
  })

  handler.openIframe()
}

async function pollForConfirmation(id) {
  // First mark as paid directly on the client side
  await supabase
    .from('prompt_purchases')
    .update({ paid: true })
    .eq('id', id)

  // Then fetch the prompt
  const { data } = await supabase
    .from('prompt_purchases')
    .select('generated_prompt, paid')
    .eq('id', id)
    .single()

  if (data?.generated_prompt) {
    setGeneratedPrompt(data.generated_prompt)
    setPhase('result')
    return
  }

  // Fallback poll if direct update didn't work
  let attempts = 0
  const poll = setInterval(async () => {
    attempts++
    try {
      const { data } = await supabase
        .from('prompt_purchases')
        .select('generated_prompt, paid')
        .eq('id', id)
        .single()

      if (data?.paid && data?.generated_prompt) {
        clearInterval(poll)
        setGeneratedPrompt(data.generated_prompt)
        setPhase('result')
        return
      }
    } catch {
  // ignore polling errors, will retry
}
    if (attempts >= 10) {
      clearInterval(poll)
      setApiError('Payment confirmed but prompt took too long to load. Please refresh.')
      setPhase('error')
    }
  }, 2000)
}

  // ── Gate ──────────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="pp-gate">
        <button className="pp-topbar-back" onClick={onBack}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <div className="pp-gate-card">
          <div className="pp-gate-lock">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <h2>Sign in to personalise</h2>
          <p>Free account — 30 seconds to get started</p>
          <button className="pp-btn-primary pp-gate-action" onClick={onSignIn}>Create free account</button>
        </div>
      </div>
    )
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="pp-page">

      {/* TOPBAR */}
      <div className="pp-topbar">
        <button className="pp-topbar-back" onClick={onBack}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <div className="pp-topbar-info">
          <span className="pp-topbar-site">{site.title}</span>
          <span className="pp-topbar-divider">/</span>
          <span className="pp-topbar-page">Prompt Personaliser</span>
        </div>
        <div className="pp-gemini-pill">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Powered by Groq AI
        </div>
      </div>

      <div className="pp-main">

        {/* ── QUESTIONS PHASE ── */}
        {phase === 'questions' && (
          <>
            <div className="pp-hero">
              <p className="pp-hero-eyebrow">Personalise this prompt</p>
              <h1 className="pp-hero-title">Make it yours</h1>
              <p className="pp-hero-sub">Answer a few questions and Groq will rewrite this prompt with your brand, colors, and details injected.</p>
            </div>

            {/* Page indicators */}
            <div className="pp-page-indicators">
              {PAGES.map((p, i) => (
                <div
                  key={i}
                  className={`pp-page-dot ${i === currentPage ? 'pp-page-dot--active' : ''} ${i < currentPage ? 'pp-page-dot--done' : ''}`}
                  onClick={() => i < currentPage && setCurrentPage(i)}
                >
                  {i < currentPage
                    ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    : i + 1
                  }
                  <span className="pp-page-dot-label">{p.label}</span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="pp-progress-wrap">
              <div className="pp-progress-bar">
                <div className="pp-progress-fill" style={{ width: `${progress}%` }}/>
              </div>
              <span className="pp-progress-label">Page {currentPage + 1} of {totalPages}</span>
            </div>

            {/* Save status */}
            {saveStatus === 'saved' && (
              <div className="pp-save-status">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Progress saved
              </div>
            )}

            {/* AI suggestions banner */}
            {suggestLoading && (
              <div className="pp-ai-banner pp-ai-banner--loading">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                AI is analysing your business...
              </div>
            )}
            {aiSuggestions.niche && !suggestLoading && (
              <div className="pp-ai-banner">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <strong>AI detected:</strong> {aiSuggestions.niche} business · {aiSuggestions.complexity} · {aiSuggestions.grade}
              </div>
            )}

            {fieldError && (
              <div className="pp-field-error">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {fieldError}
              </div>
            )}

            {/* Questions for current page */}
            <div className="pp-questions-list">
              {activeQuestions.map((q) => {

                return (
                  <div key={q.id} className="pp-question-card">
                    <div className="pp-q-meta">
                      <span className="pp-q-number">{activePage.label}</span>
                      {q.required && <span className="pp-q-required">Required</span>}
                    </div>
                    <h2 className="pp-q-title">{q.label}</h2>
                    {q.hint && <p className="pp-q-hint">{q.hint}</p>}

                    {/* AI suggestion badge for CTA */}
                    {q.aiSuggest && aiSuggestions.cta && (
                      <div className="pp-ai-suggest" onClick={() => {
                        const match = q.options.find(o => o.label.toLowerCase().includes(aiSuggestions.cta.toLowerCase()))
                        if (match) handleOptionPick(q.id, match.value)
                      }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        AI suggests: <strong>{aiSuggestions.cta}</strong> — tap to select
                      </div>
                    )}

                    {/* Text input */}
                    {q.type === 'text' && (
                      <input
                        className="pp-input"
                        placeholder={q.placeholder}
                        value={answers[q.id] || ''}
                        onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                      />
                    )}

                    {/* Location searchable dropdown */}
                    {q.type === 'location' && (
                      <LocationInput
                        value={answers[q.id] || ''}
                        placeholder={q.placeholder}
                        onChange={val => setAnswers(a => ({ ...a, [q.id]: val }))}
                      />
                    )}
                    {/* Phone input with switchable country code */}
                    {q.type === 'phone' && (
                      <div className="pp-phone-wrap">
                        <select
                          className="pp-phone-code-select"
                          value={answers[`${q.id}_code`] || '+234'}
                          onChange={e => setAnswers(a => ({ ...a, [`${q.id}_code`]: e.target.value }))}
                        >
                          {[
                            { code: '+234', label: '🇳🇬 +234' },
                            { code: '+1', label: '🇺🇸 +1' },
                            { code: '+44', label: '🇬🇧 +44' },
                            { code: '+233', label: '🇬🇭 +233' },
                            { code: '+254', label: '🇰🇪 +254' },
                            { code: '+27', label: '🇿🇦 +27' },
                            { code: '+971', label: '🇦🇪 +971' },
                            { code: '+49', label: '🇩🇪 +49' },
                            { code: '+33', label: '🇫🇷 +33' },
                            { code: '+91', label: '🇮🇳 +91' },
                            { code: '+86', label: '🇨🇳 +86' },
                            { code: '+55', label: '🇧🇷 +55' },
                            { code: '+1', label: '🇨🇦 +1' },
                            { code: '+61', label: '🇦🇺 +61' },
                          ].map(c => (
                            <option key={c.label} value={c.code}>{c.label}</option>
                          ))}
                        </select>
                        <input
                          className="pp-input pp-input--phone"
                          placeholder={q.placeholder}
                          value={answers[q.id] || ''}
                          onChange={e => {
                            const val = e.target.value.replace(/[^0-9]/g, '')
                            setAnswers(a => ({ ...a, [q.id]: val }))
                          }}
                          maxLength={11}
                        />
                      </div>
                    )}

                    {/* Email input with changeable domain */}
                    {q.type === 'email' && (
                      <div className="pp-email-wrap">
                        <input
                          className="pp-input pp-input--email"
                          placeholder={q.placeholder}
                          value={answers[q.id] || ''}
                          onChange={e => {
                            const val = e.target.value.replace(/@.*/, '')
                            setAnswers(a => ({ ...a, [q.id]: val }))
                          }}
                        />
                        <select
                          className="pp-email-domain-select"
                          value={answers[`${q.id}_domain`] || '@gmail.com'}
                          onChange={e => setAnswers(a => ({ ...a, [`${q.id}_domain`]: e.target.value }))}
                        >
                          {['@gmail.com', '@yahoo.com', '@outlook.com', '@hotmail.com', '@icloud.com', '@protonmail.com'].map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Price input — numbers only */}
                    {q.type === 'price' && (
                      <div className="pp-price-wrap">
                        <span className="pp-price-prefix">₦</span>
                        <input
                          className="pp-input pp-input--price"
                          placeholder={q.placeholder}
                          value={answers[q.id] || ''}
                          onChange={e => {
                            const val = e.target.value.replace(/[^0-9,]/g, '')
                            setAnswers(a => ({ ...a, [q.id]: val }))
                          }}
                        />
                      </div>
                    )}

                    {/* Social handles */}
                    {q.type === 'social' && (
                      <div className="pp-social-list">
                        {SOCIAL_PLATFORMS.map(p => (
                          <div key={p.id} className="pp-social-row">
                            <span className="pp-social-prefix">{p.label}</span>
                            <input
                              className="pp-input pp-input--social"
                              placeholder="@username"
                              value={socialHandles[p.id] || ''}
                              onChange={e => setSocialHandles(s => ({ ...s, [p.id]: e.target.value }))}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA multi-select with AI suggestion */}
                    {q.type === 'cta-multi' && (
                      <div className="pp-cta-wrap">
                        {aiSuggestions.cta && (
                          <div className="pp-ai-suggest pp-ai-suggest--cta">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            <span>AI recommends <strong>{aiSuggestions.cta}</strong> as your primary CTA based on your business type</span>
                          </div>
                        )}
                        <div className="pp-cta-grid">
                          {q.options.map(opt => {
                            const sel = (multiSelects[q.id] || []).includes(opt.value)
                            const isAiPick = aiSuggestions.cta && opt.label.toLowerCase().includes(aiSuggestions.cta.toLowerCase())
                            return (
                              <button
                                key={opt.value}
                                className={`pp-cta-option ${sel ? 'pp-cta-option--sel' : ''} ${isAiPick ? 'pp-cta-option--ai' : ''}`}
                                onClick={() => handleMultiToggle(q.id, opt.value)}
                              >
                                <span className="pp-cta-icon">{opt.icon}</span>
                                <span className="pp-cta-label">{opt.label}</span>
                                {isAiPick && (
                                  <span className="pp-cta-ai-badge">AI pick</span>
                                )}
                                {sel && (
                                  <svg className="pp-cta-check" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                    {/* Single select options */}
                    {q.type === 'options' && (
                      <div className="pp-options-grid">
                        {q.options.map(opt => (
                          <button
                            key={opt.value}
                            className={`pp-option ${answers[q.id] === opt.value ? 'pp-option--sel' : ''}`}
                            onClick={() => handleOptionPick(q.id, opt.value)}
                          >
                            <div className="pp-radio">
                              {answers[q.id] === opt.value && <div className="pp-radio-dot"/>}
                            </div>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Color picker */}
                    {q.type === 'color-pick' && (
                      <div className="pp-color-grid">
                        {q.colors.map(c => {
                          const selected = answers[q.id] === `${c.name} (${c.hex})`
                          const isLight = ['#FFFFFF', '#F8F7F4', '#FBF8F3', '#F1F3F5', '#F5F0E8'].includes(c.hex)
                          return (
                            <button
                              key={c.hex}
                              className={`pp-color-btn ${selected ? 'pp-color-btn--sel' : ''}`}
                              onClick={() => handleColorPick(c.hex, c.name, q.id)}
                              title={c.name}
                            >
                              <div className="pp-color-swatch" style={{ background: c.hex, border: isLight ? '1.5px solid #DDE1EA' : 'none' }}>
                                {selected && (
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isLight ? '#0A0A0A' : '#fff'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                )}
                              </div>
                              <span className="pp-color-name">{c.name}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* Font picker with live preview */}
                    {q.type === 'font-pick' && (
                      <div className="pp-font-list">
                        {q.fonts.map(f => (
                          <button
                            key={f.name}
                            className={`pp-font-card ${answers[q.id] === f.name ? 'pp-font-card--sel' : ''}`}
                            onClick={() => handleFontPick(f.name, q.id)}
                          >
                            <div className="pp-font-sample" style={{ fontFamily: `'${f.name}', serif` }}>
                              {f.sample}
                            </div>
                            <div className="pp-font-meta">
                              <span className="pp-font-name">{f.name}</span>
                              <span className="pp-font-category">{f.category}</span>
                              <span className="pp-font-personality">{f.personality}</span>
                            </div>
                            {answers[q.id] === f.name && (
                              <div className="pp-font-check">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Multi chips */}
                    {q.type === 'multi' && (
                      <div className="pp-chips-grid">
                        {q.options.map(opt => {
                          const sel = (multiSelects[q.id] || []).includes(opt)
                          return (
                            <button
                              key={opt}
                              className={`pp-chip ${sel ? 'pp-chip--sel' : ''}`}
                              onClick={() => handleMultiToggle(q.id, opt)}
                            >
                              {sel && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
                              {opt}
                            </button>
                          )
                        })}
                        {q.id === 'pages' && aiSuggestions.pages && (
                          <p className="pp-ai-chips-note">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            AI pre-selected recommended pages
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Page navigation */}
            <div className="pp-nav">
              <button
                className={`pp-nav-back ${currentPage === 0 ? 'pp-nav-back--hidden' : ''}`}
                onClick={prevPage}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Back
              </button>
              <button className="pp-nav-next" onClick={nextPage}>
                {currentPage === totalPages - 1 ? 'Generate prompt' : 'Continue'}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </>
        )}

{/* ── REVIEW PHASE ── */}
        {phase === 'review' && (
          <div className="pp-review">
            <div className="pp-review-header">
              <div className="pp-result-badge">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Ready to generate
              </div>
              <h2 className="pp-review-title">Review your answers</h2>
              <p className="pp-review-sub">Check everything looks right before we generate your personalised prompt.</p>
            </div>

            {/* AI outcome prediction */}
            {aiSuggestions.niche && (
              <div className="pp-review-ai-card">
                <div className="pp-review-ai-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  AI Outcome Prediction
                </div>
                <div className="pp-review-ai-grid">
                  <div className="pp-review-ai-item">
                    <span className="pp-review-ai-label">Niche</span>
                    <span className="pp-review-ai-val">{aiSuggestions.niche}</span>
                  </div>
                  <div className="pp-review-ai-item">
                    <span className="pp-review-ai-label">Complexity</span>
                    <span className="pp-review-ai-val">{aiSuggestions.complexity}</span>
                  </div>
                  <div className="pp-review-ai-item">
                    <span className="pp-review-ai-label">Grade</span>
                    <span className="pp-review-ai-val">{aiSuggestions.grade}</span>
                  </div>
                  <div className="pp-review-ai-item">
                    <span className="pp-review-ai-label">Best CTA</span>
                    <span className="pp-review-ai-val">{aiSuggestions.cta}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Answer summary */}
            <div className="pp-review-sections">
              {PAGES.map((page) => {
                const filled = page.questions.filter(q => {
                  if (q.type === 'multi' || q.type === 'cta-multi') return (multiSelects[q.id] || []).length > 0
                  return !!reviewAnswers[q.id]
                })
                if (filled.length === 0) return null
                return (
                  <div key={page.page} className="pp-review-section">
                    <div className="pp-review-section-header">
                      <span className="pp-review-section-label">{page.label}</span>
                      <button className="pp-review-edit" onClick={() => { setCurrentPage(page.page - 1); setPhase('questions') }}>
                        Edit
                      </button>
                    </div>
                    {filled.map(q => {
                      let val = ''
                      if (q.type === 'multi' || q.type === 'cta-multi') {
                        val = (multiSelects[q.id] || []).map(v => {
                          const opt = q.options?.find(o => o.value === v || o === v)
                          return opt?.label || opt || v
                        }).join(', ')
                      } else if (q.type === 'phone') {
                        val = `${reviewAnswers[`${q.id}_code`] || '+234'} ${reviewAnswers[q.id] || ''}`
                      } else if (q.type === 'email') {
                        val = `${reviewAnswers[q.id] || ''}${reviewAnswers[`${q.id}_domain`] || '@gmail.com'}`
                      } else if (q.type === 'color-pick') {
                        val = reviewAnswers[q.id] || ''
                      } else if (q.type === 'social') {
                        val = Object.entries(socialHandles).filter(([,v]) => v).map(([k,v]) => `${k}: ${v}`).join(', ')
                      } else {
                        val = reviewAnswers[q.id] || ''
                      }
                      if (!val) return null
                      return (
                        <div key={q.id} className="pp-review-row">
                          <span className="pp-review-label">{q.label}</span>
                          <span className="pp-review-val">{val}</span>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>

            <div className="pp-review-actions">
              <button className="pp-nav-back" onClick={() => { setCurrentPage(PAGES.length - 1); setPhase('questions') }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Back to edit
              </button>
              <button className="pp-nav-next" onClick={() => generate(reviewAnswers)}>
                Generate my prompt →
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        )}
        {/* ── GENERATING PHASE ── */}
        {phase === 'generating' && (
          <div className="pp-generating">
            <div className="pp-gen-orb">
              <div className="pp-gen-ring"/>
              <div className="pp-gen-ring pp-gen-ring--2"/>
              <div className="pp-gen-ring pp-gen-ring--3"/>
              <div className="pp-gen-core">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
            </div>
            <h2 className="pp-gen-title">Processing your prompt</h2>
            <p className="pp-gen-msg">{loadingMsg}</p>
            <div className="pp-gen-bar-wrap">
              <div className="pp-gen-bar"><div className="pp-gen-bar-fill"/></div>
            </div>
            <div className="pp-gen-steps">
              <div className="pp-gen-step pp-gen-step--done">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Answers collected
              </div>
              <div className="pp-gen-step pp-gen-step--active">
                <span className="pp-gen-dot"/>
                Groq processing
              </div>
              <div className="pp-gen-step pp-gen-step--pending">
                <span className="pp-gen-dot pp-gen-dot--off"/>
                Output ready
              </div>
            </div>
          </div>
        )}

        {/* ── RESULT PHASE ── */}
        {phase === 'result' && (
          <div className="pp-result" ref={resultRef}>
            <div className="pp-result-top">
              <div className="pp-result-badge">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Personalised prompt ready
              </div>
              <p className="pp-result-desc">Your prompt has been rewritten with your brand details. Copy it and paste into your preferred AI builder.</p>
            </div>

            <div className="pp-result-box">
              <div className="pp-result-box-header">
                <div className="pp-result-box-dots"><span/><span/><span/></div>
                <span className="pp-result-box-filename">personalised-prompt.txt</span>
                <span className="pp-result-box-words">~ 800 words</span>
              </div>
              <div className="pp-result-box-body">
                <pre className="pp-result-text">
                  {typedPrompt}
                  {!typingDone && <span className="pp-cursor"/>}
                </pre>
              </div>
            </div>

            <div className="pp-result-actions">
              <button className="pp-action-copy" onClick={handleCopy}>
                {copied
                  ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Copied!</>
                  : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy prompt</>
                }
              </button>
              <button className="pp-action-lovable" onClick={openInLovable}>
                <LovableLogo size={20}/>
                Build with Lovable
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </button>
              <button className="pp-action-download" onClick={handleDownload}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {downloaded ? 'Downloaded' : 'Download .txt'}
              </button>
            </div>

            <button className="pp-restart" onClick={restart}>Start over with different answers</button>
          </div>
        )}
         {/* ── PAYMENT PHASE ── */}
{phase === 'payment' && (
  <div className="pp-payment">
    <div className="pp-payment-badge">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
      Your prompt is ready
    </div>

    <h2 className="pp-payment-title">Unlock your personalised prompt</h2>
    <p className="pp-payment-sub">
      Groq has rewritten the prompt with your brand details. Pay once to unlock and download it.
    </p>

    {/* Blurred prompt preview */}
    <div className="pp-payment-preview">
      <div className="pp-payment-preview-header">
        <div className="pp-result-box-dots"><span/><span/><span/></div>
        <span style={{ fontFamily: 'var(--pp-fm)', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
          personalised-prompt.txt
        </span>
        <span style={{ fontFamily: 'var(--pp-fm)', fontSize: 10.5, color: 'rgba(255,255,255,0.15)' }}>
          ~ 800 words
        </span>
      </div>
      <div className="pp-payment-preview-body">
        <pre className="pp-payment-preview-text">
          {promptPreview}...
        </pre>
        <div className="pp-payment-blur-overlay"/>
      </div>
    </div>

    {/* What they get */}
    <div className="pp-payment-perks">
      {[
        'Full personalised prompt — ready to paste into Lovable or Bolt',
        'Download as .txt file',
        'Use it unlimited times',
        'Based on your ' + Object.keys(answers).filter(k => answers[k]).length + ' answers',
      ].map((perk, i) => (
        <div key={i} className="pp-payment-perk">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          {perk}
        </div>
      ))}
    </div>

    {/* Pay button */}
    <div className="pp-payment-pricing">
  <span className="pp-payment-original">₦10,000</span>
  <span className="pp-payment-price">₦3,999</span>
  <span className="pp-payment-founder">Founder offer</span>
</div>
<button className="pp-payment-btn" onClick={handlePayment}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
      Pay ₦3,999 to unlock your prompt
    </button>

    <button className="pp-restart" onClick={restart}>Start over instead</button>
  </div>
)}
        {/* ── ERROR PHASE ── */}
        {phase === 'error' && (
          <div className="pp-error-state">
            <div className="pp-error-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h3 className="pp-error-title">Generation failed</h3>
            <p className="pp-error-msg">{apiError}</p>
            <div className="pp-error-btns">
              <button className="pp-btn-ghost" onClick={restart}>Start over</button>
              <button className="pp-btn-primary" onClick={() => generate(answers)}>Try again</button>
            </div>
          </div>
        )}

      </div>
</div>
 )
}