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
      if (upgrade.isFeature && upgrade.level === 1) {
        return;
      }

      const element = `
        <span id="upgrade-${upgrade.name}">
          <h6 class="font-weight-light text-center text-nowrap">
            ${upgrade.label}${upgrade.currentValue !== undefined ? `: <span id="${upgrade.name}-current">${upgrade.currentValue}</span> <span id='${upgrade.name}-next' style="display: none;">(${upgrade.nextValue})</span>` : ''}
          </h6>
          <button id="${upgrade.name}-buy-button" style="width: 100%;"><span id="${upgrade.name}-buy-button-value">${upgrade.cost}</span> gold</button>
        </span>
    `;

      $(document).on('click', `#${upgrade.name}-buy-button`, () => {
        this.observable.next({
          type: 'buy-upgrade',
          name: upgrade.name,
        });
      });

      $(document).on('mouseover', `#${upgrade.name}-buy-button`, () => {
        if (upgrade.nextValue !== undefined) {
          document.getElementById(`${upgrade.name}-next`).style.display = 'inline-block';
        }
      });

      $(document).on('mouseleave', `#${upgrade.name}-buy-button`, () => {
        if (upgrade.nextValue !== undefined) {
          document.getElementById(`${upgrade.name}-next`).style.display = 'none';
        }
      });
      document.getElementById('upgrades').innerHTML += element;
    });
  }

  static onUpgradeLevelUp(upgrade) {
    if (upgrade.isFeature && upgrade.level === 1) {
      $(`#upgrade-${upgrade.name}`).hide();
      return;
    }

    $(`#${upgrade.name}-buy-button-value`).text(upgrade.cost);
    $(`#${upgrade.name}-current`).text(upgrade.currentValue);
    $(`#${upgrade.name}-next`).text(`(${upgrade.nextValue})`);
  }

  static onGoldChanged(gold) {
    document.getElementById('goldValue').innerText = gold;
  }

  static updateGameTime(startTime) {
    const timeLeft = Math.floor((30000 - (performance.now() - startTime)) / 1000);
    const timeValueElement = document.getElementById('timeValue');
    const goodTimeElement = document.getElementById('timeGood');
    const badTimeElement = document.getElementById('timeBad');

    if (timeLeft >= 0) {
      goodTimeElement.style.display = 'block';
      badTimeElement.style.display = 'none';
      timeValueElement.innerText = timeLeft;
    } else {
      badTimeElement.style.display = 'block';
      goodTimeElement.style.display = 'none';
    }
  }
}
