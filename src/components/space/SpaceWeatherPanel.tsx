"use client";


import {
  Sun,
  Wind,
  Radiation,
  Magnet,
  Zap,
  Satellite,
} from "lucide-react";

type SpaceWeatherMode =
  | "NORMAL"
  | "HIGH_SOLAR"
  | "RADIATION_BURST"
  | "SOLAR_STORM"
  | "MAGNETIC_DISTURBANCE";

type Props = {
  mode: SpaceWeatherMode;
  onEnvironmentChange?: (mode: SpaceWeatherMode) => void;
};

const MODES = [
  {
    id: "NORMAL" as const,
    label: "NORMAL",
    icon: Sun,
    color: "cyan",
    radiation: 12,
    solarWind: 18,
    magnetic: 20,
    risk: 4,
  },
  {
    id: "HIGH_SOLAR" as const,
    label: "HIGH SOLAR",
    icon: Sun,
    color: "amber",
    radiation: 38,
    solarWind: 52,
    magnetic: 35,
    risk: 18,
  },
  {
    id: "RADIATION_BURST" as const,
    label: "RADIATION BURST",
    icon: Radiation,
    color: "red",
    radiation: 92,
    solarWind: 68,
    magnetic: 48,
    risk: 71,
  },
  {
    id: "SOLAR_STORM" as const,
    label: "SOLAR STORM",
    icon: Zap,
    color: "pink",
    radiation: 86,
    solarWind: 94,
    magnetic: 88,
    risk: 84,
  },
  {
    id: "MAGNETIC_DISTURBANCE" as const,
    label: "MAGNETIC DISTURBANCE",
    icon: Magnet,
    color: "purple",
    radiation: 54,
    solarWind: 61,
    magnetic: 96,
    risk: 52,
  },
];

export default function SpaceWeatherPanel({
  mode,
  onEnvironmentChange,
}: Props) {

  const active =
    MODES.find((item) => item.id === mode) ?? MODES[0];

  const selectMode = (next: SpaceWeatherMode) => {
    onEnvironmentChange?.(next);
  };

  return (
    <section className="relative z-20 mt-6 overflow-hidden rounded-2xl border border-cyan-400/15 bg-black/60 p-5 backdrop-blur-xl">

      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-[9px] font-black tracking-[0.35em] text-cyan-300">
            ASTRAFORGE-X // SPACE ENVIRONMENT
          </div>

          <div className="mt-1 text-sm font-black tracking-widest text-white">
            SPACE WEATHER & ORBITAL ENVIRONMENT
          </div>

          <div className="mt-1 text-[9px] tracking-[0.18em] text-slate-500">
            ENVIRONMENTAL CONDITIONS AFFECT SPACECRAFT HEALTH
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-red-400/20 bg-red-400/5 px-3 py-2 text-[8px] font-bold tracking-widest text-red-300 sm:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
          LIVE ENVIRONMENT MODEL
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-5">
        {MODES.map((item) => {
          const Icon = item.icon;
          const selected = mode === item.id;

          return (
            <button
              key={item.id}
              onClick={() => selectMode(item.id)}
              className={`group rounded-xl border p-3 text-left transition-all ${
                selected
                  ? "border-cyan-300/50 bg-cyan-300/10 shadow-[0_0_25px_rgba(0,200,255,0.12)]"
                  : "border-white/10 bg-white/[0.025] hover:border-cyan-300/25 hover:bg-white/[0.05]"
              }`}
            >
              <Icon
                size={17}
                className={`mb-3 ${
                  selected
                    ? "text-cyan-300"
                    : "text-slate-500"
                }`}
              />

              <div className="text-[8px] font-black tracking-[0.14em] text-white">
                {item.label}
              </div>

              <div className="mt-2 text-[7px] tracking-widest text-slate-500">
                ENVIRONMENT MODE
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">

        <Metric
          label="RADIATION"
          value={active.radiation}
          unit="%"
          icon={<Radiation size={14} />}
        />

        <Metric
          label="SOLAR WIND"
          value={active.solarWind}
          unit="%"
          icon={<Wind size={14} />}
        />

        <Metric
          label="MAGNETIC DISTURBANCE"
          value={active.magnetic}
          unit="%"
          icon={<Magnet size={14} />}
        />

        <Metric
          label="MISSION RISK"
          value={active.risk}
          unit="%"
          icon={<Satellite size={14} />}
        />

      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">

        <div className="mb-3 flex items-center justify-between">
          <div className="text-[8px] font-black tracking-[0.2em] text-slate-400">
            CAUSAL ENVIRONMENT CHAIN
          </div>

          <div className="text-[8px] font-bold tracking-widest text-cyan-300">
            {active.label}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[8px] font-bold tracking-widest">

          <Node text="SOLAR EVENT" />

          <Arrow />

          <Node text="RADIATION ↑" />

          <Arrow />

          <Node text="SENSOR NOISE ↑" />

          <Arrow />

          <Node text="MEMORY ERROR RISK ↑" />

          <Arrow />

          <Node text="COMMS ↓" />

          <Arrow />

          <Node text="MISSION RISK ↑" />

        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">

        <OrbitalBadge name="LEO" altitude="160–2,000 km" />
        <OrbitalBadge name="MEO" altitude="2,000–35,786 km" />
        <OrbitalBadge name="GEO" altitude="35,786 km" />
        <OrbitalBadge name="POLAR" altitude="GLOBAL COVERAGE" />
        <OrbitalBadge name="SSO" altitude="SUN-SYNCHRONOUS" />

      </div>

    </section>
  );
}

function Metric({
  label,
  value,
  unit,
  icon,
}: {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">

      <div className="flex items-center gap-2 text-[8px] font-bold tracking-widest text-slate-500">
        {icon}
        {label}
      </div>

      <div className="mt-3 text-xl font-black text-white">
        {value}
        <span className="ml-1 text-xs text-slate-500">
          {unit}
        </span>
      </div>

      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>

    </div>
  );
}

function Node({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-cyan-400/15 bg-cyan-400/5 px-3 py-2 text-cyan-200">
      {text}
    </div>
  );
}

function Arrow() {
  return (
    <span className="text-cyan-500/50">→</span>
  );
}

function OrbitalBadge({
  name,
  altitude,
}: {
  name: string;
  altitude: string;
}) {
  return (
    <div className="rounded-lg border border-purple-400/15 bg-purple-400/5 px-3 py-3">
      <div className="text-[9px] font-black tracking-widest text-purple-300">
        {name}
      </div>
      <div className="mt-1 text-[7px] tracking-wider text-slate-500">
        {altitude}
      </div>
    </div>
  );
}
