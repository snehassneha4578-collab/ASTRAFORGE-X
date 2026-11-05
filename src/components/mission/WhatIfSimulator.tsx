"use client";

import { useMemo, useState } from "react";
import type { SimulationState } from "@/types/simulation";

type Props = {
  state: SimulationState;
};

type Scenario =
  | "battery"
  | "solar"
  | "cpu"
  | "comms"
  | "storm";

type FutureState = {
  missionHealth: number;
  powerMargin: number;
  battery: number;
  communicationHealth: number;
  temperature: number;
  radiation: number;
};

const clamp = (value: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

export default function WhatIfSimulator({ state }: Props) {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [future, setFuture] = useState<FutureState | null>(null);

  const live = useMemo(
    () => ({
      missionHealth: state.missionHealth,
      powerMargin: state.powerMargin,
      battery: state.battery,
      communicationHealth: state.communicationHealth,
      temperature: state.temperature,
      radiation: state.radiationLevel,
    }),
    [state]
  );

  const calculateFuture = (selected: Scenario) => {
    let mission = live.missionHealth;
    let power = live.powerMargin;
    let battery = live.battery;
    let comms = live.communicationHealth;
    let temperature = live.temperature;
    let radiation = live.radiation;

    switch (selected) {
      case "battery":
        battery = clamp(battery - 20);
        power = clamp(power - 12);
        mission = clamp(mission - 7);
        break;

      case "solar":
        power = clamp(power - 18);
        battery = clamp(battery - 12);
        mission = clamp(mission - 9);
        temperature += 2;
        break;

      case "cpu":
        temperature += 8;
        power = clamp(power - 10);
        mission = clamp(mission - 8);
        break;

      case "comms":
        comms = clamp(comms - 25);
        mission = clamp(mission - 12);
        break;

      case "storm":
        radiation = clamp(radiation + 45);
        comms = clamp(comms - 20);
        temperature += 5;
        power = clamp(power - 14);
        mission = clamp(mission - 18);
        break;
    }

    setScenario(selected);
    setFuture({
      missionHealth: clamp(mission),
      powerMargin: clamp(power),
      battery: clamp(battery),
      communicationHealth: clamp(comms),
      temperature,
      radiation: clamp(radiation),
    });
  };

  const reset = () => {
    setScenario(null);
    setFuture(null);
  };

  const scenarioName =
    scenario === "battery"
      ? "BATTERY -20%"
      : scenario === "solar"
        ? "SOLAR -20%"
        : scenario === "cpu"
          ? "CPU +25%"
          : scenario === "comms"
            ? "COMMS DEGRADED"
            : scenario === "storm"
              ? "SOLAR STORM"
              : "NO SCENARIO";

  return (
    <section className="mt-6 rounded-3xl border border-purple-400/20 bg-black/50 p-6 backdrop-blur-xl">

      <div className="text-xs font-semibold tracking-[0.35em] text-purple-300">
        ASTRAFORGE-X // COUNTERFACTUAL LAB
      </div>

      <h2 className="mt-2 text-2xl font-bold text-white">
        WHAT-IF SIMULATION ENGINE
      </h2>

      <p className="mt-1 text-xs tracking-[0.15em] text-slate-400">
        TEST ALTERNATE FUTURES WITHOUT ALTERING THE LIVE SPACECRAFT
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-5">

        <ScenarioButton
          active={scenario === "battery"}
          title="BATTERY -20%"
          description="Simulate reduced energy reserve."
          onClick={() => calculateFuture("battery")}
        />

        <ScenarioButton
          active={scenario === "solar"}
          title="SOLAR -20%"
          description="Simulate degraded solar generation."
          onClick={() => calculateFuture("solar")}
        />

        <ScenarioButton
          active={scenario === "cpu"}
          title="CPU +25%"
          description="Simulate flight-computer overload."
          onClick={() => calculateFuture("cpu")}
        />

        <ScenarioButton
          active={scenario === "comms"}
          title="COMMS DEGRADED"
          description="Simulate communication degradation."
          onClick={() => calculateFuture("comms")}
        />

        <ScenarioButton
          active={scenario === "storm"}
          title="SOLAR STORM"
          description="Simulate severe space-weather conditions."
          onClick={() => calculateFuture("storm")}
        />

      </div>

      <div className="mt-5 flex gap-3">

        <button
          onClick={() => {
            if (scenario) calculateFuture(scenario);
          }}
          disabled={!scenario}
          className="rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-3 text-xs font-bold tracking-widest text-cyan-200 disabled:opacity-40"
        >
          RUN ALTERNATE FUTURE
        </button>

        <button
          onClick={reset}
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold tracking-widest text-slate-300"
        >
          RESET SCENARIO
        </button>

      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-5">

        <Comparison
          label="MISSION"
          live={live.missionHealth}
          future={future?.missionHealth}
        />

        <Comparison
          label="POWER"
          live={live.powerMargin}
          future={future?.powerMargin}
        />

        <Comparison
          label="BATTERY"
          live={live.battery}
          future={future?.battery}
        />

        <Comparison
          label="COMMS"
          live={live.communicationHealth}
          future={future?.communicationHealth}
        />

        <Comparison
          label="TEMP °C"
          live={live.temperature}
          future={future?.temperature}
          decimals={1}
        />

      </div>

      {future && (
        <div className="mt-6 rounded-2xl border border-purple-400/20 bg-purple-400/5 p-5">

          <div className="text-[10px] font-bold tracking-[0.3em] text-purple-300">
            COUNTERFACTUAL RESULT
          </div>

          <div className="mt-3 text-lg font-bold text-white">
            {scenarioName}
          </div>

          <p className="mt-2 text-xs leading-6 text-slate-400">
            The live spacecraft remains unchanged. This branch represents
            a simulated alternate future generated from the current mission state.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-5">

            <Delta
              label="MISSION DELTA"
              live={live.missionHealth}
              future={future.missionHealth}
            />

            <Delta
              label="POWER DELTA"
              live={live.powerMargin}
              future={future.powerMargin}
            />

            <Delta
              label="BATTERY DELTA"
              live={live.battery}
              future={future.battery}
            />

            <Delta
              label="COMMS DELTA"
              live={live.communicationHealth}
              future={future.communicationHealth}
            />

            <Delta
              label="TEMP DELTA"
              live={live.temperature}
              future={future.temperature}
              decimals={1}
            />

          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">

            <div className="text-[9px] tracking-[0.3em] text-slate-500">
              FUTURE ENVIRONMENT
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">

              <Mini
                label="RADIATION"
                value={`${future.radiation.toFixed(1)}%`}
              />

              <Mini
                label="TEMPERATURE"
                value={`${future.temperature.toFixed(1)}°C`}
              />

              <Mini
                label="COMMS"
                value={`${future.communicationHealth.toFixed(1)}%`}
              />

              <Mini
                label="MISSION"
                value={`${future.missionHealth.toFixed(1)}%`}
              />

            </div>

          </div>

        </div>
      )}

    </section>
  );
}

function ScenarioButton({
  title,
  description,
  active,
  onClick,
}: {
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        active
          ? "border-purple-400/60 bg-purple-400/15"
          : "border-white/10 bg-white/[0.025] hover:border-purple-400/30"
      }`}
    >
      <div className="text-[10px] font-bold tracking-widest text-purple-200">
        {title}
      </div>

      <div className="mt-2 text-[10px] leading-5 text-slate-400">
        {description}
      </div>
    </button>
  );
}

function Comparison({
  label,
  live,
  future,
  decimals = 1,
}: {
  label: string;
  live: number;
  future?: number;
  decimals?: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">

      <div className="text-[9px] tracking-widest text-slate-500">
        {label}
      </div>

      <div className="mt-3 text-xs text-slate-400">
        LIVE
      </div>

      <div className="text-lg font-bold text-white">
        {live.toFixed(decimals)}
      </div>

      <div className="mt-2 text-xs text-slate-400">
        FUTURE
      </div>

      <div className="text-lg font-bold text-purple-300">
        {future === undefined ? "—" : future.toFixed(decimals)}
      </div>

    </div>
  );
}

function Delta({
  label,
  live,
  future,
  decimals = 1,
}: {
  label: string;
  live: number;
  future: number;
  decimals?: number;
}) {
  const delta = future - live;

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3">

      <div className="text-[8px] tracking-widest text-slate-500">
        {label}
      </div>

      <div
        className={`mt-2 text-sm font-bold ${
          delta < 0
            ? "text-red-300"
            : delta > 0
              ? "text-emerald-300"
              : "text-slate-300"
        }`}
      >
        {delta > 0 ? "+" : ""}
        {delta.toFixed(decimals)}
      </div>

    </div>
  );
}

function Mini({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-3">

      <div className="text-[8px] tracking-widest text-slate-500">
        {label}
      </div>

      <div className="mt-2 text-sm font-bold text-white">
        {value}
      </div>

    </div>
  );
}
