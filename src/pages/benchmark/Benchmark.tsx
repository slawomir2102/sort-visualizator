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
  const [worker, setWorker] = useState<Worker | null>(null);
  const [, setIsDataDelivered] = useState<boolean>(false);

  useEffect(() => {
    if (props.dataHaveToBeTheSame) {
      setIsDataDelivered(true);
    }
  }, [props.data]);

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
    // WebWorker dla pierwszego algorytmu
    const generator = new Generator();
    if (!numberOfElements) {
      return;
    }
    const numOfElements: number = Number(numberOfElements);

    let arr: number[] | undefined = [];

    if (props.dataHaveToBeTheSame) {
      arr = props.data;
    } else {
      arr = generator.generateArrayOfRandomData(0, 150, numOfElements);
    }

    if (sortAlg && numberOfElements) {
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
        } else {
          setFirstResultData(error.toString());
        }
        newWorker.terminate();
        setAlgLoading(false);
      };
      setWorker(newWorker);
    }
  };

  const handleSelectionNumberOfElements = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const updatedValue = e.target.value;
    setNumberOfElements(updatedValue);
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
                  <p> {firstResultData} s</p>
                </div>
                <div className={"flex flex-row justify-between"}>
                  <p>Całkowita ilość kroków:</p>
                  <p>zmienna </p>
                </div>
                <div className={"flex flex-row justify-between"}>
                  <p>Ilość zamian:</p>
                  <p>zmienna </p>
                </div>
                <div className={"flex flex-row justify-between"}>
                  <p>Ilość kroków bez zamian:</p>
                  <p>zmienna </p>
                </div>
              </div>
            ) : (
              <div className={"flex flex-row items-center gap-lg"}>
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