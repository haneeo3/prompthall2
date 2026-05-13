import './Navbar.css'

export default function Navbar({ onSubmit, onSignIn, onSignOut, onAdmin, user }) {
  return (
    <nav id="navbar">
      <a href="/" className="nav-logo">
        <svg className="logo-icon" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#1A6BFF"/>
          <path d="M8 10h10v2H8zM8 15h14v2H8zM8 20h8v2H8z" fill="white"/>
          <circle cx="24" cy="22" r="4" fill="white"/>
        </svg>
        <span className="logo-text">PROMPT<span>HALL</span></span>
      </a>

      <div className="nav-right">
        <div className="nav-social">
          <a href="#" className="social-btn" title="Instagram">IG</a>
          <a href="#" className="social-btn" title="X">X</a>
          <a href="#" className="social-btn" title="YouTube">YT</a>
          <a href="#" className="social-btn" title="Reddit">RD</a>
        </div>

        {user ? (
          <>
            <span className="nav-user">
              {user.user_metadata?.full_name || user.email}
            </span>
            <button className="btn-signin" onClick={onSignOut}>Sign out</button>
{user && user.email === 'olajobihaneef@gmail.com' && (
  <a href="#" className="btn-signin" onClick={e => { e.preventDefault(); onAdmin() }}>Admin</a>
)}
          </>
        ) : (
          <a href="#" className="btn-signin" onClick={e => { e.preventDefault(); onSignIn() }}>Sign in</a>
        )}

        <a href="#" className="btn-submit" onClick={e => { e.preventDefault(); onSubmit() }}>+ Submit site</a>
      </div>
    </nav>
  )
}