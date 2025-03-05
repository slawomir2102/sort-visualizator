import { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { OverlayPlacement} from "@nextui-org/aria-utils";

interface PopoverWrapperMyProps {
  children: ReactNode;
  content: ReactNode;
  isVisible: boolean;
  ariaLabel: string;
  className?: string;
  placement? : OverlayPlacement;
}

const PopoverWrapper = ({children, content, isVisible, ariaLabel, className, placement}: PopoverWrapperMyProps) => {

  return (
    <Popover
      showArrow
      offset={10}
      placement={placement || "right"}
      isOpen={isVisible}
      style={{ cursor: "pointer" }}
      aria-label={ariaLabel}
      className={className}

    >
      <PopoverTrigger>
        <div className={'w-full h-full'} aria-expanded={false}>{children}</div>
      </PopoverTrigger>
      <PopoverContent>{content}</PopoverContent>
    </Popover>
  );
};

export default PopoverWrapper;