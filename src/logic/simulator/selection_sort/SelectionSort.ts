import {BaseSortStep, MeasureExecutionTime, Simulator} from "../Simulator.ts";
import {SortDirection} from "../SimulatorTypes.ts";

export enum SelectionSortOperation {
    Compare = "compare",
    SelectMin = "select_min",
    Swap = "swap",
}

export type SelectionSortStep = BaseSortStep & {
    currentIndex: {
        index: number;
        value: number;
    };
    compareElement?: {
        index: number;
        value: number;
    };
    minElement?: {
        index: number;
        value: number;
    };
    swappedElements?: {
        from: {
            index: number;
            value: number;
        };
        to: {
            index: number;
            value: number;
        };
    };
    typeOperation: SelectionSortOperation;
};

export class SelectionSort extends Simulator {
    protected sortName: string = "Selection Sort";
    public operations: SelectionSortStep[];

    constructor() {
        super();
        this.operations = [];
    }

    private registerOperation(operation: SelectionSortStep): void {
        this.operations.push(operation);
    }

    @MeasureExecutionTime
    public generateSimulatorSteps(): void {
        const arr: number[] = [...this.originalArray];
        const size: number = arr.length;
        const sortedIndexes: number[] = [];

        for (let i = 0; i < size - 1; i++) {
            let minIdx = i;

            // Register current position operation
            this.registerOperation({
                currentIndex: { index: i, value: arr[i] },
                typeOperation: SelectionSortOperation.Compare,
                sortedElements: {
                    indexes: [...sortedIndexes],
                    values: sortedIndexes.map(idx => arr[idx])
                }
            });

            // Find the minimum element in unsorted part of array
            for (let j = i + 1; j < size; j++) {
                const isNewMinimum = (this.sortDirection === SortDirection.ASCENDING)
                    ? arr[j] < arr[minIdx]
                    : arr[j] > arr[minIdx];

                // Register comparison operation
                this.registerOperation({
                    currentIndex: { index: i, value: arr[i] },
                    compareElement: { index: j, value: arr[j] },
                    minElement: { index: minIdx, value: arr[minIdx] },
                    typeOperation: SelectionSortOperation.Compare,
                    sortedElements: {
                        indexes: [...sortedIndexes],
                        values: sortedIndexes.map(idx => arr[idx])
                    }
                });

                if (isNewMinimum) {
                    minIdx = j;

                    // Register selecting new minimum
                    this.registerOperation({
                        currentIndex: { index: i, value: arr[i] },
                        minElement: { index: minIdx, value: arr[j] },
                        typeOperation: SelectionSortOperation.SelectMin,
                        sortedElements: {
                            indexes: [...sortedIndexes],
                            values: sortedIndexes.map(idx => arr[idx])
                        }
                    });
                }
            }

            // Swap the found minimum element with the first element if needed
            if (minIdx !== i) {
                // Register swap operation before actually swapping
                this.registerOperation({
                    currentIndex: { index: i, value: arr[i] },
                    minElement: { index: minIdx, value: arr[minIdx] },
                    swappedElements: {
                        from: { index: minIdx, value: arr[minIdx] },
                        to: { index: i, value: arr[i] }
                    },
                    typeOperation: SelectionSortOperation.Swap,
                    sortedElements: {
                        indexes: [...sortedIndexes],
                        values: sortedIndexes.map(idx => arr[idx])
                    }
                });

                // Perform the swap
                this.swap(arr, minIdx, i);
            }

            // After each complete iteration, mark the current index as sorted
            sortedIndexes.push(i);
        }

        // Add the last element to sorted indexes after the loop completes
        sortedIndexes.push(size - 1);

        // Add a final state showing all elements sorted
        this.registerOperation({
            currentIndex: { index: size - 1, value: arr[size - 1] },
            typeOperation: SelectionSortOperation.Compare,
            sortedElements: {
                indexes: [...sortedIndexes],
                values: sortedIndexes.map(idx => arr[idx])
            }
        });

        this.setSortedArray(arr);
        this.numberOfLastStep = this.operations.length - 1; // Important: set the number of last step
    }

    @MeasureExecutionTime
    public updateCurrentArrayState(): number[] {
        if (this.currentStep < 0 || this.currentStep >= this.operations.length) {
            return this.currentArray;
        }

        const operation = this.operations[this.currentStep];
        if (!operation) return this.currentArray;

        // For swap operations, update the array
        if (operation.typeOperation === SelectionSortOperation.Swap && operation.swappedElements) {
            const { from, to } = operation.swappedElements;
            this.swap(this.currentArray, from.index, to.index);
        }

        return this.currentArray;
    }

    @MeasureExecutionTime
    public sort(): number[] {
        const arr: number[] = [...this.originalArray];
        const size: number = arr.length;

        for (let i = 0; i < size - 1; i++) {
            let minIdx = i;

            for (let j = i + 1; j < size; j++) {
                if ((this.sortDirection === SortDirection.ASCENDING && arr[j] < arr[minIdx]) ||
                    (this.sortDirection === SortDirection.DESCENDING && arr[j] > arr[minIdx])) {
                    minIdx = j;
                }
            }

            // Swap the found minimum element with the first element
            if (minIdx !== i) {
                this.swap(arr, minIdx, i);
            }
        }

        return arr;
    }

    @MeasureExecutionTime
    public generateCurrentStepDescription(): string {
        if (this.currentStep < 0 || this.currentStep >= this.operations.length) {
            return "Błąd: nieprawidłowy krok.";
        }

        const operation = this.operations[this.currentStep];
        if (!operation) return "Błąd: brak operacji dla tego kroku.";

        let description = "";

        switch (operation.typeOperation) {
            case SelectionSortOperation.Compare:
                if (operation.compareElement && operation.minElement) {
                    description = `Porównuję element na pozycji ${operation.compareElement.index} (wartość: ${operation.compareElement.value}) ` +
                        `z aktualnym minimum na pozycji ${operation.minElement.index} (wartość: ${operation.minElement.value}).`;
                } else {
                    description = `Rozpoczynam szukanie minimum od pozycji ${operation.currentIndex.index}.`;
                }
                break;

            case SelectionSortOperation.SelectMin:
                if (operation.minElement) {
                    description = `Znaleziono nowe minimum: ${operation.minElement.value} na pozycji ${operation.minElement.index}.`;
                }
                break;

            case SelectionSortOperation.Swap:
                if (operation.swappedElements) {
                    const { from, to } = operation.swappedElements;
                    description = `Zamieniam minimum ${from.value} z pozycji ${from.index} ` +
                        `z elementem ${to.value} na pozycji ${to.index}.`;
                }
                break;
        }

        // Add information about sorted elements
        if (operation.sortedElements && operation.sortedElements.indexes && operation.sortedElements.indexes.length > 0) {
            description += ` Posortowane elementy: ${operation.sortedElements.indexes.join(', ')}.`;
        }

        return description;
    }

    @MeasureExecutionTime
    public generateJSONFile(): string {
        if (this.operations.length === 0) {
            console.error("Tablica operations jest pusta");
            return "[]";
        }

        const steps: object[] = [
            { algorithms_name: this.sortName }
        ];

        const currentArrayCopy = [...this.currentArray];
        const currentStepCopy = this.currentStep;

        // Reset to beginning
        this.currentStep = 0;

        for (let i = 0; i < this.operations.length; i++) {
            steps.push({
                current_array: [...this.currentArray],
                current_step: this.currentStep,
            });
            this.nextStep();
        }

        // Restore original state
        this.currentArray = currentArrayCopy;
        this.currentStep = currentStepCopy;

        return JSON.stringify(steps, null, 2);
    }
}