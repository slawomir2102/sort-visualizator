import {BubbleSortSimulator} from '@/src/app/(private_pages)/courses/sorting_algoritms/simulator_page/simulator/BubbleSort';
import {
  QuickSortSimulator
} from '@/src/app/(private_pages)/courses/sorting_algoritms/simulator_page/simulator/QuickSort';
import {
  SortSimulator
} from '@/src/app/(private_pages)/courses/sorting_algoritms/simulator_page/simulator/SortSimulator';

function main () {

  let bubbleSimulator = new BubbleSortSimulator([]);
  let data: number[] = bubbleSimulator.generateArrayOfRandomData(1, 100, 1000);
  //
  // bubbleSimulator.setData(data)
  //
  console.log("-----------------Bubble Sort---------------");

  bubbleSimulator.generateSteps(SortSimulator.ASCENDING);
  console.log(bubbleSimulator.numberOfTotalSteps);
  //
  //  console.log(bubbleSimulator.currentState)
  bubbleSimulator.goToStep(10);
   console.log(bubbleSimulator.currentStep)
  console.log(bubbleSimulator.getExecutionTimeFor('generateSteps', 2, 'ms') + " ms")
  // console.log(bubbleSimulator.currentState)
  //

  bubbleSimulator.goToStep(bubbleSimulator.numberOfTotalSteps);
  // console.log(bubbleSimulator.currentState)

  bubbleSimulator.goToStep(10);
  console.log(bubbleSimulator.currentStep)
  // console.log(bubbleSimulator.currentState)




  //
  // console.log("Swaping data in time : ", bubbleSimulator.getExecutionTime(4, "s"));
  //
  // console.log(bubbleSimulator.currentState);
  // console.log("Number of total steps : ", bubbleSimulator.numberOfTotalSteps);
  // console.log("Number of total swaps : ", bubbleSimulator.swaps);



  // console.log("-----------------Quick Sort---------------");
  //
  //
  // let quickSortSimulator = new QuickSortSimulator([]);
  // quickSortSimulator.setData(data)
  // quickSortSimulator.generateSteps(QuickSortSimulator.DESCENDING)
  // console.log("Generate steps to sort : ", quickSortSimulator.getExecutionTimeFor('generateSteps', 2, 's'));
  //
  // //quickSortSimulator.sortWithoutSteps();
  // //console.log("Swaping data in time : ", quickSortSimulator.getExecutionTimeFor('sortWithoutSteps', 3, 'ms'));
  // console.log("Number of total steps : ", quickSortSimulator.numberOfTotalSteps);
  // console.log("Number of total swaps : ", quickSortSimulator.swaps);
  // quickSortSimulator.cleanMemory();
  // //console.log(quickSortSimulator.getCurrentArray());
  //


}

main();