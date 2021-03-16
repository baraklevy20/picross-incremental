/* eslint-disable no-param-reassign */
import { Subject } from 'rxjs';

export default class GameComponent {
  constructor(puzzleComponent) {
    this.puzzleComponent = puzzleComponent;
    this.observable = new Subject();
    this.setGold(10);

    this.upgrades = {
      'puzzle-width': {
        name: 'puzzle-width',
        label: 'Puzzle width',
        desc: 'Increase puzzle width by 1.<br>It takes effect starting at the next puzzle',
        baseCost: 15000,
        baseValue: 5,
        level: 0,
        costExp: 12.5,
        valueAddition: 1,
      },
      'puzzle-height': {
        name: 'puzzle-height',
        label: 'Puzzle height',
        desc: 'Increase puzzle height by 1.<br>It takes effect starting at the next puzzle',
        baseCost: 37500,
        baseValue: 5,
        level: 0,
        costExp: 12,
        valueAddition: 1,
      },
      'gold-per-cube': {
        name: 'gold-per-cube',
        label: 'Gold per cube',
        desc: 'Increase the gold you gain per black and white cube',
        baseCost: 5,
        baseValue: 1,
        level: 0,
        costExp: 1.15,
        valueMultiplier: 1.05,
      },
      'cube-resolution': {
        name: 'cube-resolution',
        label: 'Cube dimension',
        desc: 'Each cube contains a row (or sets of rows) of cubes, done recursively',
        baseCost: 0,
        baseValue: 0,
        level: 0,
        maxLevel: 9,
        costExp: 1,
        valueAddition: 1,
      },
      'unlock-circles': {
        name: 'unlock-circles',
        label: 'Unlock circle clues and x2 gold per cube',
        desc: 'Circle clues indicate the quantity of cubes in the current line is divided into two separated groups. e.g. 4 with a circle can be divided into 1,3; 2,2 or 3,1',
        baseCost: 1500,
        level: 0,
        isFeature: true,
      },
      'unlock-squares': {
        name: 'unlock-squares',
        label: 'Unlock square clues and x2 gold per cube',
        desc: 'Square clues indicate the quantity of cubes in the current line is divided into three or more separated groups. e.g. 4 with a circle can be divided into 1,3; 2,2; 1,1,2 or 1,1,1,1 (or any combination of those)',
        baseCost: 1,
        level: 0,
        isFeature: true,
      },
      // {
      //   name: 'win-condition-multiplier',
      //   label: 'Win condition multiplier',
      //   currentValue: 2,
      //   nextValue: 4,
      //   level: 0,
      //   price: 100,
      // },
      // {
      //   name: 'win-condition-time',
      //   label: 'Win condition time',
      //   currentValue: 100,
      //   nextValue: 105,
      //   level: 0,
      //   price: 100,
      //   addPercentage: true,
      // },
      // {
      //   name: 'win-condition-mistakes',
      //   label: 'Win condition mistakes allowed',
      //   currentValue: 0,
      //   nextValue: 1,
      //   level: 0,
      //   price: 100,
      // },
      // {
      //   name: 'winning-animation-time',
      //   label: 'Winning animation time',
      //   currentValue: 3,
      //   nextValue: 2.8,
      //   level: 0,
      //   price: 100,
      // },
    };

    this.initGame();
    this.completions = 0;
  }

  initGame() {
    this.isPuzzleComplete = false;
    this.gameStartTime = performance.now();
  }

  buyUpgrade(upgradeName) {
    const upgrade = this.upgrades[upgradeName];

    if (upgrade.cost > this.gold) {
      return;
    }

    if (upgrade.maxLevel !== undefined && upgrade.level >= upgrade.maxLevel) {
      return;
    }

    this.setGold(this.gold - upgrade.cost);
    upgrade.level += 1;
    upgrade.currentValue = upgrade.nextValue;
    GameComponent.calculateUpgradeValues(upgrade);
    this.observable.next({
      type: 'upgrade_levelup',
      upgrade,
    });
  }

  getWidth() {
    return this.upgrades['puzzle-width'].currentValue;
  }

  getHeight() {
    return this.upgrades['puzzle-height'].currentValue;
  }

  getDepth() {
    return 1;
  }

  calculateUpgradesValues() {
    Object.values(this.upgrades).forEach((upgrade) => {
      GameComponent.calculateUpgradeValues(upgrade);
    });
  }

  static calculateUpgradeValues(upgrade) {
    if (upgrade.isFeature) {
      upgrade.cost = upgrade.baseCost;
      return;
    }

    if (upgrade.level >= upgrade.maxLevel) {
      upgrade.cost = null;
      upgrade.nextValue = null;
      return;
    }

    upgrade.cost = Math.ceil(upgrade.baseCost * (upgrade.costExp ** upgrade.level));

    if (upgrade.level === 0) {
      upgrade.currentValue = upgrade.baseValue;
    }

    const nextValue = upgrade.valueMultiplier
      ? Math.ceil(upgrade.currentValue * upgrade.valueMultiplier)
      : upgrade.currentValue + upgrade.valueAddition;

    upgrade.nextValue = nextValue;
  }

  init() {
    // this is not working because nobody is subscribed to the observable.
    // we need the other components to first subscribe and then do setGold.
    // so maybe we'll call all the init functions AFTER we set the obserable.
    // this.setGold(10);
  }

  onDestroyedCube() {
    this.setGold(this.gold + this.getGoldPerDestroyedCube());
  }

  onPuzzleComplete() {
    this.completions += 1;
    console.log(this.completions);
    let reward = this.puzzleComponent.numberOfSolids * this.getGoldPerDestroyedCube();
    const timeBonus = performance.now() - this.gameStartTime < 30000;
    const noMistakesBonus = this.puzzleComponent.brokenSolids === 0;
    let perfectGameMultiplier = 1;
    if (timeBonus) {
      perfectGameMultiplier *= 1.5;
    }

    if (noMistakesBonus) {
      perfectGameMultiplier *= 1.5;
    }

    reward *= perfectGameMultiplier;

    // If there's a multiplier, we'll also multiply the number of spaces
    // but we 1 as we've already gotten the reward for these while playing
    reward += this.puzzleComponent.numberOfSpaces
      * (perfectGameMultiplier - 1) * this.getGoldPerDestroyedCube();

    const puzzleSize = this.getWidth() * this.getHeight();
    reward *= (3 * puzzleSize - 50) / 25; // 25 -> x1, 100 -> x10, 1000 -> x188
    this.setGold(this.gold + reward);
  }

  setGold(gold) {
    const roundedGold = Math.ceil(gold);

    if (this.gold === roundedGold) {
      return;
    }

    this.gold = roundedGold;
    this.observable.next({
      type: 'gold_changed',
      gold: roundedGold,
    });
  }

  getGoldPerDestroyedCube() {
    let value = 1;
    value *= this.upgrades['gold-per-cube'].currentValue;
    value *= this.upgrades['unlock-circles'].level === 1 ? 2 : 1;
    value *= this.upgrades['unlock-squares'].level === 1 ? 2 : 1;
    return value;
  }

  static getWinningAnimationTime() {
    return 4000; // todo change with upgrade
  }

  setDomObservable(observable) {
    observable.subscribe((event) => {
      switch (event.type) {
        case 'buy-upgrade':
          this.buyUpgrade(event.name);
          break;
        default:
      }
    });
  }

  setPhysicsObservable(observable) {
    observable.subscribe(({ type, mesh, mouse }) => {
      if (type === 'click') {
        if (this.isPuzzleComplete || !mesh) {
          return;
        }

        switch (mesh.cube.state) {
          case 'empty':
            if (mouse.button === 'left') {
              this.puzzleComponent.destroyCube(mesh.cube);
              this.onDestroyedCube();
              this.observable.next({
                type: 'cube_destroyed',
                mesh,
              });

              if (this.puzzleComponent.isSolved()) {
                this.onPuzzleComplete();
                this.isPuzzleComplete = true;
                this.observable.next({ type: 'puzzle_complete_started' });
                setTimeout(() => {
                  this.observable.next({ type: 'puzzle_complete_ended' });
                }, GameComponent.getWinningAnimationTime());
              }
            } else if (mouse.button === 'right') {
              mesh.cube.state = 'paintedEmpty';
              this.observable.next({
                type: 'space_painted',
                mesh,
              });
            }
            break;
          case 'part':
            if (mouse.button === 'left') {
              // todo add more logic here. split to a function 'onWrongBreak'
              mesh.cube.state = 'brokenSolid';
              this.observable.next({
                type: 'broke_solid_cube',
                mesh,
              });
              this.puzzleComponent.onBrokenSolid(mesh.cube);
            } else if (mouse.button === 'right') {
              mesh.cube.state = 'painted';
              this.observable.next({
                type: 'cube_painted',
                mesh,
              });
            }
            break;
          case 'painted':
            if (mouse.button === 'right') {
              mesh.cube.state = 'part';
              this.observable.next({
                type: 'cube_unpainted',
                mesh,
              });
            }
            break;
          case 'paintedEmpty':
            if (mouse.button === 'right') {
              mesh.cube.state = 'empty';
              this.observable.next({
                type: 'cube_unpainted',
                mesh,
              });
            }
            break;
          default:
        }
      }
    });
  }

  // todo might be exactly the same as initGame
  nextPuzzle() {
    this.initGame();
  }
}
