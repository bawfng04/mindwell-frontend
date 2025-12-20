import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Homepage.tsx";
import ExpertsPage from "./pages/ExpertsPage.tsx";
import ExpertDetailPage from "./pages/ExpertDetailPage.tsx";
import PaymentPage from "./pages/PaymentPage.tsx";
import MindPointsPage from "./pages/MindPointsPage.tsx";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/chuyen-gia" element={<ExpertsPage />} />
        <Route path="/chuyen-gia/:id" element={<ExpertDetailPage />} />
        <Route path="/thanh-toan" element={<PaymentPage />} />
        <Route path="/mindpoints" element={<MindPointsPage />} />
        <Route
          path="*"
          element={<div className="py-10 text-center">404 Not Found</div>}
        />
      </Route>
    </Routes>
  );
}

export default App;
