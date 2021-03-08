/* eslint-disable no-dupe-class-members */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
export default class PuzzleComponent {
  constructor() {
    // eslint-disable-next-line max-len
    this.cubes = [48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.cubes[2 * 100 + 0 * 10 + 0] = 48;
    this.clues = this.generateClues();
    this.cubes = this.cubes.map((v) => {
      const state = v >= 0x30 ? 'part' : (v >= 0x20 ? 'empty' : 'nothing');
      return {
        state,
      };
    });

    this.solveLine();
  }

  solve() {

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

    for (let y = 0; y < 10; y += 1) {
      clues.x[y] = [];
      for (let z = 0; z < 10; z += 1) {
        clues.x[y][z] = this.generateLineClue(null, y, z, 0);
      }
    }

    for (let x = 0; x < 10; x += 1) {
      clues.y[x] = [];
      for (let z = 0; z < 10; z += 1) {
        clues.y[x][z] = this.generateLineClue(x, null, z, 1);
      }
    }

    for (let x = 0; x < 10; x += 1) {
      clues.z[x] = [];
      for (let y = 0; y < 10; y += 1) {
        clues.z[x][y] = this.generateLineClue(x, y, null, 2);
      }
    }

    return clues;
  }

  generateLineClue(x0, y0, z0, axis) {
    let previous;
    let count = 0;
    let spaces = 0;

    // todo this can look much better using a 3 elements array [100, 10, 1]
    for (let i = 0; i < 10; i += 1) {
      const cube = axis === 0
        ? this.cubes[i * 100 + y0 * 10 + z0]
        : (axis === 1
          ? this.cubes[x0 * 100 + i * 10 + z0]
          : this.cubes[x0 * 100 + y0 * 10 + i]);

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
    if (previous < 0x30) {
      spaces -= 1;
    }

    return { count, spaces };
  }

  isSolved() {
    return this.cubes.every((c) => c.state !== 'empty' && c.state !== 'paintedEmpty');
  }

  solveLineWithBlocks(line, blocks) {
    // If the line is empty, return all spaces
    if (blocks[0] === 0) {
      return Array(line.length).fill(0x40);
    }

    const leftmostSolution = this.getLeftmostSolution(line, blocks);

    // If the line is unsolvable
    if (!leftmostSolution) {
      return null;
    }

    const rightmostSolution = this.getRightmostSolution(line, blocks);

    const solution = [...line];

    for (let i = 0; i < blocks.length; i += 1) {
      const overlapRight = leftmostSolution[i] + blocks[i] - 1;
      const overlapLeft = rightmostSolution[i];

      for (let j = overlapLeft; j <= overlapRight; j += 1) {
        solution[j] = 0x30;
      }
    }

    for (let i = 0; i < line.length; i += 1) {
      if (this.isEmpty(blocks, leftmostSolution, rightmostSolution, i)) {
        solution[i] = 0x40;
      }
    }

    return solution;
  }

  getAllPossibleBlockCombinations(clue) {
    if (clue.spaces <= 1) {
      return this.calculateComposition(clue.count, clue.spaces + 1);
    }

    // If we have more than 2 groups, we consider all groups of size >= 3
    let combinations = [];

    for (let i = 3; i <= clue.count; i += 1) {
      combinations = combinations.concat(this.calculateComposition(clue.count, i));
    }

    return combinations;
  }

  solveLine() {
    // const clue = this.clues.x[0][0];
    const clue = { count: 4, spaces: 1 };
    const line = [0x20, 0x30, 0x40, 0x20, 0x20, 0x20];
    const solution = [...line];
    const blocks = this.getAllPossibleBlockCombinations(clue);

    const allPossibleSolutions = blocks
      .map((b) => this.solveLineWithBlocks(line, b))
      .filter((s) => !!s);
    for (let i = 0; i < line.length; i += 1) {
      if (this.areAllCellsSame(allPossibleSolutions, i)) {
        solution[i] = allPossibleSolutions[0][i];
      }
    }

    return solution;
  }

  areAllCellsSame(solutions, index) {
    const currentCell = solutions[0][index];

    for (let i = 0; i < solutions.length; i += 1) {
      if (currentCell !== solutions[i][index]) {
        return false;
      }
    }

    return true;
  }

  calculateComposition(n, k) {
    if (k === 1) {
      return [[n]];
    }

    const output = [];
    for (let i = 1; i <= n - 1; i += 1) {
      const results = this.calculateComposition(n - i, k - 1);
      results.forEach((result) => {
        output.push([i, ...result]);
      });
    }

    return output;
  }

  isEmpty(blocks, leftmostSolution, rightmostSolution, position) {
    for (let i = 0; i < blocks.length; i += 1) {
      if (position >= leftmostSolution[i] && position < rightmostSolution[i] + blocks[i]) {
        return false;
      }
    }

    return true;
  }

  getRightmostSolution(line, blocks) {
    const reversedLine = [...line].reverse();
    const reversedBlocks = [...blocks].reverse();

    // The reversed solutions' positions start from the end
    // (so position 0 = position - 1 - blocksize)
    const reversedSolution = this.getLeftmostSolution(reversedLine, reversedBlocks);
    return reversedSolution.map((e, i) => line.length - e - reversedBlocks[i]).reverse();
  }

  getLeftmostSolution(line, blocks) {
    const positions = this.getSimpleLeftmostSolution(line, blocks, 0, 0);

    if (!positions) {
      return null;
    }
    let isDone = false;

    while (!isDone) {
      isDone = true;
      for (let i = line.length - 1; i >= 0; i -= 1) {
        // If this is an unassigned solid
        if (this.isUnassignedSolid(line, i, positions, blocks)) {
          isDone = false;
          // Get rightmost block to the left of this unassigned solid
          let j = this.getRightmostBlockToTheLeftOfPosition(positions, i) + 1;

          do {
            j -= 1;
            // Move it to overlap with the unassigned solid
            positions[j] = i - blocks[j] + 1;

            // If we can't place it, move it to the right until we can
            while (positions[j] <= i
              && !this.canPlaceBlock(line, blocks[j], positions[j])) {
              positions[j] += 1;
            }

            // If we doesn't fit, we move on to the next block
          } while (positions[j] > i);

          // If we get here, we managed to place the current block in the unassigned solid
          // we now reposition blocks on the right
          const partialSolution = this.getSimpleLeftmostSolution(line, blocks, i + 2, j + 1);

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

  isUnassignedSolid(line, position, positions, blocks) {
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

  getRightmostBlockToTheLeftOfPosition(positions, position) {
    for (let j = positions.length - 1; j >= 0; j -= 1) {
      if (positions[j] < position) {
        return j;
      }
    }
    return -1;
  }

  getSimpleLeftmostSolution(line, blocks, startLinePosition, startBlock) {
    const solution = [];
    let position = startLinePosition;

    for (let i = startBlock; i < blocks.length; i += 1) {
      while (position < line.length && !this.canPlaceBlock(line, blocks[i], position)) {
        position += 1;
      }

      if (position >= line.length) {
        console.log('unsolvable');
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

  canPlaceBlock(line, block, position) {
    // If the block would overflow the line, it can't be place here
    if (position + block > line.length) {
      return false;
    }

    for (let i = 0; i < block; i += 1) {
      // If the current block is solid or empty, it can be placed.
      // If it's a space, it cannot be placed here.
      if (line[i + position] >= 0x40) {
        return false;
      }
    }

    // Finally, we can place it here if the next cell is non-solid (empty, space or end of line)
    return block + position === line.length
      || line[block + position] < 0x30
      || line[block + position] >= 0x40;
  }
}
