"use client";

import { useSimulation } from "@/lib/simulation/useSimulation";
import NetworkTopology from "@/components/networks/NetworkTopology";

export default function EngineeringNetwork() {
  const { state } = useSimulation();

  return (
    <NetworkTopology
      state={{
        solar: state.solarArray,
        battery: state.battery,
        cpu: state.cpuLoad,
        rf: state.rfLoad,
        sensors: state.sensorLoad,
        thermal: state.thermalLoad,
        comms: state.communicationHealth,
        mission: state.missionHealth,
        fault: state.faultActive,
        faultType: state.faultType,
      }}
    />
  );
}
