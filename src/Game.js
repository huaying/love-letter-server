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
    this.history = [];
  }

  getStats = () => ({
      id: this.id,
      status: this.status,
      currentPlayer: this.currentPlayer ? this.currentPlayer.getData() : null,
      currentCardId: this.currentCard ? this.currentCard.id : null,
      players: this.players.map(player => player.getData()),
      cardNum: this.deck.cards.length,
      history: this.history,
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
    return this.getStats();
  }

  /**
   * data: { cardId }
   */
  act(player, data) {
    const { changeHand } = data;

    // act
    const chosenCard = (changeHand) ? player.card : this.currentCard;
    if (changeHand) {
      player.card = this.currentCard;
    }
    console.log('Player', player, 'is playing', chosenCard);
    console.log(data);
    const result = chosenCard.act(this, player, data);
    const id = this.history.length;
    console.log(result);
    this.history.push({
      id,
      player,
      chosenCard,
      data,
      result,
    });
    if (this._miniRoundOver()) {
      if (this._isGameOver()) {
        console.log('Game over');
        this.status = GAME_STATUS.OVER;
      } else {
        this.start();
      }
      return this.getStats();
    }

    // deal card to next user
    this._nextTurnPrepare();
    return this.getStats();
  }

  restart(player) {
    this.currentPlayer = null;
    this.currentCard = null;
    this.deck = new Deck();
    this.history = [];
    this.players.forEach(player => player.reset());
    this.start();
  }

  exit(player) {

  }

  _miniRoundOver = () => {
    if (this.deck.isEmpty()) return true;
    return this.players.filter(player => player.lost === false).length === 1;
  }


  _nextTurnPrepare() {
    this.currentCard = this.deck.deal();
    this._nextPlayer();
  }

  _findPlayer(playerName) {
    return this.players.find(player => player.name === playerName);
  }

  _nextPlayer() {
    let nextIdx = null;
    if (this.currentPlayer === null) {
      nextIdx = Math.floor(Math.random() * this.players.length);
    } else {
      const idx = this.players.findIndex(
        player => player.id === this.currentPlayer.id);
      nextIdx = (idx + 1) % this.players.length;
      while (this.players[nextIdx].lost) {
        nextIdx = (nextIdx + 1) % this.players.length;
      }
    }
    if (nextIdx !== null) {
      this.currentPlayer = this.players[nextIdx];
      this.currentPlayer.unprotect();
    }
  }

  _isGameOver() {
    return true;
  }
}
