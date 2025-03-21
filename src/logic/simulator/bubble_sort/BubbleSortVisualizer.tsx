import ChartBox from "../../../components/chart_box/ChartBox.tsx";
import { useSimulator } from "../SimulatorContext.tsx";

import { useEffect, useState } from "react";
import { BubbleSortStep } from "./BubbleSort.ts";

export const BubbleSortVisualizer = () => {
  const { simulator, simContext } = useSimulator();

  const [activeBoxI, setActiveBoxI] = useState<number | null>(null);
  const [activeBoxJ, setActiveBoxJ] = useState<number | null>(null);
  const [sortedIndexes, setSortedIndexes] = useState<number[]>([]);
  const [prevStep, setPrevStep] = useState<number>(-1);

  useEffect(() => {
    if (!simulator) {
      return;
    }

    const currentStep = simulator.getCurrentStep;

    // Detect if we're moving forward or backward
    const steppingDirection = prevStep < currentStep ? "forward" : "backward";
    setPrevStep(currentStep);

    // Handle out of bounds
    if (currentStep < 0 || currentStep >= simulator.operations.length) {
      setActiveBoxI(null);
      setActiveBoxJ(null);
      return;
    }

    const currentOperation: BubbleSortStep = simulator.operations[
      currentStep
    ] as BubbleSortStep;

    if (!currentOperation) {
      return;
    }

    // Update active comparison elements - always do this regardless of step
    if (currentOperation.leftNumber) {
      setActiveBoxI(currentOperation.leftNumber.index);
    }

    if (currentOperation.rightNumber) {
      setActiveBoxJ(currentOperation.rightNumber.index);
    }

    // For step zero, we should only show comparison elements, not sorted elements
    if (currentStep === 0) {
      setSortedIndexes([]);
      return;
    }

    // Handle sorted elements differently based on direction
    if (steppingDirection === "forward") {
      // When moving forward, add new sorted elements

      setSortedIndexes((prevSorted) => {
        const newSorted = [...prevSorted];

        // Handle both position and indexes properties to be compatible with both algorithms
        if (currentOperation.sortedElements === undefined) return prevSorted;

        const positions =
          currentOperation.sortedElements.indexes ||
          currentOperation.sortedElements.indexes ||
          [];

        // Add any new sorted positions that aren't already tracked
        positions.forEach((pos) => {
          if (!newSorted.includes(pos)) {
            newSorted.push(pos);
          }
        });

        return newSorted;
      });

      // Check if this is the final step of the algorithm
      if (currentStep === simulator.operations.length - 1) {
        // Ensure all elements are marked as sorted at the end of the algorithm
        const allIndexes = Array.from(
          { length: simContext.simDataToSort.length },
          (_, i) => i,
        );
        setSortedIndexes(allIndexes);
      }
    } else {
      // When moving backward, recalculate sorted elements up to the current step
      recalculateSortedElementsUpToStep(currentStep);
    }
  }, [simContext.simCurrentStep, simulator]);

  // Function to recalculate sorted elements when going backward
  const recalculateSortedElementsUpToStep = (step: number) => {
    if (!simulator || step < 0) {
      setSortedIndexes([]);
      return;
    }

    // For step zero, we should only show comparison elements, not sorted elements
    if (step === 0) {
      setSortedIndexes([]);
      return;
    }

    // Start fresh and accumulate all sorted elements up to the current step
    const newSortedIndexes: number[] = [];

    // Loop through all operations up to the current step
    for (let i = 0; i <= step; i++) {
      if (i >= simulator.operations.length) break;

      const operation: BubbleSortStep = simulator.operations[
        i
      ] as BubbleSortStep;
      if (operation.sortedElements) {
        // Handle both position and indexes properties to be compatible with both algorithms
        const positions =
          operation.sortedElements.indexes ||
          operation.sortedElements.indexes ||
          [];

        // Add any new sorted positions that aren't already tracked
        positions.forEach((pos) => {
          if (!newSortedIndexes.includes(pos)) {
            newSortedIndexes.push(pos);
          }
        });
      }
    }

    // Check if this is the final step of the algorithm
    if (step === simulator.operations.length - 1) {
      // Ensure all elements are marked as sorted at the end of the algorithm
      return setSortedIndexes(
        Array.from({ length: simContext.simDataToSort.length }, (_, i) => i),
      );
    }

    setSortedIndexes(newSortedIndexes);
  };

  // Reset sorted indexes when data changes
  useEffect(() => {
    setSortedIndexes([]);
    setPrevStep(0);

    // Set initial comparison elements if simulator is available
    if (simulator && simulator.operations && simulator.operations.length > 0) {
      const initialOp: BubbleSortStep = simulator
        .operations[0] as BubbleSortStep;
      if (initialOp && initialOp.leftNumber && initialOp.rightNumber) {
        setActiveBoxI(initialOp.leftNumber.index);
        setActiveBoxJ(initialOp.rightNumber.index);
      }
    }
  }, [simContext.simDataToSort, simulator]);

  if (!simulator) {
    return <div>Symulator nie jest dostępny</div>;
  }

  return (
    <div className="flex flex-row items-end gap-xl h-40">
      {simContext.simDataToSort.map((item, index) => {
        // Prioritize highlighting: sorted status first, then active comparison elements
        const isSorted = sortedIndexes.includes(index);
        const isActiveI = index === activeBoxI;
        const isActiveJ = index === activeBoxJ;

        // Determine the appropriate CSS class based on element status
        let className = "";

        if (isSorted) {
          className = "!bg-pink-200"; // Sorted elements

          // If element is sorted but also being compared, add a border or different style
          if (isActiveI) {
            className = "!bg-pink-200 border-2 border-blue-500";
          } else if (isActiveJ) {
            className = "!bg-pink-200 border-2 border-green-500";
          }
        } else if (isActiveI) {
          className = "!bg-blue-300"; // Current left comparison element
        } else if (isActiveJ) {
          className = "!bg-green-300"; // Current right comparison element
        }

        return (
          <ChartBox
            key={index}
            index={index}
            label={item}
            height={item}
            className={className}
          />
        );
      })}
    </div>
  );
};