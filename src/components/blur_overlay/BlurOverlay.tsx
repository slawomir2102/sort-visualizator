import React, {useEffect} from "react";

type BlurOverlayProps = {
  isVisible: boolean;
  setIsBlurActive: (newState: boolean) => void;
};

const BlurOverlay: React.FC<BlurOverlayProps> = ({
  isVisible,
  setIsBlurActive,
}) => {

    useEffect(() => {
        console.log("isVisible",isVisible)
    }, [isVisible]);

  return isVisible ? (
    <div
      onClick={() => {setIsBlurActive(!isVisible)}}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(1px)",
        zIndex: 9998, // Ensure it sits below the popover
        cursor: "pointer",
      }}
    />
  ) : null;
};

export default BlurOverlay;