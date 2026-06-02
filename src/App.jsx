import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom'
import { supabase } from './supabase'
import Gallery from './pages/Gallery'
import SitePage from './pages/SitePage'
import SubmitPage from './pages/SubmitPage'
import AuthPage from './pages/AuthPage'
import NotFound from './pages/NotFound'
import AdminPage from './pages/AdminPage'
import PrivacyPolicy from './pages/Privacypolicy'
import DMCAPage from './pages/Dmcapage'
import CookiePolicy from './pages/Cookiepolicy'
import PersonalizePage from './pages/Personalizepage'
import './index.css'

function AppRoutes() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) { 
      setIsAdmin(false)
      return 
    }
    supabase.from('admins').select('email').eq('email', user.email).maybeSingle()
      .then(({ data }) => setIsAdmin(!!data))
  }, [user])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/')
  }

  return (
    <Routes>
      <Route path="/" element={
        <Gallery
          onViewSite={site => navigate(`/site/${site.id}`, { state: { site } })}
          onSubmit={() => navigate('/submit')}
          onSignIn={() => navigate('/auth')}
          onSignOut={handleSignOut}
          onAdmin={() => navigate('/admin')}
          user={user}
          isAdmin={isAdmin}
        />
      } />
      <Route path="/site/:id" element={
        <SitePageWrapper user={user} onSignIn={() => navigate('/auth')} />
      } />
      <Route path="/submit" element={
        <SubmitPage onBack={() => navigate('/')} user={user} />
      } />
      <Route path="/auth" element={
        <AuthPage onBack={() => navigate('/')} onSuccess={() => navigate('/')} />
      } />
      <Route path="/personalise/:id" element={
        <PersonalizePageWrapper user={user} onSignIn={() => navigate('/auth')} />
      } />
      <Route path="/admin" element={
        <AdminPage user={user} isAdmin={isAdmin} onBack={() => navigate('/')} />
      } />
      <Route path="/privacy" element={<PrivacyPolicy onBack={() => navigate(-1)} />} />
      <Route path="/dmca" element={<DMCAPage onBack={() => navigate(-1)} />} />
      <Route path="/cookies" element={<CookiePolicy onBack={() => navigate(-1)} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function SitePageWrapper({ user, onSignIn }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Pull site data immediately if passed from the Gallery navigation state
  const [site, setSite] = useState(location.state?.site || null)
  const [loading, setLoading] = useState(!location.state?.site)
  const [dbError, setDbError] = useState(null)

  useEffect(() => {
    async function fetchSite() {
      const { data, error } = await supabase
        .from('sites')
        .select('id, title, description, screenshot_url, tool, tags, author_name, tech_stack, color_reason, font_style, layout_style, category, video_url, github_url, url, prompt_preview, approved, ratings(rating)')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error("Supabase Error details:", error)
        setDbError(error.message)
      } else if (data) {
        setSite(data)
      }
      setLoading(false)
    }
    
    fetchSite()
  }, [id])

  if (loading && !site) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>
  }

  if (!site) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#ef4444' }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Site not found</h3>
        {dbError && (
          <p style={{ color: '#6b7280', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
            Database Error: {dbError}
          </p>
        )}
      </div>
    )
  }

  return <SitePage site={site} onBack={() => navigate('/')} user={user} onSignIn={onSignIn} />
}

function PersonalizePageWrapper({ user, onSignIn }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSite() {
      const { data, error } = await supabase
        .from('sites').select('*').eq('id', id).single()
      if (!error && data) setSite(data)
      setLoading(false)
    }
    fetchSite()
  }, [id])

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>
  if (!site) return <div style={{ padding: 40, textAlign: 'center' }}>Site not found.</div>

  return <PersonalizePage site={site} onBack={() => navigate(`/site/${id}`)} user={user} onSignIn={onSignIn} />
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}