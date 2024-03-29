export const worldLB = -4.6;
export const worldUB = 4.6;
export const WorldOneSpaceDistance = (worldUB - worldLB) / 18;

type BoardCoordinates = {
  x: number;
  z: number;
};

type WorldCoordinates = {
  x: number;
  z: number;
};

type ConvertWorldCoordsToCorrectedCoords = {
  correctedBoard: BoardCoordinates;
  correctedWorld: WorldCoordinates;
} | null;

export const convertWorldCoordsToCorrectedCoords = (
  xWorld: number,
  zWorld: number
): ConvertWorldCoordsToCorrectedCoords => {
  const WorldHalfSpaceDistance = WorldOneSpaceDistance / 2;

  // console.log("xWorld:", xWorld);
  // console.log("zWorld:", zWorld);

  // check if the world position is within the board

  if (
    xWorld < worldLB - WorldHalfSpaceDistance ||
    xWorld > worldUB + WorldHalfSpaceDistance ||
    zWorld < worldLB - WorldHalfSpaceDistance ||
    zWorld > worldUB + WorldHalfSpaceDistance
  ) {
    console.log("out of bounds");
    return null;
  }

  // convert world position to board position

  let xBoard = 0;
  let zBoard = 0;
  let correctedXWorld = worldLB;
  let correctedZWorld = worldLB;

  for (let x = 0; x < 19; x++) {
    if (
      xWorld >= correctedXWorld - WorldHalfSpaceDistance &&
      xWorld < correctedXWorld + WorldHalfSpaceDistance
    ) {
      xBoard = x;
      break;
    } else {
      correctedXWorld += WorldOneSpaceDistance;
    }
  }

  for (let z = 0; z < 19; z++) {
    if (
      zWorld >= correctedZWorld - WorldHalfSpaceDistance &&
      zWorld < correctedZWorld + WorldHalfSpaceDistance
    ) {
      zBoard = z;
      break;
    } else {
      correctedZWorld += WorldOneSpaceDistance;
    }
  }

  return {
    correctedBoard: { x: xBoard, z: zBoard },
    correctedWorld: { x: correctedXWorld, z: correctedZWorld },
  };
};
