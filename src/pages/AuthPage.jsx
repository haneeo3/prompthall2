import { useState } from 'react'
import { supabase } from '../supabase'
import './AuthPage.css'

export default function AuthPage({ onBack, onSuccess, mode = 'signin' }) {
  const [activeMode, setActiveMode] = useState(mode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  function switchMode(m) {
    setActiveMode(m)
    setError('')
    setResetSent(false)
  }

  async function handleSignIn() {
    if (!form.email || !form.password) return setError('Please fill in all fields.')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error) return setError(error.message)
      onSuccess()
    } catch {
      setError('Connection failed. Check your internet and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUp() {
    if (!form.name) return setError('Please enter your full name.')
    if (!form.email || !form.password) return setError('Please fill in all fields.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.name } }
      })
      if (error) return setError(error.message)
      setError('Check your email to confirm your account.')
    } catch {
      setError('Connection failed. Check your internet and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  async function handleResetPassword() {
    if (!form.email) return setError('Enter your email address first.')
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}`,
      })
      if (error) return setError(error.message)
      setResetSent(true)
    } catch {
      setError('Connection failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const GoogleIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )

  return (
    <div className="auth-root">

      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        <button className="back-btn" onClick={activeMode === 'reset' ? () => switchMode('signin') : onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          {activeMode === 'reset' ? 'Back to sign in' : 'Back'}
        </button>

        <div className="auth-form-wrap">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <path d="M6 9h12v2.5H6zM6 14.75h18v2.5H6zM6 20.5h10v2.5H6z" fill="#1A6BFF"/>
              </svg>
            </div>
            <span className="auth-logo-text">PROMPT<strong>HALL</strong></span>
          </div>

          {activeMode !== 'reset' && (
            <div className="auth-tabs">
              <button className={`auth-tab ${activeMode === 'signin' ? 'active' : ''}`} onClick={() => switchMode('signin')}>Sign in</button>
              <button className={`auth-tab ${activeMode === 'signup' ? 'active' : ''}`} onClick={() => switchMode('signup')}>Sign up</button>
            </div>
          )}

          {error && (
            <div className={`auth-message ${error.includes('Check') ? 'success' : 'error'}`}>
              {error}
            </div>
          )}

          {/* ── RESET SENT ── */}
          {activeMode === 'reset' && resetSent ? (
            <div className="reset-sent-wrap">
              <div className="reset-sent-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A6BFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h2 className="auth-title">Check your inbox</h2>
              <p className="reset-hint">We sent a reset link to <strong>{form.email}</strong>. Click the link to set a new password.</p>
              <button className="auth-btn" style={{ marginTop: 24 }} onClick={() => switchMode('signin')}>Back to sign in →</button>
              <p className="auth-switch" style={{ marginTop: 14 }}>
                Didn't get it?{' '}
                <button className="auth-link" onClick={() => { setResetSent(false); handleResetPassword() }}>Resend</button>
              </p>
            </div>

          /* ── RESET FORM ── */
          ) : activeMode === 'reset' ? (
            <div className="auth-form">
              <h2 className="auth-title">Reset password</h2>
              <p className="reset-hint">Enter your email and we'll send you a reset link.</p>
              <div className="form-group" style={{ marginTop: 20 }}>
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} />
              </div>
              <button className="auth-btn" onClick={handleResetPassword} disabled={loading}>
                {loading ? 'Sending…' : 'Send reset link →'}
              </button>
              <p className="auth-switch">
                Remembered it?{' '}
                <button className="auth-link" onClick={() => switchMode('signin')}>Sign in</button>
              </p>
            </div>

          /* ── SIGN IN ── */
          ) : activeMode === 'signin' ? (
            <>
              <button className="google-btn" onClick={handleGoogle}>
                <GoogleIcon />
                Continue with Google
              </button>
              <div className="auth-divider"><span>or</span></div>
              <div className="auth-form">
                <h2 className="auth-title">Welcome back</h2>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <div className="password-label-row">
                    <label className="form-label">Password</label>
                    <button className="forgot-link" onClick={() => switchMode('reset')}>Forgot password?</button>
                  </div>
                  <input type="password" name="password" className="form-input" placeholder="••••••••" value={form.password} onChange={handleChange} />
                </div>
                <button className="auth-btn" onClick={handleSignIn} disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign in →'}
                </button>
                <p className="auth-switch">
                  No account?{' '}
                  <button className="auth-link" onClick={() => switchMode('signup')}>Sign up</button>
                </p>
              </div>
            </>

          /* ── SIGN UP ── */
          ) : (
            <>
              <button className="google-btn" onClick={handleGoogle}>
                <GoogleIcon />
                Continue with Google
              </button>
              <div className="auth-divider"><span>or</span></div>
              <div className="auth-form">
                <h2 className="auth-title">Create account</h2>
                <div className="form-group">
                  <label className="form-label">Full name</label>
                  <input type="text" name="name" className="form-input" placeholder="Your name" value={form.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type="password" name="password" className="form-input" placeholder="••••••••" value={form.password} onChange={handleChange} />
                </div>
                <button className="auth-btn" onClick={handleSignUp} disabled={loading}>
                  {loading ? 'Creating account…' : 'Create account →'}
                </button>
                <p className="auth-switch">
                  Already have an account?{' '}
                  <button className="auth-link" onClick={() => switchMode('signin')}>Sign in</button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div className="pitch-inner">
          <div className="pitch-badge">Now in beta</div>
          <h2 className="pitch-headline">
            The gallery for<br />
            <em>vibe-coded</em><br />
            websites.
          </h2>
          <p className="pitch-body">
            PromptHall is where builders share the prompts behind their AI-built sites. Browse, get inspired, and submit your own.
          </p>
          <div className="pitch-features">
            <div className="pitch-feature"><div className="pf-dot" /><span>Discover real prompts behind real sites</span></div>
            <div className="pitch-feature"><div className="pf-dot" /><span>Submit your vibe-coded builds</span></div>
            <div className="pitch-feature"><div className="pf-dot" /><span>A growing library of AI web inspiration</span></div>
          </div>
          <div className="pitch-stat-row">
            <div className="pitch-stat">
              <span className="ps-num">50+</span>
              <span className="ps-label">Prompts shared</span>
            </div>
            <div className="pitch-divider-v" />
            <div className="pitch-stat">
              <span className="ps-num">1k</span>
              <span className="ps-label">Monthly builders</span>
            </div>
          </div>
        </div>
        <div className="deco-tl" />
        <div className="deco-br" />
      </div>

    </div>
  )
}