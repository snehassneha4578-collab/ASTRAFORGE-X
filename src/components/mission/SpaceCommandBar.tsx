"use client";

import {
  Play,
  Pause,
  RotateCcw,
  Rocket,
  BrainCircuit,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";

type Props = {
  running: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onMission: () => void;
};

export default function SpaceCommandBar({
  running,
  onStart,
  onStop,
  onReset,
  onMission,
}: Props) {
  return (
    <section className="relative z-20 mb-6 overflow-hidden rounded-2xl border border-cyan-400/20 bg-black/60 p-4 shadow-[0_0_45px_rgba(0,200,255,0.08)] backdrop-blur-xl">

      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[9px] font-black tracking-[0.35em] text-cyan-300">
            ASTRAFORGE-X // MISSION CONTROL
          </div>
          <div className="mt-1 text-xs font-bold tracking-widest text-white">
            SPACECRAFT EXECUTION COMMAND
          </div>
        </div>

        <div className={`flex items-center gap-2 text-[9px] font-bold tracking-widest ${
          running ? "text-green-400" : "text-slate-500"
        }`}>
          <span className={`h-2 w-2 rounded-full ${
            running ? "animate-pulse bg-green-400" : "bg-slate-600"
          }`} />
          {running ? "SIMULATION RUNNING" : "SIMULATION PAUSED"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">

        <button
          onClick={onStart}
          className="group flex items-center justify-center gap-2 rounded-xl border border-green-400/30 bg-green-400/10 px-3 py-3 text-[9px] font-black tracking-widest text-green-300 transition hover:border-green-300 hover:bg-green-400/20"
        >
          <Play size={14} className="group-hover:scale-110" />
          EXECUTE
        </button>

        <button
          onClick={onStop}
          className="group flex items-center justify-center gap-2 rounded-xl border border-yellow-400/25 bg-yellow-400/10 px-3 py-3 text-[9px] font-black tracking-widest text-yellow-300 transition hover:border-yellow-300 hover:bg-yellow-400/20"
        >
          <Pause size={14} className="group-hover:scale-110" />
          PAUSE
        </button>

        <button
          onClick={onReset}
          className="group flex items-center justify-center gap-2 rounded-xl border border-slate-400/25 bg-white/5 px-3 py-3 text-[9px] font-black tracking-widest text-slate-300 transition hover:border-slate-300 hover:bg-white/10"
        >
          <RotateCcw size={14} className="group-hover:rotate-180 transition-transform" />
          RESET
        </button>

        <button
          onClick={onMission}
          className="group flex items-center justify-center gap-2 rounded-xl border border-cyan-400/35 bg-cyan-400/10 px-3 py-3 text-[9px] font-black tracking-widest text-cyan-300 transition hover:border-cyan-300 hover:bg-cyan-400/20"
        >
          <Rocket size={14} className="group-hover:-translate-y-1 transition-transform" />
          RUN MISSION
        </button>

        <button
          onClick={() =>
            document
              .getElementById("ai-engineering")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="group flex items-center justify-center gap-2 rounded-xl border border-purple-400/30 bg-purple-400/10 px-3 py-3 text-[9px] font-black tracking-widest text-purple-300 transition hover:border-purple-300 hover:bg-purple-400/20"
        >
          <BrainCircuit size={14} />
          AI DIAGNOSE
        </button>

        <button
          onClick={() =>
            document
              .getElementById("mission-control")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="group flex items-center justify-center gap-2 rounded-xl border border-pink-400/30 bg-pink-400/10 px-3 py-3 text-[9px] font-black tracking-widest text-pink-300 transition hover:border-pink-300 hover:bg-pink-400/20"
        >
          <FlaskConical size={14} />
          WHAT-IF
        </button>

        <button
          onClick={onReset}
          className="group flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-3 text-[9px] font-black tracking-widest text-emerald-300 transition hover:border-emerald-300 hover:bg-emerald-400/20"
        >
          <ShieldCheck size={14} />
          SAFE RESET
        </button>

      </div>
    </section>
  );
}
