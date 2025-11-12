function ActivityList({ activities, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="text-center p-10">
        <p className="text-lg text-gray-500">Loading activities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p className="font-bold">Oops! Something went wrong.</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center p-10">
        <p className="text-lg text-gray-500">
          No activities to display. Enter a repository and click "Get
          Activities".
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div
          key={activity.sha}
          className="bg-white rounded-xl shadow-lg p-6 transition-transform transform hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex items-center mb-4">
            <img
              src={activity.author?.avatar_url}
              alt={activity.commit.author.name}
              className="w-10 h-10 rounded-full mr-4 border-2 border-pink-200"
            />
            <span className="font-bold text-gray-800">
              {activity.commit.author.name}
            </span>
          </div>
          <p className="text-gray-700 text-lg mb-3">
            {activity.commit.message}
          </p>
          <span className="text-sm text-gray-400">
            {new Date(activity.commit.author.date).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ActivityList;
