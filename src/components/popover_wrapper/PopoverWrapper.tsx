import React, { ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";

type PopoverWrapperProps = {
  children: ReactNode; // Elementy, które chcemy opakować
  content: ReactNode; // Treść wyświetlana w popoverze
  triggerType?: "click" | "hover";
  setIsBlurActive: (state: boolean) => void;
};

const PopoverWrapper: React.FC<PopoverWrapperProps> = ({
  children,
  content,
  triggerType = "click",
  setIsBlurActive,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (newState: boolean) => {
    console.log("Popover state:", newState); // Debugging
    setIsOpen(newState);
    setIsBlurActive(newState); // Toggle blur
  };
  return (
    <Popover
      showArrow
      offset={10}
      placement={"right"}
      triggerType={triggerType}
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      style={{ cursor: "pointer" }}
    >
      <PopoverTrigger>
        {/* Renderowanie dzieci jako wyzwalacza */}
        <div style={{ display: "inline-block" }}>{children}</div>
      </PopoverTrigger>
      <PopoverContent>{content}</PopoverContent>
    </Popover>
  );
};

export default PopoverWrapper;