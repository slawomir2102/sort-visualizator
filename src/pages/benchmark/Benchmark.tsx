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
import React, { useCallback, useState } from "react";
import BenchAlg, { typeOperation } from "./BenchAlg.tsx";
import { Generator } from "../../logic/simulator/Generator.ts";

export const setsNumberOfElements = [
  { key: 10000, label: "10000" },
  { key: 20000, label: "20000" },
  { key: 50000, label: "50000" },
  { key: 100000, label: "100000" },
  { key: 200000, label: "200000" },
];

const Benchmark = () => {
  const [trigger, setTrigger] = useState<boolean>(false);
  const [operation, setOperation] = useState<typeOperation>(null);
  const [childrenStatus, setChildrenStatus] = useState<Record<number, boolean>>(
    {},
  );

  const [dataHaveToBeTheSame, setDataHaveToBeTheSame] =
    useState<boolean>(false);
  const [dataToSort, setDataToSort] = useState<number[] | undefined>(undefined);

  const [numberOfElements, setNumberOfElements] = useState<number>(4);
  const [fromNumber, setFromNumber] = useState<number>(0);
  const [toNumber, setToNumber] = useState<number>(0);

  const isValid = useCallback(() => {
    const statusValues = Object.values(childrenStatus);

    return (
      statusValues.length > 0 && statusValues.every((status) => status === true)
    );
  }, [childrenStatus]);

  const handleDataFromChild = useCallback((data: boolean, index: number) => {
    setChildrenStatus((prev) => ({
      ...prev,
      [index]: data,
    }));
  }, []);

  const benchmarks = [
    { id: 1, label: "Benchmark 1" },
    { id: 2, label: "Benchmark 2" },
    { id: 3, label: "Benchmark 3" },
  ];

  const handleGenerateData = () => {
    const generator: Generator = new Generator();
    const arr = generator.generateArrayOfRandomData(
      numberOfElements,
      fromNumber,
      toNumber,
    );
    setDataToSort(arr);
  };

  return (
    <div className={"flex flex-row justify-between  gap-lg p-4 w-full"}>
      <Card className={" w-1/4"}>
        <CardHeader>
          <h2 className={"w-full text-center"}>Generator danych</h2>
        </CardHeader>
        <CardBody className={"flex flex-col gap-lg"}>
          <div className={"flex flex-col gap-lg mb-auto"}>
            <div className={"flex flex-row justify-between"}>
              <p>Takie same dane </p>
              <Switch
                onChange={() =>
                  setDataHaveToBeTheSame((prev) => {
                    console.log(!prev);
                    return !prev;
                  })
                }
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
              />
            </div>
          </div>

          <div
            className={
              "flex flex-col gap-lg w-full justify-end items-end mt-auto p-4"
            }
          >
            <div className={"flex flex-row gap-lg"}>
              <Button color={"primary"} onPress={handleGenerateData}>
                Wygeneruj dane
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
      <div className={"flex flex-col gap-lg w-3/4"}>
        <Card >
          <CardHeader>
            <h2 className={"text-center w-full"}>Symulatory wydajności</h2>
          </CardHeader>
          <CardBody className={"flex flex-row justify-around"}>
            {benchmarks.map((benchmark, index) => (
              <BenchAlg
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

        <Card >
          <CardHeader>
            <h2 className={"text-center w-full"}>Sterowanie symulacją</h2>
          </CardHeader>
          <CardBody>
            <div className={"flex flex-row justify-end gap-lg p-4"}>
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
                isDisabled={!isValid()}
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

export default Benchmark;