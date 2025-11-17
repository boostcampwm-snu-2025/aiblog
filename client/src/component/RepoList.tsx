import type { Repo } from "../types";
import GenerateBlogButton from "./GenerateBlogButton";
export default function RepoList({repos, username, onClick, onGenerate}: {repos: Repo[]; username: string, onClick: (username: string, repo: string) => void; onGenerate: (username: string, repoName: string)=>Promise<void>}){

    return(
        <div style={{width:"80%", margin:"auto auto"}}>
            <div
            style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.5rem",
                margin: "1rem",
                flexWrap: "wrap",
            }}
            >
                <p
                    style={{
                    color: "#70839F",
                    fontFamily: "monospace",
                    fontWeight: "600",
                    fontSize: "32px",
                    margin: 0,
                    }}
                >
                    {username}
                </p>
                <p
                    style={{
                    color: "#666666ff",
                    fontWeight: "500",
                    fontSize: "32px",
                    margin: 0,
                    }}
                >'s Repositories
                </p>
            </div>
            <div>
                {repos    .filter((repo) => repo.full_name.startsWith(`${username}/`))
                .map((repo) => (
                <div>
                    <GenerateBlogButton username={username} repoName={repo.name} onGenerate={onGenerate} />

                    <button onClick={()=>onClick(username, repo.name)} key={repo.id} style={{ marginBottom: "1rem", width:"100%", textAlign:"left" }}>
                        <a style={{fontSize:"20px",fontFamily:"monospace",color:"#70839F"}} href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        {repo.name}
                        </a>
                        <p>{repo.description || "No description"}</p>
                        <small>Last updated: {new Date(repo.updated_at).toLocaleString()}</small>
                    </button>
                </div>
                ))}
            </div>
        </div>
    )
}