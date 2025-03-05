import { BubbleSort } from "./bubble_sort/BubbleSort.ts";
import { QuickSort } from "./quick_sort/QuickSort.ts";
import {InsertionSort} from "./insertion_sort/InsertionSort.ts"
import {SelectionSort} from "./selection_sort/SelectionSort.ts"

self.onmessage = function (e) {
  try {
    const { algorithm, dataToSort } = e.data;

    let simulator;
    switch (algorithm) {
      case "bubble":
        simulator = new BubbleSort();
        break;
      case "insertion":
        simulator = new InsertionSort();
        break;
      case "selection":
        simulator = new SelectionSort();
        break;
      case "quick":
        simulator = new QuickSort();
        break;
      default:
        throw new Error("Invalid sorting algorithm");
    }

    simulator.setData(dataToSort);

    simulator.sort();
    const time = simulator.getExecutionTimeFor(
      "sort",
      6,
      "s",
    );
    const numberOfSwaps: number = simulator.swaps;
    self.postMessage({
      result: {
        execTime: time,
        swaps: numberOfSwaps,
      },
      error: null,
    });
  } catch (error) {
    self.postMessage({ result: null, error: error });
  }
};