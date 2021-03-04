import * as THREE from 'three';

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

  // eslint-disable-next-line class-methods-use-this
  destroyCube(cube) {
    if (!cube) {
      return;
    }

    cube.children.forEach((c) => c.geometry.dispose());
  }
}
