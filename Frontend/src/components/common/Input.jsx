const Input = ({ label, id, type = 'text', value, onChange, placeholder, error, ...props }) => {
  return (
    <div className="hn-field">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type={type}
        className={`hn-input${error ? ' is-invalid' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      {error && <span className="hn-field-error">{error}</span>}
    </div>
  )
}

export default Input
