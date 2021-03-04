export default class PuzzleComponent {
  constructor() {
    this.cubesPositions = [
      [0, 4, 0],
      [1, 4, 0],
      [2, 0, 0],
      [2, 1, 0],
      [2, 2, 0],
      [2, 3, 0],
      [2, 4, 0],
      [3, 4, 0],
      [4, 4, 0],
    ];

    this.emptyCubesPositions = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 2, 0],
      [0, 3, 0],
      [1, 0, 0],
      [1, 1, 0],
      [1, 2, 0],
      [1, 3, 0],
      [3, 0, 0],
      [3, 1, 0],
      [3, 2, 0],
      [3, 3, 0],
      [4, 0, 0],
      [4, 1, 0],
      [4, 2, 0],
      [4, 3, 0],
    ];
  }

  getCubesPositions() {
    return this.cubesPositions;
  }

  getEmptyCubesPositions() {
    return this.emptyCubesPositions;
  }
}
