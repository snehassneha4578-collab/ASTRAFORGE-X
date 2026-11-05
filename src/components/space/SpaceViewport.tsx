"use client";

import { useSimulation } from "@/lib/simulation/useSimulation";
import SpaceScene from "@/components/space/SpaceScene";

export default function SpaceViewport() {
  const { state } = useSimulation();

  return (
    <section className="space-y-3">

      <div>
        <div className="text-xs font-bold tracking-[0.35em] text-cyan-300">
          ASTRAFORGE-X / ORBITAL DIGITAL TWIN
        </div>

        <h2 className="mt-1 text-2xl font-black text-white">
          LIVE SPACECRAFT ENVIRONMENT
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          3D spacecraft state synchronized with the engineering simulation.
        </p>
      </div>

      <SpaceScene
        solar={state.solarArray}
        battery={state.battery}
        communication={state.communicationHealth}
        fault={state.faultActive}
      />

    </section>
  );
}
