import type { SimulationState } from "@/types/simulation";

export function getSystemStatus(state: SimulationState) {
  if (state.missionHealth < 40) return "CRITICAL";
  if (state.missionHealth < 65) return "DEGRADED";
  if (state.missionHealth < 85) return "CAUTION";
  return "NOMINAL";
}

export function getPowerStatus(state: SimulationState) {
  if (state.powerMargin < 10) return "CRITICAL";
  if (state.powerMargin < 35) return "LOW";
  return "NOMINAL";
}

export function getThermalStatus(state: SimulationState) {
  if (state.temperature > 75) return "CRITICAL";
  if (state.temperature > 50) return "HIGH";
  return "NOMINAL";
}

export function getCommsStatus(state: SimulationState) {
  if (state.communicationHealth < 40) return "CRITICAL";
  if (state.communicationHealth < 70) return "DEGRADED";
  return "NOMINAL";
}
