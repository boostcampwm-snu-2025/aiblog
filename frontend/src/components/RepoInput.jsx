//폼 + 드롭다운 UI + watch()
import { useForm } from "react-hook-form";
import { useGithubRepos } from "../hooks/useGithubRepos";
import { useGithubBranches } from "../hooks/useGithubBranches";
import useDebounce from "../hooks/useDebounce";

function RepoInput({ onFetch }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const owner = watch("owner");
  const debouncedOwner = useDebounce(owner, 500);
  const repo = watch("repo");

  const { data: repos, isLoading: repoLoading } = useGithubRepos(debouncedOwner);
  const { data: branches, isLoading: branchLoading } = useGithubBranches(
    debouncedOwner,
    repo
  );

  const onSubmit = (data) => onFetch(data);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-pink-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Select a Repository
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Owner Input */}
        <div>
          <label
            htmlFor="owner"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            GitHub Owner
          </label>
          <input
            id="owner"
            {...register("owner", { required: "Owner is required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            placeholder="e.g., facebook"
          />
          {errors.owner && (
            <p className="text-red-500 text-xs mt-1">{errors.owner.message}</p>
          )}
        </div>

        {/* Repo Dropdown */}
        <div>
          <label
            htmlFor="repo"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Repository
          </label>
          <select
            id="repo"
            {...register("repo", { required: "Repository is required" })}
            disabled={!repos || repoLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-100"
          >
            <option value="">
              {repoLoading ? "Loading repos..." : "Select Repo"}
            </option>
            {(Array.isArray(repos) ? repos : []).map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
          {errors.repo && (
            <p className="text-red-500 text-xs mt-1">{errors.repo.message}</p>
          )}
        </div>

        {/* Branch Dropdown */}
        <div>
          <label
            htmlFor="branch"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Branch
          </label>
          <select
            id="branch"
            {...register("branch", { required: "Branch is required" })}
            disabled={!branches || branchLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-100"
          >
            <option value="">
              {branchLoading ? "Loading branches..." : "Select Branch"}
            </option>
            {branches?.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
          {errors.branch && (
            <p className="text-red-500 text-xs mt-1">{errors.branch.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 transition-colors"
        >
          {isSubmitting ? "Fetching Activities..." : "Get Activities"}
        </button>
      </form>
    </div>
  );
}

export default RepoInput;
