interface RepoInputProps {
  owner: string;
  repo: string;
  onChangeOwner: (v: string) => void;
  onChangeRepo: (v: string) => void;
  onSubmit: (owner: string, repo: string) => void;
}

export default function RepoInput({
  owner,
  repo,
  onChangeOwner,
  onChangeRepo,
  onSubmit,
}: RepoInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!owner || !repo) return;
    onSubmit(owner, repo);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-2 items-center justify-center my-4"
    >
      <input
        type="text"
        placeholder="owner (ex: facebook)"
        value={owner}
        onChange={(e) => onChangeOwner(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <input
        type="text"
        placeholder="repo (ex: react)"
        value={repo}
        onChange={(e) => onChangeRepo(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        가져오기
      </button>
    </form>
  );
}