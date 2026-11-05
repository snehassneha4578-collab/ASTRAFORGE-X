"use client";

import { useMemo, useState } from "react";
import {
  DEFAULT_MISSION,
  MissionConfig,
} from "@/lib/mission/missionConfig";

type MissionDesignerProps = {
  onMissionBuilt?: (mission: MissionConfig) => void;
};

const OPTIONS = {
  objective: ["Earth Observation", "Deep Space Science", "Planetary Mapping", "Space Weather"],
  orbit: ["LEO", "MEO", "GEO", "POLAR", "SSO"],
  launchVehicle: ["Light Launcher", "Medium Launcher", "Heavy Launcher"],
  spacecraft: ["Compact Bus", "Standard Bus", "Advanced Bus"],
  payload: ["Camera", "Spectrometer", "Radiometer", "Magnetometer"],
  solar: ["Standard Array", "High-Efficiency Array", "Deployable Array"],
  battery: ["Standard Battery", "High-Capacity Battery", "Radiation-Hardened Battery"],
  communications: ["UHF", "S-Band", "X-Band", "High-Gain Deep Space"],
};

export default function MissionDesigner({
  onMissionBuilt,
}: MissionDesignerProps) {
  const [config, setConfig] = useState({
    objective: DEFAULT_MISSION.objective,
    orbit: DEFAULT_MISSION.orbit,
    launchVehicle: DEFAULT_MISSION.launchVehicle,
    spacecraft: DEFAULT_MISSION.spacecraft,
    payload: DEFAULT_MISSION.payload,
    solar: DEFAULT_MISSION.solar,
    battery: DEFAULT_MISSION.battery,
    communications: DEFAULT_MISSION.communications,
  });

  const [built, setBuilt] = useState(false);

  const metrics = useMemo(() => {
    let budget = 100;
    let mass = 180;
    let power = 62;
    let communicationsScore = 72;
    let risk = 18;
    let science = 60;

    if (config.orbit === "GEO") {
      budget += 20;
      mass += 70;
      power -= 8;
      risk += 10;
    }

    if (config.orbit === "MEO") {
      budget += 8;
      mass += 35;
      power -= 4;
      risk += 5;
    }

    if (config.orbit === "SSO" || config.orbit === "POLAR") {
      science += 8;
    }

    if (config.orbit === "GEO") {
      communicationsScore += 8;
    }

    if (config.launchVehicle === "Light Launcher") {
      budget -= 8;
      mass -= 30;
      risk += 8;
    }

    if (config.launchVehicle === "Heavy Launcher") {
      budget += 15;
      mass += 35;
      risk -= 5;
    }

    if (config.spacecraft === "Compact Bus") {
      mass -= 35;
      power -= 8;
      risk += 6;
    }

    if (config.spacecraft === "Advanced Bus") {
      budget += 15;
      mass += 25;
      power += 15;
      risk -= 6;
    }

    if (config.payload === "Spectrometer") {
      mass += 15;
      power -= 5;
      science += 18;
    }

    if (config.payload === "Radiometer") {
      power -= 3;
      science += 12;
    }

    if (config.payload === "Magnetometer") {
      mass += 8;
      science += 15;
    }

    if (config.solar === "High-Efficiency Array") {
      power += 18;
      mass += 10;
      budget -= 8;
    }

    if (config.solar === "Deployable Array") {
      power += 25;
      mass += 18;
      budget -= 12;
    }

    if (config.battery === "High-Capacity Battery") {
      power += 10;
      mass += 15;
      budget -= 7;
    }

    if (config.battery === "Radiation-Hardened Battery") {
      power += 5;
      mass += 20;
      budget -= 12;
      risk -= 8;
    }

    if (config.communications === "UHF") {
      communicationsScore -= 12;
      budget += 4;
    }

    if (config.communications === "X-Band") {
      communicationsScore += 12;
      budget -= 8;
    }

    if (config.communications === "High-Gain Deep Space") {
      communicationsScore += 22;
      budget -= 18;
      mass += 12;
    }

    const missionScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          science +
            power * 0.18 +
            communicationsScore * 0.18 +
            (100 - risk) * 0.2 +
            budget * 0.12 -
            Math.max(0, mass - 400) * 0.05
        )
      )
    );

    return {
      budget: Math.max(0, Math.round(budget)),
      mass: Math.max(0, Math.round(mass)),
      power: Math.max(0, Math.min(100, Math.round(power))),
      communicationsScore: Math.max(
        0,
        Math.min(100, Math.round(communicationsScore))
      ),
      risk: Math.max(0, Math.min(100, Math.round(risk))),
      science: Math.max(0, Math.min(100, Math.round(science))),
      missionScore,
    };
  }, [config]);

  const update = (
    key: keyof typeof config,
    value: string
  ) => {
    setBuilt(false);
    setConfig((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const buildMission = () => {
    const mission: MissionConfig = {
      ...config,
      ...metrics,
    };

    setBuilt(true);
    onMissionBuilt?.(mission);
  };

  return (
    <section className="relative mb-6 overflow-hidden rounded-2xl border border-cyan-400/20 bg-black/50 p-5 shadow-2xl backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,220,255,0.12),transparent_35%)]" />

      <div className="relative">
        <div className="mb-5">
          <div className="text-[9px] font-bold tracking-[0.35em] text-cyan-400">
            ASTRAFORGE-X // MISSION DESIGNER
          </div>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
            BUILD YOUR SPACE MISSION
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Every engineering choice changes mass, power, budget, risk and mission success.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {(Object.keys(OPTIONS) as Array<keyof typeof OPTIONS>).map((key) => (
            <label key={key} className="block">
              <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500">
                {key.replace(/([A-Z])/g, " $1")}
              </span>

              <select
                value={config[key]}
                onChange={(e) => update(key, e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-3 text-xs font-semibold text-white outline-none transition hover:border-cyan-400/40 focus:border-cyan-400/60"
              >
                {OPTIONS[key].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {[
            ["BUDGET", `$${metrics.budget}M`],
            ["MASS", `${metrics.mass} kg`],
            ["POWER", `${metrics.power}%`],
            ["COMMS", `${metrics.communicationsScore}%`],
            ["RISK", `${metrics.risk}%`],
            ["SCIENCE", `${metrics.science}%`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-white/[0.025] p-3"
            >
              <div className="text-[8px] tracking-[0.2em] text-slate-500">
                {label}
              </div>

              <div className="mt-1 text-lg font-black text-cyan-300">
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-4 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.03] p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[9px] tracking-[0.25em] text-slate-500">
              PREDICTED MISSION SUCCESS
            </div>

            <div className="mt-1 text-4xl font-black text-white">
              {metrics.missionScore}%
            </div>
          </div>

          <button
            onClick={buildMission}
            className="rounded-xl border border-cyan-300/40 bg-cyan-400/10 px-6 py-3 text-xs font-black tracking-[0.18em] text-cyan-200 transition hover:bg-cyan-400/20"
          >
            {built ? "MISSION CONFIGURED ✓" : "BUILD MISSION"}
          </button>
        </div>

        {built && (
          <div className="mt-4 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.05] p-4">
            <div className="text-xs font-black tracking-[0.18em] text-emerald-300">
              MISSION CONFIGURATION LOCKED
            </div>

            <div className="mt-2 text-[10px] leading-5 text-slate-300">
              Mission parameters are ready to drive the spacecraft digital twin.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
