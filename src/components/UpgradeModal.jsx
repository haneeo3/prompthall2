import { useEffect, useState } from 'react'
import './UpgradeModal.css'

const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY
const MONTHLY_PLAN = import.meta.env.VITE_PAYSTACK_PLAN_MONTHLY
const YEARLY_PLAN = import.meta.env.VITE_PAYSTACK_PLAN_YEARLY

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
      ref: `pro_${billing}_${user.id}_${Date.now()}`,
      metadata: {
        plan: billing,
        user_id: user.id,
      },
      callback: function(response) {
        setLoading(false)
        onSuccess(response)
      },
      onClose: function() {
        setLoading(false)
      }
    })

    handler.openIframe()
  }

  return (
    <div className="upgrade-backdrop" onClick={onClose}>
      <div className="upgrade-modal" onClick={e => e.stopPropagation()}>
        <button className="upgrade-close" onClick={onClose}>✕</button>

        <div className="upgrade-header">
          <div className="upgrade-illustration">
            <svg width="100" height="100" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="56" fill="#EEF3FF"/>
              <circle cx="25" cy="30" r="2" fill="#1A6BFF" opacity="0.4"/>
              <circle cx="95" cy="25" r="1.5" fill="#1A6BFF" opacity="0.3"/>
              <circle cx="100" cy="70" r="2" fill="#1A6BFF" opacity="0.4"/>
              <circle cx="18" cy="75" r="1.5" fill="#1A6BFF" opacity="0.3"/>
              <ellipse cx="67" cy="82" rx="5" ry="12" fill="#FFD166" opacity="0.6" transform="rotate(-35 67 82)"/>
              <ellipse cx="64" cy="87" rx="3" ry="8" fill="#FF6B35" opacity="0.4" transform="rotate(-35 64 87)"/>
              <path d="M60 28C60 28 45 45 45 65L60 72L75 65C75 45 60 28 60 28Z" fill="#1A6BFF"/>
              <path d="M60 28C60 28 52 38 52 45L60 42L68 45C68 38 60 28 60 28Z" fill="#0A3FCC"/>
              <circle cx="60" cy="54" r="6" fill="white" opacity="0.9"/>
              <circle cx="60" cy="54" r="4" fill="#EEF3FF"/>
              <circle cx="60" cy="54" r="2" fill="#1A6BFF" opacity="0.6"/>
              <path d="M45 65L38 78L52 70Z" fill="#0A3FCC"/>
              <path d="M75 65L82 78L68 70Z" fill="#0A3FCC"/>
              <ellipse cx="60" cy="73" rx="6" ry="4" fill="#FFD166"/>
              <ellipse cx="60" cy="76" rx="4" ry="3" fill="#FF6B35" opacity="0.8"/>
              <path d="M35 48L37 44L39 48L43 50L39 52L37 56L35 52L31 50Z" fill="#FFD166" opacity="0.8"/>
              <path d="M80 38L81.5 35L83 38L86 39.5L83 41L81.5 44L80 41L77 39.5Z" fill="#FFD166" opacity="0.6"/>
            </svg>
          </div>
          <h2>Upgrade to Pro</h2>
          <p>Unlimited prompts and AI personalisations</p>
        </div>

        {/* Founder offer banner */}
        <div className="upgrade-founder-banner">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Founder pricing — limited time offer
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
            <span className="save-badge">Save 30%</span>
          </button>
        </div>

        {/* Price display */}
        <div className="upgrade-price">
          {billing === 'monthly' ? (
            <>
              <span className="price-original">₦30,000</span>
              <span className="price-main">₦11,999</span>
              <span className="price-period">/month</span>
            </>
          ) : (
            <>
              <span className="price-original">₦150,000</span>
              <span className="price-main">₦99,999</span>
              <span className="price-period">/year</span>
              <div className="price-billed">That's ₦8,333/month — 2 months free</div>
            </>
          )}
        </div>

        {/* Features */}
        <div className="upgrade-features">
          {[
            'Unlimited prompt unlocks every day',
            'Unlimited AI prompt personalisations',
            'Download prompts as .txt files',
            'Early access to new features',
            'Support the builders community',
          ].map((f, i) => (
            <div key={i} className="upgrade-feature">
              <span className="feature-check">✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        <button
          className="upgrade-pay-btn"
          onClick={handlePaystack}
          disabled={loading}
        >
          {loading
            ? 'Opening payment...'
            : `Get Pro ${billing === 'monthly' ? 'Monthly' : 'Yearly'} →`
          }
        </button>

        <p className="upgrade-footer">Secured by Paystack · Cancel anytime</p>
      </div>
    </div>
  )
}