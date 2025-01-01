type operation = "swap" | "partition" | "merge";
export type SortOperation = {
  leftNumber: number;
  rightNumber: number;
  indexSortedElement?: number;
  typeOperation?: operation;
  swapped?: boolean;
  rangeDown?: number;
  rangeUp?: number;
  pivot?: number;
  leftArray?: {
    leftIndex: number;
    rightIndex: number;
  };
  rightArray?: {
    leftIndex: number;
    rightIndex: number;
  };
};

export abstract class SortSimulator {
  // ---------- KONSTRUKTOR KLASY ------------------------------------------------------------------

  protected constructor(array: number[] = []) {
    // wartości domyślne dla pól składowych
    this._originalArray = [...array];
    this._currentArray = [...array];
    this._sortedArray = [];
    this._operations = [];
    this._numberOfTotalSteps = 0;
    this._currentStep = 0;
    this._isSorted = false;
    this._swaps = 0;
    this._sortDirection = false;
  }

  // ----------------- POLA SKLADOWE KLASY ---------------------------------------------------------

  protected _originalArray: number[];
  protected _currentArray: number[];
  protected _sortedArray: number[];
  protected _operations: SortOperation[];
  protected _numberOfTotalSteps: number;
  protected _currentStep: number;
  protected _isSorted: boolean;
  protected _swaps: number;

  protected executionTimes: Record<string, number> = {};

  // false = ascending   true = descending
  protected _sortDirection: boolean;

  // stałe
  public static ASCENDING: boolean = true;
  public static DESCENDING: boolean = false;

  // ------------------- GETTERY -------------------------------------------------------------------

  public get originalArray(): number[] {
    return this._originalArray;
  }

  public get currentState(): number[] {
    return this._currentArray;
  }

  public get sortedArray(): number[] {
    return this._sortedArray;
  }

  public get isSorted(): boolean {
    return this._isSorted;
  }

  public get numberOfTotalSteps(): number {
    return this._operations.length;
  }

  public get numberOfLastStep(): number {
    return Math.max(0, this.numberOfTotalSteps - 1);
  }

  public get operations(): SortOperation[] {
    return this._operations;
  }

  public get currentStep(): number {
    return this._currentStep;
  }

  public get swaps(): number {
    return this._swaps;
  }

  public get sortDirection(): boolean {
    return this._sortDirection;
  }

  public getValueOfI() {
    return this._currentArray[this._operations[this._currentStep].leftNumber];
  }

  public getValueOfJ() {
    return this._currentArray[this._operations[this._currentStep].rightNumber];
  }

  public getExecutionTimeFor(
    methodName: string,
    precision: number = 2,
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

    return (
      +this.executionTimes[methodName].toPrecision(precision) / unitDivider
    );
  }

  // ------------------- SETTERY -------------------------------------------------------------------

  public setData(array: number[]) {
    this._originalArray = [...array];
    this._currentArray = [...array];
  }

  public setSortedArray(array: number[]) {
    this._sortedArray = array;
  }

  // --------------- METODY ABSTRAKCYJNE -----------------------------------------------------------

  protected abstract _sortType: string;

  public abstract generateSteps(ascending?: boolean): void;

  public abstract sortWithoutSteps(ascending?: boolean): number[];

  public abstract generateCurrentStateDescription(stepNumber: number): string;

  public abstract generateJsonFile(): string;

  // --------------- METODY WSPOLNE ----------------------------------------------------------------

  public checkIsSorted(): boolean {
    if (!this._sortedArray) {
      return false;
    }
    const arrToCheck: number[] = this._sortedArray;
    const correctArr: number[] = this.sortWithoutSteps(this._sortDirection);
    const size = correctArr.length;
    let correctCunter = 0;

    for (let i: number = 0; i < size; i++) {
      console.log(arrToCheck[i], "== ", correctArr[i]);
      if (arrToCheck[i] == correctArr[i]) {
        correctCunter++;
      }
    }
    console.log(correctCunter);
    return (this._isSorted = correctCunter == size);
  }

  public registerSwapOperation(
    _leftNumber: number,
    _rightNumber: number,
    _swapped: boolean,
    _indexSortedElement?: number,
  ): void {
    this._operations.push({
      leftNumber: _leftNumber,
      rightNumber: _rightNumber,
      typeOperation: "swap",
      swapped: _swapped,
      indexSortedElement: _indexSortedElement,
    });
  }

  @MeasureExecutionTime
  public sortUP(stepToGo: number): number {
    for (let i: number = this._currentStep; i < stepToGo; i++) {
      this.nextStep();
    }
    return this._currentStep;
  }

  @MeasureExecutionTime
  public sortDOWN(stepToGo: number): number {
    for (let i: number = this._currentStep; i > stepToGo; i--) {
      this.prevStep();
    }
    return this._currentStep;
  }

  // następny krok symulacji
  public nextStep(): number[] {
    if (this._currentStep >= this.numberOfLastStep) {
      return this.currentState;
    }

    const operation = this._operations[this._currentStep];
    if (operation.swapped) {
      this.swap(
        this._currentArray,
        operation.leftNumber,
        operation.rightNumber,
      );
    }

    this._currentStep++;
    return this.currentState;
  }

  // poprzedni krok symulacji
  public prevStep(): number[] {
    if (this._currentStep <= 0) {
      return this.currentState;
    }

    this._currentStep--;

    const operation = this._operations[this._currentStep];
    if (operation.swapped) {
      this.swap(
        this._currentArray,
        operation.leftNumber,
        operation.rightNumber,
      );
    }

    return this.currentState;
  }

  @MeasureExecutionTime
  public goToStep(stepToGo: number): number[] {
    if (stepToGo < 0 || stepToGo > this.numberOfLastStep) {
      console.error(
        `W warunku stepToGo < 0 || stepToGo > this.numberOfLastStep w funkcji goToStep`,
        `Zmienne miały wartości ${stepToGo} < 0 || ${stepToGo} > ${this.numberOfLastStep} wystąpił błąd`,
      );
      return this.currentState;
    }

    if (stepToGo === this._currentStep) {
      return this.currentState;
    }

    if (stepToGo > this._currentStep) {
      this.sortUP(stepToGo);
    }

    if (stepToGo < this._currentStep) {
      this.sortDOWN(stepToGo);
    }

    return this.currentState;
  }

  public reset(): void {
    this._currentStep = 0;
    this._currentArray = [...this._originalArray];
  }
  // -------------------------------------------------------------------------------------------------------------------

  public swap(arr: number[], i: number, j: number) {
    const temp: number = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  public swapS(arr: number[], i: number, j: number) {
    const temp: number = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;

    this._swaps++;
  }

  public cleanMemory(): void {
    this._originalArray = [];
    this._currentArray = [];
    this._operations = [];
    this._currentStep = 0;
    this._isSorted = false;
    this._swaps = 0;
  }
}

// decorator do mierzenia czasu wykonania funkcji-----------------------------------------------------------------------

export function MeasureExecutionTime(
  target: object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<any>,
): TypedPropertyDescriptor<any> | void {
  const originalMethod = descriptor.value;

  descriptor.value = function (
    this: { executionTimes?: Record<string, number> },
    ...args: any[]
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
