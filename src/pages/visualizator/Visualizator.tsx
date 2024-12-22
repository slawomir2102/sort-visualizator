import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";

import React, { useState } from "react";

import Simulator from "../../logic/Simulator";

const Visualizator = () => {
  const simulators = [
    { key: "bubbleSort", label: "Bubble Sort" },
    { key: "quickSort", label: "Quick Sort" },
  ];

  const [simulate, setSimulate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [sortType, setSortType] = useState("");
  const [isChoosedSortAlgoritm, setIsChoosedSortAlgoritm] = useState(false);

  const [numberOfElements, setNumberOfElements] = useState<number>(4);
  const [fromNumber, setFromNumber] = useState<number>(0);
  const [toNumber, setToNumber] = useState<number>(0);

  const handleSetNumberOfElements = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const _numberOfElements = e.target.value;

    setNumberOfElements(_numberOfElements);
  };

  const handleFromNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _fromNumber = e.target.value;
    setFromNumber(_fromNumber);
  };

  const handleToNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _toNumber = e.target.value;
    setToNumber(_toNumber);
  };

  const handleSimulationClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSimulate(true);
      setIsLoading(false);
    }, 500);
  };
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSimulator = e.target.value;

    setSortType(selectedSimulator);
    if (selectedSimulator.length <= 0) {
      setIsChoosedSortAlgoritm(false);
      return;
    }
    setIsChoosedSortAlgoritm(true);
  };

  return (
    <div className={"flex w-full h-full flex-row justify-center gap-xl p-4"}>
      <Card className={"w-1/4"}>
        <CardHeader className={"flex items-center justify-center"}>
          <h2>Opcje</h2>
        </CardHeader>
        <CardBody className={"flex flex-col items-center gap-lg "}>
          <div className={"flex flex-col gap-lg w-full p-4"}>
            <p>Generator danych wejściowych</p>

            <div className={"flex flex-col items-center gap-xl "}>
              <div
                className={"flex flex-row items-center justify-between w-full"}
              >
                <p>Dolny zakres:</p>
                <Input
                  type={"number"}
                  defaultValue={"0"}
                  min={"0"}
                  max={"999"}
                  className={"max-w-20"}
                  onChange={handleFromNumber}
                />
              </div>

              <div
                className={"flex flex-row items-center justify-between w-full"}
              >
                <p>Górny zakres:</p>
                <Input
                  type={"number"}
                  defaultValue={"0"}
                  min={"0"}
                  max={"999"}
                  className={"max-w-20"}
                  onChange={handleToNumber}
                />
              </div>
            </div>

            <div
              className={"flex flex-row items-center justify-between gap-xl"}
            >
              <p>Ilość elementów:</p>

              <Input
                type={"number"}
                defaultValue={"4"}
                min={"4"}
                max={"20"}
                className={"max-w-20"}
                onChange={handleSetNumberOfElements}
              />
            </div>

            <p>Dane wejściowe:</p>

            <Input />
            <Select
              label="Select Sorting Algorithm"
              placeholder="Wybierz algorytm"
              selectedKeys={[sortType]}
              onChange={handleSelectionChange}
            >
              {simulators.map((simulator) => (
                <SelectItem key={simulator.key}>{simulator.label}</SelectItem>
              ))}
            </Select>
            <Button
              disabled={!isChoosedSortAlgoritm}
              onPress={handleSimulationClick}
            >
              Symuluj
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card className={"w-3/4"}>
        <CardHeader className={"flex items-center justify-center"}>
          <h2>Symulator {sortType}</h2>
        </CardHeader>
        <CardBody className={"flex flex-row items-center gap-lg "}>
          <div className={"flex w-full items-center justify-center"}>
            {!simulate && !isLoading && <div>nie wybrano typu symulatora</div>}

            {isLoading && <Spinner size={"lg"} />}
            {simulate && !isLoading && (
              <Simulator
                numberOfElements={numberOfElements}
                fromNumber={fromNumber}
                toNumber={toNumber}
                selectedAlgorithm={sortType}
              />
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
export default Visualizator;
