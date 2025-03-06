import { Card, Navbar, NavbarContent } from "@nextui-org/react";
import ThemeSwitcher from "../theme_switcher/ThemeSwitcher.tsx";
import NavigationLink from "./navigation_link/NavigationLink.tsx";

const Navigation = () => {
  return (
    <div className={"p-4 w-full sticky top-0 left-0 z-30"}>
      <Card className={"flex flex-row justify-between items-center"}>
        <Navbar
          className={"bg-content1 flex flex-row items-center justify-between"}
        >
          <NavbarContent className="flex flex-row items-center justify-between gap-xl ">
            <NavigationLink destination={"/home"} title={"home"} />
            <NavigationLink
              destination={"/visualizator"}
              title={"visualizator"}
            />
            <NavigationLink destination={"/benchmark"} title={"benchmark"} />
          </NavbarContent>
          <NavbarContent
            className={"flex flex-row items-center gap-lg"}
          ></NavbarContent>
        </Navbar>
        <ThemeSwitcher />
      </Card>
    </div>
  );
};

export default Navigation;