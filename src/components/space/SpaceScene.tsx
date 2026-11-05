"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Line } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

type SpaceSceneProps = {
  solar?: number;
  battery?: number;
  communication?: number;
  fault?: boolean;
};

function Sun() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.08;
  });

  return (
    <group position={[-9, 3, -10]}>
      <mesh ref={ref}>
        <sphereGeometry args={[2.1, 48, 48]} />
        <meshBasicMaterial color="#ff9d00" />
      </mesh>

      <mesh scale={1.35}>
        <sphereGeometry args={[2.1, 32, 32]} />
        <meshBasicMaterial
          color="#ff6500"
          transparent
          opacity={0.12}
        />
      </mesh>

      <pointLight
        intensity={180}
        distance={35}
        color="#ff9d00"
      />
    </group>
  );
}

function Earth() {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.06;
  });

  return (
    <group ref={ref} position={[6, -2.7, -11]}>
      {/* atmosphere */}
      <mesh scale={1.12}>
        <sphereGeometry args={[2.35, 48, 48]} />
        <meshBasicMaterial
          color="#26a9ff"
          transparent
          opacity={0.11}
        />
      </mesh>

      {/* Earth */}
      <mesh>
        <sphereGeometry args={[2.1, 64, 64]} />
        <meshStandardMaterial
          color="#125bb5"
          emissive="#031d4a"
          emissiveIntensity={0.8}
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* cloud layer */}
      <mesh scale={1.015}>
        <sphereGeometry args={[2.12, 48, 48]} />
        <meshBasicMaterial
          color="#bdeaff"
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
}

function Moon() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.03;
  });

  return (
    <mesh ref={ref} position={[10, 3.8, -13]}>
      <sphereGeometry args={[0.72, 32, 32]} />
      <meshStandardMaterial
        color="#9ba4b0"
        emissive="#202630"
        emissiveIntensity={0.25}
        roughness={1}
      />
    </mesh>
  );
}

function Nebula() {
  return (
    <group>
      <mesh position={[-2, 5, -18]} scale={[10, 4, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#3b1b70"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[8, 1, -20]} scale={[7, 5, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#075985"
          transparent
          opacity={0.07}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function OrbitRing({
  radius,
  opacity = 0.35,
}: {
  radius: number;
  opacity?: number;
}) {
  const points: [number, number, number][] = [];

  for (let i = 0; i <= 160; i++) {
    const a = (i / 160) * Math.PI * 2;

    points.push([
      Math.cos(a) * radius,
      Math.sin(a) * 0.7,
      Math.sin(a) * radius,
    ]);
  }

  return (
    <Line
      points={points}
      color="#00d9ff"
      lineWidth={0.7}
      transparent
      opacity={opacity}
    />
  );
}

function Spacecraft({
  solar,
  battery,
  communication,
  fault,
}: {
  solar: number;
  battery: number;
  communication: number;
  fault: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  const solarColor =
    solar > 70 ? "#164cff" : solar > 40 ? "#7c3aed" : "#ef3340";

  const batteryColor =
    battery > 60 ? "#00ffcc" : battery > 30 ? "#ffb300" : "#ef3340";

  const commColor =
    communication > 70
      ? "#00eaff"
      : communication > 40
        ? "#ffb300"
        : "#ef3340";

  useFrame(({ clock }) => {
    if (!group.current) return;

    group.current.rotation.y = clock.elapsedTime * 0.16;
    group.current.rotation.z =
      Math.sin(clock.elapsedTime * 0.5) * 0.04;

    group.current.position.y =
      Math.sin(clock.elapsedTime * 0.8) * 0.12;
  });

  return (
    <group ref={group}>

      {/* main spacecraft bus */}
      <mesh>
        <boxGeometry args={[2.5, 0.75, 1.15]} />
        <meshStandardMaterial
          color="#101827"
          emissive={fault ? "#8b1028" : "#073b62"}
          emissiveIntensity={fault ? 1.5 : 0.65}
          metalness={0.9}
          roughness={0.22}
        />
      </mesh>

      {/* front avionics core */}
      <mesh position={[0, 0, 0.64]}>
        <sphereGeometry args={[0.27, 32, 32]} />
        <meshBasicMaterial color={commColor} />
      </mesh>

      {/* left solar array */}
      <mesh position={[-2.15, 0, 0]}>
        <boxGeometry args={[1.9, 0.08, 1.35]} />
        <meshStandardMaterial
          color={solarColor}
          emissive={solarColor}
          emissiveIntensity={0.75}
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      {/* right solar array */}
      <mesh position={[2.15, 0, 0]}>
        <boxGeometry args={[1.9, 0.08, 1.35]} />
        <meshStandardMaterial
          color={solarColor}
          emissive={solarColor}
          emissiveIntensity={0.75}
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      {/* panel grid bars */}
      {[-2.5, -2.15, -1.8, 1.8, 2.15, 2.5].map((x) => (
        <mesh key={x} position={[x, 0.055, 0]}>
          <boxGeometry args={[0.025, 0.02, 1.32]} />
          <meshBasicMaterial color="#7dd3fc" />
        </mesh>
      ))}

      {/* antenna mast */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.4, 12]} />
        <meshBasicMaterial color="#d7f9ff" />
      </mesh>

      {/* antenna dish */}
      <mesh position={[0, 1.72, 0]}>
        <sphereGeometry
          args={[
            0.38,
            24,
            16,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2,
          ]}
        />
        <meshBasicMaterial color={commColor} />
      </mesh>

      {/* battery indicator */}
      <mesh position={[0, -0.58, 0]}>
        <boxGeometry args={[1.3, 0.07, 0.22]} />
        <meshBasicMaterial color={batteryColor} />
      </mesh>

      {/* navigation lights */}
      <mesh position={[-1.25, 0.42, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#00ffcc" />
      </mesh>

      <mesh position={[1.25, 0.42, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#ff315c" />
      </mesh>
    </group>
  );
}

function PowerFlow({ solar }: { solar: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = new Float32Array(240);

  const seededValue = (value: number) => {
    const raw = Math.sin(value * 12.9898) * 43758.5453;
    return raw - Math.floor(raw);
  };

  for (let i = 0; i < 240; i += 3) {
    const seed = i + 1;
    positions[i] = -5 + seededValue(seed) * 10;
    positions[i + 1] = -0.7 + seededValue(seed + 1) * 1.4;
    positions[i + 2] = -1 + seededValue(seed + 2) * 2;
  }

  useFrame(() => {
    if (!ref.current) return;

    const data =
      ref.current.geometry.attributes.position
        .array as Float32Array;

    const speed = Math.max(0.08, solar / 100);

    for (let i = 0; i < data.length; i += 3) {
      data[i] += speed * 0.018;

      if (data[i] > 5) data[i] = -5;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        color={solar > 40 ? "#00ffd5" : "#ff315c"}
        size={0.055}
        transparent
        opacity={0.85}
      />
    </points>
  );
}

function DebrisField() {
  const debris = Array.from({ length: 70 });

  return (
    <group>
      {debris.map((_, i) => {
        const angle = (i / debris.length) * Math.PI * 2;
        const radius = 7.5 + (i % 5) * 0.3;

        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              ((i % 7) - 3) * 0.18,
              Math.sin(angle) * radius,
            ]}
            rotation={[
              i * 0.4,
              i * 0.2,
              i * 0.3,
            ]}
          >
            <boxGeometry args={[0.035, 0.035, 0.09]} />
            <meshBasicMaterial color="#64748b" />
          </mesh>
        );
      })}
    </group>
  );
}

export default function SpaceScene({
  solar = 85,
  battery = 79,
  communication = 96,
  fault = false,
}: SpaceSceneProps) {
  return (
    <div className="relative h-[650px] w-full overflow-hidden rounded-[28px] border border-cyan-400/20 bg-[#010208] shadow-[0_0_100px_rgba(0,200,255,0.12)]">

      <Canvas
        camera={{
          position: [9, 5, 12],
          fov: 42,
        }}
        dpr={[1, 2]}
      >

        <color attach="background" args={["#010208"]} />

        <fog
          attach="fog"
          args={["#010208", 18, 45]}
        />

        <ambientLight intensity={0.18} />

        <pointLight
          position={[-9, 3, -10]}
          intensity={130}
          distance={40}
          color="#ff9d00"
        />

        <pointLight
          position={[0, 4, 5]}
          intensity={35}
          distance={25}
          color="#00d9ff"
        />

        <Stars
          radius={100}
          depth={60}
          count={8000}
          factor={4}
          saturation={0}
          fade
          speed={0.25}
        />

        <Nebula />

        <Sun />
        <Earth />
        <Moon />

        <OrbitRing radius={4.8} opacity={0.5} />
        <OrbitRing radius={6.5} opacity={0.18} />
        <OrbitRing radius={8} opacity={0.12} />

        <DebrisField />

        <PowerFlow solar={solar} />

        <Spacecraft
          solar={solar}
          battery={battery}
          communication={communication}
          fault={fault}
        />

        <OrbitControls
          enablePan={false}
          minDistance={7}
          maxDistance={25}
          autoRotate={false}
        />

      </Canvas>

      {/* TOP LEFT MISSION HUD */}
      <div className="pointer-events-none absolute left-5 top-5 rounded-2xl border border-cyan-400/20 bg-black/55 px-4 py-3 backdrop-blur-xl">

        <div className="text-[9px] font-bold tracking-[0.35em] text-cyan-300">
          ASTRAFORGE-X
        </div>

        <div className="mt-1 text-xs font-black text-white">
          SPACECRAFT DIGITAL TWIN
        </div>

        <div className="mt-2 text-[9px] tracking-[0.2em] text-slate-500">
          ORBITAL ENGINEERING ENVIRONMENT
        </div>

      </div>

      {/* TOP RIGHT STATUS */}
      <div className="pointer-events-none absolute right-5 top-5 rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-right backdrop-blur-xl">

        <div className="text-[9px] tracking-[0.3em] text-slate-500">
          MISSION STATE
        </div>

        <div
          className={`mt-1 text-xs font-black ${
            fault ? "text-red-400" : "text-emerald-300"
          }`}
        >
          {fault ? "ANOMALY DETECTED" : "NOMINAL"}
        </div>

      </div>

      {/* BOTTOM LEFT TELEMETRY HUD */}
      <div className="pointer-events-none absolute bottom-5 left-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/60 p-3 backdrop-blur-xl md:grid-cols-4">

        {[
          ["SOLAR", solar, "cyan"],
          ["BATTERY", battery, "green"],
          ["COMMS", communication, "blue"],
        ].map(([label, value]) => (
          <div key={String(label)} className="min-w-[80px]">

            <div className="text-[8px] tracking-[0.2em] text-slate-500">
              {label}
            </div>

            <div className="mt-1 text-sm font-black text-white">
              {Number(value).toFixed(1)}%
            </div>

          </div>
        ))}

        <div>
          <div className="text-[8px] tracking-[0.2em] text-slate-500">
            LINK
          </div>

          <div className="mt-1 text-sm font-black text-cyan-300">
            {communication > 60 ? "LOCKED" : "WEAK"}
          </div>
        </div>

      </div>

      {/* BOTTOM RIGHT HUD */}
      <div className="pointer-events-none absolute bottom-5 right-5 hidden rounded-2xl border border-purple-400/20 bg-black/60 px-4 py-3 backdrop-blur-xl md:block">

        <div className="text-[8px] tracking-[0.3em] text-purple-300">
          SYSTEMS ONLINE
        </div>

        <div className="mt-2 flex gap-3 text-[9px] text-slate-400">
          <span>POWER</span>
          <span>AVIONICS</span>
          <span>RF</span>
          <span>ADCS</span>
          <span>THERMAL</span>
        </div>

      </div>

    </div>
  );
}
