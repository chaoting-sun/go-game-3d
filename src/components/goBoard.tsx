import * as THREE from "three";
import { useThree } from '@react-three/fiber';
import { useState } from "react";

const GoBoard = ({ position, topTexture, boardTexture, PlaceStone }) => {

  const materials = [
    new THREE.MeshStandardMaterial({ map: boardTexture }), // right
    new THREE.MeshStandardMaterial({ map: boardTexture }), // left
    new THREE.MeshStandardMaterial({ map: topTexture }), // top
    new THREE.MeshStandardMaterial({ map: boardTexture }), // bottom
    new THREE.MeshStandardMaterial({ map: boardTexture }), // front
    new THREE.MeshStandardMaterial({ map: boardTexture }), // back
  ];

  return (
    <mesh
      castShadow
      receiveShadow
      position={position}
      onClick={PlaceStone}
    >
      <boxGeometry attach="geometry" args={[10, 2, 10]} />
      {materials.map((material, index) => (
        <primitive key={index} attach={`material-${index}`} object={material} />
      ))}
    </mesh>
  );
};

export default GoBoard;
