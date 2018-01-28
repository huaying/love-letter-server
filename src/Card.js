export const GUARD = 1;
export const PRIEST = 2;
export const BARON = 3;
export const HANDMAID = 4;
export const PRINCE = 5;
export const KING = 6;
export const COUNTESS = 7;
export const PRINCESS = 8;

const CARD = {
  [GUARD]: {
    name: 'Guard',
    skill: 'guess',
    guess: (game, player, data) => {
      const { targetName, guessCardId } = data;
      const otherPlayer = game._findPlayer(targetName);
      if (otherPlayer.card.id === guessCardId) {
        otherPlayer.lost = true;
      }
    },
  },
  [PRIEST]: {
    name: 'Priest',
    skill: 'peek',
    peek: () => {}
  },
  [BARON]: {
    name: 'Baron',
    skill: 'compare',
    compare: (game, player, data) => {
      const { targetName } = data;
      const otherPlayer = game._findPlayer(targetName);
      if (otherPlayer.card.rank < player.card.rank) {
        otherPlayer.setLost();
      } else if (otherPlayer.card.rank > player.card.rank) {
        player.setLost();
      }
    }
  },
  [HANDMAID]: {
    name: 'Handmaid',
    skill: 'protect',
    protect: (game, player) => {
      player.protect();
    },
  },
  [PRINCE]: {
    name: 'Prince',
    skill: 'redraw',
    redraw: (game, player, data) => {
      const { targetName } = data;
      const target = game._findPlayer(targetName);
      target.card = game.deck.deal();
    },
  },
  [KING]: {
    name: 'King',
    skill: 'swap',
    swap: (game, player, data) => {
      const { targetName } = data;
      const otherPlayer = game._findPlayer(targetName);
      [otherPlayer.card, player.card] = [player.card, otherPlayer.card];
    },
  },
  [COUNTESS]: {
    name: 'Countess',
    skill: 'sacrifice',
    sacrifice: () => {}
  },
  [PRINCESS]: {
    name: 'Princess',
    skill: 'hold',
    hold: (_, player) => {
      player.setLost();
    }
  }
}

export default class Card {
  constructor(id) {
    const card = CARD[id];
    this.id = id;
    this.rank = id;
    this.name = card.name;
    this.act = card[card.skill];
  }
}
