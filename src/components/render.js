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

  createFaceMaterial(faceHint, state) {
    if (faceHint === undefined) {
      const emptyMaterial = new THREE.MeshBasicMaterial();
      emptyMaterial.color.set(state === 'empty' ? this.emptyCubeColor : this.cubeColor);
      return emptyMaterial;
    }

    const canvas = document.createElement('canvas');
    const padding = 20;
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '64px CrashNumberingGothic';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';

    if (faceHint.spaces > 0) {
      ctx.beginPath();

      if (faceHint.spaces === 1) {
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          (canvas.width - 2 * padding) / 2,
          0,
          2 * Math.PI,
        );
      } else if (faceHint.spaces > 1) {
        ctx.rect(
          padding,
          padding,
          canvas.width - 2 * padding,
          canvas.height - 2 * padding,
        );
      }

      ctx.stroke();
    }
    ctx.fillText(faceHint.count, canvas.width / 2, canvas.height / 2);
    const textMaterial = new THREE.MeshBasicMaterial();
    textMaterial.map = new THREE.CanvasTexture(canvas);
    textMaterial.color.set(state === 'empty' ? this.emptyCubeColor : this.cubeColor);

    return textMaterial;
  }

  createTextMesh({
    x, y, z,
  }, state) {
    const xFace = this.createFaceMaterial(x, state);
    const yFace = this.createFaceMaterial(y, state);
    const zFace = this.createFaceMaterial(z, state);

    const materials = [];
    materials[0] = xFace;
    materials[1] = xFace;
    materials[2] = yFace;
    materials[3] = yFace;
    materials[4] = zFace;
    materials[5] = zFace;

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

    cubes.forEach((cube, i) => {
      const x = Math.floor(i / 100);
      const y = Math.floor(i / 10) % 10;
      const z = i % 10;

      if (cube.state === 'part' || cube.state === 'empty') {
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

    puzzleComponent.cubes.forEach((cube, i) => {
      if (cube.state === 'part' || cube.state === 'empty') {
        const mesh = this.createCube([
          Math.floor(i / 100),
          Math.floor(i / 10) % 10,
          i % 10,
        ], cube.state, puzzleComponent.hints[i]);
        mesh.cube = cube;
        cubesMesh.add(mesh);
      }
    });

    this.pivot = pivot;
  }
}
