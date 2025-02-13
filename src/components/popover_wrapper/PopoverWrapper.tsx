import { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";

interface PopoverWrapperMyProps {
  children: ReactNode;
  content: ReactNode;
  isVisible: boolean;
}

const PopoverWrapper = ({children, content, isVisible}: PopoverWrapperMyProps) => {

  return (
    <Popover
      showArrow
      offset={10}
      placement={"right"}
      isOpen={isVisible}
      style={{ cursor: "pointer" }}
    >
      <PopoverTrigger>
        <div style={{ display: "inline-block" }}>{children}</div>
      </PopoverTrigger>
      <PopoverContent>{content}</PopoverContent>
    </Popover>
  );
};

export default PopoverWrapper;