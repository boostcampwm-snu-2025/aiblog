import { useEffect, useState } from "react";
import type { Repo } from "../types";

export function useRepos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("http://localhost:3000/api/repos");
        if (!res.ok) throw new Error("Failed to fetch repos");

        const data = await res.json();
        setRepos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return { repos, loading, error };
}
