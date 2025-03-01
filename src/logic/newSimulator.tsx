import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";

import { useEffect } from "react";

import {
  MdDownload,
  MdInfo,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdStop,
} from "react-icons/md";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { sortDirectionType } from "../pages/visualizator/Visualizator.tsx";

import { BubbleSort } from "./simulator_new/BubbleSort.ts";
import { InsertionSort } from "./simulator_new/InsertionSort.ts";

import { useSimulator } from "./simulator_new/SimulatorContext.tsx";
import { BubbleSortVisualizator } from "./BubbleSortVisualizator.tsx";
import { animationList } from "./simulator_new/SimulatorTypes.ts";
import { InsertionSortVisualizator } from "./InsertionSortVisualizator.tsx";

export function NewSimulator({
  deliveredDataToSort,
  selectedAlgorithm,
  deliveredSortDirection,
}: {
  deliveredDataToSort: number[];
  selectedAlgorithm: string;
  deliveredSortDirection: sortDirectionType;
}) {
  const { simulator, setSimulator, simContext } = useSimulator();

  useEffect(() => {
    if (!deliveredDataToSort) return; // upewnij się, że dane są dostępne
    let sim: BubbleSort | InsertionSort;

    switch (selectedAlgorithm) {
      case "bubbleSort":
        sim = new BubbleSort();
        break;
      case "insertionSort":
        sim = new InsertionSort();
        break;
      default:
        sim = new BubbleSort();
        break;
    }

    sim.setData(deliveredDataToSort);
    sim.generateSimulatorSteps();

    simContext.setSimDataToSort(deliveredDataToSort);

    setSimulator(sim);

    console.log(sim.operations);
  }, [deliveredDataToSort, selectedAlgorithm]);

  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  if (!simulator) {
    return <div>nie dziala</div>;
  }

  const iconSize = 20;

  return (
    <div className={"w-full p-4"}>
      {simulator ? (
        <div className={"w-full p-4"}>
          <div className={"flex flex-col gap-xl  justify-center "}>
            {" "}
            <Modal size={"2xl"} isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="gap-1 flex flex-col">
                      Szczegóły sortowania
                    </ModalHeader>
                    <ModalBody>
                      <div>
                        <ul className={"flex flex-row gap-md"}>
                          <p className={"font-bold"}>Oryginalna tablica:</p>
                          {simulator.getOriginalArray.map(
                            (item: number, index: number) => (
                              <li key={index}>{item}</li>
                            ),
                          )}
                        </ul>

                        <ul className={"flex flex-row gap-md"}>
                          <p className={"font-bold"}>Posortowana tablica:</p>
                          {simulator.getSortedArray.map(
                            (item: number, index: number) => (
                              <li key={index}>{item}</li>
                            ),
                          )}
                        </ul>
                      </div>
                      <div className={"flex flex-row gap-md"}>
                        <p className={"font-bold"}>Liczba kroków: </p>
                        {simulator.getNumberOfLastStep}
                      </div>
                      <div className={"flex flex-row gap-md"}></div>
                      <Divider orientation="horizontal" />
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Zamknij
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
            <div className={"flex flex-row items-end justify-center h-40"}>
              {selectedAlgorithm == "bubbleSort" ? (
                <BubbleSortVisualizator />
              ) : null}

              {selectedAlgorithm == "insertionSort" ? (
                <InsertionSortVisualizator />
              ) : null}
            </div>
            <div
              className={
                "h-10 bg-background-50 rounded-xl p-10 flex items-center"
              }
            >
              {simContext.stepDescription}
            </div>
            <div className={"flex flex-row justify-between"}>
              <Card>
                <CardHeader>
                  <h2 className={""}>Sterowanie symulatorem</h2>
                </CardHeader>
                <CardBody className={"flex flex-row justify-evenly gap-lg"}>
                  <Button
                    color={"primary"}
                    isDisabled={simContext.simIsRunning}
                    onPress={simContext.firstStep}
                  >
                    <MdKeyboardDoubleArrowLeft size={iconSize} />
                    Pierwszy krok
                  </Button>

                  <Button
                    color={"primary"}
                    isDisabled={simContext.simIsRunning}
                    onPress={simContext.prevStep}
                  >
                    <IoMdArrowRoundBack size={iconSize} /> Poprzedni Krok
                  </Button>

                  <Button isDisabled={true}>{simContext.simCurrentStep}</Button>

                  <Button
                    color={"primary"}
                    isDisabled={simContext.simIsRunning}
                    onPress={simContext.nextStep}
                  >
                    Następny krok
                    <IoMdArrowRoundForward size={iconSize} />
                  </Button>

                  <Button
                    color={"primary"}
                    isDisabled={simContext.simIsRunning}
                    onPress={simContext.lastStep}
                  >
                    Ostatni krok
                    <MdKeyboardDoubleArrowRight size={iconSize} />
                  </Button>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <h2>Skoczek</h2>
                </CardHeader>
                <CardBody
                  className={"flex flex-row justify-evenly items-center gap-lg"}
                >
                  <p>
                    Skocz do kroku Skocz do kroku [0 -{" "}
                    {simulator.getNumberOfLastStep}]
                  </p>
                  <Input
                    type={"number"}
                    min={0}
                    max={simulator.getNumberOfLastStep}
                    errorMessage={" "}
                    onChange={(e) =>
                      simContext.setSimStepToGo(Number(e.target.value))
                    }
                    className={"max-w-16 max-h-12  relative"}
                  />
                  <Button
                    color={"primary"}
                    isDisabled={
                      simContext.simIsRunning ||
                      (simContext.simStepToGo > simulator.getNumberOfLastStep &&
                        simContext.simStepToGo > 0)
                    }
                    onPress={() => simContext.goToStep(simContext.simStepToGo)}
                  >
                    Skocz
                  </Button>
                </CardBody>
              </Card>
            </div>
            <div className={"flex flex-row justify-between "}>
              <Card className={"w-1/2"}>
                <CardHeader>
                  <h2>Sterowanie animacją</h2>
                </CardHeader>
                <CardBody className={"flex flex-row items-center gap-x-lg"}>
                  <Select
                    label="Wybierz szybkość animacji"
                    defaultSelectedKeys={["instant"]}
                    selectedKeys={[simContext.simAnimationType]}
                    onChange={simContext.animationTypeChoose}
                  >
                    {animationList.map((animation) => (
                      <SelectItem key={animation.key}>
                        {animation.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Button
                    isDisabled={simContext.simForceStopRef.current}
                    color={"primary"}
                    onPress={simContext.stopAnimation}
                  >
                    Stop
                    <MdStop size={iconSize} />
                  </Button>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <h2>Zrzut symulacji</h2>
                </CardHeader>
                <CardBody className={"flex flex-row items-center  gap-lg"}>
                  <p>Wygeneruj plik json z listami kroków</p>
                  <Button
                    color={"primary"}
                    isDisabled={simContext.simIsRunning}
                    onPress={simulator.generateJSONFile}
                  >
                    Zapisz
                    <MdDownload size={iconSize} />
                  </Button>

                  <Button color={"primary"} onPress={onOpen}>
                    Info
                    <MdInfo size={iconSize} />
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div>brak zmiennej simulator</div>
      )}
    </div>
  );
}