interface TabSwitcherProps {
  active: "commits" | "prs";
  onChange: (tab: "commits" | "prs") => void;
}

export function TabSwitcher({ active, onChange }: TabSwitcherProps) {
  return (
    <div className="flex justify-center gap-4 mb-4">
      <button
        onClick={() => onChange("commits")}
        className={`px-4 py-2 rounded ${
          active === "commits"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Commits
      </button>
      <button
        onClick={() => onChange("prs")}
        className={`px-4 py-2 rounded ${
          active === "prs"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Pull Requests
      </button>
    </div>
  );
}