export default function NavBar({ onNav }) {
  return (
    <div className="nav">
      <div className="inner">
        <strong>AI Blog</strong>
        <div>
          <a href="#" onClick={(e)=>{e.preventDefault(); onNav('home')}}>Home</a>
          <a href="#" onClick={(e)=>{e.preventDefault(); onNav('saved')}}>Saved Posts</a>
        </div>
      </div>
    </div>
  );
}
