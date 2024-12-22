import { Outlet } from "react-router-dom";
import Navigation from "./components/navigation/Navigation.tsx";

const Layout = () => {
  return (
    <div className={"flex flex-col items-center justify-center"}>
      <Navigation />

      <main className={"flex items-center justify-center w-full h-[85svh]"}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
