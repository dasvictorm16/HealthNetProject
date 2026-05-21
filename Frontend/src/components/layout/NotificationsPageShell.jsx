import { useState } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import NotificationList from '../common/NotificationList'
import useNotifications from '../../hooks/useNotifications'

const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

const NotificationsPageShell = () => {
  const { notifications, unread, read, loading, error, markAsRead, markAllAsRead } = useNotifications()
  const [marking, setMarking] = useState(null)
  const [markingAll, setMarkingAll] = useState(false)

  const handleMarkRead = async (id) => {
    setMarking(id)
    await markAsRead(id)
    setMarking(null)
  }

  const handleMarkAll = async () => {
    setMarkingAll(true)
    await markAllAsRead()
    setMarkingAll(false)
  }

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="hn-page-header-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="hn-page-header-icon">
            <BellIcon />
          </div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>
              Notifications
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0', fontWeight: '500' }}>
              {loading ? 'Loading…' : unread.length > 0
                ? <><strong style={{ color: '#dc2626' }}>{unread.length} unread</strong> notification{unread.length !== 1 ? 's' : ''}</>
                : 'All notifications are read.'}
            </p>
          </div>
        </div>
        {unread.length > 0 && (
          <button
            className="hn-btn-outline-secondary"
            onClick={handleMarkAll}
            disabled={markingAll}
            style={{ height: '38px' }}
          >
            {markingAll ? 'Marking…' : '✓ Mark all as read'}
          </button>
        )}
      </div>

      <NotificationList
        notifications={notifications}
        unread={unread}
        read={read}
        loading={loading}
        error={error}
        markAsRead={handleMarkRead}
        marking={marking}
      />
    </DashboardLayout>
  )
}

export default NotificationsPageShell
