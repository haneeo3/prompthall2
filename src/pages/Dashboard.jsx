import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import './Dashboard.css'

const TABS = ['Saved', 'Unlocked', 'Personalised']

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function Dashboard({ user, onSignIn, onBack }) {
  const [activeTab, setActiveTab] = useState('Saved')
  const [saved, setSaved] = useState([])
  const [unlocked, setUnlocked] = useState([])
  const [personalised, setPersonalised] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    fetchAll()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchAll() {
    setLoading(true)
    try {
      // Saved — bookmarks
      const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('*, sites(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      // Unlocked — prompt_unlocks + prompt_access
      const { data: unlocks } = await supabase
        .from('prompt_unlocks')
        .select('*, sites(*)')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false })

      // Personalised — prompt_purchases that are paid
      const { data: purchases } = await supabase
        .from('prompt_purchases')
        .select('*, sites(*)')
        .eq('user_id', user.id)
        .eq('paid', true)
        .order('created_at', { ascending: false })

      setSaved(bookmarks || [])
      setUnlocked(unlocks || [])
      setPersonalised(purchases || [])
    } catch { /* silent */ }
    setLoading(false)
  }

  async function handleRemoveBookmark(siteId) {
    await supabase.from('bookmarks').delete()
      .eq('user_id', user.id).eq('site_id', siteId)
    setSaved(prev => prev.filter(b => b.site_id !== siteId))
  }

  if (!user) {
    return (
      <div className="dash-gate">
        <button className="dash-back" onClick={onBack}>← Back</button>
        <div className="dash-gate-card">
          <h2>Sign in to view your dashboard</h2>
          <button className="dash-btn-primary" onClick={onSignIn}>Sign in →</button>
        </div>
      </div>
    )
  }

  const initials = (user.user_metadata?.full_name || user.email || 'U')
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="dash-page">
      {/* Header */}
      <div className="dash-header">
        <button className="dash-back" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to gallery
        </button>
        <div className="dash-profile">
          <div className="dash-avatar">{initials}</div>
          <div>
            <p className="dash-name">{user.user_metadata?.full_name || user.email?.split('@')[0]}</p>
            <p className="dash-email">{user.email}</p>
          </div>
        </div>
        <div className="dash-stats">
          <div className="dash-stat">
            <span className="dash-stat-val">{saved.length}</span>
            <span className="dash-stat-label">Saved</span>
          </div>
          <div className="dash-stat">
            <span className="dash-stat-val">{unlocked.length}</span>
            <span className="dash-stat-label">Unlocked</span>
          </div>
          <div className="dash-stat">
            <span className="dash-stat-val">{personalised.length}</span>
            <span className="dash-stat-label">Personalised</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`dash-tab ${activeTab === tab ? 'dash-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            <span className="dash-tab-count">
              {tab === 'Saved' ? saved.length : tab === 'Unlocked' ? unlocked.length : personalised.length}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="dash-content">
        {loading ? (
          <div className="dash-loading">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="dash-skeleton">
                <div className="dash-skel-img"/>
                <div className="dash-skel-body">
                  <div className="dash-skel-line" style={{ width: '60%' }}/>
                  <div className="dash-skel-line" style={{ width: '40%' }}/>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'Saved' ? (
          saved.length === 0 ? (
            <div className="dash-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
              <p>No saved prompts yet</p>
              <span>Click the bookmark icon on any site to save it here</span>
              <button className="dash-btn-primary" onClick={onBack}>Browse gallery →</button>
            </div>
          ) : (
            <div className="dash-grid">
              {saved.map(b => (
                <div key={b.id} className="dash-card" onClick={() => navigate(`/site/${b.site_id}`)}>
                  {b.sites?.screenshot_url
                    ? <img src={b.sites.screenshot_url} alt={b.sites.title} className="dash-card-img"/>
                    : <div className="dash-card-placeholder">{b.sites?.title?.toUpperCase()}</div>
                  }
                  <div className="dash-card-body">
                    <p className="dash-card-title">{b.sites?.title || 'Untitled'}</p>
                    <p className="dash-card-meta">{b.sites?.tool} · Saved {timeAgo(b.created_at)}</p>
                    <div className="dash-card-actions">
                      <button className="dash-card-btn" onClick={e => { e.stopPropagation(); navigate(`/site/${b.site_id}`) }}>
                        View prompt →
                      </button>
                      <button className="dash-card-btn dash-card-btn--ghost" onClick={e => { e.stopPropagation(); handleRemoveBookmark(b.site_id) }}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : activeTab === 'Unlocked' ? (
          unlocked.length === 0 ? (
            <div className="dash-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <p>No unlocked prompts yet</p>
              <span>Unlock prompts from the gallery to see them here</span>
              <button className="dash-btn-primary" onClick={onBack}>Browse gallery →</button>
            </div>
          ) : (
            <div className="dash-grid">
              {unlocked.map(u => (
                <div key={u.id} className="dash-card" onClick={() => navigate(`/site/${u.site_id}`)}>
                  {u.sites?.screenshot_url
                    ? <img src={u.sites.screenshot_url} alt={u.sites.title} className="dash-card-img"/>
                    : <div className="dash-card-placeholder">{u.sites?.title?.toUpperCase()}</div>
                  }
                  <div className="dash-card-body">
                    <p className="dash-card-title">{u.sites?.title || 'Untitled'}</p>
                    <p className="dash-card-meta">{u.sites?.tool} · Unlocked {timeAgo(u.unlocked_at)}</p>
                    <button className="dash-card-btn" onClick={e => { e.stopPropagation(); navigate(`/site/${u.site_id}`) }}>
                      View prompt →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          personalised.length === 0 ? (
            <div className="dash-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <p>No personalised prompts yet</p>
              <span>Personalise a prompt to see it here</span>
              <button className="dash-btn-primary" onClick={onBack}>Browse gallery →</button>
            </div>
          ) : (
            <div className="dash-grid">
              {personalised.map(p => (
                <div key={p.id} className="dash-card">
                  {p.sites?.screenshot_url
                    ? <img src={p.sites.screenshot_url} alt={p.sites.title} className="dash-card-img"/>
                    : <div className="dash-card-placeholder">{p.sites?.title?.toUpperCase()}</div>
                  }
                  <div className="dash-card-body">
                    <p className="dash-card-title">{p.sites?.title || 'Untitled'}</p>
                    <p className="dash-card-meta">Personalised {timeAgo(p.created_at)}</p>
                    <div className="dash-card-actions">
                      <button className="dash-card-btn" onClick={() => {
                        const blob = new Blob([p.generated_prompt], { type: 'text/plain' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `${(p.sites?.title || 'prompt').replace(/\s+/g, '-').toLowerCase()}-personalised.txt`
                        a.click()
                        URL.revokeObjectURL(url)
                      }}>
                        Download .txt
                      </button>
                      <button className="dash-card-btn dash-card-btn--ghost" onClick={() => navigate(`/personalise/${p.site_id}`)}>
                        Personalise again
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}