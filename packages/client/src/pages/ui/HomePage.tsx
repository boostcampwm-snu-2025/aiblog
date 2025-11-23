import { CommitBrowser } from "@widgets/commit-browser";

export function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Home</h1>
      <CommitBrowser />
    </div>
  );
}
