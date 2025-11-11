export function BlogPreview({ markdown }:{ markdown:string }){
    return <pre className="preview">{markdown}</pre>; // 간단 표시(필요 시 markdown 렌더러 도입)
  }