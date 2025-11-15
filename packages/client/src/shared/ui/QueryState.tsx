type QueryStateProps = {
  isLoading: boolean;
  error: unknown;
  isEmpty?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  children: React.ReactNode;
};

export function QueryState({
  isLoading,
  error,
  isEmpty = false,
  emptyMessage = "No data found",
  loadingMessage = "Loading...",
  children,
}: QueryStateProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">{loadingMessage}</div>
    );
  }

  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to load data";
    return <div className="text-center py-8 text-red-500">{errorMessage}</div>;
  }

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}
