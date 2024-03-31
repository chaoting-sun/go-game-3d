import { ThreeEvent, useLoader } from "@react-three/fiber";
import BoardFoot from "../components/boardFoot.tsx";
import * as THREE from "three";
import GoStone from "../components/goStone.tsx";
import GoStonePreview from "../components/goStonePreview.tsx";
import GoBoard from "../components/goBoard.tsx";
import { CellState } from "../utils/goBoardState.ts";
import React, { useState } from "react";
import {
  convertWorldCoordsToCorrectedCoords,
  worldLB,
  WorldOneSpaceDistance,
} from "../utils/convert.ts";
import useDebouncedPointerMove from "./useHandlePointerMove.ts";
import { Position } from "../goGame/logics/position.ts";
import { STONE_Y, FOOT_X, FOOT_Z } from "../goGame/appearance/constants.ts";
import { N } from "../goGame/logics/constants.ts";
import { StoneColor } from "../goGame/logics/types.ts";

type CurrCellStoneWorld = {
  xWorld: number;
  zWorld: number;
} | null;

type GoGameProps = {
  position: [number, number, number];
  placingRef: React.MutableRefObject<boolean>;
};

const GoGame: React.FC<GoGameProps> = ({ position, placingRef }) => {
  const [currStoneWorld, setCurrStoneWorld] =
    useState<CurrCellStoneWorld>(null);
  const [turn, setTurn] = useState<StoneColor>(CellState.Black);
  const [goPosition, setGoPosition] = useState<Position>(
    Position.initial_state()
  );

  const [topTexture, boardTexture] = useLoader(THREE.TextureLoader, [
    "/go-board.svg",
    "/board-material.png",
  ]);

  const debouncedHandlePointerMove = useDebouncedPointerMove(
    goPosition,
    setCurrStoneWorld
  );

  const handlePointerOut = () => {
    setCurrStoneWorld(null);
  };

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

      const newFC = correctedBoard.x + correctedBoard.z * N;
      if (!goPosition.isEmpty(newFC)) {
        return;
      }

      // place the stone

      const newGoPosition = goPosition.playMove(newFC, turn);
      setGoPosition(newGoPosition);
      setTurn(turn === CellState.Black ? CellState.White : CellState.Black);

      // setStones((stones) => [
      //   ...stones,
      //   {
      //     xBoard: correctedBoard.x,
      //     zBoard: correctedBoard.z,
      //     color: CellState.Black ? CellState.Black : CellState.White,
      //   },
      // ]);

      // update the board state

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
      {Array.from(goPosition.getBoard()).map((cell, index) => {
        const color = cell === CellState.White ? "white" : "black";
        if (cell === CellState.Empty) {
          return null;
        }
        const x = index % N;
        const z = Math.floor(index / N);
        const xWorld = worldLB + x * WorldOneSpaceDistance;
        const zWorld = worldLB + z * WorldOneSpaceDistance;

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
          color={turn === CellState.White ? "white" : "black"}
          opacity={0.75}
        />
      )}
    </group>
  );
};

export default GoGame;
