import ChartBox from "../../../components/chart_box/ChartBox.tsx";
import { useSimulator } from "../SimulatorContext.tsx";

import { useEffect, useState } from "react";
import { SelectionSortOperation, SelectionSortStep } from "./SelectionSort.ts";

export const SelectionSortVisualizer = () => {
  const { simulator, simContext } = useSimulator();

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [compareIndex, setCompareIndex] = useState<number | null>(null);
  const [minIndex, setMinIndex] = useState<number | null>(null);
  const [swapIndexFrom, setSwapIndexFrom] = useState<number | null>(null);
  const [swapIndexTo, setSwapIndexTo] = useState<number | null>(null);
  const [sortedIndexes, setSortedIndexes] = useState<number[]>([]);
  const [prevStep, setPrevStep] = useState<number>(-1);

  useEffect(() => {
    if (!simulator || !simulator.operations) {
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

    const currentOperation: SelectionSortStep = simulator.operations[
      currentStep
    ] as SelectionSortStep;

    if (!currentOperation) {
      return;
    }

    // Set up new visual state values
    let newCurrentIndex = null;
    let newCompareIndex = null;
    let newMinIndex = null;
    let newSwapIndexFrom = null;
    let newSwapIndexTo = null;

    // Set current index in all operations
    if (currentOperation.currentIndex) {
      newCurrentIndex = currentOperation.currentIndex.index;
    }

    // Handle operation type
    switch (currentOperation.typeOperation) {
      case SelectionSortOperation.Compare:
        if (currentOperation.compareElement) {
          newCompareIndex = currentOperation.compareElement.index;
        }
        if (currentOperation.minElement) {
          newMinIndex = currentOperation.minElement.index;
        }
        break;

      case SelectionSortOperation.SelectMin:
        if (currentOperation.minElement) {
          newMinIndex = currentOperation.minElement.index;
        }
        break;

      case SelectionSortOperation.Swap:
        if (currentOperation.swappedElements) {
          newSwapIndexFrom = currentOperation.swappedElements.from.index;
          newSwapIndexTo = currentOperation.swappedElements.to.index;
        }
        break;
    }

    // Update state only when changed
    if (newCurrentIndex !== currentIndex) setCurrentIndex(newCurrentIndex);
    if (newCompareIndex !== compareIndex) setCompareIndex(newCompareIndex);
    if (newMinIndex !== minIndex) setMinIndex(newMinIndex);
    if (newSwapIndexFrom !== swapIndexFrom) setSwapIndexFrom(newSwapIndexFrom);
    if (newSwapIndexTo !== swapIndexTo) setSwapIndexTo(newSwapIndexTo);

    // Handle sorted elements
    if (steppingDirection === "forward") {
      // When moving forward, update the sorted elements
      if (
        currentOperation.sortedElements &&
        currentOperation.sortedElements.indexes
      ) {
        const indexes = currentOperation.sortedElements.indexes || [];

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
      recalculateSortedElementsUpToStep(currentStep);
    }
  }, [simContext.simCurrentStep, simulator]);

  // Reset all visual state indicators
  const resetVisualState = () => {
    setCurrentIndex(null);
    setCompareIndex(null);
    setMinIndex(null);
    setSwapIndexFrom(null);
    setSwapIndexTo(null);
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
    setPrevStep(-1);
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
    return <div>Symulator nie jest dostępny</div>;
  }

  return (
    <div className="flex flex-row items-end gap-xl h-40">
      {simContext.simDataToSort.map((item, index) => {
        // Determine element status
        const isSorted = sortedIndexes.includes(index);
        const isCurrentPosition = index === currentIndex;
        const isComparing = index === compareIndex;
        const isMinimum = index === minIndex;
        const isSwapFrom = index === swapIndexFrom;
        const isSwapTo = index === swapIndexTo;

        // Determine the appropriate CSS class based on element status
        let className = "";

        if (isSwapFrom || isSwapTo) {
          className = "!bg-purple-300"; // Swapping elements
        } else if (isMinimum) {
          className = "!bg-green-300"; // Current minimum element
        } else if (isComparing) {
          className = "!bg-blue-300"; // Element being compared
        } else if (isCurrentPosition) {
          className = "!bg-yellow-300"; // Current position in outer loop
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