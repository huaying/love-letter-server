import Game from './Game';
import Player from './Player';
import { random4Digit } from './utils/random';

export default class Controller {
  constructor(server, socket, io) {
    this.server = server;
    this.socket = socket;
    this.io = io;
    // Needed to be modified
    socket.player = new Player(socket.id);
  }

  listen = () => {
    const socket = this.socket;
    socket.on('create', this.createGame);
    socket.on('join', this.joinGame);
    socket.on('ready', this.process('ready'));
    socket.on('start', this.process('start'));
    socket.on('act', this.act);
    socket.on('restart', this.restart);
    // socket.on('gaming', (data) => {
    //   if (socket.game) {
    //     const { cmd } = data;
    //     socket.game.processInput(cmd, socket.player ,data);
    //   }
    // });
  }

  act = () => {}
  restart = () => {}
  getGame = () => {
    return game = this.server.game[id];
  }

  createGame = (playerName) => {
    const socket = this.socket;
    const server = this.server;
    const player = socket.player;
    if (socket.game) return;
    const id = random4Digit();
    const game = server.game[id];
    if (!game) {
      socket.join(id);
      player.name = playerName;
      socket.game = new Game(id, player, socket);
      server.game[id] = socket.game;
      socket.emit('gameStats', {
        game: game.getStats()
      });
    }
  }

  joinGame = (data) => {
    const socket = this.socket;
    const server = this.server;
    const player = socket.player;
    if (socket.game) return;
    const { id, name } = data;
    const game = server.game[id];
    if (game) {
      socket.join(id);
      player.name = name;
      socket.game = game;
      this.io.to(id).emit('gameStats', {
        game: game.process('join', player)
      });
    }
  }

  process = (data) => (operation) => {
    const socket = this.socket;
    const player = socket.player;
    const game = socket.game;
    this.io.to(game.id).emit('gameStats', {
      game: game.process(operation, player, data)
    });
  }

}
