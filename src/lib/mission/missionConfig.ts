export type MissionConfig = {
  objective: string;
  orbit: string;
  launchVehicle: string;
  spacecraft: string;
  payload: string;
  solar: string;
  battery: string;
  communications: string;
  budget: number;
  mass: number;
  power: number;
  communicationsScore: number;
  risk: number;
  science: number;
  missionScore: number;
};

export const DEFAULT_MISSION: MissionConfig = {
  objective: "Earth Observation",
  orbit: "LEO",
  launchVehicle: "Medium Launcher",
  spacecraft: "Standard Bus",
  payload: "Camera",
  solar: "Standard Array",
  battery: "Standard Battery",
  communications: "S-Band",
  budget: 100,
  mass: 180,
  power: 62,
  communicationsScore: 72,
  risk: 18,
  science: 60,
  missionScore: 78,
};
