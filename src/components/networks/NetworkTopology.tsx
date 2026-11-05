"use client";

import { useMemo } from "react";

type NetworkState = {
  solar: number;
  battery: number;
  cpu: number;
  rf: number;
  sensors: number;
  thermal: number;
  comms: number;
  mission: number;
  fault: boolean;
  faultType: string | null;
};

type NodeProps = {
  x: number;
  y: number;
  label: string;
  value: number;
  unit?: string;
  icon: string;
  status?: "normal" | "warning" | "critical";
  onClick?: () => void;
};

function statusFromValue(value: number) {
  if (value >= 70) return "normal";
  if (value >= 40) return "warning";
  return "critical";
}

function Node({
  x,
  y,
  label,
  value,
  unit = "%",
  icon,
  status = "normal",
  onClick,
}: NodeProps) {
  const statusClass = {
    normal: "border-cyan-400/40 shadow-[0_0_24px_rgba(0,220,255,0.15)]",
    warning: "border-amber-400/60 shadow-[0_0_28px_rgba(245,158,11,0.18)]",
    critical: "border-red-500/70 shadow-[0_0_32px_rgba(239,68,68,0.25)]",
  }[status];

  const dotClass = {
    normal: "bg-cyan-300 shadow-[0_0_10px_#00eaff]",
    warning: "bg-amber-300 shadow-[0_0_10px_#f59e0b]",
    critical: "bg-red-400 shadow-[0_0_10px_#ef4444]",
  }[status];

  return (
    <button
      onClick={onClick}
      className={`absolute w-36 -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-slate-950/90 p-3 text-left backdrop-blur-xl transition duration-300 hover:scale-105 ${statusClass}`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xl">{icon}</span>
        <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      </div>

      <div className="mt-2 text-[10px] font-bold tracking-[0.18em] text-slate-400">
        {label}
      </div>

      <div className="mt-1 text-xl font-black text-white">
        {value.toFixed(1)}
        <span className="ml-1 text-xs text-slate-500">{unit}</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            status === "normal"
              ? "bg-cyan-400"
              : status === "warning"
                ? "bg-amber-400"
                : "bg-red-500"
          }`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </button>
  );
}

function Signal({
  x1,
  y1,
  x2,
  y2,
  active = true,
  critical = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active?: boolean;
  critical?: boolean;
}) {
  const length = Math.sqrt(
    Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2),
  );

  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  return (
    <div
      className={`absolute h-[2px] origin-left transition-all duration-500 ${
        critical
          ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)]"
          : active
            ? "bg-cyan-400 shadow-[0_0_10px_rgba(0,234,255,0.7)]"
            : "bg-slate-700"
      }`}
      style={{
        left: `${x1}%`,
        top: `${y1}%`,
        width: `${length}%`,
        transform: `rotate(${angle}deg)`,
      }}
    >
      {active && (
        <span
          className={`absolute -top-1 h-2 w-2 rounded-full ${
            critical ? "bg-red-300" : "bg-white"
          }`}
          style={{
            animation: "networkFlow 1.2s linear infinite",
          }}
        />
      )}
    </div>
  );
}

export default function NetworkTopology({
  state,
}: {
  state: NetworkState;
}) {
  const statuses = useMemo(
    () => ({
      solar: statusFromValue(state.solar),
      battery: statusFromValue(state.battery),
      cpu: statusFromValue(100 - state.cpu),
      rf: statusFromValue(state.comms),
      sensors: statusFromValue(state.sensors),
      thermal: statusFromValue(100 - state.thermal),
      mission: statusFromValue(state.mission),
    }),
    [state],
  );

  const critical = state.fault;

  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-black/40 p-5 shadow-[0_0_60px_rgba(0,200,255,0.08)] backdrop-blur-xl">

      <style>{`
        @keyframes networkFlow {
          from {
            left: 0%;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          to {
            left: 100%;
            opacity: 0;
          }
        }

        @keyframes nodePulse {
          0%, 100% {
            opacity: .55;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>

      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">

        <div>
          <div className="text-[10px] font-bold tracking-[0.35em] text-cyan-300">
            ASTRAFORGE-X / ENGINEERING NETWORK
          </div>

          <h2 className="mt-1 text-2xl font-black text-white">
            CAUSAL SYSTEM TOPOLOGY
          </h2>

          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Live spacecraft engineering dependencies. Signals propagate
            through the network as the simulation state changes.
          </p>
        </div>

        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-right">
          <div className="text-[9px] tracking-[0.25em] text-slate-500">
            NETWORK STATE
          </div>
          <div className="text-sm font-black text-cyan-300">
            {critical ? "FAULT PROPAGATING" : "NOMINAL"}
          </div>
        </div>

      </div>

      <div className="relative mt-5 h-[600px] overflow-hidden rounded-2xl border border-white/5 bg-[#030711]">

        {/* engineering grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,220,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,220,255,.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* flow lines */}
        <Signal x1={10} y1={18} x2={28} y2={35} critical={state.solar < 40} />
        <Signal x1={28} y1={35} x2={48} y2={50} critical={state.battery < 40} />
        <Signal x1={48} y1={50} x2={68} y2={32} critical={state.cpu > 85} />
        <Signal x1={48} y1={50} x2={68} y2={68} critical={state.comms < 50} />
        <Signal x1={48} y1={50} x2={28} y2={68} critical={state.sensors < 40} />
        <Signal x1={68} y1={32} x2={88} y2={50} critical={state.thermal > 80} />
        <Signal x1={68} y1={68} x2={88} y2={50} critical={state.comms < 50} />
        <Signal x1={28} y1={68} x2={48} y2={50} critical={state.sensors < 40} />

        {/* labels on network paths */}
        <div className="absolute left-[17%] top-[23%] text-[9px] tracking-widest text-cyan-500">
          POWER
        </div>

        <div className="absolute left-[35%] top-[39%] text-[9px] tracking-widest text-cyan-500">
          BUS
        </div>

        <div className="absolute left-[57%] top-[38%] text-[9px] tracking-widest text-purple-400">
          COMPUTE
        </div>

        <div className="absolute left-[57%] top-[58%] text-[9px] tracking-widest text-blue-400">
          COMMS
        </div>

        <div className="absolute left-[34%] top-[58%] text-[9px] tracking-widest text-green-400">
          SENSOR
        </div>

        {/* nodes */}
        <Node
          x={10}
          y={18}
          label="SOLAR ARRAY"
          value={state.solar}
          icon="☀️"
          status={statuses.solar as NodeProps["status"]}
        />

        <Node
          x={28}
          y={35}
          label="MPPT / CHARGE"
          value={Math.min(100, state.solar + 8)}
          icon="⚡"
          status={statuses.solar as NodeProps["status"]}
        />

        <Node
          x={48}
          y={50}
          label="POWER BUS"
          value={state.battery}
          icon="🔋"
          status={statuses.battery as NodeProps["status"]}
        />

        <Node
          x={68}
          y={32}
          label="FLIGHT COMPUTER"
          value={Math.max(0, 100 - state.cpu)}
          icon="🧠"
          status={statuses.cpu as NodeProps["status"]}
        />

        <Node
          x={68}
          y={68}
          label="RF TRANSCEIVER"
          value={state.comms}
          icon="📡"
          status={statuses.rf as NodeProps["status"]}
        />

        <Node
          x={28}
          y={68}
          label="SENSOR ARRAY"
          value={state.sensors}
          icon="◉"
          status={statuses.sensors as NodeProps["status"]}
        />

        <Node
          x={88}
          y={50}
          label="MISSION CORE"
          value={state.mission}
          icon="🚀"
          status={statuses.mission as NodeProps["status"]}
        />

        {/* thermal warning */}
        <div
          className={`absolute left-[68%] top-[12%] -translate-x-1/2 rounded-xl border px-4 py-2 text-center ${
            state.thermal > 70
              ? "border-red-500/50 bg-red-500/10 text-red-300"
              : "border-orange-400/20 bg-orange-400/5 text-orange-300"
          }`}
        >
          <div className="text-[9px] tracking-[0.25em]">
            THERMAL LOAD
          </div>
          <div className="text-lg font-black">
            {state.thermal.toFixed(1)}%
          </div>
        </div>

        {/* fault event */}
        {state.fault && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-xl border border-red-500/50 bg-red-950/70 px-6 py-3 text-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <div className="text-[9px] font-bold tracking-[0.3em] text-red-300">
              ACTIVE FAULT
            </div>
            <div className="mt-1 text-sm font-black text-white">
              {state.faultType ?? "SYSTEM FAULT"}
            </div>
            <div className="mt-1 text-[10px] text-red-300">
              SIGNAL PROPAGATION ACTIVE
            </div>
          </div>
        )}

      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <div className="text-[9px] tracking-widest text-slate-500">
            POWER PATH
          </div>
          <div className="mt-1 text-sm font-bold text-cyan-300">
            SOLAR → BUS
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <div className="text-[9px] tracking-widest text-slate-500">
            DATA PATH
          </div>
          <div className="mt-1 text-sm font-bold text-purple-300">
            SENSOR → CPU
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <div className="text-[9px] tracking-widest text-slate-500">
            RF PATH
          </div>
          <div className="mt-1 text-sm font-bold text-blue-300">
            RF → MISSION
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <div className="text-[9px] tracking-widest text-slate-500">
            CAUSAL MODE
          </div>
          <div className={`mt-1 text-sm font-bold ${
            critical ? "text-red-300" : "text-green-300"
          }`}>
            {critical ? "FAULT TRACE" : "NOMINAL"}
          </div>
        </div>

      </div>

    </section>
  );
}
