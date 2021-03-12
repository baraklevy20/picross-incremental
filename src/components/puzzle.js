import { get, set } from 'lodash';

export default class PuzzleComponent {
  constructor() {
    this.puzzles = [
      '5x5x1/t.vox',
      '5x5x1/smile.vox',
    ];
    this.currentPuzzleIndex = 0;
  }

  async voxFileToPuzzle(voxFilePath) {
    const { default: voxFile } = await import(`../../models/${voxFilePath}`);
    this.cubes = [];
    voxFile.xyzi.values.forEach((xyzi) => {
      set(this.cubes, `[${xyzi.x}][${xyzi.z}][${xyzi.y}]`, 0x30);
    });

    // Fill the rest of the cells with empty
    for (let x = 0; x < voxFile.size.x; x += 1) {
      for (let y = 0; y < voxFile.size.y; y += 1) {
        for (let z = 0; z < voxFile.size.z; z += 1) {
          if (!get(this.cubes, `[${x}][${z}][${y}]`)) {
            set(this.cubes, `[${x}][${z}][${y}]`, 0x20);
          }
        }
      }
    }
  }

  async onNextPuzzle() {
    this.currentPuzzleIndex = (this.currentPuzzleIndex + 1) % this.puzzles.length;
    await this.generatePuzzle();
  }

  async generatePuzzle(width, height, depth) {
    await this.voxFileToPuzzle(this.puzzles[this.currentPuzzleIndex]);
    this.brokenSolids = 0;
    this.clues = this.generateClues();
    this.removeClues();
    this.cubes = this.cubes.map((face, x) => face.map((line, y) => line.map((cube, z) => {
      const state = cube >= 0x30 ? 'part' : (cube >= 0x20 ? 'empty' : 'nothing');
      return {
        position: {
          x,
          y,
          z,
        },
        state,
      };
    })));
    const solidsAndSpaces = this.calculateNumberOfSolidsAndSpaces();
    this.numberOfSpaces = solidsAndSpaces.spaces;
    this.numberOfSolids = solidsAndSpaces.solids;
  }

  calculateNumberOfSolidsAndSpaces() {
    let solids = 0;
    let spaces = 0;

    this.cubes.forEach((face) => {
      face.forEach((line) => {
        line.forEach((cube) => {
          switch (cube.state) {
            case 'part':
              solids += 1;
              break;
            case 'empty':
              spaces += 1;
              break;
            default:
          }
        });
      });
    });

    return {
      solids,
      spaces,
    };
  }

  removeClues() {
    const lines = this.getLinesWithoutSolid();
    let clues = [...this.clues.x, ...this.clues.y, ...this.clues.z].flat(2);

    // Shuffle clues. Otherwise only z clues remain
    for (let i = clues.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = clues[i];
      clues[i] = clues[j];
      clues[j] = temp;
    }

    const scores = clues.map((clue) => {
      let axis;
      let first;
      let second;
      if (clue.x === null) {
        axis = 'x';
        first = clue.y;
        second = clue.z;
      } else if (clue.y === null) {
        axis = 'y';
        first = clue.x;
        second = clue.z;
      } else {
        axis = 'z';
        first = clue.x;
        second = clue.y;
      }

      const lineWithoutZeroes = lines[axis][first][second].filter((c) => c !== 0);
      const changes = PuzzleComponent.solveLine(lines[axis][first][second], clue);
      // const added = changes.reduce((sum, change) => (sum + change.value < 0x40 ? 1 : 0), 0);
      // const removed = changes.reduce((sum, change) => (sum + change >= 0x40 ? 1 : 0), 0);

      // return added + removed ** 2;
      // // Special case
      if (changes.length === 1 && lineWithoutZeroes.length === 1) {
        return 2;
      }
      return changes.length / lineWithoutZeroes.length;
      // return changes.length;
    });
    clues = clues.map((c, i) => ({ ...c, score: scores[i] }));

    clues.sort((a, b) => b.score - a.score);

    // Try to remove clues one by one until the puzzle isn't solvable
    for (let i = 0; i < clues.length; i += 1) {
      const currentClue = clues[i];
      clues[i] = null;
      this.setClues(clues);
      if (!this.isSolvable()) {
        clues[i] = currentClue;
        this.setClues(clues);
      }
    }

    console.log(clues.filter((c) => c !== null).length);
  }

  setClues(flattenClues) {
    this.clues = { x: [], y: [], z: [] };
    let axis;
    let first;
    let second;

    flattenClues.forEach((clue) => {
      if (!clue) {
        return;
      }

      if (clue.x === null) {
        axis = 'x';
        first = clue.y;
        second = clue.z;
      } else if (clue.y === null) {
        axis = 'y';
        first = clue.x;
        second = clue.z;
      } else {
        axis = 'z';
        first = clue.x;
        second = clue.y;
      }
      if (!this.clues[axis][first]) {
        this.clues[axis][first] = [];
      }
      this.clues[axis][first][second] = clue;
    });
  }

  isSolvable() {
    const lines = this.getLinesWithoutSolid();
    let changed = true;

    // Solve the board until there are no changes
    while (changed) {
      changed = false;
      for (let i = 0; i < lines.x.length; i += 1) {
        for (let j = 0; j < lines.x[i].length; j += 1) {
          const changes = PuzzleComponent.solveLine(lines.x[i][j], this.clues.x?.[i]?.[j]);
          changed = changed || changes.length > 0;

          changes.forEach((change) => {
            lines.x[i][j][change.index] = change.value;
            lines.y[change.index][j][i] = change.value;
            lines.z[change.index][i][j] = change.value;
          });
        }
      }

      for (let i = 0; i < lines.y.length; i += 1) {
        for (let j = 0; j < lines.y[i].length; j += 1) {
          const changes = PuzzleComponent.solveLine(lines.y[i][j], this.clues.y?.[i]?.[j]);
          changed = changed || changes.length > 0;

          changes.forEach((change) => {
            lines.x[change.index][j][i] = change.value;
            lines.y[i][j][change.index] = change.value;
            lines.z[i][change.index][j] = change.value;
          });
        }
      }

      for (let i = 0; i < lines.z.length; i += 1) {
        for (let j = 0; j < lines.z[i].length; j += 1) {
          const changes = PuzzleComponent.solveLine(lines.z[i][j], this.clues.z?.[i]?.[j]);
          changed = changed || changes.length > 0;

          changes.forEach((change) => {
            lines.x[j][change.index][i] = change.value;
            lines.y[i][change.index][j] = change.value;
            lines.z[i][j][change.index] = change.value;
          });
        }
      }
    }

    // In the end, either there's a solution or no solution.
    return PuzzleComponent.isSolvedByLines(lines);
  }

  getLinesWithoutSolid() {
    const lines = {
      x: [],
      y: [],
      z: [],
    };

    for (let y = 0; y < this.cubes[0].length; y += 1) {
      lines.x[y] = [];
      for (let z = 0; z < this.cubes[0][0].length; z += 1) {
        lines.x[y][z] = this.cubes
          .map((face) => face[y][z])
          .map((cube) => (cube >= 0x30 && cube < 0x40 ? 0x20 : cube));
      }
    }

    for (let x = 0; x < this.cubes.length; x += 1) {
      lines.y[x] = [];
      for (let z = 0; z < this.cubes[0][0].length; z += 1) {
        lines.y[x][z] = this.cubes[x]
          .map((line) => line[z])
          .map((cube) => (cube >= 0x30 && cube < 0x40 ? 0x20 : cube));
      }
    }

    for (let x = 0; x < this.cubes.length; x += 1) {
      lines.z[x] = [];
      for (let y = 0; y < this.cubes[0].length; y += 1) {
        lines.z[x][y] = this.cubes[x][y]
          .map((cube) => (cube >= 0x30 && cube < 0x40 ? 0x20 : cube));
      }
    }

    return lines;
  }

  // eslint-disable-next-line class-methods-use-this
  destroyCube(cube) {
    // eslint-disable-next-line no-param-reassign
    cube.state = 'nothing';
  }

  generateClues() {
    const clues = {
      x: [],
      y: [],
      z: [],
    };

    // todo remove eventually?
    const maxClues = 20;

    for (let y = 0; y < Math.min(maxClues, this.cubes[0].length); y += 1) {
      clues.x[y] = [];
      for (let z = 0; z < Math.min(maxClues, this.cubes[0][0].length); z += 1) {
        const clue = this.generateLineClue(null, y, z, 0);

        if (clue) {
          clues.x[y][z] = this.generateLineClue(null, y, z, 0);
        }
      }
    }

    for (let x = 0; x < Math.min(maxClues, this.cubes.length); x += 1) {
      clues.y[x] = [];
      for (let z = 0; z < Math.min(maxClues, this.cubes[0][0].length); z += 1) {
        const clue = this.generateLineClue(x, null, z, 1);

        if (clue) {
          clues.y[x][z] = clue;
        }
      }
    }

    for (let x = 0; x < Math.min(maxClues, this.cubes.length); x += 1) {
      clues.z[x] = [];
      for (let y = 0; y < Math.min(maxClues, this.cubes[0].length); y += 1) {
        const clue = this.generateLineClue(x, y, null, 2);
        if (clue) {
          clues.z[x][y] = clue;
        }
      }
    }

    return clues;
  }

  generateLineClue(x0, y0, z0, axis) {
    let previous;
    let count = 0;
    let spaces = 0;

    const axisDim = axis === 0
      ? this.cubes.length
      : (axis === 1
        ? this.cubes[0].length
        : this.cubes[0][0].length);

    for (let i = 0; i < axisDim; i += 1) {
      const cube = axis === 0
        ? this.cubes[i][y0][z0]
        : (axis === 1
          ? this.cubes[x0][i][z0]
          : this.cubes[x0][y0][i]);

      // Count the part elements
      if (cube >= 0x30) {
        count += 1;
      // Count the spaces (only count each space once)
      } else if (previous >= 0x30) {
        spaces += 1;
      }
      previous = cube;
    }

    // If we finished with a space, remove the last space
    if (count !== 0 && previous < 0x30) {
      spaces -= 1;
    }

    // Ignore clues that are going to take too long to compute
    if (count > 15 && spaces >= 2) {
      return null;
    }

    return {
      count,
      spaces,
      x: x0,
      y: y0,
      z: z0,
    };
  }

  isSolved() {
    return this.cubes
      .every((face) => face
        .every((line) => line
          .every((c) => c.state !== 'empty' && c.state !== 'paintedEmpty')));
  }

  static isSolvedByLines(lines) {
    return lines.x.every((y) => y.every((z) => z.every((c) => c === 0 || (c >= 0x30 && c < 0x50))))
      && lines.y.every((x) => x.every((z) => z.every((c) => c === 0 || (c >= 0x30 && c < 0x50))))
      && lines.z.every((x) => x.every((y) => y.every((c) => c === 0 || (c >= 0x30 && c < 0x50))));
  }

  static solveLineWithBlocks(line, blocks) {
    // If the line is empty, return all spaces
    if (blocks[0] === 0) {
      return Array(line.length).fill(0x40);
    }

    const leftmostSolution = PuzzleComponent.getLeftmostSolution(line, blocks);

    // If the line is unsolvable
    if (!leftmostSolution) {
      return null;
    }

    const rightmostSolution = PuzzleComponent.getRightmostSolution(line, blocks);

    const solution = [...line];

    for (let i = 0; i < blocks.length; i += 1) {
      const overlapRight = leftmostSolution[i] + blocks[i] - 1;
      const overlapLeft = rightmostSolution[i];

      for (let j = overlapLeft; j <= overlapRight; j += 1) {
        solution[j] = 0x30;
      }
    }

    for (let i = 0; i < line.length; i += 1) {
      if (line[i] !== 0
        && PuzzleComponent.isEmpty(blocks, leftmostSolution, rightmostSolution, i)) {
        solution[i] = 0x40;
      }
    }

    return solution;
  }

  static getAllPossibleBlockCombinations(clue) {
    if (clue.spaces <= 1) {
      return PuzzleComponent.calculateComposition(clue.count, clue.spaces + 1);
    }

    // If we have more than 2 groups, we consider all groups of size >= 3
    let combinations = [];

    for (let i = 3; i <= clue.count; i += 1) {
      combinations = combinations.concat(PuzzleComponent.calculateComposition(clue.count, i));
    }

    return combinations;
  }

  static solveLine(line, clue) {
    if (!clue) {
      return [];
    }

    if (clue.count === 0) {
      return line
        .map((v, i) => (v === 0x40 ? null : { index: i, value: 0x40 }))
        .filter((c) => c !== null);
    }

    const changes = [];
    const blocks = PuzzleComponent.getAllPossibleBlockCombinations(clue);
    const allPossibleSolutions = blocks
      .map((b) => PuzzleComponent.solveLineWithBlocks(line, b))
      .filter((s) => !!s);

    for (let i = 0; i < line.length; i += 1) {
      if (PuzzleComponent.areAllCellsSame(allPossibleSolutions, i)
        && line[i] !== allPossibleSolutions[0][i]) {
        changes.push({ index: i, value: allPossibleSolutions[0][i] });
      }
    }

    return changes;
  }

  static areAllCellsSame(solutions, index) {
    const currentCell = solutions[0][index];

    for (let i = 0; i < solutions.length; i += 1) {
      if (currentCell !== solutions[i][index]) {
        return false;
      }
    }

    return true;
  }

  static calculateComposition(n, k) {
    if (k === 1) {
      return [[n]];
    }

    const output = [];
    for (let i = 1; i <= n - 1; i += 1) {
      const results = PuzzleComponent.calculateComposition(n - i, k - 1);
      results.forEach((result) => {
        output.push([i, ...result]);
      });
    }

    return output;
  }

  static isEmpty(blocks, leftmostSolution, rightmostSolution, position) {
    for (let i = 0; i < blocks.length; i += 1) {
      if (position >= leftmostSolution[i] && position < rightmostSolution[i] + blocks[i]) {
        return false;
      }
    }

    return true;
  }

  static getRightmostSolution(line, blocks) {
    const reversedLine = [...line].reverse();
    const reversedBlocks = [...blocks].reverse();

    // The reversed solutions' positions start from the end
    // (so position 0 = position - 1 - blocksize)
    const reversedSolution = PuzzleComponent.getLeftmostSolution(reversedLine, reversedBlocks);
    return reversedSolution.map((e, i) => line.length - e - reversedBlocks[i]).reverse();
  }

  static getLeftmostSolution(line, blocks) {
    const positions = PuzzleComponent.getSimpleLeftmostSolution(line, blocks, 0, 0);

    if (!positions) {
      return null;
    }
    let isDone = false;

    while (!isDone) {
      isDone = true;
      for (let i = line.length - 1; i >= 0; i -= 1) {
        // If this is an unassigned solid
        if (PuzzleComponent.isUnassignedSolid(line, i, positions, blocks)) {
          isDone = false;
          // Get rightmost block to the left of this unassigned solid
          let j = PuzzleComponent.getRightmostBlockToTheLeftOfPosition(positions, i) + 1;

          // If there isn't any block to the left to fit this unassigned solid
          if (j === 0) {
            return null;
          }

          do {
            j -= 1;
            // Move it to overlap with the unassigned solid
            positions[j] = i - blocks[j] + 1;

            // If we can't place it, move it to the right until we can
            while (positions[j] <= i
              && !PuzzleComponent.canPlaceBlock(line, blocks[j], positions[j])) {
              positions[j] += 1;
            }

            // If we doesn't fit, we move on to the next block
          } while (positions[j] > i);

          // If we get here, we managed to place the current block in the unassigned solid
          // we now reposition blocks on the right
          const partialSolution = PuzzleComponent.getSimpleLeftmostSolution(
            line,
            blocks,
            positions[j] + blocks[j] + 1,
            j + 1,
          );

          if (!partialSolution) {
            return null;
          }

          for (let k = j + 1; k < partialSolution.length; k += 1) {
            positions[k] = partialSolution[k];
          }
        }
      }
    }

    return positions;
  }

  static isUnassignedSolid(line, position, positions, blocks) {
    if (line[position] < 0x30 || line[position] >= 0x40) {
      return false;
    }

    for (let i = 0; i < positions.length; i += 1) {
      if (positions[i] <= position && positions[i] + blocks[i] >= position) {
        return false;
      }
    }

    return true;
  }

  static getRightmostBlockToTheLeftOfPosition(positions, position) {
    for (let j = positions.length - 1; j >= 0; j -= 1) {
      if (positions[j] < position) {
        return j;
      }
    }
    return -1;
  }

  static getSimpleLeftmostSolution(line, blocks, startLinePosition, startBlock) {
    const solution = [];
    let position = startLinePosition;

    for (let i = startBlock; i < blocks.length; i += 1) {
      while (position < line.length && !PuzzleComponent.canPlaceBlock(line, blocks[i], position)) {
        position += 1;
      }

      if (position >= line.length) {
        return null;
      }

      // Place block
      solution[i] = position;
      position += blocks[i];

      // Add space after block placement
      position += 1;
    }

    return solution;
  }

  static canPlaceBlock(line, block, position) {
    // If the block would overflow the line, it can't be place here
    if (position + block > line.length) {
      return false;
    }

    for (let i = 0; i < block; i += 1) {
      // If the current block is solid or empty, it can be placed.
      // If it's a space or non-game cube, it cannot be placed here.
      if (line[i + position] >= 0x40 || line[i + position] === 0) {
        return false;
      }
    }

    // Finally, we can place it here if the next
    // and previous cells are non-solid (empty, space or end of line)
    return (block + position === line.length
      || line[block + position] < 0x30
      || line[block + position] >= 0x40)
      && (position === 0
      || line[position - 1] < 0x30
      || line[position - 1] >= 0x40);
  }

  onBrokenSolid() {
    this.brokenSolids += 1;
  }
}
