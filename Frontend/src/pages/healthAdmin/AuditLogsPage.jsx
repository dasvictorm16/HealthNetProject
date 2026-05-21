import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllAuditLogs } from '../../api/auditApi'

const SUMMARY_COLORS = [
  { border: '#bae6fd', value: '#0369a1', label: '#64748b' },
  { border: '#bbf7d0', value: '#065f46', label: '#64748b' },
  { border: '#ddd6fe', value: '#5b21b6', label: '#64748b' },
  { border: '#fde68a', value: '#92400e', label: '#64748b' },
]

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let mounted = true
    getAllAuditLogs()
      .then(res => { if (mounted) setLogs(res.data?.data ?? []) })
      .catch(err => {
        if (!mounted) return
        if (err?.response?.status === 403)
          setFetchError('Access denied. Only Health Administrators can view audit logs.')
        else if (!err?.response)
          setFetchError('Backend server is not reachable.')
        else
          setFetchError(err?.response?.data?.message || 'Failed to load audit logs.')
      })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const filtered = logs.filter(l => {
    const q = search.toLowerCase()
    return !q ||
      l.action?.toLowerCase().includes(q) ||
      l.entityType?.toLowerCase().includes(q) ||
      String(l.entityId ?? '').includes(q) ||
      l.performedBy?.toLowerCase().includes(q) ||
      l.description?.toLowerCase().includes(q)
  })

  const today = new Date().toISOString().slice(0, 10)
  const summaryStats = [
    { label: 'Total Logs',   value: logs.length },
    { label: 'Today',        value: logs.filter(l => l.timestamp?.startsWith(today)).length },
    { label: 'Entity Types', value: new Set(logs.map(l => l.entityType).filter(Boolean)).size },
    { label: 'Users',        value: new Set(logs.map(l => l.performedBy).filter(Boolean)).size },
  ]

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="hn-page-header-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="hn-page-header-icon" style={{ background: 'linear-gradient(135deg,#475569,#64748b)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Audit Logs</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0', fontWeight: '500' }}>System-wide audit trail. Read-only view.</p>
          </div>
        </div>
        <span style={{ background: '#f1f5f9', color: '#475569', borderRadius: '999px', fontSize: '12px', fontWeight: '700', padding: '4px 14px' }}>
          {logs.length} total
        </span>
      </div>

      {fetchError && <div className="hn-alert hn-alert-warning">⚠️ {fetchError}</div>}

      {/* Summary */}
      {!loading && !fetchError && (
        <div className="hn-summary-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
          {summaryStats.map(({ label, value }, i) => (
            <div key={label} className="hn-summary-cell" style={{ borderColor: SUMMARY_COLORS[i].border }}>
              <div className="hn-summary-cell-value" style={{ color: SUMMARY_COLORS[i].value }}>{value}</div>
              <div className="hn-summary-cell-label">{label}</div>
            </div>
          ))}
        </div>
      )}

      {loading ? <Loader message="Loading audit logs…" /> : fetchError ? null : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '20px', alignItems: 'start' }}>
          {/* Table card */}
          <div className="hn-table-card">
            <div className="hn-table-filters">
              <div className="hn-search-wrap" style={{ flex: 1, minWidth: '200px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  className="hn-input"
                  placeholder="Search by action, entity type, ID, or user…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setSelected(null) }}
                />
              </div>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', whiteSpace: 'nowrap' }}>
                {filtered.length} of {logs.length}
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="hn-empty">
                <div className="hn-empty-icon">🔍</div>
                <div className="hn-empty-title">{logs.length === 0 ? 'No audit logs found.' : 'No logs match your search.'}</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="hn-table">
                  <thead>
                    <tr>
                      {['ID', 'Action', 'Entity Type', 'Entity ID', 'Performed By', 'Timestamp'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(l => (
                      <tr
                        key={l.id}
                        className={selected?.id === l.id ? 'hn-audit-row-selected' : ''}
                        onClick={() => setSelected(selected?.id === l.id ? null : l)}
                      >
                        <td style={{ fontWeight: '700', color: '#0284c7' }}>{l.id}</td>
                        <td><StatusBadge status={l.action} /></td>
                        <td style={{ color: '#475569' }}>{l.entityType ?? '—'}</td>
                        <td style={{ color: '#475569' }}>{l.entityId ?? '—'}</td>
                        <td style={{ color: '#475569' }}>{l.performedBy ?? '—'}</td>
                        <td style={{ color: '#94a3b8' }}>{l.timestamp ? l.timestamp.replace('T', ' ').slice(0, 19) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="hn-detail-panel">
              <div className="hn-detail-panel-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '18px', borderRadius: '4px', background: 'linear-gradient(180deg,#475569,#64748b)' }} />
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>Log {selected.id}</span>
                </div>
                <button className="hn-close-btn" onClick={() => setSelected(null)} aria-label="Close">×</button>
              </div>
              <div className="hn-detail-panel-body">
                <div className="hn-detail-row">
                  {[
                    ['Log ID',       selected.id],
                    ['Entity Type',  selected.entityType],
                    ['Entity ID',    selected.entityId],
                    ['Performed By', selected.performedBy],
                    ['Timestamp',    selected.timestamp?.replace('T', ' ').slice(0, 19)],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="hn-detail-label">{label}</div>
                      <div className="hn-detail-value">{value ?? '—'}</div>
                    </div>
                  ))}
                  <div>
                    <div className="hn-detail-label">Action</div>
                    <StatusBadge status={selected.action} />
                  </div>
                </div>
                {selected.description && (
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '4px' }}>
                    <div className="hn-detail-label" style={{ marginBottom: '6px' }}>Description</div>
                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {selected.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}

export default AuditLogsPage
