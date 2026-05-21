const Loader = ({ message = 'Loading...' }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0', gap: '12px' }}>
    <div style={{
      width: '20px', height: '20px', borderRadius: '50%',
      border: '3px solid #bae6fd', borderTopColor: '#0284c7',
      animation: 'hnSpin 0.7s linear infinite', flexShrink: 0,
    }} />
    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>{message}</span>
  </div>
)

export default Loader
