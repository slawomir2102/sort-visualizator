import ChartBox from "../components/chart_box/ChartBox.tsx";
import { useSimulator } from "./simulator_new/SimulatorContext.tsx";

import { useEffect, useState } from "react";
import {
  InsertionSortOperation,
  InsertionTypeOperation,
  SortOperation,
} from "./simulator_new/SimulatorTypes.ts";

export const InsertionSortVisualizator = () => {
  const { simulator, setSimulator, simContext } = useSimulator();

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

    // Detect if we're moving forward or backward
    const steppingDirection = prevStep < currentStep ? "forward" : "backward";
    setPrevStep(currentStep);

    // Handle out of bounds
    if (currentStep < 0 || currentStep >= simulator.operations.length) {
      resetVisualState();
      return;
    }

    const currentOperation: InsertionSortOperation =
      simulator.operations[currentStep];

    if (!currentOperation) {
      return;
    }

    // Reset all visual indicators for each new step
    resetVisualState();

    // Update visual state based on operation type
    switch (currentOperation.typeOperation) {
      case SortOperation.KeySelection:
        // When a new key is selected for insertion
        setCurrentKey(currentOperation.key.index);
        break;

      case SortOperation.Compare:
        // When comparing the key with another element
        setCurrentKey(currentOperation.key.index);
        if (currentOperation.comparedElement) {
          setComparingIndex(currentOperation.comparedElement.index);
        }
        break;

      case SortOperation.Shift:
        // When shifting elements to make room for insertion
        setCurrentKey(currentOperation.key.index);
        if (currentOperation.shiftedElement) {
          setShiftingIndex(currentOperation.shiftedElement.index);
        }
        break;

      case SortOperation.Insert:
        // When inserting the key into its new position
        if (currentOperation.insertedPosition !== undefined) {
          setInsertPosition(currentOperation.insertedPosition);
        }
        break;
    }

    // Handle sorted elements
    if (steppingDirection === "forward") {
      // When moving forward, update the sorted elements
      if (
        currentOperation.sortedElements &&
        currentOperation.sortedElements.indexes.length > 0
      ) {
        setSortedIndexes(currentOperation.sortedElements.indexes);
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
      recalculateSortedElementsUpToStep(currentStep);
    }
  }, [simContext.simCurrentStep, simulator]);

  // Reset all visual state indicators
  const resetVisualState = () => {
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
    if (currentOperation && currentOperation.sortedElements) {
      setSortedIndexes(currentOperation.sortedElements.indexes);
    } else {
      // If no sorted elements in current operation, find the last operation with sorted elements
      for (let i = step; i >= 0; i--) {
        const op = simulator.operations[i];
        if (op.sortedElements && op.sortedElements.indexes.length > 0) {
          setSortedIndexes(op.sortedElements.indexes);
          return;
        }
      }

      // If no prior sorted elements found, assume none are sorted
      setSortedIndexes([]);
    }

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
    setPrevStep(-1);
    resetVisualState();

    // Set initial state if simulator is available
    if (simulator && simulator.operations && simulator.operations.length > 0) {
      const initialOp = simulator.operations[0];
      if (initialOp) {
        if (initialOp.sortedElements) {
          setSortedIndexes(initialOp.sortedElements.indexes);
        }
      }
    }
  }, [simContext.simDataToSort, simulator]);

  if (!simulator) {
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