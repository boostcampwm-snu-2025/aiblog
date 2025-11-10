import { useUIStore } from '../../store/uiStore';
import CommitsList from './CommitsList';
import PullRequestsList from './PullRequestsList';
import SearchBar from './SearchBar';
import SortDropdown from './SortDropdown';

const ActivityTabs = ({ owner, repo }) => {
  const { activeTab, setActiveTab } = useUIStore();

  const tabs = [
    { id: 'commits', label: 'Commits', icon: '📝' },
    { id: 'pulls', label: 'Pull Requests', icon: '🔀' }
  ];

  return (
    <div className="bg-gh-canvas-subtle border border-gh-border-default rounded-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gh-border-default bg-gh-canvas-default">
        <nav className="flex space-x-1 px-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-gh-accent-emphasis text-gh-fg-default'
                  : 'border-transparent text-gh-fg-muted hover:text-gh-fg-default hover:border-gh-border-default'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Controls: Search and Sort */}
      <div className="p-4 bg-gh-canvas-subtle border-b border-gh-border-default">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar />
          </div>
          <div className="w-full sm:w-48">
            <SortDropdown />
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'commits' && <CommitsList owner={owner} repo={repo} />}
        {activeTab === 'pulls' && <PullRequestsList owner={owner} repo={repo} />}
      </div>
    </div>
  );
};

export default ActivityTabs;
