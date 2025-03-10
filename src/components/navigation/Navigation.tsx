import { Card, Navbar, NavbarContent } from "@nextui-org/react";
import ThemeSwitcher from "../theme_switcher/ThemeSwitcher.tsx";
import NavigationLink from "./navigation_link/NavigationLink.tsx";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Define types
type Route = "/home" | "/visualizator" | "/benchmark";
interface LinkRef {
  element: HTMLDivElement | null;
  path: Route;
}

interface UnderlineStyle {
  left: number;
  width: number;
  opacity: number;
  transition: string;
}

const Navigation = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState<Route | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const linkElements = useRef<LinkRef[]>([]);

  // Initialize underline style with typed values
  const [underlineStyle, setUnderlineStyle] = useState<UnderlineStyle>({
    left: 0,
    width: 0,
    opacity: 0,
    transition: "all 0.3s ease"
  });

  // Register a ref for a navigation link
  const registerLinkRef = (element: HTMLDivElement | null, path: Route) => {
    if (!element) return;

    // Update or add the ref to our array
    const existingIndex = linkElements.current.findIndex(link => link.path === path);
    if (existingIndex >= 0) {
      linkElements.current[existingIndex].element = element;
    } else {
      linkElements.current.push({ element, path });
    }
  };

  // Determine active link based on current path
  useEffect(() => {
    const path = location.pathname;

    // Map the path to one of our defined routes
    let activePath: Route | null = null;
    if (path === "/" || path === "/home") {
      activePath = "/home";
    } else if (path === "/visualizator") {
      activePath = "/visualizator";
    } else if (path === "/benchmark") {
      activePath = "/benchmark";
    }

    setActiveLink(activePath);
  }, [location]);

  // Update the underline position whenever active link changes or components rerender
  useEffect(() => {
    if (!activeLink || !navContainerRef.current) {
      // Hide underline if no active link
      setUnderlineStyle(prev => ({ ...prev, opacity: 0 }));
      return;
    }

    // Find the active element from our refs
    const activeRef = linkElements.current.find(link => link.path === activeLink);
    if (!activeRef || !activeRef.element) {
      setUnderlineStyle(prev => ({ ...prev, opacity: 0 }));
      return;
    }

    const activeElement = activeRef.element;
    const navContainer = navContainerRef.current;

    // Calculate position relative to container
    const containerRect = navContainer.getBoundingClientRect();
    const elementRect = activeElement.getBoundingClientRect();

    // Set new position
    setUnderlineStyle({
      left: elementRect.left - containerRect.left,
      width: elementRect.width,
      opacity: 1,
      transition: "all 0.3s ease"
    });
  }, [activeLink, linkElements.current]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Force recalculation of underline position
      setUnderlineStyle(prev => ({ ...prev }));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
      <div className={"p-4 w-full sticky top-0 left-0 z-30"}>
        <Card className={"flex flex-row justify-between items-center"}>
          <Navbar
              className={"bg-content1 flex flex-row items-center justify-between"}
          >
            {/* Wrap NavbarContent in a div with ref */}
            <div ref={navContainerRef} className="relative">
              <NavbarContent className="flex flex-row items-center justify-between gap-xl">
                <div ref={(el) => registerLinkRef(el, "/home")}>
                  <NavigationLink destination={"/home"} title={"strona główna"} />
                </div>

                <div ref={(el) => registerLinkRef(el, "/visualizator")}>
                  <NavigationLink
                      destination={"/visualizator"}
                      title={"wizualizer"}
                  />
                </div>

                <div ref={(el) => registerLinkRef(el, "/benchmark")}>
                  <NavigationLink
                      destination={"/benchmark"}
                      title={"tester algorytmów"}
                  />
                </div>

                {/* Animated underline - now inside the ref container div */}
                <div
                    className="absolute bottom-0 h-0.5 bg-primary rounded-full"
                    style={{
                      left: `${underlineStyle.left}px`,
                      width: `${underlineStyle.width}px`,
                      opacity: underlineStyle.opacity,
                      transition: underlineStyle.transition
                    }}
                />
              </NavbarContent>
            </div>
            <NavbarContent
                className={"flex flex-row items-center gap-lg"}
            ></NavbarContent>
          </Navbar>
          <p>Motyw</p>
          <ThemeSwitcher />
        </Card>
      </div>
  );
};

export default Navigation;