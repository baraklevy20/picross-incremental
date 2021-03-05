import * as THREE from 'three';
import '../../styles.css';

// todo move to some utility function?
const getPuzzleCenter = (cubesPositions) => {
  const minX = Math.min(...cubesPositions.map((pos) => pos[0]));
  const maxX = Math.max(...cubesPositions.map((pos) => pos[0]));
  const minY = Math.min(...cubesPositions.map((pos) => pos[1]));
  const maxY = Math.max(...cubesPositions.map((pos) => pos[1]));
  const minZ = Math.min(...cubesPositions.map((pos) => pos[2]));
  const maxZ = Math.max(...cubesPositions.map((pos) => pos[2]));

  return [(maxX - minX) / 2 + minX, (maxY - minY) / 2 + minY, (maxZ - minZ) / 2 + minZ];
};

export default class RenderComponent {
  constructor(cubeSize) {
    this.cubeSize = cubeSize;
    this.cubeColor = '#d7d7d7';
    this.emptyCubeColor = '#ffffd7';
    this.selectedCubeColor = '#c7c7c7';
    this.geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    this.material = new THREE.MeshBasicMaterial({ color: this.cubeColor });
    this.emptyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffd7 });
    this.selectedMaterial = new THREE.MeshBasicMaterial({ color: 0xc7c7c7 });
    this.outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xbebebe, side: THREE.BackSide });
  }

  createCube(cubePosition, isEmpty) {
    const group = new THREE.Group();
    const cube = cubePosition[0] === 0 && cubePosition[1] === 1
      ? this.createTextMesh('10', isEmpty, { x: true, y: true, z: true })
      : new THREE.Mesh(this.geometry, isEmpty ? this.emptyMaterial.clone() : this.material.clone());
    group.isEmpty = isEmpty;
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

  createTextMesh(number, isEmpty, faces) {
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
    const emptyMaterial = new THREE.MeshBasicMaterial({ color: isEmpty ? this.emptyCubeColor : this.cubeColor });
    const textMaterial = new THREE.MeshBasicMaterial();
    textMaterial.map = new THREE.CanvasTexture(canvas);
    textMaterial.color.set(isEmpty ? this.emptyCubeColor : this.cubeColor);

    const materials = [];
    materials[0] = faces.x ? textMaterial : emptyMaterial;
    materials[1] = faces.x ? textMaterial : emptyMaterial;
    materials[2] = faces.y ? textMaterial : emptyMaterial;
    materials[3] = faces.y ? textMaterial : emptyMaterial;
    materials[4] = faces.z ? textMaterial : emptyMaterial;
    materials[5] = faces.z ? textMaterial : emptyMaterial;

    return new THREE.Mesh(this.geometry, materials);
  }

  selectCube(cube) {
    if (!cube) {
      return;
    }

    if (Array.isArray(cube.children[0].material)) {
      cube.children[0].material.forEach((m) => {
        m.color.set(this.selectedCubeColor);
      });
    } else {
      cube.children[0].material.color.set(this.selectedCubeColor);
    }
  }

  deselectCube(cube) {
    if (!cube) {
      return;
    }

    if (Array.isArray(cube.children[0].material)) {
      cube.children[0].material.forEach((m) => {
        m.color.set(cube.isEmpty ? this.emptyCubeColor : this.cubeColor);
      });
    } else {
      cube.children[0].material.color.set(cube.isEmpty ? this.emptyCubeColor : this.cubeColor);
    }
  }

  destroyCube(cube) {
    if (!cube) {
      return;
    }

    this.pivot.children[0].remove(cube);
    cube.children.forEach((c) => c.geometry.dispose());
  }

  createPuzzleMesh(cubesPositions, emptyCubesPositions) {
    const pivot = new THREE.Group();
    const centerPoint = getPuzzleCenter(cubesPositions);
    const cubesMesh = new THREE.Object3D();
    cubesMesh.position.set(
      -centerPoint[0] * this.cubeSize,
      -centerPoint[1] * this.cubeSize,
      -centerPoint[2] * this.cubeSize,
    );
    pivot.add(cubesMesh);

    cubesPositions.forEach((cubePosition) => {
      cubesMesh.add(this.createCube(cubePosition, false));
    });

    emptyCubesPositions.forEach((cubePosition) => {
      cubesMesh.add(this.createCube(cubePosition, true));
    });

    this.pivot = pivot;
  }

  getPivot() {
    return this.pivot;
  }
}
