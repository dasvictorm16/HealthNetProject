const DoctorPageHeader = ({ title, subtitle, icon, action }) => (
  <div className="hn-page-header-row">
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      {icon && (
        <div className="hn-page-header-icon">
          {icon}
        </div>
      )}
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>{title}</h2>
        {subtitle && <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0', fontWeight: '500' }}>{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
)

export default DoctorPageHeader
