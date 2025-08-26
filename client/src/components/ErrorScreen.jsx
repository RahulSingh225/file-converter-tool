import React from 'react';

const ErrorScreen = ({ message, onRetry }) => (
  <div className="p-6 border rounded bg-red-50 text-red-700">
    <div className="font-semibold mb-2">Error</div>
    <div className="mb-4">{message}</div>
    {onRetry && <button onClick={onRetry} className="bg-red-600 text-white py-1 px-3 rounded">Retry</button>}
  </div>
);

export default ErrorScreen;
