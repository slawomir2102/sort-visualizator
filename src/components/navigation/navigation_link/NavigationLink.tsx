import { NavbarItem } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const NavigationLink = ({
  className,
  destination,
  title,
}: {
  className?: string;
  destination: string;
  title: string;
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <NavbarItem
      className={`text-primary ${className}`}
      isActive={currentPath === destination}
    >
      <Link to={destination}>{title.toUpperCase()}</Link>
    </NavbarItem>
  );
};

export default NavigationLink;
