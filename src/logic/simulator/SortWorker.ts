import { BubbleSort } from "./bubble_sort/BubbleSort.ts";
import { QuickSort } from "./quick_sort/QuickSort.ts";
import { InsertionSort } from "./insertion_sort/InsertionSort.ts";
import { SelectionSort } from "./selection_sort/SelectionSort.ts";
import { AlgorithmsNames, Simulators } from "./SimulatorTypes.ts";

self.onmessage = function (e) {
  try {
    const { algorithm, dataToSort } = e.data;

    let simulator: Simulators;
    switch (algorithm) {
      case AlgorithmsNames.BubbleSort:
        simulator = new BubbleSort();
        break;
      case AlgorithmsNames.InsertionSort:
        simulator = new InsertionSort();
        break;
      case AlgorithmsNames.SelectionSort:
        simulator = new SelectionSort();
        break;
      case AlgorithmsNames.QuickSort:
        simulator = new QuickSort();
        break;
      default:
        throw new Error("Invalid sorting algorithm");
    }

    simulator.setData(dataToSort);

    simulator.sort();
    const time = simulator.getExecutionTimeFor("sort", 6, "s");
    const numberOfSwaps: number = simulator.getNumberOfSwaps;
    const numberOfCompare: number = simulator.getNumberOfCompare;
    self.postMessage({
      result: {
        execTime: time,
        swaps: numberOfSwaps,
        compares: numberOfCompare,
      },
      error: null,
    });
  } catch (error) {
    self.postMessage({ result: null, error: error });
  }
};