import { useUIStore } from '../../store/uiStore';

const SortDropdown = () => {
  const { sortBy, sortOrder, setSortBy, setSortOrder, activeTab } = useUIStore();

  const commitOptions = [
    { value: 'date', label: 'Date' },
    { value: 'author', label: 'Author' },
    { value: 'message', label: 'Message' }
  ];

  const pullOptions = [
    { value: 'date', label: 'Date' },
    { value: 'author', label: 'Author' },
    { value: 'title', label: 'Title' },
    { value: 'state', label: 'State' }
  ];

  const options = activeTab === 'commits' ? commitOptions : pullOptions;

  return (
    <div className="flex gap-2">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="flex-1 px-3 py-2 bg-gh-canvas-default border border-gh-border-default rounded-md text-gh-fg-default text-sm focus:outline-none focus:ring-2 focus:ring-gh-accent-emphasis"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="px-3 py-2 bg-gh-canvas-default border border-gh-border-default rounded-md text-gh-fg-default hover:bg-gh-btn-hover-bg transition-colors"
        title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
      >
        {sortOrder === 'asc' ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default SortDropdown;
