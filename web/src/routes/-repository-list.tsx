interface Props {
  onSelectRepo: (owner: string, repo: string) => void;
  repos: Repository[];
}

type Repository = {
  description: null | string;
  forks_count?: number;
  id: number;
  language?: null | string;
  name: string;
  owner: {
    login: string;
  };
  stargazers_count?: number;
};

function RepositoryList({ onSelectRepo, repos }: Props) {
  if (repos.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No repositories found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="mb-4 text-xl font-semibold">
        Found {repos.length}{" "}
        {repos.length === 1 ? "repository" : "repositories"}
      </h2>
      <div className="space-y-2">
        {repos.map((repo) => (
          <button
            className="w-full rounded-lg border p-4 text-left transition-colors hover:border-accent-foreground hover:bg-accent"
            key={repo.id}
            onClick={() => onSelectRepo(repo.owner.login, repo.name)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {repo.owner.login}/{repo.name}
                </h3>
                {repo.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {repo.description}
                  </p>
                )}
                <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                  {repo.language && <span>{repo.language}</span>}
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🍴 {repo.forks_count}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default RepositoryList;
