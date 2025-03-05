import ChartBox from "../../../components/chart_box/ChartBox.tsx";
import { useSimulator } from "../SimulatorContext.tsx";

import { useEffect, useState } from "react";

import { InsertionSortOperation, InsertionSortStep } from "./InsertionSort.ts";

export const InsertionSortVisualizer = () => {
  const { simulator, simContext } = useSimulator();
  const [currentKey, setCurrentKey] = useState<number | null>(null);
  const [comparingIndex, setComparingIndex] = useState<number | null>(null);
  const [shiftingIndex, setShiftingIndex] = useState<number | null>(null);
  const [insertPosition, setInsertPosition] = useState<number | null>(null);
  const [sortedIndexes, setSortedIndexes] = useState<number[]>([]);
  const [prevStep, setPrevStep] = useState<number>(-1);

  useEffect(() => {
    if (!simulator) {
      return;
    }
    const currentStep = simulator.getCurrentStep;
    const steppingDirection = prevStep < currentStep ? "forward" : "backward";
    setPrevStep(currentStep);

    // Handle out of bounds
    if (currentStep < 0 || currentStep >= simulator.operations.length) {
      resetVisualState();
      return;
    }

    const currentOperation: InsertionSortStep = simulator.operations[
      currentStep
    ] as InsertionSortStep;

    if (!currentOperation) {
      return;
    }

    const {
      comparedElement,
      insertedPosition,
      shiftedElement,
      key,
      sortedElements,
    } = currentOperation;
    // Reset all visual indicators for each new step
    resetVisualState();

    let newCurrentKey = null;
    let newComparingIndex = null;
    let newShiftingIndex = null;
    let newInsertPosition = null;

    // Handle operation type
    switch (currentOperation.typeOperation) {
      case InsertionSortOperation.KeySelection:
        // When a new key is selected for insertion
        if (key) {
          newCurrentKey = key.index;
        }
        break;

      case InsertionSortOperation.Compare:
        // When comparing the key with another element
        if (key) {
          newCurrentKey = key.index;
        }
        if (comparedElement) {
          newComparingIndex = comparedElement.index;
        }
        break;

      case InsertionSortOperation.Shift:
        // When shifting elements to make room for insertion
        if (key) {
          newCurrentKey = key.index;
        }
        if (shiftedElement) {
          newShiftingIndex = shiftedElement.index;
        }
        break;

      case InsertionSortOperation.Insert:
        // When inserting the key into its new position
        if (key) {
          newCurrentKey = key.index;
        }
        if (insertedPosition !== undefined) {
          newInsertPosition = insertedPosition;
        }
        break;

      default:
        console.warn(
          "DEBUG: Unknown operation type",
          currentOperation.typeOperation,
        );
    }

    if (newCurrentKey !== currentKey) setCurrentKey(newCurrentKey);
    if (newComparingIndex !== comparingIndex)
      setComparingIndex(newComparingIndex);
    if (newInsertPosition !== insertPosition)
      setInsertPosition(newInsertPosition);
    if (newShiftingIndex !== shiftingIndex) setShiftingIndex(newShiftingIndex);

    // Handle sorted elements
    if (steppingDirection === "forward") {
      // When moving forward, update the sorted elements
      if (sortedElements && sortedElements.indexes) {
        const indexes = sortedElements.indexes;
        if (indexes.length > 0) {
          setSortedIndexes(indexes);
        }
      }

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
      console.log(
        "DEBUG: Recalculating sorted elements for backward step",
        currentStep,
      );
      recalculateSortedElementsUpToStep(currentStep);
    }
  }, [simContext.simCurrentStep, simulator]);

  // Reset all visual state indicators
  const resetVisualState = () => {
    console.log("DEBUG: Resetting visual state");
    setCurrentKey(null);
    setComparingIndex(null);
    setShiftingIndex(null);
    setInsertPosition(null);
  };

  // Function to recalculate sorted elements when going backward
  const recalculateSortedElementsUpToStep = (step: number) => {
    if (!simulator || step < 0) {
      setSortedIndexes([]);
      return;
    }

    // Get the sorted elements from the current operation
    const currentOperation = simulator.operations[step];
    if (
      currentOperation &&
      currentOperation.sortedElements &&
      currentOperation.sortedElements.indexes
    ) {
      const indexes = currentOperation.sortedElements.indexes || [];

      if (indexes.length > 0) {
        setSortedIndexes(indexes);
        return;
      }
    }

    // If no sorted elements in current operation, find the last operation with sorted elements
    for (let i = step; i >= 0; i--) {
      const op = simulator.operations[i];
      if (op.sortedElements && op.sortedElements.indexes) {
        const indexes = op.sortedElements.indexes || [];

        if (indexes.length > 0) {
          setSortedIndexes(indexes);
          return;
        }
      }
    }

    // If no prior sorted elements found, assume none are sorted
    setSortedIndexes([]);

    // Check if this is the final step of the algorithm
    if (step === simulator.operations.length - 1) {
      // Ensure all elements are marked as sorted at the end of the algorithm
      setSortedIndexes(
        Array.from({ length: simContext.simDataToSort.length }, (_, i) => i),
      );
    }
  };

  // Reset sorted indexes when data changes
  useEffect(() => {
    setSortedIndexes([]);
    setPrevStep(0);
    resetVisualState();

    // Set initial state if simulator is available
    if (simulator && simulator.operations && simulator.operations.length > 0) {
      const initialOp = simulator.operations[0];
      if (
        initialOp &&
        initialOp.sortedElements &&
        initialOp.sortedElements.indexes
      ) {
        const indexes = initialOp.sortedElements.indexes || [];

        if (indexes.length > 0) {
          setSortedIndexes(indexes);
        }
      }
    }
  }, [simContext.simDataToSort, simulator]);

  if (!simulator) {
    console.error("DEBUG: Simulator is null or undefined in render");
    return <div>Symulator nie jest dostępny</div>;
  }

  return (
    <div className="flex flex-row items-end gap-xl h-40">
      {simContext.simDataToSort.map((item, index) => {
        // Determine element status
        const isSorted = sortedIndexes.includes(index);
        const isCurrentKey = index === currentKey;
        const isComparing = index === comparingIndex;
        const isShifting = index === shiftingIndex;
        const isInsertPosition = index === insertPosition;

        // Determine the appropriate CSS class based on element status
        let className = "";

        if (isCurrentKey) {
          className = "!bg-yellow-300"; // Current key element being inserted
        } else if (isComparing) {
          className = "!bg-blue-300"; // Element being compared with the current key
        } else if (isShifting) {
          className = "!bg-purple-300"; // Element being shifted
        } else if (isInsertPosition) {
          className = "!bg-green-300"; // Position where the key is being inserted
        } else if (isSorted) {
          className = "!bg-pink-200"; // Sorted elements
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