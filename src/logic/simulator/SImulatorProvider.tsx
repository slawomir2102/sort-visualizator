import React, {
    useEffect,
    useRef,
    useState,
} from "react";
import {
    animationType,
    SimAnimationSpeed,
    SimAnimationSpeedType,
    SimDirection,
    SimDirectionType, Simulators,
} from "./SimulatorTypes.ts";
import { SimulatorContext } from "./SimulatorContext.tsx";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const SimulatorProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                               children,
                                                                           }) => {
    const [simulator, setSimulator] = useState<Simulators>(
        null,
    );
    const simulatorRef = useRef<Simulators>(null);

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

    useEffect(() => {
        simulatorRef.current = simulator;
    }, [simulator]);

    const getSimulator = (callback: (simulator: NonNullable<Simulators>) => void): void => {
        if (simulatorRef.current && simulator) {
            // Now TypeScript knows this is non-null
            callback(simulatorRef.current);
        }
    };

    const nextStep = () => {
        getSimulator((sim) => {
            setSimDirection(SimDirection.Forward);

            sim.nextStep();

            setSimCurrentStep(sim.getCurrentStep);
            setSimDataToSort(sim.getCurrentArray);
            setStepDescription(sim.generateCurrentStepDescription());
        });
    };

    const prevStep = () => {
        getSimulator((sim) => {
            setSimDirection(SimDirection.Reverse);

            sim.prevStep();

            setSimCurrentStep(sim.getCurrentStep);
            setSimDataToSort(sim.getCurrentArray);
            setStepDescription(sim.generateCurrentStepDescription());
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
                    } else {
                        await sleep(10)
                    }
                    if (simForceStopRef.current) break;
                    nextStep();
                }
            }

            if (stepToGo < sim.getCurrentStep) {
                for (let i = sim.getCurrentStep; i > stepToGo; i--) {
                    if (simAnimationSpeed !== SimAnimationSpeed.Instant) {
                        await sleep(simAnimationSpeed);
                    } else {
                        await sleep(10)
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

    const downloadJSONFile = () => {
        getSimulator((sim) => {
            const jsonString = sim.generateJSONFile();
            if (!jsonString) return;
            const blob = new Blob([jsonString], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "simulator.json";
            link.click();
            URL.revokeObjectURL(link.href);
        })
    }

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
        downloadJSONFile,
        getSimulator,
    };

    return (
        <SimulatorContext.Provider value={value}>
            {children}
        </SimulatorContext.Provider>
    );
};