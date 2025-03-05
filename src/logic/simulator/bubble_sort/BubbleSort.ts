import { BaseSortStep, MeasureExecutionTime, Simulator } from "../Simulator.ts";
import { SortDirection } from "../SimulatorTypes.ts";

export enum BubbleSortOperation {
  Compare = "compare",
  Swap = "swap",
}

export type BubbleSortStep = BaseSortStep & {
  leftNumber: {
    index: number;
    value: number;
  };
  rightNumber: {
    index: number;
    value: number;
  };
  typeOperation: BubbleSortOperation;
};

export class BubbleSort extends Simulator {
  protected sortName: string = "Bubble Sort";
  public operations: BubbleSortStep[];

  constructor() {
    super();
    this.operations = [];
  }

  private registerOperation(operation: BubbleSortStep): void {
    this.operations.push(operation);
  }

  @MeasureExecutionTime
  public generateSimulatorSteps(): void {
    const arr: number[] = [...this.originalArray];
    const size: number = arr.length;

    const sortedIndexes: number[] = [];

    for (let i: number = 0; i < size - 1; i++) {
      let j: number = 0;
      for (j; j < size - i - 1; j++) {
        if (
          (this.sortDirection === SortDirection.ASCENDING &&
            arr[j] > arr[j + 1]) ||
          (this.sortDirection === SortDirection.DESCENDING &&
            arr[j] < arr[j + 1])
        ) {
          this.registerOperation({
            leftNumber: { index: j, value: arr[j] },
            rightNumber: { index: j + 1, value: arr[j + 1] },
            typeOperation: BubbleSortOperation.Swap,
            sortedElements: { indexes: [], values: [] },
          });
          this.swapAndCount(arr, j, j + 1);
        } else {
          this.registerOperation({
            leftNumber: { index: j, value: arr[j] },
            rightNumber: { index: j + 1, value: arr[j + 1] },
            typeOperation: BubbleSortOperation.Compare,
            sortedElements: { indexes: [], values: [] },
          });
        }
      }
      const lastStep: number = this.operations.length - 1;

      const sortedIndex: number = size - i - 1;
      sortedIndexes.push(sortedIndex);

      if (this.operations[lastStep].sortedElements === undefined) return;

      if (lastStep >= 0 && this.operations[lastStep]) {
        this.operations[lastStep] = {
          ...this.operations[lastStep],
          sortedElements: {
            indexes: [
              ...this.operations[lastStep].sortedElements.indexes,
              ...sortedIndexes,
            ],
            values: [
              ...this.operations[lastStep].sortedElements.values,
              ...sortedIndexes.map((index: number) => arr[index]),
            ],
          },
        };
      }
    }

    this.numberOfLastStep = this.operations.length - 1;
    this.setSortedArray(arr);
  }

  public get getCurrentOperation(): BubbleSortStep | null {
    if (this.currentStep < 0 || this.currentStep >= this.operations.length) {
      return null;
    }
    return this.operations[this.currentStep];
  }

  @MeasureExecutionTime
  public updateCurrentArrayState(): number[] {
    if (this.currentStep < 0 || this.currentStep >= this.operations.length) {
      return this.currentArray;
    }

    const currentOperation = this.operations[this.currentStep];
    if (!currentOperation) return this.currentArray;

    const { leftNumber, rightNumber, typeOperation } = currentOperation;

    if (typeOperation === BubbleSortOperation.Swap) {
      this.swap(this.currentArray, leftNumber.index, rightNumber.index);
    }

    return this.currentArray;
  }

  @MeasureExecutionTime
  public sort(): number[] {
    const arr: number[] = [...this.originalArray];
    const size: number = arr.length;

    for (let i: number = 0; i < size - 1; i++) {
      for (let j: number = 0; j < size - i - 1; j++) {
        if (
          (this.sortDirection === SortDirection.ASCENDING &&
            arr[j] > arr[j + 1]) ||
          (this.sortDirection === SortDirection.DESCENDING &&
            arr[j] < arr[j + 1])
        ) {
          this.swap(arr, j, j + 1);
        }
      }
    }
    return arr;
  }

  @MeasureExecutionTime
  public generateCurrentStepDescription(): string {
    if (this.currentStep < 0 || this.currentStep >= this.operations.length) {
      return "Błąd: nieprawidłowy krok.";
    }

    const currentOperation: BubbleSortStep = this.operations[this.currentStep];
    if (!currentOperation) return "Błąd: brak operacji dla tego kroku.";

    const { leftNumber, rightNumber, typeOperation, sortedElements } =
      currentOperation;

    if (!leftNumber || !rightNumber) {
      return "Błąd: nieprawidłowe dane operacji sortowania.";
    }

    const leftValue: number = leftNumber.value;
    const rightValue: number = rightNumber.value;

    if (leftValue === undefined || rightValue === undefined) {
      return "Błąd: nieprawidłowe dane operacji sortowania.";
    }

    const compareText = `${leftValue} została porównana z ${rightValue}`;
    let compareTextResult =
      leftValue === rightValue
        ? ", liczby są równe, więc nie zostały zamienione."
        : leftValue > rightValue
          ? `, ${leftValue} jest większa.`
          : `, ${leftValue} jest mniejsza.`;

    if (typeOperation === BubbleSortOperation.Swap) {
      compareTextResult += ` Została zamieniona miejscami z ${rightValue}.`;
    }

    let sortedText = "";
    if (
      sortedElements &&
      sortedElements.indexes &&
      sortedElements.indexes.length > 0
    ) {
      sortedText = ` Posortowane elementy: ${sortedElements.indexes.join(", ")}.`;
    }

    return `${compareText}${compareTextResult}${sortedText}`.trim();
  }

  @MeasureExecutionTime
  public generateJSONFile(): string {
    if (this.operations === undefined || this.operations.length === 0) {
      console.error("Tablica operations jest pusta.");
      return JSON.stringify({ error: "Brak danych do wygenerowania JSON." });
    }

    const steps: object[] = [{ algorithms_name: this.sortName }];

    // Zapisz aktualny stan
    const currentArrayCopy = [...this.currentArray];
    const currentStepCopy = this.currentStep;

    // Resetuj do początku
    this.currentStep = 0;

    for (let i = 0; i < this.operations.length; i++) {
      steps.push({
        current_array: [...this.currentArray],
        current_step: this.currentStep,
        description: this.generateCurrentStepDescription(),
      });
      this.nextStep();
    }

    // Przywróć stan
    this.currentArray = currentArrayCopy;
    this.currentStep = currentStepCopy;

    return JSON.stringify(steps, null, 2);
  }
}