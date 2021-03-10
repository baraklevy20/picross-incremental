import { Subject } from 'rxjs';

export default class GameComponent {
  constructor(puzzle) {
    this.puzzle = puzzle;
    this.observable = new Subject();
    this.setGold(10);

    this.upgrades = {
      'puzzle-width': {
        name: 'puzzle-width',
        label: 'Puzzle width',
        baseCost: 1500,
        baseValue: 5,
        level: 0,
        costExp: 12.5,
        nextValueFormula: (value) => value + 1,
      },
      'puzzle-height': {
        name: 'puzzle-height',
        label: 'Puzzle height',
        baseCost: 3750,
        baseValue: 5,
        level: 0,
        costExp: 12,
        nextValueFormula: (value) => value + 1,
      },
      'gold-per-cube': {
        name: 'gold-per-cube',
        label: 'Gold per cube',
        baseCost: 5,
        baseValue: 1,
        level: 0,
        costExp: 1.15,
        nextValueFormula: (value) => Math.ceil(value * 1.05),
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

    this.calculateUpgradesValues();
    this.gameStartTime = performance.now();
    this.completions = 0;
  }

  buyUpgrade(upgradeName) {
    const upgrade = this.upgrades[upgradeName];
    if (upgrade.cost <= this.gold) {
      this.setGold(this.gold - upgrade.cost);
      upgrade.level += 1;
      GameComponent.calculateUpgradeValues(upgrade);
      this.observable.next({
        type: 'upgrade_levelup',
        upgrade,
      });
    }
  }

  getWidth() {
    return this.upgrades['puzzle-width'].currentValue;
  }

  getHeight() {
    return this.upgrades['puzzle-height'].currentValue;
  }

  calculateUpgradesValues() {
    Object.values(this.upgrades).forEach((upgrade) => {
      GameComponent.calculateUpgradeValues(upgrade);
    });
  }

  static calculateUpgradeValues(upgrade) {
    upgrade.cost = Math.ceil(upgrade.baseCost * (upgrade.costExp ** upgrade.level));
    upgrade.currentValue = upgrade.nextValue || upgrade.baseValue;
    upgrade.nextValue = upgrade.nextValueFormula(upgrade.currentValue);
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
    let reward = this.puzzle.numberOfSolids * this.getGoldPerDestroyedCube();
    const timeBonus = performance.now() - this.gameStartTime < 30000;
    const noMistakesBonus = this.puzzle.brokenSolids === 0;
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
    reward += this.puzzle.numberOfSpaces
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
    return this.upgrades['gold-per-cube'].currentValue;
  }

  getObservable() {
    return this.observable;
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
}
