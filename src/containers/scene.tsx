import { Canvas } from "@react-three/fiber";
import GoGameGroup from "./goView";
import { Stats, OrbitControls } from "@react-three/drei";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MoveControl from "../components/moveControl";
import sgfToLocations from "../utils/sgfToLocations";

const Scene: React.FC = () => {
  const [goRecords, setGoRecords] = useState<{ rowi: number; coli: number }[]>(
    []
  );
  const [step, setStep] = useState(-1);

  useEffect(() => {
    const sgfFileUrl = "/sgf_files/1.sgf";

    fetch(sgfFileUrl)
      .then((response) => response.text())
      .then((data) => {
        const locs: { rowi: number; coli: number }[] = sgfToLocations(data);
        setGoRecords(locs);
      })
      .catch((error) => console.error("Error loading SGF file:", error));
  }, []);

  const placingRef = useRef(false);
  const clickStartRef = useRef({ x: 0, z: 0 });

  const handleMouseDown = useCallback((e: React.PointerEvent) => {
    clickStartRef.current = { x: e.clientX, z: e.clientY };
  }, []);

  const handleMouseUp = useCallback((e: React.PointerEvent) => {
    const dx = e.clientX - clickStartRef.current.x;
    const dy = e.clientY - clickStartRef.current.z;
    if (Math.sqrt(dx * dx + dy * dy) < 0.5) {
      placingRef.current = true; // Update ref synchronously
    }
  }, []);

  const handleMoveControl = (direction: string) => {
    console.log("move control:");
    setStep((prev) => {
      if (direction === "--") {
        return Math.max(-1, prev - 5);
      } else if (direction === "-") {
        return Math.max(-1, prev - 1);
      } else if (direction === "+") {
        return Math.min(goRecords.length - 1, prev + 1);
      } else if (direction === "++") {
        return Math.min(goRecords.length - 1, prev + 5);
      }
      return prev;
    });
  };

  return (
    <>
      <div id="scene-container" className="min-w-0 min-h-0">
        <Canvas
          className="bg-[#353d57]"
          style={{ width: "100%", height: "100%" }}
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
          <spotLight
            position={[0, 20, 0]}
            angle={Math.PI / 8}
            intensity={200}
            penumbra={0.2}
            castShadow
          />
          <GoGameGroup
            position={[0, 1, 0]}
            placingRef={placingRef}
            goRecords={goRecords}
            step={step}
          />
          <OrbitControls makeDefault />
          <axesHelper args={[20]} />
          {/* <Stats /> */}
        </Canvas>
      </div>
      <MoveControl onMoveControl={handleMoveControl} />
    </>
  );
};

export default Scene;
