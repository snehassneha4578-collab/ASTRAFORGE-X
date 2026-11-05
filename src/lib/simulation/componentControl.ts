import { calculatePowerState } from "@/lib/simulation/power/powerEngine";
import { INITIAL_STATE, SimulationState } from "@/types/simulation";

export type ComponentControl =
  | "SOLAR_DEGRADE"
  | "SOLAR_RESTORE"
  | "CPU_OVERLOAD"
  | "CPU_RECOVER"
  | "RF_DEGRADE"
  | "RF_RECOVER"
  | "SENSOR_DEGRADE"
  | "SENSOR_RECOVER"
  | "ANTENNA_DEGRADE"
  | "ANTENNA_RECOVER"
  | "THERMAL_RELIEF";

export function applyComponentControl(
  state: SimulationState,
  control: ComponentControl
): SimulationState {
  const next: SimulationState = { ...state };

  switch (control) {
    case "SOLAR_DEGRADE":
      next.solarArray = Math.max(5, next.solarArray - 20);
      break;

    case "SOLAR_RESTORE":
      next.solarArray = Math.min(100, next.solarArray + 20);
      break;

    case "CPU_OVERLOAD":
      next.cpuLoad = Math.min(100, next.cpuLoad + 25);
      break;

    case "CPU_RECOVER":
      next.cpuLoad = Math.max(20, next.cpuLoad - 25);
      break;

    case "RF_DEGRADE":
      next.rfLoad = Math.min(100, next.rfLoad + 25);
      break;

    case "RF_RECOVER":
      next.rfLoad = Math.max(10, next.rfLoad - 25);
      break;

    case "SENSOR_DEGRADE":
      next.sensorLoad = Math.min(100, next.sensorLoad + 25);
      next.sensorNoise = Math.min(100, next.sensorNoise + 15);
      break;

    case "SENSOR_RECOVER":
      next.sensorLoad = Math.max(10, next.sensorLoad - 25);
      next.sensorNoise = Math.max(0, next.sensorNoise - 15);
      break;

    case "ANTENNA_DEGRADE":
      next.rfLoad = Math.min(100, next.rfLoad + 15);
      next.communicationHealth = Math.max(
        0,
        next.communicationHealth - 20
      );
      break;

    case "ANTENNA_RECOVER":
      next.rfLoad = Math.max(10, next.rfLoad - 15);
      next.communicationHealth = Math.min(
        100,
        next.communicationHealth + 20
      );
      break;

    case "THERMAL_RELIEF":
      next.cpuLoad = Math.max(15, next.cpuLoad - 15);
      next.rfLoad = Math.max(10, next.rfLoad - 10);
      next.sensorLoad = Math.max(10, next.sensorLoad - 10);
      break;
  }

  return calculatePowerState(next, 0);
}

export function resetComponentControlState(): SimulationState {
  return { ...INITIAL_STATE };
}
