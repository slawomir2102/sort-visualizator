import React, {createContext, RefObject, useContext} from "react";
import {animationType, SimDirectionType, Simulators} from "./SimulatorTypes.ts";

interface SimulatorContextType {
  simulator: Simulators;
  simulatorRef: RefObject<Simulators>;
  setSimulator: (simulator: Simulators) => void;
  getSimulator: (callback: (simulator: Simulators) => void) => void;

  // params
  simDataToSort: number[];
  simStepToGo: number;
  stepDescription: string;
  simDirection: SimDirectionType;
  simCurrentStep: number;
  simIsRunning: boolean;
  simAnimationType: animationType;
  simForceStopRef: RefObject<boolean>;

  // settery
  setSimDataToSort: (arr: number[]) => void;
  setSimStepToGo: (step: number) => void;
  setStepDescription: (desc: string) => void;
  setSimDirection: (dir: SimDirectionType) => void;
  setSimCurrentStep: (step: number) => void;
  setSimIsRunning: (isRunning: boolean) => void;

  // methods
  firstStep: () => void;
  lastStep: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepToGo: number) => void;
  setAnimationSpeed: (speed: number) => void;
  animationTypeChoose: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  stopAnimation: () => void;
  downloadJSONFile: () => void;
}

export const SimulatorContext = createContext<SimulatorContextType | undefined>(
    undefined,
);

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