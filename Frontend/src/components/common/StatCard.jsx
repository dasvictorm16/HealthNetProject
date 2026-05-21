const StatCard = ({ title, value, icon, description }) => (
  <div
    style={{
      background: '#ffffff',
      border: '1px solid #e8edf5',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 12px rgba(10,50,114,0.06)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      transition: 'transform 0.18s, box-shadow 0.18s',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(10,50,114,0.12)' }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(10,50,114,0.06)' }}
  >
    {icon && (
      <div style={{
        width: '48px', height: '48px', borderRadius: '13px', flexShrink: 0,
        background: 'linear-gradient(135deg,#0284c7,#38bdf8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(2,132,199,0.25)',
        color: '#ffffff', fontSize: '20px',
      }}>
        {icon}
      </div>
    )}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{title}</div>
      <div style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', lineHeight: 1 }}>{value}</div>
      {description && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>{description}</div>}
    </div>
  </div>
)

export default StatCard
