import roll from 'roll';
import _ from 'lodash';
import w from 'winston';
import { Map } from 'immutable';
import { Unit } from './unit';
import { Battle } from './battle';

// w.level = 'debug';

const units = [
  new Unit({
    name: 'eegor', mod: 3, proef: 2, hp: 27, ac: 16, init: 3,
    team: 'heroes',
    skills: [
      {
        name: 'rapier',
        attack: '1d20',
        damage: '1d8',
      },
    ],
  }),
  new Unit({
    name: 'wolf', mod: 2, proef: 2, hp: 54, ac: 12, init: 3,
    team: 'enemies',
    skills: [
      {
        name: 'bite',
        attack: '1d20',
        damage: '1d4',
      },
    ],
  }),
];

let victories = Map();
w.profile('battle simulation');
for (let i = 0; i < 1000; i++) {
  const battle = new Battle(units);
  battle.run();
  const results = battle.getResults();

  victories = victories
    .update('heroes', 0, (v) => v + (results.get('heroes') ? 1 : 0))
    .update('enemies', 0, (v) => v + (results.get('enemies') ? 1 : 0));
}
w.profile('battle simulation');
w.info(victories.toJS());
