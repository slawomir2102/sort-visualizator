import ChartBox from "../../../components/chart_box/ChartBox.tsx";
import { useSimulator } from "../SimulatorContext.tsx";

import { useEffect, useState } from "react";
import { QuickSortOperation, QuickSortStep } from "./QuickSort.ts";

export const QuickSortVisualizer = () => {
  const { simulator, simContext } = useSimulator();

  const [pivotIndex, setPivotIndex] = useState<number | null>(null);
  const [compareIndex, setCompareIndex] = useState<number | null>(null);
  const [swapFirstIndex, setSwapFirstIndex] = useState<number | null>(null);
  const [swapSecondIndex, setSwapSecondIndex] = useState<number | null>(null);
  const [partitionStart, setPartitionStart] = useState<number | null>(null);
  const [partitionEnd, setPartitionEnd] = useState<number | null>(null);
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

    const currentOperation: QuickSortStep = simulator.operations[
      currentStep
    ] as QuickSortStep;

    if (!currentOperation) {
      return;
    }

    // Set up new visual state values
    let newPivotIndex = null;
    let newCompareIndex = null;
    let newSwapFirstIndex = null;
    let newSwapSecondIndex = null;
    let newPartitionStart = null;
    let newPartitionEnd = null;

    // Set partition range in all operations
    if (currentOperation.partitionRange) {
      newPartitionStart = currentOperation.partitionRange.start;
      newPartitionEnd = currentOperation.partitionRange.end;
    }

    // Set pivot in all operations that have it
    if (currentOperation.pivotElement) {
      newPivotIndex = currentOperation.pivotElement.index;
    }

    // Handle operation type
    switch (currentOperation.typeOperation) {
      case QuickSortOperation.ChoosePivot:
        // Already set pivot above
        break;

      case QuickSortOperation.Compare:
        if (currentOperation.compareElement) {
          newCompareIndex = currentOperation.compareElement.index;
        }
        break;

      case QuickSortOperation.Swap:
        if (currentOperation.swappedElements) {
          newSwapFirstIndex = currentOperation.swappedElements.first.index;
          newSwapSecondIndex = currentOperation.swappedElements.second.index;
        }
        break;

      case QuickSortOperation.PartitionEnd:
        // Clear comparison and swap highlights here
        newCompareIndex = null;
        newSwapFirstIndex = null;
        newSwapSecondIndex = null;
        break;

      case QuickSortOperation.RecursiveCall:
        // Clear most highlights for recursive calls
        newPivotIndex = null;
        newCompareIndex = null;
        newSwapFirstIndex = null;
        newSwapSecondIndex = null;
        break;
    }

    // Update state only when changed
    if (newPivotIndex !== pivotIndex) setPivotIndex(newPivotIndex);
    if (newCompareIndex !== compareIndex) setCompareIndex(newCompareIndex);
    if (newSwapFirstIndex !== swapFirstIndex)
      setSwapFirstIndex(newSwapFirstIndex);
    if (newSwapSecondIndex !== swapSecondIndex)
      setSwapSecondIndex(newSwapSecondIndex);
    if (newPartitionStart !== partitionStart)
      setPartitionStart(newPartitionStart);
    if (newPartitionEnd !== partitionEnd) setPartitionEnd(newPartitionEnd);

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
    setPivotIndex(null);
    setCompareIndex(null);
    setSwapFirstIndex(null);
    setSwapSecondIndex(null);
    setPartitionStart(null);
    setPartitionEnd(null);
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

  // Function to determine if an index is within the current partition range
  const isInPartitionRange = (index: number): boolean => {
    if (partitionStart === null || partitionEnd === null) return false;
    return index >= partitionStart && index <= partitionEnd;
  };

  if (!simulator) {
    return <div>Symulator nie jest dostępny</div>;
  }

  return (
    <div className="flex flex-row items-end gap-xl h-40">
      {simContext.simDataToSort.map((item, index) => {
        // Determine element status
        const isSorted = sortedIndexes.includes(index);
        const isPivot = index === pivotIndex;
        const isComparing = index === compareIndex;
        const isSwapFirst = index === swapFirstIndex;
        const isSwapSecond = index === swapSecondIndex;
        const isInPartition = isInPartitionRange(index);

        // Determine the appropriate CSS class based on element status
        let className = "";

        if (isPivot) {
          className = "!bg-red-300"; // Pivot element
        } else if (isSwapFirst || isSwapSecond) {
          className = "!bg-purple-300"; // Swapping elements
        } else if (isComparing) {
          className = "!bg-blue-300"; // Element being compared with pivot
        } else if (isSorted) {
          className = "!bg-pink-200"; // Sorted elements
        } else if (isInPartition) {
          className = "!bg-yellow-100"; // Elements in current partition
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