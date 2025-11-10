const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-gh-canvas-subtle border border-gh-danger-fg rounded-lg p-6 text-center">
      <div className="flex justify-center mb-4">
        <svg 
          className="w-12 h-12 text-gh-danger-fg" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-gh-fg-default mb-2">
        Something went wrong
      </h3>
      
      <p className="text-gh-fg-muted mb-4">
        {message || 'An error occurred while fetching data.'}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-gh-btn-bg hover:bg-gh-btn-hover-bg active:bg-gh-btn-active-bg text-gh-fg-default border border-gh-border-default rounded-md transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
