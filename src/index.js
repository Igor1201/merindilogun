import roll from 'roll';
import _ from 'lodash';
import w from 'winston';
import { Unit } from './unit';
import { Battle } from './battle';

// w.level = 'debug';

const heroes = [
  new Unit({name:'eegor', mod:3, proef:2, hp:27, ac:16, init:3, skills:[
    {
      name: 'rapier',
      attack: '1d20',
      damage: '1d8',
    },
  ]}),
];
const enemies = [
  new Unit({name:'wolf', mod:2, proef:2, hp:54, ac:12, init:3, skills:[
    {
      name: 'bite',
      attack: '1d20',
      damage: '1d4',
    },
  ]}),
];

let victories = [0, 0];
w.profile('battle simulation');
for (let i = 0; i < 1000; i++) {
  const battle = new Battle(heroes, enemies);
  battle.run();
  const results = battle.getResults();

  victories[0] += results[0];
  victories[1] += results[1];
}
w.profile('battle simulation');
w.info(victories);
