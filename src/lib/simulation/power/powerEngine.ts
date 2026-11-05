import type { SimulationState } from "@/types/simulation";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function applySpaceWeather(state: SimulationState) {
  const mode = state.spaceWeatherMode;

  let radiation = 12;
  let solarWind = 18;
  let magnetic = 20;
  let sensorNoise = 4;
  let memoryRisk = 2;

  switch (mode) {
    case "HIGH_SOLAR":
      radiation = 38;
      solarWind = 52;
      magnetic = 35;
      sensorNoise = 16;
      memoryRisk = 9;
      break;

    case "RADIATION_BURST":
      radiation = 92;
      solarWind = 68;
      magnetic = 48;
      sensorNoise = 58;
      memoryRisk = 64;
      break;

    case "SOLAR_STORM":
      radiation = 86;
      solarWind = 94;
      magnetic = 88;
      sensorNoise = 72;
      memoryRisk = 78;
      break;

    case "MAGNETIC_DISTURBANCE":
      radiation = 54;
      solarWind = 61;
      magnetic = 96;
      sensorNoise = 42;
      memoryRisk = 38;
      break;

    default:
      break;
  }

  return {
    radiation,
    solarWind,
    magnetic,
    sensorNoise,
    memoryRisk,
  };
}

export function calculatePowerState(
  state: SimulationState,
  dt = 1
): SimulationState {
  const environment = applySpaceWeather(state);

  const generatedPower = 94 * (state.solarArray / 100);

  const environmentLoad =
    environment.sensorNoise * 0.025 +
    environment.memoryRisk * 0.018;

  const totalLoad =
    12 +
    state.cpuLoad * 0.18 +
    state.rfLoad * 0.12 +
    state.sensorLoad * 0.08 +
    state.missionPayloadLoad +
    environmentLoad;

  const netPower = generatedPower - totalLoad;

  const batteryDelta = netPower * 0.012 * dt;

  const battery = clamp(
    state.battery + batteryDelta,
    0,
    100
  );

  const busVoltage = clamp(
    24 + battery * 0.047,
    18,
    30
  );

  const powerMargin =
    generatedPower > 0
      ? clamp((netPower / generatedPower) * 100, 0, 100)
      : 0;

  const thermalLoad = clamp(
    state.cpuLoad * 0.45 +
      state.rfLoad * 0.25 +
      state.sensorLoad * 0.15 +
      environment.solarWind * 0.04,
    0,
    100
  );

  const temperature =
    18 +
    thermalLoad * 0.42 +
    environment.radiation * 0.045 +
    environment.solarWind * 0.018;

  const rfPenalty = Math.max(0, state.rfLoad - 50) * 0.45;

  const communicationHealth = clamp(
    state.communicationBaseHealth -
      rfPenalty -
      environment.radiation * 0.12 -
      environment.solarWind * 0.035 -
      environment.magnetic * 0.02,
    0,
    100
  );

  const batteryPenalty = Math.max(0, 45 - battery) * 0.35;

  const thermalPenalty = Math.max(
    0,
    temperature - 45
  ) * 0.8;

  const environmentMissionPenalty =
    environment.radiation * 0.08 +
    environment.sensorNoise * 0.05 +
    environment.memoryRisk * 0.06;

  const missionHealth = clamp(
    state.missionBaseHealth -
      batteryPenalty -
      thermalPenalty -
      (100 - communicationHealth) * 0.25 -
      environmentMissionPenalty,
    0,
    100
  );

  return {
    ...state,
    generatedPower,
    totalLoad,
    battery,
    busVoltage,
    powerMargin,
    thermalLoad,
    temperature,
    communicationHealth,
    missionHealth,
    solarWind: environment.solarWind,
    magneticDisturbance: environment.magnetic,
    sensorNoise: environment.sensorNoise,
    memoryErrorRisk: environment.memoryRisk,
    radiationLevel: environment.radiation,
    simulationTime: state.simulationTime + dt,
  };
}

export function injectFault(
  state: SimulationState,
  type: string
): SimulationState {
  const next = { ...state };

  switch (type) {
    case "SOLAR_DEGRADATION":
      next.solarArray = clamp(next.solarArray - 35, 0, 100);
      break;

    case "BATTERY_FAILURE":
      next.battery = clamp(next.battery - 30, 0, 100);
      break;

    case "CPU_OVERLOAD":
      next.cpuLoad = clamp(next.cpuLoad + 35, 0, 100);
      break;

    case "RADIATION_BURST":
      next.spaceWeatherMode = "RADIATION_BURST";
      break;

    case "RF_DEGRADATION":
      next.rfLoad = clamp(next.rfLoad + 30, 0, 100);
      break;
  }

  next.faultActive = true;
  next.faultType = type;

  return calculatePowerState(next);
}
