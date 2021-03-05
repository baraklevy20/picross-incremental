import * as THREE from 'three';
import '../../styles.css';

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
  }

  createCube(cubePosition, state, hint) {
    const group = new THREE.Group();
    const cube = hint
      ? this.createTextMesh(hint, state)
      : new THREE.Mesh(this.geometry, state === 'empty' ? this.emptyMaterial.clone() : this.material.clone());
    group.state = state;
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

  createTextMesh({
    x, y, z, number,
  }, state) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '64px CrashNumberingGothic';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(number, canvas.width / 2, canvas.height / 2);
    const emptyMaterial = new THREE.MeshBasicMaterial();
    const textMaterial = new THREE.MeshBasicMaterial();
    textMaterial.map = new THREE.CanvasTexture(canvas);
    emptyMaterial.color.set(state === 'empty' ? this.emptyCubeColor : this.cubeColor);
    textMaterial.color.set(state === 'empty' ? this.emptyCubeColor : this.cubeColor);

    const materials = [];
    materials[0] = x ? textMaterial : emptyMaterial;
    materials[1] = x ? textMaterial : emptyMaterial;
    materials[2] = y ? textMaterial : emptyMaterial;
    materials[3] = y ? textMaterial : emptyMaterial;
    materials[4] = z ? textMaterial : emptyMaterial;
    materials[5] = z ? textMaterial : emptyMaterial;

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

  selectCube(cube) {
    if (!cube) {
      return;
    }

    if (cube.state === 'empty' || cube.state === 'part') {
      this.setColor(cube, this.selectedCubeColor);
    }
  }

  deselectCube(cube) {
    if (!cube) {
      return;
    }

    switch (cube.state) {
      case 'empty':
        this.setColor(cube, this.emptyCubeColor);
        break;
      case 'part':
        this.setColor(cube, this.cubeColor);
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

    cubes.forEach((e, i) => {
      const x = Math.floor(i / 100);
      const y = Math.floor(i / 10) % 10;
      const z = i % 10;

      if (e !== 0) {
        xArr.push(x);
        yArr.push(y);
        zArr.push(z);
      }
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
    const pivot = new THREE.Group();
    const centerPoint = this.getPuzzleCenter(puzzleComponent.cubes);
    const cubesMesh = new THREE.Object3D();
    cubesMesh.position.set(
      -centerPoint[0] * this.cubeSize,
      -centerPoint[1] * this.cubeSize,
      -centerPoint[2] * this.cubeSize,
    );
    pivot.add(cubesMesh);

    puzzleComponent.cubes.forEach((value, i) => {
      if (value >= 0x20) {
        const cube = this.createCube([
          Math.floor(i / 100),
          Math.floor(i / 10) % 10,
          i % 10,
        ], value < 0x30 ? 'empty' : 'part', puzzleComponent.hints[i]);
        cubesMesh.add(cube);
      }
    });

    this.pivot = pivot;
  }
}
