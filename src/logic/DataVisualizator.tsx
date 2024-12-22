import ChartBox from "../components/chart_box/ChartBox.tsx";
import { useState } from "react";

const DataVisualizator = () => {
  const [activeBoxIndexI, setActiveBoxIndexI] = useState<number | null>(null);
  const [activeBoxIndexJ, setActiveBoxIndexJ] = useState<number | null>(null);
  const [pivotIndex, setPivotIndex] = useState<number | undefined>();
  const [rangeDown, setRangeDown] = useState<number | undefined>();
  const [rangeUp, setRangeUp] = useState<number | undefined>();

  const highlightCurrentOperation = () => {
    getSimulator((simulator) => {
      if (
        simulator.currentStep < 0 &&
        simulator.currentStep > simulator.numberOfLastStep
      ) {
        resetHighlight();
        return;
      }

      const currentOperation = simulator.operations[simulator.currentStep];

      if (!currentOperation) {
        resetHighlight();
        return;
      }

      setActiveBoxIndexI(currentOperation.leftNumber);
      setActiveBoxIndexJ(currentOperation.rightNumber);

      if (
        currentOperation.pivot !== undefined ||
        currentOperation.rangeDown !== undefined ||
        currentOperation.rangeUp !== undefined
      ) {
        setRangeDown(currentOperation.rangeDown);
        setRangeUp(currentOperation.rangeUp);
        setPivotIndex(currentOperation.pivot);
      }
    });
  };

  // Helper function to reset highlights
  const resetHighlight = () => {
    setActiveBoxIndexI(null);
    setActiveBoxIndexJ(null);
    setRangeDown(undefined);
    setRangeUp(undefined);
    setPivotIndex(undefined);
  };

  return (
    <div className={"flex flex-row items-end justify-between "}>
      {dataToSort.map((item, index) => {
        const isActiveI = index === activeBoxIndexI;
        const isActiveJ = index === activeBoxIndexJ;

        const isPivot = index === pivotIndex;
        const isRangeDown = index === rangeDown;
        const isRangeUp = index === rangeUp;

        return (
          <ChartBox
            key={index}
            index={index}
            label={item}
            height={item}
            className={`
                ${isActiveI && isRangeDown && isRangeUp ? "border-l-4 border-r-4 border-purple-500" : ""}
                ${(isActiveI && isRangeDown) || isRangeDown ? "border-l-4 border-purple-500" : ""}
                ${(isRangeUp && isPivot) || (isRangeUp && isActiveJ) ? "border-r-4 border-purple-500" : ""}
                ${isActiveI ? "!bg-blue-300" : ""}
                ${isActiveJ ? "!bg-green-300" : ""}
                ${isPivot ? "!bg-amber-500" : ""}
                `}
          />
        );
      })}
    </div>
  );
};

export default DataVisualizator;
