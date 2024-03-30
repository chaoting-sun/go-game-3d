import React from "react";
import { MeshProps } from "@react-three/fiber";

type GoStoneProps = {
  position: MeshProps["position"];
  color: "black" | "white";
  opacity: number;
};

const GoStonePreview: React.FC<GoStoneProps> = ({ position, color, opacity }) => {
  return (
    <mesh position={position} scale={[1, 0.5, 1]}>
      <sphereGeometry attach="geometry" args={[0.23]} />
      <meshStandardMaterial
        attach="material"
        color={color}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
};

export default GoStonePreview;
