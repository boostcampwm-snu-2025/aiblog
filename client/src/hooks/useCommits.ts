import { useEffect, useState } from "react";

export function useCommits(username: string, repoName: string) {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!repoName) return;

    const fetchCommits = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `https://api.github.com/repos/${username}/${repoName}/commits`
        );
        if (!res.ok) throw new Error("Failed to fetch commits");

        const data = await res.json();
        setCommits(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
  }, [username, repoName]);

  return { commits, loading, error };
}
