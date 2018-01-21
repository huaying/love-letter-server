import express from 'express';
import morgan from 'morgan';
import SocketIO from 'socket.io';
import Controller from './Controller';

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
  new Controller(server, socket, io).listen();
};

io.on('connection', onConnection);
