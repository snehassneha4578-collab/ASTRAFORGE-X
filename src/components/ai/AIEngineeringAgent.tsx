"use client";

import { useMemo } from "react";
import {
  BrainCircuit,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Search,
  GitBranch,
  Wrench,
  CheckCircle2,
} from "lucide-react";

type AIState = {
  solar: number;
  battery: number;
  cpu: number;
  rf: number;
  sensors: number;
  thermal: number;
  comms: number;
  radiation: number;
  mission: number;
  powerMargin: number;
  fault: boolean;
  faultType: string | null;
};

type Diagnosis = {
  severity: "NOMINAL" | "WARNING" | "CRITICAL";
  title: string;
  rootCause: string;
  propagation: string[];
  impact: string;
  recovery: string[];
  confidence: number;
};

function analyze(state: AIState): Diagnosis {
  if (state.faultType === "RADIATION_BURST") {
    return {
      severity: "CRITICAL",
      title: "RADIATION-INDUCED COMMUNICATION DEGRADATION",
      rootCause:
        "Elevated radiation environment is degrading spacecraft communication reliability.",
      propagation: [
        "Radiation burst detected",
        "Radiation level increased",
        "RF communication reliability degraded",
        "Telemetry confidence reduced",
        "Mission risk increased",
      ],
      impact:
        "Spacecraft may experience reduced telemetry availability and intermittent ground communication.",
      recovery: [
        "Enter radiation-safe operating mode",
        "Reduce non-essential compute load",
        "Prioritize command and telemetry packets",
        "Monitor RF link recovery",
      ],
      confidence: 94,
    };
  }

  if (state.faultType === "SOLAR_DEGRADATION") {
    return {
      severity: "CRITICAL",
      title: "POWER GENERATION DEGRADATION",
      rootCause:
        "Solar-array generation has fallen below the nominal power-generation profile.",
      propagation: [
        "Solar generation reduced",
        "Available power margin decreased",
        "Battery discharge pressure increased",
        "Subsystem resource margin reduced",
        "Mission resilience decreased",
      ],
      impact:
        "Continued degradation may force load shedding and eventually threaten mission continuity.",
      recovery: [
        "Prioritize critical spacecraft loads",
        "Reduce non-essential CPU activity",
        "Preserve battery reserve",
        "Evaluate redundant power path",
      ],
      confidence: 97,
    };
  }

  if (state.faultType === "BATTERY_FAILURE") {
    return {
      severity: "CRITICAL",
      title: "ENERGY STORAGE ANOMALY",
      rootCause:
        "Battery reserve has experienced a significant reduction.",
      propagation: [
        "Battery reserve decreased",
        "Power buffering capability reduced",
        "Load transients become more dangerous",
        "Subsystem resilience decreased",
        "Mission margin reduced",
      ],
      impact:
        "The spacecraft has reduced ability to survive periods of low solar generation.",
      recovery: [
        "Minimize non-critical loads",
        "Prioritize flight computer and communications",
        "Increase solar charging opportunity",
        "Activate redundant energy-management strategy",
      ],
      confidence: 96,
    };
  }

  if (state.faultType === "CPU_OVERLOAD") {
    return {
      severity: "CRITICAL",
      title: "FLIGHT COMPUTER RESOURCE SATURATION",
      rootCause:
        "Flight-computer processing demand has exceeded the nominal operating envelope.",
      propagation: [
        "CPU utilization increased",
        "Compute thermal load increased",
        "Spacecraft temperature increased",
        "Available processing margin decreased",
        "Mission risk increased",
      ],
      impact:
        "Sustained overload can reduce responsiveness and increase thermal stress.",
      recovery: [
        "Reduce non-critical computation",
        "Prioritize flight-control tasks",
        "Throttle background workloads",
        "Monitor thermal recovery",
      ],
      confidence: 95,
    };
  }

  if (state.faultType === "RF_DEGRADATION") {
    return {
      severity: "CRITICAL",
      title: "RF COMMUNICATION LINK DEGRADATION",
      rootCause:
        "RF subsystem loading has increased while communication health has decreased.",
      propagation: [
        "RF load increased",
        "Communication margin decreased",
        "Packet reliability degraded",
        "Ground-link confidence decreased",
        "Mission communication risk increased",
      ],
      impact:
        "Reduced communication reliability can delay commands and telemetry exchange.",
      recovery: [
        "Reduce RF subsystem load",
        "Prioritize mission-critical packets",
        "Increase communication redundancy",
        "Search for alternate ground-link opportunity",
      ],
      confidence: 93,
    };
  }

  if (state.thermal > 70) {
    return {
      severity: "WARNING",
      title: "THERMAL LOAD ELEVATED",
      rootCause:
        "Spacecraft computational or subsystem activity is generating elevated thermal load.",
      propagation: [
        "Subsystem load increased",
        "Thermal generation increased",
        "Spacecraft temperature increased",
        "Thermal margin decreased",
      ],
      impact:
        "Continued thermal loading could reduce subsystem reliability.",
      recovery: [
        "Reduce non-essential processing",
        "Monitor temperature trend",
        "Prioritize thermal management",
      ],
      confidence: 89,
    };
  }

  if (state.comms < 70) {
    return {
      severity: "WARNING",
      title: "COMMUNICATION MARGIN REDUCED",
      rootCause:
        "Communication health is below the nominal operating threshold.",
      propagation: [
        "Communication margin reduced",
        "Packet reliability may decrease",
        "Telemetry confidence reduced",
      ],
      impact:
        "Mission control may experience delayed or incomplete telemetry.",
      recovery: [
        "Prioritize critical packets",
        "Monitor link quality",
        "Evaluate alternate communication path",
      ],
      confidence: 87,
    };
  }

  return {
    severity: "NOMINAL",
    title: "SPACECRAFT OPERATING NOMINALLY",
    rootCause:
      "No major causal anomaly detected in the current simulation state.",
    propagation: [
      "Power generation nominal",
      "Battery reserve stable",
      "Compute load within limits",
      "Communication link healthy",
      "Mission state stable",
    ],
    impact:
      "Current engineering margins support continued simulated mission operations.",
    recovery: [
      "Continue monitoring",
      "Maintain current configuration",
      "Run periodic verification",
    ],
    confidence: 98,
  };
}

export default function AIEngineeringAgent({
  state,
}: {
  state: AIState;
}) {
  const diagnosis = useMemo(() => analyze(state), [state]);

  const severityClass =
    diagnosis.severity === "CRITICAL"
      ? "border-red-500/40 bg-red-500/5 text-red-300"
      : diagnosis.severity === "WARNING"
        ? "border-amber-400/40 bg-amber-400/5 text-amber-300"
        : "border-emerald-400/40 bg-emerald-400/5 text-emerald-300";

  return (
    <section className="rounded-3xl border border-purple-400/20 bg-black/40 p-5 shadow-[0_0_70px_rgba(168,85,247,0.08)] backdrop-blur-xl">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div className="flex gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/30 bg-purple-400/10 text-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
            <BrainCircuit size={30} />
          </div>

          <div>
            <div className="text-[10px] font-bold tracking-[0.35em] text-purple-300">
              ASTRAFORGE-X / AI ENGINEERING CORE
            </div>

            <h2 className="mt-1 text-2xl font-black text-white">
              AUTONOMOUS ENGINEERING INTELLIGENCE
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Causal analysis of live spacecraft telemetry, faults and
              engineering dependencies.
            </p>
          </div>

        </div>

        <div className={`rounded-xl border px-4 py-2 text-center ${severityClass}`}>
          <div className="text-[9px] font-bold tracking-[0.3em]">
            AI STATUS
          </div>

          <div className="mt-1 text-sm font-black">
            {diagnosis.severity}
          </div>
        </div>

      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">

        {/* diagnosis */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5">

          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-slate-400">
            <Search size={15} />
            CURRENT DIAGNOSIS
          </div>

          <h3 className="mt-3 text-xl font-black text-white">
            {diagnosis.title}
          </h3>

          <div className="mt-5 rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-4">

            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-cyan-300">
              <Activity size={14} />
              ROOT CAUSE
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              {diagnosis.rootCause}
            </p>

          </div>

          {/* propagation */}
          <div className="mt-5">

            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-purple-300">
              <GitBranch size={14} />
              CAUSAL PROPAGATION
            </div>

            <div className="mt-3 space-y-2">

              {diagnosis.propagation.map((step, index) => (
                <div
                  key={`${step}-${index}`}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-purple-400/30 text-[10px] font-bold text-purple-300">
                    {index + 1}
                  </div>

                  <div className="text-xs text-slate-300">
                    {step}
                  </div>
                </div>
              ))}

            </div>

          </div>

        </div>

        {/* mission impact */}
        <div className="space-y-4">

          <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5">

            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-amber-300">
              <AlertTriangle size={14} />
              MISSION IMPACT
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {diagnosis.impact}
            </p>

            <div className="mt-5">

              <div className="mb-2 flex justify-between text-[10px]">
                <span className="text-slate-500">
                  AI CONFIDENCE
                </span>

                <span className="font-bold text-white">
                  {diagnosis.confidence}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-purple-400 transition-all duration-700"
                  style={{
                    width: `${diagnosis.confidence}%`,
                  }}
                />
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.03] p-5">

            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-emerald-300">
              <Wrench size={14} />
              AI RECOVERY PLAN
            </div>

            <div className="mt-3 space-y-2">

              {diagnosis.recovery.map((action, index) => (
                <div
                  key={`${action}-${index}`}
                  className="flex gap-3 rounded-lg bg-black/20 p-2.5"
                >
                  <CheckCircle2
                    size={15}
                    className="mt-0.5 shrink-0 text-emerald-300"
                  />

                  <span className="text-xs text-slate-300">
                    {action}
                  </span>
                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

      {/* AI pipeline */}
      <div className="mt-5 rounded-2xl border border-purple-400/10 bg-purple-400/[0.025] p-4">

        <div className="mb-3 text-[9px] font-bold tracking-[0.3em] text-purple-300">
          AI ENGINEERING PIPELINE
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-7">

          {[
            ["OBSERVE", "Live telemetry"],
            ["DETECT", "Anomaly scan"],
            ["TRACE", "Causal graph"],
            ["DIAGNOSE", "Root cause"],
            ["SIMULATE", "What-if"],
            ["PLAN", "Recovery"],
            ["VERIFY", "Safety check"],
          ].map(([name, description], index) => (
            <div
              key={name}
              className="rounded-xl border border-white/5 bg-black/20 p-3"
            >
              <div className="text-[9px] font-black text-purple-300">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="mt-2 text-[10px] font-black text-white">
                {name}
              </div>

              <div className="mt-1 text-[9px] text-slate-500">
                {description}
              </div>
            </div>
          ))}

        </div>

      </div>

      {/* telemetry snapshot */}
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">

        {[
          ["SOLAR", state.solar],
          ["BATTERY", state.battery],
          ["CPU", state.cpu],
          ["RF", state.rf],
          ["SENSORS", state.sensors],
          ["THERMAL", state.thermal],
          ["COMMS", state.comms],
          ["MISSION", state.mission],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-white/5 bg-black/20 p-3"
          >
            <div className="text-[8px] tracking-[0.2em] text-slate-500">
              {label}
            </div>

            <div className="mt-1 text-sm font-black text-white">
              {Number(value).toFixed(1)}%
            </div>
          </div>
        ))}

      </div>

      <div className="mt-4 flex items-center gap-2 text-[9px] tracking-[0.2em] text-slate-500">
        <ShieldCheck size={13} className="text-emerald-400" />
        AI analysis is derived from the current ASTRAFORGE-X simulation state.
      </div>

    </section>
  );
}
