import { useState, useEffect, useCallback, useRef } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import useCitizen from '../../hooks/useCitizen'
import { getDocumentsByCitizenId, createCitizenDocument } from '../../api/citizenDocumentApi'

const ACCEPTED = '.pdf,.jpg,.jpeg,.png,.doc,.docx'

const DocTypeLabel = { ID_PROOF: 'ID Proof', HEALTH_CARD: 'Health Card' }

/* ── File icon by extension ── */
const FileIcon = ({ name }) => {
  const ext = name?.split('.').pop()?.toLowerCase()
  const color = ext === 'pdf' ? '#ef4444' : ['jpg','jpeg','png'].includes(ext) ? '#0284c7' : '#64748b'
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
      background: `${color}18`, border: `1.5px solid ${color}30`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 800, color, textTransform: 'uppercase',
    }}>
      {ext ?? '?'}
    </div>
  )
}

const CitizenDocumentsPage = () => {
  const { citizenId, loading: citizenLoading } = useCitizen()
  const [documents, setDocuments]   = useState([])
  const [loading, setLoading]       = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [showForm, setShowForm]     = useState(false)
  const [docType, setDocType]       = useState('ID_PROOF')
  const [selectedFile, setSelectedFile] = useState(null)   // File object
  const [dragOver, setDragOver]     = useState(false)
  const [formError, setFormError]   = useState('')
  const [saving, setSaving]         = useState(false)
  const [saveSuccess, setSaveSuccess] = useState('')
  const [saveError, setSaveError]   = useState('')
  const fileInputRef = useRef(null)
  const successTimer = useRef(null)

  const showSuccessMsg = (msg) => {
    setSaveSuccess(msg)
    clearTimeout(successTimer.current)
    successTimer.current = setTimeout(() => setSaveSuccess(''), 3500)
  }

  const fetchDocuments = useCallback(() => {
    if (!citizenId) return
    setLoading(true)
    setFetchError('')
    getDocumentsByCitizenId(citizenId)
      .then(res => setDocuments(res.data?.data ?? []))
      .catch(err => {
        if (err?.response?.status === 403) setFetchError('Access denied while loading documents.')
        else setFetchError(err?.response?.data?.message || 'Failed to load documents')
      })
      .finally(() => setLoading(false))
  }, [citizenId])

  useEffect(() => { if (!citizenLoading) fetchDocuments() }, [citizenLoading, fetchDocuments])

  /* ── File selection helpers ── */
  const applyFile = (file) => {
    if (!file) return
    setSelectedFile(file)
    setFormError('')
  }

  const handleFileInput = (e) => applyFile(e.target.files?.[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    applyFile(e.dataTransfer.files?.[0])
  }

  const resetForm = () => {
    setDocType('ID_PROOF')
    setSelectedFile(null)
    setFormError('')
    setSaveError('')
    setSaveSuccess('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setSaveError('')
    setSaveSuccess('')
    if (!selectedFile) { setFormError('Please select a file to upload.'); return }

    setSaving(true)
    try {
      // Backend currently stores a URI string — we send the filename as the URI.
      // When a real upload endpoint is available, replace this with FormData upload.
      const fileUri = `/uploads/citizen/${citizenId}/${selectedFile.name}`
      const res = await createCitizenDocument({
        citizenId,
        docType,
        fileUri,
        verificationStatus: 'PENDING',
      })
      const created = res.data?.data
      if (created) setDocuments(prev => [created, ...prev])
      else fetchDocuments()
      showSuccessMsg('Document submitted successfully. Verification is pending.')
      resetForm()
      setShowForm(false)
    } catch (err) {
      setSaveError(err?.response?.data?.message || 'Failed to submit document')
    } finally {
      setSaving(false)
    }
  }

  if (citizenLoading || loading) {
    return <DashboardLayout><Loader message="Loading documents…" /></DashboardLayout>
  }

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="page-title">My Documents</h2>
          <p className="text-muted mb-0">Upload and track your identity and health documents.</p>
        </div>
        {citizenId && (
          <Button onClick={() => { setShowForm(v => !v); resetForm() }}>
            {showForm ? 'Cancel' : '+ Upload Document'}
          </Button>
        )}
      </div>

      {/* Alerts */}
      {!citizenId  && <div className="alert alert-warning">Please create your citizen profile first.</div>}
      {fetchError  && <div className="alert alert-danger py-2">{fetchError}</div>}
      {saveSuccess && <div className="alert alert-success py-2">✅ {saveSuccess}</div>}
      {saveError   && <div className="alert alert-danger py-2">❌ {saveError}</div>}

      {/* ── Upload form ── */}
      {showForm && citizenId && (
        <Card title="Upload Document" className="mb-4">
          <form onSubmit={handleSubmit} noValidate>
            {/* Document type */}
            <div className="mb-3">
              <label className="form-label">Document Type</label>
              <select
                className="form-select"
                value={docType}
                onChange={e => setDocType(e.target.value)}
                style={{ maxWidth: 260 }}
              >
                {Object.entries(DocTypeLabel).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? '#0284c7' : formError ? '#f87171' : '#cbd5e1'}`,
                borderRadius: 14,
                background: dragOver ? '#f0f9ff' : '#f8fafc',
                padding: '32px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.18s',
                marginBottom: 12,
              }}
            >
              {/* Hidden real file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED}
                style={{ display: 'none' }}
                onChange={handleFileInput}
              />

              {selectedFile ? (
                /* ── File selected preview ── */
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                  <FileIcon name={selectedFile.name} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{selectedFile.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                      {(selectedFile.size / 1024).toFixed(1)} KB · Click to change
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                    style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18, lineHeight: 1 }}
                    aria-label="Remove file"
                  >×</button>
                </div>
              ) : (
                /* ── Empty state ── */
                <div>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>📁</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                    Drag & drop your file here, or <span style={{ color: '#0284c7' }}>browse</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>
                    Supported: PDF, JPG, PNG, DOC, DOCX · Max 10 MB
                  </div>
                </div>
              )}
            </div>

            {formError && (
              <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 600, marginBottom: 12 }}>
                ⚠ {formError}
              </div>
            )}

            <div className="d-flex gap-2">
              <Button type="submit" disabled={saving || !selectedFile}>
                {saving ? 'Submitting…' : 'Submit Document'}
              </Button>
              <Button variant="outline-secondary" type="button" onClick={() => { setShowForm(false); resetForm() }}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* ── Document list ── */}
      {documents.length === 0 && !fetchError && (
        <div className="alert alert-info">
          No documents uploaded yet. Click <strong>+ Upload Document</strong> to add one.
        </div>
      )}

      {documents.length > 0 && (
        <div className="row g-4">
          {documents.map(doc => (
            <div key={doc.id} className="col-md-6 col-xl-4">
              <Card>
                <div className="d-flex align-items-start gap-3">
                  <FileIcon name={doc.fileUri} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div>
                        <div className="fw-semibold" style={{ fontSize: 14 }}>
                          {DocTypeLabel[doc.docType] ?? doc.docType?.replace('_', ' ')}
                        </div>
                        <div className="text-muted" style={{ fontSize: 12, marginTop: 2 }}>
                          Uploaded: {doc.uploadedDate?.slice(0, 10) ?? '—'}
                        </div>
                      </div>
                      <StatusBadge status={doc.verificationStatus} />
                    </div>
                    {doc.fileUri && (
                      <div
                        className="text-muted text-truncate"
                        style={{ fontSize: 12, marginTop: 4 }}
                        title={doc.fileUri}
                      >
                        📄 {doc.fileUri.split('/').pop()}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

export default CitizenDocumentsPage
