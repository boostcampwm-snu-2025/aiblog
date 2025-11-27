import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { EditPage } from "@/pages/EditPage";
import { MainPage } from "@/pages/MainPage";
import { PostPage } from "@/pages/PostPage";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <div className="container mx-auto max-w-3xl lg:max-w-5xl p-4 sm:p-8">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/post" element={<PostPage />} />
              <Route path="/edit" element={<EditPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
