"use client";

import { useMemo, useState } from "react";
import type { SimulationState } from "@/types/simulation";

type Props = {
  state: SimulationState;
  onRecover?: () => void;
};

type Diagnosis = {
  severity: "NOMINAL" | "WARNING" | "CRITICAL";
  fault: string;
  cause: string;
  affected: string[];
  recommendation: string;
  verification: string;
};

export default function AIEngineeringCore({
  state,
  onRecover,
}: Props) {
  const [verified, setVerified] = useState(false);

  const diagnosis = useMemo<Diagnosis>(() => {
    const weatherFault =
      state.spaceWeatherMode &&
      state.spaceWeatherMode !== "NORMAL";

    if (
      state.missionHealth < 60 ||
      state.temperature > 55 ||
      state.battery < 30
    ) {
      return {
        severity: "CRITICAL",
        fault: "MULTI-SYSTEM SPACECRAFT DEGRADATION",
        cause:
          "Multiple engineering parameters have crossed critical operational thresholds.",
        affected: ["POWER", "THERMAL", "MISSION"],
        recommendation:
          "Reduce non-essential loads, stabilize the power network and execute spacecraft recovery before continuing the mission.",
        verification:
          "Mission health >70%, battery >40%, temperature <50°C.",
      };
    }

    if (state.communicationHealth < 75) {
      return {
        severity: "WARNING",
        fault: "COMMUNICATION LINK DEGRADATION",
        cause:
          "RF communication health has fallen below the preferred operational margin.",
        affected: ["COMMS", "RF", "MISSION"],
        recommendation:
          "Reduce RF stress and restore communication margin before critical command execution.",
        verification:
          "Communication health must recover above 85%.",
      };
    }

    if (state.cpuLoad > 80) {
      return {
        severity: "WARNING",
        fault: "FLIGHT COMPUTER OVERLOAD",
        cause:
          "Flight-computer utilization is approaching the high-load threshold.",
        affected: ["CPU", "POWER", "THERMAL"],
        recommendation:
          "Reduce computational workload and preserve processing and thermal margin.",
        verification:
          "CPU utilization must return below 70%.",
      };
    }

    if (state.temperature > 45) {
      return {
        severity: "WARNING",
        fault: "THERMAL STRESS",
        cause:
          "Spacecraft temperature is elevated because of increased engineering load.",
        affected: ["THERMAL", "POWER"],
        recommendation:
          "Reduce system load and allow the thermal network to recover.",
        verification:
          "Temperature must return below 45°C.",
      };
    }

    if (state.radiationLevel > 50 || weatherFault) {
      return {
        severity: "WARNING",
        fault:
          state.spaceWeatherMode === "MAGNETIC_DISTURBANCE"
            ? "SPACE WEATHER: MAGNETIC DISTURBANCE"
            : "ELEVATED SPACE WEATHER ENVIRONMENT",
        cause:
          "The environmental model is exposing the spacecraft to elevated space-weather conditions.",
        affected: ["SENSORS", "MEMORY", "COMMS", "MISSION"],
        recommendation:
          "Enter radiation-aware operating mode, reduce non-essential processing and maintain communication margin.",
        verification:
          "Radiation and environmental stress must return to the nominal operating envelope.",
      };
    }

    return {
      severity: "NOMINAL",
      fault: "NO ACTIVE ENGINEERING FAULT",
      cause:
        "Spacecraft telemetry is currently within nominal operational limits.",
      affected: ["NONE"],
      recommendation:
        "Continue monitoring the spacecraft causal network.",
      verification:
        "Maintain nominal mission health and subsystem margins.",
    };
  }, [
    state.missionHealth,
    state.temperature,
    state.battery,
    state.communicationHealth,
    state.cpuLoad,
    state.radiationLevel,
    state.spaceWeatherMode,
  ]);

  const severityClass =
    diagnosis.severity === "CRITICAL"
      ? "border-red-400/30 bg-red-400/10 text-red-300"
      : diagnosis.severity === "WARNING"
        ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
        : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";

  const executeRecovery = () => {
    setVerified(false);
    onRecover?.();
  };

  const verifySystem = () => {
    const passed =
      state.missionHealth >= 70 &&
      state.temperature < 50 &&
      state.communicationHealth >= 80 &&
      state.battery >= 40 &&
      state.radiationLevel < 70;

    setVerified(passed);
  };

  return (
    <section className="mt-6 rounded-3xl border border-cyan-400/20 bg-black/50 p-6 backdrop-blur-xl">

      <div className="text-xs font-semibold tracking-[0.35em] text-cyan-300">
        ASTRAFORGE-X // AI ENGINEERING CORE
      </div>

      <h2 className="mt-2 text-2xl font-bold text-white">
        AUTONOMOUS DIAGNOSIS & RECOVERY
      </h2>

      <p className="mt-1 text-xs tracking-[0.15em] text-slate-400">
        DETECT → DIAGNOSE → RECOMMEND → RECOVER → VERIFY
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Telemetry
          label="MISSION"
          value={`${state.missionHealth.toFixed(1)}%`}
        />

        <Telemetry
          label="BATTERY"
          value={`${state.battery.toFixed(1)}%`}
        />

        <Telemetry
          label="THERMAL"
          value={`${state.temperature.toFixed(1)}°C`}
        />

        <Telemetry
          label="COMMS"
          value={`${state.communicationHealth.toFixed(1)}%`}
        />
      </div>

      <div className={`mt-5 rounded-2xl border p-5 ${severityClass}`}>
        <div className="text-[10px] font-bold tracking-[0.3em]">
          AI ASSESSMENT // {diagnosis.severity}
        </div>

        <div className="mt-3 text-xl font-bold">
          {diagnosis.fault}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">

        <Panel
          title="ROOT CAUSE"
          text={diagnosis.cause}
        />

        <Panel
          title="AI RECOMMENDATION"
          text={diagnosis.recommendation}
        />

        <Panel
          title="VERIFICATION"
          text={diagnosis.verification}
        />

      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5">

        <div className="text-[9px] font-bold tracking-[0.3em] text-slate-500">
          AFFECTED SUBSYSTEMS
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {diagnosis.affected.map((system) => (
            <span
              key={system}
              className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 text-[10px] font-bold tracking-widest text-cyan-200"
            >
              {system}
            </span>
          ))}
        </div>

      </div>

      <div className="mt-5 flex flex-wrap gap-3">

        <button
          onClick={executeRecovery}
          disabled={diagnosis.severity === "NOMINAL"}
          className="rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-3 text-xs font-bold tracking-[0.15em] text-cyan-200 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          EXECUTE AI RECOVERY
        </button>

        <button
          onClick={verifySystem}
          className="rounded-xl border border-purple-400/40 bg-purple-400/10 px-5 py-3 text-xs font-bold tracking-[0.15em] text-purple-200 transition hover:bg-purple-400/20"
        >
          VERIFY SYSTEM
        </button>

      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-4">

        <div className="text-[10px] tracking-[0.3em] text-slate-500">
          VERIFICATION RESULT
        </div>

        <div
          className={`mt-2 text-sm font-bold ${
            verified
              ? "text-emerald-300"
              : "text-slate-400"
          }`}
        >
          {verified
            ? "✓ RECOVERY VERIFIED — SPACECRAFT WITHIN SAFE OPERATING ENVELOPE"
            : "WAITING FOR VERIFICATION COMMAND"}
        </div>

      </div>

      <div className="mt-5 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.02] p-4">

        <div className="text-[10px] tracking-[0.3em] text-cyan-300">
          AI CAUSAL TRACE
        </div>

        <div className="mt-2 text-xs leading-6 text-slate-300">
          ENVIRONMENT → SENSOR EFFECTS → MEMORY RISK → COMMUNICATION
          DEGRADATION → MISSION IMPACT → RECOVERY → VERIFICATION
        </div>

      </div>

    </section>
  );
}

function Telemetry({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
      <div className="text-[9px] tracking-[0.25em] text-slate-500">
        {label}
      </div>

      <div className="mt-2 text-lg font-bold text-white">
        {value}
      </div>
    </div>
  );
}

function Panel({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="text-[9px] font-bold tracking-[0.25em] text-cyan-300">
        {title}
      </div>

      <div className="mt-3 text-xs leading-6 text-slate-300">
        {text}
      </div>
    </div>
  );
}
