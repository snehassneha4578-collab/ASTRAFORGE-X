"use client";

import { useCallback, useEffect, useState } from "react";
import { createSimulation } from "@/lib/simulation/engine";
import {
  ComponentControl,
} from "@/lib/simulation/componentControl";

const simulation = createSimulation();

export function useSimulation() {
  const [state, setState] = useState(simulation.getState());
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const timer = window.setInterval(() => {
      setState(simulation.tick(1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running]);

  const start = () => setRunning(true);

  const stop = () => setRunning(false);

  const applyMission = useCallback(
    (mission: import("@/lib/mission/missionConfig").MissionConfig) => {
      setRunning(false);
      setState(simulation.applyMission(mission));
    },
    []
  );

  const reset = () => {
    setRunning(false);
    setState(simulation.reset());
  };

  const injectFault = (type: Parameters<typeof simulation.fault>[0]) => {
    setState(simulation.fault(type));
  };

  const clearFault = (expectedType: string | null) => {
    const currentState = simulation.getState();

    if (
      !expectedType ||
      !currentState.faultActive ||
      currentState.faultType !== expectedType
    ) {
      setState(currentState);
      return false;
    }

    const nextState = simulation.clearFault(expectedType);
    setState(nextState);

    return !nextState.faultActive && nextState.faultType === null;
  };

  const setSpaceWeather = (
    mode:
      | "NORMAL"
      | "HIGH_SOLAR"
      | "RADIATION_BURST"
      | "SOLAR_STORM"
      | "MAGNETIC_DISTURBANCE"
  ) => {
    setState(simulation.setSpaceWeather(mode));
  };

  const controlComponent = (control: ComponentControl) => {
    setState(simulation.controlComponent(control));
  };

  return {
    state,
    running,
    start,
    stop,
    reset,
    applyMission,
    injectFault,
    clearFault,
    setSpaceWeather,
    controlComponent,
  };
}
