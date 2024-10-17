import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <div className="font-poppins bg-[#1261A0]">
        <App />
      </div>
    </AuthProvider>
  </StrictMode>
);
