import Layout from "./Layout.tsx";
import { Route, Routes } from "react-router-dom";
import Visualizator from "./pages/visualizator/Visualizator.tsx";
import Home from "./pages/home/Home.tsx";
import NoPage from "./pages/nopage/NoPage.tsx";
import Benchmark from "./pages/benchmark/Benchmark.tsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/visualizator" element={<Visualizator />} />
        <Route path="/benchmark" element={<Benchmark />} />
        <Route index path="/home" element={<Home />} />
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  );
};

export default App;
