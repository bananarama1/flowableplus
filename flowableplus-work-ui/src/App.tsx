import { useCallback, useEffect, useState } from 'react'

type FlowableStatus = {
  runtimeServiceAvailable: boolean
  status: string
  message: string
}

const emptyStatus: FlowableStatus = {
  runtimeServiceAvailable: false,
  status: 'UNKNOWN',
  message: 'Waiting for the Flowable runtime.',
}

function App() {
  const [status, setStatus] = useState<FlowableStatus>(emptyStatus)
  const [loading, setLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadStatus = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/flowable/status')
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const nextStatus = (await response.json()) as FlowableStatus
      setStatus(nextStatus)
      setLastChecked(new Date())
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to reach the API.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadStatus()
  }, [loadStatus])

  const isAvailable = status.runtimeServiceAvailable && !error

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">F+</span>
          <div>
            <strong>FlowablePlus</strong>
            <span>Work platform</span>
          </div>
        </div>

        <nav aria-label="Primary navigation">
          <a className="nav-item active" href="#overview">
            <span className="nav-icon">01</span>
            Overview
          </a>
          <a className="nav-item" href="#processes">
            <span className="nav-icon">02</span>
            Processes
          </a>
          <a className="nav-item" href="#tasks">
            <span className="nav-icon">03</span>
            Tasks
          </a>
        </nav>

        <div className="sidebar-footer">
          <span className="environment-dot" />
          <div>
            <span>Environment</span>
            <strong>Local development</strong>
          </div>
        </div>
      </aside>

      <section className="content" id="overview">
        <header className="topbar">
          <div>
            <p className="eyebrow">Operations / Overview</p>
            <h1>Work platform</h1>
          </div>
          <div className="topbar-meta">
            <span className={`status-pill ${isAvailable ? 'online' : 'offline'}`}>
              <span className="status-dot" />
              {isAvailable ? 'Runtime online' : 'Runtime unavailable'}
            </span>
            <span className="version-label">v0.0.1-SNAPSHOT</span>
          </div>
        </header>

        <div className="content-grid">
          <section className="hero-panel">
            <div>
              <p className="eyebrow light">Flowable runtime</p>
              <h2>One clear view of your work engine.</h2>
              <p className="hero-copy">
                Monitor the platform foundation before you build process, case, and task experiences on top of it.
              </p>
            </div>
            <div className="hero-orbit" aria-hidden="true">
              <span className="orbit orbit-one" />
              <span className="orbit orbit-two" />
              <span className="orbit-core">F+</span>
            </div>
          </section>

          <section className="status-card" aria-live="polite">
            <div className="card-heading">
              <div>
                <p className="eyebrow">Service check</p>
                <h2>Runtime status</h2>
              </div>
              <span className={`signal ${isAvailable ? 'signal-good' : 'signal-bad'}`} />
            </div>

            <div className="status-value">{error ? 'ERROR' : status.status}</div>
            <p className="status-message">{error ?? status.message}</p>

            <div className="status-details">
              <div>
                <span>RuntimeService</span>
                <strong>{isAvailable ? 'Available' : 'Unavailable'}</strong>
              </div>
              <div>
                <span>Last checked</span>
                <strong>{lastChecked ? lastChecked.toLocaleTimeString() : 'Not checked'}</strong>
              </div>
            </div>

            <button className="refresh-button" type="button" onClick={() => void loadStatus()} disabled={loading}>
              <span className={loading ? 'refresh-icon spinning' : 'refresh-icon'}>↻</span>
              {loading ? 'Checking runtime...' : 'Refresh status'}
            </button>
          </section>
        </div>

        <section className="metrics" aria-label="Platform metrics">
          <article className="metric-card">
            <span className="metric-label">Process engine</span>
            <strong>{isAvailable ? 'Ready' : 'Waiting'}</strong>
            <span className="metric-caption">BPMN runtime services</span>
          </article>
          <article className="metric-card">
            <span className="metric-label">Case engine</span>
            <strong>{isAvailable ? 'Ready' : 'Waiting'}</strong>
            <span className="metric-caption">CMMN runtime services</span>
          </article>
          <article className="metric-card accent-card">
            <span className="metric-label">API endpoint</span>
            <strong>/flowable/status</strong>
            <span className="metric-caption">Spring Boot application</span>
          </article>
        </section>

        <footer className="footer-note">
          <span>FlowablePlus Work UI</span>
          <span>Connected through the local development API</span>
        </footer>
      </section>
    </main>
  )
}

export default App
