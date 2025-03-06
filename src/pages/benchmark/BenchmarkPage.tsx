import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import Benchmark, { typeOperation } from "./Benchmark.tsx";
import { Generator } from "../../logic/simulator/Generator.ts";
import { setsNumberOfElements } from "../../logic/simulator/SimulatorTypes.ts";

const BenchmarkPage = () => {
  const [trigger, setTrigger] = useState<boolean>(false);
  const [operation, setOperation] = useState<typeOperation>(null);
  const [childrenStatus, setChildrenStatus] = useState<Record<number, boolean>>(
    {},
  );

  const [dataHaveToBeTheSame, setDataHaveToBeTheSame] =
    useState<boolean>(false);
  const [dataToSort, setDataToSort] = useState<number[] | undefined>(undefined);
  const [dataGenerated, setDataGenerated] = useState<boolean>(false);

  const [numberOfElements, setNumberOfElements] = useState<string>("1000");
  const [fromNumber, setFromNumber] = useState<number>(0);
  const [toNumber, setToNumber] = useState<number>(10000);

  const isValid = useCallback(() => {
    const statusValues = Object.values(childrenStatus);
    return statusValues.length > 0 && statusValues.every((status) => status);
  }, [childrenStatus]);

  const handleDataFromChild = useCallback((data: boolean, index: number) => {
    setChildrenStatus((prev) => ({
      ...prev,
      [index]: data,
    }));
  }, []);

  // Clear generated data when dataHaveToBeTheSame changes
  useEffect(() => {
    setDataToSort(undefined);
    setDataGenerated(false);
  }, [dataHaveToBeTheSame]);

  const benchmarks = [
    { id: 1, label: "BenchmarkPage 1" },
    { id: 2, label: "BenchmarkPage 2" },
    { id: 3, label: "BenchmarkPage 3" },
  ];

  const handleGenerateData = () => {
    try {
      const generator: Generator = new Generator();
      // Correct parameter order: min, max, count
      const numElements = parseInt(numberOfElements);
      if (isNaN(numElements) || numElements <= 0) {
        console.error("Invalid number of elements");
        return;
      }

      if (fromNumber >= toNumber) {
        console.error("From number must be less than to number");
        return;
      }

      const arr = generator.generateArrayOfRandomData(
        fromNumber,
        toNumber,
        numElements,
      );

      setDataToSort(arr);
      setDataGenerated(true);
    } catch (error) {
      console.error("Error generating data:", error);
      setDataGenerated(false);
    }
  };

  const handleNumberOfElementsChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setNumberOfElements(e.target.value);
    setDataGenerated(false);
    setDataToSort(undefined);
  };

  const handleFromNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setFromNumber(value);
      setDataGenerated(false);
      setDataToSort(undefined);
    }
  };

  const handleToNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setToNumber(value);
      setDataGenerated(false);
      setDataToSort(undefined);
    }
  };

  const handleDataHaveToBeTheSameChange = () => {
    setDataHaveToBeTheSame((prev) => !prev);
  };

  const isSimulateDisabled = () => {
    if (dataHaveToBeTheSame) {
      // If data should be the same, we need both valid configuration and generated data
      return !isValid() || !dataGenerated || dataToSort === undefined;
    } else {
      // If data can be different, we just need valid configuration
      return !isValid();
    }
  };

  return (
    <div
      className={"flex flex-row justify-between gap-lg p-4 w-full h-[85svh]"}
    >
      <Card className={" w-1/4 h-full"}>
        <CardHeader>
          <h2 className={"w-full text-center"}>Generator danych</h2>
        </CardHeader>
        <CardBody className={"flex flex-col gap-lg"}>
          <div className={"flex flex-col gap-lg mb-auto"}>
            <div className={"flex flex-row justify-between"}>
              <p>Takie same dane </p>
              <Switch
                isSelected={dataHaveToBeTheSame}
                onChange={handleDataHaveToBeTheSameChange}
                aria-label={
                  "Czy dane mają być takie same dla każdego algorytmu"
                }
              />
            </div>

            <div className={"flex flex-row justify-between "}>
              <p className={"w-1/2"}>Liczba elementów:</p>
              <Select
                isDisabled={!dataHaveToBeTheSame}
                aria-label={"Liczba elementów"}
                className={"w-1/2"}
                selectedKeys={[numberOfElements]}
                onChange={handleNumberOfElementsChange}
              >
                {setsNumberOfElements.map((number) => (
                  <SelectItem key={number.key}>{number.label}</SelectItem>
                ))}
              </Select>
            </div>

            <div className={"flex flex-row justify-between "}>
              <p className={"w-1/2"}>Zakres dolny:</p>
              <Input
                type={"number"}
                min={0}
                max={9999}
                isDisabled={!dataHaveToBeTheSame}
                aria-label={"Zakres dolny"}
                className={"w-1/2"}
                value={fromNumber.toString()}
                onChange={handleFromNumberChange}
              />
            </div>

            <div className={"flex flex-row justify-between "}>
              <p className={"w-1/2"}>Zakres górny:</p>
              <Input
                type={"number"}
                min={0}
                max={9999}
                isDisabled={!dataHaveToBeTheSame}
                aria-label={"Zakres górny"}
                className={"w-1/2"}
                value={toNumber.toString()}
                onChange={handleToNumberChange}
              />
            </div>
          </div>

          <div
            className={
              "flex flex-col gap-lg w-full justify-end items-end mt-auto p-4"
            }
          >
            <div className={"flex flex-row gap-lg"}>
              <Button
                color={"primary"}
                onPress={handleGenerateData}
                isDisabled={!dataHaveToBeTheSame}
              >
                Wygeneruj dane
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
      <div className={"flex flex-col gap-lg w-3/4 "}>
        <Card className={"h-full"}>
          <CardHeader>
            <h2 className={"text-center w-full"}>Symulatory wydajności</h2>
          </CardHeader>
          <CardBody className={"flex flex-row justify-around items-center"}>
            {benchmarks.map((benchmark, index) => (
              <Benchmark
                key={benchmark.id}
                trigger={trigger}
                operation={operation}
                dataHaveToBeTheSame={dataHaveToBeTheSame}
                data={dataToSort}
                sendDataToParent={(data) => handleDataFromChild(data, index)}
              />
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className={"text-center w-full"}>Sterowanie symulacją</h2>
          </CardHeader>
          <CardBody>
            <div
              className={
                "flex flex-row justify-end gap-lg scrollbar-hide overflow-hidden"
              }
            >
              <Button
                onPress={() => {
                  setTrigger((trigger) => !trigger);
                  setOperation("stop");
                }}
                isDisabled={!isValid()}
                color={"danger"}
              >
                Zatrzymaj Symulacje
              </Button>

              <Button
                onPress={() => {
                  setTrigger((trigger) => !trigger);
                  setOperation("start");
                }}
                isDisabled={isSimulateDisabled()}
                color={"primary"}
              >
                Symuluj
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default BenchmarkPage;