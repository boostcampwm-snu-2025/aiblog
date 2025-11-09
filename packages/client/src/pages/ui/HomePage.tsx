import { RepoSearchForm } from "../../features/repo-search/ui/RepoSearchForm";

export function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Home</h1>
      <RepoSearchForm />
    </div>
  );
}
