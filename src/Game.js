import Deck from './Deck';
export const GAME_STATUS = {
  INIT: 'INIT',
  PLAYING: 'PLAYING',
  OVER: 'OVER',
};

export const commands = {
  JOIN_GAME: {
    status: GAME_STATUS.INIT,
    action: 'join',
  },
  READY: {
    status: GAME_STATUS.INIT,
    action: 'ready',
  },
  START: {
    status: GAME_STATUS.INIT,
    action: 'start',
  },
  ACT: {
    status: GAME_STATUS.PLAYING,
    action: 'act',
  },
  RESTART: {
    status: GAME_STATUS.OVER,
    action: 'restart',
  },
  EXIT: {
    status: GAME_STATUS.OVER,
    action: 'exit',
  }
}

export default class Game {
  constructor(creater, socket) {
    this.socket = socket;
    this.status = GAME_STATUS.INIT;
    this.players = [creater];
    this.deck = new Deck();
  }

  processInput(cmd, player, data) {
    const cmdObj = commands[cmd];
    if (cmdObj && cmdObj.status === this.status) {
      this[cmdObj.action](player, data);
    }
  }

  join(player) {
    this.players.push(player);
  }

  ready(player) {
    this.player.isReady = true;
    const twoToFour = this.players.length > 1 && this.players.length < 5;
    const allReady = this.players.every(player.isReady);
    if (twoToFour && allReady) {
      // notice creater that all players are ready.
    }
  }

  start() {
    this.status = GAME_STATUS.PLAYING;
    this.deck.setup();

    // deal cards

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
