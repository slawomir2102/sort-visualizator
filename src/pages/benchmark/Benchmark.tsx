import React, { useEffect, useState } from "react";
import { Generator } from "../../logic/simulator/Generator.ts";
import { Select, SelectItem, Spinner } from "@nextui-org/react";
import { setsNumberOfElements } from "../../logic/simulator/SimulatorTypes.ts";
import { simulators } from "../../logic/simulator/SimulatorTypes.ts";

export type typeOperation = "start" | "stop" | null;

interface Props {
  trigger: boolean;
  operation: typeOperation;
  dataHaveToBeTheSame: boolean;
  data?: number[];
  sendDataToParent: (data: boolean) => void;
}

const Benchmark = (props: Props) => {
  const [sortAlg, setSortAlg] = useState<string | null>(null);
  const [algLoading, setAlgLoading] = useState<boolean>(false);
  const [numberOfElements, setNumberOfElements] = useState<string | null>(null);
  const [firstResultData, setFirstResultData] = useState<number | null>(null);
  const [numberOfSwaps, setNumberOfSwaps] = useState<number | null>(null);
  const [numberOfCompare, setNumberOfCompare] = useState<number | null>(null);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [, setIsDataDelivered] = useState<boolean>(false);
  const [generatedData, setGeneratedData] = useState<number[] | null>(null);

  useEffect(() => {
    // Only set isDataDelivered to true if dataHaveToBeTheSame is true AND data exists
    if (props.dataHaveToBeTheSame && props.data && props.data.length > 0) {
      setIsDataDelivered(true);
      // Update numberOfElements based on the provided data length
      const matchingNumberOfElements = setsNumberOfElements.find(
        (item) => Number(item.key) === props.data?.length,
      );
      if (matchingNumberOfElements) {
        setNumberOfElements(matchingNumberOfElements.key.toString());
      }
    } else {
      setIsDataDelivered(false);
    }
  }, [props.dataHaveToBeTheSame, props.data]);

  useEffect(() => {
    const isValidConfig = Boolean(sortAlg && numberOfElements);
    props.sendDataToParent(isValidConfig);
  }, [sortAlg, numberOfElements]);

  useEffect(() => {
    switch (props.operation) {
      case "start":
        handleBenchmarkStart();
        break;
      case "stop":
        handleStopWorker();
        break;
      default:
        console.log("nic");
        break;
    }
  }, [props.trigger]);

  const handleSelectionSortAlg = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedValue = e.target.value;
    setSortAlg(updatedValue);
  };

  const handleBenchmarkStart = () => {
    if (!sortAlg || !numberOfElements) {
      return;
    }

    const numOfElements: number = Number(numberOfElements);
    let arr: number[] | undefined;

    // Handle data generation logic
    if (props.dataHaveToBeTheSame) {
      // Use provided data if it exists and has the correct length
      if (props.data && props.data.length === numOfElements) {
        arr = props.data;
      } else {
        console.error(
          "Data inconsistency: expected data not provided or incorrect length",
        );
        return;
      }
    } else {
      // Generate data if we don't already have generated data of the correct length
      if (!generatedData || generatedData.length !== numOfElements) {
        const generator = new Generator();
        const newData = generator.generateArrayOfRandomData(
          0,
          10000,
          numOfElements,
        );
        setGeneratedData(newData);
        arr = newData;
      } else {
        // Reuse previously generated data of the same length
        arr = generatedData;
      }
    }

    const newWorker = new Worker(
      new URL("../../logic/simulator/SortWorker.ts", import.meta.url),
      {
        type: "module",
      },
    );

    setAlgLoading(true);
    newWorker.postMessage({
      algorithm: sortAlg,
      dataToSort: arr,
    });

    newWorker.onmessage = (e) => {
      const { result, error } = e.data;
      if (!error) {
        setFirstResultData(result.execTime);
        setNumberOfSwaps(result.swaps);
        setNumberOfCompare(result.compares);
      } else {
        setFirstResultData(error.toString());
        setNumberOfSwaps(error.toString());
        setNumberOfCompare(error.toString());
      }
      newWorker.terminate();
      setAlgLoading(false);
    };
    setWorker(newWorker);
  };

  const handleSelectionNumberOfElements = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const updatedValue = e.target.value;
    setNumberOfElements(updatedValue);
    // Clear generated data when number of elements changes
    setGeneratedData(null);
  };

  function handleStopWorker(): void {
    if (worker) {
      worker.terminate();
      setWorker(null);
      setAlgLoading(false);
    }
  }

  return (
    <div className={"flex flex-col w-1/3 p-4"}>
      <div className={"flex flex-col"}>
        <div className={"flex flex-row items-center py-4"}>
          <p className={"w-1/2"}>Liczba elementów: </p>
          <Select
            isDisabled={props.dataHaveToBeTheSame}
            aria-label={"Liczba elementów"}
            placeholder="nie wybrano"
            className={"w-1/2"}
            selectedKeys={numberOfElements ? [numberOfElements] : undefined}
            onChange={handleSelectionNumberOfElements}
          >
            {setsNumberOfElements.map((number) => (
              <SelectItem key={number.key}>{number.label}</SelectItem>
            ))}
          </Select>
        </div>
        <div className={"flex flex-row items-center py-4"}>
          <p className={"w-1/2"}>Wybierz algorytm:</p>
          <Select
            aria-label={"Wybierz algorytm"}
            className={"w-1/2"}
            placeholder="nie wybrano"
            selectedKeys={sortAlg ? [sortAlg] : undefined}
            onChange={handleSelectionSortAlg}
          >
            {simulators.map((simulator) => (
              <SelectItem key={simulator.key}>{simulator.label}</SelectItem>
            ))}
          </Select>
        </div>

        <div
          className={
            "flex flex-col   p-4 min-h-40 bg-background-50 rounded-2xl"
          }
        >
          <p>Wyniki:</p>
          <div className={"flex flex-col py-4 gap-lg"}>
            {!algLoading ? (
              <div className={"flex flex-col py-4 gap-sm"}>
                <div className={"flex flex-row justify-between"}>
                  <p>Czas trwania symulacji:</p>
                  {firstResultData
                    ? firstResultData.toString() + " s"
                    : "brak danych"}
                </div>
                <div className={"flex flex-row justify-between"}>
                  <p>Ilość porównań:</p>
                  {numberOfCompare ? numberOfCompare.toString() : "brak danych"}
                </div>
                <div className={"flex flex-row justify-between"}>
                  <p>Ilość zamian:</p>
                  {numberOfSwaps ? numberOfSwaps.toString() : "brak danych"}
                </div>
              </div>
            ) : (
              <div
                className={"flex flex-row items-center justify-center gap-lg"}
              >
                <p>Symulowanie...</p>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Benchmark;