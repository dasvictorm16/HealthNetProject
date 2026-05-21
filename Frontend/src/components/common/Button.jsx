// Maps Bootstrap variant names to HealthNet button styles
const VARIANT_CLASS = {
  primary:           'hn-btn-primary',
  'outline-primary': 'hn-btn-outline-primary',
  'outline-secondary': 'hn-btn-outline-secondary',
  danger:            'hn-btn-danger',
  success:           'hn-btn-success',
}

const Button = ({ children, type = 'button', variant = 'primary', className = '', disabled = false, ...props }) => {
  const cls = VARIANT_CLASS[variant] ?? `btn btn-${variant}`
  return (
    <button
      type={type}
      className={`${cls} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
