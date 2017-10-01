import roll from 'roll';
import _ from 'lodash';
import w from 'winston';
import { List } from 'immutable';
import { Unit } from './unit';

const dice = new roll();

export class Battle {
  constructor(team1, team2) {
    this.team1 = List(team1);
    this.team2 = List(team2);
  }

  updatedTeam(team, unit) {
    const index = team.findIndex((u) => u.name === unit.name);
    return team
      .set(index, unit)
      .filter((u) => u.actualHp > 0);
  }

  turn() {
    // TODO: implement initiative
    this.team1.forEach((unit) => {
      const newEnemy = unit.attack(this.team2.get(0));
      this.team2 = this.updatedTeam(this.team2, newEnemy);
    });
    this.team2.forEach((unit) => {
      const newEnemy = unit.attack(this.team1.get(0));
      this.team1 = this.updatedTeam(this.team1, newEnemy);
    });
  }

  run() {
    w.debug('-- NEW BATTLE --');
    let turnNumber = 1;
    while(this.team1.size > 0 && this.team2.size > 0) {
      w.debug(this.team1.toJS());
      w.debug(this.team2.toJS());
      w.debug(`-- TURN ${turnNumber} --`);
      this.turn();
      turnNumber++;
    }

    w.debug(this.team1.toJS());
    w.debug(this.team2.toJS());
  }

  getResults() {
    return [this.team1.size > 0 ? 1 : 0, this.team2.size > 0 ? 1 : 0];
  }
}
