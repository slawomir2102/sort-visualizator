import { MeasureExecutionTime, SortSimulator } from "./SortSimulator.ts";

export class QuickSortSimulator extends SortSimulator {
  protected _sortType;

  constructor() {
    super();
    this._sortType = "Quick Sort";
  }

  private async partition(
    arr: number[],
    low: number,
    high: number,
    ascending?: boolean,
  ): Promise<number> {
    const pivotIndex = high; // Wybór pivota
    const pivot = arr[pivotIndex]; // Pivot to element na końcu (po zamianie)
    let idx = low; // Initialize the index to start from the first element

    for (let j = low; j < high; j++) {
      // Check if the current element should be swapped based on ascending/descending order

      if ((arr[j] > pivot && ascending) || (arr[j] < pivot && !ascending)) {
        this.swapS(arr, j, idx); // Swap if the condition matches
        this._operations.push({
          leftNumber: idx,
          rightNumber: j,
          pivot: pivotIndex,
          rangeDown: low,
          rangeUp: high,
          swapped: true,
          typeOperation: "swap",
        });

        idx++; // Increment the index for next smaller element
      } else {
        this._operations.push({
          leftNumber: idx,
          rightNumber: j,
          pivot: pivotIndex,
          rangeDown: low,
          rangeUp: high,
          swapped: false,
          typeOperation: "compare",
        });
      }
    }

    // Swap the pivot element to its correct position
    this.swapS(arr, idx, high);
    this._operations.push({
      leftNumber: idx,
      rightNumber: high,
      pivot: idx,
      rangeDown: low,
      rangeUp: high,
      swapped: true,
      typeOperation: "pivot-swap",
      isSorted: true,
      indexSortedElement: idx,
    });

    return idx; // Return the new pivot index
  }

  public isElementIsSorted(value: number): number {
    return value;
  }

  private async quickSortRecursive(
    arr: number[],
    low: number,
    high: number,
    ascending?: boolean,
  ): Promise<void> {
    if (low >= high) {
      this._operations.push({
        leftNumber: low,
        rightNumber: low,
        pivot: low,
        rangeDown: low,
        rangeUp: low,
        swapped: false,
        typeOperation: "swap",
        indexSortedElement: low,
      });
      return;
    }

    const pivotIndex = await this.partition(arr, low, high, ascending); // Partition the array

    this.quickSortRecursive(arr, low, pivotIndex - 1, ascending); // Left subarray
    this.quickSortRecursive(arr, pivotIndex + 1, high, ascending); // Right subarray

    //
    // if (low < high) {
    //   const pivotIndex = await this.partition(arr, low, high, ascending); // Partition the array
    //
    //   // Recursively sort the left and right subarrays
    //   this.quickSortRecursive(arr, low, pivotIndex - 1, ascending); // Left subarray
    //   this.quickSortRecursive(arr, pivotIndex + 1, high, ascending); // Right subarray
    // }
  }

  @MeasureExecutionTime
  public generateSteps(ascending?: boolean): void {
    const arr = [...this._originalArray]; // Clone the original array
    this._operations = []; // Reset operations before generating new steps
    this._sortDirection = ascending || false;

    // Start recursive quicksort
    this.quickSortRecursive(arr, 0, arr.length - 1, ascending);

    // this._currentArray = arr; // Update the current state of the array
    this.setSortedArray(arr);
    console.log("czy posortowane poprawnie: ", this.checkIsSorted());
  }

  private partitionWithoutSteps(
    arr: number[],
    low: number,
    high: number,
    ascending?: boolean,
  ): number {
    const pivotIndex = high;
    const pivot = arr[pivotIndex];
    let idx = low;

    for (let j = low; j < high; j++) {
      if ((arr[j] > pivot && !ascending) || (arr[j] < pivot && ascending)) {
        this.swap(arr, j, idx);
        idx++;
      }
    }

    this.swap(arr, idx, high);
    return idx;
  }

  private quickSortRecursiveWithoutSteps(
    arr: number[],
    low: number,
    high: number,
    ascending?: boolean,
  ): void {
    if (low < high) {
      const pivotIndex = this.partitionWithoutSteps(arr, low, high, ascending); // Partition the array

      // Recursively sort the left and right subarrays
      this.quickSortRecursiveWithoutSteps(arr, low, pivotIndex - 1, ascending); // Left subarray
      this.quickSortRecursiveWithoutSteps(arr, pivotIndex + 1, high, ascending); // Right subarray
    }
  }

  public sortWithoutSteps(ascending?: boolean): number[] {
    // This method can be implemented for quicksort without recording steps
    const arr = [...this._originalArray];
    this.quickSortRecursiveWithoutSteps(arr, 0, arr.length - 1, ascending);
    return arr;
  }

  public generateJsonFile(): string {
    if (!this._operations || this._operations.length === 0) {
      console.error("Tablica _operations jest pusta.");
      return JSON.stringify(
        { error: "Brak danych do wygenerowania JSON." },
        null,
        2,
      );
    }

    const steps: any[] = [];

    steps.push({
      sortType: this._sortType,
      tableLength: this._originalArray.length,
      initialState: this._originalArray.toString(),
    });

    for (let i = 0; i < this._operations.length; i++) {
      steps.push({
        stepNumber: i,
        stepContent: {
          leftNumber: {
            index: this._operations[i]?.leftNumber,
            value: this._currentArray[this._operations[i]?.leftNumber],
          },
          rightNumber: {
            index: this._operations[i]?.rightNumber,
            value: this._currentArray[this._operations[i]?.rightNumber],
          },
          typeOperation: {
            name: this._operations[i]?.typeOperation || "unknown",
            isDone: this._operations[i]?.swapped,
          },
          rangeDown: {
            index: this._operations[i]?.rangeDown,
            value: this._currentArray[this._operations[i]?.rangeDown],
          },
          rangeUp: {
            index: this._operations[i]?.rangeUp,
            value: this._currentArray[this._operations[i]?.rangeUp],
          },
          comunnicate: {
            text: `${this._currentArray[this._operations[i]?.leftNumber]} zostało zamienione z ${this._currentArray[this._operations[i]?.rightNumber]} podczas operacji ${this._operations[i]?.typeOperation} która została wykonana ${this._operations[i]?.swapped}`,
          },
          currentArray: this.currentState.toString(),
        },
      });

      this.nextStep();
    }

    this.goToStep(0);

    return JSON.stringify(steps, null, 2);
  }

  public generateCurrentStateDescription(stepNumber: number): string {
    if (stepNumber < this.numberOfLastStep) return "";
  }
}
