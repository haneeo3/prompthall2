import { useState, useRef, useEffect } from 'react'
import { supabase } from '../supabase'
import './SubmitPage.css'

const TOOLS = [
  'Cursor', 'Bolt', 'v0', 'Lovable', 'Replit', 'Windsurf',
  'GitHub Copilot', 'Claude', 'ChatGPT', 'Gemini', 'Codeium',
  'Zed AI', 'Cline', 'Aider', 'Continue', 'Other'
]

const TECH_STACKS = [
  'React', 'Next.js', 'Vue', 'Nuxt', 'Svelte', 'SvelteKit',
  'Astro', 'Remix', 'HTML / CSS / JS', 'Angular',
  'Tailwind CSS', 'Node.js', 'Express', 'FastAPI', 'Django',
  'Laravel', 'Ruby on Rails', 'Supabase', 'Firebase', 'PocketBase',
  'Vercel', 'Netlify', 'Cloudflare Pages', 'Other'
]

const CATEGORIES = [
  'Business', 'Sports', 'Food', 'SaaS', 'Portfolio', 'E-commerce',
  'Blog', 'Booking', 'Social', 'Education', 'Event', 'Startup',
  'Finance', 'Health', 'Travel', 'Gaming', 'Real Estate', 'Other'
]

const FONT_STYLES = [
  'Serif', 'Sans-serif', 'Monospace', 'Display / Decorative',
  'Handwritten', 'Mixed', 'System default'
]

const LAYOUT_STYLES = [
  'Minimal / Clean', 'Bold / Maximalist', 'Editorial / Magazine',
  'Dashboard / Data', 'Landing page', 'Card-based', 'One-pager',
  'Dark mode', 'Glassmorphism', 'Brutalist', 'Retro / Vintage', 'Other'
]

function Dropdown({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="dd" ref={ref}>
      <button type="button" className={`dd-btn ${value ? 'has-value' : ''}`} onClick={() => setOpen(o => !o)}>
        <span>{value || placeholder}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div className="dd-menu">
          <div className="dd-search">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input autoFocus type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="dd-list">
            {filtered.length === 0
              ? <p className="dd-empty">No results</p>
              : filtered.map(opt => (
                <button type="button" key={opt} className={`dd-item ${value === opt ? 'active' : ''}`}
                  onClick={() => { onChange(opt); setOpen(false); setSearch('') }}>
                  {opt}
                  {value === opt && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  )}
                </button>
              ))
            }
          </div>
        </div>
      )}
    </div>
  )
}

function MultiDropdown({ options, value, onChange, placeholder, max = 3 }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch('') }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggle(opt) {
    if (value.includes(opt)) onChange(value.filter(v => v !== opt))
    else if (value.length < max) onChange([...value, opt])
  }

  return (
    <div className="dd" ref={ref}>
      <button type="button" className={`dd-btn ${value.length > 0 ? 'has-value' : ''}`} onClick={() => setOpen(o => !o)}>
        <span>{value.length === 0 ? placeholder : value.join(', ')}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div className="dd-menu">
          <div className="dd-search">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input autoFocus type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="dd-list">
            {filtered.length === 0
              ? <p className="dd-empty">No results</p>
              : filtered.map(opt => (
                <button type="button" key={opt}
                  className={`dd-item ${value.includes(opt) ? 'active' : ''} ${value.length >= max && !value.includes(opt) ? 'dd-item-disabled' : ''}`}
                  onClick={() => toggle(opt)}>
                  {opt}
                  {value.includes(opt) && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  )}
                </button>
              ))
            }
          </div>
          {value.length > 0 && <div className="dd-footer">{value.length}/{max} selected</div>}
        </div>
      )}
    </div>
  )
}

function TagInput({ tags, onChange, max = 6 }) {
  const [input, setInput] = useState('')

  function addTag(raw) {
    const val = raw.trim().toLowerCase().replace(/\s+/g, '-')
    if (!val || tags.includes(val) || tags.length >= max) return
    onChange([...tags, val])
    setInput('')
  }

  function handleKey(e) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input) }
    else if (e.key === 'Backspace' && input === '' && tags.length > 0) onChange(tags.slice(0, -1))
  }

  return (
    <div className="tag-input-wrap">
      <div className="tag-input-box">
        {tags.map(t => (
          <span key={t} className="tag-pill">
            #{t}
            <button type="button" className="tag-remove" onClick={() => onChange(tags.filter(x => x !== t))}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </span>
        ))}
        {tags.length < max && (
          <input type="text" className="tag-text-input"
            placeholder={tags.length === 0 ? 'Type a tag and press Enter…' : 'Add another…'}
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey} onBlur={() => addTag(input)} />
        )}
      </div>
      <p className="tag-hint">{tags.length}/{max} tags · press Enter or comma to add</p>
    </div>
  )
}

// ── MY SUBMISSIONS FLOATING PANEL ──
function MySubmissions({ user, onEdit }) {
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    if (!user) return
    fetchMySites()
  }, [user])

  async function fetchMySites() {
    const { data, error } = await supabase
      .from('sites')
      .select('id, title, url, approved, created_at, screenshot_url, tool')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })
    if (!error) setSites(data || [])
    setLoading(false)
  }

  async function handleDelete(id) {
    if (deleteConfirm !== id) { setDeleteConfirm(id); return }
    const { error } = await supabase.from('sites').delete().eq('id', id).eq('author_id', user.id)
    if (!error) setSites(prev => prev.filter(s => s.id !== id))
    setDeleteConfirm(null)
  }

  // Only show if user has at least one submission
  if (loading || sites.length === 0) return null

  return (
    <>
      {/* Floating trigger button — top right */}
      <button className="msub-trigger" onClick={() => setOpen(true)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        My submissions
        <span className="msub-badge">{sites.length}</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div className="msub-backdrop" onClick={() => { setOpen(false); setDeleteConfirm(null) }} />
      )}

      {/* Slide-in drawer */}
      <div className={`msub-drawer ${open ? 'open' : ''}`}>
        <div className="msub-drawer-header">
          <div className="msub-drawer-title">
            My submissions
            <span className="msub-drawer-count">{sites.length}</span>
          </div>
          <button className="msub-close" onClick={() => { setOpen(false); setDeleteConfirm(null) }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="msub-list">
          {sites.map(site => (
            <div key={site.id} className="msub-card">
              {site.screenshot_url
                ? <img src={site.screenshot_url} alt={site.title} className="msub-thumb" />
                : <div className="msub-thumb-placeholder">{site.title?.[0]?.toUpperCase()}</div>
              }
              <div className="msub-info">
                <div className="msub-top">
                  <span className="msub-title">{site.title}</span>
                  <span className={`msub-status ${site.approved ? 'approved' : 'pending'}`}>
                    {site.approved ? '✓ Live' : '⏳ Pending'}
                  </span>
                </div>
                {site.url && (
                  <a href={site.url} target="_blank" rel="noreferrer" className="msub-url">
                    {site.url.replace(/^https?:\/\//, '')}
                  </a>
                )}
                <div className="msub-actions">
                  <button
                    className="msub-btn msub-edit"
                    onClick={() => { onEdit(site.id); setOpen(false) }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className={`msub-btn msub-delete ${deleteConfirm === site.id ? 'confirming' : ''}`}
                    onClick={() => handleDelete(site.id)}
                  >
                    {deleteConfirm === site.id ? 'Confirm?' : '🗑 Delete'}
                  </button>
                  {deleteConfirm === site.id && (
                    <button className="msub-btn msub-cancel" onClick={() => setDeleteConfirm(null)}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

const EMPTY_FORM = {
  title: '', description: '', url: '', github: '', prompt: '',
  tool: '', category: '', techStack: [], colorReason: '', fontStyle: '', layoutStyle: '',
}

export default function SubmitPage({ onBack, user }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [tags, setTags] = useState([])
  const [screenshot, setScreenshot] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const formRef = useRef(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  function handleScreenshot(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return setError('Screenshot must be under 5MB')
    setScreenshot(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleEdit(id) {
    const { data, error } = await supabase.from('sites').select('*').eq('id', id).single()
    if (error || !data) return

    const rawTags = data.tags || []

setForm({
  title:        data.title || '',
  description:  data.description || '',
  url:          data.url || '',
  github:       data.github_url || '',
  prompt:       data.prompt || '',
  tool:         TOOLS.find(t => t.toLowerCase() === data.tool) || data.tool || '',
  category:     data.category || '',   // ← changed
  techStack:    data.tech_stack || [],
  colorReason:  data.color_reason || '',
  fontStyle:    data.font_style || '',
  layoutStyle:  data.layout_style || '',
})
setTags(rawTags)                       // ← changed (no more filtering)
    setPreview(data.screenshot_url || null)
    setEditingId(id)
    setError('')

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  function handleCancelEdit() {
    setForm(EMPTY_FORM)
    setTags([])
    setScreenshot(null)
    setPreview(null)
    setEditingId(null)
    setError('')
  }

  async function handleSubmit() {
    if (!user) return setError('You must be signed in to submit a site.')

    if (!editingId) {
      const { data: existing } = await supabase
        .from('sites').select('id').eq('author_id', user.id)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      if (existing && existing.length >= 3) return setError('You can only submit 3 sites per day.')
    }

    if (!form.title)       return setError('Site name is required.')
    if (!form.url)         return setError('Site URL is required.')
    if (!form.description) return setError('Description is required.')
    if (!form.tool)        return setError('Please select a tool.')
    if (!form.category)    return setError('Please select a category.')
    if (!form.prompt)      return setError('Prompt is required.')
    if (!editingId && !screenshot) return setError('Screenshot is required.')

    setLoading(true)

    let screenshotUrl = preview

    if (screenshot) {
      const fileExt = screenshot.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('screenshots').upload(fileName, screenshot)
      if (uploadError) { setLoading(false); return setError('Screenshot upload failed. Try again.') }
      const { data: urlData } = supabase.storage.from('screenshots').getPublicUrl(fileName)
      screenshotUrl = urlData.publicUrl
    }

    const allTags = [...new Set(tags)]

const payload = {
  title:          form.title,
  description:    form.description,
  url:            form.url,
  github_url:     form.github || null,
  prompt:         form.prompt,
  tool:           form.tool.toLowerCase(),
  category:       form.category,
  tech_stack:     form.techStack,
  tags:           allTags,
  color_reason:   form.colorReason || null,
  font_style:     form.fontStyle || null,
  layout_style:   form.layoutStyle || null,
  screenshot_url: screenshotUrl,
}

    if (editingId) {
      const { error: updateError } = await supabase
        .from('sites')
        .update({ ...payload, approved: false })
        .eq('id', editingId)
        .eq('author_id', user.id)

      setLoading(false)
      if (updateError) return setError('Update failed. Try again.')
      setSuccess(true)
      setEditingId(null)
    } else {
      const { error: insertError } = await supabase.from('sites').insert({
        ...payload,
        author_id:   user.id,
        author_name: user.user_metadata?.full_name || user.email,
        approved:    false,
      })

      setLoading(false)
      if (insertError) return setError('Submission failed. Try again.')
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="sp">
        <div className="sp-success">
          <div className="sp-success-icon">✓</div>
          <h2>{editingId ? 'Site updated!' : 'Site submitted!'}</h2>
          <p>
            {editingId
              ? 'Your changes have been saved and sent for review.'
              : "We'll review it within 24 hours. Once approved it goes live in the gallery."
            }
          </p>
          <button type="button" className="sp-btn" onClick={onBack}>Back to gallery</button>
        </div>
      </div>
    )
  }

  return (
    <div className="sp">

      {/* ── FLOATING MY SUBMISSIONS — only shows if user has submissions ── */}
      {user && (
        <MySubmissions user={user} onEdit={handleEdit} />
      )}

      <button type="button" className="sp-back" onClick={onBack}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back to gallery
      </button>

      <div className="sp-header" ref={formRef}>
        <h1>{editingId ? 'Edit your site' : 'Submit your site'}</h1>
        <p>
          {editingId
            ? 'Update your submission details below. It will go back to pending review.'
            : 'Share your vibe coded site and the prompt that built it.'
          }
        </p>
      </div>

      {editingId && (
        <div className="sp-editing-banner">
          ✏️ You're editing an existing submission.
          <button type="button" className="sp-cancel-edit" onClick={handleCancelEdit}>
            Cancel edit
          </button>
        </div>
      )}

      {!user && <div className="sp-warn">You need to sign in before submitting a site.</div>}
      {error && <div className="sp-error">{error}</div>}

      <div className="sp-layout">
        <div className="sp-form">

          <div className="sp-section-label">Core info</div>

          <div className="sp-field">
            <label>Site name <span>*</span></label>
            <input type="text" name="title" placeholder="e.g. FarmFlow Dashboard" value={form.title} onChange={handleChange} />
          </div>

          <div className="sp-field">
            <label>Site URL <span>*</span></label>
            <input type="url" name="url" placeholder="https://yoursite.com" value={form.url} onChange={handleChange} />
          </div>

          <div className="sp-field">
            <label>GitHub profile <em>— optional</em></label>
            <div className="sp-input-icon-wrap">
              <svg className="sp-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              <input type="url" name="github" placeholder="https://github.com/yourusername" value={form.github} onChange={handleChange} className="sp-has-icon" />
            </div>
          </div>

          <div className="sp-field">
            <label>Short description <span>*</span></label>
            <input type="text" name="description" placeholder="What does this site do?" value={form.description} onChange={handleChange} />
          </div>

          <div className="sp-row">
            <div className="sp-field">
              <label>Tool used <span>*</span></label>
              <Dropdown options={TOOLS} value={form.tool} onChange={v => setForm({ ...form, tool: v })} placeholder="Select a tool…" />
            </div>
            <div className="sp-field">
              <label>Category <span>*</span></label>
              <Dropdown options={CATEGORIES} value={form.category} onChange={v => setForm({ ...form, category: v })} placeholder="Select a category…" />
            </div>
          </div>

          <div className="sp-field">
            <label>Tech stack <em>— pick up to 3</em></label>
            <MultiDropdown options={TECH_STACKS} value={form.techStack} onChange={v => setForm({ ...form, techStack: v })} placeholder="Select technologies…" max={3} />
            {form.techStack.length > 0 && (
              <div className="sp-chip-row">
                {form.techStack.map(t => (
                  <span key={t} className="sp-chip">
                    {t}
                    <button type="button" onClick={() => setForm({ ...form, techStack: form.techStack.filter(x => x !== t) })}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="sp-field">
            <label>Tags <em>— add your own, up to 6</em></label>
            <TagInput tags={tags} onChange={setTags} max={6} />
          </div>

          <div className="sp-section-label">Screenshot</div>

          <div className="sp-field">
            <label>Homepage screenshot {!editingId && <span>*</span>}</label>
            <div className="sp-upload">
              {preview
                ? <img src={preview} alt="preview" className="sp-preview" />
                : (
                  <>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <p>Click to upload screenshot</p>
                    <span>PNG or JPG · max 5MB</span>
                  </>
                )
              }
              <input type="file" accept="image/*" onChange={handleScreenshot} />
            </div>
            {editingId && <p className="tag-hint">Leave unchanged to keep existing screenshot</p>}
          </div>

          <div className="sp-section-label">Design context <span className="sp-section-opt">optional but encouraged</span></div>

          <div className="sp-field">
            <label>Color choices <em>— why those colors?</em></label>
            <textarea name="colorReason" placeholder="e.g. I used deep navy and gold because I wanted it to feel premium…" rows={3} value={form.colorReason} onChange={handleChange} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }} />
          </div>

          <div className="sp-row">
            <div className="sp-field">
              <label>Font style</label>
              <Dropdown options={FONT_STYLES} value={form.fontStyle} onChange={v => setForm({ ...form, fontStyle: v })} placeholder="Choose font style…" />
            </div>
            <div className="sp-field">
              <label>Layout style</label>
              <Dropdown options={LAYOUT_STYLES} value={form.layoutStyle} onChange={v => setForm({ ...form, layoutStyle: v })} placeholder="Choose layout style…" />
            </div>
          </div>

          <div className="sp-section-label">The prompt</div>

          <div className="sp-field">
            <label>Full prompt used <span>*</span> <em>— paste the exact prompt</em></label>
            <textarea name="prompt" placeholder="Paste the full prompt you used to build this site…" rows={8} value={form.prompt} onChange={handleChange} />
          </div>

          <div className="sp-form-actions">
            <button type="button" className="sp-btn" onClick={handleSubmit} disabled={loading}>
              {loading
                ? (editingId ? 'Saving…' : 'Submitting…')
                : (editingId ? 'Save changes →' : 'Submit site →')
              }
            </button>
            {editingId && (
              <button type="button" className="sp-btn-ghost" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>

        </div>

        <div className="sp-sidebar">
          <div className="sp-card">
            <h3>Tips for a good submission</h3>
            <ul>
              <li>Show the <strong>homepage</strong> in your screenshot</li>
              <li>Include the <strong>full prompt</strong> — not just a summary</li>
              <li>Make sure the <strong>live URL</strong> is working and public</li>
              <li>Pick the most <strong>accurate category</strong> for better discovery</li>
              <li>Add a few tags so builders can find your work</li>
              <li>Share your color reasoning — it helps others learn</li>
            </ul>
          </div>

          <div className="sp-card">
            <h3>What happens next?</h3>
            <div className="sp-steps">
              <div className="sp-step">
                <div className="sp-step-num">1</div>
                <p>We review your submission within 24 hours</p>
              </div>
              <div className="sp-step">
                <div className="sp-step-num">2</div>
                <p>Approved sites go live in the gallery</p>
              </div>
              <div className="sp-step">
                <div className="sp-step-num">3</div>
                <p>You earn when your prompt gets unlocked</p>
              </div>
            </div>
          </div>

          <div className="sp-card sp-card-info">
            <h3>Why design context?</h3>
            <p>Sharing <em>why</em> you chose certain colors, fonts, and layouts turns your submission into a learning resource — not just a gallery entry.</p>
          </div>
        </div>
      </div>
    </div>
  )
}