import * as THREE from 'three';

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
    this.geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    this.material = new THREE.MeshBasicMaterial({ color: 0xd7d7d7 });
    this.emptyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffd7 });
    this.selectedMaterial = new THREE.MeshBasicMaterial({ color: 0xc7c7c7 });
    this.outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xbebebe, side: THREE.BackSide });
  }

  createCube(cubePosition, isEmpty) {
    const group = new THREE.Group();
    const cube = new THREE.Mesh(this.geometry, isEmpty ? this.emptyMaterial : this.material);
    group.isEmpty = isEmpty;
    cube.position.set(
      cubePosition[0] * this.cubeSize,
      cubePosition[1] * this.cubeSize,
      cubePosition[2] * this.cubeSize,
    );

    const outline = new THREE.Mesh(this.geometry, this.outlineMaterial);
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

  selectCube(cube) {
    if (!cube) {
      return;
    }

    // eslint-disable-next-line no-param-reassign
    cube.children[0].material = this.selectedMaterial;
  }

  deselectCube(cube) {
    if (!cube) {
      return;
    }

    // eslint-disable-next-line no-param-reassign
    cube.children[0].material = cube.isEmpty ? this.emptyMaterial : this.material;
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
