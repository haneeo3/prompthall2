import { useEffect, useState } from 'react'
import './UpgradeModal.css'

const MONTHLY_PLAN = import.meta.env.VITE_PAYSTACK_PLAN_MONTHLY
const YEARLY_PLAN = import.meta.env.VITE_PAYSTACK_PLAN_YEARLY
const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

export default function UpgradeModal({ user, onClose, onSuccess }) {
  const [billing, setBilling] = useState('monthly')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handlePaystack() {
    if (!user) return
    setLoading(true)

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_KEY,
      email: user.email,
      plan: billing === 'monthly' ? MONTHLY_PLAN : YEARLY_PLAN,
      currency: 'NGN',
      callback: function(response) {
        setLoading(false)
        if (response.status === 'success') {
          onSuccess(response)
        }
      },
      onClose: function() {
        setLoading(false)
      }
    })

    handler.openIframe()
  }

  const monthlyPrice = '₦11,999'
  const yearlyPrice = '₦99,999'
  const yearlyMonthly = '₦8,333'
  const saving = '31%'

  return (
    <div className="upgrade-backdrop" onClick={onClose}>
      <div className="upgrade-modal" onClick={e => e.stopPropagation()}>
        <button className="upgrade-close" onClick={onClose}>✕</button>

        <div className="upgrade-header">
          <div className="upgrade-illustration">
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background circle */}
    <circle cx="60" cy="60" r="56" fill="#EEF3FF" />
    
    {/* Stars */}
    <circle cx="25" cy="30" r="2" fill="#1A6BFF" opacity="0.4"/>
    <circle cx="95" cy="25" r="1.5" fill="#1A6BFF" opacity="0.3"/>
    <circle cx="100" cy="70" r="2" fill="#1A6BFF" opacity="0.4"/>
    <circle cx="18" cy="75" r="1.5" fill="#1A6BFF" opacity="0.3"/>
    <circle cx="40" cy="15" r="1" fill="#1A6BFF" opacity="0.5"/>
    <circle cx="85" cy="95" r="1" fill="#1A6BFF" opacity="0.4"/>
    <circle cx="30" cy="95" r="1.5" fill="#1A6BFF" opacity="0.3"/>
    <circle cx="90" cy="45" r="1" fill="#1A6BFF" opacity="0.5"/>

    {/* Rocket trail */}
    <ellipse cx="67" cy="82" rx="5" ry="12" fill="#FFD166" opacity="0.6" transform="rotate(-35 67 82)"/>
    <ellipse cx="64" cy="87" rx="3" ry="8" fill="#FF6B35" opacity="0.4" transform="rotate(-35 64 87)"/>

    {/* Rocket body */}
    <path d="M60 28 C60 28 45 45 45 65 L60 72 L75 65 C75 45 60 28 60 28Z" fill="#1A6BFF"/>
    
    {/* Rocket nose */}
    <path d="M60 28 C60 28 52 38 52 45 L60 42 L68 45 C68 38 60 28 60 28Z" fill="#0A3FCC"/>
    
    {/* Rocket window */}
    <circle cx="60" cy="54" r="6" fill="white" opacity="0.9"/>
    <circle cx="60" cy="54" r="4" fill="#EEF3FF"/>
    <circle cx="60" cy="54" r="2" fill="#1A6BFF" opacity="0.6"/>

    {/* Rocket fins */}
    <path d="M45 65 L38 78 L52 70Z" fill="#0A3FCC"/>
    <path d="M75 65 L82 78 L68 70Z" fill="#0A3FCC"/>

    {/* Rocket exhaust */}
    <ellipse cx="60" cy="73" rx="6" ry="4" fill="#FFD166"/>
    <ellipse cx="60" cy="76" rx="4" ry="3" fill="#FF6B35" opacity="0.8"/>

    {/* Sparkles */}
    <path d="M35 48 L37 44 L39 48 L43 50 L39 52 L37 56 L35 52 L31 50Z" fill="#FFD166" opacity="0.8"/>
    <path d="M80 38 L81.5 35 L83 38 L86 39.5 L83 41 L81.5 44 L80 41 L77 39.5Z" fill="#FFD166" opacity="0.6"/>
  </svg>
</div>
          <h2>Upgrade to Pro</h2>
          <p>Unlock unlimited prompts and AI customization</p>
        </div>

        {/* Billing toggle */}
        <div className="upgrade-toggle">
          <button
            className={`toggle-btn ${billing === 'monthly' ? 'active' : ''}`}
            onClick={() => setBilling('monthly')}
          >
            Monthly
          </button>
          <button
            className={`toggle-btn ${billing === 'yearly' ? 'active' : ''}`}
            onClick={() => setBilling('yearly')}
          >
            Yearly
            <span className="save-badge">Save {saving}</span>
          </button>
        </div>

        {/* Price display */}
        <div className="upgrade-price">
          {billing === 'monthly' ? (
            <>
              <span className="price-main">{monthlyPrice}</span>
              <span className="price-period">/month</span>
            </>
          ) : (
            <>
              <span className="price-main">{yearlyMonthly}</span>
              <span className="price-period">/month</span>
              <div className="price-billed">Billed {yearlyPrice}/year</div>
            </>
          )}
        </div>

        {/* Features */}
        <div className="upgrade-features">
          <div className="upgrade-feature">
            <span className="feature-check">✓</span>
            <span>Unlimited prompt unlocks</span>
          </div>
          <div className="upgrade-feature">
            <span className="feature-check">✓</span>
            <span>AI prompt customization</span>
          </div>
          <div className="upgrade-feature">
            <span className="feature-check">✓</span>
            <span>Early access to new features</span>
          </div>
          <div className="upgrade-feature">
            <span className="feature-check">✓</span>
            <span>Support the builders community</span>
          </div>
        </div>

        <button
          className="upgrade-pay-btn"
          onClick={handlePaystack}
          disabled={loading}
        >
          {loading ? 'Opening payment…' : `Get Pro ${billing === 'monthly' ? 'Monthly' : 'Yearly'} →`}
        </button>

        <p className="upgrade-footer">Secured by Paystack · Cancel anytime</p>
      </div>
    </div>
  )
}