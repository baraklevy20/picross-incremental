/* eslint-disable no-dupe-class-members */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
export default class PuzzleComponent {
  constructor() {
    this.generatePuzzle(5, 5, 1);
  }

  generatePuzzle(width, height, depth) {
    // eslint-disable-next-line max-len
    this.cubes = [48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.cubes[2 * 100 + 0 * 10 + 0] = 48;
    this.brokenSolids = 0;

    // todo eventually remove it. the puzzle generator code would do it.
    const array = [];
    let k = 0;
    for (let x = 0; x < 10; x += 1) {
      array[x] = [];
      for (let y = 0; y < 10; y += 1) {
        array[x][y] = [];
        for (let z = 0; z < 10; z += 1) {
          array[x][y][z] = this.cubes[k];
          k += 1;
        }
      }
    }
    this.cubes = array;

    this.clues = this.generateClues();
    this.removeClues();
    this.cubes = this.cubes.map((face) => face.map((line) => line.map((cube) => {
      const state = cube >= 0x30 ? 'part' : (cube >= 0x20 ? 'empty' : 'nothing');
      return {
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
      const changes = this.solveLine(lines[axis][first][second], clue);
      const added = changes.reduce((sum, change) => (sum + change.value < 0x40 ? 1 : 0), 0);
      const removed = changes.reduce((sum, change) => (sum + change >= 0x40 ? 1 : 0), 0);

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

    // todo instead of shuffle, sort clues by best to worse (best = solves entire line)
    // // Shuffle clues
    // for (let i = clues.length - 1; i > 0; i -= 1) {
    //   const j = Math.floor(Math.random() * (i + 1));
    //   const temp = clues[i];
    //   clues[i] = clues[j];
    //   clues[j] = temp;
    // }

    // Try to remove clues one by one until the puzzle isn't solvable
    for (let i = 0; i < clues.length; i += 1) {
      const currentClue = clues[i];
      clues[i] = null;
      this.setClues(clues);
      if (!this.isSolvable(this.getLinesWithoutSolid())) {
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

  isSolvable(lines) {
    let changed = true;

    // Solve the board until there are no changes
    while (changed) {
      changed = false;
      for (let i = 0; i < lines.x.length; i += 1) {
        for (let j = 0; j < lines.x[i].length; j += 1) {
          const changes = this.solveLine(lines.x[i][j], this.clues.x?.[i]?.[j]);
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
          const changes = this.solveLine(lines.y[i][j], this.clues.y?.[i]?.[j]);
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
          const changes = this.solveLine(lines.z[i][j], this.clues.z?.[i]?.[j]);
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
    return this.isSolvedByLines(lines);
  }

  getLinesWithoutSolid() {
    const lines = {
      x: [],
      y: [],
      z: [],
    };

    for (let y = 0; y < 10; y += 1) {
      lines.x[y] = [];
      for (let z = 0; z < 10; z += 1) {
        lines.x[y][z] = this.cubes
          .map((face) => face[y][z])
          .map((cube) => (cube >= 0x30 && cube < 0x40 ? 0x20 : cube));
      }
    }

    for (let x = 0; x < 10; x += 1) {
      lines.y[x] = [];
      for (let z = 0; z < 10; z += 1) {
        lines.y[x][z] = this.cubes[x]
          .map((line) => line[z])
          .map((cube) => (cube >= 0x30 && cube < 0x40 ? 0x20 : cube));
      }
    }

    for (let x = 0; x < 10; x += 1) {
      lines.z[x] = [];
      for (let y = 0; y < 10; y += 1) {
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

    // todo replace 10 here with something
    for (let y = 0; y < 10; y += 1) {
      clues.x[y] = [];
      for (let z = 0; z < 10; z += 1) {
        const clue = this.generateLineClue(null, y, z, 0);

        if (clue) {
          clues.x[y][z] = clue;
        }
      }
    }

    for (let x = 0; x < 10; x += 1) {
      clues.y[x] = [];
      for (let z = 0; z < 10; z += 1) {
        const clue = this.generateLineClue(x, null, z, 1);

        if (clue) {
          clues.y[x][z] = clue;
        }
      }
    }

    for (let x = 0; x < 10; x += 1) {
      clues.z[x] = [];
      for (let y = 0; y < 10; y += 1) {
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

    for (let i = 0; i < 10; i += 1) {
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

    // If the entire line is 0, return null
    if (count === 0) {
      return null;
    }

    // If we finished with a space, remove the last space
    if (previous < 0x30) {
      spaces -= 1;
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

  isSolvedByLines(lines) {
    return lines.x.every((y) => y.every((z) => z.every((c) => c === 0 || (c >= 0x30 && c < 0x50))))
      && lines.y.every((x) => x.every((z) => z.every((c) => c === 0 || (c >= 0x30 && c < 0x50))))
      && lines.z.every((x) => x.every((y) => y.every((c) => c === 0 || (c >= 0x30 && c < 0x50))));
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
      if (line[i] !== 0 && this.isEmpty(blocks, leftmostSolution, rightmostSolution, i)) {
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

  solveLine(line, clue) {
    if (!clue) {
      return [];
    }

    const changes = [];
    const blocks = this.getAllPossibleBlockCombinations(clue);

    const allPossibleSolutions = blocks
      .map((b) => this.solveLineWithBlocks(line, b))
      .filter((s) => !!s);
    for (let i = 0; i < line.length; i += 1) {
      if (this.areAllCellsSame(allPossibleSolutions, i)
        && line[i] !== allPossibleSolutions[0][i]) {
        changes.push({ index: i, value: allPossibleSolutions[0][i] });
      }
    }

    return changes;
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
      // If it's a space or non-game cube, it cannot be placed here.
      if (line[i + position] >= 0x40 || line[i + position] === 0) {
        return false;
      }
    }

    // Finally, we can place it here if the next cell is non-solid (empty, space or end of line)
    return block + position === line.length
      || line[block + position] < 0x30
      || line[block + position] >= 0x40;
  }

  onBrokenSolid() {
    this.brokenSolids += 1;
  }
}
