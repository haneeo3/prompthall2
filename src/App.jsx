import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { supabase } from './supabase'
import Gallery from './pages/Gallery'
import SitePage from './pages/SitePage'
import SubmitPage from './pages/SubmitPage'
import AuthPage from './pages/AuthPage'
import NotFound from './pages/NotFound'
import AdminPage from './pages/AdminPage'
import PersonalizePage from './pages/PersonalizePage'
import './index.css'

function AppRoutes() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()

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
      setTimeout(() => setIsAdmin(false), 0)
      return
    }
    supabase.from('admins').select('email').eq('email', user.email).single()
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
          onViewSite={site => navigate(`/site/${site.id}`)}
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

      <Route path="/site/personalise/:id" element={
        <PersonalisePageWrapper user={user} onSignIn={() => navigate('/auth')} />
      } />

      <Route path="/personalise/:id" element={
        <PersonalisePageWrapper user={user} onSignIn={() => navigate('/auth')} />
      } />

      <Route path="/submit" element={
        <SubmitPage onBack={() => navigate('/')} user={user} />
      } />

      <Route path="/auth" element={
        <AuthPage onBack={() => navigate('/')} onSuccess={() => navigate('/')} />
      } />

      <Route path="/admin" element={
        <AdminPage user={user} isAdmin={isAdmin} onBack={() => navigate('/')} />
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function SitePageWrapper({ user, onSignIn }) {
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

  return (
    <SitePage
      site={site}
      onBack={() => navigate('/')}
      user={user}
      onSignIn={onSignIn}
      onPersonalise={() => navigate(`/site/${id}/personalise`)}
    />
  )
}

function PersonalisePageWrapper({ user, onSignIn }) {
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

  return (
    <PersonalizePage
      site={site}
      onBack={() => navigate(`/site/${id}`)}
      user={user}
      onSignIn={onSignIn}
    />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}