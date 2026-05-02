import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import '../../styles/landing.css'

const features = [
  {
    icon: '🔒',
    title: 'Confidential',
    desc: 'Your conversations stay private and secure.',
  },
  {
    icon: '🕐',
    title: '24/7 Support',
    desc: 'Get help anytime, day or night, whenever you need it.',
  },
  {
    icon: '🗣️',
    title: 'Multi-Lingual',
    desc: 'Communicate in your preferred language.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="landing">
      {/* Ambient background */}
      <div className="landing-bg" aria-hidden>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <span className="navbar-logo">MindVarta</span>
        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '🌕' : '🌑'}
          </button>
          <button className="btn-get-started" onClick={() => navigate('/auth')}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">
          <span className="eyebrow-dot" />
          Always here for you
        </div>

        <h1 className="hero-title">
          Your Mind,Your Language,
          <span className="hero-title-accent">Our Support.</span>
        </h1>

        <p className="hero-subtitle">
          A safe space to talk about your thoughts and feelings.
          Get support when you need it most.
        </p>

        <div className="hero-cta-group">
          <button className="btn-primary" onClick={() => navigate('/auth')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Start Talking Now
          </button>

          <button className="btn-secondary" onClick={() => navigate('/documentation')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            View Complete Technical Documentation
          </button>
        </div>
      </section>

      {/* Feature cards */}
      <section className="features">
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}