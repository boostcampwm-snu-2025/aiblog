import React from "react";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ActivityProvider } from "./contexts/ActivityProvider";
import Layout from "./components/Layout";

const Homepage = lazy(() => import("./pages/homepage"));
const SavedPostsPage = lazy(() => import("./pages/SavedPostsPage"));
const PostDetailPage = lazy(() => import("./pages/PostDetailPage"));

function App() {
  return (
    <BrowserRouter>
      <ActivityProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Homepage />} />
              <Route path="/posts" element={<SavedPostsPage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
            </Route>
          </Routes>
        </Suspense>
      </ActivityProvider>
    </BrowserRouter>
  );
}
export default App;
