import { FormEvent, useCallback, useEffect, useState } from 'react'

type FlowableStatus = {
  runtimeServiceAvailable: boolean
  status: string
  message: string
}

type ProcessDefinition = {
  id: string
  key: string
  name?: string
  version: number
}

type ProcessDefinitionsResponse = {
  data: ProcessDefinition[]
}

const emptyStatus: FlowableStatus = {
  runtimeServiceAvailable: false,
  status: 'UNKNOWN',
  message: 'Waiting for the Flowable runtime.',
}

function App() {
  const [status, setStatus] = useState<FlowableStatus>(emptyStatus)
  const [processDefinitions, setProcessDefinitions] = useState<ProcessDefinition[]>([])
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loggingIn, setLoggingIn] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadWorkspace = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [statusResponse, definitionsResponse] = await Promise.all([
        fetch('/api/flowable/status', { credentials: 'include' }),
        fetch('/api/flowableplus-api/repository/process-definitions', { credentials: 'include' }),
      ])

      if (statusResponse.redirected || definitionsResponse.redirected || statusResponse.status === 401 || definitionsResponse.status === 401) {
        setAuthenticated(false)
        throw new Error('Your session is not authenticated. Sign in to view process definitions.')
      }

      if (!statusResponse.ok || !definitionsResponse.ok) {
        setAuthenticated(false)
        throw new Error('Your session is not authenticated. Sign in to view process definitions.')
      }

      const nextStatus = (await statusResponse.json()) as FlowableStatus
      const nextDefinitions = (await definitionsResponse.json()) as ProcessDefinitionsResponse
      setStatus(nextStatus)
      setProcessDefinitions(nextDefinitions.data)
      setAuthenticated(true)
      setLastChecked(new Date())
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to reach the API.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadWorkspace()
  }, [loadWorkspace])

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setLoggingIn(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    try {
      const loginPageResponse = await fetch('/api/login', { credentials: 'include' })
      const loginPage = await loginPageResponse.text()
      const loginDocument = new DOMParser().parseFromString(loginPage, 'text/html')
      const csrfToken = loginDocument.querySelector('input[name="_csrf"]')?.getAttribute('value')
      if (!csrfToken) {
        throw new Error('Unable to prepare the login session.')
      }

      const credentials = new URLSearchParams({
        username: String(formData.get('username') ?? ''),
        password: String(formData.get('password') ?? ''),
        _csrf: csrfToken,
      })
      const loginResponse = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: credentials,
        credentials: 'include',
        redirect: 'manual',
      })
      const loginSucceeded = loginResponse.type === 'opaqueredirect' || (loginResponse.status >= 200 && loginResponse.status < 400)
      if (!loginSucceeded) {
        throw new Error('Authentication failed. Check your username and password.')
      }

      await loadWorkspace()
      form.reset()
    } catch (loginError) {
      setAuthenticated(false)
      setError(loginError instanceof Error ? loginError.message : 'Authentication failed.')
    } finally {
      setLoggingIn(false)
    }
  }

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

        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        {!authenticated ? (
          <section className="login-panel" aria-labelledby="login-heading">
            <div>
              <p className="eyebrow">Session required</p>
              <h2 id="login-heading">Sign in to your work platform</h2>
              <p className="panel-copy">Use the development account to access deployed process definitions.</p>
            </div>
            <form className="login-form" onSubmit={login}>
              <label htmlFor="username">Username</label>
              <input id="username" name="username" type="text" autoComplete="username" required />
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required />
              <button className="refresh-button login-button" type="submit" disabled={loggingIn}>
                {loggingIn ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </section>
        ) : (
        <>
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

            <button className="refresh-button" type="button" onClick={() => void loadWorkspace()} disabled={loading}>
              <span className={loading ? 'refresh-icon spinning' : 'refresh-icon'}>↻</span>
              {loading ? 'Checking runtime...' : 'Refresh status'}
            </button>
          </section>
        </div>

        <section className="process-section" id="processes" aria-labelledby="process-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Native Flowable REST</p>
              <h2 id="process-heading">Process definitions</h2>
            </div>
            <span className="count-badge">{processDefinitions.length} available</span>
          </div>
          <div className="process-list">
            {processDefinitions.map((definition) => (
              <article className="process-row" key={definition.id}>
                <div>
                  <strong>{definition.name ?? definition.key}</strong>
                  <span>{definition.key} / version {definition.version}</span>
                </div>
                <span className="process-status">Deployed</span>
              </article>
            ))}
          </div>
        </section>
        </>
        )}

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
