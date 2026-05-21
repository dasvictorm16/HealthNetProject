const Card = ({ title, children, className = '', header, footer }) => {
  return (
    <div className={`hn-card ${className}`}>
      {(title || header) && (
        <div className="hn-card-header">
          {header || <span className="hn-card-title">{title}</span>}
        </div>
      )}
      <div className="hn-card-body">{children}</div>
      {footer && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card
