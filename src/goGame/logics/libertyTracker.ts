import { NN } from "./constants";
import { Group } from "./group";
import { CellState, StoneColor } from "./types";
import { bulkPlaceStones, findReached } from "./utils";
import { NEIGHBORS } from "./constants";

export class LibertyTracker {
  groupIndex: (number | null)[];
  groups: { [key: number]: Group };
  libertyCache: number[];
  maxGroupId: number;

  constructor(
    groupIndex: (number | null)[] = new Array(NN).fill(null),
    groups: { [key: number]: Group } = {},
    libertyCache: number[] = new Array(NN).fill(0),
    maxGroupId: number = 1
  ) {
    this.groupIndex = groupIndex;
    this.groups = groups;
    this.libertyCache = libertyCache;
    this.maxGroupId = maxGroupId;
  }

  deepCopy(): LibertyTracker {
    const newGroupIndex = [...this.groupIndex];
    const newLibCache = [...this.libertyCache];
    const newGroups = Object.entries(this.groups).reduce(
      (acc: { [key: number]: Group }, [id, group]) => {
        acc[Number(id)] = new Group({
          id: group.id,
          stones: new Set(group.stones),
          liberties: new Set(group.liberties),
          color: group.color,
        });
        return acc;
      },
      {}
    );
    return new LibertyTracker(
      newGroupIndex,
      newGroups,
      newLibCache,
      this.maxGroupId
    );
  }

  static fromBoard(board: string): LibertyTracker {
    let currGroupId = 0;
    const libTracker = new LibertyTracker();

    [CellState.White, CellState.Black].forEach((color) => {
      let colorIndex = board.indexOf(color);
      while (colorIndex !== -1) {
        currGroupId++;
        const [chain, reached] = findReached(board, colorIndex); // Assuming it returns [Set<number>, Set<number>]

        const liberties = new Set<number>(
          [...reached].filter((fr) => board[fr] === CellState.Empty)
        );

        const newGroup = new Group({
          id: currGroupId,
          stones: chain,
          liberties: liberties,
          color: color,
        });
        libTracker.groups[currGroupId] = newGroup;
        chain.forEach((fs) => (libTracker.groupIndex[fs] = currGroupId));

        // If bulkPlaceStones expects an array, convert chain Set to Array
        board = bulkPlaceStones("?", board, chain);

        // Update colorIndex to find the next occurrence of the color
        colorIndex = board.indexOf(color, colorIndex + 1);
      }
    });

    libTracker.maxGroupId = currGroupId;

    // Assuming liberty cache needs to be updated here similar to previous example
    libTracker.libertyCache.fill(0);
    Object.values(libTracker.groups).forEach((group) => {
      group.liberties.forEach(
        (lib) => (libTracker.libertyCache[lib] = group.liberties.size)
      );
    });

    return libTracker;
  }

  getLiberties(): number[] {
    return this.libertyCache;
  }

  addStone(color: StoneColor, fc: number): [LibertyTracker, Set<number>] {
    const newLibTracker = this.deepCopy(); // Assuming deepCopy is properly implemented
    const capturedStones = newLibTracker._addStone(color, fc);
    return [newLibTracker, capturedStones];
  }

  _addStone(color: StoneColor, fc: number): Set<number> {
    if (this.groupIndex[fc] !== null)
      throw new Error("Position already occupied");
    const capturedStones = new Set<number>();
    const opponentNeighboringGroupIds = new Set<number>();
    const friendlyNeighboringGroupIds = new Set<number>();
    const emptyNeighbors = new Set<number>();

    NEIGHBORS[fc].forEach((fn: number) => {
      const neighborGroupId = this.groupIndex[fn];
      if (neighborGroupId !== null) {
        const neighborGroup = this.groups[neighborGroupId];
        if (neighborGroup.color === color) {
          friendlyNeighboringGroupIds.add(neighborGroupId);
        } else {
          opponentNeighboringGroupIds.add(neighborGroupId);
        }
      } else {
        emptyNeighbors.add(fn);
      }
    });

    let newGroup = this._createGroup(color, fc, emptyNeighbors);

    friendlyNeighboringGroupIds.forEach((groupId) => {
      newGroup = this._mergeGroups(groupId, newGroup.id);
    });

    opponentNeighboringGroupIds.forEach((groupId) => {
      const neighborGroup = this.groups[groupId];
      if (neighborGroup.liberties.size === 1) {
        const captured = this._captureGroup(groupId);
        captured.forEach((stone) => capturedStones.add(stone));
      } else {
        this._updateLiberties(groupId, null, new Set([fc]));
      }
    });

    this._handleCaptures(capturedStones);

    return capturedStones;
  }

  _createGroup(color: StoneColor, fc: number, liberties: Set<number>) {
    this.maxGroupId += 1;

    const newGroup = new Group({
      id: this.maxGroupId,
      stones: new Set([fc]),
      liberties: liberties,
      color: color,
    });

    this.groups[newGroup.id] = newGroup;
    this.groupIndex[fc] = newGroup.id;
    this.libertyCache[fc] = newGroup.liberties.size;
    return newGroup;
  }

  _mergeGroups(group1Id: number, group2Id: number) {
    const group1: Group = this.groups[group1Id];
    const group2: Group = this.groups[group2Id];
    group2.stones.forEach((stone) => {
      group1.stones.add(stone);
      this.groupIndex[stone] = group1Id;
    });
    delete this.groups[group2Id];

    this._updateLiberties(group1Id, group2.liberties, group2.stones);
    return group1;
  }

  _captureGroup(groupId: number) {
    const deadGroup = this.groups[groupId];
    delete this.groups[groupId];
    deadGroup.stones.forEach((stone) => {
      this.groupIndex[stone] = null;
      this.libertyCache[stone] = 0;
    });
    return deadGroup.stones;
  }

  _updateLiberties(
    groupId: number,
    add: Set<number> | null = new Set<number>(),
    remove: Set<number> | null = new Set()
  ) {
    const group = this.groups[groupId];
    if (add) add.forEach((liberty) => group.liberties.add(liberty));
    if (remove) remove.forEach((liberty) => group.liberties.delete(liberty));

    const newLibCount = group.liberties.size;
    group.stones.forEach((stone) => (this.libertyCache[stone] = newLibCount));
  }

  _handleCaptures(capturedStones: Set<number>) {
    capturedStones.forEach((fs: number) => {
      NEIGHBORS[fs].forEach((fn: number) => {
        const groupId = this.groupIndex[fn];
        if (groupId !== null) {
          this._updateLiberties(groupId, new Set([fs]), null);
        }
      });
    });
  }
}
