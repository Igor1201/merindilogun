import roll from 'roll';
import _ from 'lodash';
import w from 'winston';
import { Map, List, Record } from 'immutable';

const dice = new roll();

export class Unit extends Record({name:'', mod:0, proef:0, hp:0, actualHp:0, ac:0, init:0, skills:List()}, 'Unit') {
  constructor(sheet) {
    super(_.assign({}, sheet, {actualHp: sheet.actualHp || sheet.hp, skills:List(sheet.skills)}));
  }

  copy() {
    return new Unit(this.toJS());
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

  attack(unit) {
    // TODO: choose best skill
    const skill = this.getIn(['skills', 0]);

    if (this.attackRoll() >= unit.ac) {
      return unit.copy().update('actualHp', (hp) => hp - this.damageRoll(skill));
    }
    return unit;
  }
}
