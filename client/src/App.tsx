import './App.css'
import Navigation from './assets/Navigation'
import RepoList from './assets/RepoList';
import Search from './assets/Search';
import { useState, useEffect } from "react";
import type { Repo } from './assets/types';
function App() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [username, setUsername] = useState("zoo-zer0");
  const [repoName, setRepoName] = useState(null);
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
  return (
    <>
      <Navigation/>
      <Search username={username} repoName={repoName}/>
      <RepoList username={username} repos={repos} />
    
    </>
  )
}

export default App
