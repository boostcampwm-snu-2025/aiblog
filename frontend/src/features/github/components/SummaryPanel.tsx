interface SummaryPanelProps {
  title: string | null;
  summary: string | null;
  onSave: () => void;
}

export default function SummaryPanel({ title, summary, onSave }: SummaryPanelProps) {
  return (
    <div className="w-1/2 border rounded-lg shadow p-4 bg-white h-fit">
      <h2 className="text-xl font-bold mb-3">Selected Summary</h2>

      {!summary ? (
        <p className="text-gray-400">요약을 생성하면 이곳에 표시됩니다.</p>
      ) : (
        <>
          <h3 className="font-semibold text-lg">{title}</h3>
          <pre className="whitespace-pre-wrap text-sm mt-2 overflow-auto max-h-[400px]">
            {summary}
          </pre>

          <button
            onClick={onSave}
            className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            Save as Blog Post
          </button>
        </>
      )}
    </div>
  );
}