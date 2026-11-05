"use client";

import { useMemo, useState } from "react";
import { simulatePower } from "@/simulation/power";

export default function PowerLab() {
  const [solar, setSolar] = useState(85);
  const [battery, setBattery] = useState(78);
  const [cpu, setCpu] = useState(55);
  const [rf, setRf] = useState(40);
  const [sensors, setSensors] = useState(35);

  const state = useMemo(
    () => simulatePower(solar, battery, cpu, rf, sensors),
    [solar, battery, cpu, rf, sensors]
  );

  return (
    <section className="rounded-2xl border border-cyan-400/20 bg-black/40 p-5 backdrop-blur-xl">
      <div className="mb-5">
        <div className="text-xs tracking-[0.3em] text-cyan-400/60">
          LIVE ENGINEERING LAB
        </div>
        <h2 className="mt-1 text-xl font-bold text-white">
          POWER NETWORK
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <Control
            label="SOLAR ARRAY"
            value={solar}
            setValue={setSolar}
          />

          <Control
            label="CPU LOAD"
            value={cpu}
            setValue={setCpu}
          />

          <Control
            label="RF LOAD"
            value={rf}
            setValue={setRf}
          />

          <Control
            label="SENSOR LOAD"
            value={sensors}
            setValue={setSensors}
          />

          <Control
            label="BATTERY"
            value={battery}
            setValue={setBattery}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Metric label="GENERATED" value={`${(solar * 0.94).toFixed(1)} W`} />
          <Metric label="TOTAL LOAD" value={`${state.totalLoad.toFixed(1)} W`} />
          <Metric label="BUS VOLTAGE" value={`${state.busVoltage.toFixed(2)} V`} />
          <Metric label="BATTERY" value={`${state.batteryLevel.toFixed(1)}%`} />
          <Metric label="POWER MARGIN" value={`${state.powerMargin.toFixed(1)}%`} />
          <Metric label="HEALTH" value={`${state.systemHealth.toFixed(1)}%`} />
        </div>
      </div>
    </section>
  );
}

function Control({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs tracking-widest">
        <span className="text-white/50">{label}</span>
        <span className="text-cyan-300">{value}%</span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-cyan-400"
      />
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-[9px] tracking-widest text-white/40">
        {label}
      </div>

      <div className="mt-2 font-mono text-lg text-cyan-200">
        {value}
      </div>
    </div>
  );
}
