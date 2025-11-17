import RepoInput from "../components/RepoInput";
import { useActivities } from "../contexts/ActivityContext";
import ActivityList from "../components/ActivityList";

export const Homepage = () => {
  const { setRepoInfo } = useActivities();

  return (
    <div className="container mx-auto">
      <main className="max-w-2xl mx-auto">
        <RepoInput onFetch={setRepoInfo} />
        <ActivityList />
      </main>
    </div>
  );
};

export default Homepage;
