import Game from './Game';
import Player from './Player';
import { random4Digit } from './utils/random';

const ROOM_LIMIT = 4;

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
    socket.on('act', this.process('act'));
    socket.on('restart', this.restart);
    socket.on('disconnecting', this.checkForCleanup);
    // socket.on('gaming', (data) => {
    //   if (socket.game) {
    //     const { cmd } = data;
    //     socket.game.processInput(cmd, socket.player ,data);
    //   }
    // });
  }

  act = () => {}
  restart = () => {
    const socket = this.socket;
    if (!socket.game) return;
    socket.game.restart();
    console.log(socket.game);
    console.log('emitting restart');
    this.io.to(socket.game.id).emit('gameStats', socket.game.getStats());
  }
  getGame = () => {
    return game = this.server.game[id];
  }

  createGame = (playerName) => {
    const socket = this.socket;
    const server = this.server;
    const player = socket.player;
    if (socket.game) return;
    let id = random4Digit();
    // const id = '1111';
    let game = server.game[id];
    while (game) {
      id = random4Digit();
      game = server.game[id];
    }
    socket.join(id);
    player.name = playerName;
    socket.game = new Game(id, player, socket);
    server.game[id] = socket.game;
    socket.emit('gameStats', socket.game.getStats());
  }

  joinGame = (data) => {
    const socket = this.socket;
    const server = this.server;
    const player = socket.player;
    if (socket.game) return;
    const { id, name } = data;
    const game = server.game[id];
    if (game) {
      if (game.players.length >= ROOM_LIMIT) {
        socket.emit('joinError', { error: 'Room full.' });
        return;
      }
      socket.join(id);
      player.name = name;
      socket.game = game;
      this.io.to(id).emit('gameStats', game.process('join', player));
    } else {
      socket.emit('joinError', { error: 'Invalid code.' });
    }
  }

  process = (operation) => (data) => {
    const socket = this.socket;
    const player = socket.player;
    const game = socket.game;
    this.io.to(game.id).emit(
      'gameStats',
      game.process(operation, player, data),
    );
  }

  checkForCleanup = () => {
    const socket = this.socket;
    const io = this.io;
    const server = this.server;
    Object.keys(socket.rooms).forEach((roomId) => {
      if (roomId === socket.id) return;
      const room = io.sockets.adapter.rooms[roomId];
      if (room.sockets[socket.id] && room.length === 1) { // if the last client disconnects from the room
        delete server.game[roomId];
      }
    });
  }
}
