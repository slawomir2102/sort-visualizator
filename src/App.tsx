import Layout from "./Layout.tsx";
import { Navigate, Route, Routes } from "react-router-dom";
import VisualizerPage from "./pages/visualizer/VisualizerPage.tsx";
import HomePage from "./pages/home/HomePage.tsx";
import NoPage from "./pages/nopage/NoPage.tsx";
import BenchmarkPage from "./pages/benchmark/BenchmarkPage.tsx";
import AboutPage from "./pages/about/AboutPage.tsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/visualizator" element={<VisualizerPage />} />
        <Route path="/benchmark" element={<BenchmarkPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  );
};

export default App;