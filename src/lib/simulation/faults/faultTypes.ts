export const FAULT_TYPES = [
  {
    id: "SOLAR_DEGRADATION",
    label: "SOLAR DEGRADATION",
    severity: "HIGH",
  },
  {
    id: "BATTERY_FAILURE",
    label: "BATTERY FAILURE",
    severity: "CRITICAL",
  },
  {
    id: "CPU_OVERLOAD",
    label: "CPU OVERLOAD",
    severity: "HIGH",
  },
  {
    id: "RADIATION_BURST",
    label: "RADIATION BURST",
    severity: "CRITICAL",
  },
  {
    id: "RF_DEGRADATION",
    label: "RF DEGRADATION",
    severity: "HIGH",
  },
] as const;
