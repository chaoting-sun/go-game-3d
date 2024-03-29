import { useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

function useFixedYPositionConverter(y: number) {
  const { camera } = useThree();

  const getPosition = useCallback((event: React.PointerEvent) => {
    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Create a raycaster and set its near and far planes
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, camera);

    // Use the camera position and ray direction to calculate the x and z
    // coordinates on the y = 2.1 plane
    const dir = raycaster.ray.direction;
    const camPos = camera.position;

    const t = (y - camPos.y) / dir.y;
    const x = camPos.x + t * dir.x;
    const z = camPos.z + t * dir.z;

    return { x, y, z };
  }, [camera, y]);

  return getPosition;
}

export default useFixedYPositionConverter;