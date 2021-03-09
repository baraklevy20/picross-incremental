import $ from 'jquery';
import { Subject } from 'rxjs';

export default class DomComponent {
  constructor(gameObservable) {
    this.observable = new Subject();

    gameObservable.subscribe((event) => {
      switch (event.type) {
        case 'gold_changed':
          DomComponent.onGoldChanged(event.gold);
          break;
        case 'upgrade_levelup':
          DomComponent.onUpgradeLevelUp(event.upgrade);
          break;
        default:
      }
    });
  }

  addUpgradesUI(upgrades) {
    Object.values(upgrades).forEach((upgrade) => {
      const element = `
        <h6 class="font-weight-light text-center text-nowrap">
          ${upgrade.label}: <span id="${upgrade.name}-current">${upgrade.currentValue}</span> <span id='${upgrade.name}-next' style="display: none;">(${upgrade.nextValue})</span>
        </h6>
        <button id="${upgrade.name}-buy-button"><span id="${upgrade.name}-buy-button-value">${upgrade.cost}</span> gold</button>
    `;

      $(document).on('click', `#${upgrade.name}-buy-button`, () => {
        this.observable.next({
          type: 'buy-upgrade',
          name: upgrade.name,
        });
      });

      $(document).on('mouseover', `#${upgrade.name}-buy-button`, () => {
        document.getElementById(`${upgrade.name}-next`).style.display = 'inline-block';
      });

      $(document).on('mouseleave', `#${upgrade.name}-buy-button`, () => {
        document.getElementById(`${upgrade.name}-next`).style.display = 'none';
      });
      document.getElementById('upgrades').innerHTML += element;
    });
  }

  static onUpgradeLevelUp(upgrade) {
    $(`#${upgrade.name}-buy-button-value`).text(upgrade.cost);
    $(`#${upgrade.name}-current`).text(upgrade.currentValue);
    $(`#${upgrade.name}-next`).text(`(${upgrade.nextValue})`);
  }

  static onGoldChanged(gold) {
    document.getElementById('goldValue').innerText = gold;
  }
}
