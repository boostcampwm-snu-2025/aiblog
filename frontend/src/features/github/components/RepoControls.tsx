interface RepoControlsProps {
  loadRepos: () => void;
  resetInput: () => void;
}

export function RepoControls({ loadRepos, resetInput }: RepoControlsProps) {
  return (
    <div className="flex justify-center gap-3 mb-2">
      <button
        onClick={loadRepos}
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        내 저장소 불러오기
      </button>
      <button
        onClick={resetInput}
        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
      >
        직접 입력
      </button>
    </div>
  );
}