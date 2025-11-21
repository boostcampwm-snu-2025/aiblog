import React from "react";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ActivityProvider } from "./contexts/ActivityContext";
import Layout from "./components/Layout";

const Homepage = lazy(() => import("./pages/homepage"));

function App() {
  return (
    <BrowserRouter>
      <ActivityProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Homepage />} />
            </Route>
          </Routes>
        </Suspense>
      </ActivityProvider>
    </BrowserRouter>
  );
}
export default App;
