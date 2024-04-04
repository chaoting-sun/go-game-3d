import { ThreeEvent, useLoader } from "@react-three/fiber";
import BoardFoot from "./boardFoot.tsx";
import * as THREE from "three";
import GoStone from "./goStone.tsx";
import GoStonePreview from "./goStonePreview.tsx";
import GoBoard from "./goBoard.tsx";
import { GoBoardState, CellState } from "../utils/goBoardState.ts";
import useFixedYPositionConverter from "../utils/positionConverter.ts";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { debounce } from "lodash";
import {
  convertWorldCoordsToCorrectedCoords,
  worldLB,
  WorldOneSpaceDistance,
} from "../utils/convert.ts";

import { STONE_Y, FOOT_X, FOOT_Z } from "../goGame/appearance/constants.ts";
import { StoneColor } from "../goGame/logics/types.ts";

export type Turn = CellState.Black | CellState.White;

type CellStoneBoard = {
  xBoard: number;
  zBoard: number;
  color: StoneColor;
};

type CurrCellStoneWorld = {
  xWorld: number;
  zWorld: number;
};

type GoGameProps = {
  position: [number, number, number];
  placingRef: React.MutableRefObject<boolean>;
};

const GoGame: React.FC<GoGameProps> = ({ position, placingRef }) => {
  const [stones, setStones] = useState<CellStoneBoard[]>([]);
  const [board] = useState(new GoBoardState());
  const [currStoneWorld, setCurrStoneWorld] =
    useState<CurrCellStoneWorld | null>(null);
  const getPosition = useFixedYPositionConverter();

  const [topTexture, boardTexture] = useLoader(THREE.TextureLoader, [
    "/board/cells.svg",
    "/board/material.png",
  ]);

  const handlePointerOut = () => {
    setCurrStoneWorld(null);
  };

  const handlePointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      console.log("handlePointerMove");

      const position = getPosition(e);

      // convert world position to board position

      const result = convertWorldCoordsToCorrectedCoords(
        position.x,
        position.z
      );
      // const result = convertWorldCoordsToCorrectedCoords(e.point.x, e.point.z);

      if (!result) {
        setCurrStoneWorld(null);
        return;
      }

      const { correctedBoard, correctedWorld } = result;

      // check if the position is valid

      if (
        board.getCellState({ x: correctedBoard.x, z: correctedBoard.z }) !==
        CellState.Empty
      ) {
        // setCurrStoneWorld(null);
        return;
      }

      // highlight the position

      setCurrStoneWorld({ xWorld: correctedWorld.x, zWorld: correctedWorld.z });
    },
    [board, getPosition]
  );

  const pointerMoveRef = useRef(handlePointerMove);

  useEffect(() => {
    pointerMoveRef.current = handlePointerMove;
  }, [handlePointerMove]);

  const debouncedHandlePointerMove = useMemo(
    () =>
      debounce((e: ThreeEvent<PointerEvent>) => {
        pointerMoveRef.current(e);
      }, 6),
    []
  );

  const handlePlaceStone = (e: ThreeEvent<MouseEvent>) => {
    if (!placingRef.current) {
      return;
    }

    setCurrStoneWorld(null);

    // convert world position to board position

    const result = convertWorldCoordsToCorrectedCoords(e.point.x, e.point.z);

    if (result) {
      const { correctedBoard } = result;

      // check if the position is valid

      if (
        board.getCellState({ x: correctedBoard.x, z: correctedBoard.z }) !==
        CellState.Empty
      ) {
        return;
      }

      // place the stone

      board.setCellState(
        { x: correctedBoard.x, z: correctedBoard.z },
        board.turn
      );
      setStones((stones) => [
        ...stones,
        {
          xBoard: correctedBoard.x,
          zBoard: correctedBoard.z,
          color: CellState.Black ? CellState.Black : CellState.White,
        },
      ]);

      // update the board state

      board.toggleTurn();
      placingRef.current = false;
    }
  };

  return (
    <group
      onPointerMove={debouncedHandlePointerMove}
      onPointerOut={handlePointerOut}
    >
      {/* a board */}
      <GoBoard
        position={position}
        topTexture={topTexture}
        boardTexture={boardTexture}
        PlaceStone={handlePlaceStone}
      />
      {/* 4 feet */}
      <BoardFoot position={[-FOOT_X, 0, -FOOT_Z]} texture={boardTexture} />
      <BoardFoot position={[-FOOT_X, 0, FOOT_Z]} texture={boardTexture} />
      <BoardFoot position={[FOOT_X, 0, -FOOT_Z]} texture={boardTexture} />
      <BoardFoot position={[FOOT_X, 0, FOOT_Z]} texture={boardTexture} />
      {/* stones */}
      {board.placementOrder.map((placement, index) => {
        const { coordinates, state: cellState } = placement;
        // console.log(coordinates, cellState);
        const xWorld = worldLB + coordinates.x * WorldOneSpaceDistance;
        const zWorld = worldLB + coordinates.z * WorldOneSpaceDistance;
        const color = cellState === CellState.White ? "white" : "black";

        return (
          <GoStone
            key={index}
            position={[xWorld, STONE_Y, zWorld]}
            color={color}
          />
        );
      })}
      {/* current stone */}
      {currStoneWorld && (
        <GoStonePreview
          position={[currStoneWorld.xWorld, STONE_Y, currStoneWorld.zWorld]}
          color={board.turn === CellState.White ? "white" : "black"}
          opacity={0.75}
        />
      )}
    </group>
  );
};

export default GoGame;
