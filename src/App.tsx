import Layout from "./Layout.tsx";
import { Route, Routes } from "react-router-dom";
import VisualizerPage from "./pages/visualizer/VisualizerPage.tsx";
import HomePage from "./pages/home/HomePage.tsx";
import NoPage from "./pages/nopage/NoPage.tsx";
import BenchmarkPage from "./pages/benchmark/BenchmarkPage.tsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/visualizator" element={<VisualizerPage />} />
        <Route path="/benchmark" element={<BenchmarkPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  );
};

export default App;