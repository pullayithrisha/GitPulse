import { AlertCircle, Ghost, Network } from 'lucide-react';

function EmptyState({ type, message, onRetry }) {
  let Icon = AlertCircle;
  let title = "Oops! Something went wrong.";

  if (type === 'error') {
    if (message.toLowerCase().includes('not found')) {
      Icon = Ghost;
      title = "User Not Found";
    } else if (message.toLowerCase().includes('connection') || message.toLowerCase().includes('rate limit')) {
      Icon = Network;
      title = "Connection Issue";
    }
  }

  return (
    <div className="empty-state glass-card">
      <Icon size={48} />
      <h3>{title}</h3>
      <p>{message}</p>
      {type === 'error' && onRetry && (
        <button className="primary-button" style={{ width: 'auto', padding: '0 24px', marginTop: '16px' }} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default EmptyState;
