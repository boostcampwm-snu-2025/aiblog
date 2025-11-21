import { Outlet } from "react-router-dom";
import ActivityList from "./ActivityList";
import BlogDisplay from "./BlogDisplay";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* New Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        {/* Left: My GitHub Diary */}
        <div className="flex-none">
          <h1 className="text-2xl font-bold text-pink-500 font-gsans">
            My GitHub Diary
          </h1>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center space-x-4">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
            Settings
          </button>
          <button className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded">
            Saved Posts
          </button>
        </div>
      </header>

      {/* Main content area (two columns) */}
      <div className="flex flex-1">
        {/* Left Column */}
        <div className="w-1/2 flex flex-col">
          <main className="overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet /> {/* Renders Homepage with RepoInput */}
          </main>
        </div>

        {/* Right Column */}
        <aside className="w-1/2 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-white border-l border-gray-200">
          <BlogDisplay />
        </aside>
      </div>
    </div>
  );
};

export default Layout;
