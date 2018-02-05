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
      if (!targetName) return {};
      const targetPlayer = game._findPlayer(targetName);
      if (targetPlayer.card.id === guessCardId) {
        targetPlayer.lost = true;
        return {
          success: true,
          loserName: targetName,
          losingCardName: targetPlayer.card.name
        };
      }
      return {
        success: false,
      };
    },
  },
  [PRIEST]: {
    name: 'Priest',
    skill: 'peek',
    peek: (game, player, data) => {
      const { targetName } = data;
      const targetPlayer = game._findPlayer(targetName);
      return {
        targetPlayerCardName: targetPlayer.card.name,
      }
    }
  },
  [BARON]: {
    name: 'Baron',
    skill: 'compare',
    compare: (game, player, data) => {
      const { targetName } = data;
      if (!targetName) return {};
      const otherPlayer = game._findPlayer(targetName);
      if (otherPlayer.card.rank < player.card.rank) {
        otherPlayer.setLost();
        return {
          winnerName: player.name,
          loserName: otherPlayer.name,
          winningCardName: player.card.name,
          losingCardName: otherPlayer.card.name,
        };
      } else if (otherPlayer.card.rank > player.card.rank) {
        player.setLost();
        return {
          winnerName: otherPlayer.name,
          loserName: player.name,
          winningCardName: otherPlayer.card.name,
          losingCardName: player.card.name,
        };
      }
      return {};
    }
  },
  [HANDMAID]: {
    name: 'Handmaid',
    skill: 'protect',
    protect: (game, player) => {
      player.protect();
      return {};
    },
  },
  [PRINCE]: {
    name: 'Prince',
    skill: 'redraw',
    redraw: (game, player, data) => {
      const { targetName } = data;
      const target = game._findPlayer(targetName);
      let loserName;
      let losingCardName;
      if (target.card.id === PRINCESS) {
        target.setLost();
        loserName = target.name;
        losingCardName = target.card.name;
      }
      const targetPlayerCardName = target.card.name;
      target.setCard(game.deck.deal());
      return {
        loserName,
        targetPlayerCardName,
        losingCardName,
      };
    },
  },
  [KING]: {
    name: 'King',
    skill: 'swap',
    swap: (game, player, data) => {
      const { targetName } = data;
      if (!targetName) return {};
      const otherPlayer = game._findPlayer(targetName);
      [otherPlayer.card, player.card] = [player.card, otherPlayer.card];
      return {};
    },
  },
  [COUNTESS]: {
    name: 'Countess',
    skill: 'sacrifice',
    sacrifice: () => ({})
  },
  [PRINCESS]: {
    name: 'Princess',
    skill: 'hold',
    hold: (_, player) => {
      player.setLost();
      return {
        loserName: player.name,
        losingCardName: player.card.name,
      }
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
