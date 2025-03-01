import { Simulator } from "./newSimulator.ts";
import {
  InsertionSortOperation,
  InsertionSortOperationType,
  SortOperation,
} from "./SimulatorTypes.ts";

export class InsertionSort extends Simulator {
  protected sortName = "InsertionSort";
  public operations: InsertionSortOperationType[];

  constructor() {
    super();
    this.operations = [];
  }
  public updateCurrentArrayState(): number[] {
    const { leftNumber, rightNumber, typeOperation } =
      this.operations[this.currentStep];

    if (
      typeOperation === SortOperation.Swap ||
      typeOperation === SortOperation.Insert
    ) {
      this.swap(this.currentArray, leftNumber.position, rightNumber.position);
    }

    return this.currentArray;
  }
  private registerOperation(operation: InsertionSortOperation): void {
    this.operations.push(operation);
  }

  public generateSimulatorSteps(): void {
    const arr: number[] = [...this.originalArray];
    const size: number = arr.length;

    const sortedIndexes: number[] = [0]; // Początkowo pierwszy element jest "posortowany"

    for (let i = 1; i < size; i++) {
      const key = arr[i];
      let j = i - 1;
      let insertedPosition = i;

      // Rejestruj klucz na początku operacji
      this.registerOperation({
        key: { index: i, value: key },
        typeOperation: SortOperation.KeySelection,
      });

      // Przesuwanie elementów większych/mniejszych od klucza
      while (j >= 0 && (!this.sortDirection ? arr[j] > key : arr[j] < key)) {
        // Rejestracja porównania
        this.registerOperation({
          key: { index: i, value: key },
          comparedElement: { index: j, value: arr[j] },
          typeOperation: SortOperation.Compare,
        });

        // Przesunięcie elementu w prawo
        arr[j + 1] = arr[j];
        this.registerOperation({
          key: { index: i, value: key },
          shiftedElement: { index: j, value: arr[j] },
          newPosition: j + 1,
          typeOperation: SortOperation.Shift,
        });

        insertedPosition = j;
        j--;
      }

      // Wstawienie klucza w odpowiednie miejsce
      if (insertedPosition !== i) {
        arr[insertedPosition] = key;
        this.registerOperation({
          key: { index: i, value: key },
          insertedPosition: insertedPosition,
          typeOperation: SortOperation.Insert,
        });
      }

      // Aktualizacja posortowanych elementów (0..i)
      sortedIndexes.push(i);
      const lastStep = this.operations.length - 1;
      if (lastStep >= 0) {
        this.operations[lastStep].sortedElements = {
          indexes: [...sortedIndexes],
          values: sortedIndexes.map((idx) => arr[idx]),
        };
      }
    }
  }

  public sort(): number[] {
    const arr: number[] = [...this.originalArray];
    const size: number = arr.length;

    for (let i: number = 1; i < size; i++) {
      const key: number = arr[i];
      let j: number;
      for (j = i - 1; j >= 0 && arr[j] > key; j--) {
        if (
          (this.sortDirection && arr[j] > key) ||
          (this.sortDirection && arr[j] < key)
        ) {
          arr[j + 1] = arr[j];
        }
      }
      arr[j + 1] = key;
    }
    return arr;
  }

  public generateCurrentStepDescription(): string {
    const step: number = this.currentStep;
    const currentOperation: InsertionSortOperationType = this.operations[step]; // Zmiana typu operacji

    if (!currentOperation) return "Błąd: brak operacji dla tego kroku.";

    const {
      key,
      comparedElement,
      shiftedElements,
      insertedPosition,
      sortedElements,
    } = currentOperation;
    const keyValue: number = key?.value;
    const comparedValue: number = comparedElement?.value;

    if (keyValue === undefined) {
      return "Błąd: nieprawidłowe dane operacji sortowania.";
    }

    let description = "";

    // Opis porównania
    if (comparedElement) {
      description += `Klucz ${keyValue} został porównany z ${comparedValue}. `;
      description +=
        keyValue < comparedValue
          ? `${keyValue} jest mniejszy. `
          : keyValue > comparedValue
            ? `${keyValue} jest większy. `
            : "Liczby są równe. ";
    }

    // Opis przesunięcia
    if (shiftedElements) {
      description += `Przesunięto element(y) ${shiftedElements.map((e) => e.value).join(", ")} w prawo. `;
    }

    // Opis wstawienia
    if (insertedPosition !== undefined) {
      description += `Wstawiono klucz ${keyValue} na pozycję ${insertedPosition}. `;
    }

    // Opis posortowanych elementów
    // if (sortedElements) {
    //   description += `Element(y) ${sortedElements.map((e) => e.value).join(", ")} są już w dobrej pozycji.`;
    // }

    return description.trim() || "Brak dostępnego opisu kroku.";
  }
  public generateJSONFile(): void {}
}