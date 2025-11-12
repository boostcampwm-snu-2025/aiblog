import { useState } from "react";
import RepoInput from "./components/RepoInput";
import ActivityList from "./components/ActivityList";

function App() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchActivities = async (owner, repo) => {
    setIsLoading(true);
    setError(null);
    setActivities([]);

    try {
      const response = await fetch(
        `/api/github/activities?owner=${owner}&repo=${repo}`
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setActivities(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center my-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-pink-500 font-gsans">
            My GitHub Diary
          </h1>
          <p className="text-gray-500 mt-2">
            A cute little blog generated from your GitHub activities!
          </p>
        </header>
        <main className="max-w-2xl mx-auto">
          <RepoInput onFetch={fetchActivities} />
          <ActivityList
            activities={activities}
            isLoading={isLoading}
            error={error}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
