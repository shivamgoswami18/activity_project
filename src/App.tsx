import { useEffect, useMemo, useState } from 'react'
import './App.css'

function isValidEmail(value: string) {
  // Simple, practical email check (good enough for basic client validation)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = globalThis.localStorage?.getItem('sc_theme')
    if (saved === 'dark' || saved === 'light') return saved
    const prefersDark = globalThis.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? true
    return prefersDark ? 'dark' : 'light'
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [touched, setTouched] = useState<{ name: boolean; email: boolean; message: boolean }>({
    name: false,
    email: false,
    message: false,
  })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('sc_theme', theme)
  }, [theme])

  const themeLabel = useMemo(() => (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'), [theme])

  let emailError = ''
  if (email.trim().length === 0) emailError = 'Please enter your email.'
  else if (!isValidEmail(email)) emailError = 'Please enter a valid email address.'

  const errors = {
    name: name.trim().length === 0 ? 'Please enter your name.' : '',
    email: emailError,
    message: message.trim().length < 10 ? 'Message should be at least 10 characters.' : '',
  }

  const isFormValid = !errors.name && !errors.email && !errors.message

  function closeMenu() {
    setMenuOpen(false)
  }

  function onNavClick() {
    closeMenu()
  }

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    if (!isFormValid) return

    // No backend required: simulate a successful submission UX.
    setSubmitStatus('success')
    setName('')
    setEmail('')
    setMessage('')
    setTouched({ name: false, email: false, message: false })
    setTimeout(() => setSubmitStatus('idle'), 5000)
  }

  return (
    <div className="page">
      <a className="skipLink" href="#home">
        Skip to content
      </a>

      <header className="header">
        <div className="container headerInner">
          <a className="brand" href="#home" onClick={onNavClick}>
            <span className="brandMark" aria-hidden="true">
              SC
            </span>
            <span className="brandText">
              Safety <span className="muted">&</span> Culture
            </span>
          </a>

          <nav className="nav" aria-label="Primary">
            <a className="navLink" href="#home">
              Home
            </a>
            <a className="navLink" href="#pricing">
              Pricing
            </a>
            <a className="navLink" href="#contact">
              Contact
            </a>
          </nav>

          <div className="headerCtas">
            <button className="btn btnGhost" type="button" onClick={toggleTheme} aria-label={themeLabel}>
              <span className="themeDot" aria-hidden="true" />
              {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
            <a className="btn btnGhost" href="#pricing">
              View plans
            </a>
            <a className="btn btnPrimary" href="#contact">
              Talk to us
            </a>
          </div>

          <button
            className="iconBtn mobileOnly"
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="iconBars" aria-hidden="true" />
          </button>
        </div>

        {menuOpen && (
          <div className="mobileMenu" aria-label="Mobile menu">
            <div className="container mobileMenuInner">
              <a className="mobileLink" href="#home" onClick={onNavClick}>
                Home
              </a>
              <a className="mobileLink" href="#pricing" onClick={onNavClick}>
                Pricing
              </a>
              <a className="mobileLink" href="#contact" onClick={onNavClick}>
                Contact
              </a>
              <div className="mobileMenuCtas">
                <button className="btn btnGhost btnFull" type="button" onClick={toggleTheme} aria-label={themeLabel}>
                  <span className="themeDot" aria-hidden="true" />
                  {theme === 'dark' ? 'Dark' : 'Light'} mode
                </button>
                <a className="btn btnGhost" href="#pricing" onClick={onNavClick}>
                  View plans
                </a>
                <a className="btn btnPrimary" href="#contact" onClick={onNavClick}>
                  Talk to us
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="home" className="section hero" aria-label="Home">
          <div className="container heroGrid">
            <div className="heroCopy">
              <p className="eyebrow">Safety-first teams move faster.</p>
              <h1 className="heroTitle">Build a workplace where safe choices are the easy choices.</h1>
              <p className="heroSubtitle">
                “Safety and Culture” is a lightweight toolkit for practical safety routines, culture signals, and
                leadership visibility—designed for clarity, consistency, and real adoption.
              </p>

              <div className="heroActions">
                <a className="btn btnPrimary" href="#pricing">
                  Explore pricing
                </a>
                <a className="btn btnGhost" href="#contact">
                  Get a quick demo
                </a>
              </div>

              <ul className="miniStats" aria-label="Highlights">
                <li className="miniStat">
                  <div className="miniStatValue">10 min</div>
                  <div className="miniStatLabel">daily safety habit</div>
                </li>
                <li className="miniStat">
                  <div className="miniStatValue">1 page</div>
                  <div className="miniStatLabel">clear expectations</div>
                </li>
                <li className="miniStat">
                  <div className="miniStatValue">0 fluff</div>
                  <div className="miniStatLabel">high-trust UX</div>
                </li>
              </ul>
            </div>

            <div className="heroCard" aria-label="What you’ll implement">
              <div className="heroCardTop">
                <div className="pill">Playbook</div>
                <div className="pill pillSoft">Culture signals</div>
                <div className="pill pillSoft">Safety routines</div>
              </div>

              <div className="heroCardBody">
                <h2 className="cardTitle">A simple system teams actually use</h2>
                <ul className="checkList">
                  <li>Weekly safety walk template + action log</li>
                  <li>Near-miss reporting with learning prompts</li>
                  <li>Micro-training library (5–7 min modules)</li>
                  <li>Culture pulse questions & trend snapshots</li>
                  <li>Leader talking points for consistent messaging</li>
                </ul>
              </div>

              <div className="heroCardBottom">
                <a className="linkArrow" href="#pricing">
                  See plans <span aria-hidden="true">→</span>
                </a>
                <a className="linkArrow" href="#contact">
                  Ask a question <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="section" aria-label="Pricing">
          <div className="container">
            <div className="sectionHead">
              <h2 className="sectionTitle">Pricing that scales with your team</h2>
              <p className="sectionSubtitle">Start small, prove adoption, then roll out across sites.</p>
            </div>

            <div className="pricingGrid">
              <article className="priceCard">
                <header className="priceHead">
                  <h3 className="priceName">Starter</h3>
                  <p className="priceLine">
                    <span className="price">$29</span>
                    <span className="priceUnit">/month</span>
                  </p>
                  <p className="priceTag">For small teams building consistency.</p>
                </header>
                <ul className="features">
                  <li>Safety walk template</li>
                  <li>Near-miss logging</li>
                  <li>5 micro-trainings</li>
                  <li>Email support</li>
                </ul>
                <a className="btn btnGhost btnFull" href="#contact">
                  Choose Starter
                </a>
              </article>

              <article className="priceCard priceCardFeatured" aria-label="Most popular plan">
                <div className="badge">Most popular</div>
                <header className="priceHead">
                  <h3 className="priceName">Team</h3>
                  <p className="priceLine">
                    <span className="price">$79</span>
                    <span className="priceUnit">/month</span>
                  </p>
                  <p className="priceTag">For multi-shift teams that need visibility.</p>
                </header>
                <ul className="features">
                  <li>Everything in Starter</li>
                  <li>Culture pulse surveys</li>
                  <li>Action items & ownership</li>
                  <li>Monthly trend snapshot</li>
                </ul>
                <a className="btn btnPrimary btnFull" href="#contact">
                  Choose Team
                </a>
              </article>

              <article className="priceCard">
                <header className="priceHead">
                  <h3 className="priceName">Enterprise</h3>
                  <p className="priceLine">
                    <span className="price">Custom</span>
                    <span className="priceUnit">/year</span>
                  </p>
                  <p className="priceTag">For sites, regions, and compliance reporting.</p>
                </header>
                <ul className="features">
                  <li>Everything in Team</li>
                  <li>SSO & role-based access</li>
                  <li>Site roll-up dashboards</li>
                  <li>Dedicated onboarding</li>
                </ul>
                <a className="btn btnGhost btnFull" href="#contact">
                  Talk Enterprise
                </a>
              </article>
            </div>

            <p className="finePrint">
              No backend needed for this demo. In production, you’d connect form submissions to your CRM/helpdesk.
            </p>
          </div>
        </section>

        <section id="contact" className="section contact" aria-label="Contact">
          <div className="container contactGrid">
            <div className="contactCopy">
              <h2 className="sectionTitle">Contact</h2>
              <p className="sectionSubtitle">
                Tell us what you’re building. We’ll reply with a simple rollout plan and a short demo.
              </p>

              <div className="contactNotes">
                <div className="noteCard">
                  <div className="noteTitle">What teams usually ask</div>
                  <ul className="bullets">
                    <li>How do we drive reporting without blame?</li>
                    <li>How do we keep routines lightweight?</li>
                    <li>How do leaders stay consistent?</li>
                  </ul>
                </div>
                <div className="noteCard">
                  <div className="noteTitle">Response time</div>
                  <p className="noteBody">Typically within 1 business day.</p>
                </div>
              </div>
            </div>

            <form className="form" onSubmit={onSubmit} noValidate>
              <div className="field">
                <label className="label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  className={`input ${touched.name && errors.name ? 'inputError' : ''}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  autoComplete="name"
                  placeholder="Alex Johnson"
                />
                {touched.name && errors.name && <div className="error">{errors.name}</div>}
              </div>

              <div className="field">
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`input ${touched.email && errors.email ? 'inputError' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  autoComplete="email"
                  placeholder="alex@company.com"
                />
                {touched.email && errors.email && <div className="error">{errors.email}</div>}
              </div>

              <div className="field">
                <label className="label" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className={`textarea ${touched.message && errors.message ? 'inputError' : ''}`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                  placeholder="What does success look like for your safety & culture initiative?"
                  rows={6}
                />
                {touched.message && errors.message && <div className="error">{errors.message}</div>}
              </div>

              <button className="btn btnPrimary btnFull" type="submit">
                Send message
              </button>

              {submitStatus === 'success' && (
                <output className="success" aria-live="polite">
                  Message sent (demo mode). Thanks—someone will follow up shortly.
                </output>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footerInner">
          <div className="footerLeft">
            <div className="footerBrand">Safety & Culture</div>
            <div className="footerNote">A single-page demo built for clean UX, responsiveness, and clarity.</div>
          </div>
          <div className="footerLinks">
            <a href="#home" onClick={onNavClick}>
              Home
            </a>
            <a href="#pricing" onClick={onNavClick}>
              Pricing
            </a>
            <a href="#contact" onClick={onNavClick}>
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
