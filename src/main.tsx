import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider } from "next-themes";

import "./style.css";
import { SimulatorProvider } from "./logic/simulator/SImulatorProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <NextUIProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <SimulatorProvider>
          <App />
        </SimulatorProvider>
      </ThemeProvider>
    </NextUIProvider>
  </BrowserRouter>,
);