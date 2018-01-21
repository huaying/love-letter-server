import Game from './Game';
import Player from './Player';
import { random4Digit } from './utils/random';

export default class Controller {
  constructor(server, socket) {
    this.server = server;
    this.socket = socket;
    // Needed to be modified
    socket.player = new Player(socket.id);
  }

  listen = () => {
    const socket = this.socket;
    socket.on('create', this.createGame);
    socket.on('join', this.joinGame);
    // socket.on('gaming', (data) => {
    //   if (socket.game) {
    //     const { cmd } = data;
    //     socket.game.processInput(cmd, socket.player ,data);
    //   }
    // });
  }

  createGame = () => {
    const socket = this.socket;
    const server = this.server;
    if (socket.game) return;
    const id = random4Digit();
    const game = server.game[id];
    if (!game) {
      socket.join(id);
      socket.game = new Game(socket.player, socket);
      server.game[id] = socket.game;
      socket.emit('gameCreated', { gameData: { gameId: id } });
      socket.emit('playersChange', [
          {
            id: 5,
            name: 'Burfie',
          },
        ]
      );
    }
  }

  joinGame = (data) => {
    const socket = this.socket;
    const server = this.server;

    if (socket.game) return;
    const { id } = data;
    const game = server.game[id];
    if (game) {
      socket.join(id);
      game.processInput('JOIN_GAME', socket.player);
      socket.game = game;
      socket.emit('playersChange', { players: [
        {
          id: 5,
          name: 'Burfie',
        },
        {
          id: 3,
          name: 'Lard',
        }
      ] });
    }
  }
}
