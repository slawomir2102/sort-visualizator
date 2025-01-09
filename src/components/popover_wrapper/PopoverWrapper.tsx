import React, { ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";

type PopoverWrapperProps = {
  children: ReactNode; // Elementy, które chcemy opakować
  content: ReactNode; // Treść wyświetlana w popoverze
  trigger: boolean;
  onTrigger?: () => void;
};

const PopoverWrapper: React.FC<PopoverWrapperProps> = ({
  children,
  content,
  trigger,
  onTrigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (newState: boolean) => {
    setIsOpen(newState);
    if (onTrigger) {
      onTrigger(newState);
    }
  };
  return (
    <div style={{ position: "relative" }}>
      {/* Apply blur effect only when popover is open */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)", // Apply blur effect to the parent container
            zIndex: -1, // Ensure blur stays behind the popover
          }}
        />
      )}
      <Popover
        backdrop={"blur"}
        showArrow
        offset={10}
        placement={"right"}
        isOpen={trigger}
        onClick={onTrigger}
      >
        <PopoverTrigger>
          {/* Renderowanie dzieci jako wyzwalacza */}
          <div style={{ display: "inline-block" }}>{children}</div>
        </PopoverTrigger>
        <PopoverContent>{content}</PopoverContent>
      </Popover>
    </div>
  );
};

export default PopoverWrapper;