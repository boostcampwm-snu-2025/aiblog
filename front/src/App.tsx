import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { EditPage } from "./pages/EditPage";
import { MainPage } from "./pages/MainPage";

const App = () => {
  return (
    <BrowserRouter>
      <div className="place-self-center">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/edit" element={<EditPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
