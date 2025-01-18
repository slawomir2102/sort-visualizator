import { MeasureExecutionTime, SortSimulator } from "./SortSimulator.ts";

type descriptionType = {
  content: string;
  leftNumber: number;
  rightNumber: number;
};

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

    this._operations.push({ startState: true, endState: false });

    for (let i = 0; i < size - 1; i++) {
      let j = 0;
      for (j; j < size - i - 1; j++) {
        if (
          (!ascending && arr[j] > arr[j + 1]) ||
          (ascending && arr[j] < arr[j + 1])
        ) {
          this.registerSwapOperation(j, j + 1, true);
          this.swapS(arr, j, j + 1);
        }
        this.registerSwapOperation(j, j + 1, false);
      }

      this._operations[this.numberOfLastStep] = {
        ...this._operations[this.numberOfLastStep],
        indexSortedElement: size - i - 1,
      };
    }
    // this._operations[this.numberOfLastStep] = {
    //   ...this._operations[this.numberOfLastStep],
    //   indexSortedElement: 0,
    // };

    this._operations.push({ startState: false, endState: true });
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

  public generateCurrentStateDescription(): descriptionType {
    const step = this._currentStep;

    const currentOperation = this._operations[step];
    const arr = this._currentArray;

    if (step === this.numberOfLastStep) {
      return {
        content: "Dane zostały posortowane",
        leftNumber: 0,
        rightNumber: 0,
      };
    }

    if (step === 0) {
      return {
        content: "Dane zainicjowane i gotowe do sortowania",
        leftNumber: 0,
        rightNumber: 0,
      };
    }

    if (!("leftNumber" in currentOperation)) {
      return {
        content: "Wystąpił błąd",
        leftNumber: 0,
        rightNumber: 0,
      };
    }

    const compareText = `${arr[currentOperation.leftNumber]} zostala porównana z ${arr[currentOperation.rightNumber]}`;
    let compareTextResult: string = "";

    if (currentOperation.leftNumber == currentOperation.rightNumber) {
      compareTextResult = `, ${arr[currentOperation.leftNumber]} okazała się równa przez co nie została zamieniona`;
    } else if (currentOperation.leftNumber > currentOperation.rightNumber) {
      compareTextResult = `, ${arr[currentOperation.leftNumber]} okazała się większa `;
    } else {
      compareTextResult = `, ${arr[currentOperation.leftNumber]} okazała się mniejsza `;
    }

    if (currentOperation.swapped) {
      compareTextResult =
        compareTextResult +
        `oraz została zamieniona miejscem z ${arr[currentOperation.rightNumber]}`;
    }

    let isElementSortedText: string = "";

    if (currentOperation.indexSortedElement) {
      isElementSortedText = `${arr[currentOperation.indexSortedElement]} został poprawnie posortowany`;
    }

    const stepDescription =
      compareText + compareTextResult + isElementSortedText;

    return {
      content: stepDescription,
      leftNumber: arr[currentOperation.leftNumber],
      rightNumber: arr[currentOperation.leftNumber],
    };
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