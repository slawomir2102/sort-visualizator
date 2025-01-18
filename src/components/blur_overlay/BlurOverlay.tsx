import React from "react";

type BlurOverlayProps = {
  isVisible: boolean;
  setIsBlurActive: (newState: boolean) => void;
};

const BlurOverlay: React.FC<BlurOverlayProps> = ({
  isVisible,
  setIsBlurActive,
}) => {
  return isVisible ? (
    <div
      onClick={setIsBlurActive}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(3px)",
        zIndex: 9998, // Ensure it sits below the popover
        cursor: "pointer",
      }}
    />
  ) : null;
};

export default BlurOverlay;