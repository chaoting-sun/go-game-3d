import React from "react";
import { MeshProps } from "@react-three/fiber";

type GoStoneProps = {
  position: MeshProps["position"];
  color: "black" | "white";
};

const GoStone: React.FC<GoStoneProps> = ({ position, color }) => {
  return (
    <mesh position={position} scale={[1, 0.5, 1]} castShadow>
      <sphereGeometry attach="geometry" args={[0.23]} />
      <meshLambertMaterial attach="material" color={color} />
    </mesh>
  );
};

export default GoStone;
