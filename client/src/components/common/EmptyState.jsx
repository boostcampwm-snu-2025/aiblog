const EmptyState = ({ icon, title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="text-gh-fg-subtle mb-4">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gh-fg-default mb-2">
        {title || 'No data available'}
      </h3>
      
      {message && (
        <p className="text-gh-fg-muted max-w-md">
          {message}
        </p>
      )}
    </div>
  );
};

export default EmptyState;
