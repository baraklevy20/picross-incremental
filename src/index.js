import Stats from 'stats.js';
import { merge } from 'lodash';
import { renderer, scene, camera } from './context';
import InputComponent from './components/input';
import PhysicsComponent from './components/physics';
import MeshComponent from './components/mesh';
import PuzzleComponent from './components/puzzle';
import GameComponent from './components/game';
import DomComponent from './components/dom';
import RenderComponent from './components/render';
import 'bootstrap';
import 'bootstrap/js/dist/tooltip';
import 'bootstrap/dist/css/bootstrap.min.css';

const cubeSize = 1;

let renderComponent;
let inputComponent;
let physicsComponent;
let meshComponent;
let puzzleComponent;
let gameComponent;
let domComponent;

const saveGame = () => {
  const save = (component) => {
    const result = { };

    Object.keys(component).forEach((key) => {
      // Ignore observables and components
      if (key === 'observable'
        || key.indexOf('Component') >= 0
        || component[key] === undefined) {
        return;
      }

      result[key] = component[key];
    });

    return result;
  };
  localStorage.setItem('gameSave', JSON.stringify({
    game: save(gameComponent),
    puzzle: save(puzzleComponent),
  }));
};

const loadGame = () => {
  const saveString = localStorage.getItem('gameSave');

  const load = (component, saveFile) => {
    Object.keys(saveFile).forEach((key) => {
      if (typeof saveFile[key] === 'object' && !Array.isArray(saveFile[key])) {
        // todo future bug - if i change one of the values in upgrades such as cost exp,
        // it'll actually take the value in the local storage instead of the updated one.
        // eslint-disable-next-line no-param-reassign
        component[key] = merge(component[key], saveFile[key]);
      } else {
      // eslint-disable-next-line no-param-reassign
        component[key] = saveFile[key];
      }
    });
  };

  if (saveString) {
    const saveObject = JSON.parse(saveString);

    load(gameComponent, saveObject.game);
    load(puzzleComponent, saveObject.puzzle);
  }
};

setInterval(saveGame, 3000);

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const animate = () => {
  stats.begin();

  if (gameComponent.isPuzzleComplete) {
    meshComponent.bigPivot.rotation.y += 0.03;
  } else {
    DomComponent.updateGameTime(gameComponent.gameStartTime);
  }

  renderComponent.controls.update();
  renderer.render(scene, camera);
  console.log(`render calls: ${renderer.info.render.calls}`);
  stats.end();
  requestAnimationFrame(animate);
};

const moveToNextPuzzle = async () => {
  MeshComponent.destroyPuzzleMesh(meshComponent.bigPivot);
  await puzzleComponent.onNextPuzzle(gameComponent);
  gameComponent.nextPuzzle();
  meshComponent.generatePuzzleMesh();
};

const initComponents = async () => {
  renderComponent = new RenderComponent(cubeSize);
  puzzleComponent = new PuzzleComponent();
  meshComponent = new MeshComponent(cubeSize);
  inputComponent = new InputComponent();
  physicsComponent = new PhysicsComponent();
  gameComponent = new GameComponent(puzzleComponent);
  domComponent = new DomComponent(gameComponent.observable);

  gameComponent.setDomObservable(domComponent.observable);
  gameComponent.setPhysicsObservable(physicsComponent.observable);

  puzzleComponent.setGameObservable(gameComponent.observable);

  meshComponent.setPhysicsObservable(physicsComponent.observable);
  meshComponent.setGameObservable(gameComponent.observable);
  meshComponent.setPuzzleObservable(puzzleComponent.observable);

  physicsComponent.setInputObservable(inputComponent.observable);
  physicsComponent.setMeshObservable(meshComponent.observable);

  renderComponent.setPhysicsObservable(physicsComponent.observable);

  gameComponent.observable.subscribe(({ type }) => {
    switch (type) {
      case 'puzzle_complete_started':
        MeshComponent.destroyPuzzleMesh(meshComponent.pivot);
        meshComponent.generateBigPuzzleMeshFromBlacksAndWhites();
        scene.add(meshComponent.bigPivot);
        break;
      case 'puzzle_complete_ended':
        moveToNextPuzzle();
        break;
      default:
        break;
    }
  });
};

const init = async () => {
  await initComponents();
  loadGame();

  await puzzleComponent.afterLoad();
  gameComponent.calculateUpgradesValues();
  domComponent.addUpgradesUI(gameComponent.upgrades);
  meshComponent.createPuzzleMesh(puzzleComponent);
};

const main = async () => {
  // Remove font loader div
  document.getElementById('preloadfont').remove();

  await init();
  animate();
};

// todo check compatibility
document.fonts.ready.then(main);
