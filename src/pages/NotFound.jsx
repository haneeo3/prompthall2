import { useNavigate } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="notfound">
      <div className="notfound-inner">
        <div className="notfound-code">404</div>
        <h1 className="notfound-title">Page not found.</h1>
        <p className="notfound-desc">The page you're looking for doesn't exist or was moved.</p>
        <button className="notfound-btn" onClick={() => navigate('/')}>
          ← Back to gallery
        </button>
      </div>
    </div>
  )
}