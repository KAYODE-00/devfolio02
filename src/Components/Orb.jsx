import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Orb({ scale = 1 }) {
  const mesh = useRef();

  useFrame(({ clock }) => {
    if (!mesh.current) return;

    const t = clock.getElapsedTime();

    mesh.current.rotation.y = t * 0.15;
    mesh.current.rotation.x = Math.sin(t * 0.3) * 0.2;

    const s = scale + Math.sin(t * 0.6) * 0.04;
    mesh.current.scale.set(s, s, s);
  });

  return (
    <mesh ref={mesh} scale={scale}>
      <sphereGeometry args={[1.6, 64, 64]} />

      <meshPhysicalMaterial
        color="#cfa355"
        roughness={0.35}
        metalness={0.7}
        clearcoat={0.9}
        clearcoatRoughness={0.4}
        reflectivity={1}
        emissive="#3b3428"
        emissiveIntensity={0.25}
      />
    </mesh>
  );
}
