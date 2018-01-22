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
    this.currentPlayer = null;
    this.currentCard = null;
    this.players = [creater];
    this.deck = new Deck();
  }

  getStats = () => ({
      id: this.id,
      status: this.status,
      currentPlayer: this.currentPlayer ? this.currentPlayer.getData() : null,
      currentCardId: this.currentCard ? this.currentCard.id : null,
      players: this.players.map(player => player.getData()),
      cardNum: this.deck.cards.length,
  })

  process(cmd, player, data) {
    if (CMD_STATUS[cmd].status === this.status) {
      return this[cmd](player, data);
    }
    return null;
  }

  join(player) {
    this.players.push(player);
    return this.getStats();
  }

  ready(selectedPlayer) {
    this.players.forEach(player => {
      if (player.id === selectedPlayer.id) {
        player.isReady = true;
      }
    })
    return this.getStats();
  }

  start() {
    this.status = GAME_STATUS.PLAYING;
    this.deck.setup();

    // deal cards
    this.players.forEach(player => {
      player.card = this.deck.deal();
    });
    this._nextTurnPrepare();
  }

  /**
   * data: { cardId }
   */
  act(player, data) {
    const { cardId } = data;

    // act
    const card = CARD[cardId];
    const miniRoundOver = card.act(this, player, data);

    if (miniRoundOver) {
      if (this._isGameOver()) {
        this.status = GAME_STATUS.OVER;
      } else {
        this.start();
      }
      return this.getStats();
    }

    // deal card to next user
    this._nextTurnPrepare();
  }

  restart(player) {

  }

  exit(player) {

  }

  _nextTurnPrepare() {
    this.currentCard = this.deck.deal();
    this._nextPlayer();
  }

  _findPlayer(playerId) {
    return this.players.find(player => player.id === playerId);
  }

  _nextPlayer() {
    let nextIdx = null;
    if (this.currentPlayer === null) {
      nextIdx = Math.floor(Math.random() * this.players.length);
    } else {
      const idx = this.players.findIndex(
        player => player.id === this.currentPlayer.id);
      nextIdx = (idx + 1 + this.players.length) % this.players.length;
    }

    if (nextIdx !== null) {
      this.currentPlayer = this.players[nextIdx];
    }
  }

  _isGameOver() {
    return true;
  }
}
