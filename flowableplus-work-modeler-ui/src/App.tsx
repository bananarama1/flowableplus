import { useEffect, useRef, useState } from 'react'
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer'

type ModelFile = {
  key: string
  lastModified: number
  revision: number
}

type ModelContent = ModelFile & {
  xml: string
  bpmn: boolean
}

const api = '/api/plus/modeler/models'

function App() {
  const [models, setModels] = useState<ModelFile[]>([])
  const [selectedKey, setSelectedKey] = useState('')
  const [content, setContent] = useState<ModelContent | null>(null)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const canvasRef = useRef<HTMLDivElement>(null)

  async function loadModels() {
    setLoading(true)
    try {
      const response = await fetch(api)
      if (!response.ok) throw new Error(`Unable to list models (${response.status})`)
      const nextModels = (await response.json()) as ModelFile[]
      setModels(nextModels)
      if (!selectedKey && nextModels.length > 0) setSelectedKey(nextModels[0].key)
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to list models')
    } finally {
      setLoading(false)
    }
  }

  async function loadModel(key: string, quiet = false) {
    try {
      const response = await fetch(`${api}/${encodeURIComponent(key).replaceAll('%2F', '/')}`)
      if (!response.ok) throw new Error(`Unable to open model (${response.status})`)
      const nextContent = (await response.json()) as ModelContent
      setContent(nextContent)
      setDraft(nextContent.xml)
      if (!quiet) setMessage(`Opened ${nextContent.key}`)
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to open model')
    }
  }

  async function saveModel() {
    if (!content) return
    try {
      const response = await fetch(`${api}/${encodeURIComponent(content.key).replaceAll('%2F', '/')}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/xml' },
        body: draft,
      })
      if (!response.ok) {
        const body = await response.text()
        throw new Error(body || `Unable to save model (${response.status})`)
      }
      const saved = (await response.json()) as ModelContent
      setContent(saved)
      setDraft(saved.xml)
      setMessage(`Saved ${saved.key}`)
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save model')
    }
  }

  useEffect(() => { void loadModels() }, [])
  useEffect(() => { if (selectedKey) void loadModel(selectedKey) }, [selectedKey])
  useEffect(() => {
    if (!content || !canvasRef.current || !content.bpmn) return
    const viewer = new NavigatedViewer({ container: canvasRef.current })
    void viewer.importXML(draft).catch(() => setError('BPMN XML has no renderable diagram or is invalid'))
    return () => viewer.destroy()
  }, [content, draft])

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="kicker">FlowablePlus / local workspace</p>
          <h1>Modeler</h1>
        </div>
        <div className="topbar-actions">
          <span className="local-badge"><span className="pulse" /> Local only</span>
          <button className="ghost-button" onClick={() => void loadModels()}>Refresh files</button>
        </div>
      </header>

      {error && <div className="banner error">{error}</div>}
      {message && <div className="banner success">{message}</div>}

      <section className="workspace">
        <aside className="file-panel">
          <div className="panel-heading">
            <div><span className="section-label">Workspace</span><h2>Model files</h2></div>
            <span className="file-count">{models.length}</span>
          </div>
          {loading && <p className="muted">Scanning resource directory...</p>}
          {!loading && models.length === 0 && <p className="muted">No supported model files found.</p>}
          <div className="file-list">
            {models.map((model) => <button
              className={`file-row ${model.key === selectedKey ? 'selected' : ''}`}
              key={model.key}
              onClick={() => setSelectedKey(model.key)}
            ><span className="file-icon">{model.key.toLowerCase().includes('bpmn') ? 'B' : 'X'}</span><span>{model.key}</span></button>)}
          </div>
        </aside>

        <section className="editor-panel">
          <div className="editor-heading">
            <div><span className="section-label">Source and diagram</span><h2>{content?.key ?? 'Select a model file'}</h2></div>
            {content && <div className="editor-actions"><span className="revision">Revision {content.revision}</span><button className="ghost-button" onClick={() => void loadModel(content.key)}>Reload</button><button className="save-button" onClick={() => void saveModel()}>Save XML</button></div>}
          </div>
          {content ? <div className="editor-grid">
            <label className="xml-editor"><span>XML source</span><textarea value={draft} onChange={(event) => setDraft(event.target.value)} spellCheck={false} /></label>
            <div className="diagram-wrap"><div className="diagram-label">{content.bpmn ? 'BPMN representation' : 'XML-only model'}</div>{content.bpmn ? <div className="diagram" ref={canvasRef} /> : <div className="xml-only">This model type is available for XML editing. BPMN rendering is not applicable.</div>}</div>
          </div> : <div className="empty-state"><strong>Choose a model from the workspace</strong><span>Files are read directly from the configured resource directory.</span></div>}
        </section>
      </section>
    </main>
  )
}

export default App