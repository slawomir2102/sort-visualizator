import React, { useEffect } from "react";

type BlurOverlayProps = {
  isVisible: boolean;
  setIsBlurActive: (newState: boolean) => void;
  title: string;
};

const BlurOverlay: React.FC<BlurOverlayProps> = ({
  isVisible,
  setIsBlurActive,
  title,
}) => {
  useEffect(() => {
    console.log("isVisible", isVisible);
  }, [isVisible]);

  return isVisible ? (
    <div
      onClick={() => {
        setIsBlurActive(!isVisible);
      }}
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
    >
      <div className={"p-10 "}>
        <div className={"w-full bg-gray-700/60 backdrop-blur-xl rounded-lg"}>
          <h2
            className={
              "w-full text-[40px] drop-shadow-xl text-white text-center py-10"
            }
          >
            {title}
          </h2>
        </div>
      </div>
    </div>
  ) : null;
};

export default BlurOverlay;