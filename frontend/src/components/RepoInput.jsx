import { useState } from "react";

function RepoInput({ onFetch }) {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (owner && repo) {
      onFetch(owner, repo);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="GitHub Owner (e.g., 'facebook')"
          className="flex-grow p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition-shadow"
          required
        />
        <input
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="Repository (e.g., 'react')"
          className="flex-grow p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition-shadow"
          required
        />
        <button
          type="submit"
          className="bg-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
        >
          Get Activities
        </button>
      </form>
    </div>
  );
}

export default RepoInput;
