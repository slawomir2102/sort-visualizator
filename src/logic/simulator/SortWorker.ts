import { BubbleSortSimulator } from "./BubbleSort.ts";
import { QuickSortSimulator } from "./QuickSort.ts";

self.onmessage = function (e) {
  try {
    const { algorithm, dataToSort } = e.data;

    let simulator;
    switch (algorithm) {
      case "bubble":
        simulator = new BubbleSortSimulator();
        break;
      // case "insertion":
      //   firstSimulator = new InsertionSortSimulator();
      //   break;
      // case "selection":
      //   firstSimulator = new SelectionSortSimulator();
      //   break;
      case "quick":
        simulator = new QuickSortSimulator();
        break;
      // case "merge":
      //   firstSimulator = new MergeSortSimulator();
      //   break;
      default:
        throw new Error("Invalid sorting algorithm");
    }

    simulator.setData(dataToSort);

    simulator.sortWithoutSteps();
    const time: number = simulator.getExecutionTimeFor(
      "sortWithoutSteps",
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