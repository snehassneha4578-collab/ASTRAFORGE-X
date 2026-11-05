"use client";

import dynamic from "next/dynamic";
const SpaceUniverse = dynamic(() => import("../components/space/SpaceUniverse"), { ssr: false });
import { useEffect, useMemo, useState } from "react";

const SpaceScene = dynamic(
  () => import("../components/space/SpaceScene"),
  { ssr: false }
);

import SpacecraftProblemSolver from "@/components/ai/SpacecraftProblemSolver";
import SpaceCommandBar from "@/components/mission/SpaceCommandBar";
import SpaceWeatherPanel from "@/components/space/SpaceWeatherPanel";
import InteractiveSpacecraftCockpit from "@/components/engineering/InteractiveSpacecraftCockpit";
import WhatIfSimulator from "@/components/mission/WhatIfSimulator";
import MissionDesigner from "@/components/mission/MissionDesigner";
import { DEFAULT_MISSION, MissionConfig } from "@/lib/mission/missionConfig";
import type { SimulationState } from "@/types/simulation";

import {
  getSystemStatus,
  getPowerStatus,
  getThermalStatus,
  getCommsStatus,
} from "@/lib/simulation/telemetry";

import { useSimulation } from "@/lib/simulation/useSimulation";
import { FAULT_TYPES } from "@/lib/simulation/faults/faultTypes";
function Metric({
  label,
  value,
  unit = "",
}: {
  label: string;
  value: number | string;
  unit?: string;
}) {
  return (
    <div className="rounded-xl border border-cyan-400/20 bg-slate-950/70 p-4 shadow-[0_0_25px_rgba(34,211,238,0.06)]">
      <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-cyan-300">
        {value}
        <span className="ml-1 text-sm text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

function Status({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-3">
      <span className="text-xs uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <span className="text-xs font-bold text-emerald-400">{value}</span>
    </div>
  );
}

function SpacecraftTwinVisual({
  state,
}: {
  state: SimulationState;
}) {
  const [selected, setSelected] = useState("CPU");

  const nodes = {
    PWR: {
      label: "POWER BUS",
      value: `${Number(state.powerMargin ?? 100).toFixed(1)}%`,
      unit: "MARGIN",
      color: "cyan",
      description: "Central electrical distribution network.",
    },
    BAT: {
      label: "BATTERY",
      value: `${Number(state.battery ?? 100).toFixed(1)}%`,
      unit: "CHARGE",
      color: "emerald",
      description: "Energy storage and spacecraft reserve.",
    },
    CPU: {
      label: "FLIGHT COMPUTER",
      value: `${Number(state.cpuLoad ?? 55).toFixed(1)}%`,
      unit: "LOAD",
      color: "purple",
      description: "Command, control and onboard computation.",
    },
    RF: {
      label: "RF TRANSCEIVER",
      value: `${Number(state.communicationHealth ?? 100).toFixed(1)}%`,
      unit: "LINK",
      color: "blue",
      description: "Spacecraft-to-ground communications subsystem.",
    },
    THM: {
      label: "THERMAL SYSTEM",
      value: `${Number(state.temperature ?? 24).toFixed(1)}°C`,
      unit: "TEMP",
      color: "orange",
      description: "Radiator and thermal-control network.",
    },
    ADCS: {
      label: "ADCS",
      value: "NOMINAL",
      unit: "STATE",
      color: "pink",
      description: "Attitude determination and control system.",
    },
  };

  const active = nodes[selected as keyof typeof nodes] ?? nodes.CPU;
  const fault = Boolean(state.faultActive);

  const nodeClass = (name: string) =>
    `absolute flex cursor-pointer flex-col items-center justify-center rounded-xl border px-3 py-2 transition-all duration-300 ${
      selected === name
        ? "scale-110 border-cyan-300 bg-cyan-400/15 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
        : "border-white/10 bg-black/60 hover:border-cyan-400/50 hover:bg-cyan-400/10"
    }`;

  return (
    <div className="relative min-h-[620px] overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#020712] p-6 shadow-[0_0_70px_rgba(34,211,238,0.08)]">

      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.07)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <div className="relative z-20 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold tracking-[0.35em] text-cyan-400">
            DIGITAL TWIN // INTERACTIVE ENGINEERING NETWORK
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Select a subsystem to inspect its live causal state
          </div>
        </div>

        <div className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest ${
          fault
            ? "border-red-400/40 bg-red-400/10 text-red-300"
            : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
        }`}>
          {fault ? "ANOMALY DETECTED" : "DIGITAL TWIN LINKED"}
        </div>
      </div>

      <div className="relative z-10 mt-5 grid gap-5 lg:grid-cols-[1fr_280px]">

        <div className="relative min-h-[500px]">

          {/* Solar arrays */}
          <div
            onClick={() => setSelected("PWR")}
            className={`${nodeClass("PWR")} left-[3%] top-1/2 h-32 w-20 -translate-y-1/2`}
          >
            <div className="grid h-24 w-14 grid-cols-4 grid-rows-6 border border-cyan-400/40 bg-cyan-400/10">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="border border-cyan-400/15" />
              ))}
            </div>
            <span className="mt-1 text-[8px] tracking-widest text-cyan-300">
              SOLAR
            </span>
          </div>

          <div
            onClick={() => setSelected("PWR")}
            className={`${nodeClass("PWR")} right-[3%] top-1/2 h-32 w-20 -translate-y-1/2`}
          >
            <div className="grid h-24 w-14 grid-cols-4 grid-rows-6 border border-cyan-400/40 bg-cyan-400/10">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="border border-cyan-400/15" />
              ))}
            </div>
            <span className="mt-1 text-[8px] tracking-widest text-cyan-300">
              SOLAR
            </span>
          </div>

          {/* Spacecraft body */}
          <div className={`absolute left-1/2 top-1/2 h-64 w-[min(340px,90vw)] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-[35%] border ${
            fault
              ? "border-red-400/60 shadow-[0_0_60px_rgba(248,113,113,0.25)]"
              : "border-cyan-300/50 shadow-[0_0_60px_rgba(34,211,238,0.18)]"
          } bg-gradient-to-br from-slate-700/40 via-slate-950 to-black`}>

            <div className="absolute inset-5 rounded-[35%] border border-white/10" />

            {/* CPU core */}
            <button
              onClick={() => setSelected("CPU")}
              className={`${nodeClass("CPU")} left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2`}
            >
              <span className="text-[9px] tracking-widest text-purple-300">
                CPU
              </span>
              <span className="mt-1 text-xl font-bold text-white">
                {Number(state.cpuLoad ?? 55).toFixed(0)}%
              </span>
              <span className="text-[7px] text-slate-500">
                LOAD
              </span>
            </button>

            {/* Battery */}
            <button
              onClick={() => setSelected("BAT")}
              className={`${nodeClass("BAT")} left-6 top-6`}
            >
              <span className="text-[8px] tracking-widest text-emerald-300">
                BAT
              </span>
              <span className="text-sm font-bold text-white">
                {Number(state.battery ?? 100).toFixed(0)}%
              </span>
            </button>

            {/* RF */}
            <button
              onClick={() => setSelected("RF")}
              className={`${nodeClass("RF")} right-6 top-6`}
            >
              <span className="text-[8px] tracking-widest text-blue-300">
                RF
              </span>
              <span className="text-sm font-bold text-white">
                {Number(state.communicationHealth ?? 100).toFixed(0)}%
              </span>
            </button>

            {/* Thermal */}
            <button
              onClick={() => setSelected("THM")}
              className={`${nodeClass("THM")} bottom-6 left-6`}
            >
              <span className="text-[8px] tracking-widest text-orange-300">
                THM
              </span>
              <span className="text-sm font-bold text-white">
                {Number(state.temperature ?? 24).toFixed(1)}°
              </span>
            </button>

            {/* Power */}
            <button
              onClick={() => setSelected("PWR")}
              className={`${nodeClass("PWR")} bottom-6 right-6`}
            >
              <span className="text-[8px] tracking-widest text-cyan-300">
                PWR
              </span>
              <span className="text-sm font-bold text-white">
                {Number(state.powerMargin ?? 100).toFixed(0)}%
              </span>
            </button>
          </div>

          {/* ADCS */}
          <button
            onClick={() => setSelected("ADCS")}
            className={`${nodeClass("ADCS")} left-1/2 bottom-2 -translate-x-1/2 z-30`}
          >
            <span className="text-[8px] tracking-widest text-pink-300">
              ADCS
            </span>
            <span className="text-xs font-bold text-white">
              NOMINAL
            </span>
          </button>

          {/* Causal paths */}
          <div className="pointer-events-none absolute left-[18%] right-[18%] top-1/2 h-px bg-cyan-400/30" />
          <div className="pointer-events-none absolute left-1/2 top-[18%] h-[48%] w-px -translate-x-1/2 bg-purple-400/20" />

          <div className="absolute bottom-[-28px] left-2 right-2 z-20 mx-auto max-w-full text-center before:absolute before:bottom-full before:left-1/2 before:h-2 before:w-px before:-translate-x-1/2 before:bg-cyan-400/70">
            <div className="text-[8px] leading-relaxed tracking-[0.18em] text-slate-400">
              CAUSAL ENGINEERING PATH
            </div>
            <div className="mt-1 whitespace-normal break-words text-[9px] leading-relaxed text-cyan-300">
              POWER → COMPUTE → RF → THERMAL → MISSION
            </div>
          </div>
        </div>

        {/* Inspector */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">

          <div className="text-[9px] font-bold tracking-[0.3em] text-cyan-400">
            COMPONENT INSPECTOR
          </div>

          <div className="mt-2 text-lg font-bold text-white">
            {active.label}
          </div>

          <div className="mt-1 text-xs text-slate-500">
            {active.description}
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <div className="text-[8px] tracking-[0.25em] text-slate-500">
              LIVE {active.unit}
            </div>
            <div className="mt-2 text-3xl font-bold text-cyan-300">
              {active.value}
            </div>
          </div>

          <div className="mt-4 space-y-2">

            {Object.keys(nodes).map((name) => (
              <button
                key={name}
                onClick={() => setSelected(name)}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition ${
                  selected === name
                    ? "border-cyan-400/40 bg-cyan-400/10"
                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
              >
                <span className="text-[9px] font-bold tracking-widest text-slate-300">
                  {name}
                </span>
                <span className="text-[9px] text-slate-500">
                  LIVE
                </span>
              </button>
            ))}

          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <div className="text-[8px] tracking-[0.25em] text-slate-600">
              DIGITAL-TWIN STATUS
            </div>
            <div className="mt-2 text-xs text-slate-300">
              {fault
                ? "Fault propagation detected. Inspect the affected subsystem and execute recovery."
                : "All monitored engineering networks are operating within nominal simulation limits."}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
export default function Home() {
  const resetVersion = 0;
  const [activeMission, setActiveMission] =
    useState<MissionConfig>(DEFAULT_MISSION);

  const {
    state,
    running,
    start,
    stop,
    reset,
    injectFault,
    clearFault,
    setSpaceWeather,
    controlComponent,
    applyMission,
  } = useSimulation();

  useEffect(() => {
    applyMission(activeMission);
  }, [activeMission, applyMission]);

  const runMission = () => {
    applyMission(activeMission);
    start();
  };

  const resetMission = () => {
    reset();
    applyMission(activeMission);
  };




  const systemStatus = useMemo(
    () => getSystemStatus(state),
    [state]
  );

  const powerStatus = getPowerStatus(state);
  const thermalStatus = getThermalStatus(state);
  const commsStatus = getCommsStatus(state);

  return (
    <main className="min-h-screen overflow-hidden bg-[#02040a] text-white">
      <div className="relative z-0 isolate px-4 lg:px-6">
        <SpaceUniverse />
      </div>
      <div className="relative z-30 px-4 pt-4 lg:px-6">
        <SpaceCommandBar
          running={running}
          onStart={start}
          onStop={stop}
          onReset={resetMission}
          onMission={runMission}
        />
      </div>
      <div className="relative z-20 px-4 lg:px-6">
        <MissionDesigner
          onMissionBuilt={(mission) => {
            setActiveMission(mission);
            applyMission(mission);
          }}
        />
        <div className="mb-6 rounded-xl border border-cyan-400/25 bg-cyan-400/5 p-4 text-xs text-cyan-100">
          <div className="font-black tracking-widest text-cyan-300">
            ACTIVE MISSION CONFIGURATION
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div>Orbit: <strong>{activeMission.orbit}</strong></div>
            <div>Solar: <strong>{activeMission.solar}</strong></div>
            <div>Battery: <strong>{activeMission.battery}</strong></div>
            <div>Communications: <strong>{activeMission.communications}</strong></div>
          </div>
          <div className="mt-2">
            Power: {activeMission.power}% · Predicted success: {activeMission.missionScore}%
          </div>
        </div>

        <SpaceWeatherPanel mode={state.spaceWeatherMode} onEnvironmentChange={setSpaceWeather} />
        <InteractiveSpacecraftCockpit key={`cockpit-${resetVersion}`} state={state} onControl={controlComponent} />
        <WhatIfSimulator key={`whatif-${resetVersion}`} state={state} />
        <SpacecraftProblemSolver key={`recovery-${resetVersion}`} state={state} onControl={controlComponent} onVerified={clearFault} />

        <div className="h-6" />
      </div>
      <div className="relative z-10 mb-8 px-4 pt-4 lg:px-6">
        <SpaceScene
          solar={state.solarArray}
          battery={state.battery}
          communication={state.communicationHealth}
          fault={state.faultActive}
        />
      </div>

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(30,64,175,0.15),transparent_45%)]" />

      <header className="relative z-10 flex items-center justify-between border-b border-cyan-400/10 px-6 py-4">
        <div>
          <div className="text-xs font-bold tracking-[0.45em] text-cyan-400">
            ASTRAFORGE-X // ENGINEERING COMMAND
          </div>
          <h1 className="mt-1 text-xl font-bold tracking-wide">
            SPACECRAFT DIGITAL TWIN
          </h1>
          <p className="text-xs text-slate-500">
            Real-time spacecraft power-system simulation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full border border-emerald-400/30 bg-emerald-400/5 px-4 py-2 text-xs text-emerald-400">
            ● {systemStatus}
          </div>

          <div className="rounded-full border border-cyan-400/20 px-4 py-2 text-xs text-cyan-300">
            T+ {state.simulationTime}s
          </div>
        </div>
      </header>

      <section className="relative z-10 p-6">
        <SpacecraftTwinVisual state={state} />
      </section>

<section className="relative z-10 grid gap-5 p-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-cyan-400/15 bg-slate-950/60 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-xs tracking-[0.3em] text-cyan-400">
                  LIVE ENGINEERING LAB
                </div>
                <h2 className="mt-1 text-lg font-bold">
                  POWER NETWORK
                </h2>
              </div>

              <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_15px_#22d3ee]" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Metric label="Solar Array" value={state.solarArray} unit="%" />
              <Metric label="CPU Load" value={state.cpuLoad} unit="%" />
              <Metric label="RF Load" value={state.rfLoad} unit="%" />
              <Metric label="Sensor Load" value={state.sensorLoad} unit="%" />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Metric
                label="Generated"
                value={state.generatedPower}
                unit="W"
              />
              <Metric
                label="Total Load"
                value={state.totalLoad}
                unit="W"
              />
              <Metric
                label="Bus Voltage"
                value={state.busVoltage}
                unit="V"
              />
              <Metric
                label="Battery"
                value={state.battery}
                unit="%"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-blue-400/15 bg-slate-950/60 p-5">
              <div className="text-xs tracking-widest text-slate-500">
                POWER MARGIN
              </div>
              <div className="mt-3 text-4xl font-bold text-blue-300">
                {state.powerMargin}%
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-400 transition-all duration-700"
                  style={{ width: `${Math.max(0, Math.min(100, state.powerMargin))}%` }}
                />
              </div>
              <div className="mt-3 text-xs text-emerald-400">
                {powerStatus}
              </div>
            </div>

            <div className="rounded-2xl border border-orange-400/15 bg-slate-950/60 p-5">
              <div className="text-xs tracking-widest text-slate-500">
                THERMAL
              </div>
              <div className="mt-3 text-4xl font-bold text-orange-300">
                {state.temperature}°C
              </div>
              <div className="mt-3 text-xs text-orange-300">
                LOAD {state.thermalLoad}%
              </div>
              <div className="mt-3 text-xs text-emerald-400">
                {thermalStatus}
              </div>
            </div>

            <div className="rounded-2xl border border-purple-400/15 bg-slate-950/60 p-5">
              <div className="text-xs tracking-widest text-slate-500">
                COMMUNICATIONS
              </div>
              <div className="mt-3 text-4xl font-bold text-purple-300">
                {state.communicationHealth}%
              </div>
              <div className="mt-3 text-xs text-purple-300">
                RF LINK HEALTH
              </div>
              <div className="mt-3 text-xs text-emerald-400">
                {commsStatus}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-400/15 bg-slate-950/60 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs tracking-[0.3em] text-cyan-400">
                  SPACECRAFT TELEMETRY
                </div>
                <h2 className="mt-1 font-bold">
                  CAUSAL SYSTEM STATE
                </h2>
              </div>

              <div
                className={`rounded-lg px-3 py-2 text-xs font-bold ${
                  state.faultActive
                    ? "border border-red-400/30 bg-red-400/10 text-red-300"
                    : "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                }`}
              >
                {state.faultActive
                  ? `FAULT: ${state.faultType}`
                  : "NO ACTIVE FAULT"}
              </div>
            </div>

            <div className="h-36 rounded-xl border border-white/5 bg-black/40 p-4">
              <div className="flex h-full items-end gap-1">
                {Array.from({ length: 48 }).map((_, i) => {
                  const wave =
                    25 +
                    Math.sin(
                      i * 0.55 + state.simulationTime * 0.18
                    ) *
                      15 +
                    state.cpuLoad * 0.25;

                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-cyan-400/70 transition-all duration-500"
                      style={{
                        height: `${Math.max(8, Math.min(100, wave))}%`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-purple-400/20 bg-slate-950/70 p-5">
            <div className="text-xs tracking-[0.3em] text-purple-300">
              MISSION CONTROL
            </div>

            <div className="mt-5 grid gap-3">
              {!running ? (
                <button
                  onClick={start}
                  className="rounded-xl border border-cyan-300/40 bg-cyan-400/10 px-4 py-4 text-sm font-bold tracking-widest text-cyan-300 transition hover:bg-cyan-400/20"
                >
                  ▶ EXECUTE SIMULATION
                </button>
              ) : (
                <button
                  onClick={stop}
                  className="rounded-xl border border-yellow-300/40 bg-yellow-400/10 px-4 py-4 text-sm font-bold tracking-widest text-yellow-300 transition hover:bg-yellow-400/20"
                >
                  ❚❚ PAUSE SIMULATION
                </button>
              )}

              <button
                onClick={resetMission}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold tracking-widest text-slate-300 hover:bg-white/10"
              >
                ↻ RESET SPACECRAFT
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-red-400/20 bg-slate-950/70 p-5">
            <div className="text-xs tracking-[0.3em] text-red-300">
              MISSION BREAKER
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Inject a real simulated engineering fault and observe
              downstream system effects.
            </p>

            <div className="mt-4 grid gap-2">
              {FAULT_TYPES.map((fault) => (
                <button
                  key={fault.id}
                  onClick={() => injectFault(fault.id)}
                  className="rounded-lg border border-red-400/15 bg-red-400/5 px-3 py-3 text-left text-xs font-semibold text-red-200 transition hover:border-red-400/40 hover:bg-red-400/10"
                >
                  <div>{fault.label}</div>
                  <div className="mt-1 text-[9px] uppercase tracking-widest text-red-400/60">
                    {fault.severity}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-400/15 bg-slate-950/70 p-5">
            <div className="text-xs tracking-[0.3em] text-emerald-300">
              AI ENGINEERING CORE
            </div>

            <div className="mt-4 space-y-1">
              <Status label="POWER" value={powerStatus} />
              <Status label="THERMAL" value={thermalStatus} />
              <Status label="COMMS" value={commsStatus} />
              <Status label="MISSION" value={systemStatus} />
            </div>

            <div className="mt-4 rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-4 text-xs leading-5 text-slate-400">
              {state.faultActive
                ? `AI TRACE: ${state.faultType} detected. Correlating power, thermal, communications and mission-health effects.`
                : "AI TRACE: spacecraft operating nominally. Monitoring causal relationships across engineering networks."}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="text-xs tracking-[0.3em] text-slate-500">
              MISSION HEALTH
            </div>

            <div className="mt-3 text-5xl font-black text-white">
              {state.missionHealth}%
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-700"
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(100, state.missionHealth)
                  )}%`,
                }}
              />
            </div>

            <div className="mt-3 text-xs text-slate-500">
              Radiation {state.radiationLevel}% •
              Temperature {state.temperature}°C
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
