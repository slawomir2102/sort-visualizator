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
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import ChartBox from "../components/chart_box/ChartBox";
import React, { useEffect, useRef, useState } from "react";
import { SortSimulator } from "./simulator/SortSimulator.ts";
import { BubbleSortSimulator } from "./simulator/BubbleSort.ts";
import { QuickSortSimulator } from "./simulator/QuickSort.ts";
import {
  MdDownload,
  MdInfo,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdStop,
} from "react-icons/md";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { sortDirectionType } from "../pages/visualizator/Visualizator.tsx";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Simulator({
  deliveredDataToSort,
  selectedAlgorithm,
  deliveredSortDirection,
}: {
  deliveredDataToSort: number[];
  selectedAlgorithm: string;
  deliveredSortDirection: sortDirectionType;
}) {
  const [dataToSort, setDataToSort] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<number | null>();
  const [stepToGo, setStepToGo] = useState<number>(0);
  const [stepDescription, setStepDescription] = useState<string>("");

  // wizualizator
  const [activeBoxIndexI, setActiveBoxIndexI] = useState<number | null>(null);
  const [activeBoxIndexJ, setActiveBoxIndexJ] = useState<number | null>(null);
  const [pivotIndex, setPivotIndex] = useState<number | undefined>();
  const [rangeDown, setRangeDown] = useState<number | undefined>();
  const [rangeUp, setRangeUp] = useState<number | undefined>();
  const [sortedIndexes, setSortedIndexes] = useState<number[]>([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // animacja
  const [isRunning, setIsRunning] = useState(false);
  const [animationType, setAnimationType] = useState<string>("");
  const [animationSpeed, setAnimationSpeed] = useState<number>(0);
  const forceToStopAnimationRef = useRef<boolean>(false);

  const sortSimulatorRef = useRef<SortSimulator>();

  const iconSize: number = 20;

  const REVERSING = 1;
  const NOTHING = 2;
  const FORWARDING = 3;

  let simulateDirection: number = NOTHING;

  useEffect(() => {
    if (!deliveredDataToSort || deliveredDataToSort.length === 0) return;
    if (!selectedAlgorithm) return;

    let sortSimulator;

    switch (selectedAlgorithm) {
      case "bubbleSort":
        sortSimulator = new BubbleSortSimulator();
        break;
      case "quickSort":
        sortSimulator = new QuickSortSimulator();
        break;
      default:
        sortSimulator = new BubbleSortSimulator();
        break;
    }

    sortSimulator.setData(deliveredDataToSort);

    let sortDirection: boolean;
    if (deliveredSortDirection === "ASCENDING") {
      sortDirection = SortSimulator.ASCENDING;
    } else {
      sortDirection = SortSimulator.DESCENDING;
    }
    console.log(sortDirection);
    sortSimulator.generateSteps(sortDirection);

    sortSimulatorRef.current = sortSimulator;

    setDataToSort(sortSimulator.currentState);
    setCurrentStep(sortSimulator.currentStep);

    const desc = sortSimulator.generateCurrentStateDescription().content;
    setStepDescription(desc);

    highlightCurrentOperation();
  }, []);

  useEffect(() => {
    console.log("Aktualny stan sortedIndexes:", sortedIndexes);
  }, [sortedIndexes]);

  const getSimulator = (callback: (simulator: SortSimulator) => void) => {
    if (!sortSimulatorRef.current) {
      return null;
    }
    callback(sortSimulatorRef.current);
  };

  const handlePrevStep = () => {
    getSimulator((simulator) => {
      simulateDirection = REVERSING;
      simulator.prevStep();
      setCurrentStep(simulator.currentStep);
      highlightCurrentOperation();

      const desc: string = simulator.generateCurrentStateDescription().content;
      setStepDescription(desc);

      setDataToSort(simulator.currentState);
      simulateDirection = NOTHING;
    });
  };

  const handleNextStep = () => {
    getSimulator((simulator) => {
      simulateDirection = FORWARDING;
      simulator.nextStep();
      setCurrentStep(simulator.currentStep);

      highlightCurrentOperation();
      const desc: string = simulator.generateCurrentStateDescription().content;
      setStepDescription(desc);

      setDataToSort(simulator.currentState);
      simulateDirection = NOTHING;
    });
  };

  const handleFirstStep = () => {
    handleGoToStepWithAnimation(0);
  };

  const handleLastStep = () => {
    getSimulator((simulator) => {
      handleGoToStepWithAnimation(simulator.numberOfTotalSteps);
    });
  };

  const handleGoToStepWithAnimation = (stepToGo: number) => {
    getSimulator(async (simulator) => {
      if (isRunning) return;

      setIsRunning(true);

      if (stepToGo > simulator.currentStep) {
        simulateDirection = FORWARDING;
        for (let i = simulator.currentStep; i < stepToGo; i++) {
          if (animationSpeed !== 0) {
            await sleep(animationSpeed);
          }
          if (forceToStopAnimationRef.current) {
            break;
          }
          handleNextStep();
        }
      }

      if (stepToGo < simulator.currentStep) {
        simulateDirection = REVERSING;
        for (let i = simulator.currentStep; i > stepToGo; i--) {
          if (animationSpeed !== 0) {
            await sleep(animationSpeed);
          }
          if (forceToStopAnimationRef.current) {
            break;
          }
          handlePrevStep();
        }
      }

      setIsRunning(false);
      simulateDirection = NOTHING;
    });
  };

  const highlightCurrentOperation = () => {
    getSimulator((simulator) => {
      const currentOperation = simulator.operations[simulator.currentStep];

      setActiveBoxIndexI(currentOperation.leftNumber);
      setActiveBoxIndexJ(currentOperation.rightNumber);

      if (selectedAlgorithm === "quickSort") {
        setRangeDown(currentOperation.rangeDown);
        setRangeUp(currentOperation.rangeUp);
        setPivotIndex(currentOperation.pivot);
      }

      if (simulateDirection == REVERSING) {
        setSortedIndexes((prev) => {
          const updateArray = prev.filter(
            (index) => index !== currentOperation.indexSortedElement,
          );

          return (prev = updateArray);
        });
      }

      if (simulateDirection == FORWARDING) {
        setSortedIndexes((prev: number[]): number[] => {
          if (
            !sortedIndexes.includes(currentOperation.indexSortedElement) &&
            currentOperation.indexSortedElement !== undefined
          ) {
            const updateArray = currentOperation.indexSortedElement;
            return [...prev, updateArray];
          }

          return [...prev];
        });
      }
    });
  };

  const handleDownloadJSONFile = () => {
    if (!sortSimulatorRef.current) return;

    const jsonString = sortSimulatorRef.current.generateJsonFile();
    const blob = new Blob([jsonString], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "simulator.json";

    link.click();

    URL.revokeObjectURL(link.href);
  };

  const handleAnimationTypeChoose = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedAnimationSpeed = e.target.value;

    let animSpeed = 0;

    switch (selectedAnimationSpeed) {
      case "instant":
        animSpeed = 0;
        break;
      case "fast":
        animSpeed = 50;
        break;
      case "slow":
        animSpeed = 150;
        break;
      case "very-slow":
        animSpeed = 200;
        break;
    }
    setAnimationType(selectedAnimationSpeed);
    setAnimationSpeed(animSpeed);
  };

  const handleToStop = async () => {
    forceToStopAnimationRef.current = true;
    await sleep(250);
    forceToStopAnimationRef.current = false;
  };

  const animationTypes = [
    { key: "instant", label: "Błyskawiczna" },
    { key: "fast", label: "Szybka" },
    { key: "slow", label: "Wolna" },
    { key: "very-slow", label: "Bardzo wolna" },
  ];

  return (
    <div className={"w-3/4"}>
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
                      {sortSimulatorRef.current?.originalArray.map(
                        (item, index) => <li key={index}>{item}</li>,
                      )}
                    </ul>

                    <ul className={"flex flex-row gap-md"}>
                      <p className={"font-bold"}>Posortowana tablica:</p>
                      {sortSimulatorRef.current?.sortedArray.map(
                        (item, index) => <li key={index}>{item}</li>,
                      )}
                    </ul>
                  </div>
                  <div className={"flex flex-row gap-md"}>
                    <p className={"font-bold"}>Liczba kroków: </p>
                    {sortSimulatorRef.current?.numberOfTotalSteps}
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
        <div className={"flex flex-row items-end justify-between h-40"}>
          {dataToSort.map((item, index) => {
            const isActiveI = index === activeBoxIndexI;
            const isActiveJ = index === activeBoxIndexJ;

            const isPivot = index === pivotIndex;
            const isRangeDown = index === rangeDown;
            const isRangeUp = index === rangeUp;

            const isSorted = sortedIndexes.includes(index);

            return (
              <ChartBox
                key={index}
                index={index}
                label={item}
                height={item}
                className={`
                
                
                
               
               
                ${isActiveI || (isActiveI && isSorted) ? "!bg-blue-300" : ""}
                ${(isActiveI && isRangeDown) || isRangeDown ? "border-l-4 border-purple-500" : ""}
                ${isActiveI && isRangeDown && isRangeUp ? "border-l-4 border-r-4 border-purple-500" : ""}
                
                ${isActiveJ || (isActiveJ && isSorted) ? "!bg-green-300" : ""}
                ${(isActiveJ && isRangeUp) || isRangeUp ? "border-r-4 border-purple-500" : ""}
                
                
                ${isPivot ? "!bg-amber-500" : ""}
                ${isActiveJ && isRangeUp && isPivot ? "border-r-4 border-purple-500" : ""} 
                
                
                ${isActiveI && isActiveJ && isRangeUp && isRangeDown && isPivot ? "border-l-4 border-r-4 border-purple-500 !bg-cyan-800" : ""}
                
                ${isSorted ? "!bg-pink-200" : ""}
                 
                `}
              />
            );
          })}
        </div>
        <div
          className={"h-10 bg-background-50 rounded-xl p-10 flex items-center"}
        >
          {stepDescription}
        </div>
        <div className={"flex flex-row justify-between"}>
          <Card>
            <CardHeader>
              <h2 className={""}>Sterowanie symulatorem</h2>
            </CardHeader>
            <CardBody className={"flex flex-row justify-evenly gap-lg"}>
              <Button
                color={"primary"}
                isDisabled={isRunning}
                onPress={handleFirstStep}
              >
                <MdKeyboardDoubleArrowLeft size={iconSize} />
                Pierwszy krok
              </Button>

              <Button
                color={"primary"}
                isDisabled={isRunning}
                onPress={handlePrevStep}
              >
                <IoMdArrowRoundBack size={iconSize} /> Poprzedni Krok
              </Button>

              <Button isDisabled={true} disabled={true}>
                {currentStep}
              </Button>

              <Button
                color={"primary"}
                isDisabled={isRunning}
                onPress={handleNextStep}
              >
                Następny krok
                <IoMdArrowRoundForward size={iconSize} />
              </Button>

              <Button
                color={"primary"}
                isDisabled={isRunning}
                onPress={handleLastStep}
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
                Skocz do kroku
                {/*Skocz do kroku [0 - {sortSimulatorRef.current?.numberOfLastStep}*/}
                {/*]*/}
              </p>
              <Input
                type={"number"}
                min={0}
                max={sortSimulatorRef.current?.numberOfLastStep}
                errorMessage={" "}
                onChange={(e) => setStepToGo(Number(e.target.value))}
                className={"max-w-16 max-h-12  relative"}
              />
              <Button
                color={"primary"}
                isDisabled={
                  isRunning ||
                  (stepToGo >= sortSimulatorRef.current?.numberOfLastStep &&
                    stepToGo > 0)
                }
                onPress={() => handleGoToStepWithAnimation(stepToGo)}
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
                selectedKeys={[animationType]}
                onChange={handleAnimationTypeChoose}
              >
                {animationTypes.map((animation) => (
                  <SelectItem key={animation.key}>{animation.label}</SelectItem>
                ))}
              </Select>
              <Button
                isDisabled={forceToStopAnimationRef.current}
                color={"primary"}
                onPress={handleToStop}
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
                isDisabled={isRunning}
                onPress={handleDownloadJSONFile}
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
  );
}