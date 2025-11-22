import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SavedPostProvider } from "./views/context/SavedPostContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <SavedPostProvider>
                <App />
            </SavedPostProvider>
        </BrowserRouter>
    </React.StrictMode>
);
