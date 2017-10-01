import roll from 'roll';
import _ from 'lodash';
import w from 'winston';
import { Map, List, Record } from 'immutable';

const dice = new roll();

export class Unit extends Record({
  name: undefined, mod: 0, proef: 0, hp: 0, actualHp: 0, ac: 0, init: 0, team: undefined, skills: List(),
}, 'Unit') {

  constructor(sheet) {
    super(_.assign({}, sheet, {
      actualHp: sheet.actualHp || sheet.hp,
      skills: List(sheet.skills),
    }));
  }

  copy() {
    return new Unit(this.toJS());
  }

  initiativeRoll() {
    return dice.roll(`1d20+${this.init}`).result;
  }

  attackRoll() {
    // TODO: advantage/disadvantage, critical hit
    return dice.roll(`1d20+${this.mod}+${this.proef}`).result;
  }

  damageRoll(skill) {
    // TODO: consider critical hit
    const rolled = dice.roll(`${skill.damage}+${this.mod}`).result;
    w.debug(`${this.name} hits with ${rolled} (${skill.damage}+${this.mod})`);
    return rolled;
  }

  target(units) {
    return units.find((u) => u.team !== this.team);
  }

  attack(unit) {
    // TODO: choose best skill
    const skill = this.skills.first();

    if (this.attackRoll() >= unit.ac) {
      return unit.copy().update('actualHp', (hp) => hp - this.damageRoll(skill));
    }
    return unit;
  }
}
