export enum SimulatorState {
  Initial = 0,
  DuringSorting = 1,
  Sorted = 2,
}

export type SimulatorStateType =
  | SimulatorState.Initial
  | SimulatorState.DuringSorting
  | SimulatorState.Sorted;

export enum SortOperation {
  Compare = 0,
  Swap = 1,
  Insert = 2,
  KeySelection = 3,
  Shift = 4,
}

export type sortOperationType =
  | SortOperation.Swap
  | SortOperation.Compare
  | SortOperation.Insert
  | SortOperation.KeySelection
  | SortOperation.Shift;

export enum SortDirection {
  ASCENDING = 0,
  DESCENDING = 1,
}

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

export type sortDirectionType =
  | SortDirection.ASCENDING
  | SortDirection.DESCENDING;

export type BubbleSortOperationType = {
  leftNumber: {
    position: number;
    value: number;
  };
  rightNumber: {
    position: number;
    value: number;
  };
  sortedElements: {
    position: number[];
    value: number[];
  };
  typeOperation: sortOperationType;
};

export type InsertionTypeOperation =
  | SortOperation.Compare
  | SortOperation.Insert
  | SortOperation.KeySelection
  | SortOperation.Shift;

export type InsertionSortOperation = {
  key: { index: number; value: number };
  comparedElement?: { index: number; value: number };
  shiftedElement?: { index: number; value: number };
  newPosition?: number;
  insertedPosition?: number;
  sortedElements?: { indexes: number[]; values: number[] };
  typeOperation: InsertionTypeOperation;
};