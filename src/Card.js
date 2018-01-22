const CARD = {
  Guard: {
    number: 1,
    ability: 'guess',
    guess: (game, player, data) => {
      const { playerId, guessCardId } = data;
      const otherPlayer = game.players[playerId];
      if (otherPlayer.card.id === guessCardId) {
        otherPlayer.setLost();
      }
    },
  },
  Priest: {
    number: 2,
    ability: 'peek',
    peek: (game, player, data) => {
      // otherPlayer.card.id
    }
  },
  Baron: {
    number: 3,
    ability: 'compare',
    compare: (game, player, data) => {
      const { playerId } = data;
      const otherPlayer = game.players[playerId];
      if (otherPlayer.card.number < player.card.number) {
        otherPlayer.setLost();
      }
    }
  },
  Handmaid: {
    number: 4,
    ability: 'protect',
    protect: (game, player, data) => {
      player.setProtected();
    },
  },
  Prince: {
    number: 5,
    ability: 'redraw',
    redraw: (game, player, data) => {
      // const { drawCardId } = data;
    },
  },
  King: {
    number: 6,
    ability: 'swap',
    swap: (game, player, data) => {
      const { playerId } = data;
      const otherPlayer = game.players[playerId];
      [otherPlayer.card, player.card] = [player.card, otherPlayer.card];
    },
  },
  Countess: {
    number: 7,
    ability: 'sacrifice',
    sacrifice: (game, player, data) => {}
  },
  Princess: {
    number: 8,
    ability: 'hold',
    hold: (game, player, data) => {}
  }
}

export default class Card {
  constructor(name) {
    const card = CARD[name];
    this.id = name;
    this.number = card.number;
    this.ability = card.ability;
  }
}
