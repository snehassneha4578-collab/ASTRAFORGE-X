export type PowerState = {
  solarInput: number;
  mpptEfficiency: number;
  batteryLevel: number;
  busVoltage: number;
  cpuLoad: number;
  rfLoad: number;
  sensorLoad: number;
  totalLoad: number;
  powerMargin: number;
  systemHealth: number;
};

export function simulatePower(
  solarInput: number,
  batteryLevel: number,
  cpuLoad: number,
  rfLoad: number,
  sensorLoad: number
): PowerState {
  const mpptEfficiency = 0.94;

  const generatedPower = solarInput * mpptEfficiency;

  const cpuPower = 12 + cpuLoad * 0.08;
  const rfPower = 8 + rfLoad * 0.06;
  const sensorPower = 5 + sensorLoad * 0.03;

  const totalLoad = cpuPower + rfPower + sensorPower;

  const powerBalance = generatedPower - totalLoad;

  const nextBattery = Math.max(
    0,
    Math.min(100, batteryLevel + powerBalance * 0.035)
  );

  const busVoltage = 24 + powerBalance * 0.08;

  const powerMargin = Math.max(
    0,
    Math.min(100, 50 + powerBalance * 2)
  );

  const systemHealth = Math.max(
    0,
    Math.min(
      100,
      0.45 * nextBattery +
        0.35 * powerMargin +
        0.2 * Math.min(100, solarInput)
    )
  );

  return {
    solarInput,
    mpptEfficiency,
    batteryLevel: nextBattery,
    busVoltage,
    cpuLoad,
    rfLoad,
    sensorLoad,
    totalLoad,
    powerMargin,
    systemHealth,
  };
}
