type BoardCoordinates = {
  x: number;
  z: number;
};

enum CellState {
  Empty = -1,
  White = 0,
  Black = 1,
}

type StonePlacement = {
  coordinates: BoardCoordinates;
  state: CellState;
};

class GoBoardState {
  public turn: CellState = CellState.Black;
  public placementOrder: StonePlacement[];
  private boardState: Map<string, CellState>;

  constructor() {
    this.boardState = new Map<string, CellState>();
    this.placementOrder = [];
    this.initializeBoard();
  }

  private coordsToKey(xBoard: number, zBoard: number): string {
    return `${xBoard},${zBoard}`;
  }

  private initializeBoard(): void {
    for (let x = 0; x < 19; x++) {
      for (let z = 0; z < 19; z++) {
        this.setCellState({ x, z }, CellState.Empty);
      }
    }
  }

  public setCellState({ x, z }: BoardCoordinates, state: CellState): void {
    if (state !== CellState.Empty) {
      this.placementOrder.push({ coordinates: { x, z }, state });
    }
    const key = this.coordsToKey(x, z);
    this.boardState.set(key, state);
  }

  public getCellState({ x, z }: BoardCoordinates): CellState | undefined {
    const key = this.coordsToKey(x, z);
    return this.boardState.get(key);
  }

  public toggleTurn(): void {
    this.turn =
      this.turn === CellState.Black ? CellState.White : CellState.Black;
  }
}

export { CellState, GoBoardState };
