import Loader from './Loader'

const CATEGORY_COLORS = {
  CASE:        { bg: '#dbeafe', color: '#1d4ed8' },
  OUTBREAK:    { bg: '#fee2e2', color: '#b91c1c' },
  VACCINATION: { bg: '#d1fae5', color: '#065f46' },
  COMPLIANCE:  { bg: '#ede9fe', color: '#5b21b6' },
  AUDIT:       { bg: '#f1f5f9', color: '#334155' },
}

const formatDate = (iso) => {
  if (!iso) return ''
  return iso.slice(0, 16).replace('T', ' ')
}

const NotificationItem = ({ n, onMarkRead, marking, showMarkRead = true }) => {
  const isUnread = n.status === 'UNREAD'
  const cat = CATEGORY_COLORS[n.category] ?? { bg: '#f1f5f9', color: '#334155' }
  return (
    <div className={`hn-notif-item${isUnread ? ' unread' : ''}`}>
      <div className="hn-notif-dot" style={{ background: isUnread ? '#3182ce' : '#cbd5e1' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="hn-notif-msg" style={{ fontWeight: isUnread ? '700' : '500', color: isUnread ? '#0f172a' : '#64748b' }}>
          {n.message}
        </div>
        <div className="hn-notif-meta">
          <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '999px', background: cat.bg, color: cat.color }}>
            {n.category}
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{formatDate(n.createdDate)}</span>
          {!isUnread && (
            <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '999px', background: '#f1f5f9', color: '#64748b' }}>READ</span>
          )}
        </div>
      </div>
      {showMarkRead && isUnread && (
        <button
          className="hn-btn-outline-primary"
          style={{ height: '30px', padding: '0 12px', fontSize: '12px', flexShrink: 0 }}
          disabled={marking === n.id}
          onClick={() => onMarkRead(n.id)}
        >
          {marking === n.id ? '…' : 'Mark Read'}
        </button>
      )}
    </div>
  )
}

const SectionHeader = ({ title, count, accent }) => (
  <div style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <div style={{ width: '4px', height: '18px', borderRadius: '4px', background: accent }} />
    <span style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{title}</span>
    <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '999px', background: accent.includes('dc2626') ? '#fee2e2' : '#f0f9ff', color: accent.includes('dc2626') ? '#991b1b' : '#0284c7' }}>
      {count}
    </span>
  </div>
)

const NotificationList = ({ notifications, unread, read, loading, error, markAsRead, marking }) => {
  if (loading) return <Loader message="Loading notifications…" />

  if (error) return (
    <div className="hn-alert hn-alert-danger">⚠️ {error}</div>
  )

  if (notifications.length === 0) {
    return (
      <div className="hn-empty">
        <div className="hn-empty-icon">✅</div>
        <div className="hn-empty-title">All caught up!</div>
        <div className="hn-empty-desc">You have no notifications at this time.</div>
      </div>
    )
  }

  return (
    <>
      {unread.length > 0 && (
        <div className="hn-table-card" style={{ marginBottom: '20px' }}>
          <SectionHeader title="Unread" count={unread.length} accent="linear-gradient(135deg,#dc2626,#f87171)" />
          {unread.map(n => (
            <NotificationItem key={n.id} n={n} onMarkRead={markAsRead} marking={marking} />
          ))}
        </div>
      )}

      {read.length > 0 && (
        <div className="hn-table-card">
          <SectionHeader title="Read" count={read.length} accent="linear-gradient(135deg,#0284c7,#38bdf8)" />
          {read.map(n => (
            <NotificationItem key={n.id} n={n} onMarkRead={markAsRead} marking={marking} showMarkRead={false} />
          ))}
        </div>
      )}
    </>
  )
}

export default NotificationList
