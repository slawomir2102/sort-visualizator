import { SortDirection, sortDirectionType } from "./SimulatorTypes.ts";

export function MeasureExecutionTime(
  _target: object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<any>,
): TypedPropertyDescriptor<any> | void {
  const originalMethod = descriptor.value;

  descriptor.value = function (
    this: { executionTimes?: Record<string, number> },
    ...args: never[]
  ) {
    const startTime = performance.now();

    // Handle both synchronous and asynchronous functions
    const result = originalMethod.apply(this, args);
    const endTime = performance.now();

    // Ensure `executionTimes` exists on the instance
    if (!this.executionTimes) {
      this.executionTimes = {};
    }
    this.executionTimes[propertyKey as string] = endTime - startTime;

    return result;
  };

  return descriptor;
}

export interface BaseSortStep {
  sortedElements?: { indexes: number[]; values: number[] };
}

export abstract class Simulator {
  protected executionTimes: Record<string, number> = {};
  protected originalArray: number[];
  protected currentArray: number[];
  protected sortedArray: number[];
  protected sortDirection: sortDirectionType;
  protected currentStep: number;
  protected numberOfLastStep: number;
  protected swapsCounter: number;
  protected compareCounter: number;

  protected constructor() {
    this.originalArray = [];
    this.currentArray = [];
    this.sortedArray = [];
    this.currentStep = 0;
    this.numberOfLastStep = 0;
    this.swapsCounter = 0;
    this.compareCounter = 0;
    this.sortDirection = SortDirection.ASCENDING;
  }

  public setSortedArray(arr: number[]): void {
    this.sortedArray = arr;
  }

  public setData(arr: number[]): void {
    this.originalArray = [...arr];
    this.currentArray = [...arr];
  }

  public get getOriginalArray(): number[] {
    return this.originalArray;
  }

  public get getCurrentArray(): number[] {
    return this.currentArray;
  }

  public get getSortedArray(): number[] {
    return this.sortedArray;
  }

  public get getCurrentStep(): number {
    return this.currentStep;
  }

  public get getNumberOfSwaps(): number {
    return this.swapsCounter;
  }

  public get getNumberOfCompare(): number {
    return this.compareCounter;
  }

  public get getSortDirection(): SortDirection {
    return this.sortDirection;
  }

  public setSortDirection(value: SortDirection) {
    this.sortDirection = value;
  }

  public get getNumberOfLastStep(): number {
    return this.numberOfLastStep;
  }

  public nextStep() {
    if (this.currentStep > this.numberOfLastStep - 1) {
      return this.currentArray;
    }
    this.updateCurrentArrayState();
    this.currentStep++;
  }

  public prevStep() {
    if (this.currentStep <= 0) {
      return this.currentArray;
    }
    this.currentStep--;
    this.updateCurrentArrayState();
  }

  @MeasureExecutionTime
  public sortUP(stepToGo: number): number {
    for (let i: number = this.currentStep; i < stepToGo; i++) {
      this.nextStep();
    }
    return this.currentStep;
  }

  @MeasureExecutionTime
  public sortDOWN(stepToGo: number): number {
    for (let i: number = this.currentStep; i > stepToGo; i--) {
      this.prevStep();
    }
    return this.currentStep;
  }

  @MeasureExecutionTime
  public goToStep(stepToGo: number): number[] {
    if (stepToGo < 0 || stepToGo > this.numberOfLastStep) {
      console.error(
        `W warunku stepToGo < 0 || stepToGo > this.numberOfLastStep w funkcji goToStep`,
        `Zmienne miały wartości ${stepToGo} < 0 || ${stepToGo} > ${this.numberOfLastStep} wystąpił błąd`,
      );
      return this.currentArray;
    }

    if (stepToGo === this.currentStep) {
      return this.currentArray;
    }

    if (stepToGo > this.currentStep) {
      this.sortUP(stepToGo);
    }

    if (stepToGo < this.currentStep) {
      this.sortDOWN(stepToGo);
    }

    return this.currentArray;
  }

  public checkArrayIsSorted(): boolean {
    if (!this.sortedArray || this.sortedArray.length == 0) {
      return false;
    }
    const arrToCheck: number[] = this.sortedArray;
    const correctArr: number[] = this.sort();
    const size: number = correctArr.length;
    let correctCounter: number = 0;

    for (let i: number = 0; i < size; i++) {
      if (arrToCheck[i] == correctArr[i]) {
        correctCounter++;
      }
    }

    return correctCounter == size;
  }

  protected abstract sortName: string;
  public abstract updateCurrentArrayState(): number[];
  public abstract generateSimulatorSteps(): void;
  public abstract sort(): number[];
  public abstract generateCurrentStepDescription(): string;
  public abstract generateJSONFile(): string;

  // extra functions

  public swap = (arr: number[], a: number, b: number) => {
    const temp: number = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
  };

  public swapAndCount = (arr: number[], a: number, b: number) => {
    const temp: number = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
    this.swapsCounter++;
  };

  public getExecutionTimeFor(
    methodName: string,
    precision: number,
    unit?: string,
  ): number | undefined {
    let unitDivider;
    switch (unit) {
      case "ms":
        unitDivider = 1;
        break;
      case "s":
        unitDivider = 1000;
        break;
      default:
        unitDivider = 1;
        break;
    }

    let execTime: number = +this.executionTimes[methodName] / unitDivider;
    execTime = +execTime.toPrecision(precision | 2);

    return execTime;
  }
}