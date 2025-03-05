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

import {useEffect, useState} from "react";

import {
  MdDownload,
  MdInfo,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdStop,
} from "react-icons/md";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { BubbleSort } from "./bubble_sort/BubbleSort.ts";
import { InsertionSort } from "./insertion_sort/InsertionSort.ts";
import { useSimulator } from "./SimulatorContext.tsx";
import { BubbleSortVisualizer } from "./bubble_sort/BubbleSortVisualizer.tsx";
import {animationList, Simulators, SortDirection} from "./SimulatorTypes.ts";
import { InsertionSortVisualizer } from "./insertion_sort/InsertionSortVisualizer.tsx";
import {SelectionSort} from "./selection_sort/SelectionSort.ts";
import {SelectionSortVisualizer} from "./selection_sort/SelectionSortVisualizer.tsx";
import {QuickSortVisualizer} from "./quick_sort/QuickSortVisualizer.tsx";
import {QuickSort} from "./quick_sort/QuickSort.ts";
import BlurOverlay from "../../components/blur_overlay/BlurOverlay.tsx";
import PopoverWrapper from "../../components/popover_wrapper/PopoverWrapper.tsx";
import {isBezierDefinition} from "framer-motion";

export function Simulator({
                               deliveredDataToSort,
                               selectedAlgorithm,
                               deliveredSortDirection,
                            deliveredIsSecondBlurActive,
                             }: {
  deliveredDataToSort: number[];
  selectedAlgorithm: string;
  deliveredSortDirection: SortDirection;
  deliveredIsSecondBlurActive: boolean;
}) {
  const { simulator, setSimulator, simContext } = useSimulator();

  useEffect(() => {
    setIsSecondBlurActive(deliveredIsSecondBlurActive)

    if (!deliveredDataToSort) return; // upewnij się, że dane są dostępne
    let sim: Simulators;

    switch (selectedAlgorithm) {
      case "bubbleSort":
        sim = new BubbleSort();
        break;
      case "insertionSort":
        sim = new InsertionSort();
        break;
      case "selectionSort":
        sim = new SelectionSort();
        break;
      case "quickSort":
        sim = new QuickSort();
        break;
      default:
        sim = new BubbleSort();
        break;
    }

    sim.setData(deliveredDataToSort);
    sim.setSortDirection(deliveredSortDirection)
    sim.generateSimulatorSteps();
    simContext.setSimDataToSort(deliveredDataToSort);
    setSimulator(sim);
  }, [deliveredDataToSort, selectedAlgorithm]);

  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [isSecondBlurActive, setIsSecondBlurActive] = useState(false);

  if (!simulator) {
    return <div>nie dziala</div>;
  }

  const iconSize = 20;

  return (
      <div className={"w-full relative"}>

        {simulator ? (
            <div className={"w-full"}>
              <div className={"w-full flex flex-col gap-y-xl"}>
                {" "}
                <Modal size={"4xl"} isOpen={isOpen} onOpenChange={onOpenChange}>
                  <ModalContent>
                    {(onClose) => (
                        <>
                          <ModalHeader className="gap-1 flex flex-col">
                            Szczegóły sortowania
                          </ModalHeader>
                          <ModalBody>
                            <div className={'flex flex-col gap-xl'}>
                              <ul className={"flex flex-col  gap-md"}>
                                <p className={"font-bold w-full"}>Oryginalna tablica:</p>
                                <div className={'flex w-full justify-between flex-wrap'}>


                                {simulator.getOriginalArray.map(
                                    (item: number, index: number) => (
                                        <div className={'flex-[1_0_10%] flex flex-col justify-center items-center hover:bg-amber-200 p-2 rounded-xl'}>
                                        <Button isDisabled={true} className={'min-w-4 !text-black'} key={index}>{item}</Button>
                                          <p>{index}</p>
                                        </div>
                                    ),
                                )}
                                </div>
                              </ul>

                              <ul className={"flex flex-col gap-md"}>
                                <p className={"font-bold w-full"}>Posortowana tablica:</p>
                                <div className={'flex w-full justify-between flex-wrap'}>


                                  {simulator.getSortedArray.map(
                                      (item: number, index: number) => (
                                          <div className={'flex-[1_0_10%] flex flex-col justify-center items-center hover:bg-amber-200 p-2 rounded-xl'}>
                                            <Button isDisabled={true} className={'min-w-4 !text-black'} key={index}>{item}</Button>
                                            <p>{index}</p>
                                          </div>
                                      ),
                                  )}
                                </div>
                              </ul>
                            </div>
                            <div className={"flex flex-row gap-md"}>
                              <p className={"font-bold"}>Liczba kroków: </p>
                              {simulator.getNumberOfLastStep}
                            </div>
                            <div className={"flex flex-row gap-md"}>
                              <p className={"font-bold"}>Liczba zamian: </p>
                            </div>
                            <div className={"flex flex-row gap-md"}>
                              <p className={"font-bold"}>Liczba kroków bez zamian: </p>
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
                <PopoverWrapper placement={'top'} content={"Plansza z animowanymi elementami reprezentującymi dane w tablicy"} isVisible={deliveredIsSecondBlurActive} ariaLabel={"sort_board"}>
                <div className={"flex flex-row items-end justify-center h-40"}>

                  {selectedAlgorithm == "bubbleSort" ? (
                      <BubbleSortVisualizer key={`bubble-${deliveredDataToSort.join('-')}`} />
                  ) : null}

                  {selectedAlgorithm == "insertionSort" ? (
                      <InsertionSortVisualizer key={`insertion-${deliveredDataToSort.join('-')}`} />
                  ) : null}

                  {selectedAlgorithm == "selectionSort" ? (
                      <SelectionSortVisualizer key={`selection-${deliveredDataToSort.join('-')}`} />
                  ) : null}

                  {selectedAlgorithm == "quickSort" ? (
                      <QuickSortVisualizer key={`quick-${deliveredDataToSort.join('-')}`} />
                  ) : null}

                </div>
                </PopoverWrapper>
                <PopoverWrapper placement={"top"} content={"Opisy każdego kroku sortowania"} isVisible={deliveredIsSecondBlurActive} ariaLabel={"step_desc"}>
                <div
                    className={
                      "h-10 bg-background-50 rounded-xl p-10 flex items-center"
                    }
                >
                  {simContext.stepDescription}
                </div>
                </PopoverWrapper>

                <div className={"flex flex-row justify-between"}>

                  <Card>
                    <PopoverWrapper placement={'top'} content={"Główny panel sterowania symulacją"} isVisible={deliveredIsSecondBlurActive} ariaLabel={"main_control_sim_panel"}>
                    <CardHeader>
                      <h2 className={""}>Sterowanie symulatorem</h2>
                    </CardHeader>
                    <CardBody className={"flex flex-row justify-evenly gap-lg"}>

                      <PopoverWrapper placement={'top-end'} content={"Przycisk przenoszący do pierwszego kroku"} isVisible={deliveredIsSecondBlurActive} ariaLabel={"first_step_button"}>
                      <Button
                          color={"primary"}
                          isDisabled={simContext.simIsRunning}
                          onPress={simContext.firstStep}
                      >
                        <MdKeyboardDoubleArrowLeft size={iconSize} />
                        Pierwszy krok
                      </Button>
                      </PopoverWrapper>

                      <PopoverWrapper placement={'bottom-end'} content={"Przycisk przenoszący do poprzedniego kroku"} isVisible={deliveredIsSecondBlurActive} ariaLabel={"prev_step_button"}>
                      <Button
                          color={"primary"}
                          isDisabled={simContext.simIsRunning}
                          onPress={simContext.prevStep}
                      >
                        <IoMdArrowRoundBack size={iconSize} /> Poprzedni Krok
                      </Button>

                      </PopoverWrapper>

                      <PopoverWrapper placement={'top'} content={"Wskaźnik na aktualny numer kroku"} isVisible={deliveredIsSecondBlurActive} ariaLabel={"step_number"}>

                      <Button isDisabled={true}>{simContext.simCurrentStep}</Button>
                      </PopoverWrapper>

                      <PopoverWrapper placement={'bottom-start'} content={"Przycisk przenoszący do następnego kroku"} isVisible={deliveredIsSecondBlurActive} ariaLabel={"next_step_button"}>
                      <Button
                          color={"primary"}
                          isDisabled={simContext.simIsRunning}
                          onPress={simContext.nextStep}
                      >
                        Następny krok
                        <IoMdArrowRoundForward size={iconSize} />
                      </Button>
                      </PopoverWrapper>

                      <PopoverWrapper placement={'top-start'} content={"Przycisk przenoszący do ostatniego kroku"} isVisible={deliveredIsSecondBlurActive} ariaLabel={"last_step_button"}>
                      <Button
                          color={"primary"}
                          isDisabled={simContext.simIsRunning}
                          onPress={simContext.lastStep}
                      >
                        Ostatni krok
                        <MdKeyboardDoubleArrowRight size={iconSize} />
                      </Button>
                      </PopoverWrapper>
                    </CardBody>
                    </PopoverWrapper>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className={'flex flex-row justify-between gap-md w-full'}>
                        <p>
                          Skocz do kroku
                        </p>
                        <p>
                          [0 -{" "}{simulator.getNumberOfLastStep}]
                        </p>
                      </div>
                    </CardHeader>
                    <CardBody
                        className={"flex flex-row justify-evenly items-center gap-lg"}
                    >

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
                          onPress={simContext.downloadJSONFile}
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