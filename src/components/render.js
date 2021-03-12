import { get, set } from 'lodash';
import * as THREE from 'three';
import '../../styles.css';
import { scene } from '../context';

export default class RenderComponent {
  constructor(cubeSize) {
    this.cubeSize = cubeSize;
    this.stateColors = {
      part: '#DEDEDE',
      empty: '#DEDEDE',
      painted: '#6666FF',
      paintedEmpty: '#6666FF',
      brokenSolid: '#FF6666',
    };
    this.selectedCubeColor = '#d0d0d0';
    this.cache = {};
    this.meshes = [];
    this.faces = [
      { // right
        dir: [1, 0, 0],
        corners: [
          { pos: [0.5, 0.5, 0.5], uv: [0, 1] },
          { pos: [0.5, 0.5, -0.5], uv: [1, 1] },
          { pos: [0.5, -0.5, 0.5], uv: [0, 0] },
          { pos: [0.5, -0.5, -0.5], uv: [1, 0] },
        ],
      },
      { // left
        dir: [-1, 0, 0],
        corners: [
          { pos: [-0.5, 0.5, -0.5], uv: [0, 1] },
          { pos: [-0.5, 0.5, 0.5], uv: [1, 1] },
          { pos: [-0.5, -0.5, -0.5], uv: [0, 0] },
          { pos: [-0.5, -0.5, 0.5], uv: [1, 0] },
        ],
      },
      { // top
        dir: [0, 1, 0],
        corners: [
          { pos: [-0.5, 0.5, -0.5], uv: [0, 1] },
          { pos: [0.5, 0.5, -0.5], uv: [1, 1] },
          { pos: [-0.5, 0.5, 0.5], uv: [0, 0] },
          { pos: [0.5, 0.5, 0.5], uv: [1, 0] },
        ],
      },
      { // bottom
        dir: [0, -1, 0],
        corners: [
          { pos: [-0.5, -0.5, 0.5], uv: [0, 1] },
          { pos: [0.5, -0.5, 0.5], uv: [1, 1] },
          { pos: [-0.5, -0.5, -0.5], uv: [0, 0] },
          { pos: [0.5, -0.5, -0.5], uv: [1, 0] },
        ],
      },
      { // front
        dir: [0, 0, 1],
        corners: [
          { pos: [-0.5, 0.5, 0.5], uv: [0, 1] },
          { pos: [0.5, 0.5, 0.5], uv: [1, 1] },
          { pos: [-0.5, -0.5, 0.5], uv: [0, 0] },
          { pos: [0.5, -0.5, 0.5], uv: [1, 0] },
        ],
      },
      { // back
        dir: [0, 0, -1],
        corners: [
          { pos: [0.5, 0.5, -0.5], uv: [0, 1] },
          { pos: [-0.5, 0.5, -0.5], uv: [1, 1] },
          { pos: [0.5, -0.5, -0.5], uv: [0, 0] },
          { pos: [-0.5, -0.5, -0.5], uv: [1, 0] },
        ],
      },
    ];
  }

  createCube(geometry, position, state, clue) {
    const group = new THREE.Group();
    const material = this.createTextMaterial(clue, state);

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(
      position[0] * this.cubeSize,
      position[1] * this.cubeSize,
      position[2] * this.cubeSize,
    );

    group.add(cube);
    return group;
  }

  createFaceMaterial(clue, state) {
    const cacheKey = clue
      ? `${state}-${clue.spaces > 1 ? 2 : clue.spaces}-${clue.count}`
      : state;

    const cacheValue = this.cache[cacheKey];
    if (cacheValue) {
      return cacheValue;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const padding = canvas.width / 8;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outline
    ctx.lineWidth = canvas.width / 50;
    ctx.strokeStyle = '#bebebe';
    ctx.beginPath();
    ctx.rect(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    ctx.stroke();

    if (clue) {
      ctx.lineWidth = canvas.width / 25;
      ctx.font = `${clue.count >= 10 ? (canvas.width * 3) / 5 : (canvas.width * 3) / 4}px CrashNumberingGothic`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'black';
      if (clue.spaces > 0) {
        ctx.beginPath();

        if (clue.spaces === 1) {
          ctx.arc(
            canvas.width / 2,
            canvas.height / 2,
            (canvas.width - 2 * padding) / 2,
            0,
            2 * Math.PI,
          );
        } else if (clue.spaces > 1) {
          ctx.rect(
            padding,
            padding,
            canvas.width - 2 * padding,
            canvas.height - 2 * padding,
          );
        }

        ctx.stroke();
      }

      ctx.fillText(clue.count, canvas.width / 2, canvas.height / 2);
    }
    const textMaterial = new THREE.MeshBasicMaterial();
    textMaterial.map = new THREE.CanvasTexture(canvas);
    textMaterial.color.set(this.stateColors[state]);
    this.cache[cacheKey] = textMaterial;
    return textMaterial;
  }

  createTextMaterial({
    x, y, z,
  }, state) {
    const xFace = this.createFaceMaterial(x, state);
    const yFace = this.createFaceMaterial(y, state);
    const zFace = this.createFaceMaterial(z, state);

    const materials = [];
    materials[0] = xFace.clone();
    materials[1] = xFace.clone();
    materials[2] = yFace.clone();
    materials[3] = yFace.clone();
    materials[4] = zFace.clone();
    materials[5] = zFace.clone();

    return materials;
  }

  static setColor(mesh, color) {
    if (Array.isArray(mesh.children[0].material)) {
      mesh.children[0].material.forEach((m) => {
        m.color.set(color);
      });
    } else {
      mesh.children[0].material.color.set(color);
    }
  }

  static setOpacity(mesh, opacity) {
    if (Array.isArray(mesh.children[0].material)) {
      mesh.children[0].material.forEach((m) => {
        m.transparent = true;
        m.opacity = opacity;
      });
    } else {
      mesh.children[0].material.transparent = true;
      mesh.children[0].material.opacity = opacity;
    }
  }

  static selectCube(mesh) {
    if (!mesh) {
      return;
    }

    RenderComponent.setOpacity(mesh, 0.9);
  }

  static deselectCube(mesh) {
    if (!mesh) {
      return;
    }

    RenderComponent.setOpacity(mesh, 1);
  }

  paintCube(mesh) {
    if (!mesh) {
      return;
    }

    RenderComponent.setColor(mesh, this.stateColors.painted);
  }

  unpaintCube(mesh) {
    if (!mesh) {
      return;
    }

    RenderComponent.setColor(mesh, this.stateColors[mesh.cube.state]);
  }

  breakSolidCube(mesh) {
    if (!mesh) {
      return;
    }

    RenderComponent.setColor(mesh, this.stateColors.brokenSolid);
  }

  destroyCube(mesh) {
    if (!mesh) {
      return;
    }

    this.pivot.children[0].remove(mesh);
    mesh.children.forEach((c) => c.geometry.dispose());

    // Change geometry of near-by cubes to now show their faces
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dz = -1; dz <= 1; dz += 1) {
          if (dx === 0 && dy === 0 && dz === 0) {
            continue;
          }

          const x = mesh.cube.position.x + dx;
          const y = mesh.cube.position.y + dy;
          const z = mesh.cube.position.z + dz;

          const neighborCube = get(this.puzzleComponent.cubes, `[${x}][${y}][${z}]`);
          if (!neighborCube || neighborCube.state === 'nothing') {
            continue;
          }

          // todo duplicated code. refactor into a function
          const directions = [];
          this.faces.forEach(({ dir }, i) => {
            const neighbor = get(this.puzzleComponent.cubes, `[${x + dir[0]}][${y + dir[1]}][${z + dir[2]}]`);
            if (!neighbor || neighbor.state === 'nothing') {
              directions.push(i);
            }
          });
          const geometry = this.getCubeGeometry(directions);
          this.meshes[x][y][z].children[0].geometry = geometry;
        }
      }
    }
  }

  static getPuzzleCenter(cubes) {
    const xArr = [];
    const yArr = [];
    const zArr = [];

    cubes.forEach((face, x) => {
      face.forEach((line, y) => {
        line.forEach((cube, z) => {
          if (cube.state !== 'nothing') {
            xArr.push(x);
            yArr.push(y);
            zArr.push(z);
          }
        });
      });
    });

    const minX = Math.min(...xArr);
    const maxX = Math.max(...xArr);
    const minY = Math.min(...yArr);
    const maxY = Math.max(...yArr);
    const minZ = Math.min(...zArr);
    const maxZ = Math.max(...zArr);

    return [(maxX - minX) / 2 + minX, (maxY - minY) / 2 + minY, (maxZ - minZ) / 2 + minZ];
  }

  createPuzzleMesh(puzzleComponent) {
    this.puzzleComponent = puzzleComponent;
    this.generatePuzzleMesh();
  }

  destroyPreviousPuzzleMesh() {
    this.pivot.children[0].children.forEach((cube) => {
      this.destroyCube(cube);
    });
    scene.remove(this.pivot);
  }

  generatePuzzleMesh() {
    const pivot = new THREE.Group();
    const centerPoint = RenderComponent.getPuzzleCenter(this.puzzleComponent.cubes);
    const cubesMesh = new THREE.Object3D();
    cubesMesh.position.set(
      -centerPoint[0] * this.cubeSize,
      -centerPoint[1] * this.cubeSize,
      -centerPoint[2] * this.cubeSize,
    );
    pivot.add(cubesMesh);

    this.puzzleComponent.cubes.forEach((face, x) => {
      face.forEach((line, y) => {
        line.forEach((cube, z) => {
          if (cube.state !== 'nothing') {
            const directions = [];
            this.faces.forEach(({ dir }, i) => {
              const neighbor = get(this.puzzleComponent.cubes, `[${x + dir[0]}][${y + dir[1]}][${z + dir[2]}]`);
              if (!neighbor || neighbor.state === 'nothing') {
                directions.push(i);
              }
            });
            const geometry = this.getCubeGeometry(directions);
            const mesh = this.createCube(geometry, [x, y, z], cube.state, {
              x: this.puzzleComponent.clues.x?.[y]?.[z],
              y: this.puzzleComponent.clues.y?.[x]?.[z],
              z: this.puzzleComponent.clues.z?.[x]?.[y],
            });
            mesh.cube = cube;
            set(this.meshes, `[${x}][${y}][${z}]`, mesh);
            cubesMesh.add(mesh);
          }
        });
      });
    });

    this.pivot = pivot;
    this.pivot.rotation.x += 0.1;
    this.pivot.rotation.y += 0.5;
    scene.add(this.pivot);
    // todo check if empty cube uses just 1 render draw (and not 6)
  }

  getCubeGeometry(sides) {
    const positions = [];
    const indices = [];
    const uvs = [];
    const normals = [];
    const geometry = new THREE.BufferGeometry();

    sides.forEach((sideIndex, i) => {
      const side = this.faces[sideIndex];
      side.corners.forEach(({ pos, uv }) => {
        positions.push(...pos);
        normals.push(...side.dir);
        uvs.push(...uv);
      });
      const ndx = i * 4;
      indices.push(
        ndx, ndx + 2, ndx + 1,
        ndx + 2, ndx + 3, ndx + 1,
      );
      geometry.addGroup(i * 6, 6, sideIndex);
    });

    const setPositions = new Float32Array(positions);
    const setNormals = new Float32Array(normals);
    const setUvs = new Float32Array(uvs);

    geometry.setAttribute('position', new THREE.BufferAttribute(setPositions, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(setNormals, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(setUvs, 2));
    geometry.setIndex(indices);

    return geometry;
  }
}
