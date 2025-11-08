import AppProvider from "./routes/provider";
import AppRouter from "./routes/router";

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
