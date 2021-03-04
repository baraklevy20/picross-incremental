import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import InputComponent from './components/input';
import PhysicsComponent from './components/physics';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
let controls;

const cubesPositions = [
  [0, 4, 0],
  [1, 4, 0],
  [2, 0, 0],
  [2, 1, 0],
  [2, 2, 0],
  [2, 3, 0],
  [2, 4, 0],
  [3, 4, 0],
  [4, 4, 0],
];

const emptyCubesPositions = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 2, 0],
  [0, 3, 0],
  [1, 0, 0],
  [1, 1, 0],
  [1, 2, 0],
  [1, 3, 0],
  [3, 0, 0],
  [3, 1, 0],
  [3, 2, 0],
  [3, 3, 0],
  [4, 0, 0],
  [4, 1, 0],
  [4, 2, 0],
  [4, 3, 0],
];

const cubeSize = 3;
const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const material = new THREE.MeshBasicMaterial({ color: 0xd7d7d7 });
const emptyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffd7 });
const selectedMaterial = new THREE.MeshBasicMaterial({ color: 0xc7c7c7 });
const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xbebebe, side: THREE.BackSide });
let intersectedCube;

const pivot = new THREE.Group();
let inputComponent;
let physicsComponent;

const getCenterPoint = (cubes) => {
  const minX = Math.min(...cubes.map((pos) => pos[0]));
  const maxX = Math.max(...cubes.map((pos) => pos[0]));
  const minY = Math.min(...cubes.map((pos) => pos[1]));
  const maxY = Math.max(...cubes.map((pos) => pos[1]));
  const minZ = Math.min(...cubes.map((pos) => pos[2]));
  const maxZ = Math.max(...cubes.map((pos) => pos[2]));

  return [(maxX - minX) / 2 + minX, (maxY - minY) / 2 + minY, (maxZ - minZ) / 2 + minZ];
};
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  // pivot.rotation.y += 0.03;
  renderer.render(scene, camera);
};

const onCubeClick = (cube) => {
  if (!cube) {
    return;
  }

  pivot.children[0].remove(cube);
  cube.geometry.dispose();
};

const onMove = (mouse) => {
  const intersectedObject = physicsComponent.getIntersectedObject(mouse);

  // If we are pointing at a cube
  if (intersectedObject) {
    // If it's the same cube we're already pointing at, ignore
    if (intersectedCube === intersectedObject) {
      return;
    }

    // If we used to point at a different cube, change the material of that cube to the original
    if (intersectedCube) {
      intersectedCube.material = intersectedCube.banana ? material : emptyMaterial;
    }

    // Change the material of the newly pointed-at cube
    intersectedCube = intersectedObject;
    intersectedCube.material = selectedMaterial;
    // eslint-disable-next-line brace-style
  }
  // If we aren't pointing at any cube, return the previously pointed-at cube's material
  else if (intersectedCube) {
    intersectedCube.material = intersectedCube.banana ? material : emptyMaterial;
    intersectedCube = null;
  }
};

const onMouseClick = (mouse) => {
  onCubeClick(physicsComponent.getIntersectedObject(mouse));
};

const initComponents = () => {
  inputComponent = new InputComponent(renderer);
  physicsComponent = new PhysicsComponent(camera, pivot);

  inputComponent.getObservable().subscribe(({ type, mouse }) => {
    switch (type) {
      case 'move':
        onMove(mouse);
        break;
      case 'click':
        onMouseClick(mouse);
        break;
      default:
    }
  });
};

const initCameraAndOrbitControl = () => {
  // const centerPoint = getCenterPoint(cubes);
  // controls.target.set(centerPoint[0], centerPoint[1], centerPoint[2]);
  controls.target.set(1, 0, 0);
  controls.rotateSpeed = 0.5;

  camera.position.z = cubeSize * 10;
  controls.update();
};
const init = () => {
  renderer.setClearColor(0x9999ff, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  const centerPoint = getCenterPoint(cubesPositions);
  const cubesMesh = new THREE.Object3D();
  cubesMesh.position.set(
    -centerPoint[0] * cubeSize,
    -centerPoint[1] * cubeSize,
    -centerPoint[2] * cubeSize,
  );
  pivot.add(cubesMesh);
  scene.add(pivot);

  cubesPositions.forEach((cubePosition) => {
    const cube = new THREE.Mesh(geometry, material);
    cube.banana = true;
    cube.position.set(
      cubePosition[0] * cubeSize,
      cubePosition[1] * cubeSize,
      cubePosition[2] * cubeSize,
    );
    cubesMesh.add(cube);

    const outlineCube = new THREE.Mesh(geometry, outlineMaterial);
    outlineCube.position.set(
      cubePosition[0] * cubeSize,
      cubePosition[1] * cubeSize,
      cubePosition[2] * cubeSize,
    );
    outlineCube.scale.multiplyScalar(1.05);

    cubesMesh.add(outlineCube);
  });

  emptyCubesPositions.forEach((cubePosition) => {
    const cube = new THREE.Mesh(geometry, emptyMaterial);
    cube.banana = false;
    cube.position.set(
      cubePosition[0] * cubeSize,
      cubePosition[1] * cubeSize,
      cubePosition[2] * cubeSize,
    );
    cubesMesh.add(cube);

    const outlineCube = new THREE.Mesh(geometry, outlineMaterial);
    outlineCube.position.set(
      cubePosition[0] * cubeSize,
      cubePosition[1] * cubeSize,
      cubePosition[2] * cubeSize,
    );
    outlineCube.scale.multiplyScalar(1.05);

    cubesMesh.add(outlineCube);
  });

  initCameraAndOrbitControl();
  initComponents();
};
const main = () => {
  init();
  animate();
};

main();
