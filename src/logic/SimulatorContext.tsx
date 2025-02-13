import React, {createContext, MutableRefObject, useContext, useRef, useState} from 'react';
import { SortSimulator } from './simulator/SortSimulator';

interface VisualizationState {
    data: number[];
    currentStep: number;
    stepDescription: string;
    isRunning: boolean;
    direction: 'REVERSE' | 'FORWARD' | 'STANDBY';
    animationSpeed: number;
}

interface SimulatorContextType {
    simulator: SortSimulator | null;
    setSimulator: (simulator: SortSimulator | null) => void;
    simulatorRef: MutableRefObject<SortSimulator | null>;

    currentState: VisualizationState;

    nextStep: () => void;
    prevStep: () => void;
    goToStep: (stepToGo: number) => void;
    setAnimationSpeed: (speed: number) => void;
    stopAnimation: () => void;

    isSimulatorReady: () => boolean;
}

const initialVisualizationState: VisualizationState = {
    currentStep: 0,
    stepDescription: 'Dane są gotowe do posortowania',
    data: [],
    isRunning: false,
    direction: 'STANDBY',
    animationSpeed: 0
};

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const SimulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [simulator, setSimulator] = useState<SortSimulator | null>(null);
    const simulatorRef = useRef<SortSimulator | null>(null);

    const [visualizatorState, setVisualizatorState] = useState<VisualizationState>(initialVisualizationState);
    const forceToAnimationStopRef = useRef<boolean>(false);

    const getSimulator = (callback: (simulator: SortSimulator) => void) => {
        if (!simulatorRef.current) {
            return null;
        }
        callback(simulatorRef.current);
    };

    const nextStep = () => {
        getSimulator(sim => {

          setVisualizatorState(prev => ({
              ...prev,
              direction: 'FORWARD',
          }));

          sim.nextStep();

          // high

          setVisualizatorState(prev => ({
              ...prev,
              direction: 'STANDBY',
              data: sim.currentState,
              currentStep: sim.currentStep,
              stepDescription: sim.generateCurrentStateDescription().content,
          }));
        })
    }

    const prevStep = () => {
        getSimulator(sim => {

            setVisualizatorState(prev => ({
                ...prev,
                direction: 'REVERSE',
            }));

            sim.prevStep();

            // high

            setVisualizatorState(prev => ({
                ...prev,
                direction: 'STANDBY',
                data: sim.currentState,
                currentStep: sim.currentStep,
                stepDescription: sim.generateCurrentStateDescription().content,
            }));
        })
    }

    const goToStep = (stepToGo: number) => {
        getSimulator(async sim => {

            setVisualizatorState(prev => ({
                ...prev,
                isRunning: true,
            }));

            if (stepToGo > sim.currentStep) {
                setVisualizatorState(prev => ({
                    ...prev,
                    direction: 'FORWARD',
                }));

                for (let i = sim.currentStep; i < stepToGo; i++) {
                    if (visualizatorState.animationSpeed !== 0) {
                        await sleep(visualizatorState.animationSpeed);
                    }
                    if (forceToAnimationStopRef.current) return;
                    sim.nextStep();
                }
            }

            if (stepToGo < sim.currentStep) {
                setVisualizatorState(prevState => ({
                    ...prevState,
                    direction: 'REVERSE',
                }));

                for (let i = sim.currentStep; i > stepToGo; i--) {
                    if (visualizatorState.animationSpeed !== 0) {
                        await sleep(visualizatorState.animationSpeed);
                    }
                    if (forceToAnimationStopRef.current) return;
                    sim.prevStep();
                }
            }

            setVisualizatorState(prev => ({
                ...prev,
                isRunning: false,
                direction: 'STANDBY',
            }))
        })
    }

    const value = {
        simulator, setSimulator, simulatorRef, nextStep, prevStep, goToStep
    }

    return (
        <SimulatorContext.Provider value={value}>
            {children}
        </SimulatorContext.Provider>
    );
};

export const useSimulator = () => {
    const context = useContext(SimulatorContext);
    if (context === undefined) {
        throw new Error('useSimulator must be used within a SimulatorProvider');
    }

    const executeSimulatorOperation = <T,>(operation: (sim: SortSimulator) => T): T | null => {
        if (!context.simulator) return null;
        return operation(context.simulator);
    };

    return {
        simulator: context.simulator,
        setSimulator: context.setSimulator,
        executeSimulatorOperation
    };
};