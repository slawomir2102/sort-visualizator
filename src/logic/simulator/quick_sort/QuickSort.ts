import {BaseSortStep, MeasureExecutionTime, Simulator} from "../Simulator.ts";
import {SortDirection} from "../SimulatorTypes.ts";

export enum QuickSortOperation {
    ChoosePivot = "choose_pivot",
    Compare = "compare",
    Swap = "swap",
    PartitionEnd = "partition_end",
    RecursiveCall = "recursive_call"
}

export type QuickSortStep = BaseSortStep & {
    pivotElement?: {
        index: number;
        value: number;
    };
    compareElement?: {
        index: number;
        value: number;
    };
    swappedElements?: {
        first: {
            index: number;
            value: number;
        };
        second: {
            index: number;
            value: number;
        };
    };
    // Zakres aktualnej partycji
    partitionRange?: {
        start: number;
        end: number;
    };
    typeOperation: QuickSortOperation;
};

export class QuickSort extends Simulator {
    protected sortName: string = "Quick Sort";
    public operations: QuickSortStep[];

    constructor() {
        super();
        this.operations = [];
    }

    private registerOperation(operation: QuickSortStep): void {
        this.operations.push(operation);
    }

    @MeasureExecutionTime
    public generateSimulatorSteps(): void {
        const arr: number[] = [...this.originalArray];
        const size: number = arr.length;
        const sortedIndexes: number[] = [];

        // Uruchom główną funkcję quicksort
        this.quickSortSteps(arr, 0, size - 1, sortedIndexes);

        this.setSortedArray(arr);
        this.numberOfLastStep = this.operations.length - 1; // Ważne: ustaw liczbę kroków
    }

    /**
     * Główna funkcja rekurencyjna QuickSort generująca kroki wizualizacji
     */
    private quickSortSteps(arr: number[], low: number, high: number, sortedIndexes: number[]): void {
        if (low < high) {
            // Zarejestruj wywołanie rekurencyjne
            this.registerOperation({
                partitionRange: { start: low, end: high },
                typeOperation: QuickSortOperation.RecursiveCall,
                sortedElements: {
                    indexes: [...sortedIndexes],
                    values: sortedIndexes.map(idx => arr[idx])
                }
            });

            // Wywołaj partycjonowanie i uzyskaj indeks pivota
            const pivotIndex = this.partition(arr, low, high, sortedIndexes);

            // Jeśli partycjonowanie się zakończyło, dodaj indeks pivota do posortowanych
            sortedIndexes.push(pivotIndex);

            // Rekurencyjnie sortuj elementy przed i po pivocie
            this.quickSortSteps(arr, low, pivotIndex - 1, sortedIndexes);
            this.quickSortSteps(arr, pivotIndex + 1, high, sortedIndexes);
        } else if (low === high) {
            // Jeśli partycja zawiera tylko jeden element, uznaj go za posortowany
            if (!sortedIndexes.includes(low)) {
                sortedIndexes.push(low);
            }
        }
    }

    /**
     * Funkcja partycjonująca, która wybiera pivot i dzieli tablicę
     */
    private partition(arr: number[], low: number, high: number, sortedIndexes: number[]): number {
        // Wybierz pivot (w tym przypadku ostatni element)
        const pivotValue = arr[high];

        // Zarejestruj wybór pivota
        this.registerOperation({
            pivotElement: { index: high, value: pivotValue },
            partitionRange: { start: low, end: high },
            typeOperation: QuickSortOperation.ChoosePivot,
            sortedElements: {
                indexes: [...sortedIndexes],
                values: sortedIndexes.map(idx => arr[idx])
            }
        });

        let i = low - 1; // Indeks mniejszego elementu

        // Przejdź przez wszystkie elementy, porównaj je z pivotem
        for (let j = low; j < high; j++) {
            const isSmaller = this.sortDirection === SortDirection.ASCENDING
                ? arr[j] < pivotValue
                : arr[j] > pivotValue;

            // Zarejestruj porównanie
            this.registerOperation({
                pivotElement: { index: high, value: pivotValue },
                compareElement: { index: j, value: arr[j] },
                partitionRange: { start: low, end: high },
                typeOperation: QuickSortOperation.Compare,
                sortedElements: {
                    indexes: [...sortedIndexes],
                    values: sortedIndexes.map(idx => arr[idx])
                }
            });

            if (isSmaller) {
                i++;

                // Zamień elementy jeśli znaleziono mniejszy element
                if (i !== j) {
                    // Zarejestruj zamianę
                    this.registerOperation({
                        pivotElement: { index: high, value: pivotValue },
                        swappedElements: {
                            first: { index: i, value: arr[i] },
                            second: { index: j, value: arr[j] }
                        },
                        partitionRange: { start: low, end: high },
                        typeOperation: QuickSortOperation.Swap,
                        sortedElements: {
                            indexes: [...sortedIndexes],
                            values: sortedIndexes.map(idx => arr[idx])
                        }
                    });
                }

                // Wykonaj zamianę
                this.swap(arr, i, j);
            }
        }

        // Umieść pivot na właściwej pozycji
        const pivotPosition = i + 1;

        // Zarejestruj finalną zamianę pivota
        this.registerOperation({
            pivotElement: { index: high, value: pivotValue },
            swappedElements: {
                first: { index: pivotPosition, value: arr[pivotPosition] },
                second: { index: high, value: arr[high] }
            },
            partitionRange: { start: low, end: high },
            typeOperation: QuickSortOperation.Swap,
            sortedElements: {
                indexes: [...sortedIndexes],
                values: sortedIndexes.map(idx => arr[idx])
            }
        });

        // Wykonaj zamianę
        this.swap(arr, pivotPosition, high);

        // Zarejestruj zakończenie partycjonowania
        this.registerOperation({
            pivotElement: { index: pivotPosition, value: arr[pivotPosition] },
            partitionRange: { start: low, end: high },
            typeOperation: QuickSortOperation.PartitionEnd,
            sortedElements: {
                indexes: [...sortedIndexes],
                values: sortedIndexes.map(idx => arr[idx])
            }
        });

        return pivotPosition;
    }

    @MeasureExecutionTime
    public updateCurrentArrayState(): number[] {
        if (this.currentStep < 0 || this.currentStep >= this.operations.length) {
            return this.currentArray;
        }

        const operation = this.operations[this.currentStep];
        if (!operation) return this.currentArray;

        // Dla operacji zamiany, aktualizuj tablicę
        if (operation.typeOperation === QuickSortOperation.Swap && operation.swappedElements) {
            const { first, second } = operation.swappedElements;
            this.swap(this.currentArray, first.index, second.index);
        }

        return this.currentArray;
    }

    @MeasureExecutionTime
    public sort(): number[] {
        const arr: number[] = [...this.originalArray];
        this.quickSort(arr, 0, arr.length - 1);
        return arr;
    }

    /**
     * Implementacja standardowego QuickSort bez kroków wizualizacji
     */
    private quickSort(arr: number[], low: number, high: number): void {
        if (low < high) {
            const pivotIndex = this.quickSortPartition(arr, low, high);
            this.quickSort(arr, low, pivotIndex - 1);
            this.quickSort(arr, pivotIndex + 1, high);
        }
    }

    private quickSortPartition(arr: number[], low: number, high: number): number {
        const pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            const shouldSwap = this.sortDirection === SortDirection.ASCENDING
                ? arr[j] < pivot
                : arr[j] > pivot;

            if (shouldSwap) {
                i++;
                this.swap(arr, i, j);
            }
        }

        this.swap(arr, i + 1, high);
        return i + 1;
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
            case QuickSortOperation.ChoosePivot:
                if (operation.pivotElement && operation.partitionRange) {
                    description = `Wybieram pivot ${operation.pivotElement.value} (indeks ${operation.pivotElement.index}) ` +
                        `dla partycji [${operation.partitionRange.start}, ${operation.partitionRange.end}].`;
                }
                break;

            case QuickSortOperation.Compare:
                if (operation.pivotElement && operation.compareElement) {
                    const pivotValue = operation.pivotElement.value;
                    const compareValue = operation.compareElement.value;
                    const isSmaller = this.sortDirection === SortDirection.ASCENDING
                        ? compareValue < pivotValue
                        : compareValue > pivotValue;

                    description = `Porównuję element ${compareValue} (indeks ${operation.compareElement.index}) ` +
                        `z pivotem ${pivotValue}. Element jest ${isSmaller ? "mniejszy" : "większy"} od pivota.`;
                }
                break;

            case QuickSortOperation.Swap:
                if (operation.swappedElements) {
                    const { first, second } = operation.swappedElements;
                    description = `Zamieniam element ${first.value} (indeks ${first.index}) ` +
                        `z elementem ${second.value} (indeks ${second.index}).`;
                }
                break;

            case QuickSortOperation.PartitionEnd:
                if (operation.pivotElement && operation.partitionRange) {
                    description = `Zakończono partycjonowanie. Pivot ${operation.pivotElement.value} ` +
                        `jest na swojej finalnej pozycji (indeks ${operation.pivotElement.index}).`;
                }
                break;

            case QuickSortOperation.RecursiveCall:
                if (operation.partitionRange) {
                    description = `Rekurencyjne wywołanie QuickSort dla partycji ` +
                        `[${operation.partitionRange.start}, ${operation.partitionRange.end}].`;
                }
                break;
        }

        // Dodaj informację o posortowanych elementach
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

        // Zapisz aktualny stan
        const currentArrayCopy = [...this.currentArray];
        const currentStepCopy = this.currentStep;

        // Resetuj do początku
        this.currentStep = 0;

        for (let i = 0; i < this.operations.length; i++) {
            steps.push({
                current_array: [...this.currentArray],
                current_step: this.currentStep,
            });
            this.nextStep();
        }

        // Przywróć stan
        this.currentArray = currentArrayCopy;
        this.currentStep = currentStepCopy;

        return JSON.stringify(steps, null, 2);
    }
}