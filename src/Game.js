import Deck from './Deck';
export const GAME_STATUS = {
  INIT: 'INIT',
  PLAYING: 'PLAYING',
  OVER: 'OVER',
};

export const CMD_STATUS = {
  join: {
    status: GAME_STATUS.INIT,
  },
  ready: {
    status: GAME_STATUS.INIT,
  },
  start: {
    status: GAME_STATUS.INIT,
  },
  act: {
    status: GAME_STATUS.PLAYING,
  },
  restart: {
    status: GAME_STATUS.OVER,
  },
  exit: {
    status: GAME_STATUS.OVER,
  }
}

export default class Game {
  constructor(id, creater) {
    this.id = id;
    this.status = GAME_STATUS.INIT;
    this.players = [creater];
    this.deck = new Deck();
  }

  getStats = () => {
    return {
      status: this.status,
      players: this.players.map(player => player.data()),
      cardNum: this.deck.cards.length,
    }
  }

  process(cmd, player, data) {
    if (CMD_STATUS[cmd].status === this.status) {
      return this[cmd](player, data);
    }
    return null;
  }

  join(player) {
    this.players.push(player);
    return this.players.map(player => player.data());
  }

  ready(selectedPlayer) {
    this.players.forEach(player => {
      if (player.id === selectedPlayer.id) {
        player.isReady = true;
      }
    })
    return this.players.map(player => player.data());
  }

  start() {
    this.status = GAME_STATUS.PLAYING;
    this.deck.setup();

    // deal cards
    return this.players.map(player => {
      player.card = this.deck.deal();
      return player.data();
    });
  }

  /**
   * data: { cardId }
   */
  act(player, data) {
    const { cardId } = data;

    // act
    const card = CARD[cardId];
    const sessionIsEnd = card.act(this, player, data);

    if (sessionIsEnd) {
      if (this.isGameOver()) {
        this.status = GAME_STATUS.OVER;
      } else {
        this.start();
      }
      return;
    }

    // deal card to next user
    // this.deck.deal();
  }

  restart(player) {

  }

  exit(player) {

  }

  isGameOver() {

  }
}
