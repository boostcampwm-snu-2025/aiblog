import './App.css'
import Navigation from './assets/Navigation'
import RepoList from './assets/RepoList';
import Search from './assets/Search';
import CommitList from './assets/CommitList';
import LoadingBar from './assets/LoadingBar';
import { useState, useEffect } from "react";
import type { Repo } from './assets/types';
function App() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [username, setUsername] = useState("zoo-zer0"); //todo: fetch username
  const [repoName, setRepoName] = useState("");
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState(""); //add something for error later
  useEffect(()=>{
    const fetchRepos = async () =>{
      setLoading(true);
      setError("");
      try {
        const response = await fetch("http://localhost:3000/api/repos");
        if(!response.ok) throw new Error("Failed to fecth repos");
        const data: Repo[] = await response.json();
        setRepos(data);
      } catch(err:any){
        setError(err.message);
      } finally{
        setLoading(false);
      }
    };
    fetchRepos();
  },[]);
  useEffect(()=>{
    if(!repoName) return;
    const fetchRepo = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/commits`);
        if (!response.ok) throw new Error("Failed to fetch commits");

        const data = await response.json();
        setCommits(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepo();
  }, [username, repoName]);
  const handleSearch = (username: string, repo: string)=>{
    setRepoName(repo);
    setUsername(username);
  }
  return (
    <>
        <Navigation/>
        <Search username={username} repoName={repoName} onSearch={handleSearch}/>
        
        {loading ? (
          <LoadingBar loading={loading} />
        ) : !repoName ? (
          <RepoList onClick={handleSearch} username={username} repos={repos} />
        ) : (
          <CommitList username={username} repoName={repoName} commits={commits} />
        )}

    </>
  )
}

export default App
