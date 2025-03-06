import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Switch,
  useDisclosure,
} from "@nextui-org/react";

import React, { useEffect, useState } from "react";

import { Simulator } from "../../logic/simulator/Simulator.tsx";

import { Generator } from "../../logic/simulator/Generator.ts";
import { MdInfo } from "react-icons/md";
import PopoverWrapper from "../../components/popover_wrapper/PopoverWrapper.tsx";
import BlurOverlay from "../../components/blur_overlay/BlurOverlay.tsx";
import {
  AlgorithmsNames,
  simulators,
  SortDirection,
} from "../../logic/simulator/SimulatorTypes.ts";

export type sortDirectionType = "ASCENDING" | "DESCENDING";

const VisualizerPage = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [simulate, setSimulate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortType, setSortType] = useState<AlgorithmsNames | "">("");
  const [isChoosedSortAlgoritm, setIsChoosedSortAlgoritm] = useState(false);
  const [numberOfElements, setNumberOfElements] = useState<number>(4);
  const [fromNumber, setFromNumber] = useState<number>(0);
  const [toNumber, setToNumber] = useState<number>(0);
  const [manualDataInputValues, setManualDataInputValues] = useState<
    Array<string>
  >(Array(numberOfElements).fill(""));
  const [dataToSort, setdataToSort] = useState<number[]>([]);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.ASCENDING,
  );

  // let dataToSort: number[] = [];
  useEffect(() => {
    checkIsArrayIsNotEmpty();
  }, [manualDataInputValues]);

  const handleSetNumberOfElements = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let _numberOfElements = Number(e.target.value);
    if (_numberOfElements > 20) {
      _numberOfElements = 20;
    }
    setNumberOfElements(_numberOfElements);
  };

  const handleFromNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _fromNumber = Number(e.target.value);
    if (_fromNumber > 150) _fromNumber = 150;
    setFromNumber(_fromNumber);
  };

  const handleToNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _toNumber = Number(e.target.value);
    if (_toNumber > 150) _toNumber = 150;
    setToNumber(_toNumber);
  };

  const handleSimulationClick = () => {
    setIsLoading(true);

    const numbers = manualDataInputValues
      .map((str) => (str.trim() !== "" ? Number(str) : NaN))
      .filter((num) => !isNaN(num)); // Filtruj tylko poprawne liczby

    const isValid = numbers.length === manualDataInputValues.length;

    if (isValid) {
      setdataToSort(numbers); // Update the state with valid numbers
    }

    setTimeout(() => {
      setSimulate(true);
      setIsLoading(false);
    }, 500);
  };
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSimulator = e.target.value;

    setSortType(selectedSimulator as AlgorithmsNames);

    if (selectedSimulator.length <= 0) {
      setIsChoosedSortAlgoritm(false);
      return;
    }
    setIsChoosedSortAlgoritm(true);
  };

  function handleManualDataFromUserChange(index: number, value: string) {
    const updatedValues = [...manualDataInputValues];
    updatedValues[index] = value;
    setManualDataInputValues(updatedValues);
  }

  function handleGenerateRandomNumbers(): void {
    const generator = new Generator();

    const arrayOfRandomData = generator.generateArrayOfRandomData(
      fromNumber,
      toNumber,
      numberOfElements,
    );

    const stringArray = arrayOfRandomData.map((str) => str.toString());

    setManualDataInputValues(stringArray);
  }

  const [isArrayNotEmpty, setIsArrayNotEmpty] = useState<boolean>(false);

  const checkIsArrayIsNotEmpty = () => {
    let counter = 0;
    for (let i = 0; i < manualDataInputValues.length; i++) {
      if (manualDataInputValues[i] !== "") {
        counter++;
      }
    }
    if (counter === manualDataInputValues.length) {
      setIsArrayNotEmpty(true);
      return;
    }
    setIsArrayNotEmpty(false);
    return;
  };

  function handleEraseData(): void {
    const arr: string[] = [];
    for (let i = 0; i < manualDataInputValues.length; i++) {
      arr[i] = "";
    }
    setManualDataInputValues(arr);
  }

  const [isBlurActive, setIsBlurActive] = useState(false);
  const [isSecondBlurActive, setIsSecondBlurActive] = useState(false);

  return (
    <div
      className={"flex w-full  flex-row justify-center gap-xl p-4 h-[85svh]"}
    >
      <BlurOverlay
        isVisible={isBlurActive}
        setIsBlurActive={setIsBlurActive}
        title={"Pomoc uruchomienia symulatora"}
      />
      <BlurOverlay
        isVisible={isSecondBlurActive}
        setIsBlurActive={setIsSecondBlurActive}
        title={"Pomoc sterowania symulatorem"}
      />
      <Card className={"w-1/4 relative"}>
        <Button
          onPress={() => {
            setIsBlurActive((prev) => !prev);
          }}
          color={"primary"}
          className={
            " absolute top-5 right-5 z-20 flex flex-row gap-xl items-center justify-center"
          }
        >
          Pomoc <MdInfo color={"white"} size={20} />
        </Button>

        <CardHeader className={"flex items-center justify-center"}>
          <h2>Opcje</h2>
        </CardHeader>
        <CardBody className={"flex flex-col items-center gap-lg "}>
          <div className={"flex flex-col gap-lg w-full py-4"}>
            <div className={"flex flex-col w-full gap-lg"}>
              <div
                className={"flex flex-row items-center justify-between gap-xl"}
              >
                <p>Algorytm sortujący:</p>

                <PopoverWrapper
                  content={
                    "Lista dostępnych algorytmów, jeżeli chcesz uruchomić symulacje musisz wybrać jeden z wylistowanych. Po zmianie algorytmu nie trzeba odświeżać symulacji."
                  }
                  isVisible={isBlurActive}
                  ariaLabel={"selected_algorithm"}
                >
                  <Select
                    placeholder="Wybierz algorytm"
                    selectedKeys={[sortType]}
                    onChange={handleSelectionChange}
                  >
                    {simulators.map((simulator) => (
                      <SelectItem key={simulator.key}>
                        {simulator.label}
                      </SelectItem>
                    ))}
                  </Select>
                </PopoverWrapper>
              </div>

              <div
                className={"flex flex-row items-center justify-between gap-xl"}
              >
                <p>Kierunek sortowania: </p>

                <PopoverWrapper
                  content={
                    "Tutaj możesz ustawić kierunek sortowania, aby zmiana została zastosowana musisz kliknąć przycisk symulacji"
                  }
                  isVisible={isBlurActive}
                  ariaLabel={"sort_direction_switch"}
                >
                  <div className={"flex flex-row-reverse items-center gap-xl"}>
                    <Switch
                      defaultSelected
                      size="md"
                      onChange={() => {
                        if (sortDirection === SortDirection.ASCENDING) {
                          setSortDirection(SortDirection.DESCENDING);
                        } else {
                          setSortDirection(SortDirection.ASCENDING);
                        }
                      }}
                    />
                    {sortDirection === SortDirection.ASCENDING ? (
                      <p>Rosnąco</p>
                    ) : null}
                    {sortDirection === SortDirection.DESCENDING ? (
                      <p>Malejąco</p>
                    ) : null}
                  </div>
                </PopoverWrapper>
              </div>
            </div>

            <div
              className={"flex flex-row items-center justify-between gap-xl "}
            >
              <p>Dane do sortowania:</p>

              <div className={"flex flex-row items-center justify-end gap-lg"}>
                <PopoverWrapper
                  content={
                    "Przycisk przenoszący do okienka, w którym możemy uzupełnić dane wejściowe do symulacji"
                  }
                  isVisible={isBlurActive}
                  ariaLabel={"data_accept_button"}
                >
                  <Button onPress={onOpen}>Uzupełnij dane</Button>
                </PopoverWrapper>
              </div>

              <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Formularz danych
                      </ModalHeader>
                      <ModalBody className={"flex flex-col gap-lg"}>
                        <div className={"flex flex-col gap-lg"}>
                          <div
                            className={
                              "flex flex-row items-center justify-between w-full"
                            }
                          >
                            <p>Ilość elementów [4 - 20]:</p>

                            <Input
                              type={"number"}
                              defaultValue={
                                numberOfElements
                                  ? numberOfElements.toString()
                                  : "4"
                              }
                              min={4}
                              max={20}
                              className={"max-w-20"}
                              value={numberOfElements.toString()}
                              onChange={handleSetNumberOfElements}
                            />
                          </div>

                          <p className={"text-center font-medium"}>
                            Generator losowych danych
                          </p>
                          <div
                            className={
                              "flex flex-row items-center justify-between w-full"
                            }
                          >
                            <p>Dolny zakres [0 - 150]:</p>
                            <Input
                              type={"number"}
                              defaultValue={"0"}
                              value={fromNumber.toString()}
                              min={0}
                              max={150}
                              className={"max-w-20"}
                              onChange={handleFromNumber}
                            />
                          </div>

                          <div
                            className={
                              "flex flex-row items-center justify-between w-full"
                            }
                          >
                            <p>Górny zakres [0 - 150]:</p>
                            <Input
                              type={"number"}
                              defaultValue={"0"}
                              value={toNumber.toString()}
                              min={0}
                              max={150}
                              className={"max-w-20"}
                              onChange={handleToNumber}
                            />
                          </div>
                          <div className={"flex flex-row justify-end"}>
                            <Button onPress={handleEraseData}>Wyczyść</Button>
                            <Button onPress={handleGenerateRandomNumbers}>
                              Generuj
                            </Button>
                          </div>
                        </div>
                        <div
                          className={
                            "flex flex-row gap-xl flex-wrap justify-center"
                          }
                        >
                          {Array.from({ length: numberOfElements }).map(
                            (_, index) => (
                              <Input
                                type={"number"}
                                min={0}
                                max={150}
                                key={index}
                                placeholder={`${index}`}
                                errorMessage={" "}
                                value={manualDataInputValues[index]}
                                onChange={(e) =>
                                  handleManualDataFromUserChange(
                                    index,
                                    e.target.value,
                                  )
                                }
                                className={"max-w-16 max-h-16 basis-1/6 flex "}
                              ></Input>
                            ),
                          )}
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          Anuluj
                        </Button>
                        <Button
                          color="primary"
                          onPress={onClose}
                          isDisabled={!isArrayNotEmpty}
                        >
                          Zaakceptuj dane
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
            <PopoverWrapper
              content={
                "Przcisk startujący symulacje. Aby symulacja mogła wystartować muszą być uzupełnione dane oraz wybrany algorytm sortowania"
              }
              isVisible={isBlurActive}
              ariaLabel={"sim_start_button"}
            >
              <Button
                className={"w-full"}
                isDisabled={!isChoosedSortAlgoritm || !isArrayNotEmpty}
                onPress={handleSimulationClick}
              >
                Symuluj
              </Button>
            </PopoverWrapper>
          </div>
        </CardBody>
      </Card>

      <Card className={"w-3/4"}>
        <CardHeader className={"flex items-center justify-center"}>
          <h2>Symulator {sortType}</h2>
          <Button
            onPress={() => {
              setIsSecondBlurActive((prev) => !prev);
            }}
            color={"primary"}
            className={
              " absolute top-5 right-5 z-30 flex flex-row gap-xl items-center justify-center"
            }
          >
            Pomoc <MdInfo color={"white"} size={20} />
          </Button>
        </CardHeader>
        <CardBody
          className={
            "w-full flex flex-row items-center overflow-hidden scrollbar-hide"
          }
        >
          <div className={"w-full flex items-center justify-center"}>
            {!simulate && !isLoading && <div>nie wybrano typu symulatora</div>}

            {isLoading && <Spinner size={"lg"} />}
            {simulate && !isLoading && (
              <PopoverWrapper
                content={"Tutaj znajduje się okno symulacji"}
                isVisible={isBlurActive}
                ariaLabel={"sim_window"}
              >
                <Simulator
                  deliveredDataToSort={dataToSort}
                  selectedAlgorithm={sortType}
                  deliveredSortDirection={sortDirection}
                  deliveredIsSecondBlurActive={isSecondBlurActive}
                />
              </PopoverWrapper>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
export default VisualizerPage;