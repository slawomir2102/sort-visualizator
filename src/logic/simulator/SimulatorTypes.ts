import { BubbleSort } from "./bubble_sort/BubbleSort.ts";
import { QuickSort } from "./quick_sort/QuickSort.ts";
import { InsertionSort } from "./insertion_sort/InsertionSort.ts";
import { SelectionSort } from "./selection_sort/SelectionSort.ts";

export enum SimulatorState {
  Initial = 0,
  DuringSorting = 1,
  Sorted = 2,
}

export type SimulatorStateType =
  | SimulatorState.Initial
  | SimulatorState.DuringSorting
  | SimulatorState.Sorted;

export enum SimDirection {
  Forward = 0,
  Standby = 1,
  Reverse = 2,
}

export type SimDirectionType =
  | SimDirection.Forward
  | SimDirection.Reverse
  | SimDirection.Standby;

export const animationList = [
  { key: "instant", label: "Błyskawiczna" },
  { key: "fast", label: "Szybka" },
  { key: "slow", label: "Wolna" },
  { key: "very-slow", label: "Bardzo wolna" },
];

export type animationType = "instant" | "fast" | "slow" | "very-slow";

export enum SimAnimationSpeed {
  Instant = 0,
  Fast = 50,
  Slow = 100,
  VerySlow = 200,
}

export type SimAnimationSpeedType =
  | SimAnimationSpeed.Instant
  | SimAnimationSpeed.Fast
  | SimAnimationSpeed.Slow
  | SimAnimationSpeed.VerySlow;

export enum SortDirection {
  ASCENDING = 0,
  DESCENDING = 1,
}

export type sortDirectionType =
  | SortDirection.ASCENDING
  | SortDirection.DESCENDING;

export enum AlgorithmsNames {
  BubbleSort = "bubbleSort",
  QuickSort = "quickSort",
  InsertionSort = "insertionSort",
  SelectionSort = "selectionSort",
}

export const simulators = [
  { key: AlgorithmsNames.BubbleSort, label: "Bubble Sort" },
  { key: AlgorithmsNames.QuickSort, label: "Quick Sort" },
  { key: AlgorithmsNames.InsertionSort, label: "Insertion Sort" },
  { key: AlgorithmsNames.SelectionSort, label: "Selection Sort" },
];

export const setsNumberOfElements = [
  { key: 10000, label: "10000" },
  { key: 20000, label: "20000" },
  { key: 50000, label: "50000" },
  { key: 100000, label: "100000" },
  { key: 200000, label: "200000" },
];

export type Simulators =
  | BubbleSort
  | QuickSort
  | InsertionSort
  | SelectionSort
  | null;