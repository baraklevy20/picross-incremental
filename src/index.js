import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

const cubes = [
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

const emptyCubes = [
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

const cubeSize = 1;
const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const material = new THREE.MeshBasicMaterial({ color: 0xd7d7d7 });
const emptyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffd7 });
const selectedMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xbebebe, side: THREE.BackSide });
const raycaster = new THREE.Raycaster(); // create once
const mouse = new THREE.Vector2(); // create once
let intersectedCube;
const pivot = new THREE.Group();

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
  // pivot.position.sub(new THREE.Vector3(2, 2, 0));
  // pivot.rotation.z += 0.02;
  // pivot.position.add(new THREE.Vector3(2, 2, 0));
  // pivot.rotation.x += 0.02;
  renderer.render(scene, camera);
};

const initMouseClick = () => {
  document.addEventListener('mousemove', (event) => {
    event.preventDefault();

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    // todo find might be slow. change it to only work on the cubes and not the outlines.
    const intersects = raycaster.intersectObjects(pivot.children[0].children.filter((c) => c.banana !== undefined));
    // console.log(intersects.length);
    if (intersects.length > 0) {
      if (intersectedCube !== intersects[0].object) {
        if (intersectedCube) {
          intersectedCube.material = intersectedCube.banana ? material : emptyMaterial;
        }
        intersectedCube = intersects[0].object;
        intersectedCube.material = selectedMaterial;
      }
    } else if (intersectedCube) {
      intersectedCube.material = intersectedCube.banana ? material : emptyMaterial;
      intersectedCube = null;
    }
  });

  document.addEventListener('pointerdown', () => {
    if (intersectedCube) {
      pivot.children[0].remove(intersectedCube);
      intersectedCube.geometry.dispose();
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
  const centerPoint = getCenterPoint(cubes);
  const cubesMesh = new THREE.Object3D();
  cubesMesh.position.set(
    -centerPoint[0] * cubeSize,
    -centerPoint[1] * cubeSize,
    -centerPoint[2] * cubeSize,
  );
  pivot.add(cubesMesh);
  scene.add(pivot);

  cubes.forEach((cubePosition) => {
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

  emptyCubes.forEach((cubePosition) => {
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
  initMouseClick();
};
const main = () => {
  init();
  animate();
};

main();
