import { BaseSortStep, MeasureExecutionTime, Simulator } from "../Simulator.ts";
import { SortDirection } from "../SimulatorTypes.ts";

export enum InsertionSortOperation {
  Compare = "compare",
  Insert = "insert",
  KeySelection = "key_selection",
  Shift = "shift",
}

export type InsertionSortStep = BaseSortStep & {
  key: { index: number; value: number };
  comparedElement?: { index: number; value: number };
  shiftedElement?: { index: number; value: number }; // Fixed: singular not plural
  newPosition?: number;
  insertedPosition?: number; // Important for visualization component
  typeOperation: InsertionSortOperation; // Fixed: using SortOperation enum from SimulatorTypes
};

export class InsertionSort extends Simulator {
  protected sortName = "InsertionSort";
  public operations: InsertionSortStep[];

  constructor() {
    super();
    this.operations = [];
  }

  // Added getter for visualization component
  get getCurrentStep(): number {
    return this.currentStep;
  }

  private registerOperation(operation: InsertionSortStep): void {
    this.operations.push(operation);
  }

  @MeasureExecutionTime
  public generateSimulatorSteps(): void {
    this.swapsCounter = 0;
    this.compareCounter = 0;
    const arr: number[] = [...this.originalArray];
    const size: number = arr.length;
    const sortedIndexes: number[] = [0];

    for (let i = 1; i < size; i++) {
      const key = arr[i];
      let j = i - 1;
      let insertedPosition = i;
      this.registerOperation({
        key: { index: i, value: key },
        typeOperation: InsertionSortOperation.KeySelection,
        sortedElements: {
          indexes: [...sortedIndexes],
          values: sortedIndexes.map((idx) => arr[idx]),
        },
      });
      while (
        j >= 0 &&
        (this.sortDirection === SortDirection.ASCENDING
          ? arr[j] > key
          : arr[j] < key)
      ) {
        this.registerOperation({
          key: { index: i, value: key },
          comparedElement: { index: j, value: arr[j] },
          typeOperation: InsertionSortOperation.Compare,
          sortedElements: {
            indexes: [...sortedIndexes],
            values: sortedIndexes.map((idx) => arr[idx]),
          },
        });
        this.compareCounter++;
        arr[j + 1] = arr[j];
        this.registerOperation({
          key: { index: i, value: key },
          shiftedElement: { index: j, value: arr[j] },
          newPosition: j + 1,
          typeOperation: InsertionSortOperation.Shift,
          sortedElements: {
            indexes: [...sortedIndexes],
            values: sortedIndexes.map((idx) => arr[idx]),
          },
        });
        this.swapsCounter++;
        insertedPosition = j;
        j--;
      }
      if (insertedPosition !== i) {
        arr[insertedPosition] = key;
        sortedIndexes.push(insertedPosition);
        this.registerOperation({
          key: { index: i, value: key },
          insertedPosition: insertedPosition,
          typeOperation: InsertionSortOperation.Insert,
          sortedElements: {
            indexes: [...sortedIndexes],
            values: sortedIndexes.map((idx) => arr[idx]),
          },
        });
        this.swapsCounter++;
      } else {
        sortedIndexes.push(i);
        const lastIndex = this.operations.length - 1;
        if (lastIndex >= 0) {
          this.operations[lastIndex].sortedElements = {
            indexes: [...sortedIndexes],
            values: sortedIndexes.map((idx) => arr[idx]),
          };
        }
      }
    }

    this.numberOfLastStep = this.operations.length;
    this.setSortedArray(arr);
  }

  public updateCurrentArrayState(): number[] {
    // Guard clause dla bezpieczeństwa
    if (this.currentStep < 0 || this.currentStep >= this.operations.length) {
      return this.currentArray;
    }

    const operation = this.operations[this.currentStep];
    if (!operation) return this.currentArray;

    switch (operation.typeOperation) {
      case InsertionSortOperation.Shift: {
        const { shiftedElement, newPosition } = operation;
        if (shiftedElement && newPosition !== undefined) {
          this.currentArray[newPosition] = shiftedElement.value; // Użyj .value lub .index w zależności od logiki
        }
        break;
      }
      case InsertionSortOperation.Insert: {
        const { key, insertedPosition } = operation;
        if (key && insertedPosition !== undefined) {
          this.currentArray[insertedPosition] = key.value; // Użyj .value lub .index
        }
        break;
      }
      // Case'y Compare i KeySelection mogą nie wpływać na tablicę
    }

    return this.currentArray;
  }

  @MeasureExecutionTime
  public sort(): number[] {
    this.swapsCounter = 0;
    this.compareCounter = 0;
    const arr: number[] = [...this.originalArray];
    const size: number = arr.length;
    for (let i = 1; i < size; i++) {
      const key = arr[i];
      let j = i - 1;
      while (
        j >= 0 &&
        (this.sortDirection === SortDirection.ASCENDING
          ? arr[j] > key
          : arr[j] < key)
      ) {
        this.compareCounter++;
        arr[j + 1] = arr[j];
        this.swapsCounter++;
        j--;
      }
      arr[j + 1] = key;
      this.swapsCounter++;
    }
    return arr;
  }

  public generateCurrentStepDescription(): string {
    // Guard clause for safety
    if (this.currentStep < 0 || this.currentStep >= this.operations.length) {
      return "Błąd: nieprawidłowy krok.";
    }

    const currentOperation = this.operations[this.currentStep];
    if (!currentOperation) return "Błąd: brak operacji dla tego kroku.";

    const {
      key,
      comparedElement,
      shiftedElement, // Fixed: singular not plural
      insertedPosition,
      sortedElements,
    } = currentOperation;

    if (!key || key.value === undefined) {
      return "Błąd: nieprawidłowe dane operacji sortowania.";
    }

    const keyValue = key.value;
    let description = "";

    // Based on operation type
    switch (currentOperation.typeOperation) {
      case InsertionSortOperation.KeySelection:
        description = `Wybrano klucz ${keyValue} do wstawienia.`;
        break;

      case InsertionSortOperation.Compare:
        if (comparedElement) {
          const comparedValue = comparedElement.value;
          description = `Klucz ${keyValue} został porównany z ${comparedValue}. `;
          description +=
            keyValue < comparedValue
              ? `${keyValue} jest mniejszy. `
              : keyValue > comparedValue
                ? `${keyValue} jest większy. `
                : "Liczby są równe. ";
        }
        break;

      case InsertionSortOperation.Shift:
        if (shiftedElement) {
          description = `Przesunięto element ${shiftedElement.value} w prawo.`;
        }
        break;

      case InsertionSortOperation.Insert:
        if (insertedPosition !== undefined) {
          description = `Wstawiono klucz ${keyValue} na pozycję ${insertedPosition}.`;
        }
        break;
    }

    // Add information about sorted elements
    if (
      sortedElements &&
      sortedElements.indexes &&
      sortedElements.indexes.length > 0
    ) {
      description += ` Posortowane elementy: ${sortedElements.indexes.join(", ")}.`;
    }

    return description.trim() || "Brak dostępnego opisu kroku.";
  }

  public generateJSONFile = (): string => {
    console.log(this.operations);

    if (this.operations.length === 0) {
      console.error("Tablica jest pusta");
      return "[]";
    }

    const size = this.operations.length;

    const steps: object[] = [{ algorithms_name: this.sortName }];

    for (let i: number = 0; i < size; i++) {
      steps.push({
        current_array: this.currentArray,
        current_step: this.currentStep,
      });
      this.nextStep();
    }

    return JSON.stringify(steps, null, 2);
  };
}