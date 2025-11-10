import { useState } from 'react';
import { parseRepositoryInput } from '../../utils/helpers';
import { useUIStore } from '../../store/uiStore';

const RepositoryInput = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const { itemsPerPage, setItemsPerPage } = useUIStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const parsed = parseRepositoryInput(input);
    
    if (!parsed) {
      setError('Invalid repository format. Use: owner/repo or https://github.com/owner/repo');
      return;
    }

    onSubmit(parsed.owner, parsed.repo);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="bg-gh-canvas-subtle border border-gh-border-default rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gh-fg-default mb-4">
        Analyze GitHub Repository
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="repo-input" className="block text-sm font-medium text-gh-fg-default mb-2">
            Repository
          </label>
          <input
            id="repo-input"
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="owner/repo or https://github.com/owner/repo"
            className="w-full px-4 py-2 bg-gh-canvas-default border border-gh-border-default rounded-md text-gh-fg-default placeholder-gh-fg-muted focus:outline-none focus:ring-2 focus:ring-gh-accent-emphasis focus:border-transparent"
          />
          {error && (
            <p className="mt-2 text-sm text-gh-danger-fg">{error}</p>
          )}
          <p className="mt-2 text-sm text-gh-fg-muted">
            Example: facebook/react or https://github.com/microsoft/vscode
          </p>
        </div>

        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1">
            <label htmlFor="items-per-page" className="block text-sm font-medium text-gh-fg-default mb-2">
              Items per page
            </label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="w-full px-4 py-2 bg-gh-canvas-default border border-gh-border-default rounded-md text-gh-fg-default focus:outline-none focus:ring-2 focus:ring-gh-accent-emphasis"
            >
              <option value={10}>10 items</option>
              <option value={20}>20 items</option>
              <option value={30}>30 items</option>
              <option value={50}>50 items</option>
              <option value={100}>100 items</option>
            </select>
          </div>

          <div className="flex-1 flex items-end">
            <button
              type="submit"
              className="w-full px-6 py-2 bg-gh-accent-emphasis hover:bg-gh-accent-fg text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:ring-offset-2 focus:ring-offset-gh-canvas-default"
            >
              Analyze Repository
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RepositoryInput;
