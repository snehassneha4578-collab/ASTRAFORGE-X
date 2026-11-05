"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Line, Html } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

type BodyProps = {
  name: string;
  radius: number;
  distance: number;
  color: string;
  speed: number;
  ring?: boolean;
};

function CelestialBody({
  name,
  radius,
  distance,
  color,
  speed,
  ring,
}: BodyProps) {
  const group = useRef<THREE.Group>(null);
  const planet = useRef<THREE.Mesh>(null);
  const [selected, setSelected] = useState(false);

  useFrame((_, delta) => {
    if (!group.current || !planet.current) return;

    group.current.rotation.y += delta * speed;
    planet.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={group}>
      <mesh
        position={[distance, 0, 0]}
        ref={planet}
        onClick={(e) => {
          e.stopPropagation();
          setSelected((v) => !v);
        }}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={selected ? color : "#000000"}
          emissiveIntensity={selected ? 1.5 : 0.15}
          roughness={0.85}
        />

        {selected && (
          <Html distanceFactor={8}>
            <div className="pointer-events-none rounded-lg border border-cyan-300/30 bg-black/80 px-3 py-2 text-[10px] text-white backdrop-blur-xl">
              <div className="font-black tracking-widest text-cyan-300">
                {name.toUpperCase()}
              </div>
              <div className="mt-1 text-slate-400">
                CELESTIAL OBJECT
              </div>
            </div>
          </Html>
        )}
      </mesh>

      <Line
        points={[
          [0, 0, 0],
          [distance, 0, 0],
        ]}
        color="#164e63"
        lineWidth={0.3}
        transparent
        opacity={0.18}
      />

      {ring && (
        <mesh position={[distance, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.45, radius * 2.05, 48]} />
          <meshBasicMaterial
            color="#cbd5e1"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

function Sun() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.08;
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={ref}>
        <sphereGeometry args={[1.8, 48, 48]} />
        <meshBasicMaterial color="#ff9d00" />
      </mesh>

      <mesh scale={1.35}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color="#ff5e00"
          transparent
          opacity={0.1}
        />
      </mesh>

      <pointLight
        intensity={160}
        distance={45}
        color="#ff9d00"
      />
    </group>
  );
}

function AsteroidBelt() {
  const asteroids = Array.from({ length: 160 });

  return (
    <group>
      {asteroids.map((_, i) => {
        const angle = (i / asteroids.length) * Math.PI * 2;
        const radius = 8.2 + ((i * 17) % 140) / 100;
        const y = (((i * 13) % 100) - 50) / 180;

        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              y,
              Math.sin(angle) * radius,
            ]}
            scale={[
              0.025 + (i % 4) * 0.012,
              0.025 + (i % 3) * 0.01,
              0.025 + (i % 5) * 0.008,
            ]}
          >
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial color="#737b86" />
          </mesh>
        );
      })}
    </group>
  );
}

function Comet() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = (clock.elapsedTime * 0.12) % 1;

    ref.current.position.x = -13 + t * 26;
    ref.current.position.y = 4 + Math.sin(t * Math.PI * 2) * 2;
    ref.current.position.z = -5;
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#dffaff" />
      </mesh>

      <mesh position={[-0.65, 0, 0]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshBasicMaterial
          color="#7dd3fc"
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
}

function Debris() {
  const pieces = Array.from({ length: 90 });

  return (
    <group>
      {pieces.map((_, i) => {
        const angle = (i / pieces.length) * Math.PI * 2;
        const radius = 11 + (i % 5) * 0.4;

        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              ((i % 9) - 4) * 0.2,
              Math.sin(angle) * radius,
            ]}
            rotation={[i, i * 0.4, i * 0.7]}
          >
            <boxGeometry args={[0.025, 0.025, 0.08]} />
            <meshBasicMaterial color="#475569" />
          </mesh>
        );
      })}
    </group>
  );
}

function Nebula() {
  return (
    <group>
      <mesh position={[0, 5, -18]} scale={[16, 5, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#4c1d95"
          transparent
          opacity={0.07}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[-8, -3, -16]} scale={[8, 5, 1]}>
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

function SolarSystem() {
  return (
    <>
      <Sun />

      <CelestialBody
        name="Mercury"
        radius={0.18}
        distance={3}
        color="#8b8178"
        speed={0.7}
      />

      <CelestialBody
        name="Venus"
        radius={0.28}
        distance={4}
        color="#d69e55"
        speed={0.5}
      />

      <CelestialBody
        name="Earth"
        radius={0.32}
        distance={5.2}
        color="#1677d2"
        speed={0.4}
      />

      <CelestialBody
        name="Mars"
        radius={0.24}
        distance={6.3}
        color="#c4513c"
        speed={0.32}
      />

      <CelestialBody
        name="Jupiter"
        radius={0.72}
        distance={9.5}
        color="#c99d72"
        speed={0.18}
        ring
      />

      <CelestialBody
        name="Saturn"
        radius={0.62}
        distance={12}
        color="#d6b77a"
        speed={0.13}
        ring
      />

      <CelestialBody
        name="Uranus"
        radius={0.46}
        distance={14.5}
        color="#72c9d4"
        speed={0.1}
        ring
      />

      <CelestialBody
        name="Neptune"
        radius={0.44}
        distance={17}
        color="#4169d8"
        speed={0.08}
      />

      <CelestialBody
        name="Pluto"
        radius={0.13}
        distance={19}
        color="#a8907a"
        speed={0.05}
      />
    </>
  );
}

export default function SpaceUniverse() {
  return (
    <section className="relative mt-8 overflow-hidden rounded-[28px] border border-cyan-400/15 bg-[#010208] shadow-[0_0_90px_rgba(0,180,255,0.08)]">

      <div className="absolute left-5 top-5 z-10">
        <div className="text-[9px] font-bold tracking-[0.4em] text-cyan-300">
          ASTRAFORGE-X // SPACE UNIVERSE
        </div>

        <div className="mt-1 text-sm font-black text-white">
          SOLAR SYSTEM & DEEP-SPACE ENVIRONMENT
        </div>

        <div className="mt-1 text-[9px] tracking-[0.2em] text-slate-500">
          CLICK CELESTIAL OBJECTS TO INSPECT
        </div>
      </div>

      <div className="absolute bottom-5 left-5 z-10 flex flex-wrap gap-2">
        {[
          "PLANETS",
          "MOONS",
          "ASTEROIDS",
          "COMETS",
          "DEBRIS",
          "ORBITS",
          "DEEP SPACE",
          "SPACE WEATHER",
        ].map((item) => (
          <div
            key={item}
            className="rounded-full border border-cyan-300/10 bg-black/50 px-3 py-1 text-[8px] tracking-[0.18em] text-slate-400 backdrop-blur-xl"
          >
            {item}
          </div>
        ))}
      </div>

      <div className="flex h-[620px] w-full items-center justify-center">
        <Canvas
          className="!h-full !w-full"
          camera={{
            position: [0, 10, 28],
            fov: 55,
          }}
          dpr={[1, 2]}
        >
          <color attach="background" args={["#010208"]} />

          <fog
            attach="fog"
            args={["#010208", 18, 45]}
          />

          <ambientLight intensity={0.12} />

          <Stars
            radius={100}
            depth={70}
            count={9000}
            factor={4}
            saturation={0}
            fade
            speed={0.2}
          />

          <Nebula />
          <SolarSystem />
          <AsteroidBelt />
          <Comet />
          <Debris />

          <OrbitControls
            enablePan={false}
            minDistance={10}
            maxDistance={38}
          />
        </Canvas>
      </div>
    </section>
  );
}
