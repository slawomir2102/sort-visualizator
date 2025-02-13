import { Card, Navbar, NavbarContent } from "@nextui-org/react";
import ThemeSwitcher from "../theme_switcher/ThemeSwitcher.tsx";
import NavigationLink from "./navigation_link/NavigationLink.tsx";

const Navigation = () => {
  return (
    <div className={"p-4 w-full"}>
      <Card>
        <Navbar className={"bg-content1 flex flex-row items-center justify-between"}>
          <NavbarContent
            className="flex flex-row items-center justify-between gap-xl "
          >
            <NavigationLink destination={"/home"} title={"home"} />
            <NavigationLink
              destination={"/visualizator"}
              title={"visualizator"}
            />
            <NavigationLink destination={"/benchmark"} title={"benchmark"} />
          </NavbarContent>
          <NavbarContent className={'flex flex-row items-center gap-lg'}>
            <p>Motyw</p>
            <ThemeSwitcher />
          </NavbarContent>
        </Navbar>
      </Card>
    </div>
  );
};

export default Navigation;