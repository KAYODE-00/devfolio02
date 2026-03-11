import { Canvas } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import AnimatedHeaderSection from "../Components/AnimatedHeaderSection";
import Orb from "../Components/Orb";

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  const text = `I build high-performance web apps that help startups and brands win, grow, and scale faster.`;

  return (
    <section id="home" className="flex min-h-screen flex-col justify-end">
      <AnimatedHeaderSection
        subTitle={"Hi, I'm a Dev"}
        title={` ${isMobile ? "Kayode" : "Abdulwahab Kayode"}`}
        text={text}
        textColor={"text-black"}
      />

      <figure
        className="absolute inset-0 -z-50"
        style={{ width: "100vw", height: "100vh" }}
      >
        <Canvas
          shadows
          camera={{ position: [0, 0, -10], fov: 17.5, near: 1, far: 20 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.5} />
          <Float speed={2}>
            <Orb scale={isMobile ? 0.7 : 1} />
          </Float>
          <Environment resolution={256}>
            <group rotation={[-Math.PI / 3, 4, 1]}>
              <Lightformer form={"circle"} intensity={2} position={[0, 5, -9]} scale={10} />
              <Lightformer form={"circle"} intensity={2} position={[0, 3, 1]} scale={10} />
              <Lightformer form={"circle"} intensity={2} position={[-5, -1, -1]} scale={10} />
              <Lightformer form={"circle"} intensity={2} position={[10, 1, 0]} scale={16} />
            </group>
          </Environment>
        </Canvas>
      </figure>
    </section>
  );
};

export default Hero;
