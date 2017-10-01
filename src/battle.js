import roll from 'roll';
import _ from 'lodash';
import w from 'winston';
import { List, Map } from 'immutable';
import { Unit } from './unit';

const dice = new roll();

export class Battle {
  constructor(units) {
    this.units = List(units).sortBy((u) => -u.initiativeRoll());
    this._initialTeams = this.units
      .groupBy((u) => u.team)
      .keySeq()
      .size;
    this.alreadyPlayed = Map();
  }

  updatedUnits(units, unit) {
    const index = units.findIndex((u) => u.name === unit.name);
    return units
      .filter((u) => u.actualHp > 0)
      .set(index, unit)
      .sortBy((u) => u.actualHp);
  }

  turn() {
    while(!this.turnHasEnded()) {
      const unit = this.units.find((u) => !this.alreadyPlayed.has(u.name));
      const target = unit.target(this.units);
      if (!!target) {
        const newTarget = unit.attack(target);
        this.units = this.updatedUnits(this.units, newTarget);
      }
      this.alreadyPlayed = this.alreadyPlayed.set(unit.name, true);
    }
    this.alreadyPlayed = Map();
  }

  turnHasEnded() {
    return this.units
      .map((u) => this.alreadyPlayed.has(u.name))
      .every((v) => v);
  }

  hasEnded() {
    return this.units
      .groupBy((u) => u.team)
      .keySeq()
      .size
      < this._initialTeams;
  }

  run() {
    w.debug('-- NEW BATTLE --');
    let turnNumber = 1;
    while(!this.hasEnded()) {
      w.debug(this.units.toJS());
      w.debug(`-- TURN ${turnNumber} --`);
      this.turn();
      turnNumber++;
    }

    w.debug(this.units.toJS());
  }

  getResults() {
    return this.units
      .groupBy((u) => u.team)
      .map((_k, v) => v.length > 0);
  }
}
