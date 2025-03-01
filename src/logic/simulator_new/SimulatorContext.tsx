import React, {
  createContext,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Simulator } from "./newSimulator.ts";
import { useDisclosure } from "@nextui-org/react";
import {
  animationType,
  SimAnimationSpeed,
  SimAnimationSpeedType,
  SimDirection,
  SimDirectionType,
} from "./SimulatorTypes.ts";
import { InsertionSort } from "./InsertionSort.ts";
import { BubbleSort } from "./BubbleSort.ts";

interface SimulatorContextType {
  simulator: BubbleSort | InsertionSort | null;
  setSimulator: (simulator: BubbleSort | InsertionSort | null) => void;
  simulatorRef: RefObject<BubbleSort | InsertionSort | null>;
  getSimulator: (callback: (simulator: Simulator) => void) => void;

  setSimDataToSort: (arr: number[]) => void;
  simDataToSort: number[];
  setSimStepToGo: (step: number) => void;
  simStepToGo: number;
  setStepDescription: (desc: string) => void;
  stepDescription: string;
  setSimDirection: (dir: SimDirectionType) => void;
  simDirection: SimDirectionType;
  setSimCurrentStep: (step: number) => void;
  simCurrentStep: number;
  setSimIsRunning: (isRunning: boolean) => void;
  simIsRunning: boolean;
  simAnimationType: animationType;

  firstStep: () => void;
  lastStep: () => void;
  simForceStopRef: boolean;

  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepToGo: number) => void;
  setAnimationSpeed: (speed: number) => void;
  animationTypeChoose: () => void;
  stopAnimation: () => void;

  isSimulatorReady: () => boolean;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(
  undefined,
);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const SimulatorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [simulator, setSimulator] = useState<BubbleSort | InsertionSort | null>(
    null,
  );
  const simulatorRef = useRef<BubbleSort | InsertionSort | null>(null);

  const [simDataToSort, setSimDataToSort] = useState<number[]>([]);
  const [simStepToGo, setSimStepToGo] = useState<number>(0);
  const [stepDescription, setStepDescription] = useState<string>("");

  const [simAnimationSpeed, setSimAnimationSpeed] =
    useState<SimAnimationSpeedType>(SimAnimationSpeed.Instant);
  const [simAnimationType, setSimAnimationType] =
    useState<animationType>("instant");
  const [simDirection, setSimDirection] = useState<SimDirectionType>(
    SimDirection.Standby,
  );

  const [simCurrentStep, setSimCurrentStep] = useState<number>(0);
  const [simIsRunning, setSimIsRunning] = useState<boolean>(false);

  const simForceStopRef = useRef<boolean>(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    simulatorRef.current = simulator;
  }, [simulator]);

  const getSimulator = (callback: (simulator: Simulator) => void) => {
    if (!simulatorRef.current) {
      return null;
    }
    callback(simulatorRef.current);
  };

  const nextStep = () => {
    getSimulator((sim) => {
      setSimDirection(SimDirection.Forward);

      sim.nextStep();

      setSimCurrentStep(sim.getCurrentStep);
      setSimDataToSort(sim.getCurrentArray);
      setStepDescription(sim.generateCurrentStepDescription());
      //setSimDirection(SimDirection.Standby);
    });
  };

  const prevStep = () => {
    getSimulator((sim) => {
      setSimDirection(SimDirection.Reverse);

      sim.prevStep();

      setSimCurrentStep(sim.getCurrentStep);
      setSimDataToSort(sim.getCurrentArray);
      setStepDescription(sim.generateCurrentStepDescription());
      // setSimDirection(SimDirection.Standby);
    });
  };

  const firstStep = () => {
    goToStep(0);
  };

  const lastStep = () => {
    getSimulator((sim) => {
      goToStep(sim.getNumberOfLastStep);
    });
  };

  const goToStep = (stepToGo: number) => {
    getSimulator(async (sim) => {
      setSimIsRunning(true);

      if (stepToGo > sim.getCurrentStep) {
        for (let i = sim.getCurrentStep; i < stepToGo; i++) {
          if (simAnimationSpeed !== SimAnimationSpeed.Instant) {
            await sleep(simAnimationSpeed);
          }
          if (simForceStopRef.current) break;
          nextStep();
        }
      }

      if (stepToGo < sim.getCurrentStep) {
        for (let i = sim.getCurrentStep; i > stepToGo; i--) {
          if (simAnimationSpeed !== SimAnimationSpeed.Instant) {
            await sleep(simAnimationSpeed);
          }
          if (simForceStopRef.current) break;
          prevStep();
        }
      }

      setSimIsRunning(false);
    });
  };

  const animationTypeChoose = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAnimationSpeed = e.target.value;

    let animSpeed = SimAnimationSpeed.Instant;
    let animType: animationType = "instant";

    switch (selectedAnimationSpeed) {
      case "instant":
        animSpeed = SimAnimationSpeed.Instant;
        animType = "instant";
        break;
      case "fast":
        animSpeed = SimAnimationSpeed.Fast;
        animType = "fast";
        break;
      case "slow":
        animSpeed = SimAnimationSpeed.Slow;
        animType = "slow";
        break;
      case "very-slow":
        animSpeed = SimAnimationSpeed.VerySlow;
        animType = "very-slow";
        break;
    }
    setSimAnimationSpeed(animSpeed);
    setSimAnimationType(animType);
  };

  const stopAnimation = async () => {
    simForceStopRef.current = true;
    await sleep(250);
    simForceStopRef.current = false;
  };

  const value = {
    simulator,
    setSimulator,
    simulatorRef,
    simDataToSort,
    setSimDataToSort,
    simStepToGo,
    setSimStepToGo,
    stepDescription,
    setStepDescription,
    simDirection,
    setSimDirection,
    simCurrentStep,
    setSimCurrentStep,
    simIsRunning,
    setSimIsRunning,
    simAnimationType,
    simForceStopRef,
    nextStep,
    prevStep,
    firstStep,
    lastStep,
    goToStep,
    setAnimationSpeed: setSimAnimationSpeed,
    animationTypeChoose,
    stopAnimation,
    isSimulatorReady: () => simulator !== null,
    getSimulator,
  };

  return (
    <SimulatorContext.Provider value={value}>
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = () => {
  const context = useContext(SimulatorContext);
  if (context === undefined) {
    throw new Error("useSimulator must be used within a SimulatorProvider");
  }

  return {
    simulator: context.simulator,
    simRef: context.simulatorRef.current,
    setSimulator: context.setSimulator,
    simContext: context,
  };
};