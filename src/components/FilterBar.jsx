import './FilterBar.css'
import { TOOLS } from '../assets/sites'

const CATEGORIES = [
  'All', 'Business', 'Sports', 'Food', 'SaaS', 'Portfolio', 'E-commerce',
  'Blog', 'Booking', 'Social', 'Education', 'Event', 'Startup',
  'Finance', 'Health', 'Travel', 'Gaming', 'Real Estate', 'Other'
]

export default function FilterBar({ activeTool, onFilter, activeCategory, onCategoryFilter }) {
  return (
    <div className="filter-bar">
      <div className="filter-row">
        <span className="filter-label">Tool:</span>
        <div className="filter-chips">
          {TOOLS.map(tool => (
            <button
              key={tool}
              className={`filter-chip ${activeTool === tool ? 'active' : ''}`}
              onClick={() => onFilter(tool)}
            >
              {tool === 'all' ? 'All' : tool.charAt(0).toUpperCase() + tool.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-row">
        <span className="filter-label">Category:</span>
        <div className="filter-chips">
          {CATEGORIES.map(cat => {
            const val = cat === 'All' ? 'all' : cat
            return (
              <button
                key={cat}
                className={`filter-chip ${activeCategory === val ? 'active' : ''}`}
                onClick={() => onCategoryFilter(val)}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}