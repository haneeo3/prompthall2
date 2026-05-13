import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import './AdminPage.css'

const TABS = ['Pending', 'Approved', 'Users', 'Stats']

export default function AdminPage({ user, isAdmin, onBack }) {
  const [activeTab, setActiveTab] = useState('Pending')
  const [sites, setSites] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editSite, setEditSite] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [toast, setToast] = useState('')

  // Guard — only admin
if (!user || !isAdmin) {
    return (
      <div className="admin-guard">
        <div className="admin-guard-inner">
          <div className="admin-guard-icon">🔒</div>
          <h2>Access denied</h2>
          <p>You don't have permission to view this page.</p>
          <button onClick={onBack}>← Back to gallery</button>
        </div>
      </div>
    )
  }

  useEffect(() => { fetchAll() }, [activeTab])

  async function fetchAll() {
    setLoading(true)
    if (activeTab === 'Pending') {
      const { data } = await supabase.from('sites').select('*').eq('approved', false).order('created_at', { ascending: false })
      setSites(data || [])
    } else if (activeTab === 'Approved') {
      const { data } = await supabase.from('sites').select('*').eq('approved', true).order('created_at', { ascending: false })
      setSites(data || [])
    } else if (activeTab === 'Users') {
      const { data } = await supabase.from('sites').select('author_id, author_name, created_at').order('created_at', { ascending: false })
      // Group by author
      const map = {}
      ;(data || []).forEach(s => {
        if (!map[s.author_id]) map[s.author_id] = { id: s.author_id, name: s.author_name, count: 0, latest: s.created_at }
        map[s.author_id].count++
      })
      setUsers(Object.values(map))
    } else if (activeTab === 'Stats') {
      const [all, approved, pending] = await Promise.all([
        supabase.from('sites').select('id', { count: 'exact' }),
        supabase.from('sites').select('id', { count: 'exact' }).eq('approved', true),
        supabase.from('sites').select('id', { count: 'exact' }).eq('approved', false),
      ])
      const { data: topViewed } = await supabase.from('sites').select('id, title, views, screenshot_url').eq('approved', true).order('views', { ascending: false }).limit(5)
      const { data: recentData } = await supabase.from('sites').select('created_at').eq('approved', true).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      setStats({
        total: all.count || 0,
        approved: approved.count || 0,
        pending: pending.count || 0,
        topViewed: topViewed || [],
        thisWeek: recentData?.length || 0,
      })
    }
    setLoading(false)
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  async function handleApprove(id) {
    setActionId(id)
    await supabase.from('sites').update({ approved: true }).eq('id', id)
    setSites(prev => prev.filter(s => s.id !== id))
    setActionId(null)
    showToast('✓ Site approved and live')
  }

  async function handleReject(id) {
    if (deleteConfirm !== id) { setDeleteConfirm(id); return }
    setActionId(id)
    await supabase.from('sites').delete().eq('id', id)
    setSites(prev => prev.filter(s => s.id !== id))
    setActionId(null)
    setDeleteConfirm(null)
    showToast('Site removed')
  }

  async function handleDelete(id) {
    if (deleteConfirm !== id) { setDeleteConfirm(id); return }
    setActionId(id)
    await supabase.from('sites').delete().eq('id', id)
    setSites(prev => prev.filter(s => s.id !== id))
    setActionId(null)
    setDeleteConfirm(null)
    showToast('Site deleted')
  }

  function openEdit(site) {
    setEditSite(site)
    setEditForm({
      title: site.title || '',
      description: site.description || '',
      url: site.url || '',
      tool: site.tool || '',
      category: site.category || '',
      prompt: site.prompt || '',
    })
  }

  async function handleSaveEdit() {
    if (!editSite) return
    await supabase.from('sites').update(editForm).eq('id', editSite.id)
    setSites(prev => prev.map(s => s.id === editSite.id ? { ...s, ...editForm } : s))
    setEditSite(null)
    showToast('✓ Site updated')
  }

  return (
    <div className="admin-root">

      {/* Toast */}
      {toast && <div className="admin-toast">{toast}</div>}

      {/* Edit modal */}
      {editSite && (
        <div className="admin-modal-backdrop" onClick={() => setEditSite(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Edit site</h3>
              <button className="admin-modal-close" onClick={() => setEditSite(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              {['title', 'description', 'url', 'tool', 'category'].map(field => (
                <div className="admin-field" key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    value={editForm[field]}
                    onChange={e => setEditForm({ ...editForm, [field]: e.target.value })}
                  />
                </div>
              ))}
              <div className="admin-field">
                <label>Prompt</label>
                <textarea
                  rows={6}
                  value={editForm.prompt}
                  onChange={e => setEditForm({ ...editForm, prompt: e.target.value })}
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-ghost" onClick={() => setEditSite(null)}>Cancel</button>
              <button className="admin-btn-primary" onClick={handleSaveEdit}>Save changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <button className="admin-back" onClick={onBack}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Gallery
          </button>
          <div className="admin-title-wrap">
            <h1 className="admin-title">Admin</h1>
            <span className="admin-badge">PromptHall</span>
          </div>
        </div>
        <div className="admin-user">{user.email}</div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="admin-body">

        {/* ── PENDING ── */}
        {activeTab === 'Pending' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Pending review <span className="admin-count">{sites.length}</span></h2>
              <p>Sites submitted by users waiting for approval.</p>
            </div>
            {loading ? <div className="admin-loading">Loading…</div> : sites.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty-icon">🎉</div>
                <p>All caught up — no pending submissions.</p>
              </div>
            ) : (
              <div className="admin-site-list">
                {sites.map(site => (
                  <div key={site.id} className="admin-site-card">
                    <div className="admin-site-thumb">
                      {site.screenshot_url
                        ? <img src={site.screenshot_url} alt={site.title} />
                        : <div className="admin-thumb-placeholder">{site.title?.[0]?.toUpperCase()}</div>
                      }
                    </div>
                    <div className="admin-site-info">
                      <div className="admin-site-top">
                        <span className="admin-site-title">{site.title}</span>
                        <div className="admin-site-meta">
                          <span className="admin-tag">{site.tool}</span>
                          {site.category && <span className="admin-tag admin-tag-cat">{site.category}</span>}
                        </div>
                      </div>
                      <p className="admin-site-desc">{site.description}</p>
                      <div className="admin-site-sub">
                        <span>By {site.author_name}</span>
                        <span>·</span>
                        <a href={site.url} target="_blank" rel="noreferrer">{site.url?.replace(/^https?:\/\//, '').slice(0, 40)}</a>
                        <span>·</span>
                        <span>{new Date(site.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="admin-site-actions">
                        <button
                          className="admin-btn-approve"
                          disabled={actionId === site.id}
                          onClick={() => handleApprove(site.id)}
                        >
                          {actionId === site.id ? 'Approving…' : '✓ Approve'}
                        </button>
                        <button className="admin-btn-edit" onClick={() => openEdit(site)}>✏ Edit</button>
                        <button
                          className={`admin-btn-reject ${deleteConfirm === site.id ? 'confirm' : ''}`}
                          disabled={actionId === site.id}
                          onClick={() => handleReject(site.id)}
                        >
                          {deleteConfirm === site.id ? 'Confirm delete?' : '✕ Reject'}
                        </button>
                        {deleteConfirm === site.id && (
                          <button className="admin-btn-ghost-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── APPROVED ── */}
        {activeTab === 'Approved' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Live sites <span className="admin-count">{sites.length}</span></h2>
              <p>All approved sites currently in the gallery.</p>
            </div>
            {loading ? <div className="admin-loading">Loading…</div> : sites.length === 0 ? (
              <div className="admin-empty"><p>No approved sites yet.</p></div>
            ) : (
              <div className="admin-site-list">
                {sites.map(site => (
                  <div key={site.id} className="admin-site-card">
                    <div className="admin-site-thumb">
                      {site.screenshot_url
                        ? <img src={site.screenshot_url} alt={site.title} />
                        : <div className="admin-thumb-placeholder">{site.title?.[0]?.toUpperCase()}</div>
                      }
                    </div>
                    <div className="admin-site-info">
                      <div className="admin-site-top">
                        <span className="admin-site-title">{site.title}</span>
                        <div className="admin-site-meta">
                          <span className="admin-tag">{site.tool}</span>
                          {site.category && <span className="admin-tag admin-tag-cat">{site.category}</span>}
                          <span className="admin-tag admin-tag-views">👁 {site.views || 0}</span>
                        </div>
                      </div>
                      <p className="admin-site-desc">{site.description}</p>
                      <div className="admin-site-sub">
                        <span>By {site.author_name}</span>
                        <span>·</span>
                        <a href={site.url} target="_blank" rel="noreferrer">{site.url?.replace(/^https?:\/\//, '').slice(0, 40)}</a>
                        <span>·</span>
                        <span>{new Date(site.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="admin-site-actions">
                        <button className="admin-btn-edit" onClick={() => openEdit(site)}>✏ Edit</button>
                        <button
                          className={`admin-btn-reject ${deleteConfirm === site.id ? 'confirm' : ''}`}
                          disabled={actionId === site.id}
                          onClick={() => handleDelete(site.id)}
                        >
                          {deleteConfirm === site.id ? 'Confirm delete?' : '🗑 Delete'}
                        </button>
                        {deleteConfirm === site.id && (
                          <button className="admin-btn-ghost-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── USERS ── */}
        {activeTab === 'Users' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Submitters <span className="admin-count">{users.length}</span></h2>
              <p>Users who have submitted at least one site.</p>
            </div>
            {loading ? <div className="admin-loading">Loading…</div> : users.length === 0 ? (
              <div className="admin-empty"><p>No users yet.</p></div>
            ) : (
              <div className="admin-user-list">
                {users.sort((a, b) => b.count - a.count).map(u => (
                  <div key={u.id} className="admin-user-card">
                    <div className="admin-user-avatar">
                      {u.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="admin-user-info">
                      <span className="admin-user-name">{u.name || 'Anonymous'}</span>
                      <span className="admin-user-sub">{u.count} submission{u.count !== 1 ? 's' : ''} · Last: {new Date(u.latest).toLocaleDateString()}</span>
                    </div>
                    <div className="admin-user-count">{u.count}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STATS ── */}
        {activeTab === 'Stats' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Stats overview</h2>
              <p>A snapshot of PromptHall activity.</p>
            </div>
            {loading ? <div className="admin-loading">Loading…</div> : !stats ? null : (
              <>
                <div className="admin-stat-grid">
                  <div className="admin-stat-card">
                    <span className="admin-stat-num">{stats.total}</span>
                    <span className="admin-stat-label">Total submissions</span>
                  </div>
                  <div className="admin-stat-card admin-stat-card--green">
                    <span className="admin-stat-num">{stats.approved}</span>
                    <span className="admin-stat-label">Live in gallery</span>
                  </div>
                  <div className="admin-stat-card admin-stat-card--yellow">
                    <span className="admin-stat-num">{stats.pending}</span>
                    <span className="admin-stat-label">Pending review</span>
                  </div>
                  <div className="admin-stat-card admin-stat-card--blue">
                    <span className="admin-stat-num">{stats.thisWeek}</span>
                    <span className="admin-stat-label">Approved this week</span>
                  </div>
                </div>

                <div className="admin-top-sites">
                  <h3>Top viewed sites</h3>
                  <div className="admin-top-list">
                    {stats.topViewed.map((site, i) => (
                      <div key={site.id} className="admin-top-item">
                        <span className="admin-top-rank">#{i + 1}</span>
                        {site.screenshot_url && <img src={site.screenshot_url} alt={site.title} className="admin-top-thumb" />}
                        <span className="admin-top-title">{site.title}</span>
                        <span className="admin-top-views">👁 {site.views || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}