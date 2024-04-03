// useDebouncedPointerMove.ts
import { useCallback, useEffect, useRef, useMemo } from "react";
import { debounce } from "lodash";
import { ThreeEvent } from "@react-three/fiber";
import { Position } from "../goGame/logics/position";
import { convertWorldCoordsToCorrectedCoords } from "../utils/convert";
import useFixedYPositionConverter from "../utils/positionConverter";

type CurrCellStoneWorld = {
  xWorld: number;
  zWorld: number;
} | null;

const useDebouncedPointerMove = (
  goPosition: Position, // Adjust types based on your actual implementation
  setCurrStoneWorld: React.Dispatch<React.SetStateAction<CurrCellStoneWorld>>
) => {
  const positionConverter = useFixedYPositionConverter();
  const handlePointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      console.log("handlePointerMove");

      const position = positionConverter(e);

      const result = convertWorldCoordsToCorrectedCoords(
        position.x,
        position.z
      );

      console.log("result:", result);

      if (!result) {
        setCurrStoneWorld(null);
        return;
      }

      const { correctedBoard, correctedWorld } = result;
      const newFC = correctedBoard.x + correctedBoard.z * 19; // Assuming N=19 here, adjust as necessary

      if (!goPosition.isEmpty(newFC)) {
        setCurrStoneWorld(null);
        return;
      }

      setCurrStoneWorld({ xWorld: correctedWorld.x, zWorld: correctedWorld.z });
    },
    [goPosition, setCurrStoneWorld, positionConverter]
  );

  const pointerMoveRef = useRef(handlePointerMove);

  useEffect(() => {
    pointerMoveRef.current = handlePointerMove;
  }, [handlePointerMove]);

  return useMemo(
    () =>
      debounce((e: ThreeEvent<PointerEvent>) => {
        pointerMoveRef.current(e);
      }, 7.5),
    []
  );
};

export default useDebouncedPointerMove;
