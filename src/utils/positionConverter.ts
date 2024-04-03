import { useCallback } from 'react';
import { ThreeEvent, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { STONE_Y } from '../goGame/appearance/constants';

function useFixedYPositionConverter(refId="scene") {
  const { camera } = useThree();

  const getPosition = useCallback((event: ThreeEvent<PointerEvent>) => {
    const pointer = new THREE.Vector2();

    const sceneElement = document.getElementById(refId) as HTMLCanvasElement | null;
    if (!sceneElement) {
      throw new Error('Canvas not found');
    }

    const rect = sceneElement.getBoundingClientRect();

    // get the width and height of canvas

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Create a raycaster and set its near and far planes
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, camera);

    // Use the camera position and ray direction to calculate the x and z
    // coordinates on the y = 2.1 plane
    const dir = raycaster.ray.direction;
    const camPos = camera.position;

    const t = (STONE_Y - camPos.y) / dir.y;
    const x = camPos.x + t * dir.x;
    const z = camPos.z + t * dir.z;

    return { x, STONE_Y, z };
  }, [camera]);

  return getPosition;
}

export default useFixedYPositionConverter;