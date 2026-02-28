import { useEffect, useMemo, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import './App.css'

// Typewriter component for smooth character-by-character typing animation (infinite loop)
function TypewriterText({ 
  staticText = '', 
  animatedText = '', 
  speed = 50, 
  delay = 0,
  pauseDuration = 2000
}: Readonly<{ staticText?: string; animatedText?: string; speed?: number; delay?: number; pauseDuration?: number }>) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let typingInterval: ReturnType<typeof setInterval> | null = null
    let pauseTimer: ReturnType<typeof setTimeout> | null = null
    
    const startTyping = () => {
      setDisplayedText('')
      setIsTyping(true)
      let currentIndex = 0
      
      typingInterval = setInterval(() => {
        if (currentIndex < animatedText.length) {
          setDisplayedText(animatedText.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          if (typingInterval) {
            clearInterval(typingInterval)
            typingInterval = null
          }
          setIsTyping(false)
          
          // Wait for pause duration, then start typing again
          pauseTimer = setTimeout(() => {
            startTyping()
          }, pauseDuration)
        }
      }, speed)
    }
    
    // Initial delay before starting
    const startTimer = setTimeout(() => {
      startTyping()
    }, delay)
    
    return () => {
      if (startTimer) clearTimeout(startTimer)
      if (typingInterval) clearInterval(typingInterval)
      if (pauseTimer) clearTimeout(pauseTimer)
    }
  }, [animatedText, speed, delay, pauseDuration])

  return (
    <span className="typewriterContainer">
      {staticText}
      <span className="typewriterText">
        <span className="typewriterVisible">{displayedText}</span>
        <span className="typewriterHidden" aria-hidden="true">{animatedText}</span>
        {isTyping && <span className="cursor" aria-hidden="true">|</span>}
      </span>
    </span>
  )
}

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
          {/* Floating decorative images */}
          <FloatingImage
            src="data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%235eead4' opacity='0.2'/%3E%3Ccircle cx='60' cy='60' r='30' fill='%2360a5fa' opacity='0.3'/%3E%3C/svg%3E"
            initialX={-200}
            initialY={100}
            scrollRange={[0, 0.3]}
            delay={0}
            size={120}
          />
          <FloatingImage
            src="data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='10' y='10' width='80' height='80' rx='20' fill='%23a78bfa' opacity='0.25'/%3E%3Crect x='25' y='25' width='50' height='50' rx='10' fill='%235eead4' opacity='0.3'/%3E%3C/svg%3E"
            initialX={globalThis.window ? globalThis.window.innerWidth + 100 : 1200}
            initialY={200}
            scrollRange={[0, 0.4]}
            delay={0.2}
            size={100}
          />
          <FloatingImage
            src="data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='40,10 70,60 10,60' fill='%2360a5fa' opacity='0.25'/%3E%3Cpolygon points='40,25 55,50 25,50' fill='%235eead4' opacity='0.3'/%3E%3C/svg%3E"
            initialX={-150}
            initialY={400}
            scrollRange={[0, 0.5]}
            delay={0.4}
            size={80}
          />

          <div className="container heroGrid">
            <div className="heroCopy">
              <p className="eyebrow">Safety-first teams move faster.</p>
              <h1 className="heroTitle">
                <TypewriterText 
                  staticText="Build a workplace where safe choices are " 
                  animatedText="the easy choices." 
                  speed={50} 
                  delay={500} 
                />
              </h1>
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
          {/* Floating images for pricing section */}
          <FloatingImage
            src="data:image/svg+xml,%3Csvg width='150' height='150' viewBox='0 0 150 150' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='75' cy='75' r='60' fill='%235eead4' opacity='0.15'/%3E%3Ccircle cx='75' cy='75' r='40' fill='%2360a5fa' opacity='0.2'/%3E%3Ccircle cx='75' cy='75' r='20' fill='%23a78bfa' opacity='0.25'/%3E%3C/svg%3E"
            initialX={globalThis.window ? globalThis.window.innerWidth + 150 : 1300}
            initialY={50}
            scrollRange={[0.2, 0.6]}
            delay={0}
            size={150}
          />
          <FloatingImage
            src="data:image/svg+xml,%3Csvg width='90' height='90' viewBox='0 0 90 90' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='5' y='5' width='80' height='80' rx='15' fill='%235eead4' opacity='0.2'/%3E%3Crect x='20' y='20' width='50' height='50' rx='8' fill='%2360a5fa' opacity='0.25'/%3E%3C/svg%3E"
            initialX={-200}
            initialY={150}
            scrollRange={[0.25, 0.65]}
            delay={0.3}
            size={90}
          />
          <FloatingImage
            src="data:image/svg+xml,%3Csvg width='110' height='110' viewBox='0 0 110 110' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M55,10 L100,90 L10,90 Z' fill='%23a78bfa' opacity='0.2'/%3E%3Cpath d='M55,30 L80,80 L30,80 Z' fill='%235eead4' opacity='0.25'/%3E%3C/svg%3E"
            initialX={globalThis.window ? globalThis.window.innerWidth + 110 : 1200}
            initialY={300}
            scrollRange={[0.3, 0.7]}
            delay={0.5}
            size={110}
          />

          <div className="container">
            <motion.div
              className="sectionHead"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="sectionTitle">Pricing that scales with your team</h2>
              <p className="sectionSubtitle">Start small, prove adoption, then roll out across sites.</p>
            </motion.div>

            <motion.div
              className="pricingGrid"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, staggerChildren: 0.2 }}
            >
              <motion.article
                className="priceCard"
                initial={{ opacity: 0, x: -100, rotateY: -15 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.05, y: -10, rotateY: 5 }}
              >
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
              </motion.article>

              <motion.article
                className="priceCard priceCardFeatured"
                aria-label="Most popular plan"
                initial={{ opacity: 0, y: 100, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.08, y: -15, rotateY: -5 }}
              >
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
              </motion.article>

              <motion.article
                className="priceCard"
                initial={{ opacity: 0, x: 100, rotateY: 15 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.05, y: -10, rotateY: -5 }}
              >
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
              </motion.article>
            </motion.div>

            <p className="finePrint">
              No backend needed for this demo. In production, you’d connect form submissions to your CRM/helpdesk.
        </p>
      </div>
        </section>

        <section id="contact" className="section contact" aria-label="Contact">
          {/* Floating images for contact section */}
          <FloatingImage
            src="data:image/svg+xml,%3Csvg width='130' height='130' viewBox='0 0 130 130' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='65' cy='65' r='55' fill='%2360a5fa' opacity='0.15'/%3E%3Ccircle cx='65' cy='65' r='35' fill='%235eead4' opacity='0.2'/%3E%3C/svg%3E"
            initialX={-180}
            initialY={100}
            scrollRange={[0.5, 0.9]}
            delay={0}
            size={130}
          />
          <FloatingImage
            src="data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='10' y='10' width='80' height='80' rx='20' fill='%23a78bfa' opacity='0.2'/%3E%3Crect x='25' y='25' width='50' height='50' rx='10' fill='%2360a5fa' opacity='0.25'/%3E%3C/svg%3E"
            initialX={globalThis.window ? globalThis.window.innerWidth + 120 : 1200}
            initialY={250}
            scrollRange={[0.55, 0.95]}
            delay={0.4}
            size={100}
          />

          <div className="container contactGrid">
            <motion.div
              className="contactCopy"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="sectionTitle">Contact</h2>
              <p className="sectionSubtitle">
                Tell us what you're building. We'll reply with a simple rollout plan and a short demo.
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
            </motion.div>

            <motion.form
              className="form"
              onSubmit={onSubmit}
              noValidate
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
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
            </motion.form>
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

// Floating Image Component with scroll animations
function FloatingImage({
  src,
  initialX,
  initialY,
  scrollRange,
  delay,
  size,
}: Readonly<{
  src: string
  initialX: number
  initialY: number
  scrollRange: [number, number]
  delay: number
  size: number
}>) {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, scrollRange, [0, 1, 1, 0])
  const x = useTransform(scrollYProgress, scrollRange, [initialX, initialX * 0.3, initialX * 0.3, initialX * 1.5])
  const y = useTransform(scrollYProgress, scrollRange, [initialY, initialY * 0.8, initialY * 0.8, initialY * 1.2])
  const scale = useTransform(scrollYProgress, scrollRange, [0.5, 1, 1, 0.3])
  const rotate = useTransform(scrollYProgress, scrollRange, [0, 360, 360, 720])

  return (
    <motion.img
      src={src}
      alt=""
      className="floatingImage"
      style={{
        opacity,
        x,
        y,
        scale,
        rotate,
        width: `${size}px`,
        height: `${size}px`,
      }}
      initial={{ opacity: 0 }}
      transition={{ delay, duration: 0.5 }}
    />
  )
}

export default App
