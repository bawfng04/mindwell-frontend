import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Homepage.tsx";
import ExpertsPage from "./pages/ExpertsPage.tsx";
import ExpertDetailPage from "./pages/ExpertDetailPage.tsx";
import PaymentPage from "./pages/PaymentPage.tsx";
import MindPointsPage from "./pages/MindPointsPage.tsx";
import BlogPage from "./pages/BlogPage.tsx";
import BlogDetailPage from "./pages/BlogDetailPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import NotFound from "./components/NotFound.tsx";
import AppointmentsPage from "./pages/AppointmentsPage.tsx";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/chuyen-gia" element={<ExpertsPage />} />
        <Route path="/chuyen-gia/:id" element={<ExpertDetailPage />} />
        <Route path="/thanh-toan" element={<PaymentPage />} />
        <Route path="/mindpoints" element={<MindPointsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/lich-hen" element={<AppointmentsPage />} />
        <Route path="/dang-ky" element={<SignupPage />} />
        <Route path="/dang-nhap" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
