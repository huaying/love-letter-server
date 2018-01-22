const CARD = {
  Guard: {
    number: 1,
    skill: 'guess',
    guess: (game, player, data) => {
      const { playerId, guessCardId } = data;
      const otherPlayer = game._findPlayer(playerId);
      if (otherPlayer.card.id === guessCardId) {
        otherPlayer.lost = true;
      }
    },
  },
  Priest: {
    number: 2,
    skill: 'peek',
    peek: () => {}
  },
  Baron: {
    number: 3,
    skill: 'compare',
    compare: (game, player, data) => {
      const { playerId } = data;
      const otherPlayer = game._findPlayer(playerId);
      if (otherPlayer.card.number < player.card.number) {
        otherPlayer.lost = true;
      }
    }
  },
  Handmaid: {
    number: 4,
    skill: 'protect',
    protect: (game, player) => {
      player.isProtected = true;
    },
  },
  Prince: {
    number: 5,
    skill: 'redraw',
    redraw: (game, player, data) => {
      const { playerId } = data;
      const target = game._findPlayer(playerId);
      target.card = game.deck.deal();
    },
  },
  King: {
    number: 6,
    skill: 'swap',
    swap: (game, player, data) => {
      const { playerId } = data;
      const otherPlayer = game._findPlayer(playerId);
      [otherPlayer.card, player.card] = [player.card, otherPlayer.card];
    },
  },
  Countess: {
    number: 7,
    skill: 'sacrifice',
    sacrifice: () => {}
  },
  Princess: {
    number: 8,
    skill: 'hold',
    hold: (_, player) => {
      player.lost = true;
    }
  }
}

export default class Card {
  constructor(name) {
    const card = CARD[name];
    this.id = name;
    this.number = card.number;
    this.act = card[card.skill];
  }
}
