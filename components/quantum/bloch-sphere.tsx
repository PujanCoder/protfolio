"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Props = { vector: [number, number, number] };

const toThree = ([x, y, z]: [number, number, number]) => new THREE.Vector3(x, z, y);

function Axes() {
  const geometry = useMemo(() => {
    const points = [
      new THREE.Vector3(-1.25, 0, 0),
      new THREE.Vector3(1.25, 0, 0),
      new THREE.Vector3(0, -1.25, 0),
      new THREE.Vector3(0, 1.25, 0),
      new THREE.Vector3(0, 0, -1.25),
      new THREE.Vector3(0, 0, 1.25),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#cbd5d1" transparent opacity={0.85} />
    </lineSegments>
  );
}

function Rings() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.004, 8, 96]} />
        <meshBasicMaterial color="#a7f3d0" />
      </mesh>
      <mesh>
        <torusGeometry args={[1, 0.003, 8, 96]} />
        <meshBasicMaterial color="#d1fae5" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1, 0.003, 8, 96]} />
        <meshBasicMaterial color="#d1fae5" />
      </mesh>
    </group>
  );
}

function StateArrow({ target }: { target: THREE.Vector3 }) {
  const group = useRef<THREE.Group>(null);
  const current = useRef(new THREE.Vector3(0, 1, 0));
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useFrame((_, delta) => {
    current.current.lerp(target, Math.min(1, delta * 7));
    const node = group.current;
    if (!node) return;
    const length = Math.max(current.current.length(), 0.0001);
    const direction = current.current.clone().normalize();
    node.quaternion.setFromUnitVectors(up, direction);
    node.scale.set(1, length, 1);
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 1, 12]} />
        <meshBasicMaterial color="#047857" />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <coneGeometry args={[0.05, 0.12, 16]} />
        <meshBasicMaterial color="#047857" />
      </mesh>
      <mesh position={[0, 1.09, 0]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color="#065f46" />
      </mesh>
    </group>
  );
}

function Scene({ vector }: Props) {
  const [rotation, setRotation] = useState({ x: 0.35, y: -0.6 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const target = useMemo(() => toThree(vector), [vector]);

  return (
    <div
      className="relative h-[300px] w-full touch-none select-none sm:h-[340px]"
      onPointerDown={(event) => {
        drag.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerMove={(event) => {
        if (!drag.current) return;
        const dx = event.clientX - drag.current.x;
        const dy = event.clientY - drag.current.y;
        drag.current = { x: event.clientX, y: event.clientY };
        setRotation((prev) => ({
          x: Math.max(-1.4, Math.min(1.4, prev.x + dy * 0.01)),
          y: prev.y + dx * 0.01,
        }));
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerLeave={() => {
        drag.current = null;
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 3.1], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ cursor: "grab" }}
      >
        <group rotation={[rotation.x, rotation.y, 0]}>
          <mesh>
            <sphereGeometry args={[1, 40, 28]} />
            <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.16} />
          </mesh>
          <Rings />
          <Axes />
          <StateArrow target={target} />
        </group>
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between px-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-quiet">
        <span>|0⟩ ↑</span>
        <span>|+⟩ →</span>
        <span>|+i⟩ ↙</span>
      </div>
    </div>
  );
}

export default function BlochSphere(props: Props) {
  return <Scene {...props} />;
}
