export type SimulationState = {
  solarArray: number;
  battery: number;
  generatedPower: number;
  totalLoad: number;
  busVoltage: number;
  cpuLoad: number;
  rfLoad: number;
  sensorLoad: number;
  thermalLoad: number;
  temperature: number;
  communicationHealth: number;
  radiationLevel: number;
  missionHealth: number;
  missionBaseHealth: number;
  communicationBaseHealth: number;
  missionPayloadLoad: number;
  powerMargin: number;
  faultActive: boolean;
  faultType: string | null;
  simulationTime: number;
  spaceWeatherMode: "NORMAL" | "HIGH_SOLAR" | "RADIATION_BURST" | "SOLAR_STORM" | "MAGNETIC_DISTURBANCE";
  sensorNoise: number;
  memoryErrorRisk: number;
  solarWind: number;
  magneticDisturbance: number;
};

export const INITIAL_STATE: SimulationState = {
  solarArray: 85,
  battery: 79.6,
  generatedPower: 79.9,
  totalLoad: 32.8,
  busVoltage: 27.76,
  cpuLoad: 55,
  rfLoad: 40,
  sensorLoad: 35,
  thermalLoad: 42,
  temperature: 24,
  communicationHealth: 96,
  radiationLevel: 12,
  missionHealth: 87.8,
  missionBaseHealth: 90,
  communicationBaseHealth: 100,
  missionPayloadLoad: 0,
  powerMargin: 100,
  faultActive: false,
  faultType: null,
  simulationTime: 0,
  spaceWeatherMode: "NORMAL",
  sensorNoise: 4,
  memoryErrorRisk: 2,
  solarWind: 18,
  magneticDisturbance: 20,
};
