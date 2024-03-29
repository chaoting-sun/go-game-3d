import { Canvas } from "@react-three/fiber";
import GoGame from "../components/goGame";
import { Stats, OrbitControls } from "@react-three/drei";
import React, { useCallback, useRef } from "react";

const Scene: React.FC = () => {
  const placingRef = useRef(false);
  const clickStartRef = useRef({ x: 0, z: 0 });

  const handleMouseDown = useCallback((e) => {
    clickStartRef.current = { x: e.clientX, z: e.clientY };
  }, []);

  const handleMouseUp = useCallback((e) => {
    const dx = e.clientX - clickStartRef.current.x;
    const dy = e.clientY - clickStartRef.current.z;
    // console.log(dx, dy, Math.sqrt(dx * dx + dy * dy));
    if (Math.sqrt(dx * dx + dy * dy) < 0.5) {
      console.log("this is a click");
      placingRef.current = true; // Update ref synchronously
    }
  }, []);

  return (
    <Canvas
      className="bg-gray-900"
      onPointerDown={handleMouseDown}
      onPointerUp={handleMouseUp}
      shadows
      camera={{
        fov: 75,
        near: 0.1,
        far: 1000,
        position: [4, 8, 10],
      }}
    >
      {/* <ambientLight /> */}
      <spotLight
        position={[0, 20, 0]}
        angle={Math.PI / 8}
        intensity={200}
        penumbra={0.2}
        castShadow
      />
      <GoGame position={[0, 1, 0]} placingRef={placingRef} />
      {/* <InfiniteFloor position={[0, 0, -1]} /> */}
      <OrbitControls makeDefault />
      <axesHelper args={[20]} />
      <Stats />
    </Canvas>
  );
};

export default Scene;
