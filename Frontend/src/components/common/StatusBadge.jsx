// Color map aligned with HealthNet design system
const STATUS_STYLES = {
  // Generic
  ACTIVE:          { bg: '#dcfce7', color: '#166534' },
  INACTIVE:        { bg: '#f1f5f9', color: '#64748b' },
  SUSPENDED:       { bg: '#fee2e2', color: '#991b1b' },
  // Document
  PENDING:         { bg: '#fef3c7', color: '#92400e' },
  VERIFIED:        { bg: '#dcfce7', color: '#166534' },
  REJECTED:        { bg: '#fee2e2', color: '#991b1b' },
  // Immunization
  GIVEN:           { bg: '#dcfce7', color: '#166534' },
  MISSED:          { bg: '#fee2e2', color: '#991b1b' },
  // Outbreak
  DETECTED:        { bg: '#fee2e2', color: '#991b1b' },
  CONTAINED:       { bg: '#fef3c7', color: '#92400e' },
  CLOSED:          { bg: '#f1f5f9', color: '#64748b' },
  // Vaccination
  UPCOMING:        { bg: '#dbeafe', color: '#1e40af' },
  COMPLETED:       { bg: '#f1f5f9', color: '#64748b' },
  // Notification
  UNREAD:          { bg: '#ede9fe', color: '#5b21b6' },
  READ:            { bg: '#f1f5f9', color: '#64748b' },
  // Disease case
  REPORTED:        { bg: '#dbeafe', color: '#1e40af' },
  UNDER_TREATMENT: { bg: '#fef3c7', color: '#92400e' },
  RECOVERED:       { bg: '#dcfce7', color: '#166534' },
  // Case update
  OBSERVED:        { bg: '#e0f2fe', color: '#0369a1' },
  FOLLOW_UP:       { bg: '#fef3c7', color: '#92400e' },
  STABLE:          { bg: '#dcfce7', color: '#166534' },
  CRITICAL:        { bg: '#fee2e2', color: '#991b1b' },
  // Epidemiology
  RECORDED:        { bg: '#e0f2fe', color: '#0369a1' },
  ANALYZED:        { bg: '#dcfce7', color: '#166534' },
  ARCHIVED:        { bg: '#f1f5f9', color: '#64748b' },
  // Report scope
  OUTBREAK:        { bg: '#fee2e2', color: '#991b1b' },
  VACCINATION:     { bg: '#dcfce7', color: '#166534' },
  COMPLIANCE:      { bg: '#dbeafe', color: '#1e40af' },
  CASE:            { bg: '#e0f2fe', color: '#0369a1' },
  // Compliance result
  PASS:            { bg: '#dcfce7', color: '#166534' },
  FAIL:            { bg: '#fee2e2', color: '#991b1b' },
  WARNING:         { bg: '#fef3c7', color: '#92400e' },
  NON_COMPLIANT:   { bg: '#fee2e2', color: '#991b1b' },
  // Audit
  OPEN:            { bg: '#fef3c7', color: '#92400e' },
  IN_REVIEW:       { bg: '#dbeafe', color: '#1e40af' },
}

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] ?? { bg: '#f1f5f9', color: '#64748b' }
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      borderRadius: '999px',
      fontSize: '11px',
      fontWeight: '700',
      padding: '3px 10px',
      whiteSpace: 'nowrap',
      display: 'inline-block',
    }}>
      {status?.replace(/_/g, ' ') ?? '—'}
    </span>
  )
}

export default StatusBadge
