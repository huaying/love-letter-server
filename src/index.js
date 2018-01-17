import express from 'express';
import morgan from 'morgan';
import SocketIO from 'socket.io';
import Game from './Game';
import Player from './Player';
import { random4Digit } from './utils/random';

const app = express();

// logger
app.use(morgan('dev'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

const server = app.listen(process.env.PORT || 3000, () => {
	console.log(`Started on port ${server.address().port}`);
});

const io = SocketIO(server);
server.game = {};

const onConnection = (socket) => {
  socket.player = new Player(socket.id);
  socket.on('create', () => {
    if (socket.game) return;
    const id = random4Digit();
    const game = server.game[id];
    if (!game) {
      socket.join(id);
      socket.game = new Game(socket.player, socket);
      server.game[id] = socket.game;
    }
  });

  socket.on('join', (data) => {
    if (socket.game) return;
    const { id } = data;
    const game = server.game[id];
    if (game) {
      socket.join(id);
      game.processInput('JOIN_GAME', socket.player);
      socket.game = game;
    }

  });

  socket.on('gaming', (data) => {
    if (socket.game) {
      const { cmd } = data;
      socket.game.processInput(cmd, socket.player ,data);
    }
  });
};

io.on('connection', onConnection);
