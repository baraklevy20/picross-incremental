import { get, set } from 'lodash';
import { Subject } from 'rxjs';
import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import '../../styles.css';
import { scene } from '../context';

export default class MeshComponent {
  constructor(cubeSize) {
    this.cubeSize = cubeSize;
    this.observable = new Subject();
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

  setPhysicsObservable(physicsObservable) {
    physicsObservable.subscribe(({ type, mesh }) => {
      if (type === 'move') {
        this.onNewSelectedCube(mesh);
      }
    });
  }

  setPuzzleObservable(observable) {
    observable.subscribe(({ type, dimension, cubes }) => {
      switch (type) {
        case 'resolution_changed':
          MeshComponent.destroyPuzzleMesh(this.bigPivot);
          this.generateBigPuzzleMesh(dimension, cubes);
          break;
        default:
      }
    });
  }

  setGameObservable(observable) {
    observable.subscribe(({ type, mesh }) => {
      switch (type) {
        case 'cube_destroyed':
          this.destroyCube(mesh);
          break;
        case 'cube_painted':
          this.paintCube(mesh);
          break;
        case 'cube_unpainted':
          this.unpaintCube(mesh);
          break;
        case 'space_painted':
          this.paintCube(mesh);
          break;
        case 'broke_solid_cube':
          this.breakSolidCube(mesh);
          break;
        default:
      }
    });
  }

  onNewSelectedCube(newIntersectedCube) {
    // If we are pointing at a cube
    if (newIntersectedCube) {
      // If it's the same cube we're already pointing at, ignore
      if (this.intersectedCube === newIntersectedCube) {
        return;
      }

      // If we used to point at a different cube, deselect the previous cube
      if (this.intersectedCube) {
        MeshComponent.deselectCube(this.intersectedCube);
      }

      // Select the newly pointed-at cube
      this.intersectedCube = newIntersectedCube;
      MeshComponent.selectCube(this.intersectedCube);
    } else {
    // If we aren't pointing at any cube, deselect the previously pointed-at cube
      MeshComponent.deselectCube(this.intersectedCube);
      this.intersectedCube = null;
    }
  }

  createCube(cubeSize, geometry, position, state, clue) {
    const group = new THREE.Group();
    const material = this.createTextMaterial(clue, state);

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(
      position[0] * cubeSize,
      position[1] * cubeSize,
      position[2] * cubeSize,
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

    MeshComponent.setOpacity(mesh, 0.9);
  }

  static deselectCube(mesh) {
    if (!mesh) {
      return;
    }

    MeshComponent.setOpacity(mesh, 1);
  }

  paintCube(mesh) {
    if (!mesh) {
      return;
    }

    MeshComponent.setColor(mesh, this.stateColors.painted);
  }

  unpaintCube(mesh) {
    if (!mesh) {
      return;
    }

    MeshComponent.setColor(mesh, this.stateColors[mesh.cube.state]);
  }

  breakSolidCube(mesh) {
    if (!mesh) {
      return;
    }

    MeshComponent.setColor(mesh, this.stateColors.brokenSolid);
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
          const geometry = this.getCubeGeometry({
            x: this.cubeSize,
            y: this.cubeSize,
            z: this.cubeSize,
          }, directions);
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

  static destroyPuzzleMesh(pivot) {
    if (!pivot) {
      return;
    }

    pivot.children[0].children.forEach((cube) => {
      pivot.children[0].remove(cube);
      cube.children.forEach((c) => c.geometry.dispose());
    });
    scene.remove(pivot);
  }

  generatePuzzleMesh() {
    const pivot = new THREE.Group();
    const centerPoint = MeshComponent.getPuzzleCenter(this.puzzleComponent.cubes);
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
            const geometry = this.getCubeGeometry({
              x: this.cubeSize,
              y: this.cubeSize,
              z: this.cubeSize,
            },
            directions);
            const mesh = this.createCube(this.cubeSize, geometry, [x, y, z], cube.state, {
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
    this.observable.next(pivot);
    // todo check if empty cube uses just 1 render draw (and not 6)
  }

  generateBigPuzzleMesh(dimension, bigCubes) {
    const maxDimension = 3;
    const xSize = 2 ** Math.min(Math.ceil(dimension / 2), maxDimension);
    const ySize = 2 ** Math.min(Math.ceil((dimension - 1) / 2), maxDimension);
    const zSize = 2 ** Math.max(0, dimension - maxDimension * 2);
    const pivot = new THREE.Group();
    const centerPoint = MeshComponent.getPuzzleCenter(bigCubes);
    const cubesMesh = new THREE.Object3D();
    cubesMesh.position.set(
      -centerPoint[0] * this.cubeSize / xSize,
      -centerPoint[1] * this.cubeSize / ySize,
      -centerPoint[2] * this.cubeSize / zSize,
    );
    pivot.add(cubesMesh);

    const blackCubes = [];

    bigCubes.forEach((face, x) => {
      face.forEach((line, y) => {
        line.forEach((cube, z) => {
          if (cube >= 0x30) {
            const directions = [];
            this.faces.forEach(({ dir }, i) => {
              const neighbor = get(bigCubes, `[${x + dir[0]}][${y + dir[1]}][${z + dir[2]}]`);
              if (!neighbor || neighbor.state !== 'part') {
                directions.push(i);
              }
            });

            const geometry = this.getCubeGeometry({
              x: this.cubeSize / xSize,
              y: this.cubeSize / ySize,
              z: this.cubeSize / zSize,
            }, directions);
            geometry.translate(
              x * this.cubeSize / xSize,
              y * this.cubeSize / ySize,
              z * this.cubeSize / zSize,
            );
            blackCubes.push(geometry);
          }
        });
      });
    });

    const singleBlackGeometry = BufferGeometryUtils.mergeBufferGeometries(blackCubes, true);
    const blackMaterial = new THREE.MeshBasicMaterial({ color: this.stateColors.painted });
    cubesMesh.add(new THREE.Mesh(
      singleBlackGeometry,
      blackMaterial,
    ));
    this.bigPivot = pivot;
    pivot.rotation.x += 0.1;
    pivot.rotation.y += 0.5;
  }

  getCubeGeometry(cubeSize, sides) {
    const positions = [];
    const indices = [];
    const uvs = [];
    const normals = [];
    const geometry = new THREE.BufferGeometry();

    sides.forEach((sideIndex, i) => {
      const side = this.faces[sideIndex];
      side.corners.forEach(({ pos, uv }) => {
        positions.push(pos[0] * cubeSize.x, pos[1] * cubeSize.y, pos[2] * cubeSize.z);
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
