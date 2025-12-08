import { Routes, Route } from "react-router-dom";
import Home from "./pages/Homepage.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={Home()} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
