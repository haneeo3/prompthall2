import './SearchBar.css'
import { SUGGESTIONS } from '../assets/sites'

export default function SearchBar({ query, onSearch, onSuggest, activeSuggestion }) {
  return (
    <div className="search-section">
      <h1 className="search-tagline">
        Vibe coded sites.<br />
        <span>And the prompts behind them.</span>
      </h1>

      <div className="search-wrapper">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search by category, color, industry, or creator..."
          autoComplete="off"
        />
        <div className="search-kbd">
          <span className="kbd">⌘</span>
          <span className="kbd">K</span>
        </div>
      </div>

      <div className="suggestions">
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            className={`suggestion-pill ${activeSuggestion === s ? 'active' : ''}`}
            onClick={() => onSuggest(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}