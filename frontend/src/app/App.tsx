import AppProvider from "./providers/provider";
import AppRouter from "./routes/router";

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
