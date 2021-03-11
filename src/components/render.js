import * as THREE from 'three';
import '../../styles.css';
import { scene } from '../context';

export default class RenderComponent {
  constructor(cubeSize) {
    this.cubeSize = cubeSize;
    this.cubeColor = '#d7d7d7';
    this.emptyCubeColor = '#ffffd7';
    this.selectedCubeColor = '#c7c7c7';
    this.paintedCubeColor = '#0000ff';
    this.brokenPartColor = '#ff0000';
    this.geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    this.material = new THREE.MeshBasicMaterial({ color: this.cubeColor });
    this.emptyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffd7 });
    this.selectedMaterial = new THREE.MeshBasicMaterial({ color: 0xc7c7c7 });
    this.outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xbebebe, side: THREE.BackSide });
    this.cache = {};
  }

  createCube(cubePosition, state, clue) {
    const group = new THREE.Group();
    const cube = clue && (clue.x || clue.y || clue.z)
      ? this.createTextMesh(clue, state)
      : new THREE.Mesh(this.geometry, state === 'empty' ? this.emptyMaterial.clone() : this.material.clone());
    cube.position.set(
      cubePosition[0] * this.cubeSize,
      cubePosition[1] * this.cubeSize,
      cubePosition[2] * this.cubeSize,
    );

    const outline = new THREE.Mesh(this.geometry, this.outlineMaterial.clone());
    outline.position.set(
      cubePosition[0] * this.cubeSize,
      cubePosition[1] * this.cubeSize,
      cubePosition[2] * this.cubeSize,
    );
    outline.scale.multiplyScalar(1.05);

    group.add(cube);
    group.add(outline);
    return group;
  }

  createFaceMaterial(faceClue, state) {
    if (faceClue === undefined) {
      const emptyMaterial = this.emptyMaterial.clone();
      emptyMaterial.color.set(state === 'empty' ? this.emptyCubeColor : this.cubeColor);
      return emptyMaterial;
    }

    const cacheValue = this.cache[`${state}-${faceClue.spaces > 1 ? 2 : faceClue.spaces}-${faceClue.count}`];
    if (cacheValue) {
      return cacheValue;
    }

    const canvas = document.createElement('canvas');
    const padding = 60;
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${(canvas.width * 3) / 4}px CrashNumberingGothic`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 20;

    if (faceClue.spaces > 0) {
      ctx.beginPath();

      if (faceClue.spaces === 1) {
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          (canvas.width - 2 * padding) / 2,
          0,
          2 * Math.PI,
        );
      } else if (faceClue.spaces > 1) {
        ctx.rect(
          padding,
          padding,
          canvas.width - 2 * padding,
          canvas.height - 2 * padding,
        );
      }

      ctx.stroke();
    }
    ctx.fillText(faceClue.count, canvas.width / 2, canvas.height / 2);
    const textMaterial = new THREE.MeshBasicMaterial();
    textMaterial.map = new THREE.CanvasTexture(canvas);
    textMaterial.color.set(state === 'empty' ? this.emptyCubeColor : this.cubeColor);
    this.cache[`${state}-${faceClue.spaces > 1 ? 2 : faceClue.spaces}-${faceClue.count}`] = textMaterial;
    return textMaterial;
  }

  createTextMesh({
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

    return new THREE.Mesh(this.geometry, materials);
  }

  // eslint-disable-next-line class-methods-use-this
  setColor(cube, color) {
    if (Array.isArray(cube.children[0].material)) {
      cube.children[0].material.forEach((m) => {
        m.color.set(color);
      });
    } else {
      cube.children[0].material.color.set(color);
    }
  }

  selectCube(mesh) {
    if (!mesh) {
      return;
    }

    if (mesh.cube.state === 'empty' || mesh.cube.state === 'part') {
      this.setColor(mesh, this.selectedCubeColor);
    }
  }

  deselectCube(mesh) {
    if (!mesh) {
      return;
    }

    switch (mesh.cube.state) {
      case 'empty':
        this.setColor(mesh, this.emptyCubeColor);
        break;
      case 'part':
        this.setColor(mesh, this.cubeColor);
        break;
      default:
    }
  }

  paintCube(cube) {
    if (!cube) {
      return;
    }

    this.setColor(cube, this.paintedCubeColor);
  }

  unpaintCube(cube) {
    // in the future it might be different. maybe some special effects etc
    this.deselectCube(cube);
  }

  setBrokenPartCube(cube) {
    if (!cube) {
      return;
    }

    this.setColor(cube, this.brokenPartColor);
  }

  destroyCube(cube) {
    if (!cube) {
      return;
    }

    this.pivot.children[0].remove(cube);
    cube.children.forEach((c) => c.geometry.dispose());
  }

  // eslint-disable-next-line class-methods-use-this
  getPuzzleCenter(cubes) {
    const xArr = [];
    const yArr = [];
    const zArr = [];

    cubes.forEach((face, x) => {
      face.forEach((line, y) => {
        line.forEach((cube, z) => {
          if (cube.state === 'part' || cube.state === 'empty') {
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
    if (this.pivot) {
      this.pivot.children[0].children.forEach((cube) => {
        this.destroyCube(cube);
      });
      scene.remove(this.pivot);
    }
  }

  generatePuzzleMesh() {
    this.destroyPreviousPuzzleMesh();
    const pivot = new THREE.Group();
    const centerPoint = this.getPuzzleCenter(this.puzzleComponent.cubes);
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
          if (cube.state === 'part' || cube.state === 'empty') {
            const mesh = this.createCube([x, y, z], cube.state, {
              x: this.puzzleComponent.clues.x?.[y]?.[z],
              y: this.puzzleComponent.clues.y?.[x]?.[z],
              z: this.puzzleComponent.clues.z?.[x]?.[y],
            });
            mesh.cube = cube;
            cubesMesh.add(mesh);
          }
        });
      });
    });

    this.pivot = pivot;
    this.pivot.rotation.x += 0.1;
    this.pivot.rotation.y += 0.5;
    scene.add(this.pivot);
  }
}
