import {
  Button,
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
} from "react-icons/md";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { Generator } from "./simulator/Generator.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Simulator({
  numberOfElements = 4,
  fromNumber,
  toNumber,
  selectedAlgorithm,
}: {
  numberOfElements: number;
  fromNumber: number;
  toNumber: number;
  selectedAlgorithm: string;
}) {
  const [dataToSort, setDataToSort] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<number | null>();
  const [stepToGo, setStepToGo] = useState<number>(0);
  const [stepDescription, setStepDescription] = useState<string>("");

  const [activeBoxIndexI, setActiveBoxIndexI] = useState<number | null>(null);
  const [activeBoxIndexJ, setActiveBoxIndexJ] = useState<number | null>(null);
  const [pivotIndex, setPivotIndex] = useState<number | undefined>();
  const [rangeDown, setRangeDown] = useState<number | undefined>();
  const [rangeUp, setRangeUp] = useState<number | undefined>();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isRunning, setIsRunning] = useState(false);
  const [animationType, setAnimationType] = useState<string>("");
  const [animationSpeed, setAnimationSpeed] = useState<number>(0);
  const forceToStopAnimationRef = useRef<boolean>(false);

  const [elementIsSorted, setElementIsSorted] = useState<boolean>(false);
  const [sortedIndexes, setSortedIndexes] = useState<number[]>([]);

  const sortSimulatorRef = useRef<SortSimulator>();

  const iconSize: number = 20;

  const REVERSING = 1;
  const NOTHING = 2;
  const FORWARDING = 3;

  let simulateDirection: number = NOTHING;

  useEffect(() => {
    if (!selectedAlgorithm) return;

    let sortSimulator;
    const generator = new Generator();

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

    sortSimulatorRef.current = sortSimulator;

    const data = generator.generateArrayOfRandomData(
      fromNumber,
      toNumber,
      numberOfElements,
    );
    sortSimulator.setData(data);
    sortSimulator.generateSteps();
    // console.log(sortSimulator.sortWithoutSteps());
    // console.log(sortSimulator.numberOfTotalSteps);

    setDataToSort(sortSimulator.currentState);
    setCurrentStep(sortSimulator.currentStep);

    highlightCurrentOperation();
  }, []);

  useEffect(() => {
    console.log("Aktualny stan sortedIndexes:", sortedIndexes);
  }, [sortedIndexes]);

  if (numberOfElements > 20)
    return (
      <div>
        <p>
          Za dużo elementów. Do wizualizacji maksymalnie musi być 16 elementów
        </p>
      </div>
    );

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

      setStepDescription(
        simulator.generateCurrentStateDescription(simulator.currentStep),
      );

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
      setStepDescription(
        simulator.generateCurrentStateDescription(simulator.currentStep),
      );

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
      // console.log(simulator.currentStep);
      // console.log(simulator.operations.length);
      // console.log(simulator.operations[simulator.operations.length]);
      // console.log(simulator.operations[simulator.operations.length - 1]);
      setIsRunning(false);
      simulateDirection = NOTHING;
    });
  };

  const highlightCurrentOperation = () => {
    getSimulator((simulator) => {
      const currentOperation = simulator.operations[simulator.currentStep];

      if (
        !currentOperation.leftNumber ||
        currentOperation.rightNumber ||
        currentOperation.pivot !== undefined ||
        currentOperation.rangeDown !== undefined ||
        currentOperation.rangeUp !== undefined
      ) {
        resetHighlight();
      }

      setActiveBoxIndexI(currentOperation.leftNumber);
      setActiveBoxIndexJ(currentOperation.rightNumber);
      setRangeDown(currentOperation.rangeDown);
      setRangeUp(currentOperation.rangeUp);
      setPivotIndex(currentOperation.pivot);

      if (currentOperation.indexSortedElement === undefined) {
        return;
      }

      if (simulateDirection == REVERSING) {
        setSortedIndexes((prev) => {
          return prev.filter(
            (index) => index !== currentOperation.indexSortedElement,
          );
        });
      }
      if (simulateDirection == FORWARDING) {
        setSortedIndexes((prev) => {
          return prev.includes(currentOperation.indexSortedElement)
            ? prev
            : [...prev, currentOperation.indexSortedElement];
        });
      }

      setElementIsSorted(currentOperation.indexSortedElement);
    });
  };

  // Helper function to reset highlights
  const resetHighlight = () => {
    setActiveBoxIndexI(null);
    setActiveBoxIndexJ(null);
    setRangeDown(undefined);
    setRangeUp(undefined);
    setPivotIndex(undefined);
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
      <div className={"flex flex-col gap-xl  justify-center"}>
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
        <div className={"flex flex-row items-end justify-between "}>
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
                
                
                
               
               
                ${isActiveI ? "!bg-blue-300" : ""}
                ${(isActiveI && isRangeDown) || isRangeDown ? "border-l-4 border-purple-500" : ""}
                ${isActiveI && isRangeDown && isRangeUp ? "border-l-4 border-r-4 border-purple-500" : ""}
                
                ${isActiveJ ? "!bg-green-300" : ""}
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
        <div className={"flex flex-row justify-evenly gap-lg"}>
          <Button
            color={"primary"}
            isDisabled={isRunning}
            onPress={handleFirstStep}
          >
            <MdKeyboardDoubleArrowLeft size={iconSize} />
          </Button>

          <Button
            color={"primary"}
            isDisabled={isRunning}
            onPress={handlePrevStep}
          >
            <IoMdArrowRoundBack size={iconSize} />
          </Button>

          <Button isDisabled={true} disabled={true}>
            {currentStep}
          </Button>

          <Button
            color={"primary"}
            isDisabled={isRunning}
            onPress={handleNextStep}
          >
            <IoMdArrowRoundForward size={iconSize} />
          </Button>

          <Button
            color={"primary"}
            isDisabled={isRunning}
            onPress={handleLastStep}
          >
            <MdKeyboardDoubleArrowRight size={iconSize} />
          </Button>

          <Button
            isDisabled={forceToStopAnimationRef.current}
            color={"primary"}
            onPress={handleToStop}
          >
            Stop
          </Button>
        </div>
        <div className={"flex flex-row items-center justify-between gap-lg"}>
          <p>
            Przejdź do kroku [0 - {sortSimulatorRef.current?.numberOfLastStep}]
          </p>
          <Input
            onChange={(e) => setStepToGo(Number(e.target.value))}
            className={"max-w-16"}
          />
          <Button
            color={"primary"}
            isDisabled={isRunning}
            onPress={() => handleGoToStepWithAnimation(stepToGo)}
          >
            Przejdź
          </Button>
          <Button
            onPress={() => {
              console.log(sortSimulatorRef.current?.currentState);
              console.log(
                sortSimulatorRef.current?.currentStep,
                " z ",
                sortSimulatorRef.current?.numberOfLastStep,
              );
            }}
          >
            cos
          </Button>
        </div>
        <div className={"flex flex-row items-center justify-between"}>
          <Select
            className={"max-w-52"}
            label="Wybierz szybkość animacji"
            defaultSelectedKeys={["instant"]}
            selectedKeys={[animationType]}
            onChange={handleAnimationTypeChoose}
          >
            {animationTypes.map((animation) => (
              <SelectItem key={animation.key}>{animation.label}</SelectItem>
            ))}
          </Select>
          <Button color={"primary"} onPress={onOpen}>
            <MdInfo size={iconSize} />
          </Button>
        </div>
        <div>
          <Textarea label="Opis" disabled={true} value={stepDescription} />
        </div>
        <div className={"flex flex-row items-center justify-between gap-lg"}>
          <p>Wygeneruj plik json z listami kroków</p>
          <Button
            color={"primary"}
            isDisabled={isRunning}
            onPress={handleDownloadJSONFile}
          >
            <MdDownload size={iconSize} />
            Zapisz
          </Button>
        </div>
      </div>
    </div>
  );
}
