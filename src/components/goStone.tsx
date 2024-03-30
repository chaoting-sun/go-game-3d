import React from "react";
import { MeshProps } from "@react-three/fiber";
import { STONE_RADIUS } from "../goGame/appearance/constants";

type GoStoneProps = {
  position: MeshProps["position"];
  color: "black" | "white";
};

const GoStone: React.FC<GoStoneProps> = ({ position, color }) => {
  return (
    <mesh position={position} scale={[1, 0.5, 1]} castShadow>
      <sphereGeometry attach="geometry" args={[STONE_RADIUS]} />
      <meshLambertMaterial attach="material" color={color} />
    </mesh>
  );
};

export default GoStone;
