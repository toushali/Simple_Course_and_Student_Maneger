export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box">
      <p><strong>Error:</strong> {message}</p>
      {onRetry && <button onClick={onRetry} className="btn-secondary">Retry</button>}
    </div>
  );
}