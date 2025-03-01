import {
  BubbleSortOperationType,
  SortOperation,
  sortOperationType,
} from "./SimulatorTypes.ts";
import { MeasureExecutionTime, Simulator } from "./newSimulator.ts";

export class BubbleSort extends Simulator {
  public registerOperation(
    arr: number[],
    newPositionLeftNumber: number,
    newPositionRightNumber: number,
    operation: sortOperationType,
  ) {
    this.operations.push({
      leftNumber: {
        position: newPositionLeftNumber,
        value: arr[newPositionLeftNumber],
      },
      rightNumber: {
        position: newPositionRightNumber,
        value: arr[newPositionRightNumber],
      },
      sortedElements: {
        position: [],
        value: [],
      },
      typeOperation: operation,
    });
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
          (!this.sortDirection && arr[j] > arr[j + 1]) ||
          (this.sortDirection && arr[j] < arr[j + 1])
        ) {
          this.registerOperation(arr, j, j + 1, SortOperation.Swap);
          this.swapAndCount(arr, j, j + 1);
        } else {
          this.registerOperation(arr, j, j + 1, SortOperation.Compare);
        }
      }
      const lastStep: number = this.operations.length - 1;

      const sortedIndex: number = size - i - 1;
      sortedIndexes.push(sortedIndex);

      console.log(this.operations);
      this.operations[lastStep] = {
        ...this.operations[lastStep],
        sortedElements: {
          position: [
            ...this.operations[lastStep].sortedElements.position,
            ...sortedIndexes,
          ],
          value: [
            ...this.operations[lastStep].sortedElements.value,
            ...sortedIndexes.map((index: number) => arr[index]),
          ],
        },
      };
    }

    this.numberOfLastStep = this.operations.length;
    this.setSortedArray(arr);
  }

  protected sortName: string = "Bubble Sort";

  public operations: BubbleSortOperationType[];

  constructor() {
    super();
    this.operations = [];
  }

  public get getCurrentOperation(): BubbleSortOperationType {
    return this.operations[this.currentStep];
  }

  @MeasureExecutionTime
  public updateCurrentArrayState(): number[] {
    const { leftNumber, rightNumber, typeOperation } =
      this.operations[this.currentStep];

    if (typeOperation === SortOperation.Swap) {
      this.swap(this.currentArray, leftNumber.position, rightNumber.position);
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
          (!this.sortDirection && arr[j] > arr[j + 1]) ||
          (this.sortDirection && arr[j] < arr[j + 1])
        ) {
          this.swap(arr, j, j + 1);
        }
      }
    }
    return arr;
  }

  @MeasureExecutionTime
  public generateCurrentStepDescription(): string {
    const arr: number[] = this.currentArray;
    const step = this.currentStep;
    const currentOperation: BubbleSortOperationType = this.operations[step];

    console.log(this.operations[step]);

    if (!currentOperation) {
      return null;
    }

    // if (this.simulatorState === SimulatorState.Initial) {
    //   return "Dane zostały zainicjowane i są gotowe do sortowania";
    // }
    //
    // if (this.simulatorState === SimulatorState.Sorted) {
    //   return "Dane zostały posortowane";
    // }
    //
    // if (this.simulatorState !== SimulatorState.DuringSorting) {
    //   return "Wystąpił błąd";
    // }

    const compareText = `${currentOperation.leftNumber.value} zostala porównana z ${currentOperation.rightNumber.value}`;

    let compareTextResult: string = "";

    if (
      currentOperation.leftNumber.value == currentOperation.rightNumber.value
    ) {
      compareTextResult = `, liczby okazały się równe przez co nie zostały zamienione miejscami`;
    } else if (
      currentOperation.leftNumber.value > currentOperation.rightNumber.value
    ) {
      compareTextResult = `, ${currentOperation.leftNumber.value} okazała się większa `;
    } else {
      compareTextResult = `, ${currentOperation.leftNumber.value} okazała się mniejsza `;
    }

    if (currentOperation.typeOperation == SortOperation.Swap) {
      compareTextResult =
        compareTextResult +
        `oraz została zamieniona miejscem z ${currentOperation.rightNumber.value} \n`;
    }

    let isElementSortedText: string = "";

    if (currentOperation.sortedElements !== undefined) {
      isElementSortedText = `${currentOperation.sortedElements.value} został poprawnie posortowany`;
    }

    return compareText + compareTextResult + isElementSortedText;
  }

  @MeasureExecutionTime
  public generateCurrentStepDescription(): string {
    const step: number = this.currentStep;
    const currentOperation: BubbleSortOperationType = this.operations[step];

    if (!currentOperation) return "Błąd: brak operacji dla tego kroku.";

    const { leftNumber, rightNumber, typeOperation, sortedElements } =
      currentOperation;
    const leftValue: number = leftNumber?.value;
    const rightValue: number = rightNumber?.value;

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

    if (typeOperation === SortOperation.Swap) {
      compareTextResult += ` Została zamieniona miejscami z ${rightValue}.`;
    }

    const sortedText = sortedElements
      ? `${sortedElements.value} został poprawnie posortowany.`
      : "";

    return `${compareText}${compareTextResult} ${sortedText}`.trim();
  }

  @MeasureExecutionTime
  public generateJSONFile(): string {
    if (this.operations === undefined || this.operations.length === 0) {
      console.error("Tablica _operations jest pusta.");
      return JSON.stringify({ error: "Brak danych do wygenerowania JSON." });
    }

    return JSON.stringify(this.operations[1], null, 2);
  }
}