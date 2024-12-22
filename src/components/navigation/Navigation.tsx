import { Card, Navbar, NavbarContent } from "@nextui-org/react";
import ThemeSwitcher from "../theme_switcher/ThemeSwitcher.tsx";
import NavigationLink from "./navigation_link/NavigationLink.tsx";

const Navigation = () => {
  return (
    <div className={"p-4 w-full"}>
      <Card>
        <Navbar className={"bg-content1"}>
          <NavbarContent
            className="flex flex-row items-center justify-between gap-xl"
            justify="center"
          >
            <NavigationLink
              destination={"/visualizator"}
              title={"visualizator"}
            />
            <NavigationLink destination={"/benchmark"} title={"benchmark"} />
          </NavbarContent>
          <NavbarContent justify="end">
            <ThemeSwitcher />
          </NavbarContent>
        </Navbar>
      </Card>
    </div>
  );
};

export default Navigation;
