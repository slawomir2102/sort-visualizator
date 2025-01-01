import { SortSimulator, MeasureExecutionTime } from "./SortSimulator.ts";

export class BubbleSortSimulator extends SortSimulator {
  protected _sortType;

  constructor() {
    super();
    this._sortType = "Bubble Sort";
  }

  @MeasureExecutionTime
  public generateSteps(ascending?: boolean) {
    this._operations = [];
    this._sortDirection = ascending || false;

    const arr = [...this._originalArray];
    const size = arr.length;

    let swap = false;

    for (let i = 0; i < size - 1; i++) {
      for (let j = 0; j < size - i - 1; j++) {
        if (
          (!ascending && arr[j] > arr[j + 1]) ||
          (ascending && arr[j] < arr[j + 1])
        ) {
          this.swapS(arr, j, j + 1);
          swap = true;
        }

        this.registerSwapOperation(
          j,
          j + 1,
          swap,
          // j == size - i - 1 - 1 ? (j == 0 ? j : j + 1) : undefined,
        );
        swap = false;
      }

      this._operations[cos] = {
        ...this._operations[size - i - 1],
        indexSortedElement: size - i - 1,
      };
    }
    this._operations[this._operations.length] = {
      ...this._operations[this._operations.length],
      indexSortedElement: 0,
    };

    this.setSortedArray(arr);
    console.log("czy posortowane poprawnie: ", this.checkIsSorted());
  }

  @MeasureExecutionTime
  public sortWithoutSteps(ascending?: boolean): number[] {
    const arr = [...this._originalArray];
    const size = arr.length;

    for (let i = 0; i < size - 1; i++) {
      for (let j = 0; j < size - i - 1; j++) {
        if (
          (!ascending && arr[j] > arr[j + 1]) ||
          (ascending && arr[j] < arr[j + 1])
        ) {
          this.swap(arr, j, j + 1);
        }
      }
    }
    return arr;
  }

  public generateCurrentStateDescription(stepNumber: number): string | "" {
    if (stepNumber >= this.numberOfLastStep) return "";

    const prevStateStepNumber = this._currentStep;
    this.goToStep(stepNumber);

    let stepDescription = `W kroku numer ${stepNumber} \n${this._currentArray[this._operations[stepNumber]?.leftNumber]} została porównana z ${this._currentArray[this._operations[stepNumber]?.rightNumber]}`;

    if (this._operations[stepNumber].swapped) {
      stepDescription =
        stepDescription +
        ` ${this._currentArray[this._operations[stepNumber]?.leftNumber]} i okazała się większa oraz została zamieniona miejscami`;
    } else {
      stepDescription =
        stepDescription +
        ` ${this._currentArray[this._operations[stepNumber]?.leftNumber]} i okazała się mniejsza`;
    }

    this.goToStep(prevStateStepNumber);

    return stepDescription;
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

    const steps: object[] = [];
    const prevStateCurrentStep = this._currentStep;
    this.goToStep(0);

    steps.push({
      sortType: this._sortType,
      initialState: this._originalArray.toString(),
      numberOfElementsToSort: this._originalArray.length,
      numberOfTotalSteps: this._numberOfTotalSteps,
      numberOfSwaps: this._swaps,
      numberOfStepsWithoutSwaps: this._numberOfTotalSteps - this._swaps,
    });

    for (let i = 0; i < this.numberOfLastStep; i++) {
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
          sortedElement: {
            index: this._operations[i]?.indexSortedElement,
            //value: this._currentArray[this._operations[i].indexSortedElement],
          },
          comunnicate: {
            text: this.generateCurrentStateDescription(i),
          },
          currentArray: this.currentState.toString(),
        },
      });

      this.nextStep();
    }

    this.goToStep(prevStateCurrentStep);

    return JSON.stringify(steps, null, 2);
  }
}
