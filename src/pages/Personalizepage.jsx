import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'
import './Personalizepage.css'

const QUESTIONS = [

  // ── BLOCK 1: FOUNDATION ──────────────────────────────────────────────────
  {
    id: 'business',
    block: 1,
    blockLabel: 'Foundation',
    label: 'What is your business and what does it do?',
    hint: 'One sentence — this becomes the brief for the whole site',
    type: 'text',
    placeholder: 'e.g. We make and deliver fresh, healthy meals to busy families in Lagos',
    required: true,
  },
  {
    id: 'name',
    block: 1,
    blockLabel: 'Foundation',
    label: 'What is your brand name?',
    hint: 'This gets injected into every headline, footer, and meta tag',
    type: 'text',
    placeholder: 'e.g. Bella Studio',
    required: true,
  },
  {
    id: 'location',
    block: 1,
    blockLabel: 'Foundation',
    label: 'Where are you based?',
    hint: 'City and country — localises copy like "Lagos delivery" vs "London delivery"',
    type: 'text',
    placeholder: 'e.g. Lagos, Nigeria',
    required: true,
  },

  // ── BLOCK 2: CONVERSION ──────────────────────────────────────────────────
  {
    id: 'cta_action',
    block: 2,
    blockLabel: 'Conversion',
    label: 'What is the ONE action you want visitors to take?',
    hint: 'This sets every CTA button across the entire site',
    type: 'options',
    options: [
      { label: 'Book a call',     value: 'Book a call — use a calendar booking CTA throughout' },
      { label: 'Buy a product',   value: 'Buy a product — use shop / add to cart CTAs throughout' },
      { label: 'Send a WhatsApp', value: 'Send a WhatsApp message — all CTAs open a WhatsApp chat link' },
      { label: 'Sign up',         value: 'Sign up — use email signup / account creation CTAs throughout' },
      { label: 'Get a quote',     value: 'Get a quote — use a quote request form as the primary CTA' },
      { label: 'Visit the store', value: 'Visit the physical store — CTAs show address and directions' },
    ],
    required: true,
  },
  {
    id: 'selling_point',
    block: 2,
    blockLabel: 'Conversion',
    label: 'What is your biggest selling point over competitors?',
    hint: 'This becomes the hero headline hook — be specific',
    type: 'text',
    placeholder: 'e.g. We deliver in 2 hours — no one else in Lagos does that',
    required: true,
  },
  {
    id: 'pricing_show',
    block: 2,
    blockLabel: 'Conversion',
    label: 'Do you want to show pricing on the site?',
    hint: 'Controls whether a pricing section is generated',
    type: 'options',
    options: [
      { label: 'Yes — price range',  value: 'show_range' },
      { label: 'Yes — exact prices', value: 'show_exact' },
      { label: 'No — "Get a quote"', value: 'no_pricing' },
    ],
    required: true,
  },
  {
    id: 'pricing_amount',
    block: 2,
    blockLabel: 'Conversion',
    label: 'What is your starting price?',
    hint: 'e.g. "From ₦5,000" or "Plans from $29/month"',
    type: 'text',
    placeholder: 'e.g. From ₦5,000 per order',
    required: false,
    conditional: (answers) => answers.pricing_show === 'show_range' || answers.pricing_show === 'show_exact',
  },

  // ── BLOCK 3: AUDIENCE ────────────────────────────────────────────────────
  {
    id: 'ideal_customer',
    block: 3,
    blockLabel: 'Audience',
    label: 'Describe your ideal customer in one sentence',
    hint: 'Grox writes copy that speaks directly to this person',
    type: 'text',
    placeholder: 'e.g. Working mothers aged 25–40 in Abuja who want healthy food delivered fast',
    required: false,
  },
  {
    id: 'problem_solved',
    block: 3,
    blockLabel: 'Audience',
    label: 'What problem do you solve for them?',
    hint: 'This becomes the pain point the hero section addresses',
    type: 'text',
    placeholder: "e.g. They don't have time to cook but still want their family eating well",
    required: false,
  },

  // ── BLOCK 4: BRAND VOICE ─────────────────────────────────────────────────
  {
    id: 'voice',
    block: 4,
    blockLabel: 'Brand voice',
    label: 'How should the site sound?',
    hint: 'Every line of placeholder copy will match this voice',
    type: 'options',
    options: [
      { label: 'Confident & direct',  value: 'confident, direct, and no-nonsense — short punchy sentences' },
      { label: 'Warm & friendly',     value: 'warm, friendly, and conversational — like talking to a trusted friend' },
      { label: 'Luxury & refined',    value: 'luxury, refined, and aspirational — elevated language, no slang' },
      { label: 'Energetic & bold',    value: 'energetic, bold, and motivating — lots of verbs and exclamation' },
      { label: 'Calm & trustworthy',  value: 'calm, reassuring, and trustworthy — measured and credible tone' },
    ],
    required: false,
  },
  {
    id: 'brand_inspiration',
    block: 4,
    blockLabel: 'Brand voice',
    label: 'Any brand or website you admire?',
    hint: 'Grox uses this as a reference for design language and copy style',
    type: 'text',
    placeholder: 'e.g. Apple, Paystack, Flutterwave, Zara',
    required: false,
  },

  // ── BLOCK 5: VISUAL ──────────────────────────────────────────────────────
  {
    id: 'primary_color',
    block: 5,
    blockLabel: 'Visual',
    label: 'Primary color',
    hint: 'Used for buttons, links, and highlights across the site',
    type: 'color-pick',
    colors: [
      { name: 'Midnight Black', hex: '#0A0A0A' },
      { name: 'Navy Blue',      hex: '#1E3A5F' },
      { name: 'Royal Blue',     hex: '#1A6BFF' },
      { name: 'Deep Purple',    hex: '#5B21B6' },
      { name: 'Forest Green',   hex: '#166534' },
      { name: 'Emerald',        hex: '#059669' },
      { name: 'Crimson Red',    hex: '#DC2626' },
      { name: 'Rose Pink',      hex: '#E11D74' },
      { name: 'Burnt Orange',   hex: '#EA580C' },
      { name: 'Gold',           hex: '#B45309' },
      { name: 'Teal',           hex: '#0D9488' },
      { name: 'Slate Gray',     hex: '#475569' },
    ],
    required: false,
  },
  {
    id: 'background_tone',
    block: 5,
    blockLabel: 'Visual',
    label: 'Background tone',
    hint: 'Sets the overall page feel',
    type: 'options',
    options: [
      { label: 'Light',   value: 'light background — white or off-white surfaces' },
      { label: 'Dark',    value: 'dark background — near-black or deep navy surfaces' },
      { label: 'Neutral', value: 'neutral background — warm beige, soft gray, or cream surfaces' },
    ],
    required: false,
  },
  {
    id: 'font_personality',
    block: 5,
    blockLabel: 'Visual',
    label: 'Font personality',
    hint: 'Controls the typographic character of the site',
    type: 'options',
    options: [
      { label: 'Serif — editorial', value: 'serif editorial typeface — think Fraunces, Playfair, or similar' },
      { label: 'Sans — modern',     value: 'clean sans-serif typeface — think Outfit, Inter, or similar' },
      { label: 'Display — bold',    value: 'bold display typeface with strong personality — think Anton, Space Grotesk, or similar' },
    ],
    required: false,
  },

  // ── BLOCK 6: REAL CONTENT ────────────────────────────────────────────────
  {
    id: 'services',
    block: 6,
    blockLabel: 'Real content',
    label: 'List up to 3 services or products you offer',
    hint: 'These become actual service cards — not "Service 1, Service 2"',
    type: 'text',
    placeholder: 'e.g. Hair braiding, Lash extensions, Nail art',
    required: false,
  },
  {
    id: 'testimonial',
    block: 6,
    blockLabel: 'Real content',
    label: 'Do you have any real customer feedback to share?',
    hint: 'One quote is enough — Groq writes 3 testimonials in the same tone',
    type: 'text',
    placeholder: '"Best jollof I\'ve ever ordered — delivered in 45 minutes!" — Tolu, Lekki',
    required: false,
  },
  {
    id: 'contact',
    block: 6,
    blockLabel: 'Real content',
    label: 'Contact details to include',
    hint: 'Phone, WhatsApp, email, address — paste any combination',
    type: 'text',
    placeholder: 'e.g. +234 801 234 5678 · hello@bella.com · 14 Admiralty Way, Lekki',
    required: false,
  },

  // ── BLOCK 7: PAGES & FEATURES ────────────────────────────────────────────
  {
    id: 'pages',
    block: 7,
    blockLabel: 'Pages & features',
    label: 'Pages to include',
    hint: 'Select all that apply',
    type: 'multi',
    options: [
      'Home', 'About', 'Services', 'Portfolio', 'Shop',
      'Pricing', 'Blog', 'Contact', 'FAQ', 'Gallery',
      'Testimonials', 'Booking',
    ],
    required: false,
  },
  {
    id: 'features',
    block: 7,
    blockLabel: 'Pages & features',
    label: 'Special features',
    hint: 'Select anything you want built in',
    type: 'multi',
    options: [
      'Online Booking', 'Payments', 'Login / Signup', 'WhatsApp Button',
      'Photo Gallery', 'Newsletter', 'Search', 'Dark Mode',
      'Animations', 'Map', 'Social Media Links',
    ],
    required: false,
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
    if (!active) { setIndex(0); return }
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
    setDisplayed(''); setDone(false); idx.current = 0
    if (!text || !active) return
    const chunk = Math.max(1, Math.floor(text.length / 200))
    const t = setInterval(() => {
      const end = Math.min(idx.current + chunk, text.length)
      setDisplayed(text.slice(0, end))
      idx.current = end
      if (end >= text.length) { clearInterval(t); setDone(true) }
    }, speed)
    return () => clearInterval(t)
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

export default function PersonalizePage({ site, onBack, user, onSignIn }) {
  const [step, setStep]                 = useState(0)
  const [answers, setAnswers]           = useState({})
  const [multiSelects, setMultiSelects] = useState({})
  const [phase, setPhase]               = useState('questions')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [fieldError, setFieldError]     = useState('')
  const [apiError, setApiError]         = useState('')
  const [copied, setCopied]             = useState(false)
  const [downloaded, setDownloaded]     = useState(false)
  const [purchaseId, setPurchaseId] = useState(null)
  const [promptPreview, setPromptPreview] = useState('')
  const [paymentDone, setPaymentDone] = useState(false)
  const inputRef                        = useRef(null)
  const resultRef                       = useRef(null)

  // Only show questions whose conditional (if any) passes
  const activeQuestions = QUESTIONS.filter(q => !q.conditional || q.conditional(answers))

  const q          = activeQuestions[step]
  const totalSteps = activeQuestions.length
  const progress   = Math.round((step / totalSteps) * 100)

  const loadingMsg = useLoadingMessage(phase === 'generating')
  const { displayed: typedPrompt, done: typingDone } = useTypewriter(generatedPrompt, phase === 'result')

  useEffect(() => {
    if (phase === 'questions' && q?.type === 'text') {
      setTimeout(() => inputRef.current?.focus(), 80)
    }
    setFieldError('')
  }, [step, phase])

  useEffect(() => {
    if (phase === 'result' && resultRef.current) {
      setTimeout(() => resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    }
  }, [phase])

  function handleOptionPick(val) {
    const updated = { ...answers, [q.id]: val }
    setAnswers(updated)
    setTimeout(() => advanceWith(updated), 200)
  }

  function handleColorPick(hex, name) {
    const updated = { ...answers, [q.id]: `${name} (${hex})` }
    setAnswers(updated)
    setTimeout(() => advanceWith(updated), 200)
  }

  function handleMultiToggle(opt) {
    setMultiSelects(ms => {
      const curr = ms[q.id] || []
      return { ...ms, [q.id]: curr.includes(opt) ? curr.filter(x => x !== opt) : [...curr, opt] }
    })
    setFieldError('')
  }

  function advanceWith(currentAnswers) {
    setFieldError('')
    const merged = { ...currentAnswers }
    if (q.type === 'multi') merged[q.id] = multiSelects[q.id] || []
    setAnswers(merged)

    // Re-evaluate active questions with the newly merged answers so the
    // conditional pricing_amount question is counted correctly
    const nextActive = QUESTIONS.filter(qq => !qq.conditional || qq.conditional(merged))
    const isLast = step >= nextActive.length - 1

    if (!isLast) {
      setStep(s => s + 1)
    } else {
      generate({ ...merged, [q.id]: q.type === 'multi' ? (multiSelects[q.id] || []) : (currentAnswers[q.id] || '') })
    }
  }

  function advance() {
    if (q.required && q.type === 'text' && !(answers[q.id] || '').trim()) {
      setFieldError(`${q.label} is required to continue`)
      return
    }
    advanceWith(answers)
  }

  function back() {
    if (step > 0) { setStep(s => s - 1); setFieldError('') }
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
      // fetch full prompt and go straight to result
      await fetchFullPurchasedPrompt(result.purchase_id)
    } else {
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
    setStep(0); setAnswers({}); setMultiSelects({})
    setGeneratedPrompt(''); setPhase('questions')
    setFieldError(''); setApiError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

function handlePayment() {
  if (!user?.email) { onSignIn(); return }

  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email: user.email,
    amount: 10000,
    currency: 'NGN',
    ref: `pp_${site.id}_${user.id}_${Date.now()}`,
    metadata: {
      purchase_id: purchaseId,
      site_id: site.id,
      user_id: user.id,
    },
    callback: function(response) {
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
    } catch (err) {}

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

            <div className="pp-progress-wrap">
              <div className="pp-progress-bar">
                <div className="pp-progress-fill" style={{ width: `${progress}%` }}/>
              </div>
              <span className="pp-progress-label">{step + 1} of {totalSteps}</span>
            </div>

            <div className="pp-question-card">
              <div className="pp-q-meta">
                <span className="pp-q-number">{(step + 1).toString().padStart(2, '0')}</span>
                {q.required && <span className="pp-q-required">Required</span>}
              </div>
              <h2 className="pp-q-title">{q.label}</h2>
              {q.hint && <p className="pp-q-hint">{q.hint}</p>}

              {fieldError && (
                <div className="pp-field-error">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {fieldError}
                </div>
              )}

              {/* Text */}
              {q.type === 'text' && (
                <input
                  ref={inputRef}
                  className="pp-input"
                  placeholder={q.placeholder}
                  value={answers[q.id] || ''}
                  onChange={e => { setAnswers(a => ({ ...a, [q.id]: e.target.value })); setFieldError('') }}
                  onKeyDown={e => e.key === 'Enter' && advance()}
                />
              )}

              {/* Single-select */}
              {q.type === 'options' && (
                <div className="pp-options-grid">
                  {q.options.map(opt => (
                    <button
                      key={opt.value}
                      className={`pp-option ${answers[q.id] === opt.value ? 'pp-option--sel' : ''}`}
                      onClick={() => handleOptionPick(opt.value)}
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
                    const isLight = ['#FFFFFF','#F8F7F4','#FBF8F3','#F1F3F5','#F5F0E8'].includes(c.hex)
                    return (
                      <button
                        key={c.hex}
                        className={`pp-color-btn ${selected ? 'pp-color-btn--sel' : ''}`}
                        onClick={() => handleColorPick(c.hex, c.name)}
                        title={c.name}
                      >
                        <div
                          className="pp-color-swatch"
                          style={{
                            background: c.hex,
                            border: isLight ? '1.5px solid #DDE1EA' : 'none',
                          }}
                        >
                          {selected && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isLight ? '#0A0A0A' : '#fff'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5"/>
                            </svg>
                          )}
                        </div>
                        <span className="pp-color-name">{c.name}</span>
                      </button>
                    )
                  })}
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
                        onClick={() => handleMultiToggle(opt)}
                      >
                        {sel && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
                        {opt}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Nav — text and multi */}
            {q.type !== 'options' && q.type !== 'color-pick' && (
              <div className="pp-nav">
                <button
                  className={`pp-nav-back ${step === 0 ? 'pp-nav-back--hidden' : ''}`}
                  onClick={back}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                  Back
                </button>
                <div className="pp-nav-right">
                  {!q.required && (
                    <button className="pp-nav-skip" onClick={() => advance()}>Skip</button>
                  )}
                  <button className="pp-nav-next" onClick={() => advance()}>
                    {step === totalSteps - 1 ? 'Generate prompt' : 'Continue'}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            )}

            {/* Nav — options and color-pick */}
            {(q.type === 'options' || q.type === 'color-pick') && step > 0 && (
              <div className="pp-nav pp-nav--option">
                <button className="pp-nav-back" onClick={back}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                  Back
                </button>
                {!q.required && (
                  <button className="pp-nav-skip" onClick={() => advanceWith(answers)}>Skip</button>
                )}
              </div>
            )}
          </>
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