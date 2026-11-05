"use client";

import { useState } from "react";
import type { SimulationState } from "@/types/simulation";
import type { ComponentControl } from "@/lib/simulation/componentControl";

type Props = {
  state: SimulationState;
  onControl: (control: ComponentControl) => void;
};

const nodes = [
  ["PWR", "SOLAR ARRAY"],
  ["BAT", "BATTERY"],
  ["CPU", "FLIGHT COMPUTER"],
  ["BUS", "POWER BUS"],
  ["RF", "RF TRANSCEIVER"],
  ["ANT", "ANTENNA"],
  ["THM", "RADIATOR"],
  ["SNS", "SENSOR ARRAY"],
  ["ADCS", "REACTION WHEELS"],
  ["PROP", "THRUSTERS"],
  ["RAM", "MEMORY"],
  ["FPGA", "FPGA / LOGIC"],
];

export default function InteractiveSpacecraftCockpit({
  state,
  onControl,
}: Props) {
  const [selected, setSelected] = useState("FLIGHT COMPUTER");
  const [lastCommand, setLastCommand] = useState("NONE");

  const command = (control: ComponentControl) => {
    onControl(control);
    setLastCommand(control);
  };

  const controls: Record<string, ComponentControl[]> = {
    "SOLAR ARRAY": ["SOLAR_DEGRADE", "SOLAR_RESTORE"],
    "FLIGHT COMPUTER": ["CPU_OVERLOAD", "CPU_RECOVER"],
    "RF TRANSCEIVER": ["RF_DEGRADE", "RF_RECOVER"],
    "SENSOR ARRAY": ["SENSOR_DEGRADE", "SENSOR_RECOVER"],
    "ANTENNA": ["ANTENNA_DEGRADE", "ANTENNA_RECOVER"],
    "RADIATOR": ["THERMAL_RELIEF"],
  };

  const labels: Record<string, string> = {
    SOLAR_DEGRADE: "DEGRADE SOLAR 20%",
    SOLAR_RESTORE: "RESTORE SOLAR",
    CPU_OVERLOAD: "OVERLOAD CPU",
    CPU_RECOVER: "RECOVER CPU",
    RF_DEGRADE: "DEGRADE RF",
    RF_RECOVER: "RECOVER RF",
    SENSOR_DEGRADE: "DEGRADE SENSORS",
    SENSOR_RECOVER: "RECOVER SENSORS",
    ANTENNA_DEGRADE: "DEGRADE ANTENNA",
    ANTENNA_RECOVER: "RECOVER ANTENNA",
    THERMAL_RELIEF: "THERMAL RELIEF",
  };

  const selectedControls = controls[selected] ?? [];

  const status =
    state.missionHealth > 75
      ? "NOMINAL"
      : state.missionHealth > 45
        ? "DEGRADED"
        : "CRITICAL";

  return (
    <section className="w-full rounded-3xl border border-cyan-400/20 bg-black/50 p-6 shadow-[0_0_80px_rgba(0,200,255,0.08)] backdrop-blur-xl">
      <div className="mb-5">
        <div className="text-xs font-semibold tracking-[0.35em] text-cyan-300">
          ASTRAFORGE-X // AVIONICS LAB
        </div>

        <h2 className="mt-2 text-2xl font-bold tracking-wide text-white">
          INTERACTIVE SPACECRAFT COCKPIT
        </h2>

        <p className="mt-1 text-xs tracking-[0.2em] text-slate-400">
          CLICK A SUBSYSTEM TO INSPECT + CONTROL ITS LIVE ENGINEERING STATE
        </p>

        <div className="mt-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-emerald-300">
          ● DIGITAL TWIN LINKED
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {nodes.map(([code, name]) => (
          <button
            key={name}
            onClick={() => setSelected(name)}
            className={`rounded-2xl border p-4 text-left transition-all ${
              selected === name
                ? "border-cyan-300 bg-cyan-400/10 shadow-[0_0_30px_rgba(0,220,255,0.18)]"
                : "border-white/10 bg-white/[0.03] hover:border-cyan-400/40 hover:bg-cyan-400/[0.05]"
            }`}
          >
            <div className="text-[10px] font-bold tracking-[0.25em] text-cyan-300">
              {code}
            </div>
            <div className="mt-2 text-xs font-semibold text-white">
              {name}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <div className="text-[10px] tracking-[0.3em] text-slate-500">
            COMPONENT INSPECTOR
          </div>

          <div className="mt-3 text-xl font-bold text-white">{selected}</div>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Metric label="CPU LOAD" value={`${state.cpuLoad.toFixed(1)}%`} />
            <Metric
              label="TEMP"
              value={`${state.temperature.toFixed(1)}°C`}
            />
            <Metric
              label="MEMORY RISK"
              value={`${state.memoryErrorRisk.toFixed(1)}%`}
            />
            <Metric label="MISSION" value={`${state.missionHealth.toFixed(1)}%`} />
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
            <span className="text-xs text-slate-400">SYSTEM STATUS</span>
            <span className="text-xs font-bold text-cyan-300">{status}</span>
          </div>

          {selectedControls.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-[10px] tracking-[0.25em] text-slate-500">
                ENGINEERING COMMANDS
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedControls.map((control) => (
                  <button
                    key={control}
                    onClick={() => command(control)}
                    className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold tracking-wide text-cyan-200 transition hover:bg-cyan-400/20"
                  >
                    {labels[control]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 rounded-xl border border-purple-400/20 bg-purple-400/[0.04] p-4">
            <div className="text-[10px] tracking-[0.25em] text-purple-300">
              CAUSAL LINK
            </div>
            <div className="mt-2 text-xs leading-6 text-slate-300">
              Component telemetry is derived from the shared spacecraft
              simulation state. Commands propagate through power, thermal,
              communication and mission-health calculations.
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-400/10 bg-black/30 p-5">
          <div className="text-[10px] tracking-[0.3em] text-slate-500">
            COMMAND TRACE
          </div>

          <div className="mt-4 text-sm font-bold text-cyan-300">
            {lastCommand}
          </div>

          <div className="mt-5 space-y-3 text-xs text-slate-300">
            <div>POWER → {state.powerMargin.toFixed(1)}%</div>
            <div>BATTERY → {state.battery.toFixed(1)}%</div>
            <div>THERMAL → {state.temperature.toFixed(1)}°C</div>
            <div>COMMS → {state.communicationHealth.toFixed(1)}%</div>
            <div>RADIATION → {state.radiationLevel.toFixed(1)}%</div>
          </div>

          <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4">
            <div className="text-[10px] tracking-[0.25em] text-emerald-300">
              LIVE DIGITAL-TWIN RESPONSE
            </div>
            <div className="mt-2 text-xs leading-6 text-slate-300">
              Click a command and observe the downstream telemetry change.
              This is an operational simulation control, not a decorative UI.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
      <div className="text-[9px] tracking-[0.2em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-bold text-white">{value}</div>
    </div>
  );
}
