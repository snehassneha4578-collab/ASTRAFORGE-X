"use client";

import { useMemo, useState } from "react";
import type { SimulationState } from "@/types/simulation";
import type { ComponentControl } from "@/lib/simulation/componentControl";

type Props = {
  state: SimulationState;
  onControl?: (control: ComponentControl) => void;
  onVerified?: (expectedFaultType: string | null) => boolean;
};

type Problem =
  | "battery"
  | "solar"
  | "cpu"
  | "comms"
  | "radiation"
  | "thermal"
  | "power"
  | "adcs";

type Solution = {
  problem: string;
  severity: string;
  rootCause: string;
  propagation: string[];
  actions: string[];
  missionBefore: number;
  missionAfter: number;
  powerBefore: number;
  powerAfter: number;
  batteryBefore: number;
  batteryAfter: number;
  commsBefore: number;
  commsAfter: number;
  verification: string;
};

const clamp = (v: number) => Math.max(0, Math.min(100, v));

export default function SpacecraftProblemSolver({ state, onControl, onVerified }: Props) {


  const [problem, setProblem] = useState<Problem | null>(null);

  const [verified, setVerified] = useState(false);
  const [verificationResult, setVerificationResult] = useState<"passed" | "failed" | null>(null);
  const [baseline, setBaseline] = useState<{
    solarArray: number;
    cpuLoad: number;
    comms: number;
    thermalLoad: number;
    temperature: number;
    faultActive: boolean;
    faultType: string | null;
  } | null>(null);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [executed, setExecuted] = useState(false);

  const live = useMemo(
    () => ({
      mission: state.missionHealth,
      power: state.powerMargin,
      battery: state.battery,
      comms: state.communicationHealth,
      temperature: state.temperature,
      radiation: state.radiationLevel,
    }),
    [state]
  );

  const diagnose = (selected: Problem) => {
    let missionAfter = live.mission;
    let powerAfter = live.power;
    let batteryAfter = live.battery;
    let commsAfter = live.comms;

    let problemName = "";
    let severity = "HIGH";
    let rootCause = "";
    let propagation: string[] = [];
    let actions: string[] = [];

    switch (selected) {
      case "battery":
        problemName = "BATTERY RESERVE DEGRADATION";
        severity = live.battery < 30 ? "CRITICAL" : "HIGH";
        rootCause = "Insufficient energy reserve caused by load demand exceeding available stored energy.";
        propagation = [
          "BATTERY ?",
          "POWER MARGIN ?",
          "BUS VOLTAGE RISK ?",
          "CPU/RF MARGIN ?",
          "MISSION RISK ?",
        ];
        actions = [
          "Reduce non-critical electrical loads",
          "Prioritize flight computer and communications",
          "Enter energy conservation mode",
          "Restore available solar contribution",
          "Verify battery recovery",
        ];
        batteryAfter = clamp(live.battery + 18);
        powerAfter = clamp(live.power + 12);
        missionAfter = clamp(live.mission + 15);
        break;

      case "solar":
        problemName = "SOLAR GENERATION DEGRADATION";
        severity = "HIGH";
        rootCause = "Reduced solar-array generation decreases available spacecraft power.";
        propagation = [
          "SOLAR OUTPUT ?",
          "POWER GENERATION ?",
          "BATTERY DISCHARGE ?",
          "BUS MARGIN ?",
          "MISSION RISK ?",
        ];
        actions = [
          "Restore healthy solar-array contribution",
          "Prioritize essential loads",
          "Reduce non-critical power consumption",
          "Monitor battery charging",
          "Verify power margin",
        ];
        powerAfter = clamp(live.power + 18);
        batteryAfter = clamp(live.battery + 10);
        missionAfter = clamp(live.mission + 13);
        break;

      case "cpu":
        problemName = "FLIGHT COMPUTER OVERLOAD";
        severity = live.temperature > 70 ? "CRITICAL" : "HIGH";
        rootCause = "Flight-computer processing demand has exceeded the nominal operating envelope.";
        propagation = [
          "CPU LOAD ?",
          "THERMAL LOAD ?",
          "POWER CONSUMPTION ?",
          "CONTROL MARGIN ?",
          "MISSION RISK ?",
        ];
        actions = [
          "Reduce non-critical computation",
          "Prioritize flight-control tasks",
          "Throttle background processing",
          "Enable thermal relief",
          "Verify CPU recovery",
        ];
        powerAfter = clamp(live.power + 9);
        missionAfter = clamp(live.mission + 12);
        break;

      case "comms":
        problemName = "COMMUNICATION LINK DEGRADATION";
        severity = live.comms < 50 ? "CRITICAL" : "HIGH";
        rootCause = "RF link quality has fallen below the desired communication margin.";
        propagation = [
          "RF LINK ?",
          "TELEMETRY QUALITY ?",
          "GROUND CONTACT RISK ?",
          "COMMAND LATENCY ?",
          "MISSION RISK ?",
        ];
        actions = [
          "Increase communication priority",
          "Reduce non-essential RF traffic",
          "Reconfigure communication path",
          "Protect command and telemetry channels",
          "Verify RF link recovery",
        ];
        commsAfter = clamp(live.comms + 22);
        missionAfter = clamp(live.mission + 14);
        break;

      case "radiation":
        problemName = "RADIATION EVENT";
        severity = live.radiation > 70 ? "CRITICAL" : "HIGH";
        rootCause = "Elevated space radiation increases sensor noise and memory-error probability.";
        propagation = [
          "RADIATION ?",
          "SENSOR NOISE ?",
          "MEMORY ERROR RISK ?",
          "DATA INTEGRITY RISK ?",
          "MISSION RISK ?",
        ];
        actions = [
          "Enter radiation-safe operating mode",
          "Protect sensitive computing resources",
          "Increase error detection and correction",
          "Reduce non-essential processing",
          "Verify telemetry integrity",
        ];
        commsAfter = clamp(live.comms + 8);
        missionAfter = clamp(live.mission + 16);
        break;

      case "thermal":
        problemName = "THERMAL OVERLOAD";
        severity = live.temperature > 75 ? "CRITICAL" : "HIGH";
        rootCause = "Subsystem heat generation is approaching or exceeding the thermal operating envelope.";
        propagation = [
          "TEMPERATURE ?",
          "THERMAL MARGIN ?",
          "COMPONENT STRESS ?",
          "POWER LIMITATIONS ?",
          "MISSION RISK ?",
        ];
        actions = [
          "Enable thermal relief",
          "Reduce high-power subsystem activity",
          "Prioritize thermal-critical hardware",
          "Redistribute workload",
          "Verify temperature recovery",
        ];
        powerAfter = clamp(live.power + 7);
        missionAfter = clamp(live.mission + 11);
        break;

      case "power":
        problemName = "POWER BUS INSTABILITY";
        severity = live.power < 25 ? "CRITICAL" : "HIGH";
        rootCause = "Available electrical generation and spacecraft demand are approaching an unsafe balance.";
        propagation = [
          "POWER MARGIN ?",
          "BUS VOLTAGE RISK ?",
          "SUBSYSTEM AVAILABILITY ?",
          "BATTERY STRESS ?",
          "MISSION RISK ?",
        ];
        actions = [
          "Isolate non-critical loads",
          "Prioritize essential avionics",
          "Redistribute available power",
          "Protect battery reserve",
          "Verify bus stability",
        ];
        powerAfter = clamp(live.power + 20);
        batteryAfter = clamp(live.battery + 7);
        missionAfter = clamp(live.mission + 16);
        break;

      case "adcs":
        problemName = "ATTITUDE CONTROL ANOMALY";
        severity = "HIGH";
        rootCause = "Attitude-control performance has degraded, threatening spacecraft pointing stability.";
        propagation = [
          "ATTITUDE ERROR ?",
          "POINTING ACCURACY ?",
          "ANTENNA ALIGNMENT RISK ?",
          "SOLAR POINTING RISK ?",
          "MISSION RISK ?",
        ];
        actions = [
          "Switch to redundant attitude-control resources",
          "Reduce unnecessary maneuver activity",
          "Stabilize spacecraft attitude",
          "Prioritize communication and power pointing",
          "Verify attitude recovery",
        ];
        commsAfter = clamp(live.comms + 9);
        powerAfter = clamp(live.power + 6);
        missionAfter = clamp(live.mission + 13);
        break;
    }

    setProblem(selected);
    setExecuted(false);
    setVerified(false);

    setSolution({
      problem: problemName,
      severity,
      rootCause,
      propagation,
      actions,
      missionBefore: live.mission,
      missionAfter,
      powerBefore: live.power,
      powerAfter,
      batteryBefore: live.battery,
      batteryAfter,
      commsBefore: live.comms,
      commsAfter,
      verification: "Recovery simulation ready for execution.",
    });
  };

  const executeRecovery = () => {
    if (!solution || !problem || !onControl || executed) return;

    const commands: Partial<Record<Problem, ComponentControl>> = {
      solar: "SOLAR_RESTORE",
      cpu: "CPU_RECOVER",
      comms: "ANTENNA_RECOVER",
      thermal: "THERMAL_RELIEF",
    };

    const command = commands[problem];
    if (!command) return;

    setBaseline({
      solarArray: state.solarArray,
      cpuLoad: state.cpuLoad,
      comms: state.communicationHealth,
      thermalLoad: state.thermalLoad,
      temperature: state.temperature,
      faultActive: state.faultActive,
      faultType: state.faultType,
    });

    setVerificationResult(null);
    setVerified(false);
    onControl(command);
    setExecuted(true);
  };

  const verifyRecovery = () => {
    if (!solution || !executed || !baseline || !problem) return;

    let improved = false;

    switch (problem) {
      case "solar":
        improved = state.solarArray > baseline.solarArray;
        break;
      case "cpu":
        improved = state.cpuLoad < baseline.cpuLoad;
        break;
      case "comms":
        improved = state.communicationHealth > baseline.comms;
        break;
      case "thermal":
        improved =
          state.thermalLoad < baseline.thermalLoad ||
          state.temperature < baseline.temperature;
        break;
      default:
        improved = false;
    }

    const originalFaultUnchanged =
      !baseline.faultActive ||
      (state.faultActive && state.faultType === baseline.faultType);

    improved = improved && originalFaultUnchanged;


    const faultCleared =
      !baseline.faultActive ||
      (improved && (onVerified?.(baseline.faultType) ?? false));

    const passed = improved && faultCleared;

    setVerificationResult(passed ? "passed" : "failed");
    setVerified(passed);
  };
  const reset = () => {
    setProblem(null);
    setSolution(null);
    setExecuted(false);
    setVerified(false);
    setVerificationResult(null);
    setBaseline(null);
  };
  return (
    <section className="mt-6 rounded-3xl border border-red-400/20 bg-black/50 p-6 backdrop-blur-xl">

      <div className="text-xs font-semibold tracking-[0.35em] text-red-300">
        ASTRAFORGE-X // SPACECRAFT PROBLEM SOLVER
      </div>

      <h2 className="mt-2 text-2xl font-bold text-white">
        AI ENGINEERING RECOVERY CENTER
      </h2>

      <p className="mt-2 text-xs leading-6 text-slate-400">
        Detect a spacecraft problem, trace its causal propagation, generate
        an engineering solution, simulate recovery, execute the response,
        and verify the mission state.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

        <ProblemButton title="BATTERY" onClick={() => diagnose("battery")} />
        <ProblemButton title="SOLAR ARRAY" onClick={() => diagnose("solar")} />
        <ProblemButton title="CPU OVERLOAD" onClick={() => diagnose("cpu")} />
        <ProblemButton title="COMMS FAILURE" onClick={() => diagnose("comms")} />
        <ProblemButton title="RADIATION EVENT" onClick={() => diagnose("radiation")} />
        <ProblemButton title="THERMAL OVERLOAD" onClick={() => diagnose("thermal")} />
        <ProblemButton title="POWER BUS" onClick={() => diagnose("power")} />
        <ProblemButton title="ADCS ANOMALY" onClick={() => diagnose("adcs")} />

      </div>

      {solution && (
        <div className="mt-6 space-y-5">

          <div className="rounded-2xl border border-red-400/30 bg-red-400/5 p-5">

            <div className="flex flex-wrap items-center justify-between gap-3">

              <div>
                <div className="text-[9px] tracking-[0.3em] text-red-300">
                  SPACECRAFT PROBLEM DETECTED
                </div>

                <div className="mt-2 text-xl font-bold text-white">
                  {solution.problem}
                </div>
              </div>

              <div className="rounded-full border border-red-400/30 px-4 py-2 text-[10px] font-bold tracking-widest text-red-300">
                {solution.severity}
              </div>

            </div>

          </div>

          <div className="grid gap-5 lg:grid-cols-2">

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

              <div className="text-[9px] tracking-[0.3em] text-cyan-300">
                ROOT CAUSE
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                {solution.rootCause}
              </p>

              <div className="mt-5 text-[9px] tracking-[0.3em] text-purple-300">
                CAUSAL PROPAGATION
              </div>

              <div className="mt-3 space-y-2">
                {solution.propagation.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs font-semibold text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

              <div className="text-[9px] tracking-[0.3em] text-emerald-300">
                AI ENGINEERING SOLUTION
              </div>

              <div className="mt-3 space-y-2">
                {solution.actions.map((action, index) => (
                  <div
                    key={index}
                    className="flex gap-3 text-xs leading-5 text-slate-300"
                  >
                    <span className="font-bold text-emerald-300">
                      {index + 1}.
                    </span>
                    {action}
                  </div>
                ))}
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-purple-400/20 bg-purple-400/5 p-5">

            <div className="text-[9px] tracking-[0.3em] text-purple-300">
              RECOVERY PREDICTION
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <RecoveryMetric
                label="MISSION"
                before={solution.missionBefore}
                after={solution.missionAfter}
              />

              <RecoveryMetric
                label="POWER"
                before={solution.powerBefore}
                after={solution.powerAfter}
              />

              <RecoveryMetric
                label="BATTERY"
                before={solution.batteryBefore}
                after={solution.batteryAfter}
              />

              <RecoveryMetric
                label="COMMS"
                before={solution.commsBefore}
                after={solution.commsAfter}
              />

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={executeRecovery}
              disabled={!problem || !["solar", "cpu", "comms", "thermal"].includes(problem) || executed || !onControl}
              className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-5 py-3 text-xs font-bold tracking-widest text-emerald-300"
            >
              {executed ? "RECOVERY EXECUTED" : "EXECUTE RECOVERY"}
            </button>

            <button onClick={verifyRecovery} disabled={!executed} className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-bold tracking-wider text-emerald-300 disabled:cursor-not-allowed disabled:opacity-30">VERIFY SYSTEM</button>

            <button
              onClick={reset}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold tracking-widest text-slate-300"
            >
              RESET ANALYSIS
            </button>

          </div>

          {executed && (
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-4">

              <div className="text-[9px] tracking-[0.3em] text-emerald-300">
                RECOVERY EXECUTION
              </div>

              <div className="mt-2 text-sm font-bold text-white">
                Engineering recovery sequence executed in the simulation.
              </div>

            </div>
          )}

          {verified && (
            <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/5 p-5">

              <div className="text-[9px] tracking-[0.3em] text-cyan-300">
                ? VERIFICATION COMPLETE
              </div>

              <div className="mt-2 text-lg font-bold text-white">
                MISSION RECOVERY VERIFIED
              </div>

              <p className="mt-2 text-xs leading-6 text-slate-400">
                The proposed recovery produced a positive simulated response.
                Mission health, subsystem margins, and critical communication
                paths were re-evaluated.
              </p>

              <div className="mt-4 text-xs font-bold text-emerald-300">
                STATUS: MISSION SAFE
              </div>

            </div>
          )}

        </div>
      )}

        <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
          <div className="text-[9px] font-bold tracking-[0.25em] text-cyan-400">
            RECOVERY EXECUTION STATUS
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <div className="text-[8px] tracking-widest text-slate-500">
                DETECTION
              </div>
              <div className="mt-1 text-xs font-bold text-emerald-300">
                COMPLETE
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <div className="text-[8px] tracking-widest text-slate-500">
                RECOVERY
              </div>
              <div className="mt-1 text-xs font-bold text-cyan-300">
                {executed ? "EXECUTED" : "STANDBY"}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <div className="text-[8px] tracking-widest text-slate-500">
                VERIFICATION
              </div>
              <div className="mt-1 text-xs font-bold text-emerald-300">
                {verificationResult === "passed" ? "PASSED" : verificationResult === "failed" ? "FAILED" : "PENDING"}
              </div>
            </div>
          </div>

          {verified && (
            <div className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3">
              <div className="text-xs font-bold text-emerald-300">
                ? RECOVERY VERIFIED
              </div>
              <div className="mt-1 text-[10px] leading-5 text-slate-300">
                The engineering recovery sequence has been verified against
                the simulated spacecraft state.
              </div>
            </div>
          )}
        </div>
    {verificationResult === "failed" && (
      <div className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3">
        <div className="text-xs font-bold text-red-300">
          RECOVERY NOT VERIFIED
        </div>
        <div className="mt-1 text-[10px] leading-5 text-slate-300">
          FAILED — NO MEASURABLE IMPROVEMENT. The selected telemetry did not
          improve after recovery execution.
        </div>
      </div>
    )}
    </section>
  );
}

function ProblemButton({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-white/10 bg-white/[0.025] p-4 text-left transition hover:border-red-400/40 hover:bg-red-400/5"
    >
      <div className="text-[10px] font-bold tracking-widest text-slate-200">
        {title}
      </div>

      <div className="mt-2 text-[9px] tracking-widest text-slate-500">
        DETECT ? DIAGNOSE ? SOLVE
      </div>
    </button>
  );
}

function RecoveryMetric({
  label,
  before,
  after,
}: {
  label: string;
  before: number;
  after: number;
}) {
  const delta = after - before;

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">

      <div className="text-[9px] tracking-widest text-slate-500">
        {label}
      </div>

      <div className="mt-3 flex items-end justify-between">

        <div>
          <div className="text-[9px] text-slate-500">
            BEFORE
          </div>
          <div className="text-lg font-bold text-white">
            {before.toFixed(1)}
          </div>
        </div>

        <div className="text-slate-600">
          ?
        </div>

        <div>
          <div className="text-[9px] text-slate-500">
            AFTER
          </div>
          <div className="text-lg font-bold text-emerald-300">
            {after.toFixed(1)}
          </div>
        </div>

      </div>

      <div className="mt-2 text-[10px] font-bold text-emerald-300">
        {delta >= 0 ? "+" : ""}
        {delta.toFixed(1)}
      </div>



</div>
  );
}
