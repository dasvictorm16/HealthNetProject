const ErrorMessage = ({ message }) => {
  if (!message) return null
  return (
    <div className="hn-alert hn-alert-danger" role="alert">
      <span>⚠️</span> {message}
    </div>
  )
}

export default ErrorMessage
