import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Homepage";

export default function App() {
  return (
    <div className="min-h-screen bg-[color:var(--pure-white)]">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}

