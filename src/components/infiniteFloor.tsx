import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";

const InfiniteFloor = ({ position }) => {
  const planeRef = useRef(null);
  const texture = useLoader(THREE.TextureLoader, "/grass-ground.png");

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(100, 100);

  useFrame(({ camera }) => {
    // 示例：使地面始终位于相机下方，但这取决于你的具体需求
    planeRef.current.position.y = camera.position.y - 1;
  });

  return (
    <mesh
      ref={planeRef}
      rotation={[-Math.PI / 2, 0, 0]}
      // position={[0, -10000, 0]}
      receiveShadow
    >
      <planeGeometry attach="geometry" args={[1000, 1000]} />
      <meshStandardMaterial attach="material" map={texture} />
    </mesh>
  );
};

export default InfiniteFloor;
