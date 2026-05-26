import { useState, useEffect, useRef } from 'react'
import './PersonalizePage.css'

const QUESTIONS = [
  {
    id: 'building',
    label: 'What are you building?',
    hint: 'Describe your idea in plain words',
    type: 'text',
    placeholder: 'e.g. A fashion store for handmade dresses in Lagos',
    required: true,
  },
  {
    id: 'name',
    label: 'Brand or project name',
    hint: 'What should the website call you?',
    type: 'text',
    placeholder: 'e.g. Bella Studio',
    required: true,
  },
  {
    id: 'audience',
    label: 'Who is this for?',
    hint: 'Describe your audience in plain language',
    type: 'text',
    placeholder: 'e.g. Young professionals, mothers, gym owners in Abuja',
    required: false,
  },
  {
    id: 'style',
    label: 'Visual style',
    hint: 'Choose the overall look and feel',
    type: 'options',
    options: [
      { label: 'Clean & Minimal', value: 'clean, modern, and minimal with generous white space' },
      { label: 'Bold & Colorful', value: 'bold, vibrant, and colorful with strong typography' },
      { label: 'Luxury & Elegant', value: 'luxury-inspired with refined typography and premium spacing' },
      { label: 'Dark & Sleek', value: 'dark mode, sleek, and futuristic' },
      { label: 'Warm & Friendly', value: 'warm, soft, and welcoming with earthy tones' },
    ],
    required: false,
  },
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
    id: 'background_color',
    label: 'Background color',
    hint: 'The overall feel of the page',
    type: 'color-pick',
    colors: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Off White', hex: '#F8F7F4' },
      { name: 'Warm Cream', hex: '#FBF8F3' },
      { name: 'Light Gray', hex: '#F1F3F5' },
      { name: 'Soft Beige', hex: '#F5F0E8' },
      { name: 'Jet Black', hex: '#0A0A0A' },
      { name: 'Charcoal', hex: '#1A1A1A' },
      { name: 'Deep Navy', hex: '#0F1F3C' },
      { name: 'Dark Slate', hex: '#1E293B' },
    ],
    required: false,
  },
  {
    id: 'feeling',
    label: 'What mood should it project?',
    hint: 'Pick the overall tone',
    type: 'options',
    options: [
      { label: 'Professional', value: 'professional and polished' },
      { label: 'Creative', value: 'creative and artistic' },
      { label: 'Playful', value: 'fun and playful' },
      { label: 'Calm', value: 'calm and serene' },
      { label: 'Premium', value: 'premium and exclusive' },
      { label: 'Experimental', value: 'experimental and distinctive' },
    ],
    required: false,
  },
  {
    id: 'pages',
    label: 'Pages to include',
    hint: 'Select all that apply',
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
  {
    id: 'extra',
    label: 'Anything else?',
    hint: 'Final details, requests, or preferences',
    type: 'text',
    placeholder: 'e.g. Make it feel cinematic, add a hero video',
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

// Lovable logo — real SVG path from their brand
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
  const [phase, setPhase]               = useState('questions') // questions | generating | result | error
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [fieldError, setFieldError]     = useState('')
  const [apiError, setApiError]         = useState('')
  const [copied, setCopied]             = useState(false)
  const [downloaded, setDownloaded]     = useState(false)
  const inputRef                        = useRef(null)
  const resultRef                       = useRef(null)

  const q = QUESTIONS[step]
  const totalSteps = QUESTIONS.length
  const progress = Math.round(((step) / totalSteps) * 100)
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
    let merged = { ...currentAnswers }
    if (q.type === 'multi') merged[q.id] = multiSelects[q.id] || []

    setAnswers(merged)

    if (step < totalSteps - 1) {
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

    const details = `
What they are building: ${finalAnswers.building || 'Not specified'}
Brand name: ${finalAnswers.name || 'Not specified'}
Target audience: ${finalAnswers.audience || 'Not specified'}
Visual style: ${finalAnswers.style || 'Not specified'}
Primary color: ${finalAnswers.primary_color || 'Not specified'}
Background color: ${finalAnswers.background_color || 'Not specified'}
Mood / tone: ${finalAnswers.feeling || 'Not specified'}
Pages to include: ${(finalAnswers.pages || []).join(', ') || 'Standard pages'}
Special features: ${(finalAnswers.features || []).join(', ') || 'None'}
Additional requests: ${finalAnswers.extra || 'None'}
`.trim()

    const systemPrompt = `You are a senior prompt engineer for AI website builders: Lovable, Bolt, v0, and Cursor.

Your task is to personalise the original website prompt below using the user's business details. Follow these rules strictly:

1. Keep the original prompt's technical structure, component hierarchy, and design system completely intact.
2. Only replace or inject personal details: business name, industry description, target audience, color scheme, pages, and features.
3. Where the original mentions generic placeholder names, industries, or example text — replace them with the user's specifics.
4. If the user requested pages or features not in the original, add them naturally at the end of the prompt.
5. Do not rewrite, shorten, or reduce the technical depth of the original.
6. Do not add any preamble, explanation, or markdown. Return only the final prompt text.
7. Do not use emojis.

ORIGINAL PROMPT:
${site.prompt}

USER DETAILS:
${details}

Return only the personalised prompt.`

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) throw new Error('VITE_GEMINI_API_KEY is not set in your .env file. Add it and redeploy.')

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: { temperature: 0.6, maxOutputTokens: 3000 },
          }),
        }
      )

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData?.error?.message || `Gemini API returned status ${res.status}`)
      }

      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) throw new Error('Gemini returned an empty response. Please try again.')

      setGeneratedPrompt(text.trim())
      setPhase('result')
    } catch (err) {
      setApiError(err.message || 'Generation failed. Please check your API key and try again.')
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

  // ── Gate ──
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

  return (
    <div className="pp-page">

      {/* ── TOPBAR ── */}
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
          Powered by Gemini AI
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="pp-main">

        {/* ── QUESTIONS PHASE ── */}
        {phase === 'questions' && (
          <>
            {/* Hero */}
            <div className="pp-hero">
              <p className="pp-hero-eyebrow">Personalise this prompt</p>
              <h1 className="pp-hero-title">Make it yours</h1>
              <p className="pp-hero-sub">Answer a few questions and Gemini will rewrite this prompt with your brand, colors, and details injected.</p>
            </div>

            {/* Progress */}
            <div className="pp-progress-wrap">
              <div className="pp-progress-bar">
                <div className="pp-progress-fill" style={{ width: `${progress}%` }}/>
              </div>
              <span className="pp-progress-label">{step + 1} of {totalSteps}</span>
            </div>

            {/* Question card */}
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

            {/* Nav */}
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

            {/* Back for option/color questions */}
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
                Gemini processing
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

            {/* Prompt box */}
            <div className="pp-result-box">
              <div className="pp-result-box-header">
                <div className="pp-result-box-dots">
                  <span/><span/><span/>
                </div>
                <span className="pp-result-box-filename">personalised-prompt.txt</span>
                <span className="pp-result-box-words">{generatedPrompt.split(' ').length} words</span>
              </div>
              <div className="pp-result-box-body">
                <pre className="pp-result-text">
                  {typedPrompt}
                  {!typingDone && <span className="pp-cursor"/>}
                </pre>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pp-result-actions">
              {/* Copy */}
              <button className="pp-action-copy" onClick={handleCopy}>
                {copied
                  ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Copied!</>
                  : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy prompt</>
                }
              </button>

              {/* Build with Lovable */}
              <button className="pp-action-lovable" onClick={openInLovable}>
                <LovableLogo size={20}/>
                Build with Lovable
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </button>

              {/* Download */}
              <button className="pp-action-download" onClick={handleDownload}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {downloaded ? 'Downloaded' : 'Download .txt'}
              </button>
            </div>

            {/* Start over */}
            <button className="pp-restart" onClick={restart}>Start over with different answers</button>
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